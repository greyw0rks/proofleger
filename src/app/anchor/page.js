"use client";
import AnchorForm from "@/components/AnchorForm";
import { useProofHistory } from "@/hooks/useProofHistory";
import { useNotification } from "@/hooks/useNotification";
import NotificationStack from "@/components/NotificationStack";

export default function AnchorPage() {
  const { add } = useProofHistory();
  const { notifications, remove } = useNotification();

  function handleSuccess(entry) {
    add(entry);
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px",
      fontFamily: "Space Grotesk, sans-serif", color: "#f5f0e8",
      minHeight: "100vh", background: "#0a0a0a" }}>
      <NotificationStack notifications={notifications} onRemove={remove} />
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Archivo Black, sans-serif", fontSize: 26, marginBottom: 4 }}>
          ANCHOR
        </h1>
        <p style={{ color: "#888", fontSize: 13 }}>
          Anchor a document hash permanently on-chain
        </p>
      </div>
      <AnchorForm onSuccess={handleSuccess} />
    </div>
  );
}