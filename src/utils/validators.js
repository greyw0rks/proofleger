/**
 * @fileoverview Validation utilities for ProofLedger inputs
 * Validates hashes, wallet addresses, document types, and file inputs
 */

export const VALID_DOC_TYPES = ["diploma","certificate","research","art","contribution","award","other"];
export const MAX_TITLE_LENGTH = 100;
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export function validateHash(hash) {
  if (!hash || typeof hash !== "string") return { valid: false, error: "Hash is required" };
  const clean = hash.startsWith("0x") ? hash.slice(2) : hash;
  if (!/^[0-9a-fA-F]+$/.test(clean)) return { valid: false, error: "Hash must be a valid hex string" };
  if (clean.length !== 64) return { valid: false, error: `Hash must be 64 hex characters (SHA-256). Got ${clean.length}.` };
  return { valid: true, error: null };
}

export function validateAddress(address) {
  if (!address || typeof address !== "string") return { valid: false, error: "Address is required" };
  const trimmed = address.trim();
  if (!trimmed.startsWith("SP") && !trimmed.startsWith("ST")) return { valid: false, error: "Stacks address must start with SP (mainnet) or ST (testnet)" };
  if (trimmed.length < 30 || trimmed.length > 50) return { valid: false, error: "Invalid address length" };
  return { valid: true, error: null };
}

export function validateTitle(title) {
  if (!title || typeof title !== "string") return { valid: false, error: "Title is required" };
  const trimmed = title.trim();
  if (trimmed.length === 0) return { valid: false, error: "Title cannot be empty" };
  if (trimmed.length > MAX_TITLE_LENGTH) return { valid: false, error: `Title must be ${MAX_TITLE_LENGTH} characters or less` };
  if (!/^[\x00-\x7F]*$/.test(trimmed)) return { valid: false, error: "Title must contain only ASCII characters" };
  return { valid: true, error: null };
}

export function validateDocType(docType, strict = false) {
  if (!docType || typeof docType !== "string") return { valid: false, error: "Document type is required" };
  const trimmed = docType.trim().toLowerCase();
  if (trimmed.length === 0) return { valid: false, error: "Document type cannot be empty" };
  if (strict && !VALID_DOC_TYPES.includes(trimmed)) return { valid: false, error: `Must be one of: ${VALID_DOC_TYPES.join(", ")}` };
  return { valid: true, error: null };
}

export function validateFile(file) {
  if (!file || !(file instanceof File)) return { valid: false, error: "No file selected" };
  if (file.size === 0) return { valid: false, error: "File is empty" };
  if (file.size > MAX_FILE_SIZE_BYTES) return { valid: false, error: "File is too large. Maximum size is 100MB." };
  return { valid: true, error: null };
}

export function validateAnchorForm({ hash, title, docType }) {
  const errors = {};
  const hashResult = validateHash(hash);
  if (!hashResult.valid) errors.hash = hashResult.error;
  const titleResult = validateTitle(title);
  if (!titleResult.valid) errors.title = titleResult.error;
  const docTypeResult = validateDocType(docType);
  if (!docTypeResult.valid) errors.docType = docTypeResult.error;
  return { valid: Object.keys(errors).length === 0, errors };
}
