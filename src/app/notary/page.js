"use client";
import { useState } from "react";
import { useHash } from "@/hooks/useHash";
export default function NotaryPage() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const { hash, hashing, hashFile } = useHash();
  async function handleFile(f) { setFile(f); await hashFile(f); }
  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>NOTARIZE</h1>
      <p style={{ color:"#888", marginBottom:32, fontSize:13 }}>
        Anchor a document with multiple on-chain witness signatures
      </p>
      <div onDragOver={e=>{e.preventDefault();}} onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}
        onClick={() => document.getElementById("notary-file").click()}
        style={{ border:"3px dashed #444", padding:32, textAlign:"center",
          cursor:"pointer", marginBottom:16 }}>
        <input id="notary-file" type="file" style={{display:"none"}}
          onChange={e=>handleFile(e.target.files[0])} />
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13, color:"#555" }}>
          {hashing ? "HASHING..." : file ? file.name : "DROP DOCUMENT OR CLICK"}
        </div>
        {hash && <div style={{ fontFamily:"Space Mono, monospace", fontSize:10,
          color:"#F7931A", marginTop:8, wordBreak:"break-all" }}>{hash}</div>}
      </div>
      <textarea value={description} onChange={e=>setDescription(e.target.value)}
        placeholder="Document description..."
        style={{ width:"100%", background:"transparent", border:"3px solid #333",
          color:"#f5f0e8", padding:"12px 16px", fontFamily:"Space Mono, monospace",
          fontSize:12, outline:"none", resize:"vertical", minHeight:80, marginBottom:16 }} />
      <button disabled={!hash || !description.trim()}
        style={{ width:"100%", background: hash&&description.trim() ? "#F7931A" : "#222",
          border:`3px solid ${hash&&description.trim()?"#F7931A":"#333"}`,
          color: hash&&description.trim() ? "#000" : "#555",
          padding:14, fontFamily:"Archivo Black, sans-serif", fontSize:13, cursor:"pointer" }}>
        NOTARIZE ON BITCOIN
      </button>
    </div>
  );
}