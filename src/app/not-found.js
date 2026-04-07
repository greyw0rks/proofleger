"use client";
export default function NotFound() {
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Space Grotesk, sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:96, color:"#F7931A", lineHeight:1 }}>404</div>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:20, color:"#f5f0e8", margin:"16px 0" }}>PAGE NOT FOUND</div>
        <p style={{ color:"#666", marginBottom:32 }}>This block does not exist on chain.</p>
        <a href="/" style={{ border:"3px solid #F7931A", color:"#F7931A", padding:"12px 24px", fontFamily:"Archivo Black, sans-serif", textDecoration:"none", fontSize:13 }}>← BACK TO APP</a>
      </div>
    </div>
  );
}
