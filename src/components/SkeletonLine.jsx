"use client";

export default function SkeletonLine({ width = "100%", height = 12, style = {} }) {
  return (
    <div style={{
      width, height,
      background: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
      backgroundSize: "200% 100%",
      animation: "pl-shimmer 1.4s infinite",
      ...style,
    }}>
      <style>{`@keyframes pl-shimmer { to { background-position: -200% 0; } }`}</style>
    </div>
  );
}