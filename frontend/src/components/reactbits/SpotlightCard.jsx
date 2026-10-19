import React, { useRef } from 'react';

export default function SpotlightCard({
  children,
  className = '',
  style = {},
  spotlightColor = 'rgba(255, 87, 34, 0.25)',
  ...props
}) {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-3xl border border-[#232634] bg-[#14161E] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 group ${className}`}
      style={style}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), var(--spotlight-color, ${spotlightColor}), transparent 60%)`,
        }}
      />
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}
