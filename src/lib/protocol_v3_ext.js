// generated: jun11  util: protocol_v3_ext
// extended v3 protocol helpers
export const protocol_v3_extConfig = { version: '1.0.0', tag: 'jun11' };
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
