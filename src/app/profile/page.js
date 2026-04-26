"use client";
import { useWalletContext }  from "@/context/WalletContext";
import ReputationCard        from "@/components/ReputationCard";
import WalletStats           from "@/components/WalletStats";
import StakingWidget         from "@/components/StakingWidget";
import ProofHistoryList      from "@/components/ProofHistoryList";
import WalletConnect         from "@/components/WalletConnect";
import EmptyState            from "@/components/EmptyState";

export default function ProfilePage() {
  const { isConnected, address } = useWalletContext();

  if (!isConnected) return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px",
      fontFamily: "Space Grotesk, sans-serif", background: "#0a0a0a",
      minHeight: "100vh", textAlign: "center" }}>
      <EmptyState title="CONNECT YOUR WALLET"
        subtitle="View your reputation, stake, and proof history" />
      <div style={{ marginTop: 24 }}><WalletConnect /></div>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px",
      fontFamily: "Space Grotesk, sans-serif", color: "#f5f0e8",
      minHeight: "100vh", background: "#0a0a0a" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 26, marginBottom: 4 }}>PROFILE</h1>
        <div style={{ fontFamily: "Space Mono, monospace",
          fontSize: 9, color: "#555" }}>
          {address?.slice(0, 12)}...{address?.slice(-8)}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <WalletStats address={address} />
        <ReputationCard address={address} />
        <StakingWidget />
        <div style={{ borderTop: "2px solid #111", paddingTop: 20 }}>
          <ProofHistoryList />
        </div>
      </div>
    </div>
  );
}