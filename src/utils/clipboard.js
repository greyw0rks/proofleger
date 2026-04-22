export async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  // Fallback for older browsers
  const el = document.createElement("textarea");
  el.value = text; el.style.position = "fixed";
  el.style.left = "-9999px"; document.body.appendChild(el);
  el.select();
  try { document.execCommand("copy"); return true; }
  catch { return false; }
  finally { document.body.removeChild(el); }
}

export async function readFromClipboard() {
  if (navigator?.clipboard?.readText) {
    return navigator.clipboard.readText();
  }
  return null;
}