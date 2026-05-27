// generated: jun9  util: aggregator_v2
// oracle aggregator v2 helpers
export const aggregator_v2Config = { version: '1.0.0', tag: 'jun9' };
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
