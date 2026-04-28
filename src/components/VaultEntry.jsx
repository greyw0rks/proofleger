"use client";
import DocTypeTag from "./DocTypeTag";
import CopyButton from "./CopyButton";
import { formatRelativeTime } from "@/utils/format";

export default function VaultEntry({ entry, onShare }) {
  if (!entry) return null;
  return (
    <div style={{ border: "2px solid #1a1a1a", padding: 16,
      display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Space Mono, monospace",
            fontSize: 8, color: "#F7931A", wordBreak: "break-all",
            marginBottom: 4 }}>
            {entry.cipher_ref?.slice(0, 40)}...
          </div>
          {entry.doc_type && <DocTypeTag type={entry.doc_type} />}
        </div>
        <div style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: 9, color: "#555", letterSpacing: 1, marginLeft: 12,
          flexShrink: 0, textAlign: "right" }}>
          <div style={{ fontSize: 16, color: "#888" }}>{entry.grant_count ?? 0}</div>
          <div style={{ fontSize: 7 }}>GRANTS</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center" }}>
        <span style={{ fontFamily: "Space Mono, monospace",
          fontSize: 7, color: "#333" }}>
          {formatRelativeTime(entry.created_at)}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <CopyButton text={entry.cipher_ref} label="COPY REF" />
          {onShare && (
            <button onClick={() => onShare(entry)}
              style={{ border: "2px solid #333", background: "transparent",
                color: "#555", padding: "4px 10px",
                fontFamily: "Archivo Black, sans-serif", fontSize: 8,
                cursor: "pointer", letterSpacing: 1 }}>
              SHARE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}