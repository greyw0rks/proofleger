"use client";
import ProofCard from "./ProofCard";
import EmptyState from "./EmptyState";
import PaginationBar from "./PaginationBar";
import { usePagination } from "@/hooks/usePagination";

export default function DocGrid({ docs = [], onAttest, onMint, walletAddress, pageSize = 9 }) {
  const { pageItems, ...pagination } = usePagination(docs, pageSize);

  if (docs.length === 0) return (
    <EmptyState
      title="NO DOCUMENTS YET"
      subtitle="Anchor your first document to Bitcoin to get started"
      action="ANCHOR DOCUMENT"
    />
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {pageItems.map((doc, i) => (
          <ProofCard key={i}
            hash={doc.hash}
            title={doc.title}
            docType={doc["doc-type"] || doc.docType}
            blockHeight={doc["block-height"] || doc.blockHeight}
            owner={doc.owner}
            attestations={doc.attestations || 0}
            isOwner={doc.owner === walletAddress}
            onAttest={onAttest}
            onMint={onMint}
          />
        ))}
      </div>
      <PaginationBar {...pagination} />
    </div>
  );
}