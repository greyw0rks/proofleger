"use client";

export default function EmptyState({ title, subtitle, action = null, onAction = null }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 12, color: "#333", letterSpacing: 3, marginBottom: 8 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontFamily: "Space Mono, monospace",
          fontSize: 10, color: "#2a2a2a", marginBottom: action ? 20 : 0 }}>
          {subtitle}
        </div>
      )}
      {action && onAction && (
        <button onClick={onAction}
          style={{ border: "2px solid #333", background: "transparent",
            color: "#555", padding: "8px 20px",
            fontFamily: "Archivo Black, sans-serif", fontSize: 10,
            cursor: "pointer", letterSpacing: 1 }}>
          {action}
        </button>
      )}
    </div>
  );
}