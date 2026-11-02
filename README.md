# GP-Dashboard 🏁

> **The Ultimate Real-Time Live Timing, Telemetry & 3D Analytics Platform for MotoGP™**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.173-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## ⚡ Overview

**GP-Dashboard** is a modern, high-performance web analytics and telemetry platform engineered specifically for MotoGP™ fans, data engineers, and motorsport enthusiasts. Inspired by elite Formula 1 timing suites, GP-Dashboard bridges the gap in premier-class motorcycle racing with instant sector telemetry, interactive 3D WebGL circuits, Michelin tyre compound wear models, and official Dorna Pulselive API synchronization.

---

## 🌟 Key Features

- ⏱️ **Live Timing Suite:** Real-time sector splits (T1–T4 color-coded purple for best overall, green for personal best, and yellow), speed traps, pit indicators, gap to leader, and gap to ahead.
- 📺 **TV Broadcast Delay Buffer:** Synchronize telemetry data with television, VideoPass, or streaming broadcasts with a configurable 0 to 120-second circular memory buffer.
- 🌐 **Interactive 3D Circuit Canvas:** Powered by Three.js WebGL with authentic track elevation splines, racing curbs, animated bike tracking, and multiple camera views (*Overview Orbit*, *Top-Down Tactical*, *Helicopter*, *Chase Cam*).
- 🏍️ **2026 MotoGP Grid & Team Paddock:** Full rider directory, constructor rosters, team garages, bike livery colorways, and dedicated team deep-dive profiles.
- 📊 **Race Pace & Degradation:** Lap-by-lap pace distribution boxplots and Michelin tyre compound matrices (Soft, Medium, Hard).
- 📐 **Lean Telemetry & Braking Zones:** Apex lean angle telemetry gauges (up to 68° lean), deceleration forces, and speed trap benchmarks.
- ⚔️ **Head-to-Head Battles:** Micro-sector comparisons across T1–T4 and career milestone tallies between any two riders on the grid.
- 🏆 **World Championship Standings:** Real-time Rider, Team, and Constructor standings with historical points progression charts.
- 💥 **Gravel Trap Championship:** Dedicated crash damage ledger, fall counts, and repair cost estimations across the season.
- 📜 **Historical Archive:** Grand Prix winners, world titles, and technical eras dating from 1949 to the present day.
- 🎨 **Apex Design System:** Precision dark motorsport UI inspired by BMW M architecture, clean Sora geometric typography, reflective glassmorphism cards, and fluid Framer Motion animations.

---

## 🔒 Security & Architecture

- **Zero-Secret Client Exposure:** All external data requests flow through Next.js Edge API routes (`/api/motogp/...` and `/api/live`), shielding upstream endpoints and preventing rate-limit blocks.
- **Edge Caching & Performance:** Implements `stale-while-revalidate` caching headers, ensuring sub-second response times worldwide.
- **Strict Environment Safety:** Environment files (`.env*`) and local development caches are strictly ignored in `.gitignore`.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19, Server Components)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom motorsport racing palette (asphalt, neon cyan, purple, crimson)
- **3D Graphics:** [Three.js](https://threejs.org/) (WebGL Splines, Ambient & Directional Lighting, Smooth Camera Interpolation)
- **UI & Motion:** [Radix UI Primitives](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/), [HugeIcons](https://hugeicons.com/), [Lucide React](https://lucide.dev/)
- **Data Engine:** Pulselive MotoGP API (`api.motogp.pulselive.com/motogp/v1`) & Dorna Classification Ingestion Gateway

---

## 📂 Project Structure

```text
GP-Dashboard/
├── app/                      # Next.js App Router routes
│   ├── api/                  # Edge API routes (live timing & MotoGP proxy)
│   ├── braking-zones/        # Braking zones & deceleration analytics
│   ├── design-system/        # Apex Design System token & component showcase
│   ├── gravel-trap/          # Crash damage & fall statistics
│   ├── head-to-head/         # Rider vs rider comparisons
│   ├── history/              # Historical champions & eras
│   ├── lean-telemetry/       # Extreme lean-angle telemetry
│   ├── live-timing/          # Live timing suite & TV sync buffer
│   ├── race-pace/            # Stint pace boxplots & tyre degradation
│   ├── riders/               # 2026 MotoGP riders grid
│   ├── schedule/             # 2026 calendar, race weekends & circuits
│   ├── standings/            # Riders, Constructors & Teams championships
│   ├── teams/                # Team paddocks & garage detail views
│   ├── track-map/            # 2D & 3D Interactive circuit maps
│   └── tyres-asymmetry/      # Michelin compound asymmetry analysis
├── components/               # React components
│   ├── 3d/                   # Three.js CircuitCanvas & WebGL track models
│   ├── charts/               # Recharts & custom SVG telemetry charts
│   ├── navigation/           # Sidebar, Tactical HUD, and Pitwall Drawer
│   ├── timing/               # Timing boards & sector delta tables
│   └── ui/                   # Apex UI design system primitives (Radix + Tailwind)
├── lib/                      # Core utility functions, hooks, and static datasets
│   ├── data/                 # Circuits, calendar, standings, and grid data
│   ├── hooks/                # Custom React hooks (useStandings, usePersistentState)
│   └── utils/                # Formatting and mathematical helpers
└── public/                   # Static assets, fonts (Sora), circuit maps & screenshots
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 18.x or later (tested on Node v20+)
- **npm:** 9.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/didigold/GP-Dashboard.git

# Navigate into project directory
cd GP-Dashboard

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

```bash
# Type-check
npm run type-check

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

### Deploying to Vercel

1. Push this repository to GitHub.
2. Visit [Vercel](https://vercel.com) and click **Add New Project**.
3. Select `GP-Dashboard` from your GitHub repositories.
4. Framework Preset will automatically detect **Next.js**.
5. Click **Deploy**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ⚖️ Legal Disclaimer

*GP-Dashboard is an independent community open-source project. This project is not affiliated with, endorsed by, sponsored by, or associated with Dorna Sports S.L., MotoGP™, or the FIM. All trademarks, service marks, trade names, product names, and logos appearing on this site are the property of their respective owners.*
