---
title: "How to Join Our Minecraft Server: Java & Bedrock Guide"
date: "2026-06-23"
tags: ["Minecraft", "Server", "Tutorial", "Gaming", "Java", "Bedrock"]
category: "TECH"
excerpt: "Step-by-step guide for friends to join our cross-platform Minecraft server — Java Edition (PC/Mac/Linux) and Bedrock Edition (phone/tablet/console) both supported with no mods needed."
---

## The Problem

Setting up a Minecraft server on a Raspberry Pi 5 is one thing — getting friends to actually connect is another. Port forwarding is complicated, IP addresses change, and most tunnel services require paid subscriptions or technical know-how.

I needed a way for anyone — especially younger players on phones, tablets, and consoles — to join without hassle. No mods, no port forwarding, no domain names.

## The Solution: Two Tunnels, One Server

The server runs on a Raspberry Pi 5 at home with **PaperMC** + **Geyser** + **Floodgate**. This means both Java and Bedrock players play together in the same world — no separate accounts needed.

For public access, I set up two free tunnels:

| Edition | Tunnel Type | Service | Cost |
|---------|-------------|---------|------|
| Java (PC/Mac/Linux) | TCP tunnel | **bore** (`bore.pub`) | Free |
| Bedrock (phone/tablet/console) | Minecraft Bedrock tunnel | **playit.gg** | Free |

### How It Works

- **Java players** connect to `bore.pub` with a port number — bore forwards the connection to the Pi on port 25565
- **Bedrock players** connect to a playit.gg address — playit forwards UDP traffic to Geyser on port 19132
- Both editions share the same world and can see each other in-game

Both services are configured as systemd services on the Pi, so they auto-start on boot and auto-restart if they crash.

## How to Join (Bedrock Edition)

For **phone, tablet, console, or Windows 10/11** Minecraft:

1. Open Minecraft Bedrock Edition
2. Tap **Play** → **Servers** tab
3. Scroll down and tap **Add Server**
4. Enter:
   - **Server Name**: Whatever you want
   - **Server Address**: `thu-emotions.gl.at.ply.gg`
   - **Port**: `38124`
5. Tap **Save**, then tap the server to join

That's it. Works on mobile data too — no Wi-Fi required.

## How to Join (Java Edition)

For **PC, Mac, or Linux** Minecraft Java Edition:

1. Open Minecraft Java Launcher
2. Click **Multiplayer** → **Add Server**
3. Enter:
   - **Server Name**: Whatever you want
   - **Server Address**: `bore.pub:28298`
4. Click **Done**, then double-click the server to join

**Note:** The Java port may change if the server restarts. If you can't connect, just ask for the current port.

## Server Rules (Keep It Fun)

- Be kind — no bullying or toxic behaviour
- No griefing — respect other players' builds
- No hacked clients — play fair
- No spamming in chat
- Have fun!

## Key Technical Decisions

| Decision | Why |
|----------|-----|
| **bore for Java** | Free, no account needed, single binary, works without a domain |
| **playit.gg for Bedrock** | Free tier supports Minecraft Bedrock (UDP) specifically |
| **Geyser + Floodgate** | Lets Java and Bedrock players play together; Floodgate removes the need for a Java account on Bedrock |
| **systemd services** | Both tunnels auto-start on boot and survive a Pi reboot |

## Key Results

- **Two free tunnels** — zero ongoing cost
- **Cross-platform** — Java and Bedrock players share one world
- **Kid-friendly setup** — Bedrock connects in under 30 seconds from a phone
- **Auto-recovery** — both services restart automatically on failure or reboot

## Takeaways

1. **Free != limited.** Both bore and playit.gg have generous free tiers that work well for small friend servers.
2. **Geyser makes cross-play trivial.** Ten minutes of config and Java + Bedrock players coexist seamlessly.
3. **Systemd is your friend.** Two service files and the Pi runs itself — no manual restarting tunnels.
4. **A simple join guide saves support questions.** The HTML guide (big fonts, screenshots of the steps) means friends can connect without help.
