import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AnimatedContent({
  children,
  distance = 30,
  direction = 'vertical',
  reverse = false,
  duration = 0.6,
  ease = 'power3.out',
  initialOpacity = 0,
  scale = 0.98,
  delay = 0,
  stagger = 0.08,
  className = '',
  style = {}
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === 'horizontal' ? 'x' : 'y';
    const sign = reverse ? -1 : 1;
    const targets = el.children.length ? Array.from(el.children) : [el];

    gsap.set(targets, {
      [axis]: distance * sign,
      opacity: initialOpacity,
      scale
    });

    gsap.to(targets, {
      [axis]: 0,
      opacity: 1,
      scale: 1,
      duration,
      ease,
      delay,
      stagger: stagger > 0 ? stagger : undefined,
      clearProps: 'transform,opacity'
    });
  }, [distance, direction, reverse, duration, ease, initialOpacity, scale, delay, stagger]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
