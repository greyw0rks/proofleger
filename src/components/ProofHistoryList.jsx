"use client";
import { useProofHistory } from "@/hooks/useProofHistory";
import HashDisplay from "./HashDisplay";
import DocTypeTag from "./DocTypeTag";
import EmptyState from "./EmptyState";
import { formatRelativeTime } from "@/utils/format";

export default function ProofHistoryList() {
  const { history, total, page, totalPages,
          nextPage, prevPage, clear, hydrated } = useProofHistory();

  if (!hydrated) return null;

  if (!history.length) return (
    <EmptyState
      title="NO PROOF HISTORY"
      subtitle="Anchored documents will appear here"
    />
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 11, color: "#555", letterSpacing: 2 }}>
          HISTORY ({total})
        </div>
        <button onClick={clear}
          style={{ border: "none", background: "transparent",
            color: "#444", fontFamily: "Space Mono, monospace",
            fontSize: 9, cursor: "pointer", letterSpacing: 1 }}>
          CLEAR ALL
        </button>
      </div>
      {history.map((entry, i) => (
        <div key={entry.hash + i}
          style={{ borderBottom: "1px solid #111", padding: "12px 0",
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {entry.title && (
              <div style={{ fontFamily: "Archivo Black, sans-serif",
                fontSize: 11, color: "#f5f0e8", marginBottom: 4,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {entry.title}
              </div>
            )}
            <HashDisplay hash={entry.hash} />
          </div>
          <div style={{ display: "flex", flexDirection: "column",
            alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            {entry.docType && <DocTypeTag type={entry.docType} />}
            <span style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#444" }}>
              {formatRelativeTime(entry.savedAt)}
            </span>
          </div>
        </div>
      ))}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center",
          gap: 12, marginTop: 16 }}>
          <button onClick={prevPage} disabled={page === 0}
            style={{ border: "2px solid #333", background: "transparent",
              color: page === 0 ? "#333" : "#555", padding: "6px 14px",
              fontFamily: "Archivo Black, sans-serif", fontSize: 9,
              cursor: page === 0 ? "default" : "pointer" }}>← PREV</button>
          <span style={{ fontFamily: "Space Mono, monospace",
            fontSize: 9, color: "#444", alignSelf: "center" }}>
            {page + 1} / {totalPages}
          </span>
          <button onClick={nextPage} disabled={page >= totalPages - 1}
            style={{ border: "2px solid #333", background: "transparent",
              color: page >= totalPages - 1 ? "#333" : "#555", padding: "6px 14px",
              fontFamily: "Archivo Black, sans-serif", fontSize: 9,
              cursor: page >= totalPages - 1 ? "default" : "pointer" }}>NEXT →</button>
        </div>
      )}
    </div>
  );
}