"use client";
import { useTransactionStatus } from "@/hooks/useTransactionStatus";
import Badge from "./Badge";

export default function TxStatusBadge({ txId }) {
  const { status, isPending, isSuccess, isFailed, blockHeight } = useTransactionStatus(txId);

  if (!txId) return null;

  const variant = isSuccess ? "success" : isFailed ? "error" : "warning";
  const label = isSuccess
    ? `CONFIRMED · Block #${blockHeight}`
    : isFailed ? "FAILED"
    : "PENDING...";

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <Badge label={label} variant={variant} dot />
      <a href={`https://explorer.hiro.so/txid/${txId}`}
        target="_blank" rel="noreferrer"
        style={{ fontFamily:"Space Mono, monospace", fontSize:10,
          color:"#555", textDecoration:"none" }}>
        {txId.slice(0,10)}... ↗
      </a>
    </div>
  );
}