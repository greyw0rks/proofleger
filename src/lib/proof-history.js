const DB = "proofleger_history";
const STORE = "proofs";

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "hash" });
        store.createIndex("createdAt", "createdAt");
        store.createIndex("docType", "docType");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addToHistory(proof) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ ...proof, createdAt: Date.now() });
    tx.oncomplete = resolve; tx.onerror = reject;
  });
}

export async function getHistory(limit = 50) {
  const db = await open();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).index("createdAt").getAll();
    req.onsuccess = () => resolve((req.result || []).reverse().slice(0, limit));
    req.onerror = () => resolve([]);
  });
}

export async function clearHistory() {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = resolve; tx.onerror = reject;
  });
}