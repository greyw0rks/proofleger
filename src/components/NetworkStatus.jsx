"use client";
import { useWalletContext }  from "@/context/WalletContext";
import { useNetworkContext } from "@/context/NetworkContext";
import NetworkBadge  from "./NetworkBadge";
import WalletConnect from "./WalletConnect";
import { shortAddress } from "@/utils/format";

export default function NetworkStatus() {
  const { isConnected, address } = useWalletContext();
  const { network } = useNetworkContext();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <NetworkBadge compact />
      {isConnected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "Space Mono, monospace",
            fontSize: 9, color: "#555" }}>
            {shortAddress(address)}
          </span>
          <WalletConnect compact />
        </div>
      ) : (
        <WalletConnect compact />
      )}
    </div>
  );
}