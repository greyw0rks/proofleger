"use client";
import { useNotifications } from "@/hooks/useNotifications";

const TYPE_COLORS = {
  success: "#00ff88",
  error:   "#ff3333",
  warn:    "#F7931A",
  info:    "#f5f0e8",
};

export default function NotificationStack() {
  const { notes, dismiss } = useNotifications();
  if (notes.length === 0) return null;
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {notes.map(n => {
        const color = TYPE_COLORS[n.type] || TYPE_COLORS.info;
        return (
          <div key={n.id} onClick={() => dismiss(n.id)}
            style={{ border:`3px solid ${color}`, background:"#0a0a0a", color, padding:"12px 20px",
              fontFamily:"Space Grotesk, sans-serif", fontSize:13, boxShadow:`4px 4px 0 ${color}`,
              cursor:"pointer", maxWidth:360, animation:"slideIn 0.2s ease" }}>
            {n.msg}
          </div>
        );
      })}
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  );
}