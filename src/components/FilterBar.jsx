"use client";
const DOC_TYPES = ["all","diploma","certificate","research","art","contribution","award","other"];

export default function FilterBar({ activeType, onTypeChange, activeNetwork, onNetworkChange }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
      {DOC_TYPES.map(t => (
        <button key={t} onClick={() => onTypeChange?.(t === "all" ? null : t)}
          style={{ border:`2px solid ${activeType === t || (!activeType && t === "all") ? "#F7931A" : "#333"}`,
            background: activeType === t || (!activeType && t === "all") ? "#F7931A" : "transparent",
            color: activeType === t || (!activeType && t === "all") ? "#000" : "#888",
            padding:"4px 12px", fontFamily:"Archivo Black, sans-serif", fontSize:10,
            cursor:"pointer", letterSpacing:"0.5px" }}>
          {t.toUpperCase()}
        </button>
      ))}
      <div style={{ width:1, background:"#222", margin:"0 4px" }} />
      {["stacks","celo"].map(n => (
        <button key={n} onClick={() => onNetworkChange?.(n === activeNetwork ? null : n)}
          style={{ border:`2px solid ${activeNetwork === n ? (n==="celo"?"#35D07F":"#F7931A") : "#333"}`,
            background: activeNetwork === n ? (n==="celo"?"#35D07F":"#F7931A") : "transparent",
            color: activeNetwork === n ? "#000" : "#888",
            padding:"4px 12px", fontFamily:"Archivo Black, sans-serif", fontSize:10, cursor:"pointer" }}>
          {n.toUpperCase()}
        </button>
      ))}
    </div>
  );
}