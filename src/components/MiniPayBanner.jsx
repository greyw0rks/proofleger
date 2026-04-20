"use client";
import { useMiniPay } from "@/hooks/useMiniPay";

export default function MiniPayBanner() {
  const { isMiniPay, address, connecting, connect } = useMiniPay();
  if (!isMiniPay || address) return null;
  return (
    <div style={{ background:"#0d1f16", border:"3px solid #35D07F",
      padding:"12px 20px", display:"flex", justifyContent:"space-between",
      alignItems:"center", gap:12 }}>
      <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13, color:"#f5f0e8" }}>
        MiniPay detected — connect to anchor documents
      </div>
      <button onClick={connect} disabled={connecting}
        style={{ background:"#35D07F", border:"none", color:"#000",
          padding:"8px 18px", fontFamily:"Archivo Black, sans-serif",
          fontSize:11, cursor:"pointer", flexShrink:0 }}>
        {connecting ? "CONNECTING..." : "CONNECT"}
      </button>
    </div>
  );
}