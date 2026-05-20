import { useState } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
const REASONS = ["Invalid document","Fraudulent anchor","Duplicate submission","Expired content","Other"];
export default function DisputeForm({ hash, address, onClose }) {
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const submit = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/v2/disputes`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ hash, reason, evidence, address }) });
      if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
      setDone(true);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  if (done) return <div style={{ padding:32, textAlign:"center" }}><div style={{ fontSize:28 }}>⚖️</div><div style={{ color:"#00ff88", fontFamily:"Archivo Black,sans-serif", marginTop:8 }}>Dispute Filed</div><button onClick={onClose} style={{ marginTop:16, padding:"8px 20px", background:"#1a1a1a", border:"1px solid #333", borderRadius:6, color:"#f5f0e8", cursor:"pointer" }}>Close</button></div>;
  const inp = { width:"100%", boxSizing:"border-box", background:"#0a0a0a", border:"1px solid #2a2a2a", borderRadius:6, padding:"8px 12px", color:"#f5f0e8", fontFamily:"Space Grotesk,sans-serif", fontSize:13 };
  return (
    <div style={{ padding:24, display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ fontFamily:"Archivo Black,sans-serif", fontSize:14, letterSpacing:1, textTransform:"uppercase", color:"#f5f0e8" }}>File a Dispute</div>
      <div style={{ fontFamily:"Space Mono,monospace", fontSize:11, color:"#555", wordBreak:"break-all" }}>{hash}</div>
      <select style={inp} value={reason} onChange={e => setReason(e.target.value)}><option value="">Select reason…</option>{REASONS.map(r => <option key={r} value={r}>{r}</option>)}</select>
      <textarea style={{ ...inp, minHeight:80, resize:"vertical" }} placeholder="Evidence…" value={evidence} onChange={e => setEvidence(e.target.value)} />
      {error && <div style={{ color:"#ff3333", fontSize:11, fontFamily:"Space Mono,monospace" }}>{error}</div>}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={onClose} style={{ flex:1, padding:10, background:"none", border:"1px solid #333", borderRadius:6, color:"#888", cursor:"pointer" }}>Cancel</button>
        <button onClick={submit} disabled={!reason||loading} style={{ flex:2, padding:10, background:reason?"#ff3333":"#1a1a1a", border:"none", borderRadius:6, color:reason?"#fff":"#555", cursor:reason?"pointer":"default", fontFamily:"Archivo Black,sans-serif", fontSize:12, letterSpacing:1 }}>{loading?"Filing…":"File Dispute"}</button>
      </div>
    </div>
  );
}