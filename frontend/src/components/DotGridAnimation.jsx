import React, { useEffect, useRef } from 'react';

/**
 * DotGridAnimation
 * Recreates the dot-matrix typography morphing effect from "Dot Grid Typography Animation.mp4"
 * Features:
 * - Evenly spaced matrix of dots on dark navy (#151F32)
 * - Morphs smoothly between currency symbols: ₹, $, €, £, ¥
 * - Transforms into currency pairs (USD/INR, EUR/USD), minimalist financial charts, and upward/downward arrows
 * - Muted blue-gray dots (#94A3B8 at low opacity) with bright white and turquoise (#35D9C5) active dots
 * - Canvas 60fps with devicePixelRatio sharpness, reduced-motion support, and zero memory leaks
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

    // Grid configuration
    const COLS = 27;
    const ROWS = 33;
    const totalDots = COLS * ROWS;

    // Dot state arrays: current intensity and target intensity (0 to 1)
    const currentIntensity = new Float32Array(totalDots);
    const targetIntensity = new Float32Array(totalDots);
    const isTurquoise = new Uint8Array(totalDots);

    // Sequence of scenes to cycle through
    const scenes = [
      { type: 'symbol', text: activeCurrencySymbol || '₹', label: 'INR' },
      { type: 'arrow', direction: 'up', label: 'Upward Momentum' },
      { type: 'symbol', text: '$', label: 'USD' },
      { type: 'chart', label: 'Alpha Curve' },
      { type: 'pair', text1: 'USD', text2: 'INR', label: 'USD/INR' },
      { type: 'symbol', text: '€', label: 'EUR' },
      { type: 'symbol', text: '£', label: 'GBP' },
      { type: 'pair', text1: 'EUR', text2: 'USD', label: 'EUR/USD' },
      { type: 'symbol', text: '¥', label: 'JPY' },
    ];

    let currentSceneIdx = 0;
    // Put current currency symbol first if applicable
    const initialIdx = scenes.findIndex(s => s.type === 'symbol' && s.text === activeCurrencySymbol);
    if (initialIdx !== -1) currentSceneIdx = initialIdx;

    // Offscreen canvas for sampling glyph dot states
    const offCanvas = document.createElement('canvas');
    offCanvas.width = COLS;
    offCanvas.height = ROWS;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    // Function to render a scene onto the offscreen canvas and set target intensities
    function rasterizeScene(scene) {
      if (!offCtx) return;
      offCtx.clearRect(0, 0, COLS, ROWS);
      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, COLS, ROWS);

      if (scene.type === 'symbol') {
        offCtx.fillStyle = '#FFFFFF';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        // Size and font tailored for clear dot matrix resolution
        const fontSize = scene.text === '₹' ? 22 : scene.text === '$' ? 24 : 22;
        offCtx.font = `900 ${fontSize}px "Inter", "Plus Jakarta Sans", sans-serif`;
        offCtx.fillText(scene.text, COLS / 2, ROWS / 2 + 1);
      } else if (scene.type === 'arrow') {
        // Handcrafted vector upward arrow matching Dot Grid Typography Animation.mp4
        offCtx.fillStyle = '#FFFFFF';
        const cx = Math.floor(COLS / 2);
        
        // Arrow shaft: 4 dots wide, from row 12 to row 27
        offCtx.fillRect(cx - 2, 12, 4, 16);
        
        // Arrow head wings: stepped triangle
        for (let i = 0; i < 9; i++) {
          const w = 2 + i * 2;
          const y = 4 + i;
          offCtx.fillRect(cx - Math.floor(w / 2), y, w, 1);
        }
      } else if (scene.type === 'chart') {
        // Minimalist financial growth chart trajectory
        offCtx.fillStyle = '#FFFFFF';
        const points = [
          { c: 4, r: 24 }, { c: 6, r: 23 }, { c: 8, r: 22 },
          { c: 10, r: 24 }, { c: 12, r: 20 }, { c: 14, r: 18 },
          { c: 16, r: 19 }, { c: 18, r: 15 }, { c: 20, r: 12 },
          { c: 22, r: 9 }
        ];

        // Draw line with thickness
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const steps = 8;
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const c = Math.round(p1.c + (p2.c - p1.c) * t);
            const r = Math.round(p1.r + (p2.r - p1.r) * t);
            offCtx.fillRect(c - 1, r - 1, 2, 2);
          }
        }
        // Fill area softly below
        for (let c = 4; c <= 22; c++) {
          offCtx.fillRect(c, 26, 1, 1);
        }
      } else if (scene.type === 'pair') {
        // Currency pair: USD over INR or EUR over USD
        offCtx.fillStyle = '#FFFFFF';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.font = '900 11px "Inter", "Plus Jakarta Sans", sans-serif';
        offCtx.fillText(scene.text1, COLS / 2, ROWS / 2 - 6);
        
        // Divider bar
        offCtx.fillRect(Math.floor(COLS / 2) - 6, Math.floor(ROWS / 2), 12, 1);
        
        offCtx.fillText(scene.text2, COLS / 2, ROWS / 2 + 7);
      }

      // Read back pixel data
      const imgData = offCtx.getImageData(0, 0, COLS, ROWS).data;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          const pixelIdx = idx * 4;
          const alpha = imgData[pixelIdx]; // Red channel or luminance

          if (alpha > 80) {
            targetIntensity[idx] = Math.min(1.0, alpha / 255);
            // Give subtle turquoise highlights to apex or perimeter dots
            const isPerimeter = (r === 4 || r === 5 || c === Math.floor(COLS / 2) || (r + c) % 7 === 0);
            isTurquoise[idx] = (isPerimeter && Math.random() > 0.45) ? 1 : 0;
          } else {
            targetIntensity[idx] = 0.0;
            isTurquoise[idx] = 0;
          }
        }
      }
    }

    // Initialize with the current scene
    rasterizeScene(scenes[currentSceneIdx]);
    // Instant initial setup
    for (let i = 0; i < totalDots; i++) {
      currentIntensity[i] = targetIntensity[i];
    }

    // Interval to cycle scenes every 2.8s (if motion not reduced)
    let cycleTimer = null;
    if (!prefersReducedMotion) {
      cycleTimer = setInterval(() => {
        currentSceneIdx = (currentSceneIdx + 1) % scenes.length;
        rasterizeScene(scenes[currentSceneIdx]);
      }, 2800);
    }

    // Render loop
    let width = 0;
    let height = 0;

    function handleResize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);

    // Main 60fps render loop
    function render() {
      if (!ctx || width === 0 || height === 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Navy background matching #151F32
      ctx.fillStyle = '#151F32';
      ctx.fillRect(0, 0, width, height);

      // Spacing
      const marginX = width * 0.12;
      const marginY = height * 0.10;
      const gridWidth = width - marginX * 2;
      const gridHeight = height - marginY * 2;
      const stepX = gridWidth / (COLS - 1);
      const stepY = gridHeight / (ROWS - 1);

      // Smoothly interpolate currentIntensity towards targetIntensity
      const lerpSpeed = prefersReducedMotion ? 1.0 : 0.14;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          const target = targetIntensity[idx];
          
          if (!prefersReducedMotion) {
            currentIntensity[idx] += (target - currentIntensity[idx]) * lerpSpeed;
          } else {
            currentIntensity[idx] = target;
          }

          const val = currentIntensity[idx];
          const x = marginX + c * stepX;
          const y = marginY + r * stepY;

          if (val > 0.08) {
            // Active dot
            const radius = 1.6 + val * 2.2;
            const isTeal = isTurquoise[idx] === 1;

            if (isTeal) {
              ctx.fillStyle = `rgba(53, 217, 197, ${Math.min(1.0, 0.4 + val * 0.6)})`;
              ctx.shadowColor = 'rgba(53, 217, 197, 0.5)';
              ctx.shadowBlur = 6 * val;
            } else {
              ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, 0.3 + val * 0.7)})`;
              ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
              ctx.shadowBlur = 4 * val;
            }

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for performance
          } else {
            // Subtle dim background dot
            ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
            ctx.beginPath();
            ctx.arc(x, y, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (cycleTimer) clearInterval(cycleTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [activeCurrencySymbol]);

  return (
    <div className="relative w-full h-full min-h-[360px] flex items-center justify-center overflow-hidden select-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
