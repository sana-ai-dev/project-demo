---
title: "Making Minecraft Multiplayer Work: A DevOps Deep Dive on Raspberry Pi"
date: "2026-06-23"
tags: ["DevOps", "Raspberry Pi", "Linux", "Networking", "Minecraft", "System Design"]
category: "TECH"
excerpt: "Setting up a PaperMC server on a Raspberry Pi 3B with 1 GB RAM, adding Bedrock crossplay via Geyser, then exposing it to the internet with a free TCP tunnel — every step was a lesson in working within constraints."
---

## The Problem

Run a cross-platform Minecraft server on Raspberry Pi hardware — accessible from anywhere, at zero cost, with Java and Bedrock players playing together.

Hard constraints:
- **Pi 3B**: 1 GB RAM, ARM Cortex-A53, SD card storage
- **Pi 5**: 4 GB RAM (planned upgrade path)
- **No domain name**: so Cloudflare Tunnel was out
- **No budget**: everything must be free

## Phase 1: Server Setup on Pi 3B

The first server was a PaperMC 26.2 instance on a Raspberry Pi 3B — a machine with roughly the computational budget of a modern smartphone from 2016.

### The Memory War

PaperMC's default JVM flags assume unlimited resources. On 1 GB total RAM, with the OS already consuming baseline resources, Java had to be aggressively restrained:

```
Initial:  Xmx=600M  →  Pi OOM-crashed within 30 minutes
Attempt:  Xmx=500M  →  Still unstable, SSH became unresponsive
Final:    Xmx=350M  →  Stable at 869 MiB used / 35 MiB available
```

The final JVM configuration:
```
java -Xms256M -Xmx350M -XX:+UseG1GC \
     -XX:+ParallelRefProcEnabled \
     -XX:MaxGCPauseMillis=200 \
     -XX:G1HeapWastePercent=5 \
     -XX:G1MixedGCCountTarget=4 \
     -XX:G1HeapRegionSize=8M \
     -jar paper.jar --nogui
```

Every flag mattered. G1GC with aggressive pause targets, parallel reference processing, and a 8 MB heap region size — tuned specifically for a machine that can't spare a single megabyte.

### The Geyser Showstopper

Geyser-Spigot (the plugin that lets Bedrock Edition players join Java servers) had a version compatibility problem. The official release (2.10.1) called an API method that Paper 26.2 had removed:

```
NoSuchMethodError: asBukkitCopy(CraftItemStack) — removed in Paper 26.2 API
```

The fix: download a development CI build from Geyser's `feature/26.2` branch (commit 99c6b56). A pre-release 2.11.0-SNAPSHOT that hadn't been formally published yet.

Other issues solved along the way:
- **Stale config.yml** — Geyser's v7 config was incompatible with the new build; had to delete it and let Geyser regenerate
- **Packet rate limiting** — Paper's default 10 pps cap kicked legitimate Bedrock clients; `rate-limit: 0` in spigot.yml
- **Floodgate auth** — Bedrock clients (like iPads) can't do Mojang auth; `auth-type: floodgate` was the switch
- **SD card wear** — `noatime` mount + tmpfs for logs to extend the SD card's lifespan

### Systemd Hardening

The server runs as a systemd service with:
- `Restart=always` with 5-second delay
- Health check script every 5 minutes
- sysctl tuning (swappiness=10, dirty_ratio=5, vfs_cache_pressure=50)
- UFW firewall with fail2ban SSH jail

## Phase 2: Internet Exposure

With the server running on the local network, the next challenge was making it accessible from outside.

### playit.gg: False Start

playit.gg is purpose-built for game server tunneling. It looked perfect — the daemon was installed, claimed, and verified. But the free tier only supports **UDP tunnels**. Minecraft Java Edition uses **TCP** on port 25565, which requires a paid plan.

### bore.pub: The Winning Solution

[bore](https://github.com/ekzhang/bore) is a dead-simple TCP tunnel tool by Eric Zhang (8k+ GitHub stars). One static binary, no accounts, no domains, no configuration:

```bash
bore local 25565 --to bore.pub
```

The public `bore.pub` server assigns a random port and forwards all TCP traffic. Under 20 minutes from decision to a working tunnel:

| Phase | Action | Time |
|-------|--------|------|
| 1 | playit.gg disabled | 13:16 |
| 2 | bore v0.6.0 ARM64 binary installed | 13:16 |
| 3 | systemd service created (auto-restart) | 13:17 |
| 4 | Minecraft ping test passed | 13:17 |
| 5 | Mobile data confirmation | 13:18 |

### The Port-Change Tradeoff

bore.pub assigns a new random port on each restart. The tradeoff is worth it for a free solution, and the systemd service handles it gracefully:

```bash
ssh minecraft.local "journalctl -u bore | grep 'listening at'"
```

## The Cross-Platform Stack

The final architecture serves both Java and Bedrock clients:

```
              Internet
                 │
          bore.pub:28298 (TCP)
                 │
       ┌─── Raspberry Pi ────┐
       │  bore (systemd)      │
       │      │               │
       │  PaperMC 26.2        │
       │  Port 25565 (Java)   │
       │      │               │
       │  Geyser-Spigot       │
       │  Port 19132 (Bedrock)│
       └──────────────────────┘
```

- **Java Edition**: Connect via `bore.pub:28298`
- **Bedrock Edition**: Connect via `thu-emotions.gl.at.ply.gg:38124`
- **Authentication**: Floodgate handles Bedrock auth transparently
- **Both editions**: Play on the same world, see each other in-game

## Key Results

- **PaperMC 26.2 running stable** on Pi 3B with 350 MB Xmx (from 905 MB total RAM)
- **Cross-platform play** enabled — Java and Bedrock on the same world via Geyser 2.11.0-SNAPSHOT
- **Zero-cost public tunnel** via bore.pub — no domain, no account, no subscription
- **Full systemd integration** — auto-start, auto-restart, health checking
- **Mobile data confirmed** — players joined from outside the local network
- **Server performance tuned** — noatime, tmpfs, sysctl, fail2ban, UFW

## Takeaways

1. **Resource constraints force better decisions.** Having only 350 MB Java heap made me understand every single JVM flag. I'd never have learned G1GC internals on a cloud server with 16 GB.

2. **CI builds are underrated.** When a stable release breaks, check the project's CI artifacts. The Geyser `feature/26.2` branch saved the day — a build that never made it to a formal release.

3. **Free tiers have hidden walls.** playit.gg looks free until you need TCP. Reading the fine print early saves hours of debugging.

4. **The simplest tool is often the best.** bore is one binary, one command, zero config. It beat every more "sophisticated" alternative.

5. **Systemd is your friend.** Auto-restart, boot-time enable, logging — a 10-line unit file replaces fragile screen/tmux sessions.
