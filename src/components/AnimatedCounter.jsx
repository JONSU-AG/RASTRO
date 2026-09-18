import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter
 * Rueda los números de 0 al valor objetivo con una curva fluida easeOutExpo.
 * @param {number} value - Número final a mostrar
 * @param {number} duration - Duración en milisegundos (default 1000ms)
 * @param {number} decimals - Cantidad de decimales a redondear
 * @param {string} prefix - Texto antes del número (ej. "+")
 * @param {string} suffix - Texto después del número (ej. " pts", " XP")
 */
export const AnimatedCounter = ({
  value = 0,
  duration = 1100,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  style = {}
}) => {
  const targetVal = typeof value === 'number' ? value : parseFloat(value) || 0;
  const [displayVal, setDisplayVal] = useState(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    startTimeRef.current = null;

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min(1, (timestamp - startTimeRef.current) / duration);
      const easedProgress = easeOutExpo(progress);
      const current = easedProgress * targetVal;

      if (isMounted) {
        setDisplayVal(current);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        if (isMounted) setDisplayVal(targetVal);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetVal, duration]);

  const formatted = decimals > 0
    ? displayVal.toFixed(decimals)
    : Math.round(displayVal).toLocaleString('es-PE');

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default AnimatedCounter;

