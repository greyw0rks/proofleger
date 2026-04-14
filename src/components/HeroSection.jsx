"use client";
export default function HeroSection({ onGetStarted }) {
  return (
    <div style={{ textAlign:"center", padding:"60px 24px 40px", maxWidth:720, margin:"0 auto" }}>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A",
        letterSpacing:3, marginBottom:16 }}>BITCOIN · STACKS · CELO</div>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:"clamp(32px,6vw,56px)",
        color:"#f5f0e8", lineHeight:1.1, marginBottom:16 }}>
        ANCHOR DOCUMENTS<br/>TO BITCOIN
      </h1>
      <p style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:16, color:"#888",
        lineHeight:1.7, marginBottom:32, maxWidth:480, margin:"0 auto 32px" }}>
        Prove a document existed at a specific point in time.
        Hash locally. Anchor permanently. Verify forever.
      </p>
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
        <button onClick={onGetStarted}
          style={{ background:"#F7931A", border:"3px solid #F7931A", color:"#000",
            padding:"14px 32px", fontFamily:"Archivo Black, sans-serif", fontSize:14,
            cursor:"pointer", boxShadow:"4px 4px 0 #d4780f", letterSpacing:1 }}>
          ANCHOR A DOCUMENT
        </button>
        <a href="/verify"
          style={{ border:"3px solid #f5f0e8", color:"#f5f0e8", padding:"14px 32px",
            fontFamily:"Archivo Black, sans-serif", fontSize:14, textDecoration:"none",
            letterSpacing:1 }}>
          VERIFY DOCUMENT
        </a>
      </div>
    </div>
  );
}