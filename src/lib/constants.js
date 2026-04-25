/**
 * ProofLedger Application Constants
 */

// ── Stacks ────────────────────────────────────────────────
export const STACKS_CONTRACT_ADDRESS = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export const STACKS_CONTRACT_NAME    = "proofleger3";
export const STACKS_API              = "https://api.hiro.so";
export const STACKS_EXPLORER         = "https://explorer.hiro.so";

// ── Celo ──────────────────────────────────────────────────
export const CELO_CHAIN_ID      = 42220;
export const CELO_RPC           = "https://feth.celo.org";
export const CELO_EXPLORER      = "https://celoscan.io";

// ── Document types ────────────────────────────────────────
export const DOC_TYPES = [
  { value: "diploma",      label: "Diploma",      color: "#F7931A" },
  { value: "certificate",  label: "Certificate",  color: "#38bdf8" },
  { value: "research",     label: "Research",     color: "#a78bfa" },
  { value: "contribution", label: "Contribution", color: "#00ff88" },
  { value: "award",        label: "Award",        color: "#fbbf24" },
  { value: "art",          label: "Art",          color: "#f472b6" },
  { value: "other",        label: "Other",        color: "#555"    },
];

// ── Limits ────────────────────────────────────────────────
export const MAX_TITLE_LENGTH  = 100;
export const LARGE_FILE_MB     = 5;
export const HASH_CHUNK_SIZE   = 2 * 1024 * 1024; // 2MB

// ── Cache keys ────────────────────────────────────────────
export const CACHE_KEYS = {
  proofHistory:   "pl:proof-history",
  networkPref:    "pl:network",
  walletAddress:  "pl:wallet-address",
  recentHashes:   "pl:recent-hashes",
};

// ── Timing ────────────────────────────────────────────────
export const STACKS_BLOCK_TIME_SECS = 600;  // ~10 min
export const CELO_BLOCK_TIME_SECS   = 5;    // ~5 sec
export const CLIPBOARD_RESET_MS     = 1800;