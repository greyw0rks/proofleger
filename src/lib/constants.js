/**
 * @fileoverview Centralized constants for ProofLedger
 * Single source of truth for contract addresses, network config,
 * reputation tiers, and document type definitions
 */

// ─── Network ────────────────────────────────────────────────
export const USE_TESTNET = false;
export const NETWORK = "mainnet";

// ─── Contract Addresses ─────────────────────────────────────
export const CONTRACT_ADDRESS = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export const CONTRACTS = {
  CORE: `${CONTRACT_ADDRESS}.proofleger3`,
  CREDENTIALS: `${CONTRACT_ADDRESS}.credentials`,
  ACHIEVEMENTS: `${CONTRACT_ADDRESS}.achievements`,
};

// ─── API ────────────────────────────────────────────────────
export const HIRO_API_BASE = "https://api.hiro.so";
export const STACKS_EXPLORER = "https://explorer.hiro.so";

// ─── Document Types ─────────────────────────────────────────
export const DOC_TYPES = [
  { value: "diploma",      label: "Diploma",      emoji: "🎓" },
  { value: "certificate",  label: "Certificate",  emoji: "📜" },
  { value: "research",     label: "Research",     emoji: "🔬" },
  { value: "art",          label: "Art",          emoji: "🎨" },
  { value: "contribution", label: "Contribution", emoji: "🛠️" },
  { value: "award",        label: "Award",        emoji: "🏆" },
  { value: "other",        label: "Other",        emoji: "📄" },
];

// ─── Reputation ─────────────────────────────────────────────
export const REPUTATION_SCORES = {
  diploma: 50, research: 40, certificate: 30,
  art: 20, contribution: 20, award: 10, other: 10,
};
export const ATTESTATION_SCORE = 10;
export const NFT_SCORE = 25;

export const REPUTATION_TIERS = [
  { min: 1000, label: "Legend",      color: "#F7931A" },
  { min: 500,  label: "Authority",   color: "#a78bfa" },
  { min: 250,  label: "Expert",      color: "#22c55e" },
  { min: 100,  label: "Contributor", color: "#38bdf8" },
  { min: 0,    label: "Builder",     color: "#666"    },
];

// ─── UI ─────────────────────────────────────────────────────
export const COLORS = {
  black:  "#0a0a0a",
  white:  "#f5f0e8",
  orange: "#F7931A",
  green:  "#00ff88",
  red:    "#ff3333",
  grey:   "#888",
};

export const MAX_FILE_SIZE_MB = 100;
export const STX_FEE_MICROSTACK = 1000;
