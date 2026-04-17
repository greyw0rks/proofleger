"use client";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { getRankLabel } from "@/lib/leaderboard-builder";
import Spinner from "./Spinner";

export default function LeaderboardTable({ limit = 10 }) {
  const { entries, loading } = useLeaderboard(limit);

  if (loading) return <div style={{ padding:20 }}><Spinner /></div>;

  return (
    <div>
      {entries.map((e, i) => (
        <div key={e.address} style={{ display:"flex", alignItems:"center", gap:16,
          padding:"14px 0", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:18,
            color:"#F7931A", minWidth:36, textAlign:"center" }}>
            {getRankLabel(i + 1)}
          </div>
          <div style={{ flex:1 }}>
            <a href={`/profile/${e.address}`}
              style={{ fontFamily:"Space Mono, monospace", fontSize:11,
                color:"#f5f0e8", textDecoration:"none" }}
              onMouseOver={ev => ev.target.style.color="#F7931A"}
              onMouseOut={ev => ev.target.style.color="#f5f0e8"}>
              {e.address.slice(0,10)}...{e.address.slice(-6)}
            </a>
          </div>
          <div style={{ display:"flex", gap:12, fontFamily:"Space Mono, monospace", fontSize:10 }}>
            <span style={{ color:"#F7931A" }}>{e.anchors}A</span>
            <span style={{ color:"#00ff88" }}>{e.attests}T</span>
            <span style={{ color:"#a78bfa" }}>{e.mints}N</span>
          </div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
            color:"#f5f0e8", minWidth:48, textAlign:"right" }}>
            {e.score}
          </div>
        </div>
      ))}
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#444",
        marginTop:12, textAlign:"right" }}>
        A=Anchors · T=Attests · N=NFTs · Score = A×10 + T×5 + N×25
      </div>
    </div>
  );
}