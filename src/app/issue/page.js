"use client";
import CredentialIssuance from "@/components/CredentialIssuance";
import { useWalletContext } from "@/context/WalletContext";
import WalletConnect from "@/components/WalletConnect";
export default function IssuePage() {
  const { address, isConnected } = useWalletContext();
  return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>ISSUE CREDENTIAL</h1>
      <p style={{ color:"#888", marginBottom:32, fontSize:13 }}>
        Issue on-chain credentials to any Stacks wallet
      </p>
      {isConnected ? (
        <CredentialIssuance issuerAddress={address} />
      ) : (
        <div style={{ textAlign:"center", padding:"40px 0" }}>
          <div style={{ color:"#666", fontFamily:"Space Mono, monospace", fontSize:12, marginBottom:20 }}>
            Connect your wallet to issue credentials
          </div>
          <WalletConnect />
        </div>
      )}
    </div>
  );
}