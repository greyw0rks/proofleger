"use client";
import { useCeloStats } from "@/hooks/useCeloStats";
import StatCard from "./StatCard";

export default function CeloStats() {
  const { stats, blockHeight, loading } = useCeloStats();

  if (loading) return (
    <div style={{ padding:16, fontFamily:"Space Mono, monospace", fontSize:11, color:"#666" }}>
      Loading Celo stats...
    </div>
  );

  return (
    <div>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#35D07F",
        letterSpacing:2, marginBottom:12 }}>CELO NETWORK</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
        <StatCard label="TXS" value={stats?.totalTxs || 0} color="#35D07F" />
        <StatCard label="USERS" value={stats?.uniqueUsers || 0} color="#FCFF52" />
        <StatCard label="BLOCK" value={blockHeight ? `#${(blockHeight/1000).toFixed(0)}K` : "—"} color="#35D07F" />
      </div>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#444" }}>
        Contract: {`0x251B...1735`}
      </div>
    </div>
  );
}