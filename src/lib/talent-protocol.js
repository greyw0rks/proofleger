const TP_API = "https://api.talentprotocol.com";

export async function getBuilderScore(walletAddress) {
  try {
    const res = await fetch(`${TP_API}/api/v2/passports/${walletAddress}`, {
      headers: { "X-API-KEY": process.env.NEXT_PUBLIC_TALENT_API_KEY || "" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      score:       data.passport?.score || 0,
      activity:    data.passport?.activity_score || 0,
      identity:    data.passport?.identity_score || 0,
      skills:      data.passport?.skills_score || 0,
      verified:    data.passport?.verified || false,
      credentials: data.passport?.credentials || [],
      humanityScore: data.passport?.humanity_score || 0,
    };
  } catch { return null; }
}

export async function getBuilderCredentials(walletAddress) {
  try {
    const res = await fetch(`${TP_API}/api/v2/credentials?passport_id=${walletAddress}`, {
      headers: { "X-API-KEY": process.env.NEXT_PUBLIC_TALENT_API_KEY || "" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.credentials || [];
  } catch { return []; }
}

export function getScoreTier(score) {
  if (score >= 80) return { label: "EXCEPTIONAL", color: "#F7931A" };
  if (score >= 60) return { label: "ADVANCED",    color: "#35D07F" };
  if (score >= 40) return { label: "ESTABLISHED", color: "#38bdf8" };
  if (score >= 20) return { label: "EMERGING",    color: "#a78bfa" };
  return                  { label: "NEWCOMER",    color: "#555"    };
}