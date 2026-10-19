import React, { useEffect, useRef, useState } from 'react';

export default function CountUp({
  to = 0,
  from = 0,
  duration = 1.2,
  decimals = 2,
  separator = ',',
  prefix = '$',
  suffix = '',
  className = ''
}) {
  const [current, setCurrent] = useState(from);
  const prevTo = useRef(from);

  useEffect(() => {
    let startTimestamp = null;
    const startVal = prevTo.current;
    const endVal = to;
    prevTo.current = to;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // smooth ease-out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const val = startVal + (endVal - startVal) * ease;
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(endVal);
      }
    };

    requestAnimationFrame(step);
  }, [to, duration]);

  const formatted = `${prefix}${current.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}${suffix}`;

  return <span className={`tabular-nums ${className}`}>{formatted}</span>;
}
