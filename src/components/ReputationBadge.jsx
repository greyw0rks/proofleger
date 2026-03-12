"use client";
import { REPUTATION_TIERS } from "@/lib/constants";

/**
 * ReputationBadge displays a user's reputation tier and score.
 *
 * Tier is determined by total score:
 *   1000+ = Legend (orange)
 *   500+  = Authority (purple)
 *   250+  = Expert (green)
 *   100+  = Contributor (blue)
 *   0+    = Builder (grey)
 *
 * @param {object} props
 * @param {number} props.score - Total reputation score
 * @param {"sm"|"md"|"lg"} [props.size="md"] - Badge size
 * @param {boolean} [props.showScore=true] - Whether to show numeric score
 */
export default function ReputationBadge({ score = 0, size = "md", showScore = true }) {
  const tier = REPUTATION_TIERS.find((t) => score >= t.min) || REPUTATION_TIERS[REPUTATION_TIERS.length - 1];

  const sizes = {
    sm: { padding: "2px 8px",  fontSize: "10px", scoreSize: "10px" },
    md: { padding: "4px 12px", fontSize: "12px", scoreSize: "12px" },
    lg: { padding: "6px 16px", fontSize: "14px", scoreSize: "14px" },
  };
  const sz = sizes[size] || sizes.md;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <span style={{
        border: `2px solid ${tier.color}`,
        color: tier.color,
        padding: sz.padding,
        fontSize: sz.fontSize,
        fontFamily: "Archivo Black, sans-serif",
        boxShadow: `2px 2px 0px ${tier.color}`,
        letterSpacing: "0.5px",
      }}>
        {tier.label}
      </span>
      {showScore && (
        <span style={{
          fontSize: sz.scoreSize,
          color: "#888",
          fontFamily: "Space Mono, monospace",
        }}>
          {score.toLocaleString()} pts
        </span>
      )}
    </span>
  );
}
