"use client";
export default function MiniPayBanner() {
  return (
    <div style={{ background:"#0d1f16", border:"3px solid #35D07F", padding:"10px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
      <span style={{ fontSize:20 }}>⚡</span>
      <div>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13, color:"#35D07F" }}>MINIPAY DETECTED</div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#888", marginTop:2 }}>Wallet auto-connected · Celo network active</div>
      </div>
    </div>
  );
}