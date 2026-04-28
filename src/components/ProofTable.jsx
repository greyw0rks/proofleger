"use client";
import { useState } from "react";
import DocTypeTag from "./DocTypeTag";
import TxLink     from "./TxLink";
import { shortAddress, formatRelativeTime } from "@/utils/format";

export default function ProofTable({ rows = [], chain = "stacks" }) {
  const [sortKey, setSortKey] = useState("block_height");
  const [sortDir, setSortDir] = useState("desc");

  function handleSort(key) {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = [...rows].sort((a, b) => {
    const va = a[sortKey] ?? ""; const vb = b[sortKey] ?? "";
    const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const col = (label, key) => (
    <th key={key} onClick={() => handleSort(key)}
      style={{ fontFamily: "Archivo Black, sans-serif", fontSize: 8,
        color: sortKey === key ? "#F7931A" : "#555",
        letterSpacing: 1, textAlign: "left", padding: "6px 10px",
        cursor: "pointer", borderBottom: "2px solid #111",
        whiteSpace: "nowrap", userSelect: "none" }}>
      {label} {sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  if (!rows.length) return (
    <div style={{ fontFamily: "Space Mono, monospace", fontSize: 10,
      color: "#2a2a2a", padding: "20px 0" }}>No records found.</div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{col("TITLE", "title")}{col("TYPE", "doc_type")}{col("SENDER", "sender")}{col("BLOCK", "block_height")}{col("AGE", "created_at")}</tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={row.tx_id || row.hash || i}
              style={{ borderBottom: "1px solid #0f0f0f" }}>
              <td style={{ padding: "8px 10px", fontFamily: "Archivo Black, sans-serif",
                fontSize: 10, color: "#f5f0e8", maxWidth: 180,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {row.title || <span style={{ color: "#333" }}>—</span>}
              </td>
              <td style={{ padding: "8px 10px" }}>
                {row.doc_type ? <DocTypeTag type={row.doc_type} /> : <span style={{ color: "#333" }}>—</span>}
              </td>
              <td style={{ padding: "8px 10px", fontFamily: "Space Mono, monospace",
                fontSize: 8, color: "#888" }}>
                {row.sender ? shortAddress(row.sender) : "—"}
              </td>
              <td style={{ padding: "8px 10px", fontFamily: "Space Mono, monospace",
                fontSize: 8, color: "#555" }}>
                {row.block_height ? `#${Number(row.block_height).toLocaleString()}` : "—"}
              </td>
              <td style={{ padding: "8px 10px", fontFamily: "Space Mono, monospace",
                fontSize: 8, color: "#444" }}>
                {formatRelativeTime(row.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}