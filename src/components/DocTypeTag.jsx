"use client";
const COLORS = { diploma:"#F7931A", certificate:"#00ff88", research:"#a78bfa", art:"#38bdf8", contribution:"#22c55e", award:"#fbbf24", other:"#888" };
export default function DocTypeTag({ type }) {
  const color = COLORS[type?.toLowerCase()] || COLORS.other;
  return (
    <span style={{ border:`2px solid ${color}`, color, padding:"2px 8px", fontSize:10, fontFamily:"Archivo Black, sans-serif", letterSpacing:"0.5px" }}>
      {type?.toUpperCase() || "OTHER"}
    </span>
  );
}
