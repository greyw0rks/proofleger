"use client";
import { use, useState, useEffect } from "react";
import { verifyDocument } from "@/lib/wallet";
import VerifyResult from "@/components/VerifyResult";
import TxLink from "@/components/TxLink";

export default function CredentialPage({ params }) {
  const { hash } = use(params);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyDocument(hash)
      .then(r => { setProof(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [hash]);

  return (
    <div style={{ maxWidth:640, margin:"60px auto", padding:"0 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8", minHeight:"100vh",
      background:"#0a0a0a" }}>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555", marginBottom:20 }}>
        CREDENTIAL RECORD
      </div>
      {loading
        ? <div style={{ color:"#666", fontFamily:"Space Mono, monospace" }}>Verifying on Bitcoin...</div>
        : <VerifyResult result={proof} hash={hash} />
      }
      <div style={{ marginTop:20, display:"flex", gap:12 }}>
        <a href={`/certificate/${hash}`}
          style={{ border:"2px solid #F7931A", color:"#F7931A", padding:"8px 16px",
            fontFamily:"Archivo Black, sans-serif", fontSize:11, textDecoration:"none" }}>
          VIEW CERTIFICATE
        </a>
        <a href={`/verify?hash=${hash}`}
          style={{ border:"2px solid #333", color:"#666", padding:"8px 16px",
            fontFamily:"Archivo Black, sans-serif", fontSize:11, textDecoration:"none" }}>
          VERIFY AGAIN
        </a>
      </div>
    </div>
  );
}