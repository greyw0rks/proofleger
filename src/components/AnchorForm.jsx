"use client";
import { useState, useRef } from "react";
import { useHash } from "@/hooks/useHash";
import { useAnchor } from "@/hooks/useAnchor";
const TYPES = ["diploma","certificate","research","art","contribution","award","other"];
export default function AnchorForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("diploma");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const { hash, hashing, hashFile } = useHash();
  const { anchor, loading, error, txId } = useAnchor();
  async function handleFile(f) { setFile(f); await hashFile(f); }
  async function handleSubmit() {
    if (!hash || !title.trim()) return;
    const tx = await anchor(hash, title.trim(), docType);
    if (tx) onSuccess?.(tx, hash, title, docType);
  }
  const btn = { background:"#F7931A", border:"3px solid #F7931A", color:"#000", padding:"14px", width:"100%", fontFamily:"Archivo Black, sans-serif", fontSize:14, cursor:"pointer", boxShadow:"4px 4px 0 #d4780f" };
  const input = { width:"100%", background:"transparent", border:"3px solid #f5f0e8", color:"#f5f0e8", padding:"12px 16px", fontFamily:"Space Mono, monospace", fontSize:13, outline:"none", marginBottom:16 };
  return (
    <div>
      <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
        onClick={()=>fileRef.current?.click()}
        style={{ border:`3px ${dragging?"solid #F7931A":"dashed #444"}`, padding:32, textAlign:"center", cursor:"pointer", marginBottom:16 }}>
        <input ref={fileRef} type="file" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13, color:"#555" }}>{hashing?"HASHING...":file?file.name:"DROP FILE OR CLICK"}</div>
        {hash && <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#F7931A", marginTop:8, wordBreak:"break-all" }}>{hash}</div>}
      </div>
      <input style={input} placeholder="Document title..." value={title} onChange={e=>setTitle(e.target.value)} />
      <select style={{...input, background:"#0a0a0a", cursor:"pointer"}} value={docType} onChange={e=>setDocType(e.target.value)}>
        {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
      </select>
      <button style={btn} onClick={handleSubmit} disabled={loading||!hash||!title.trim()}>
        {loading?"ANCHORING TO BITCOIN...":"ANCHOR DOCUMENT"}
      </button>
      {error && <div style={{ color:"#ff3333", fontFamily:"Space Mono, monospace", fontSize:11, marginTop:8 }}>{error}</div>}
      {txId && <div style={{ color:"#00ff88", fontFamily:"Space Mono, monospace", fontSize:11, marginTop:8 }}>✓ Anchored! TX: {String(txId).slice(0,16)}...</div>}
    </div>
  );
}