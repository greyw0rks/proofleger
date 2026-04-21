"use client";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import DocTypeTag from "./DocTypeTag";
import Spinner from "./Spinner";

const FN_LABEL = { store:"ANCHORED", "attest-document":"ATTESTED", "mint-nft":"MINTED" };
const FN_COLOR = { store:"#F7931A", "attest-document":"#00ff88", "mint-nft":"#a78bfa" };

export default function ActivityFeed({ limit = 15 }) {
  const { activity, loading } = useRecentActivity(limit);
  if (loading) return <div style={{ padding:20 }}><Spinner /></div>;
  if (!activity.length) return (
    <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#555", padding:12 }}>
      No recent activity
    </div>
  );
  return (
    <div>
      {activity.map((a, i) => {
        const label = Object.entries(FN_LABEL).find(([k]) => a.fn.includes(k))?.[1] || a.fn.toUpperCase();
        const color = Object.entries(FN_COLOR).find(([k]) => a.fn.includes(k))?.[1] || "#555";
        const titleArg = a.args[1]?.repr?.replace(/^"|"$/g,"");
        return (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12,
            padding:"12px 0", borderBottom:"1px solid #111" }}>
            <div style={{ width:6, height:6, borderRadius:"50%",
              background:color, flexShrink:0, marginTop:6 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                <span style={{ fontFamily:"Archivo Black, sans-serif",
                  fontSize:9, color, letterSpacing:1 }}>{label}</span>
                {titleArg && (
                  <span style={{ fontFamily:"Space Grotesk, sans-serif",
                    fontSize:12, color:"#f5f0e8" }}>{titleArg.slice(0,36)}</span>
                )}
              </div>
              <div style={{ display:"flex", gap:10, fontFamily:"Space Mono, monospace",
                fontSize:9, color:"#555" }}>
                <span>{a.sender?.slice(0,10)}...</span>
                <span>Block #{a.block?.toLocaleString()}</span>
                <a href={`https://explorer.hiro.so/txid/${a.txid}`}
                  target="_blank" rel="noreferrer"
                  style={{ color:"#444", textDecoration:"none" }}>tx ↗</a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}