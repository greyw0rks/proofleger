import { sleep } from "@/utils/async";

export async function batchAnchorDocuments(documents, anchorFn, options = {}) {
  const { delayMs = 5000, onProgress, onSuccess, onError } = options;
  const results = [];
  let completed = 0;

  for (const doc of documents) {
    try {
      const txId = await anchorFn(doc.hash, doc.title, doc.docType);
      results.push({ ...doc, txId, status: "success" });
      completed++;
      if (onSuccess) onSuccess(doc, txId);
      if (onProgress) onProgress({ completed, total: documents.length, current: doc });
    } catch(e) {
      results.push({ ...doc, error: e.message, status: "failed" });
      if (onError) onError(doc, e);
    }
    if (completed < documents.length) await sleep(delayMs);
  }

  return {
    results,
    succeeded: results.filter(r => r.status === "success").length,
    failed:    results.filter(r => r.status === "failed").length,
    total:     documents.length,
  };
}