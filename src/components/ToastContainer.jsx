"use client";
import { useNotifications } from "@/hooks/useNotifications";

const COLORS = {
  success: "#00ff88", error: "#ff3333", info: "#38bdf8", warning: "#F7931A"
};

export default function ToastContainer() {
  const { notifications, dismiss } = useNotifications();
  if (!notifications.length) return null;
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999,
      display:"flex", flexDirection:"column", gap:8, maxWidth:360 }}>
      {notifications.map(n => (
        <div key={n.id} onClick={() => dismiss(n.id)}
          style={{ background:"#111", border:`3px solid ${COLORS[n.type]||"#555"}`,
            boxShadow:`4px 4px 0 ${COLORS[n.type]||"#555"}`,
            padding:"12px 16px", cursor:"pointer",
            fontFamily:"Space Grotesk, sans-serif", fontSize:13,
            color:"#f5f0e8", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
            background: COLORS[n.type]||"#555" }} />
          {n.message}
        </div>
      ))}
    </div>
  );
}