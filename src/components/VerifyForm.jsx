"use client";
import { useState } from "react";
import { useVerify }     from "@/hooks/useVerify";
import { useCeloVerify } from "@/hooks/useCeloVerify";
import { useHash }       from "@/hooks/useHash";
import VerifyResult      from "./VerifyResult";
import CeloVerifyResult  from "./CeloVerifyResult";
import MultiChainBadge   from "./MultiChainBadge";
import Spinner           from "./Spinner";

export default function VerifyForm() {
  const [input, setInput] = useState("");
  const [mode, setMode]   = useState("hash"); // "hash" | "file"
  const stacksVerify = useVerify();
  const celoVerify   = useCeloVerify();
  const { hashFile, hash: fileHash, hashing } = useHash();

  const activeHash = mode === "file" ? fileHash : input.trim();
  const loading    = stacksVerify.loading || celoVerify.loading;

  async function handleVerify() {
    if (!activeHash) return;
    await Promise.all([
      stacksVerify.verify(activeHash),
      celoVerify.verify(activeHash),
    ]);
  }

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["hash","file"].map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{ border:`2px solid ${mode===m?"#F7931A":"#333"}`,
              background:"transparent", color:mode===m?"#F7931A":"#555",
              padding:"6px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:10, cursor:"pointer", letterSpacing:1 }}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>
      {mode === "hash" ? (
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="SHA-256 hash (64 hex chars)..."
            onKeyDown={e => e.key === "Enter" && handleVerify()}
            style={{ flex:1, background:"transparent", border:"3px solid #333",
              color:"#f5f0e8", padding:"12px 14px",
              fontFamily:"Space Mono, monospace", fontSize:12, outline:"none" }} />
          <button onClick={handleVerify} disabled={loading || !input.trim()}
            style={{ background:"#F7931A", border:"3px solid #F7931A", color:"#000",
              padding:"12px 20px", fontFamily:"Archivo Black, sans-serif",
              fontSize:12, cursor:"pointer", flexShrink:0 }}>
            {loading ? <Spinner size={16} color="#000" /> : "VERIFY"}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom:20 }}>
          <div onClick={() => document.getElementById("vf-file").click()}
            style={{ border:"3px dashed #333", padding:32, textAlign:"center",
              cursor:"pointer", marginBottom:8 }}>
            <input id="vf-file" type="file" style={{ display:"none" }}
              onChange={e => hashFile(e.target.files[0])} />
            <div style={{ fontFamily:"Archivo Black, sans-serif",
              fontSize:13, color:"#555" }}>
              {hashing ? "HASHING..." : fileHash ? fileHash.slice(0,20)+"..." : "DROP FILE TO HASH AND VERIFY"}
            </div>
          </div>
          {fileHash && (
            <button onClick={handleVerify} disabled={loading}
              style={{ width:"100%", background:"#F7931A", border:"3px solid #F7931A",
                color:"#000", padding:12, fontFamily:"Archivo Black, sans-serif",
                fontSize:12, cursor:"pointer" }}>
              {loading ? "VERIFYING..." : "VERIFY THIS FILE"}
            </button>
          )}
        </div>
      )}
      {(stacksVerify.result || celoVerify.result) && (
        <div>
          <div style={{ marginBottom:16 }}>
            <MultiChainBadge
              stacksVerified={stacksVerify.exists}
              celoVerified={celoVerify.result?.exists === true}
            />
          </div>
          {stacksVerify.result && (
            <div style={{ marginBottom:12 }}>
              <VerifyResult result={stacksVerify.result} hash={activeHash} />
            </div>
          )}
          {celoVerify.result && (
            <CeloVerifyResult result={celoVerify.result} hash={activeHash} />
          )}
        </div>
      )}
    </div>
  );
}