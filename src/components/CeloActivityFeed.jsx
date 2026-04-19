"use client";
import { useCeloEvents } from "@/hooks/useCeloEvents";
import DocTypeTag from "./DocTypeTag";
import Spinner from "./Spinner";

export default function CeloActivityFeed({ limit = 10 }) {
  const { events, loading } = useCeloEvents(limit);

  if (loading) return <div style={{ padding:20 }}><Spinner /></div>;
  if (!events.length) return (
    <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#555", padding:12 }}>
      No Celo events found yet
    </div>
  );

  return (
    <div>
      {events.map((e, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
          padding:"12px 0", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ width:6, height:6, borderRadius:"50%",
            background:"#35D07F", flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13,
              color:"#f5f0e8", marginBottom:4 }}>
              {e.title || "Untitled"}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              {e.docType && <DocTypeTag type={e.docType} />}
              <span style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#555" }}>
                Block #{e.blockNumber?.toLocaleString()}
              </span>
              <a href={`https://celoscan.io/tx/${e.txHash}`}
                target="_blank" rel="noreferrer"
                style={{ fontFamily:"Space Mono, monospace", fontSize:9,
                  color:"#35D07F", textDecoration:"none" }}>
                tx ↗
              </a>
            </div>
          </div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#444",
            flexShrink:0 }}>
            {e.owner?.slice(0,6)}...{e.owner?.slice(-4)}
          </div>
        </div>
      ))}
    </div>
  );
}