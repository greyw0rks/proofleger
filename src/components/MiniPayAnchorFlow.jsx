"use client";
import { useState } from "react";
import { useMiniPay } from "@/hooks/useMiniPay";
import { useCeloAnchor } from "@/hooks/useCeloAnchor";
import { useHash } from "@/hooks/useHash";
import Spinner from "./Spinner";

export default function MiniPayAnchorFlow() {
  const { address, connect, isConnected } = useMiniPay();
  const { anchor, loading, txHash, error } = useCeloAnchor();
  const { hash, hashing, hashFile } = useHash();
  const [title, setTitle] = useState("");
  const [step, setStep] = useState("upload"); // upload → review → done

  async function handleFile(f) {
    await hashFile(f);
    setStep("review");
  }

  async function handleAnchor() {
    if (!isConnected) { await connect(); return; }
    await anchor(hash, title || "Document", "diploma");
    setStep("done");
  }

  const btn = { width:"100%", padding:16, fontFamily:"Archivo Black, sans-serif",
    fontSize:14, cursor:"pointer", border:"none" };

  if (step === "done") return (
    <div style={{ textAlign:"center", padding:32 }}>
      <div style={{ fontSize:48, marginBottom:16 }}>✓</div>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:20,
        color:"#35D07F", marginBottom:8 }}>ANCHORED</div>
      <a href={`https://celoscan.io/tx/${txHash}`} target="_blank" rel="noreferrer"
        style={{ fontFamily:"Space Mono, monospace", fontSize:11,
          color:"#35D07F", display:"block", marginBottom:20 }}>
        View on CeloScan ↗
      </a>
      <button onClick={() => { setStep("upload"); setTitle(""); }}
        style={{...btn, background:"#1a1a1a", color:"#f5f0e8", border:"3px solid #333" }}>
        ANCHOR ANOTHER
      </button>
    </div>
  );

  return (
    <div style={{ padding:24 }}>
      {step === "upload" && (
        <div>
          <div style={{ border:"3px dashed #444", padding:40, textAlign:"center",
            marginBottom:20 }}
            onClick={() => document.getElementById("mp-file").click()}>
            <input id="mp-file" type="file" style={{display:"none"}}
              onChange={e => handleFile(e.target.files[0])} />
            <div style={{ fontFamily:"Archivo Black, sans-serif",
              fontSize:14, color:"#555" }}>
              {hashing ? "HASHING..." : "TAP TO SELECT FILE"}
            </div>
          </div>
        </div>
      )}
      {step === "review" && (
        <div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10,
            color:"#35D07F", wordBreak:"break-all", marginBottom:16 }}>{hash}</div>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Document title (optional)"
            style={{ width:"100%", background:"transparent", border:"3px solid #333",
              color:"#f5f0e8", padding:"14px 16px", fontFamily:"Space Mono, monospace",
              fontSize:13, outline:"none", marginBottom:16 }} />
          <button onClick={handleAnchor} disabled={loading}
            style={{...btn, background:"#35D07F", color:"#000",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {loading ? <><Spinner size={18} color="#000" /> ANCHORING...</> : "ANCHOR TO CELO"}
          </button>
          {error && <div style={{ color:"#ff3333", fontFamily:"Space Mono, monospace",
            fontSize:11, marginTop:12 }}>{error.slice(0,80)}</div>}
        </div>
      )}
    </div>
  );
}