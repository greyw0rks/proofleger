const PREFIX = "proofleger:";
export function storageGet(key, fallback = null) {
  try { const v = localStorage.getItem(PREFIX + key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
export function storageSet(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
  catch { return false; }
}
export function storageRemove(key) {
  try { localStorage.removeItem(PREFIX + key); return true; }
  catch { return false; }
}
export const KEYS = {
  WALLET_ADDRESS: "wallet_address",
  PREFERRED_NETWORK: "preferred_network",
  RECENT_HASHES: "recent_hashes",
  DRAFT_TITLE: "draft_title",
  DRAFT_TYPE: "draft_type",
};
