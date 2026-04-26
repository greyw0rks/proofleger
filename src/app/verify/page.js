"use client";
import VerifyForm   from "@/components/VerifyForm";
import WalletStats  from "@/components/WalletStats";
import StatsStrip   from "@/components/StatsStrip";
import { useWalletContext } from "@/context/WalletContext";

export default function VerifyPage() {
  const { isConnected, address } = useWalletContext();

  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif",
      color: "#f5f0e8", minHeight: "100vh", background: "#0a0a0a" }}>
      <StatsStrip />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 26, marginBottom: 4 }}>VERIFY</h1>
          <p style={{ color: "#888", fontSize: 13 }}>
            Check if a document has been anchored on Stacks or Celo
          </p>
        </div>
        {isConnected && (
          <div style={{ marginBottom: 28 }}>
            <WalletStats address={address} />
          </div>
        )}
        <VerifyForm />
      </div>
    </div>
  );
}