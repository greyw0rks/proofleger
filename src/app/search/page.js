"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(query) {
    if (!query || query.length < 3) return;
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`/api/search?wallet=${query}`);
      const data = await res.json();
      setResults(data.proofs || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8", minHeight:"100vh",
      background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>SEARCH</h1>
      <p style={{ color:"#888", marginBottom:24, fontSize:13 }}>
        Search by wallet address, document hash, or transaction ID
      </p>
      <SearchBar onSearch={handleSearch} placeholder="SP address or hash..." />
      {loading && <div style={{ color:"#666", fontFamily:"Space Mono, monospace", fontSize:12 }}>Searching...</div>}
      {searched && !loading && results.length === 0 && (
        <div style={{ color:"#555", fontFamily:"Space Mono, monospace", fontSize:12 }}>No results found</div>
      )}
      {results.map((r, i) => (
        <div key={i} style={{ border:"2px solid #222", padding:16, marginBottom:8 }}>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A" }}>
            {r.fn}
          </div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555", marginTop:4 }}>
            Block #{r.block} · <a href={`/verify?hash=${r.txid}`}
              style={{ color:"#666", textDecoration:"none" }}>{r.txid?.slice(0,12)}...</a>
          </div>
        </div>
      ))}
    </div>
  );
}