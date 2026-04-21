"use client";
import { useProofHistory } from "@/hooks/useProofHistory";
import DocTypeTag from "./DocTypeTag";
import EmptyState from "./EmptyState";

export default function HistoryPanel({ onReAnchor }) {
  const { history, loading, clear } = useProofHistory();
  if (loading) return null;
  if (!history.length) return (
    <EmptyState title="NO HISTORY" subtitle="Anchored documents will appear here" />
  );
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:16 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
          color:"#555", letterSpacing:2 }}>LOCAL HISTORY ({history.length})</div>
        <button onClick={clear}
          style={{ border:"none", background:"transparent", color:"#444",
            fontFamily:"Space Mono, monospace", fontSize:10, cursor:"pointer" }}>
          CLEAR
        </button>
      </div>
      {history.map((item, i) => (
        <div key={i} style={{ border:"2px solid #1a1a1a", padding:14, marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", marginBottom:8 }}>
            <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13,
              color:"#f5f0e8", flex:1, marginRight:12 }}>
              {item.title || "Untitled"}
            </div>
            {item.docType && <DocTypeTag type={item.docType} />}
          </div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
            color:"#444", wordBreak:"break-all", marginBottom:8 }}>
            {item.hash?.slice(0,32)}...
          </div>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center" }}>
            <span style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#555" }}>
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
            </span>
            {onReAnchor && (
              <button onClick={() => onReAnchor(item)}
                style={{ border:"2px solid #333", background:"transparent",
                  color:"#888", padding:"4px 10px", fontFamily:"Archivo Black, sans-serif",
                  fontSize:9, cursor:"pointer" }}>
                RE-ANCHOR
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}