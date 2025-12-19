# 🛰️ Celestial GPS Validator

> GPS integrity validation through multi-sensor celestial consensus

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zefparis/celestial-gps)

## 🌟 Overview

Celestial GPS Validator is a Progressive Web App that validates GPS position integrity by cross-referencing it with real celestial observations. Using multi-sensor consensus algorithms, it can detect GPS spoofing attacks with high accuracy.

![Celestial GPS Demo](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🔐 GPS Anti-Spoofing** - Detects GPS spoofing attacks by comparing with celestial observations
- **☀️ Solar Position Tracking** - VSOP87 algorithm via astronomy-engine for precise sun calculations
- **🧭 Magnetic Validation** - IGRF-13 geomagnetic model for compass heading verification
- **🌐 3D Celestial Dome** - Interactive Three.js visualization of the sky
- **📊 Real-time Analytics** - Integrity scoring and historical analysis with Recharts
- **🧪 7 Test Scenarios** - Simulated conditions (urban canyon, spoofing attack, etc.)
- **🌍 Multilingual** - Full French and English support
- **📱 Mobile-First PWA** - Optimized for smartphones with sensor access

## 🏗️ Architecture

```
src/
├── components/ui/          # Reusable UI components (Button, Card, Gauge, etc.)
├── features/
│   ├── onboarding/         # Welcome, Permissions screens
│   ├── dashboard/          # Main dashboard, Live Validation
│   ├── celestial/          # 3D Celestial Dome (Three.js)
│   ├── scenarios/          # Test scenarios runner
│   ├── analysis/           # History & analytics
│   └── sensors/            # GPS, Magnetometer, Barometer hooks
├── stores/                 # Zustand state management
├── lib/
│   ├── celestial/          # Solar engine, IGRF-13 magnetic model
│   └── validation/         # Consensus algorithm
├── i18n/                   # FR/EN translations
├── types/                  # TypeScript type definitions
└── styles/                 # Tailwind CSS + Cyberpunk theme
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 4.0 |
| State | Zustand |
| 3D Graphics | Three.js + React Three Fiber |
| Charts | Recharts |
| Astronomy | astronomy-engine (VSOP87) |
| i18n | i18next |
| Animations | Framer Motion |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/zefparis/celestial-gps.git
cd celestial-gps

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 📱 Usage

1. **Welcome Screen** - Start the experience
2. **Grant Permissions** - Allow GPS, motion sensors, and compass access
3. **Live Validation** - Monitor real-time GPS integrity score
4. **Test Scenarios** - Run simulated spoofing detection tests
5. **History** - Review past validation sessions

## 🎨 Design System

The app features a **cyberpunk-inspired** dark theme with:

- **Primary**: Cyan (#00D4FF)
- **Secondary**: Electric violet (#6366F1)
- **Accent**: Neon pink (#FF3366)
- **Background**: Deep void (#0A0A0F)
- **Glass effects**: Frosted glass UI elements
- **Glow animations**: Pulsing neon effects

## 🔬 Validation Algorithm

The consensus algorithm compares multiple data sources:

| Source | Weight | Description |
|--------|--------|-------------|
| GPS | 25% | Declared position |
| Sun Position | 30% | Calculated vs observed azimuth/elevation |
| Magnetometer | 20% | Magnetic heading vs IGRF-13 model |
| Barometer | 10% | Altitude cross-check |
| Stars | 15% | Night-time stellar navigation |

**Integrity Score:**
- 🟢 **85-100%** - NOMINAL (GPS validated)
- 🟡 **60-84%** - DRIFT (minor discrepancy)
- 🟠 **40-59%** - UNCERTAIN (verification needed)
- 🔴 **0-39%** - SPOOFING (attack detected)

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zefparis/celestial-gps)

### Manual

```bash
npm run build
# Deploy the `dist` folder to any static host
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**IA-SOLUTION**

---

<p align="center">
  <b>🛰️ Trust the sky, not the signal 🌌</b>
</p>
