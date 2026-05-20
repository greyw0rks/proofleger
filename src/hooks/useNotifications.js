import { useState, useEffect, useCallback, useRef } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export function useNotifications(address) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const seenRef = useRef(new Set());
  const fetch_ = useCallback(async () => {
    if (!address) return;
    try {
      const r = await fetch(`${API}/v2/notifications/${address}`);
      const d = await r.json();
      const items = d.notifications ?? [];
      setUnread(items.filter(n => !seenRef.current.has(n.id)).length);
      setNotifications(items);
    } catch (_) {}
  }, [address]);
  const markRead = useCallback(() => { notifications.forEach(n => seenRef.current.add(n.id)); setUnread(0); }, [notifications]);
  const dismiss = useCallback(id => { setNotifications(p => p.filter(n => n.id !== id)); seenRef.current.add(id); setUnread(p => Math.max(0, p - 1)); }, []);
  useEffect(() => { fetch_(); const t = setInterval(fetch_, 30000); return () => clearInterval(t); }, [fetch_]);
  return { notifications, unread, markRead, dismiss, refetch: fetch_ };
}