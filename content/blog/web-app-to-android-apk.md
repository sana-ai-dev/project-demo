---
title: "From Web App to Mobile APK: Building OW2 Hero Picker for Android"
date: "2026-05-14"
tags: ["Android", "Capacitor", "APK", "Mobile", "Ionic", "WebView"]
category: "TECH"
excerpt: "Converted the OW2 Hero Picker web app into a native Android APK using Capacitor, covering the full build pipeline from web code to installable mobile app."
---

## The Goal

Take the existing OW2 Hero Picker web app (HTML/CSS/JS) and package it as a **native Android APK** — installable on any Android phone without going through the Google Play Store.

## The Approach

Used **Capacitor** (from the Ionic team) — the modern standard for wrapping web apps in a native WebView container. No framework rewrite, no React Native migration, no Kotlin.

### Build Pipeline

```
dist/ (static web files)
    → npx cap init
    → npx cap add android
    → npx cap sync android
    → cd android && gradlew assembleDebug
    → OW2-Hero-Picker.apk (4.85 MB)
```

The entire pipeline takes about 5 minutes from start to finish.

### Project Structure

```
OW2-Hero-Picker/
├── dist/                    # Static web assets
├── capacitor.config.json    # Capacitor config
├── package.json             # Dependencies
├── android/                 # Full Android Studio project (auto-generated)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/        # Generated Java bridge
│   │   │   └── res/         # Icons, splash screen assets
│   │   └── build.gradle     # Android build config
│   ├── local.properties     # SDK path
│   └── gradlew              # Gradle wrapper
└── OW2-Hero-Picker.apk      # Built APK (4.85 MB)
```

## Key Configurations

### capacitor.config.json

```json
{
  "appId": "com.sanaai.ow2picker",
  "appName": "OW2 Hero Picker",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  }
}
```

### Build Environment

- **Android SDK** — 34 (target), 33 (compile)
- **Gradle** — 8.x wrapper
- **Capacitor** — latest stable
- **Min SDK** — 22 (Android 5.1+)

## App Features

The packaged app brings all web features to mobile:

- **Hero grid** with role filtering (DPS, Support, Tank, Flex)
- **Comp synergy calculator** — suggests the optimal 6th hero
- **Hitscan support detection** — marks which heroes are hitscan
- **Hero stats** with perks, map strength, and counter picks
- **Responsive design** — works on any screen size
- **Dark theme** — matches OW2 aesthetic

## Next Steps for Production

| Task | Status |
|------|--------|
| Replace default Capacitor icon | Pending |
| Custom splash screen | Pending |
| Release signing (keystore + jarsigner) | Pending |
| ProGuard optimization (target <3MB) | Pending |
| Google Play Store listing | Pending |

## Handoff Instructions

```
# Install on Android phone
Copy OW2-Hero-Picker.apk → phone → tap to install
(Enable "Unknown Sources" in Settings first)

# Update web content
Modify files in dist/ → npx cap sync android

# Rebuild APK
cd android && gradlew assembleDebug

# Open in Android Studio for visual editing
npx cap open android
```

## Key Results

- **4.85 MB APK** — installable on any Android 5.1+ device
- **Full app functionality** — all web features work offline in the WebView
- **5-minute build pipeline** from web changes to new APK
- **No framework rewrite** — same HTML/CSS/JS codebase

## Takeaways

1. **Capacitor is the simplest path to mobile.** No React Native, no Flutter — just a WebView wrapper.
2. **APK size matters.** 4.85 MB is reasonable but ProGuard can bring it under 3 MB.
3. **Side-loading is the fastest feedback loop.** No Play Store review for testing.
4. **Keep the web app as source of truth.** `npx cap sync android` is a one-way sync — web changes flow to mobile automatically.
