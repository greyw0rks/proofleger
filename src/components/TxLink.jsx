"use client";
export default function TxLink({ txid, label }) {
  if (!txid) return null;
  const short = `${txid.slice(0,10)}...`;
  return (
    <a href={`https://explorer.hiro.so/txid/${txid}`} target="_blank" rel="noreferrer"
      style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:4 }}>
      {label || short} ↗
    </a>
  );
}
