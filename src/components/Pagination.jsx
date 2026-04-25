"use client";

export default function Pagination({ page, totalPages, onPage, compact = false }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    if (totalPages <= 7 || Math.abs(i - page) <= 1 || i === 0 || i === totalPages - 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const btn = (label, target, disabled) => (
    <button key={label} onClick={() => !disabled && onPage(target)}
      disabled={disabled}
      style={{ border: `2px solid ${disabled ? "#1a1a1a" : "#333"}`,
        background: "transparent",
        color: disabled ? "#222" : "#555",
        padding: compact ? "4px 8px" : "6px 12px",
        fontFamily: "Archivo Black, sans-serif",
        fontSize: compact ? 8 : 9,
        cursor: disabled ? "default" : "pointer",
        letterSpacing: 1, minWidth: 32 }}>
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 16 }}>
      {btn("←", page - 1, page === 0)}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={"e" + i} style={{ color: "#333", fontFamily: "Space Mono, monospace",
            fontSize: 9, padding: "0 4px" }}>…</span>
        ) : (
          <button key={p} onClick={() => onPage(p)}
            style={{ border: `2px solid ${p === page ? "#F7931A" : "#333"}`,
              background: p === page ? "#F7931A12" : "transparent",
              color: p === page ? "#F7931A" : "#555",
              padding: compact ? "4px 8px" : "6px 12px",
              fontFamily: "Archivo Black, sans-serif",
              fontSize: compact ? 8 : 9,
              cursor: p === page ? "default" : "pointer", minWidth: 32 }}>
            {p + 1}
          </button>
        )
      )}
      {btn("→", page + 1, page >= totalPages - 1)}
    </div>
  );
}