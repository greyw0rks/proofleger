"use client";
import StatsStrip from "@/components/StatsStrip";
import ProofHistoryList from "@/components/ProofHistoryList";
import NetworkSwitcher from "@/components/NetworkSwitcher";
import WalletConnect from "@/components/WalletConnect";
import { useWalletContext } from "@/context/WalletContext";

export default function DashboardPage() {
  const { isConnected } = useWalletContext();

  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif",
      color: "#f5f0e8", minHeight: "100vh", background: "#0a0a0a" }}>
      <StatsStrip />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 26, marginBottom: 4 }}>DASHBOARD</h1>
            <p style={{ color: "#888", fontSize: 13 }}>
              ProofLedger — multi-chain document anchoring
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <NetworkSwitcher />
            {!isConnected && <WalletConnect />}
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <ProofHistoryList />
        </div>
      </div>
    </div>
  );
}