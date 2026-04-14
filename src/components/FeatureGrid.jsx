"use client";
const FEATURES = [
  { icon:"₿", title:"Bitcoin Anchored", desc:"Every proof is permanently recorded on Bitcoin via Stacks L2." },
  { icon:"🔒", title:"Privacy First", desc:"Your files never leave your browser. Only the SHA-256 hash is sent." },
  { icon:"✓", title:"Instant Verify", desc:"Anyone can verify a document in seconds with no wallet required." },
  { icon:"🌐", title:"Multi-Chain", desc:"Anchor on Stacks or Celo. Works natively inside MiniPay." },
  { icon:"🏆", title:"Soulbound NFTs", desc:"Mint non-transferable credential NFTs tied to your wallet." },
  { icon:"🛡️", title:"Open Protocol", desc:"All contracts are open source and deployed on mainnet." },
];

export default function FeatureGrid() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
      gap:16, maxWidth:960, margin:"0 auto", padding:"0 24px 40px" }}>
      {FEATURES.map((f,i) => (
        <div key={i} style={{ border:"3px solid #222", padding:20, background:"#0d0d0d" }}>
          <div style={{ fontSize:24, marginBottom:10 }}>{f.icon}</div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
            color:"#F7931A", marginBottom:6, letterSpacing:0.5 }}>{f.title}</div>
          <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:12,
            color:"#666", lineHeight:1.6 }}>{f.desc}</div>
        </div>
      ))}
    </div>
  );
}