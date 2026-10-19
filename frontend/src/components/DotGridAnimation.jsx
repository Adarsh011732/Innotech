import React, { useEffect, useRef } from 'react';

/**
 * DotGridAnimation
 * Fluid particle dot-matrix typography & trade-up sign animation.
 * Features:
 * - Pure deep navy canvas (#151F32) with NO static background grid
 * - Handcrafted defect-free geometric symbol matrices: ₹, ↑, $, €, £, ¥
 * - True fluid particle simulation: all dots move freely across space,
 *   converge smoothly to form the logo (with excess dots combining into target points
 *   or fading/disappearing so no stray dots remain), hold crisply with luminous breathing,
 *   and scatter outward again in a continuous seamless cycle.
 * - 60fps+ Canvas with devicePixelRatio sharpness & reduced-motion support.
 */
export default function DotGridAnimation({ activeCurrencySymbol = '₹' }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Grid Matrix Configuration
    const COLS = 27;
    const ROWS = 31;
    const POOL_SIZE = 160;

    // Handcrafted Defect-Free Geometric Symbol Dot Builders
    function getRupeeDots() {
      const dots = [];
      // 1. Top Shirorekha Horizontal Bar (row 6, cols 8 to 19)
      for (let c = 8; c <= 19; c++) {
        dots.push({ c, r: 6, isTeal: c >= 17 });
      }
      // 2. Second Horizontal Bar (row 10, cols 8 to 19)
      for (let c = 8; c <= 19; c++) {
        dots.push({ c, r: 10, isTeal: c >= 16 });
      }
      // 3. Short vertical neck connecting top bar to curve (cols 11 & 12, rows 6 to 9)
      for (let r = 6; r <= 9; r++) {
        dots.push({ c: 11, r, isTeal: false });
        dots.push({ c: 12, r, isTeal: false });
      }
      // 4. Upper half-circle arch of Devanagari 'Ra' (rows 9 to 14)
      const loopPoints = [
        { c: 13, r: 9, isTeal: false }, { c: 14, r: 9, isTeal: false }, { c: 15, r: 9, isTeal: false },
        { c: 16, r: 10, isTeal: false }, { c: 17, r: 10, isTeal: true },
        { c: 17, r: 11, isTeal: true }, { c: 18, r: 11, isTeal: true },
        { c: 17, r: 12, isTeal: true }, { c: 18, r: 12, isTeal: true },
        { c: 16, r: 13, isTeal: false }, { c: 17, r: 13, isTeal: false },
        { c: 13, r: 14, isTeal: false }, { c: 14, r: 14, isTeal: false }, { c: 15, r: 14, isTeal: false },
        { c: 11, r: 14, isTeal: false }, { c: 12, r: 14, isTeal: false }
      ];
      dots.push(...loopPoints);

      // 5. Diagonal slash leg angling down-right from junction (11, 14) to (19, 25)
      for (let step = 0; step <= 10; step++) {
        const r = 14 + step;
        const c = Math.round(11 + step * 0.8);
        dots.push({ c, r, isTeal: step >= 8 });
        dots.push({ c: c + 1, r, isTeal: step >= 8 });
      }

      const map = new Map();
      dots.forEach(d => map.set(d.c + ',' + d.r, d));
      return Array.from(map.values());
    }

    function getArrowDots() {
      const dots = [];
      const cx = 13;
      // Triangular Arrow Head (rows 5 to 14)
      for (let i = 0; i <= 9; i++) {
        const r = 5 + i;
        const w = 2 + i * 2;
        const startC = cx - Math.floor(w / 2);
        for (let c = startC; c < startC + w; c++) {
          const isEdge = (i === 0 || i === 9 || c === startC || c === startC + w - 1);
          dots.push({ c, r, isTeal: isEdge && (i <= 2 || i >= 8) });
        }
      }
      // Solid Vertical Shaft (rows 15 to 26, 5 dots wide)
      for (let r = 15; r <= 26; r++) {
        for (let c = cx - 2; c <= cx + 2; c++) {
          dots.push({ c, r, isTeal: r >= 24 && (c === cx - 2 || c === cx + 2) });
        }
      }
      return dots;
    }

    function getDollarDots() {
      const dots = [];
      // Central vertical spine (col 13, rows 4 to 26)
      for (let r = 4; r <= 26; r++) {
        dots.push({ c: 13, r, isTeal: r <= 6 || r >= 24 });
      }
      // S top horizontal arc
      for (let c = 9; c <= 17; c++) {
        dots.push({ c, r: 7, isTeal: false });
        dots.push({ c, r: 8, isTeal: false });
      }
      // S top left curve
      for (let r = 8; r <= 13; r++) {
        dots.push({ c: 8, r, isTeal: r <= 10 });
        dots.push({ c: 9, r, isTeal: false });
      }
      // S middle diagonal bar
      for (let c = 8; c <= 18; c++) {
        dots.push({ c, r: 14, isTeal: c === 13 });
        dots.push({ c, r: 15, isTeal: c === 13 });
      }
      // S bottom right curve
      for (let r = 16; r <= 21; r++) {
        dots.push({ c: 17, r, isTeal: false });
        dots.push({ c: 18, r, isTeal: r >= 19 });
      }
      // S bottom horizontal arc
      for (let c = 9; c <= 17; c++) {
        dots.push({ c, r: 22, isTeal: false });
        dots.push({ c, r: 23, isTeal: false });
      }
      const map = new Map();
      dots.forEach(d => map.set(d.c + ',' + d.r, d));
      return Array.from(map.values());
    }

    function getEuroDots() {
      const dots = [];
      // Left curved C-backbone (cols 8 & 9, rows 9 to 21)
      for (let r = 9; r <= 21; r++) {
        dots.push({ c: 8, r, isTeal: false });
        dots.push({ c: 9, r, isTeal: false });
      }
      // Top curve
      for (let c = 10; c <= 18; c++) {
        dots.push({ c, r: 7, isTeal: c >= 16 });
        dots.push({ c, r: 8, isTeal: false });
      }
      // Bottom curve
      for (let c = 10; c <= 18; c++) {
        dots.push({ c, r: 22, isTeal: false });
        dots.push({ c, r: 23, isTeal: c >= 16 });
      }
      // Upper Crossbar (row 12, cols 5 to 16)
      for (let c = 5; c <= 16; c++) {
        dots.push({ c, r: 12, isTeal: c <= 7 });
      }
      // Lower Crossbar (row 17, cols 5 to 16)
      for (let c = 5; c <= 16; c++) {
        dots.push({ c, r: 17, isTeal: c <= 7 });
      }
      const map = new Map();
      dots.forEach(d => map.set(d.c + ',' + d.r, d));
      return Array.from(map.values());
    }

    function getPoundDots() {
      const dots = [];
      // Top arch
      for (let c = 12; c <= 16; c++) {
        dots.push({ c, r: 6, isTeal: false });
        dots.push({ c, r: 7, isTeal: false });
      }
      for (let r = 7; r <= 10; r++) {
        dots.push({ c: 17, r, isTeal: r === 7 });
        dots.push({ c: 18, r, isTeal: r === 7 });
      }
      // Left vertical stem
      for (let r = 8; r <= 22; r++) {
        dots.push({ c: 10, r, isTeal: false });
        dots.push({ c: 11, r, isTeal: false });
      }
      // Middle crossbar (row 14, cols 7 to 16)
      for (let c = 7; c <= 16; c++) {
        dots.push({ c, r: 14, isTeal: c <= 9 });
      }
      // Base sweep (rows 23 & 24, cols 8 to 19)
      for (let c = 8; c <= 19; c++) {
        dots.push({ c, r: 23, isTeal: c >= 17 });
        dots.push({ c, r: 24, isTeal: c >= 17 });
      }
      const map = new Map();
      dots.forEach(d => map.set(d.c + ',' + d.r, d));
      return Array.from(map.values());
    }

    function getYenDots() {
      const dots = [];
      // Upper V branches
      for (let i = 0; i <= 7; i++) {
        const r = 6 + i;
        const cLeft = 7 + i;
        const cRight = 19 - i;
        dots.push({ c: cLeft, r, isTeal: i <= 2 });
        dots.push({ c: cLeft + 1, r, isTeal: false });
        dots.push({ c: cRight, r, isTeal: i <= 2 });
        dots.push({ c: cRight - 1, r, isTeal: false });
      }
      // Central vertical stem (rows 14 to 25, cols 13 & 14)
      for (let r = 14; r <= 25; r++) {
        dots.push({ c: 13, r, isTeal: r >= 23 });
        dots.push({ c: 14, r, isTeal: r >= 23 });
      }
      // Upper crossbar (row 15, cols 8 to 19)
      for (let c = 8; c <= 19; c++) {
        dots.push({ c, r: 15, isTeal: c === 8 || c === 19 });
      }
      // Lower crossbar (row 18, cols 8 to 19)
      for (let c = 8; c <= 19; c++) {
        dots.push({ c, r: 18, isTeal: c === 8 || c === 19 });
      }
      const map = new Map();
      dots.forEach(d => map.set(d.c + ',' + d.r, d));
      return Array.from(map.values());
    }

    // Sequence of scenes (strictly currency logos and one trade-up sign)
    const allSymbols = [
      { id: 'inr', char: '₹', getDots: getRupeeDots },
      { id: 'arrow', char: '↑', getDots: getArrowDots },
      { id: 'usd', char: '$', getDots: getDollarDots },
      { id: 'eur', char: '€', getDots: getEuroDots },
      { id: 'gbp', char: '£', getDots: getPoundDots },
      { id: 'jpy', char: '¥', getDots: getYenDots },
    ];

    let scenes = [...allSymbols];
    const initialIndex = scenes.findIndex(s => s.char === activeCurrencySymbol);
    if (initialIndex > 0) {
      const match = scenes.splice(initialIndex, 1)[0];
      scenes.unshift(match);
    }

    let sceneIndex = 0;

    // Dimensions & Grid positioning
    let width = 0;
    let height = 0;
    let marginX = 0;
    let marginY = 0;
    let stepX = 0;
    let stepY = 0;

    function getGridPos(c, r) {
      return {
        x: marginX + c * stepX,
        y: marginY + r * stepY,
      };
    }

    // Precompute targets for each scene
    const sceneTargets = scenes.map(s => s.getDots());

    // Initialize Particle Pool
    const particles = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      particles.push({
        x: 120 + Math.random() * 160,
        y: 120 + Math.random() * 160,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: 200,
        targetY: 200,
        role: 'primary', // 'primary', 'combine', 'disappear'
        isTeal: false,
        opacity: 0.95,
        targetOpacity: 1.0,
        radius: 2.8,
        pulsePhase: Math.random() * Math.PI * 2,
        noiseSeed: Math.random() * 1000,
      });
    }

    /**
     * Assign particles to scene:
     * - Every particle is in motion.
     * - The required number of dots become 'primary' logo dots.
     * - Of the excess dots:
     *   - ~50% 'combine' (steer directly into existing target dots, merging into the logo with a luminous boost).
     *   - ~50% 'disappear' (steer toward the logo perimeter and smoothly fade out to 0 opacity).
     * This guarantees 100% of the dots participate, some combine, some disappear,
     * leaving ONLY the pristine, defect-free logo during the hold phase!
     */
    function assignParticlesToScene(sceneDots) {
      if (!sceneDots || sceneDots.length === 0) return;

      const numDots = sceneDots.length;
      const available = [...particles];

      // 1. Assign primary particles (1 per target dot)
      for (let i = 0; i < numDots && available.length > 0; i++) {
        const dot = sceneDots[i];
        const pos = getGridPos(dot.c, dot.r);

        let bestIdx = 0;
        let minDistSq = Infinity;
        for (let j = 0; j < available.length; j++) {
          const p = available[j];
          const dx = pos.x - p.x;
          const dy = pos.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < minDistSq) {
            minDistSq = distSq;
            bestIdx = j;
          }
        }

        const chosen = available.splice(bestIdx, 1)[0];
        chosen.targetX = pos.x;
        chosen.targetY = pos.y;
        chosen.role = 'primary';
        chosen.isTeal = dot.isTeal;
        chosen.targetOpacity = 1.0;
      }

      // 2. Assign excess particles: half combine, half disappear
      for (let i = 0; i < available.length; i++) {
        const p = available[i];
        const dotIndex = i % numDots;
        const targetDot = sceneDots[dotIndex];
        const pos = getGridPos(targetDot.c, targetDot.r);

        if (i % 2 === 0) {
          // COMBINE: merges into this target dot
          p.targetX = pos.x;
          p.targetY = pos.y;
          p.role = 'combine';
          p.isTeal = targetDot.isTeal;
          p.targetOpacity = 0.85; // stays merged with the dot
        } else {
          // DISAPPEAR: drifts towards the symbol edge and smoothly fades out
          p.targetX = pos.x + (Math.random() - 0.5) * 16;
          p.targetY = pos.y + (Math.random() - 0.5) * 16;
          p.role = 'disappear';
          p.isTeal = false;
          p.targetOpacity = 0.0;
        }
      }
    }

    // Scatter impulse: explosive radial blast outward from symbol center
    function triggerScatterImpulse() {
      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach(p => {
        // Re-energize all particles to full brightness and scatter outward
        p.opacity = 0.95;
        const angle = Math.atan2(p.y - centerY, p.x - centerX) + (Math.random() - 0.5) * 1.6;
        const speed = 2.4 + Math.random() * 3.4;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      });
    }

    // Animation Phase State Machine
    // 0.0s - 1.4s: Scatter & Random Fluid Drift
    // 1.4s - 2.6s: Convergence (dots join, combine, and disappear)
    // 2.6s - 4.6s: Hold crisp, defect-free logo with luminous breathing shimmer
    const CYCLE_DURATION = prefersReducedMotion ? 3.0 : 4.6;
    const tScatterEnd = 1.4;
    const tConvergeEnd = 2.6;
    let cycleStartTime = performance.now();

    function updateDimensions() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      marginX = width * 0.12;
      marginY = height * 0.10;
      stepX = (width - marginX * 2) / (COLS - 1);
      stepY = (height - marginY * 2) / (ROWS - 1);

      assignParticlesToScene(sceneTargets[sceneIndex]);
    }

    updateDimensions();
    triggerScatterImpulse();

    const resizeObserver = new ResizeObserver(() => updateDimensions());
    resizeObserver.observe(canvas);

    // Main 60fps Fluid Particle Physics & Render Loop
    let lastTime = performance.now();

    function render(currentTime) {
      if (!ctx || width === 0 || height === 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      lastTime = currentTime;
      const elapsedInCycle = (currentTime - cycleStartTime) / 1000;

      // When cycle completes, advance to next scene and trigger scatter
      if (elapsedInCycle >= CYCLE_DURATION) {
        cycleStartTime = currentTime;
        sceneIndex = (sceneIndex + 1) % scenes.length;
        assignParticlesToScene(sceneTargets[sceneIndex]);
        triggerScatterImpulse();
      }

      // 1. Deep Navy Canvas (#151F32) — NO static background dot grid!
      ctx.fillStyle = '#151F32';
      ctx.fillRect(0, 0, width, height);

      // 2. Fluid Particle Physics & Rendering
      const timeSec = currentTime * 0.001;

      particles.forEach(p => {
        if (prefersReducedMotion) {
          p.x = p.targetX;
          p.y = p.targetY;
          p.opacity = p.role === 'disappear' ? 0 : 1.0;
        } else if (elapsedInCycle < tScatterEnd) {
          // PHASE 1: SCATTER & RANDOM FLUID DRIFT
          // All particles are visible and swirling in 2D space
          p.opacity = 0.92;
          p.radius = 2.5;

          const noiseAngle =
            Math.sin(p.y * 0.016 + timeSec * 1.6 + p.noiseSeed) * 2.4 +
            Math.cos(p.x * 0.016 + timeSec * 1.3) * 2.4;

          p.vx += Math.cos(noiseAngle) * 0.32;
          p.vy += Math.sin(noiseAngle) * 0.32;

          p.vx *= 0.94;
          p.vy *= 0.94;

          p.x += p.vx;
          p.y += p.vy;

          // Soft organic boundary steering (smoothly turns dots around before border)
          const edgeMargin = 28;
          if (p.x < edgeMargin) p.vx += (edgeMargin - p.x) * 0.04;
          if (p.x > width - edgeMargin) p.vx -= (p.x - (width - edgeMargin)) * 0.04;
          if (p.y < edgeMargin) p.vy += (edgeMargin - p.y) * 0.04;
          if (p.y > height - edgeMargin) p.vy -= (p.y - (height - edgeMargin)) * 0.04;
        } else if (elapsedInCycle < tConvergeEnd) {
          // PHASE 2: CONVERGENCE (Dots join to construct logo, some combine, some disappear)
          const progress = (elapsedInCycle - tScatterEnd) / (tConvergeEnd - tScatterEnd);

          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;

          const spring = 0.07 + progress * 0.16;
          const damp = 0.82;

          p.vx = (p.vx + dx * spring) * damp;
          p.vy = (p.vy + dy * spring) * damp;

          p.x += p.vx + dx * 0.09 * progress;
          p.y += p.vy + dy * 0.09 * progress;

          if (p.role === 'disappear') {
            // Disappearing particles smoothly fade out as they reach logo
            p.opacity = Math.max(0, 0.92 * (1 - progress));
            p.radius = Math.max(0.5, 2.5 * (1 - progress * 0.6));
          } else if (p.role === 'combine') {
            // Combining particles merge into target dot
            p.opacity = 0.92;
            p.radius = 2.5 + progress * 0.4;
          } else {
            // Primary logo dots
            p.opacity = 0.92 + progress * 0.08;
            p.radius = 2.5 + progress * 0.5;
          }
        } else {
          // PHASE 3: HOLD CRISP DEFECT-FREE LOGO WITH LUMINOUS BREATHING
          if (p.role === 'disappear') {
            p.opacity = 0.0;
          } else {
            p.x = p.targetX;
            p.y = p.targetY;
            p.vx = 0;
            p.vy = 0;

            const shimmer = Math.sin(timeSec * 3.4 + p.pulsePhase) * 0.28;
            p.radius = 2.9 + shimmer;
            p.opacity = 1.0;
          }
        }

        // Render Particle with Glow (only if visible)
        if (p.opacity > 0.04) {
          ctx.save();
          if (p.isTeal) {
            // Vibrant Turquoise Accent (#35D9C5)
            ctx.fillStyle = `rgba(53, 217, 197, ${p.opacity})`;
            ctx.shadowColor = 'rgba(53, 217, 197, 0.85)';
            ctx.shadowBlur = 8;
          } else {
            // Pure Glowing White (#FFFFFF)
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.70)';
            ctx.shadowBlur = 5;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [activeCurrencySymbol]);

  return (
    <div className="relative w-full h-full min-h-[350px] flex items-center justify-center overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

