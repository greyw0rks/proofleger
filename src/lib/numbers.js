// src/lib/numbers.js -- number formatting and percentage helpers
export const numbersConfig = { version: '1.0.0' };
export function format(v) { return v != null ? String(v) : null; }
export function validate(v) { return v != null && v !== ''; }
export function parse(raw) { try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch(_) { return null; } }