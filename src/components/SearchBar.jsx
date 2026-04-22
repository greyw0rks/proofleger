"use client";
import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar({ onSearch, placeholder = "Search...", debounceMs = 400 }) {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, debounceMs);

  useState(() => { onSearch?.(debounced); }, [debounced]);

  const clear = useCallback(() => { setValue(""); onSearch?.(""); }, [onSearch]);

  return (
    <div style={{ position:"relative", marginBottom:16 }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSearch?.(value)}
        placeholder={placeholder}
        style={{ width:"100%", background:"transparent", border:"3px solid #333",
          color:"#f5f0e8", padding:"12px 40px 12px 14px",
          fontFamily:"Space Mono, monospace", fontSize:12,
          outline:"none", boxSizing:"border-box" }}
        onFocus={e => e.target.style.borderColor="#F7931A"}
        onBlur={e => e.target.style.borderColor="#333"}
      />
      {value && (
        <button onClick={clear}
          style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
            border:"none", background:"transparent", color:"#555",
            cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
      )}
    </div>
  );
}