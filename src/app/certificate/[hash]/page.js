"use client";
import { useState, useEffect, use } from "react";
import { verifyDocument } from "@/lib/wallet";
import { exportProofCertificate, exportProofText } from "@/lib/export";

export default function CertificatePage({ params }) {
  const { hash } = use(params);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyDocument(hash)
      .then(r => { setProof(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [hash]);

  if (loading) return <div style={{ padding:40, color:"#666", fontFamily:"Space Mono, monospace" }}>Loading...</div>;
  if (!proof) return <div style={{ padding:40, color:"#ff3333", fontFamily:"Space Mono, monospace" }}>NOT FOUND</div>;

  return (
    <div style={{ maxWidth:680, margin:"40px auto", padding:"0 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8" }}>
      <div style={{ border:"4px solid #F7931A", padding:40, boxShadow:"8px 8px 0 #F7931A",
        background:"#0a0a0a" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
            color:"#F7931A", letterSpacing:4, marginBottom:12 }}>PROOFLEGER</div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28,
            color:"#f5f0e8", marginBottom:4 }}>CERTIFICATE OF PROOF</div>
          <div style={{ fontSize:12, color:"#555" }}>Anchored to Bitcoin via Stacks</div>
        </div>
        <div style={{ borderTop:"2px solid #222", borderBottom:"2px solid #222",
          padding:"24px 0", marginBottom:24 }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:20,
            color:"#f5f0e8", textAlign:"center", marginBottom:8 }}>
            {proof.title || "Untitled Document"}
          </div>
          <div style={{ textAlign:"center", color:"#888", fontSize:12 }}>
            {proof["doc-type"] || proof.docType}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16,
          fontFamily:"Space Mono, monospace", fontSize:11, marginBottom:24 }}>
          {[["BLOCK HEIGHT", `#${proof["block-height"] || proof.blockHeight}`],
            ["NETWORK", "Stacks Mainnet"],
            ["OWNER", `${proof.owner?.slice(0,10)}...`],
            ["VERIFIED", "✓ ON BITCOIN"]].map(([k,v]) => (
            <div key={k}>
              <div style={{ color:"#555", marginBottom:4, fontSize:9, letterSpacing:1 }}>{k}</div>
              <div style={{ color:"#f5f0e8" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
          color:"#444", wordBreak:"break-all", marginBottom:24 }}>
          HASH: {hash}
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <button onClick={() => exportProofCertificate({ ...proof, hash })}
            style={{ border:"2px solid #F7931A", background:"transparent",
              color:"#F7931A", padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>EXPORT JSON</button>
          <button onClick={() => exportProofText({ ...proof, hash })}
            style={{ border:"2px solid #f5f0e8", background:"transparent",
              color:"#f5f0e8", padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>EXPORT TXT</button>
          <button onClick={() => window.print()}
            style={{ border:"2px solid #00ff88", background:"transparent",
              color:"#00ff88", padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>PRINT</button>
        </div>
      </div>
    </div>
  );
}