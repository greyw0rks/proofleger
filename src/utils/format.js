export const fmt = {
  hash: (h, n=8) => !h ? "" : `${h.slice(0,n)}...${h.slice(-n)}`,
  address: (a) => !a ? "" : `${a.slice(0,6)}...${a.slice(-4)}`,
  stx: (micro, d=4) => `${(Number(micro)/1e6).toFixed(d)} STX`,
  block: (n) => `Block #${Number(n).toLocaleString()}`,
  docType: (t) => t ? t.charAt(0).toUpperCase()+t.slice(1).toLowerCase() : "Document",
  bytes: (b) => { if(!b) return "0 B"; const u=["B","KB","MB","GB"]; const i=Math.floor(Math.log(b)/Math.log(1024)); return `${(b/Math.pow(1024,i)).toFixed(1)} ${u[i]}`; },
  date: (ts) => new Date(ts*1000).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
};
