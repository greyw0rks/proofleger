"use client";
import { useState } from "react";
import CopyButton from "./CopyButton";

export default function HashDisplay({ hash, label = null, showCopy = true }) {
  const [expanded, setExpanded] = useState(false);
  if (!hash) return null;

  const short = `${hash.slice(0, 12)}...${hash.slice(-8)}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {label && (
        <span style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 9, color: "#555", letterSpacing: 1 }}>{label}</span>
      )}
      <span
        onClick={() => setExpanded(e => !e)}
        style={{ fontFamily: "Space Mono, monospace", fontSize: 9, color: "#F7931A",
          cursor: "pointer", wordBreak: "break-all" }}>
        {expanded ? hash : short}
      </span>
      {showCopy && <CopyButton text={hash} />}
    </div>
  );
}