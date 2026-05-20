import StampBadge from "./StampBadge";
export default function StampList({ stamps }) {
  if (!stamps || stamps.length === 0) return <div style={{ color:"#555", fontFamily:"Space Grotesk,sans-serif", fontSize:13, padding:"12px 0" }}>No stamps on this proof.</div>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {stamps.map((s, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#111", border:"1px solid #1a1a1a", borderRadius:8 }}>
          <StampBadge stamp={s} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:"#888" }}>{s.stamper?.slice(0,16)}…</div>
            {s.note && <div style={{ fontFamily:"Space Grotesk,sans-serif", fontSize:12, color:"#555", marginTop:2 }}>{s.note}</div>}
          </div>
          <div style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:"#555" }}>#{s.issued_at}</div>
        </div>
      ))}
    </div>
  );
}