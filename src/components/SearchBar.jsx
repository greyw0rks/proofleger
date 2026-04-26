"use client";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Spinner from "./Spinner";

export default function SearchBar({ onSearch, placeholder = "SEARCH HASH OR TITLE...", loading = false }) {
  const [query, setQuery] = useState("");
  const debounced         = useDebounce(query, 350);

  useState(() => { onSearch?.(debounced); }, [debounced]);

  return (
    <div style={{ position: "relative" }}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "#0a0a0a",
          border: "2px solid #222",
          color: "#f5f0e8",
          fontFamily: "Space Mono, monospace",
          fontSize: 11,
          padding: "10px 40px 10px 14px",
          outline: "none",
          letterSpacing: 1,
          boxSizing: "border-box",
        }}
        onFocus={e => { e.target.style.borderColor = "#F7931A"; }}
        onBlur={e  => { e.target.style.borderColor = "#222"; }}
      />
      <div style={{ position: "absolute", right: 12, top: "50%",
        transform: "translateY(-50%)" }}>
        {loading
          ? <Spinner size={14} />
          : <span style={{ color: "#333", fontSize: 14 }}>⌕</span>
        }
      </div>
    </div>
  );
}