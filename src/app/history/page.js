"use client";
import { useWalletContext } from "@/context/WalletContext";
import TxHistory from "@/components/TxHistory";
import WalletConnect from "@/components/WalletConnect";
import EmptyState from "@/components/EmptyState";

export default function HistoryPage() {
  const { isConnected, address } = useWalletContext();

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px",
      fontFamily: "Space Grotesk, sans-serif", color: "#f5f0e8",
      minHeight: "100vh", background: "#0a0a0a" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Archivo Black, sans-serif", fontSize: 28, marginBottom: 4 }}>
          ACTIVITY
        </h1>
        <p style={{ color: "#888", fontSize: 13 }}>Your on-chain proof history</p>
      </div>
      {!isConnected ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <EmptyState
            title="CONNECT YOUR WALLET"
            subtitle="Connect to view your transaction history"
          />
          <div style={{ marginTop: 24 }}>
            <WalletConnect />
          </div>
        </div>
      ) : (
        <TxHistory limit={50} />
      )}
    </div>
  );
}