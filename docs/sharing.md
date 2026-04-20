# ProofLedger Sharing

## Share Links

```javascript
import { buildShareUrl } from "@/lib/share-handler";

buildShareUrl("proof",       "sha256hash")  // /verify?hash=...
buildShareUrl("profile",     "SP1SY1...")   // /profile/SP1SY1...
buildShareUrl("certificate", "sha256hash")  // /certificate/...
```

## Native Share Sheet

```javascript
import { nativeShare } from "@/lib/share-handler";

await nativeShare("My Diploma", "https://proofleger.vercel.app/verify?hash=...");
// Falls back to clipboard copy on desktop
```

## QR Code

```javascript
import { generateQR } from "@/lib/share-handler";

const qrUrl = generateQR("https://proofleger.vercel.app/verify?hash=...");
// Returns image URL, usable in <img src={qrUrl} />
```

## Embed Widget

```jsx
import ProofEmbed from "@/components/ProofEmbed";

<ProofEmbed hash="a1b2c3..." compact />
```

For iFrame embedding, point to:
```
https://proofleger.vercel.app/embed?hash={sha256}
```