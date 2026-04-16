"use client";
export default function PaginationBar({ page, totalPages, hasNext, hasPrev, next, prev, goTo }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:16 }}>
      <button onClick={prev} disabled={!hasPrev}
        style={{ border:"2px solid #333", background:"transparent",
          color: hasPrev ? "#f5f0e8" : "#444", padding:"6px 14px",
          fontFamily:"Archivo Black, sans-serif", fontSize:10,
          cursor: hasPrev ? "pointer" : "default" }}>← PREV</button>
      <div style={{ display:"flex", gap:4 }}>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width:28, height:28, border:`2px solid ${i===page?"#F7931A":"#333"}`,
              background: i===page ? "#F7931A" : "transparent",
              color: i===page ? "#000" : "#888",
              fontFamily:"Archivo Black, sans-serif", fontSize:10, cursor:"pointer" }}>
            {i + 1}
          </button>
        ))}
      </div>
      <button onClick={next} disabled={!hasNext}
        style={{ border:"2px solid #333", background:"transparent",
          color: hasNext ? "#f5f0e8" : "#444", padding:"6px 14px",
          fontFamily:"Archivo Black, sans-serif", fontSize:10,
          cursor: hasNext ? "pointer" : "default" }}>NEXT →</button>
    </div>
  );
}