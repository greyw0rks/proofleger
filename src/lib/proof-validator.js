import { isValidSha256 } from "@/utils/crypto";

export const DOC_TYPES = ["diploma","certificate","research","art","contribution","award","other"];

export function validateProofInput({ hash, title, docType }) {
  const errors = {};

  if (!hash) {
    errors.hash = "Hash is required";
  } else if (!isValidSha256(hash)) {
    errors.hash = "Must be a valid SHA-256 hash (64 hex chars)";
  }

  if (!title?.trim()) {
    errors.title = "Title is required";
  } else if (title.trim().length > 100) {
    errors.title = "Title must be 100 characters or less";
  } else if (!/^[\x00-\x7F]*$/.test(title)) {
    errors.title = "Title must be ASCII characters only";
  }

  if (!docType) {
    errors.docType = "Document type is required";
  } else if (!DOC_TYPES.includes(docType)) {
    errors.docType = `Must be one of: ${DOC_TYPES.join(", ")}`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function sanitizeTitle(title) {
  return title?.trim().replace(/[^\x00-\x7F]/g, "").slice(0, 100) || "";
}

export function normalizeHash(hash) {
  return hash?.replace(/^0x/i, "").toLowerCase() || "";
}