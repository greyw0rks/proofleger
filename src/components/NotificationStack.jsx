"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const TYPE_STYLES = {
  info:    { border: "#333",    color: "#888",    bg: "#0f0f0f" },
  success: { border: "#00ff88", color: "#00ff88", bg: "#00ff8808" },
  warning: { border: "#F7931A", color: "#F7931A", bg: "#F7931A08" },
  error:   { border: "#ff3333", color: "#ff3333", bg: "#ff333308" },
};

function Toast({ id, message, type, onRemove }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.info;
  return (
    <div style={{ border: `2px solid ${s.border}`, background: s.bg,
      padding: "10px 14px", marginBottom: 8, minWidth: 280, maxWidth: 380,
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      boxShadow: `0 4px 20px rgba(0,0,0,0.6)` }}>
      <span style={{ fontFamily: "Space Mono, monospace", fontSize: 11,
        color: s.color, lineHeight: 1.5, flex: 1 }}>{message}</span>
      <button onClick={() => onRemove(id)}
        style={{ border: "none", background: "transparent",
          color: s.color, cursor: "pointer", fontSize: 14,
          lineHeight: 1, marginLeft: 10, flexShrink: 0 }}>×</button>
    </div>
  );
}

export default function NotificationStack({ notifications, onRemove }) {
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; }, []);
  if (!mounted.current || !notifications.length) return null;

  return createPortal(
    <div style={{ position: "fixed", bottom: 24, right: 24,
      zIndex: 300, display: "flex", flexDirection: "column-reverse" }}>
      {notifications.map(n => (
        <Toast key={n.id} {...n} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
}