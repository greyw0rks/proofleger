"use client";
import { useState } from "react";
import { useCeloAnchor } from "@/hooks/useCeloAnchor";
import { useCeloBalance } from "@/hooks/useCeloBalance";
import Spinner from "./Spinner";

const DOC_TYPES = ["diploma","certificate","research","contribution","award","art","other"];

export default function CeloAnchorPanel({ hash, onSuccess }) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("diploma");
  const { anchor, loading, txHash, error } = useCeloAnchor();
  const { balance } = useCeloBalance();

  const input = { width:"100%", background:"transparent", border:"3px solid #333",
    color:"#f5f0e8", padding:"12px 14px", fontFamily:"Space Mono, monospace",
    fontSize:12, outline:"none", marginBottom:12 };

  async function handleAnchor() {
    if (!hash || !title.trim()) return;
    const tx = await anchor(hash, title.trim(), docType);
    if (tx && onSuccess) onSuccess(tx);
  }

  return (
    <div style={{ border:"3px solid #35D07F", padding:24,
      boxShadow:"6px 6px 0 #35D07F", background:"#0a0a0a" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
          color:"#35D07F", letterSpacing:1 }}>ANCHOR ON CELO</div>
        {balance && (
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#666" }}>
            {balance} CELO
          </div>
        )}
      </div>
      <input style={input} placeholder="Document title..."
        value={title} onChange={e => setTitle(e.target.value)} />
      <select style={{...input, background:"#0a0a0a", cursor:"pointer"}}
        value={docType} onChange={e => setDocType(e.target.value)}>
        {DOC_TYPES.map(t => (
          <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
        ))}
      </select>
      <button onClick={handleAnchor} disabled={loading || !hash || !title.trim()}
        style={{ width:"100%", background: hash&&title.trim()&&!loading?"#35D07F":"#222",
          border:`3px solid ${hash&&title.trim()?"#35D07F":"#333"}`,
          color: hash&&title.trim()&&!loading?"#000":"#555",
          padding:14, fontFamily:"Archivo Black, sans-serif",
          fontSize:13, cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", gap:8 }}>
        {loading ? <><Spinner size={16} color="#000" /> ANCHORING...</> : "ANCHOR TO CELO"}
      </button>
      {txHash && (
        <div style={{ marginTop:12, fontFamily:"Space Mono, monospace", fontSize:10, color:"#35D07F" }}>
          ✓ Anchored!{" "}
          <a href={`https://celoscan.io/tx/${txHash}`} target="_blank" rel="noreferrer"
            style={{ color:"#35D07F" }}>View on CeloScan ↗</a>
        </div>
      )}
      {error && (
        <div style={{ marginTop:12, fontFamily:"Space Mono, monospace", fontSize:10, color:"#ff3333" }}>
          {error.slice(0, 100)}
        </div>
      )}
    </div>
  );
}