export function sortByNewest(items) {
  return [...items].sort((a, b) => (b["block-height"]||b.blockHeight||0) - (a["block-height"]||a.blockHeight||0));
}
export function sortByOldest(items) {
  return [...items].sort((a, b) => (a["block-height"]||a.blockHeight||0) - (b["block-height"]||b.blockHeight||0));
}
export function sortByAttestations(items) {
  return [...items].sort((a, b) => (b.attestations||0) - (a.attestations||0));
}
export function sortByType(items) {
  return [...items].sort((a, b) => {
    const ta = a["doc-type"]||a.docType||"";
    const tb = b["doc-type"]||b.docType||"";
    return ta.localeCompare(tb);
  });
}
export function applySort(items, sortKey) {
  switch(sortKey) {
    case "newest": return sortByNewest(items);
    case "oldest": return sortByOldest(items);
    case "attestations": return sortByAttestations(items);
    case "type": return sortByType(items);
    default: return items;
  }
}