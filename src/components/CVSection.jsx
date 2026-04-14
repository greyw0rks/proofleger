"use client";
export default function CVSection({ title, children, accent = "#F7931A", printable = true }) {
  return (
    <div style={{ marginBottom:32, ...(printable ? {} : { pageBreakInside:"avoid" }) }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <div style={{ width:4, height:24, background:accent, flexShrink:0 }} />
        <h2 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16, color:accent, margin:0, letterSpacing:2 }}>
          {title.toUpperCase()}
        </h2>
        <div style={{ flex:1, height:1, background:"#222" }} />
      </div>
      {children}
    </div>
  );
}