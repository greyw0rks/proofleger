"use client";
const TYPE_COLORS = {
  diploma:      "#F7931A",
  certificate:  "#38bdf8",
  research:     "#a78bfa",
  contribution: "#00ff88",
  award:        "#fbbf24",
  art:          "#f472b6",
  other:        "#555",
};

export default function DocTypeTag({ type }) {
  const color = TYPE_COLORS[type?.toLowerCase()] || TYPE_COLORS.other;
  return (
    <span style={{ border:`2px solid ${color}`, padding:"2px 8px",
      fontFamily:"Archivo Black, sans-serif", fontSize:9,
      color, letterSpacing:1, flexShrink:0 }}>
      {(type || "OTHER").toUpperCase()}
    </span>
  );
}