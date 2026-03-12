/**
 * @fileoverview Utility functions for formatting values in ProofLedger UI
 * Handles hash display, STX amounts, dates, and wallet addresses
 */

export function truncateHash(hash, leading = 8, trailing = 8) {
  if (!hash || typeof hash !== "string") return "";
  if (hash.length <= leading + trailing + 3) return hash;
  return `${hash.slice(0, leading)}...${hash.slice(-trailing)}`;
}

export function truncateAddress(address, leading = 6, trailing = 4) {
  if (!address || typeof address !== "string") return "";
  if (address.length <= leading + trailing + 3) return address;
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}

export function formatStx(microStx, decimals = 6) {
  if (microStx === null || microStx === undefined) return "0 STX";
  const stx = Number(microStx) / 1_000_000;
  return `${stx.toFixed(decimals)} STX`;
}

export function formatDate(timestamp, options = {}) {
  if (!timestamp) return "Unknown date";
  const defaults = { year: "numeric", month: "short", day: "numeric" };
  return new Date(timestamp * 1000).toLocaleDateString("en-US", { ...defaults, ...options });
}

export function formatBlock(blockHeight) {
  if (!blockHeight && blockHeight !== 0) return "Unknown block";
  return `Block #${Number(blockHeight).toLocaleString()}`;
}

export function formatDocType(docType) {
  if (!docType) return "Document";
  return docType.charAt(0).toUpperCase() + docType.slice(1).toLowerCase();
}

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function timeAgo(timestamp) {
  if (!timestamp) return "some time ago";
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return formatDate(timestamp);
}
