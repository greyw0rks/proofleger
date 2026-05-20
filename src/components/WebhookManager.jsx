import { useState } from "react";
import { useWebhook } from "@/hooks/useWebhook";
const EVENTS = ["anchor","verify","dispute","governance"];
export default function WebhookManager({ address }) {
  const { registered, loading, error, register, remove, webhookId } = useWebhook();
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState(["anchor","verify"]);
  const toggle = e => setEvents(p => p.includes(e) ? p.filter(x => x !== e) : [...p, e]);
  const s = { background:"#0a0a0a", border:"1px solid #2a2a2a", borderRadius:6, padding:"8px 12px", color:"#f5f0e8", fontFamily:"Space Mono,monospace", fontSize:12, width:"100%", boxSizing:"border-box" };
  return (
    <div style={{ padding:20, background:"#111", border:"1px solid #1a1a1a", borderRadius:10 }}>
      <div style={{ fontFamily:"Archivo Black,sans-serif", fontSize:13, letterSpacing:1, textTransform:"uppercase", color:"#f5f0e8", marginBottom:14 }}>Webhook</div>
      {!registered ? (<>
        <input style={s} placeholder="https://your-endpoint.com/hook" value={url} onChange={e => setUrl(e.target.value)} />
        <div style={{ display:"flex", gap:8, marginTop:10 }}>{EVENTS.map(ev => <label key={ev} style={{ display:"flex", alignItems:"center", gap:4, fontFamily:"Space Mono,monospace", fontSize:11, color:"#888", cursor:"pointer" }}><input type="checkbox" checked={events.includes(ev)} onChange={() => toggle(ev)} />{ev}</label>)}</div>
        {error && <div style={{ color:"#ff3333", fontSize:11, marginTop:6 }}>{error}</div>}
        <button onClick={() => register({ url, address, events })} disabled={!url||loading} style={{ marginTop:12, padding:"8px 18px", background:url?"#F7931A":"#222", color:url?"#0a0a0a":"#555", border:"none", borderRadius:6, cursor:url?"pointer":"default", fontFamily:"Archivo Black,sans-serif", fontSize:12, letterSpacing:1 }}>{loading ? "Registering…" : "Register"}</button>
      </>) : (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"#00ff88", fontFamily:"Space Mono,monospace", fontSize:12 }}>✓ Active</span>
          <button onClick={() => remove(webhookId)} style={{ background:"none", border:"1px solid #333", borderRadius:6, padding:"6px 12px", color:"#ff3333", cursor:"pointer", fontFamily:"Space Mono,monospace", fontSize:11 }}>Remove</button>
        </div>
      )}
    </div>
  );
}