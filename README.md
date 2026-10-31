# GP-Dashboard 🏁

> **The Ultimate Real-Time Live Timing, Telemetry & 3D Analytics Platform for MotoGP™**

![GP-Dashboard Banner](https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop)

---

## ⚡ Overview

**GP-Dashboard** is the first modern, high-performance web analytics platform designed specifically for MotoGP fans, data engineers, and motorsport enthusiasts. Inspired by platforms like `formula1dashboard.com`, GP-Dashboard bridges the gap in two-wheel Grand Prix racing with:

- ⏱️ **Live Timing Suite:** Real-time sector splits (T1–T4 color-coded purple/green/yellow), speed traps, pit indicators, and leader gaps.
- 📺 **TV Broadcast Delay Sync:** Synchronize live timing with television, VideoPass, or streaming broadcasts with a 0 to 120-second circular memory buffer.
- 🌐 **Interactive 3D Circuit Canvas:** Powered by Three.js WebGL with authentic elevation, curbs, animated bike tracking, and multiple camera views (Overview Orbit, Top-Down Radar, Helicopter, Chase Cam).
- 📊 **Race Pace & Degradation:** Lap-by-lap pace distribution boxplots and Michelin tyre compound matrix (Soft/Medium/Hard).
- ⚔️ **Head-to-Head Battles:** Micro-sector comparisons across T1–T4 and career milestone tallies between any two riders.
- 🏆 **World Standings:** Real-time Riders, Teams, and Constructors championships.
- 💥 **Gravel Trap Championship:** The MotoGP equivalent of F1's "Destructors Championship" tracking crash damage ledgers.
- 📜 **Historical Archive:** Grand Prix winners, world titles, and technical eras dating back to 1949.

---

## 🔒 Security & Architecture

- **Zero-Secret Client Exposure:** All external data requests flow through Next.js Edge API routes (`/api/motogp/...` and `/api/live`), shielding upstream endpoints and preventing rate-limit blocks.
- **Strict Environment Safety:** Environment files (`.env*`) and credentials are strictly ignored in `.gitignore`.
- **Edge Caching:** Implements `stale-while-revalidate` caching headers, ensuring sub-second response times worldwide.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack, React 19, Server Components)
- **Styling:** Tailwind CSS with custom motorsport racing palette (asphalt, neon cyan, purple, crimson)
- **3D Graphics:** Three.js (WebGL Splines, Ambient & Directional Lighting, Smooth Camera Interpolation)
- **Icons:** Lucide React
- **Data Engine:** Pulselive MotoGP API (`api.motogp.pulselive.com/motogp/v1`) & Dorna PDF Ingestion Engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/GP-Dashboard.git

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
npm run build
npm run start
```

### Deploying to Vercel
1. Push this repository to your GitHub account (private or public).
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select `GP-Dashboard` from your repositories.
4. Framework Preset will automatically detect **Next.js**.
5. Click **Deploy**.

---

## ⚖️ Legal Disclaimer
*GP-Dashboard is an independent community fan project. This project is not affiliated with, endorsed by, sponsored by, or associated with Dorna Sports S.L. or MotoGP™.*
