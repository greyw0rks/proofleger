export function parseProofUrl(url) {
  try {
    const u = new URL(url);
    const hash = u.searchParams.get("hash");
    const tab = u.searchParams.get("tab");
    const wallet = u.pathname.match(/\/profile\/([^/]+)/)?.[1];
    return { hash, tab, wallet, valid: !!(hash || wallet) };
  } catch { return { valid: false }; }
}

export function buildShareUrl(type, value) {
  const base = "https://proofleger.vercel.app";
  switch(type) {
    case "proof": return `${base}/verify?hash=${value}`;
    case "profile": return `${base}/profile/${value}`;
    case "certificate": return `${base}/certificate/${value}`;
    case "credential": return `${base}/credential/${value}`;
    default: return base;
  }
}

export async function nativeShare(title, url) {
  if (navigator.share) {
    return navigator.share({ title, url });
  }
  return navigator.clipboard.writeText(url);
}

export function generateQR(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=0a0a0a&color=f5f0e8`;
}