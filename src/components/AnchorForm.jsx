"use client";
import { useState } from "react";
import { useAnchor } from "@/hooks/useAnchor";
import { useNetworkContext } from "@/context/NetworkContext";
import { useCeloAnchor } from "@/hooks/useCeloAnchor";
import FileDropZone from "./FileDropZone";
import ChainSelector from "./ChainSelector";
import TxStatusBadge from "./TxStatusBadge";
import Spinner from "./Spinner";

const DOC_TYPES = ["diploma","certificate","research","contribution","award","art","other"];

export default function AnchorForm() {
  const [hash, setHash]       = useState(null);
  const [title, setTitle]     = useState("");
  const [docType, setDocType] = useState("diploma");
  const { network }           = useNetworkContext();
  const stacksAnchor          = useAnchor();
  const celoAnchor            = useCeloAnchor();

  const { anchor, loading, txId, error } =
    network.id === "celo" ? celoAnchor : stacksAnchor;

  const canSubmit = hash && title.trim() && !loading;

  const input = { width:"100%", background:"transparent", border:"3px solid #333",
    color:"#f5f0e8", padding:"12px 14px", fontFamily:"Space Mono, monospace",
    fontSize:12, outline:"none", marginBottom:12,
    boxSizing:"border-box" };

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
          color:"#555", marginBottom:10, letterSpacing:2 }}>NETWORK</div>
        <ChainSelector />
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
          color:"#555", marginBottom:10, letterSpacing:2 }}>DOCUMENT</div>
        <FileDropZone onHash={setHash} />
      </div>
      {hash && (
        <div>
          <input style={input} placeholder="Document title (max 100 chars)..."
            value={title} onChange={e => setTitle(e.target.value.slice(0, 100))} />
          <select style={{ ...input, background:"#0a0a0a", cursor:"pointer" }}
            value={docType} onChange={e => setDocType(e.target.value)}>
            {DOC_TYPES.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <button onClick={() => anchor(hash, title.trim(), docType)}
            disabled={!canSubmit}
            style={{ width:"100%", background: canSubmit ? "#F7931A" : "#222",
              border:`3px solid ${canSubmit ? "#F7931A" : "#333"}`,
              color: canSubmit ? "#000" : "#555",
              padding:16, fontFamily:"Archivo Black, sans-serif", fontSize:14,
              cursor: canSubmit ? "pointer" : "default",
              boxShadow: canSubmit ? "4px 4px 0 #d4780f" : "none",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {loading
              ? <><Spinner size={18} color="#555" /> ANCHORING...</>
              : `ANCHOR TO ${network.label.toUpperCase()}`}
          </button>
          {error && (
            <div style={{ fontFamily:"Space Mono, monospace", fontSize:10,
              color:"#ff3333", marginTop:12 }}>{error}</div>
          )}
          {txId && (
            <div style={{ marginTop:16 }}>
              <TxStatusBadge txId={txId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}