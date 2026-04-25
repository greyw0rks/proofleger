"use client";
import { useTxHistory } from "@/hooks/useTxHistory";
import TxLink from "./TxLink";
import Spinner from "./Spinner";

const STATUS_COLORS = {
  success: "#00ff88",
  pending: "#F7931A",
  abort_by_response: "#ff3333",
  abort_by_post_condition: "#ff3333",
};

export default function TxHistory({ limit = 10 }) {
  const { txs, loading, error, refresh } = useTxHistory(limit);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 32 }}>
      <Spinner size={24} />
    </div>
  );

  if (error) return (
    <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10,
      color: "#ff3333", padding: 16 }}>
      Failed to load history: {error}
    </div>
  );

  if (!txs.length) return (
    <div style={{ fontFamily: "Archivo Black, sans-serif", fontSize: 11,
      color: "#333", padding: 24, textAlign: "center", letterSpacing: 2 }}>
      NO TRANSACTIONS YET
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "Archivo Black, sans-serif", fontSize: 11,
          color: "#555", letterSpacing: 2 }}>RECENT ACTIVITY</div>
        <button onClick={refresh}
          style={{ border: "none", background: "transparent",
            color: "#555", fontFamily: "Space Mono, monospace",
            fontSize: 9, cursor: "pointer", letterSpacing: 1 }}>
          ↻ REFRESH
        </button>
      </div>
      {txs.map(tx => (
        <div key={tx.tx_id}
          style={{ borderBottom: "1px solid #111", padding: "10px 0",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9,
              color: STATUS_COLORS[tx.tx_status] || "#555", marginBottom: 4 }}>
              {tx.tx_status?.replace(/_/g, " ").toUpperCase()}
            </div>
            <TxLink txId={tx.tx_id} network="stacks" />
          </div>
          <div style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#444" }}>
            {tx.block_height ? `BLK ${tx.block_height.toLocaleString()}` : "MEMPOOL"}
          </div>
        </div>
      ))}
    </div>
  );
}