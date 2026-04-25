"use client";
import { useState, useEffect, useRef } from "react";

export default function LiveCounter({ value, duration = 600, color = "#F7931A", size = 28 }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    const start  = prevRef.current;
    const end    = value;
    const diff   = end - start;
    const frames = Math.max(1, Math.round(duration / 16));
    let frame    = 0;

    const id = setInterval(() => {
      frame++;
      const progress = frame / frames;
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(start + diff * eased));
      if (frame >= frames) { clearInterval(id); setDisplay(end); }
    }, 16);

    prevRef.current = value;
    return () => clearInterval(id);
  }, [value, duration]);

  return (
    <span style={{ fontFamily: "Archivo Black, sans-serif",
      fontSize: size, color, fontVariantNumeric: "tabular-nums" }}>
      {display?.toLocaleString() ?? "—"}
    </span>
  );
}