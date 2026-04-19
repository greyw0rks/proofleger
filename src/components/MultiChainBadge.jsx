"use client";
export default function MultiChainBadge({ stacksVerified, celoVerified }) {
  const chains = [
    { label:"Bitcoin", color:"#F7931A", active: stacksVerified },
    { label:"Celo",    color:"#35D07F", active: celoVerified  },
  ];
  return (
    <div style={{ display:"flex", gap:6 }}>
      {chains.map(c => (
        <div key={c.label}
          style={{ border:`2px solid ${c.active ? c.color : "#333"}`,
            padding:"3px 10px", display:"flex", alignItems:"center", gap:5,
            fontFamily:"Archivo Black, sans-serif", fontSize:9,
            color: c.active ? c.color : "#444", letterSpacing:1 }}>
          {c.active && (
            <span style={{ width:5, height:5, borderRadius:"50%",
              background:c.color, display:"inline-block" }} />
          )}
          {c.label.toUpperCase()}
          {c.active ? " ✓" : " —"}
        </div>
      ))}
    </div>
  );
}