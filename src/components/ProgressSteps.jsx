"use client";

export default function ProgressSteps({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      {steps.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        const color   = done ? "#00ff88" : active ? "#F7931A" : "#333";
        const textCol = done ? "#00ff88" : active ? "#F7931A" : "#444";
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, border: `2px solid ${color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Archivo Black, sans-serif", fontSize: 10, color,
                flexShrink: 0, background: done ? `${color}15` : "transparent" }}>
                {done ? "✓" : i + 1}
              </div>
              <div style={{ fontFamily: "Archivo Black, sans-serif",
                fontSize: 8, color: textCol, marginTop: 4, letterSpacing: 1,
                whiteSpace: "nowrap" }}>
                {step.toUpperCase()}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? "#00ff8840" : "#1a1a1a",
                margin: "0 4px", marginBottom: 20 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}