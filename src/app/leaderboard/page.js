"use client";
import { useState } from "react";
import LeaderboardTable from "@/components/LeaderboardTable";
import { useRecentActivity } from "@/hooks/useRecentActivity";

export default function LeaderboardPage() {
  const [limit, setLimit] = useState(20);
  const { activity } = useRecentActivity(5);
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-end", marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:4 }}>
            LEADERBOARD
          </h1>
          <p style={{ color:"#888", fontSize:13 }}>Top ProofLedger contributors</p>
        </div>
        <select value={limit} onChange={e => setLimit(Number(e.target.value))}
          style={{ background:"#0a0a0a", border:"2px solid #333", color:"#888",
            padding:"6px 12px", fontFamily:"Archivo Black, sans-serif",
            fontSize:10, cursor:"pointer" }}>
          {[10,20,50].map(n => (
            <option key={n} value={n}>TOP {n}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:10,
          color:"#555", marginBottom:12, letterSpacing:2 }}>SCORING</div>
        <div style={{ display:"flex", gap:16, fontFamily:"Space Mono, monospace",
          fontSize:10, color:"#666" }}>
          <span style={{ color:"#F7931A" }}>ANCHOR × 10</span>
          <span style={{ color:"#00ff88" }}>ATTEST × 5</span>
          <span style={{ color:"#a78bfa" }}>NFT × 25</span>
        </div>
      </div>
      <LeaderboardTable limit={limit} />
    </div>
  );
}