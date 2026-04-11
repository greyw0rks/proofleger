"use client";
export default function ProfileStats({ docCount = 0, attestations = 0, nftCount = 0, score = 0 }) {
  const stats = [
    { label: "PROOFS", value: docCount, color: "#F7931A" },
    { label: "ATTESTATIONS", value: attestations, color: "#00ff88" },
    { label: "NFTs", value: nftCount, color: "#a78bfa" },
    { label: "REP SCORE", value: score, color: "#38bdf8" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
      {stats.map((s,i) => (
        <div key={i} style={{ border:`3px solid ${s.color}`, padding:"12px 8px", textAlign:"center", boxShadow:`3px 3px 0 ${s.color}` }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:24, color:s.color, lineHeight:1 }}>{s.value}</div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#666", marginTop:4, letterSpacing:1 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}