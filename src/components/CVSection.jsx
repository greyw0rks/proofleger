"use client";
export default function CVSection({ title, accent = "#F7931A", children }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <div style={{ width:4, height:20, background:accent }} />
        <div style={{ fontFamily:"Archivo Black, sans-serif",
          fontSize:13, color:accent, letterSpacing:2 }}>
          {title.toUpperCase()}
        </div>
      </div>
      {children}
    </div>
  );
}