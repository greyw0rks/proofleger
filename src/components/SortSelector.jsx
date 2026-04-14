"use client";
const OPTIONS = [
  { value:"newest", label:"Newest First" },
  { value:"oldest", label:"Oldest First" },
  { value:"attestations", label:"Most Attested" },
  { value:"type", label:"By Type" },
];

export default function SortSelector({ value = "newest", onChange }) {
  return (
    <select value={value} onChange={e => onChange?.(e.target.value)}
      style={{ background:"#0a0a0a", border:"3px solid #333", color:"#f5f0e8",
        padding:"8px 12px", fontFamily:"Space Grotesk, sans-serif", fontSize:13,
        cursor:"pointer", outline:"none" }}
      onFocus={e => e.target.style.borderColor="#F7931A"}
      onBlur={e => e.target.style.borderColor="#333"}>
      {OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}