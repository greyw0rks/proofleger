import { useEffect, useRef } from "react";
const TYPE_COLOR = { anchor:"#F7931A", verify:"#00ff88", dispute:"#ff3333", governance:"#FCFF52" };
function Row({ n, onDismiss }) {
  return (
    <div style={{ display:"flex", gap:10, padding:"10px 14px", borderBottom:"1px solid #1a1a1a", alignItems:"flex-start" }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:TYPE_COLOR[n.type]??"#888", marginTop:5, flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"Space Grotesk,sans-serif", fontSize:13, color:"#f5f0e8" }}>{n.message}</div>
        <div style={{ fontFamily:"Space Mono,monospace", fontSize:11, color:"#555", marginTop:2 }}>{n.chain ?? "stacks"}</div>
      </div>
      <button onClick={() => onDismiss(n.id)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:16 }}>×</button>
    </div>
  );
}
export default function NotificationPanel({ notifications, onDismiss, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [onClose]);
  return (
    <div ref={ref} style={{ position:"absolute", top:"100%", right:0, marginTop:8, width:300, background:"#111", border:"1px solid #222", borderRadius:10, zIndex:1000 }}>
      <div style={{ padding:"12px 14px", borderBottom:"1px solid #1a1a1a", fontFamily:"Archivo Black,sans-serif", fontSize:13, color:"#f5f0e8", letterSpacing:1 }}>Notifications</div>
      {notifications.length === 0 ? <div style={{ padding:24, textAlign:"center", color:"#555", fontFamily:"Space Grotesk,sans-serif", fontSize:13 }}>No notifications</div> : <div style={{ maxHeight:320, overflowY:"auto" }}>{notifications.map(n => <Row key={n.id} n={n} onDismiss={onDismiss} />)}</div>}
    </div>
  );
}