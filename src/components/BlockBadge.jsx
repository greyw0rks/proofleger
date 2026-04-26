"use client";
import { blockExplorerUrl } from "@/utils/stacks";

export default function BlockBadge({ blockHeight }) {
  if (!blockHeight) return null;
  return (
    <a href={blockExplorerUrl(blockHeight)} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 5,
        border: "1px solid #222", padding: "3px 8px", textDecoration: "none",
        color: "#F7931A", fontFamily: "Space Mono, monospace", fontSize: 9 }}>
      <span style={{ color: "#555" }}>BLK</span>
      #{Number(blockHeight).toLocaleString()}
    </a>
  );
}