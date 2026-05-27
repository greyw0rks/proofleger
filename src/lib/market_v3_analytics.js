// generated: jun11  util: market_v3_analytics
// v3 market analytics helpers
export const market_v3_analyticsConfig = { version: '1.0.0', tag: 'jun11' };
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
