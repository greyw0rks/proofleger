export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function withOpacity(hex, opacity) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
}

export const THEME = {
  black:   "#0a0a0a",
  white:   "#f5f0e8",
  orange:  "#F7931A",
  green:   "#00ff88",
  red:     "#ff3333",
  purple:  "#a78bfa",
  blue:    "#38bdf8",
  celoGreen: "#35D07F",
  celoYellow: "#FCFF52",
};