# React Bits Design & Animation System Guidelines

**Website:** [reactbits.dev](https://reactbits.dev)  
**Registry Endpoint:** `https://reactbits.dev/r/<ComponentName>-<Flavor>.json`  
**Purpose:** Reusable, high-performance animated UI components for creative web apps and dashboards.

---

## 🎨 Recommended React Bits Components

### 1. `SpotlightCard`
- **Use Case:** Metric cards, pricing grids, interactive feature blocks.
- **Effect:** Soft radial cursor-following glow with border flare and smooth decay.
- **Recommended Palette:** 
  - Dark surface: `#14161E` / `#111217`
  - Spotlight color: `rgba(255, 87, 34, 0.28)` for orange theme or custom HSL.
- **Dependencies:** Pure React (no external package needed).

### 2. `BlurText`
- **Use Case:** Page titles, hero banners, section headers.
- **Effect:** Words or characters start with soft Gaussian blur and resolve into crisp focus with customizable stagger delay.
- **Dependencies:** React + CSS transitions or `motion`.

### 3. `CountUp`
- **Use Case:** Financial balances, metric counters, KPIs, turnover charts.
- **Effect:** Smooth ease-out numerical transition with formatting (decimals, thousand separators, prefix `$`).
- **Dependencies:** Pure React RAF or `motion`.

### 4. `ShinyText`
- **Use Case:** Status badges, CTA buttons, premium upgrade banners.
- **Effect:** Continuous metallic / glowing light band sweep across text.
- **Dependencies:** Pure CSS background-clip keyframe (`@keyframes shine`).

### 5. `AnimatedContent`
- **Use Case:** Staggered card entrance on mount or viewport intersection.
- **Effect:** Multi-element stagger with scale, opacity, and soft slide easing.
- **Dependencies:** GSAP (`npm install gsap`).

---

## 💻 CLI & Installation Pattern

```bash
# Add components via shadcn CLI
npx shadcn@latest add @react-bits/BlurText-TS-TW
npx shadcn@latest add @react-bits/SpotlightCard-TS-TW
npx shadcn@latest add @react-bits/AnimatedContent-TS-TW
npx shadcn@latest add @react-bits/CountUp-TS-TW
npx shadcn@latest add @react-bits/ShinyText-TS-TW
```
Or directly fetch JSON definitions from `https://reactbits.dev/r/<Name>.json`.
