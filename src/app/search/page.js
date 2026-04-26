"use client";
import { useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import HashDisplay from "@/components/HashDisplay";
import DocTypeTag from "@/components/DocTypeTag";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { formatRelativeTime } from "@/utils/format";

const VERIFIER = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export default function SearchPage() {
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [page,     setPage]     = useState(0);
  const [total,    setTotal]    = useState(0);

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${VERIFIER}/v2/search?q=${encodeURIComponent(query)}&offset=${page * 20}`);
      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  }, [page]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px",
      fontFamily: "Space Grotesk, sans-serif", color: "#f5f0e8",
      minHeight: "100vh", background: "#0a0a0a" }}>
      <h1 style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 26, marginBottom: 24 }}>SEARCH</h1>
      <SearchBar onSearch={search} loading={loading} />
      {!results.length && !loading && (
        <div style={{ marginTop: 48 }}>
          <EmptyState title="ENTER A HASH, TITLE, OR ADDRESS"
            subtitle="Search across all anchored documents" />
        </div>
      )}
      {results.map((r, i) => (
        <div key={r.hash + i}
          style={{ borderBottom: "1px solid #111", padding: "14px 0",
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {r.title && (
              <div style={{ fontFamily: "Archivo Black, sans-serif",
                fontSize: 12, color: "#f5f0e8", marginBottom: 6,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.title}
              </div>
            )}
            <HashDisplay hash={r.hash} />
            <div style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#444", marginTop: 4 }}>
              {r.sender?.slice(0, 16)}...
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column",
            alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            {r.doc_type && <DocTypeTag type={r.doc_type} />}
            <span style={{ fontFamily: "Space Mono, monospace",
              fontSize: 8, color: "#333" }}>
              {formatRelativeTime(r.created_at)}
            </span>
          </div>
        </div>
      ))}
      {total > 20 && (
        <Pagination page={page} totalPages={Math.ceil(total / 20)}
          onPage={p => { setPage(p); search(""); }} />
      )}
    </div>
  );
}