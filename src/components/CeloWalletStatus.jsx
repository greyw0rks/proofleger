"use client";
import { useMiniPaySession } from "@/hooks/useMiniPaySession";

export default function CeloWalletStatus() {
  const { address, isCelo, isMiniPay, ready, connect } = useMiniPaySession();

  if (!ready && !address) {
    return (
      <button onClick={connect}
        style={{ border:"3px solid #35D07F", background:"transparent", color:"#35D07F",
          padding:"10px 20px", fontFamily:"Archivo Black, sans-serif", fontSize:12,
          cursor:"pointer", boxShadow:"3px 3px 0 #35D07F", letterSpacing:1 }}>
        CONNECT {isMiniPay ? "MINIPAY" : "CELO WALLET"}
      </button>
    );
  }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10,
      border:"2px solid #35D07F", padding:"8px 14px" }}>
      <div style={{ width:8, height:8, background:"#35D07F", borderRadius:"50%",
        boxShadow:"0 0 6px #35D07F" }} />
      <div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#35D07F" }}>
          {isMiniPay ? "MINIPAY" : "CELO"} · {isCelo ? "MAINNET" : "WRONG CHAIN"}
        </div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#888" }}>
          {address?.slice(0,6)}...{address?.slice(-4)}
        </div>
      </div>
    </div>
  );
}