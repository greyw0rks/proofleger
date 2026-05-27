// generated: jun8  util: gov_analytics_v2
// v2 governance analytics helpers
export const gov_analytics_v2Config = { version: '1.0.0', tag: 'jun8' };
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
