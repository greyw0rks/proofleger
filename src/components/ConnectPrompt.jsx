"use client";
import { useWalletContext } from "@/context/WalletContext";
import WalletConnect from "./WalletConnect";

export default function ConnectPrompt({ message = "Connect your wallet to continue" }) {
  const { isConnected } = useWalletContext();
  if (isConnected) return null;
  return (
    <div style={{ textAlign:"center", padding:"60px 24px",
      border:"3px dashed #222" }}>
      <div style={{ fontSize:40, marginBottom:16 }}>🔐</div>
      <div style={{ fontFamily:"Archivo Black, sans-serif",
        fontSize:16, color:"#f5f0e8", marginBottom:8 }}>
        WALLET REQUIRED
      </div>
      <div style={{ fontFamily:"Space Grotesk, sans-serif",
        fontSize:13, color:"#666", marginBottom:24 }}>
        {message}
      </div>
      <WalletConnect />
    </div>
  );
}