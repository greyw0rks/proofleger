"use client";
import { useState } from "react";
import { useWalletScan } from "@/hooks/useWalletScan";
import StatCard from "./StatCard";
import Spinner from "./Spinner";

export default function WalletScanner() {
  const [input, setInput] = useState("");
  const { scan, result, nfts, loading, error } = useWalletScan();

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Enter SP address..."
          onKeyDown={e => e.key === "Enter" && scan(input.trim())}
          style={{ flex:1, background:"transparent", border:"3px solid #333",
            color:"#f5f0e8", padding:"12px 16px", fontFamily:"Space Mono, monospace",
            fontSize:12, outline:"none" }}
          onFocus={e => e.target.style.borderColor="#F7931A"}
          onBlur={e => e.target.style.borderColor="#333"} />
        <button onClick={() => scan(input.trim())} disabled={loading}
          style={{ background:"#F7931A", border:"3px solid #F7931A", color:"#000",
            padding:"12px 20px", fontFamily:"Archivo Black, sans-serif",
            fontSize:12, cursor:"pointer" }}>
          {loading ? <Spinner size={16} color="#000" /> : "SCAN"}
        </button>
      </div>
      {error && <div style={{ color:"#ff3333", fontFamily:"Space Mono, monospace", fontSize:11 }}>{error}</div>}
      {result && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:20 }}>
            <StatCard label="ANCHORS" value={result.breakdown.anchors} color="#F7931A" />
            <StatCard label="ATTESTS" value={result.breakdown.attests} color="#00ff88" />
            <StatCard label="MINTS" value={result.breakdown.mints} color="#a78bfa" />
            <StatCard label="NFTS" value={nfts.length} color="#38bdf8" />
          </div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555" }}>
            {result.proofTransactions} ProofLedger txs of {result.total} total
          </div>
        </div>
      )}
    </div>
  );
}