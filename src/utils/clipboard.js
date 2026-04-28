/**
 * ProofLedger clipboard utilities
 */

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // textarea fallback
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export function buildVerifyUrl(hash, base = "https://verify.proofleger.vercel.app") {
  return `${base}?hash=${encodeURIComponent(hash)}`;
}

export function buildShareText(hash, title) {
  const url = buildVerifyUrl(hash);
  return title
    ? `Verified on ProofLedger: "${title}" — ${url}`
    : `Verified on ProofLedger: ${url}`;
}