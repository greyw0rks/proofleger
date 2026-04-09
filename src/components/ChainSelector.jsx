"use client";
const CHAINS = [
  { id:"stacks", label:"Stacks",  sub:"Bitcoin L2", color:"#F7931A" },
  { id:"celo",   label:"Celo",    sub:"MiniPay",    color:"#35D07F" },
];
export default function ChainSelector({ value, onChange }) {
  return (
    <div style={{ display:"flex", gap:0 }}>
      {CHAINS.map(c => (
        <button key={c.id} onClick={() => onChange(c.id)}
          style={{ padding:"10px 20px", background:value===c.id?c.color:"transparent", color:value===c.id?"#000":c.color, border:`3px solid ${c.color}`, borderRight:c.id==="stacks"?"none":`3px solid ${c.color}`, fontFamily:"Archivo Black, sans-serif", fontSize:12, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <span>{c.label}</span>
          <span style={{ fontSize:9, fontFamily:"Space Mono, monospace", opacity:0.7 }}>{c.sub}</span>
        </button>
      ))}
    </div>
  );
}