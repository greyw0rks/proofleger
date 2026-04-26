"use client";
import { shortHash } from "@/utils/format";

const EXPLORERS = {
  stacks: (id) => `https://explorer.hiro.so/txid/${id}?chain=mainnet`,
  celo:   (id) => `https://celoscan.io/tx/${id}`,
};

export default function TxLink({ txId, network = "stacks", shorten = true }) {
  if (!txId) return null;
  const url   = EXPLORERS[network]?.(txId) || EXPLORERS.stacks(txId);
  const label = shorten ? shortHash(txId, 10, 6) : txId;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ fontFamily: "Space Mono, monospace", fontSize: 9,
        color: network === "celo" ? "#FCFF52" : "#F7931A",
        textDecoration: "none", wordBreak: "break-all" }}>
      {label}
    </a>
  );
}