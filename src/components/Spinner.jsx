"use client";

export default function Spinner({ size = 18, color = "#F7931A" }) {
  return (
    <span style={{ display: "inline-block", width: size, height: size,
      border: `2px solid ${color}22`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%",
      animation: "pl-spin 0.7s linear infinite",
    }}>
      <style>{`@keyframes pl-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}