---
title: "Building a Real-Time Admin Control Panel for a Raspberry Pi Web Server"
date: "2026-06-24"
tags: ["DevOps", "Raspberry Pi", "Nginx", "Linux", "Dashboard", "Bash", "JavaScript"]
category: "TECH"
excerpt: "Designing and deploying a pure-static 8-page admin suite on a resource-capped Pi 5 — with a BTOP-inspired system monitor, journalctl-based activity timeline, and a JSON pipeline that doesn't shatter when Windows touches it."
---

## The Problem

The Pi 5 was already running Nginx with 8 project routes, a Minecraft server, and two bore tunnels — all within a 256MB memory limit and 1-core CPUQuota. There was no way to see what was actually happening on the server without SSHing in and running a dozen commands.

I needed a lightweight admin control panel that could:

- Show real-time CPU, memory, and disk stats at a glance
- Track SSH logins and failed attempts across time
- Display systemd service health
- Present a searchable reports gallery
- Do all of this **without** adding a database, a cron daemon, or any runtime heavier than static files

## The Solution

A pure-static 8-page admin panel, served entirely by Nginx, with data collected by a single shell script (`refresh.sh`) triggered manually or on demand. No cron, no daemon, no database.

### Architecture

```
┌─ Windows (192.168.1.234) ─────────────────────┐
│  SCP via SSH key → Pi                          │
│  Python HTTP server (port 8081) for reports    │
│  deploy-to-pi.ps1 (tar + scp + ssh)            │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─ Pi 5 (192.168.1.219) ─────────────────────────┐
│  Nginx → /var/www/project2jarvis/               │
│    ├── admin/index.html   (Command Center)      │
│    ├── admin/pages/*.html (7 sub-pages)         │
│    ├── admin/data/*.json  (from refresh.sh)     │
│    └── admin/js/data-loader.js (upgrade door)   │
└─────────────────────────────────────────────────┘
```

Key design decisions:

- **Data-loader.js contract**: Every page fetches JSON through a central module. Switching from static files to a CGI script or API later means changing one URL map, not 8 pages.
- **No cron, no daemon**: Data updates only when `refresh.sh` runs. Zero wasted CPU cycles.
- **jq for JSON**: Every data file is built with `jq -n` and `--arg` flags — no heredoc string interpolation that can break on special characters.
- **Passwordless sudo**: `chown sana:sana /var/www/` + `/etc/sudoers.d/sana-nopasswd` eliminated sudo from the deploy pipeline entirely.

### Milestone 1: Command Center & Reports

The first deploy established the foundation: an index page with 6 live stat cards (services up/down, disk usage, UFW blocks, tunnel status) and a reports gallery with search, category filtering, and an iframe-based report viewer proxied from the Windows machine.

### Milestone 2: Services & Data Fixes

All six sub-pages were built — Minecraft status, tunnels, services, projects and activity placeholders. More importantly, the `refresh.sh` JSON generation was rewritten from fragile heredocs to jq-based construction, eliminating the "invalid JSON" errors that had been silently breaking the dashboard cards.

### Milestone 3: Activity Timeline with Journalctl

The activity page became the most technically interesting. Since Pi OS Lite doesn't have the `last` command, SSH login tracking had to use `journalctl`:

```bash
journalctl -u ssh.service --since '48 hours ago' --no-pager | \
  grep 'Accepted publickey\|Accepted password' | \
  sed -n 's/.*Accepted publickey for \([^ ]*\) from \([^ ]*\) port.*/\1 \2/p'
```

The page renders a colour-coded card-feed timeline (green for info, red for SSH failures, yellow for UFW blocks), a detailed SSH login table, and a UFW blocks section showing blocked IPs and ports.

### Milestone 4: BTOP-Inspired System Monitor

The crown jewel — a terminal-aesthetic system stats page inspired by BTOP:

```
┌─────────────────────────────────────┐
│  ● ● ●  SYSTEM STATS                │
├─────────────────────────────────────┤
│  CPU: [████████░░░░░░░░░░] 28.3%    │
│  RAM: [████████████░░░░░░] 62.1%   │
│  DSK: [██████░░░░░░░░░░░░] 31.8%   │
├─────────────────────────────────────┤
│  PID  USER     CPU%  MEM%  COMMAND  │
│  1017 mc        45.2  12.8  java     │
│  985  nginx      0.3   1.2  nginx    │
│  ...                                 │
└─────────────────────────────────────┘
```

Near-black background (`#0a0a0a`), green (`#00ff41`) and cyan (`#00ffff`) text, JetBrains Mono throughout. CPU gauges use coloured fills (green < 50%, yellow < 80%, red above), and the process table shows real `ps aux` data sorted by CPU usage.

### The Reports Proxy Bridge

Reports are generated on Windows (HTML files in `07_Reports/output/`) and served through a two-hop path:

```
Browser → Nginx (/reports-files/{name})
        → proxy_pass http://192.168.1.234:8081/{name}
        → Python http.server on Windows
```

This replaced a broken SMB guest auth setup. The Windows Python server runs as a scheduled task with auto-restart.

## Key Results

- **8-page admin panel** — all pages served, all returning HTTP 200
- **~5MB total footprint** on disk — no database, no runtime dependencies
- **Journalctl-based activity tracking** — SSH logins, failed attempts, UFW blocks, all via systemd journal
- **BTOP-inspired system monitor** — CPU/RAM/disk gauges, top 10 processes, network interface stats
- **Passwordless sudo deploy** — one SCP command, one tar extraction, zero prompts
- **JSON pipeline hardened** — BOM+CRLF stripped, jq-guaranteed valid JSON, every file passes `python3 -m json.tool`

## Pain Points & Lessons

1. **PowerShell quoting is the #1 enemy**: Characters like `|`, `$`, and `"` in SSH commands get mangled by the PowerShell parser before they ever reach bash. The fix: write scripts to a temp file, SCP them to the Pi, execute, clean up. Don't try inline SSH commands for anything non-trivial.

2. **`jq` over heredocs, always**: Building JSON with string interpolation in heredocs is a bug farm — one unescaped character and your entire dashboard breaks. `jq -n --arg/--argjson` guarantees valid JSON regardless of input weirdness.

3. **GNU sed doesn't do `\n`**: In the replacement string, `\n` is literal. Use `a\` append or Python for multi-line edits.

4. **BOM + CRLF prevention**: Every JSON file from Windows needs `sed -i '1s/^\xEF\xBB\xBF//' && sed -i 's/\r$//'` before validation on the Pi.

5. **`last` is not on Pi OS Lite**: Use `journalctl -u ssh.service` instead.

## What's Next

The admin panel is functional but there are clear upgrade paths:

- **Auto-refresh**: Set `refreshInterval` on dashboard widgets for live data
- **Real graph data**: Replace static 7-point samples with hour/daily aggregations
- **OpenCode dashboard**: A Vite React dashboard with go-chi backend and Notion heartbeat that's ready to deploy once the build pipeline issue is resolved
- **Auth**: Simple htpasswd + Nginx, or Cloudflare Tunnel + Access, or Tailscale funnel

## Takeaways

1. **Static doesn't mean dumb**. An 8-page admin panel with live data, search, and visualizations runs on zero infrastructure costs — no database, no daemon, no cloud dependencies.
2. **The upgrade door pattern works**. `data-loader.js` means every page can switch from static JSON to API without touching the HTML.
3. **Test on the real system early**. `last` not being available, journalctl output differences, and resource limits are things you only discover by deploying and iterating.
4. **Windows↔Linux pipelines need hardening**. BOM, CRLF, PowerShell quoting — every boundary crossing is an opportunity for subtle breakage.
5. **A little terminal aesthetic goes a long way**. The BTOP-inspired page with green-on-black gauges and monospace text is consistently the most commented-on part of the panel.
