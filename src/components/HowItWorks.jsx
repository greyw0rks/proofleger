"use client";
const STEPS = [
  { n:"01", title:"Select File", desc:"Choose any file — PDF, image, video, document. It stays on your device." },
  { n:"02", title:"Hash Locally", desc:"Your browser computes a SHA-256 hash. This fingerprint uniquely identifies the file." },
  { n:"03", title:"Anchor to Bitcoin", desc:"Sign a transaction with your Hiro Wallet or MiniPay. The hash is stored on Stacks/Celo." },
  { n:"04", title:"Verify Forever", desc:"Share your hash. Anyone can verify it at any time with no login required." },
];

export default function HowItWorks() {
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px" }}>
      <h2 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:22,
        color:"#f5f0e8", marginBottom:32, textAlign:"center", letterSpacing:2 }}>
        HOW IT WORKS
      </h2>
      {STEPS.map((s,i) => (
        <div key={i} style={{ display:"flex", gap:20, marginBottom:24,
          paddingBottom:24, borderBottom: i < STEPS.length-1 ? "2px solid #1a1a1a" : "none" }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28,
            color:"#F7931A", opacity:0.4, flexShrink:0, lineHeight:1, paddingTop:2 }}>{s.n}</div>
          <div>
            <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:15,
              color:"#f5f0e8", marginBottom:6 }}>{s.title}</div>
            <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13,
              color:"#666", lineHeight:1.6 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}