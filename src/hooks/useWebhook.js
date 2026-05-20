import { useState, useCallback } from "react";
const API = process.env.NEXT_PUBLIC_VERIFIER_API;
export function useWebhook() {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [webhookId, setWebhookId] = useState(null);
  const register = useCallback(async ({ url, address, events = ["anchor","verify"] }) => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`${API}/v2/webhooks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, address, events }) });
      if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
      const d = await r.json(); setWebhookId(d.id); setRegistered(true); return d;
    } catch (e) { setError(e.message); return null; } finally { setLoading(false); }
  }, []);
  const remove = useCallback(async id => {
    setLoading(true);
    try { await fetch(`${API}/v2/webhooks/${id}`, { method: "DELETE" }); setRegistered(false); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);
  return { registered, loading, error, webhookId, register, remove };
}