import React from 'react';

export default function ShinyText({
  text,
  children,
  speed = 3,
  shineColor = '#ffffff',
  className = '',
  style = {}
}) {
  const content = children ?? text;

  return (
    <span
      className={`inline-block relative overflow-hidden bg-clip-text text-transparent bg-[linear-gradient(110deg,#FF7043,45%,#FFFFFF,55%,#FF5722)] bg-[length:250%_100%] animate-[shine_3s_linear_infinite] ${className}`}
      style={{
        ...style
      }}
    >
      {content}
    </span>
  );
}
