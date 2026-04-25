/**
 * ProofLedger input validation utilities
 */

// Validates a 64-char lowercase hex SHA-256 hash
export function isValidHash(hash) {
  if (!hash || typeof hash !== "string") return false;
  const clean = hash.replace(/^0x/i, "");
  return /^[0-9a-f]{64}$/i.test(clean);
}

// Validates a Stacks principal (standard or contract)
export function isValidStacksAddress(address) {
  if (!address || typeof address !== "string") return false;
  return /^SP[A-Z0-9]{33,41}/.test(address);
}

// Validates an EVM address (Celo / Ethereum)
export function isValidEvmAddress(address) {
  if (!address || typeof address !== "string") return false;
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

// Returns a clean hash or null
export function normalizeHash(input) {
  if (!input) return null;
  const clean = input.trim().replace(/^0x/i, "").toLowerCase();
  return isValidHash(clean) ? clean : null;
}

// Validates doc title constraints (Clarity string-ascii 100)
export function isValidTitle(title) {
  if (!title || typeof title !== "string") return false;
  const trimmed = title.trim();
  return trimmed.length >= 1 && trimmed.length <= 100 &&
    /^[\x00-\x7F]*$/.test(trimmed); // ASCII only
}

export const DOC_TYPES = ["diploma", "certificate", "research", "contribution", "award", "art", "other"];

export function isValidDocType(type) {
  return DOC_TYPES.includes(type);
}