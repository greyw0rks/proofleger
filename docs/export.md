# ProofLedger Export

Generate shareable proof certificates from any verified document.

## Certificate Page

Visit: `https://proofleger.vercel.app/certificate/{hash}`

Shows a printable certificate with:
- Document title and type
- Block height and network
- Owner address
- SHA-256 hash
- Export buttons

## Export Formats

### JSON Certificate
```javascript
import { exportProofCertificate } from "@/lib/export";
exportProofCertificate(proof);
// Downloads: proofleger-cert-{hash8}.json
```

### Text Certificate
```javascript
import { exportProofText } from "@/lib/export";
exportProofText(proof);
// Downloads: proofleger-cert-{hash8}.txt
```

### CSV (multiple proofs)
```javascript
import { downloadCSV } from "@/utils/download";
downloadCSV(proofs, "my-proofs.csv");
```

## Print

The certificate page includes a print button optimized for PDF export.