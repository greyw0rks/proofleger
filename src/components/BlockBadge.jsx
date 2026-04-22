"use client";
export default function BlockBadge({ blockHeight }) {
  if (!blockHeight) return null;
  return (
    <a href={`https://explorer.hiro.so/block/${blockHeight}`}
      target="_blank" rel="noreferrer"
      style={{ border:"2px solid #333", padding:"2px 8px",
        fontFamily:"Space Mono, monospace", fontSize:9,
        color:"#555", textDecoration:"none", flexShrink:0 }}
      onMouseOver={e => e.currentTarget.style.color="#f5f0e8"}
      onMouseOut={e => e.currentTarget.style.color="#555"}>
      BTC #{Number(blockHeight).toLocaleString()}
    </a>
  );
}