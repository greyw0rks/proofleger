// src/lib/storage.js -- localStorage key helpers with SSR guard
export const storageConfig = { version: '1.0.0' };
export function format(v) { return v != null ? String(v) : null; }
export function validate(v) { return v != null && v !== ''; }
export function parse(raw) { try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch(_) { return null; } }