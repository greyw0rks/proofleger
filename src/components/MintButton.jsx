"use client";
import { useMintNFT } from "@/hooks/useMintNFT";
import TxLink from "./TxLink";
import Spinner from "./Spinner";

export default function MintButton({ hash, onMinted }) {
  const { mint, loading, txId, error } = useMintNFT();

  if (txId) return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ fontFamily:"Archivo Black, sans-serif",
        fontSize:9, color:"#a78bfa", letterSpacing:1 }}>NFT MINTED</span>
      <TxLink txId={txId} />
    </div>
  );

  return (
    <div>
      <button onClick={() => { mint(hash).then(() => onMinted?.()); }}
        disabled={loading}
        style={{ border:"2px solid #a78bfa", background:"transparent",
          color: loading ? "#555" : "#a78bfa",
          padding:"5px 12px", fontFamily:"Archivo Black, sans-serif",
          fontSize:9, cursor: loading ? "default" : "pointer",
          letterSpacing:1, display:"flex", alignItems:"center", gap:6 }}>
        {loading ? <><Spinner size={12} color="#a78bfa" /> MINTING...</> : "MINT NFT"}
      </button>
      {error && (
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
          color:"#ff3333", marginTop:4 }}>{error.slice(0, 60)}</div>
      )}
    </div>
  );
}