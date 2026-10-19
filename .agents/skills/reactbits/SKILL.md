---
name: reactbits
description: Use animated, interactive UI components from React Bits (reactbits.dev) including SpotlightCard, BlurText, CountUp, ShinyText, and AnimatedContent for high-performance React web interfaces.
---

# React Bits Skill (reactbits.dev)

Use this skill when building or enhancing creative, animated, high-performance web applications with React Bits components.

## Component Index & Implementation Guide

### 1. SpotlightCard
Interactive cursor-following radial spotlight on dark cards.
- **Props:** `spotlightColor`, `className`, `children`
- **Location:** `src/components/reactbits/SpotlightCard.jsx`

### 2. BlurText
Soft-focus text reveal animation with sequential word/letter stagger.
- **Props:** `text`, `delay`, `blur`, `distance`, `className`
- **Location:** `src/components/reactbits/BlurText.jsx`

### 3. CountUp
Smooth ease-out numerical transition for financial figures and KPIs.
- **Props:** `to`, `from`, `duration`, `decimals`, `prefix`, `separator`
- **Location:** `src/components/reactbits/CountUp.jsx`

### 4. ShinyText
Metallic / glowing shimmer effect sweeping across badges or headers.
- **Props:** `text`, `speed`, `className`
- **Location:** `src/components/reactbits/ShinyText.jsx`

### 5. AnimatedContent
GSAP-powered layout wrapper revealing components on scroll or mount.
- **Props:** `children`, `distance`, `direction`, `duration`, `stagger`, `delay`
- **Location:** `src/components/reactbits/AnimatedContent.jsx`
