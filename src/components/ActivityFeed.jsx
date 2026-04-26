"use client";
import { useState, useEffect } from "react";
import { usePolling } from "@/hooks/usePolling";
import DocTypeTag from "./DocTypeTag";
import TxLink     from "./TxLink";
import { formatRelativeTime } from "@/utils/format";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export default function ActivityFeed({ limit = 15 }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecent() {
    if (!VERIFIER_API) return;
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/recent?limit=${limit}`);
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.results || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchRecent(); }, []);
  usePolling(fetchRecent, 20_000);

  if (loading) return null;
  if (!items.length) return null;

  return (
    <div>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 12 }}>
        RECENT ACTIVITY
      </div>
      {items.map((item, i) => (
        <div key={item.tx_id || item.hash + i}
          style={{ display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", gap: 12,
            borderBottom: "1px solid #0f0f0f", padding: "10px 0" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 10, color: "#f5f0e8", marginBottom: 3,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.title || "Untitled document"}
            </div>
            <div style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#444" }}>
              {item.sender?.slice(0, 10)}...
              {item.tx_id && <> · <TxLink txId={item.tx_id} network={item.chain || "stacks"} /></>}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column",
            alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            {item.doc_type && <DocTypeTag type={item.doc_type} />}
            <span style={{ fontFamily: "Space Mono, monospace",
              fontSize: 7, color: "#333" }}>
              {formatRelativeTime(item.created_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}