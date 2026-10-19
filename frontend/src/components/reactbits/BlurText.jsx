import React, { useEffect, useRef, useState, useMemo } from 'react';

export default function BlurText({
  text = '',
  delay = 100,
  className = '',
  animateBy = 'words',
  direction = 'top',
  blur = 8,
  distance = 20,
  threshold = 0.1,
  onAnimationComplete
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const items = useMemo(() => {
    return animateBy === 'words' ? text.split(' ') : Array.from(text);
  }, [text, animateBy]);

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {items.map((item, idx) => (
        <span
          key={idx}
          className="inline-block transition-all duration-500 ease-out"
          style={{
            filter: inView ? 'none' : `blur(${blur}px)`,
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : `translateY(${direction === 'top' ? -distance : distance}px)`,
            transitionDelay: `${idx * delay}ms`,
            marginRight: animateBy === 'words' ? '0.3em' : '0'
          }}
        >
          {item}
        </span>
      ))}
    </span>
  );
}
