import { useState } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export default function BundleCreator({ address }) {
  const [hashes, setHashes] = useState([]);
  const [input, setInput] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const add = () => { const h = input.trim(); if (h && !hashes.includes(h)) { setHashes(p => [...p, h]); setInput(""); }};
  const create = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/v2/bundles`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ hashes, label, creator:address }) });
      setResult(await r.json());
    } catch (_) {} finally { setLoading(false); }
  };
  return (
    <div style={{ padding:20, background:"#111", border:"1px solid #1a1a1a", borderRadius:10 }}>
      <div style={{ fontFamily:"Archivo Black,sans-serif", fontSize:13, letterSpacing:1, textTransform:"uppercase", color:"#f5f0e8", marginBottom:14 }}>Create Bundle</div>
      <input style={{ width:"100%", boxSizing:"border-box", background:"#0a0a0a", border:"1px solid #2a2a2a", borderRadius:6, padding:"8px 12px", color:"#f5f0e8", fontFamily:"Space Mono,monospace", fontSize:12, marginBottom:8 }} placeholder="Bundle label…" value={label} onChange={e => setLabel(e.target.value)} />
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <input style={{ flex:1, background:"#0a0a0a", border:"1px solid #2a2a2a", borderRadius:6, padding:"8px 12px", color:"#f5f0e8", fontFamily:"Space Mono,monospace", fontSize:11 }} placeholder="Paste hash…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&add()} />
        <button onClick={add} style={{ padding:"8px 14px", background:"#1a1a1a", border:"1px solid #333", borderRadius:6, color:"#F7931A", cursor:"pointer" }}>+</button>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>{hashes.map((h,i) => <span key={i} style={{ display:"flex", alignItems:"center", gap:4, background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:4, padding:"3px 8px", fontFamily:"Space Mono,monospace", fontSize:10, color:"#888" }}>{h.slice(0,12)}… <button onClick={() => setHashes(p => p.filter((_,j) => j!==i))} style={{ background:"none", border:"none", color:"#555", cursor:"pointer" }}>×</button></span>)}</div>
      {result ? <div style={{ color:"#00ff88", fontFamily:"Space Mono,monospace", fontSize:12 }}>✓ Bundle {result.bundle_id}</div> : <button onClick={create} disabled={hashes.length<2||loading} style={{ width:"100%", padding:10, background:hashes.length>=2?"#F7931A":"#1a1a1a", border:"none", borderRadius:6, color:hashes.length>=2?"#0a0a0a":"#555", cursor:hashes.length>=2?"pointer":"default", fontFamily:"Archivo Black,sans-serif", fontSize:12, letterSpacing:1 }}>{loading?"Creating…":`Bundle ${hashes.length} Proofs`}</button>}
    </div>
  );
}