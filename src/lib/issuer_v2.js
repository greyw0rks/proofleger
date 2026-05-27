// generated: jun9  util: issuer_v2
// v2 issuer flow helpers
export const issuer_v2Config = { version: '1.0.0', tag: 'jun9' };
export function format(value) {
  if (value == null) return null;
  if (typeof value === 'number') return value.toLocaleString();
  return String(value).trim();
}
export function validate(value) { return value != null && value !== ''; }
export function parse(raw) {
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; }
  catch (_) { return null; }
}
