// generated: may15  util: notify  desc: desktop notification permission helpers
export const notifyConfig = { version: '1.0.0', tag: 'may15' };
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
