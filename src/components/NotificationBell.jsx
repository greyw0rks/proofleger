import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationPanel from "./NotificationPanel";
export default function NotificationBell({ address }) {
  const [open, setOpen] = useState(false);
  const { notifications, unread, markRead, dismiss } = useNotifications(address);
  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <button onClick={() => { setOpen(o => !o); markRead(); }}
        style={{ background:"none", border:"1px solid #333", borderRadius:8, padding:"6px 10px", cursor:"pointer", color:"#f5f0e8", position:"relative" }}>
        🔔
        {unread > 0 && <span style={{ position:"absolute", top:-4, right:-4, background:"#F7931A", color:"#0a0a0a", borderRadius:"50%", width:18, height:18, fontSize:11, fontFamily:"Space Mono,monospace", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && <NotificationPanel notifications={notifications} onDismiss={dismiss} onClose={() => setOpen(false)} />}
    </div>
  );
}