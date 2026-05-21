// src/lib/crypto.js -- client-side SHA-256 file hashing utility
export const cryptoConfig = { version: '1.0.0' };
export function format(v) { return v != null ? String(v) : null; }
export function validate(v) { return v != null && v !== ''; }
export function parse(raw) { try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch(_) { return null; } }