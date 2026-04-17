"use client";
import { useWalletContext } from "@/context/WalletContext";
import Spinner from "./Spinner";

export default function WalletConnect({ compact = false }) {
  const { address, connecting, connectWallet, disconnectWallet, isConnected } = useWalletContext();

  if (isConnected) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:7, height:7, background:"#00ff88", borderRadius:"50%",
          boxShadow:"0 0 6px #00ff88" }} />
        {!compact && (
          <span style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#888" }}>
            {address?.slice(0,6)}...{address?.slice(-4)}
          </span>
        )}
        <button onClick={disconnectWallet}
          style={{ border:"2px solid #333", background:"transparent", color:"#555",
            padding:"4px 10px", fontFamily:"Archivo Black, sans-serif", fontSize:9,
            cursor:"pointer", letterSpacing:1 }}>
          DISCONNECT
        </button>
      </div>
    );
  }

  return (
    <button onClick={connectWallet} disabled={connecting}
      style={{ border:"3px solid #F7931A", background:"transparent", color:"#F7931A",
        padding: compact ? "6px 14px" : "10px 20px",
        fontFamily:"Archivo Black, sans-serif", fontSize: compact ? 10 : 12,
        cursor:"pointer", boxShadow:"3px 3px 0 #d4780f",
        display:"flex", alignItems:"center", gap:8, letterSpacing:1 }}>
      {connecting ? <><Spinner size={14} color="#F7931A" /> CONNECTING...</> : "CONNECT WALLET"}
    </button>
  );
}