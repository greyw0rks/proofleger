/**
 * ProofLedger client-side analytics
 * Minimal event tracking — no PII, no third-party SDKs
 */

const EVENTS = [];
const MAX_EVENTS = 100;

export function track(event, props = {}) {
  const entry = {
    event,
    props,
    ts: new Date().toISOString(),
    path: typeof window !== "undefined" ? window.location.pathname : null,
  };
  EVENTS.push(entry);
  if (EVENTS.length > MAX_EVENTS) EVENTS.shift();
  if (process.env.NODE_ENV === "development") {
    console.debug("[track]", event, props);
  }
}

export function trackAnchor(chain, docType) {
  track("anchor_submit", { chain, docType });
}

export function trackVerify(chain, found) {
  track("verify_attempt", { chain, found });
}

export function trackWalletConnect(walletType) {
  track("wallet_connect", { walletType });
}

export function trackPageView(page) {
  track("page_view", { page });
}

export function getRecentEvents(n = 20) {
  return EVENTS.slice(-n);
}