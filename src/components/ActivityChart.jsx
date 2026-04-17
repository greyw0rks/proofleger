"use client";
export default function ActivityChart({ data = [] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:80 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", gap:4 }}>
            <div style={{ width:"100%", background:"#F7931A",
              height:`${(d.count / max) * 64}px`,
              opacity: i === data.length - 1 ? 1 : 0.5,
              minHeight: d.count > 0 ? 4 : 0,
              transition:"height 0.3s" }} />
            <div style={{ fontFamily:"Space Mono, monospace", fontSize:8,
              color:"#555", whiteSpace:"nowrap" }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}