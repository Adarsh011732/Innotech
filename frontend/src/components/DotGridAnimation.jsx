import React, { useEffect, useRef } from 'react';

/**
 * DotGridAnimation
 * Fluid particle dot-matrix typography & trade-up sign animation.
 * Features:
 * - Ambient background dot matrix on deep navy (#151F32)
 * - Fluid particle simulation: dots scatter outward with radial bursts,
 *   drift organically via curl/turbulence noise, converge smoothly to form
 *   the logo, hold with subtle luminous breathing, and scatter again.
 * - Sequence strictly contains: ₹ (Rupee), ↑ (Trade Up), $ (USD), € (EUR), £ (GBP), ¥ (JPY)
 * - 60fps+ Canvas rendering with devicePixelRatio sharpness & zero leaks.
 */
export default function DotGridAnimation({ activeCurrencySymbol = '₹' }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Grid Matrix Configuration
    const COLS = 27;
    const ROWS = 31;
    const POOL_SIZE = 160; // Optimal particle pool size

    // Supported scene items: ONLY currency logos and ONE trade up sign
    const allSymbols = [
      { type: 'symbol', char: '₹', label: 'INR' },
      { type: 'arrow', label: 'Trade Up' },
      { type: 'symbol', char: '$', label: 'USD' },
      { type: 'symbol', char: '€', label: 'EUR' },
      { type: 'symbol', char: '£', label: 'GBP' },
      { type: 'symbol', char: '¥', label: 'JPY' },
    ];

    // Reorder so that activeCurrencySymbol is first if provided
    let scenes = [...allSymbols];
    const initialIndex = scenes.findIndex(
      s => s.type === 'symbol' && s.char === activeCurrencySymbol
    );
    if (initialIndex > 0) {
      const match = scenes.splice(initialIndex, 1)[0];
      scenes.unshift(match);
    }

    let sceneIndex = 0;

    // Dimensions
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

    // Handcrafted pristine vector trade up arrow (matching Dot Grid Typography video)
    function getArrowDots() {
      const dots = [];
      const cx = Math.floor(COLS / 2);

      // Triangular Arrow Head (rows 5 to 13)
      for (let i = 0; i < 9; i++) {
        const w = 2 + i * 2;
        const r = 5 + i;
        const startC = cx - Math.floor(w / 2);
        for (let c = startC; c < startC + w; c++) {
          const isTeal = i === 0 || (i <= 2 && (c === startC || c === startC + w - 1));
          dots.push({ c, r, isTeal });
        }
      }

      // Vertical Shaft (rows 14 to 26, 4 dots wide)
      for (let r = 14; r <= 26; r++) {
        for (let c = cx - 2; c <= cx + 1; c++) {
          const isTeal = r >= 23 && (c === cx - 2 || c === cx + 1);
          dots.push({ c, r, isTeal });
        }
      }

      return dots;
    }

    // High-resolution supersampled rasterizer for currency symbols
    function rasterizeGlyphDots(char) {
      const SCALE = 4;
      const offW = COLS * SCALE;
      const offH = ROWS * SCALE;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = offW;
      offCanvas.height = offH;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return [];

      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, offW, offH);
      offCtx.fillStyle = '#FFFFFF';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const fontSize = char === '₹' ? 22 : char === '$' ? 23 : 22;
      const offsetY = char === '₹' ? 0.8 : char === '$' ? 0 : 0.5;

      offCtx.font = `900 ${Math.round(fontSize * SCALE)}px "Inter", "Plus Jakarta Sans", system-ui, sans-serif`;
      offCtx.fillText(char, offW / 2, offH / 2 + offsetY * SCALE);

      const imgData = offCtx.getImageData(0, 0, offW, offH).data;
      const dots = [];

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          let sum = 0;
          for (let sy = 0; sy < SCALE; sy++) {
            for (let sx = 0; sx < SCALE; sx++) {
              const pxIdx = ((r * SCALE + sy) * offW + (c * SCALE + sx)) * 4;
              sum += imgData[pxIdx];
            }
          }
          const avg = sum / (SCALE * SCALE);
          if (avg > 72) {
            // Turquoise highlight dots (~20% of symbol dots for visual energy)
            const isTeal = (
              (r <= 6 && (c + r) % 2 === 0) ||
              ((r * 4 + c * 7) % 9 === 0)
            );
            dots.push({ c, r, isTeal });
          }
        }
      }

      return dots;
    }

    // Cache targets for all scenes
    let sceneTargets = scenes.map(s => {
      if (s.type === 'arrow') {
        return getArrowDots();
      } else {
        return rasterizeGlyphDots(s.char);
      }
    });

    // Recompute once fonts are confirmed ready
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        sceneTargets = scenes.map(s => {
          if (s.type === 'arrow') return getArrowDots();
          return rasterizeGlyphDots(s.char);
        });
        assignParticlesToScene(sceneTargets[sceneIndex]);
      });
    }

    // Initialize Particle Pool
    const particles = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      particles.push({
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: 200,
        targetY: 200,
        isAssigned: true,
        isTeal: false,
        opacity: 0.95,
        radius: 2.8,
        pulsePhase: Math.random() * Math.PI * 2,
        noiseSeed: Math.random() * 1000,
      });
    }

    // Assign every particle to a target dot in the current scene
    function assignParticlesToScene(sceneDots) {
      if (!sceneDots || sceneDots.length === 0) return;

      const numDots = sceneDots.length;

      // Map each particle to a target dot
      // If particles > dots, wrap around so EVERY particle joins the logo
      const available = [...particles];

      for (let i = 0; i < POOL_SIZE; i++) {
        const dot = sceneDots[i % numDots];
        const pos = getGridPos(dot.c, dot.r);

        // Find closest remaining particle to this dot position for natural paths
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
        if (chosen) {
          chosen.targetX = pos.x;
          chosen.targetY = pos.y;
          chosen.isAssigned = true;
          chosen.isTeal = dot.isTeal;
        }
      }
    }

    // Scatter impulse: explosive radial blast outward from symbol center
    function triggerScatterImpulse() {
      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach(p => {
        const angle = Math.atan2(p.y - centerY, p.x - centerX) + (Math.random() - 0.5) * 1.5;
        const speed = 2.4 + Math.random() * 3.2; // Controlled energetic scatter
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      });
    }

    // Animation Phase State Machine
    // 0.0s - 1.4s: Scatter & Random Fluid Drift
    // 1.4s - 2.6s: Convergence (dots join together into logo)
    // 2.6s - 4.6s: Hold crisp logo with luminous micro-shimmer
    const CYCLE_DURATION = prefersReducedMotion ? 3.0 : 4.6;
    const tScatterEnd = 1.4;
    const tConvergeEnd = 2.6;
    let cycleStartTime = performance.now();

    // Initial assignment & layout
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

      // 1. Deep Navy Background (#151F32)
      ctx.fillStyle = '#151F32';
      ctx.fillRect(0, 0, width, height);

      // 2. Static Matrix Dot Grid (Subtle dim dots in background)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
      for (let r = 0; r < ROWS; r++) {
        const y = marginY + r * stepY;
        for (let c = 0; c < COLS; c++) {
          const x = marginX + c * stepX;
          ctx.beginPath();
          ctx.arc(x, y, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Fluid Particle Physics & Rendering
      const timeSec = currentTime * 0.001;
      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach(p => {
        if (prefersReducedMotion) {
          p.x = p.targetX;
          p.y = p.targetY;
          p.opacity = 1.0;
        } else if (elapsedInCycle < tScatterEnd) {
          // PHASE 1: SCATTER & RANDOM FLUID DRIFT
          // Sine-wave curl noise for organic fluid turbulence
          const noiseAngle =
            Math.sin(p.y * 0.016 + timeSec * 1.6 + p.noiseSeed) * 2.4 +
            Math.cos(p.x * 0.016 + timeSec * 1.3) * 2.4;

          p.vx += Math.cos(noiseAngle) * 0.32;
          p.vy += Math.sin(noiseAngle) * 0.32;

          // Viscous fluid drag
          p.vx *= 0.94;
          p.vy *= 0.94;

          p.x += p.vx;
          p.y += p.vy;

          // Soft organic boundary steering (smoothly steers dots away from edges without sticking)
          const edgeMargin = 28;
          if (p.x < edgeMargin) p.vx += (edgeMargin - p.x) * 0.04;
          if (p.x > width - edgeMargin) p.vx -= (p.x - (width - edgeMargin)) * 0.04;
          if (p.y < edgeMargin) p.vy += (edgeMargin - p.y) * 0.04;
          if (p.y > height - edgeMargin) p.vy -= (p.y - (height - edgeMargin)) * 0.04;

          p.opacity = 0.90;
          p.radius = 2.5;
        } else if (elapsedInCycle < tConvergeEnd) {
          // PHASE 2: CONVERGING / JOINING TO FORM THE LOGO
          const progress = (elapsedInCycle - tScatterEnd) / (tConvergeEnd - tScatterEnd);

          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;

          // Spring-damper steering force smoothly guiding particles into position
          const spring = 0.07 + progress * 0.15;
          const damp = 0.82;

          p.vx = (p.vx + dx * spring) * damp;
          p.vy = (p.vy + dy * spring) * damp;

          p.x += p.vx;
          p.y += p.vy;

          // As progress nears completion, smoothly ease onto target
          p.x += dx * 0.09 * progress;
          p.y += dy * 0.09 * progress;

          p.opacity = 0.90 + progress * 0.10;
          p.radius = 2.5 + progress * 0.5;
        } else {
          // PHASE 3: HOLD CRISP LOGO WITH LUMINOUS BREATHING
          p.x = p.targetX;
          p.y = p.targetY;
          p.vx = 0;
          p.vy = 0;

          const shimmer = Math.sin(timeSec * 3.4 + p.pulsePhase) * 0.28;
          p.radius = 2.9 + shimmer;
          p.opacity = 1.0;
        }

        // Draw Particle with Glow
        ctx.save();
        if (p.isTeal) {
          // Vibrant Turquoise Accent (#35D9C5)
          ctx.fillStyle = `rgba(53, 217, 197, ${p.opacity})`;
          ctx.shadowColor = 'rgba(53, 217, 197, 0.8)';
          ctx.shadowBlur = 7;
        } else {
          // Pure Glowing White (#FFFFFF)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
          ctx.shadowBlur = 5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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

