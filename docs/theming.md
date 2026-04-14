# ProofLedger Design System

## Colors

```javascript
import { THEME } from "@/utils/color";

THEME.black      // #0a0a0a  — background
THEME.white      // #f5f0e8  — foreground (warm white)
THEME.orange     // #F7931A  — Bitcoin orange, primary accent
THEME.green      // #00ff88  — success, verified state
THEME.red        // #ff3333  — error state
THEME.celoGreen  // #35D07F  — Celo network accent
```

## Typography

```css
font-family: "Archivo Black"  /* headings, labels */
font-family: "Space Grotesk"  /* body text */
font-family: "Space Mono"     /* monospace, hashes, addresses */
```

## Neo-Brutalist Borders

```css
border: 3px solid #f5f0e8;
box-shadow: 6px 6px 0px #f5f0e8;  /* standard shadow */
box-shadow: 6px 6px 0px #F7931A;  /* orange shadow */
```

## Component Patterns

- Buttons: translate on hover/active, hard box-shadow
- Cards: 3px border + 6px offset shadow
- Tags: 2px border, no radius
- Inputs: 3px border, transparent background, orange focus