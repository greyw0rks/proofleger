"use client";
import { useState } from "react";
import { useHash } from "@/hooks/useHash";
const PUB_TYPES = ["research","review","conference","preprint","thesis","patent","article"];
export default function PublishPage() {
  const [title, setTitle] = useState("");
  const [doi, setDoi] = useState("");
  const [pubType, setPubType] = useState("research");
  const [file, setFile] = useState(null);
  const { hash, hashing, hashFile } = useHash();
  const input = { width:"100%", background:"transparent", border:"3px solid #333",
    color:"#f5f0e8", padding:"12px 16px", fontFamily:"Space Mono, monospace",
    fontSize:12, outline:"none", marginBottom:16 };
  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>PUBLISH</h1>
      <p style={{ color:"#888", marginBottom:32, fontSize:13 }}>
        Register research publications on Bitcoin via Stacks
      </p>
      <div onClick={() => document.getElementById("pub-file").click()}
        style={{ border:"3px dashed #444", padding:24, textAlign:"center",
          cursor:"pointer", marginBottom:16 }}>
        <input id="pub-file" type="file" style={{display:"none"}}
          onChange={e=>{setFile(e.target.files[0]);hashFile(e.target.files[0]);}} />
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13, color:"#555" }}>
          {hashing ? "HASHING..." : file ? file.name : "UPLOAD PAPER (PDF)"}
        </div>
        {hash && <div style={{ fontFamily:"Space Mono, monospace", fontSize:10,
          color:"#F7931A", marginTop:6, wordBreak:"break-all" }}>{hash.slice(0,32)}...</div>}
      </div>
      <input style={input} placeholder="Paper title..." value={title} onChange={e=>setTitle(e.target.value)} />
      <input style={input} placeholder="DOI (optional)..." value={doi} onChange={e=>setDoi(e.target.value)} />
      <select style={{...input, background:"#0a0a0a", cursor:"pointer"}}
        value={pubType} onChange={e=>setPubType(e.target.value)}>
        {PUB_TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
      </select>
      <button disabled={!hash||!title.trim()}
        style={{ width:"100%", background:hash&&title.trim()?"#F7931A":"#222",
          border:`3px solid ${hash&&title.trim()?"#F7931A":"#333"}`,
          color:hash&&title.trim()?"#000":"#555",
          padding:14, fontFamily:"Archivo Black, sans-serif", fontSize:13, cursor:"pointer" }}>
        PUBLISH ON BITCOIN
      </button>
    </div>
  );
}