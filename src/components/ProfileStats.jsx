"use client";
import StatCard from "./StatCard";

export default function ProfileStats({ docCount = 0, attestations = 0, nftCount = 0, score = 0 }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
      <StatCard label="DOCUMENTS" value={docCount}     color="#F7931A" />
      <StatCard label="ATTESTS"   value={attestations} color="#00ff88" />
      <StatCard label="NFTS"      value={nftCount}     color="#a78bfa" />
      <StatCard label="SCORE"     value={score}        color="#38bdf8" />
    </div>
  );
}