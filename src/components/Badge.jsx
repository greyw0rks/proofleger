"use client";
const VARIANTS = {
  success: { bg:"#0d1f16", border:"#00ff88", color:"#00ff88" },
  error:   { bg:"#1f0d0d", border:"#ff3333", color:"#ff3333" },
  warning: { bg:"#1f1500", border:"#F7931A", color:"#F7931A" },
  info:    { bg:"#0d0d1f", border:"#38bdf8", color:"#38bdf8" },
  neutral: { bg:"#111",    border:"#444",    color:"#888" },
};

export default function Badge({ label, variant = "neutral", dot = false }) {
  const s = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      background: s.bg, border:`2px solid ${s.border}`, color: s.color,
      padding:"2px 8px", fontFamily:"Archivo Black, sans-serif",
      fontSize:9, letterSpacing:"0.5px" }}>
      {dot && <span style={{ width:5, height:5, borderRadius:"50%",
        background: s.color, display:"inline-block" }} />}
      {label}
    </span>
  );
}