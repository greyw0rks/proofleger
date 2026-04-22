"use client";
import { useState } from "react";
import AnchorForm from "@/components/AnchorForm";
import VerifyForm from "@/components/VerifyForm";
import { useWalletContext } from "@/context/WalletContext";
import WalletConnect from "@/components/WalletConnect";

export default function AnchorPage() {
  const [tab, setTab] = useState("anchor");
  const { isConnected } = useWalletContext();

  const tabStyle = (t) => ({
    padding:"12px 24px", border:"none", background:"transparent",
    color: tab === t ? "#F7931A" : "#555",
    borderBottom: tab === t ? "3px solid #F7931A" : "3px solid transparent",
    fontFamily:"Archivo Black, sans-serif", fontSize:12, cursor:"pointer", letterSpacing:1,
  });

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:4 }}>
            PROOFLEDGER
          </h1>
          <p style={{ color:"#888", fontSize:13 }}>Anchor documents to Bitcoin and Celo</p>
        </div>
        {!isConnected && <WalletConnect />}
      </div>
      <div style={{ display:"flex", borderBottom:"2px solid #1a1a1a", marginBottom:28 }}>
        <button style={tabStyle("anchor")} onClick={() => setTab("anchor")}>ANCHOR</button>
        <button style={tabStyle("verify")} onClick={() => setTab("verify")}>VERIFY</button>
      </div>
      {tab === "anchor" && <AnchorForm />}
      {tab === "verify" && <VerifyForm />}
    </div>
  );
}