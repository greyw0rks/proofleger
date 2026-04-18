"use client";
import WalletScanner from "@/components/WalletScanner";

export default function ScanPage() {
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>WALLET SCANNER</h1>
      <p style={{ color:"#888", marginBottom:32, fontSize:13 }}>
        Enter any Stacks wallet address to see their ProofLedger proof activity
      </p>
      <WalletScanner />
    </div>
  );
}