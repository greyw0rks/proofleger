"use client";
import { useCredentialVerify } from "@/hooks/useCredentialVerify";
import { useEffect } from "react";
import DocTypeTag from "./DocTypeTag";
import BlockBadge from "./BlockBadge";
import Badge from "./Badge";

export default function CredentialCard({ hash, title, docType, blockHeight, owner, autoVerify = true }) {
  const { verify, result, loading, isVerified, isRevoked } = useCredentialVerify();

  useEffect(() => { if (autoVerify && hash) verify(hash); }, [hash]);

  const statusVariant = loading ? "neutral" : isRevoked ? "error" : isVerified ? "success" : "neutral";
  const statusLabel = loading ? "CHECKING..." : isRevoked ? "REVOKED" : isVerified ? "VERIFIED" : "UNVERIFIED";

  return (
    <div style={{ border:`3px solid ${isRevoked?"#ff3333":isVerified?"#00ff88":"#333"}`,
      padding:20, background:"#0a0a0a",
      boxShadow: isVerified ? "6px 6px 0 #00ff88" : isRevoked ? "6px 6px 0 #ff3333" : "none" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16, color:"#f5f0e8", flex:1, marginRight:12 }}>
          {title || "Untitled"}
        </div>
        <Badge label={statusLabel} variant={statusVariant} dot />
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
        {docType && <DocTypeTag type={docType} />}
        {blockHeight && <BlockBadge blockHeight={blockHeight} />}
      </div>
      {result?.endorsements > 0 && (
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#00ff88", marginBottom:8 }}>
          ✓ {result.endorsements} endorsement{result.endorsements !== 1 ? "s" : ""}
        </div>
      )}
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
        color:"#444", wordBreak:"break-all", marginTop:8 }}>
        {hash?.slice(0,32)}...
      </div>
    </div>
  );
}