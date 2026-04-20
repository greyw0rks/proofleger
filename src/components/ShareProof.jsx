"use client";
import { useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";
import { buildShareUrl, generateQR, nativeShare } from "@/lib/share-handler";
import Modal from "./Modal";

export default function ShareProof({ hash, title, open, onClose }) {
  const shareUrl = buildShareUrl("proof", hash);
  const { copy, copied } = useClipboard();
  const [showQR, setShowQR] = useState(false);
  const qrUrl = generateQR(shareUrl);

  return (
    <Modal open={open} onClose={onClose} title="SHARE PROOF">
      <div style={{ fontFamily:"Space Grotesk, sans-serif" }}>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:11,
          color:"#888", wordBreak:"break-all", marginBottom:16,
          padding:12, background:"#111", border:"2px solid #222" }}>
          {shareUrl}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
          <button onClick={() => copy(shareUrl)}
            style={{ border:"2px solid #f5f0e8", background:"transparent",
              color:"#f5f0e8", padding:12, fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>
            {copied ? "COPIED!" : "COPY LINK"}
          </button>
          <button onClick={() => nativeShare(title || "ProofLedger Document", shareUrl)}
            style={{ border:"2px solid #F7931A", background:"transparent",
              color:"#F7931A", padding:12, fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>
            SHARE
          </button>
        </div>
        <button onClick={() => setShowQR(s => !s)}
          style={{ width:"100%", border:"2px solid #333", background:"transparent",
            color:"#666", padding:10, fontFamily:"Archivo Black, sans-serif",
            fontSize:10, cursor:"pointer", marginBottom: showQR?12:0 }}>
          {showQR ? "HIDE QR CODE" : "SHOW QR CODE"}
        </button>
        {showQR && (
          <div style={{ textAlign:"center", padding:8,
            background:"#0a0a0a", border:"2px solid #222" }}>
            <img src={qrUrl} alt="QR Code" width={160} height={160}
              style={{ display:"block", margin:"0 auto" }} />
          </div>
        )}
      </div>
    </Modal>
  );
}