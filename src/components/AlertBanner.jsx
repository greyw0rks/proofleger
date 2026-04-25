"use client";
import { useState } from "react";

const STYLES = {
  info:    { border: "#333",    color: "#888",    bg: "#0a0a0a" },
  warning: { border: "#F7931A", color: "#F7931A", bg: "#F7931A08" },
  error:   { border: "#ff3333", color: "#ff3333", bg: "#ff333308" },
  success: { border: "#00ff88", color: "#00ff88", bg: "#00ff8808" },
};

export default function AlertBanner({ type = "info", message, dismissible = true }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !message) return null;

  const s = STYLES[type] || STYLES.info;

  return (
    <div style={{ border: `2px solid ${s.border}`, background: s.bg,
      padding: "12px 16px", marginBottom: 16,
      display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: s.color,
        lineHeight: 1.5 }}>
        {message}
      </span>
      {dismissible && (
        <button onClick={() => setDismissed(true)}
          style={{ border: "none", background: "transparent",
            color: s.color, cursor: "pointer", fontSize: 14,
            lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>×</button>
      )}
    </div>
  );
}