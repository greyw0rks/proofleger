"use client";
export default function StatCard({ label, value, color = "#F7931A", sub = null }) {
  return (
    <div style={{ border:"2px solid #1a1a1a", padding:16 }}>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
        color:"#555", marginBottom:6, letterSpacing:1 }}>
        {label}
      </div>
      <div style={{ fontFamily:"Archivo Black, sans-serif",
        fontSize:24, color }}>
        {value ?? "—"}
      </div>
      {sub && (
        <div style={{ fontFamily:"Space Mono, monospace",
          fontSize:9, color:"#444", marginTop:4 }}>{sub}</div>
      )}
    </div>
  );
}