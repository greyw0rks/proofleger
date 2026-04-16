"use client";
import { useState } from "react";
import { useAnchor } from "@/hooks/useAnchor";
import { useHash } from "@/hooks/useHash";

export default function CredentialIssuance({ issuerAddress }) {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("certificate");
  const { hashText } = useHash();
  const { anchor, loading, txId, error } = useAnchor();

  async function issue() {
    if (!recipient || !title) return;
    const content = `${type}:${title}:${recipient}:${Date.now()}`;
    const hash = await hashText(content);
    await anchor(hash, title, type);
  }

  const input = { width:"100%", background:"transparent", border:"3px solid #333",
    color:"#f5f0e8", padding:"10px 14px", fontFamily:"Space Mono, monospace",
    fontSize:12, outline:"none", marginBottom:12 };

  return (
    <div style={{ border:"3px solid #f5f0e8", padding:24, boxShadow:"6px 6px 0 #f5f0e8" }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
        color:"#F7931A", marginBottom:16, letterSpacing:1 }}>ISSUE CREDENTIAL</div>
      <input style={input} placeholder="Recipient SP address..."
        value={recipient} onChange={e=>setRecipient(e.target.value)} />
      <input style={input} placeholder="Credential title..."
        value={title} onChange={e=>setTitle(e.target.value)} />
      <select style={{...input, background:"#0a0a0a", cursor:"pointer"}}
        value={type} onChange={e=>setType(e.target.value)}>
        {["certificate","diploma","award","contribution"].map(t =>
          <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
        )}
      </select>
      <button onClick={issue} disabled={loading||!recipient||!title}
        style={{ width:"100%", background:"#F7931A", border:"3px solid #F7931A",
          color:"#000", padding:14, fontFamily:"Archivo Black, sans-serif",
          fontSize:13, cursor:"pointer" }}>
        {loading ? "ISSUING..." : "ISSUE CREDENTIAL"}
      </button>
      {txId && <div style={{ marginTop:12, fontFamily:"Space Mono, monospace",
        fontSize:10, color:"#00ff88" }}>✓ Issued! TX: {String(txId).slice(0,16)}...</div>}
      {error && <div style={{ marginTop:12, fontFamily:"Space Mono, monospace",
        fontSize:10, color:"#ff3333" }}>{error}</div>}
    </div>
  );
}