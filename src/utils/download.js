export function downloadJSON(data, filename = "proof.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  triggerDownload(blob, filename);
}

export function downloadText(text, filename = "proof.txt") {
  const blob = new Blob([text], { type: "text/plain" });
  triggerDownload(blob, filename);
}

export function downloadCSV(rows, filename = "proofs.csv") {
  if (!rows.length) return;
  const header = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}