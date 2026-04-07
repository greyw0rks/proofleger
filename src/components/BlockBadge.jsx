"use client";
export default function BlockBadge({ blockHeight }) {
  if (!blockHeight) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, border:"2px solid #F7931A", padding:"2px 10px", fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A" }}>
      <span>₿</span>
      <span>Block #{Number(blockHeight).toLocaleString()}</span>
    </span>
  );
}
