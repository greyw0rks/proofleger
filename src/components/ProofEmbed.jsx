"use client";
import { useEffect, useState } from "react";
import { verifyDocument } from "@/lib/wallet";
import DocTypeTag from "./DocTypeTag";
import BlockBadge from "./BlockBadge";

export default function ProofEmbed({ hash, compact = false }) {
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyDocument(hash)
      .then(r => { setProof(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [hash]);

  if (loading) return (
    <div style={{ padding:12, fontFamily:"Space Mono, monospace", fontSize:10, color:"#666" }}>
      Verifying...
    </div>
  );

  const verified = proof && proof !== "0x09";
  return (
    <div style={{ border:`3px solid ${verified ? "#00ff88" : "#333"}`,
      padding: compact ? 12 : 20, background:"#0a0a0a",
      fontFamily:"Space Grotesk, sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: compact ? 6 : 12 }}>
        <div style={{ width:8, height:8, borderRadius:"50%",
          background: verified ? "#00ff88" : "#444" }} />
        <div style={{ fontFamily:"Archivo Black, sans-serif",
          fontSize: compact ? 10 : 13, color: verified ? "#00ff88" : "#555",
          letterSpacing:1 }}>
          {verified ? "VERIFIED ON BITCOIN" : "NOT FOUND"}
        </div>
      </div>
      {verified && proof && (
        <div>
          {!compact && (
            <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16,
              color:"#f5f0e8", marginBottom:8 }}>
              {proof.title || "Document"}
            </div>
          )}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {proof["doc-type"] && <DocTypeTag type={proof["doc-type"]} />}
            {proof["block-height"] && <BlockBadge blockHeight={proof["block-height"]} />}
          </div>
          {!compact && (
            <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
              color:"#444", marginTop:8, wordBreak:"break-all" }}>
              {hash?.slice(0,32)}...
            </div>
          )}
        </div>
      )}
      <div style={{ marginTop:compact?6:12, fontFamily:"Space Mono, monospace",
        fontSize:8, color:"#333" }}>
        proofleger.vercel.app
      </div>
    </div>
  );
}