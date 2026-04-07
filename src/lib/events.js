const listeners = new Map();
export function on(event, callback) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(callback);
  return () => off(event, callback);
}
export function off(event, callback) {
  listeners.get(event)?.delete(callback);
}
export function emit(event, data) {
  listeners.get(event)?.forEach(cb => { try { cb(data); } catch(e) { console.error(e); } });
}
export const EVENTS = {
  WALLET_CONNECTED:    "wallet:connected",
  WALLET_DISCONNECTED: "wallet:disconnected",
  DOCUMENT_ANCHORED:   "document:anchored",
  DOCUMENT_ATTESTED:   "document:attested",
  NFT_MINTED:          "nft:minted",
  NETWORK_CHANGED:     "network:changed",
};
