"use client";
import { useMirrorStatus } from "@/hooks/useMirrorStatus";
import TxLink    from "./TxLink";
import ChainIcon from "./ChainIcon";

export default function CrossChainStatus({ stacksHash, stacksTxId }) {
  const { isMirrored, isConfirmed, celoTx, celoBlock, loading } = useMirrorStatus(stacksHash);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Stacks row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px", border: "1px solid #1a1a1a" }}>
        <ChainIcon chain="stacks" size={14} />
        <span style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 9, color: "#F7931A", letterSpacing: 1, flex: 1 }}>
          STACKS
        </span>
        {stacksTxId
          ? <TxLink txId={stacksTxId} network="stacks" />
          : <span style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#555" }}>—</span>
        }
        <span style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 7, color: "#00ff88", letterSpacing: 1,
          border: "1px solid #00ff8833", padding: "2px 6px" }}>✓ ANCHORED</span>
      </div>
      {/* Celo row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px", border: "1px solid #1a1a1a" }}>
        <ChainIcon chain="celo" size={14} />
        <span style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 9, color: "#FCFF52", letterSpacing: 1, flex: 1 }}>
          CELO
        </span>
        {loading
          ? <span style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#555" }}>checking...</span>
          : isMirrored && celoTx
          ? <TxLink txId={celoTx} network="celo" />
          : <span style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#333" }}>not mirrored</span>
        }
        {isConfirmed && (
          <span style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 7, color: "#FCFF52", letterSpacing: 1,
            border: "1px solid #FCFF5233", padding: "2px 6px" }}>✓ CONFIRMED</span>
        )}
      </div>
    </div>
  );
}