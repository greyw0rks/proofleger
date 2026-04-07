"use client";
export default function NetworkBadge({ network = "stacks" }) {
  const config = {
    stacks: { label:"STACKS", color:"#F7931A", dot:"#F7931A" },
    celo:   { label:"CELO",   color:"#35D07F", dot:"#35D07F" },
  };
  const { label, color } = config[network] || config.stacks;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, border:`2px solid ${color}`, padding:"3px 10px", fontFamily:"Archivo Black, sans-serif", fontSize:10, color, letterSpacing:"1px" }}>
      <span style={{ width:6, height:6, background:color, borderRadius:"50%", display:"inline-block" }} />
      {label}
    </span>
  );
}
