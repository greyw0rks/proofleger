"use client";
import { DOC_TYPES } from "@/lib/constants";

export default function DocTypeTag({ type }) {
  const def   = DOC_TYPES.find(d => d.value === type);
  const color = def?.color || "#555";
  const label = def?.label || type || "Other";

  return (
    <span style={{ display: "inline-flex", alignItems: "center",
      border: `1px solid ${color}44`, background: `${color}10`,
      padding: "2px 8px", fontFamily: "Archivo Black, sans-serif",
      fontSize: 8, color, letterSpacing: 1 }}>
      {label.toUpperCase()}
    </span>
  );
}