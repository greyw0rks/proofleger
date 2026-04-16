const DB_NAME = "proofleger";
const DB_VERSION = 1;
const STORE_DRAFTS = "drafts";
const STORE_CACHE = "proof_cache";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) db.createObjectStore(STORE_DRAFTS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORE_CACHE)) db.createObjectStore(STORE_CACHE, { keyPath: "hash" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDraft(draft) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DRAFTS, "readwrite");
    tx.objectStore(STORE_DRAFTS).put({ ...draft, id: "current", savedAt: Date.now() });
    tx.oncomplete = resolve; tx.onerror = reject;
  });
}

export async function getDraft() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_DRAFTS, "readonly");
    const req = tx.objectStore(STORE_DRAFTS).get("current");
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

export async function cacheProof(hash, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CACHE, "readwrite");
    tx.objectStore(STORE_CACHE).put({ hash, data, cachedAt: Date.now() });
    tx.oncomplete = resolve; tx.onerror = reject;
  });
}

export async function getCachedProof(hash) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_CACHE, "readonly");
    const req = tx.objectStore(STORE_CACHE).get(hash);
    req.onsuccess = () => {
      const result = req.result;
      if (!result) return resolve(null);
      const age = Date.now() - result.cachedAt;
      if (age > 5 * 60 * 1000) return resolve(null); // 5 min TTL
      resolve(result.data);
    };
    req.onerror = () => resolve(null);
  });
}