// generated: may20  util: relay  desc: proof relay event normaliser
export const relayConfig = { version: '1.0.0', tag: 'may20' };
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
