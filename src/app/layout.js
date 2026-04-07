import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";
const archivoBlack = Archivo_Black({ weight:"400", subsets:["latin"], variable:"--font-heading" });
const spaceGrotesk = Space_Grotesk({ subsets:["latin"], variable:"--font-body" });
const spaceMono = Space_Mono({ weight:["400","700"], subsets:["latin"], variable:"--font-mono" });
export const metadata = {
  title: "ProofLedger — Anchor Documents to Bitcoin",
  description: "Prove document existence on Bitcoin via Stacks. SHA-256 hash your files and anchor them permanently to the blockchain.",
  keywords: ["bitcoin", "stacks", "document proof", "blockchain", "sha256", "anchoring"],
  openGraph: { title:"ProofLedger", description:"Anchor documents to Bitcoin", url:"https://proofleger.vercel.app", siteName:"ProofLedger" },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body style={{ margin:0, background:"#0a0a0a" }}>{children}</body>
    </html>
  );
}
