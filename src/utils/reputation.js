export const DOC_SCORES = { diploma:50, research:40, certificate:30, art:20, contribution:20, award:10, other:10 };
export const TIERS = [
  { min:1000, label:"Legend",      color:"#F7931A", emoji:"👑" },
  { min:500,  label:"Authority",   color:"#a78bfa", emoji:"⭐" },
  { min:250,  label:"Expert",      color:"#22c55e", emoji:"🔬" },
  { min:100,  label:"Contributor", color:"#38bdf8", emoji:"🛠️" },
  { min:0,    label:"Builder",     color:"#666",    emoji:"🏗️" },
];
export function getScore(docs) {
  return docs.reduce((s, d) => s + (DOC_SCORES[d.docType]||10) + (d.attestations||0)*10 + (d.hasNFT?25:0), 0);
}
export function getTier(score) {
  return TIERS.find(t => score >= t.min) || TIERS[TIERS.length-1];
}
export function getReputation(docs) {
  const score = getScore(docs);
  return { score, ...getTier(score) };
}
