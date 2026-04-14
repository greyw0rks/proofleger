"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, placeholder = "Search documents..." }) {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 300);

  useEffect(() => { onSearch?.(debounced); }, [debounced]);

  return (
    <div style={{ position:"relative", marginBottom:16 }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{ width:"100%", background:"transparent", border:"3px solid #333", color:"#f5f0e8",
          padding:"12px 40px 12px 16px", fontFamily:"Space Grotesk, sans-serif", fontSize:14,
          outline:"none", boxSizing:"border-box" }}
        onFocus={e => e.target.style.borderColor="#F7931A"}
        onBlur={e => e.target.style.borderColor="#333"}
      />
      {value && (
        <button onClick={() => setValue("")}
          style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:16, lineHeight:1 }}>
          ×
        </button>
      )}
    </div>
  );
}