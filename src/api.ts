import { AnalysisResponse } from "./model/models";

const AI_BASE = "/api";

export async function fetchAIInsights(
  code: string,
): Promise<{ content: string }> {
  const res = await fetch(`${AI_BASE}/ai/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchAIComplete(
  line: string,
): Promise<{ completion: string }> {
  const res = await fetch(`${AI_BASE}/ai/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ line }),
  });
  if (!res.ok) {
    throw new Error(`Server error ${res.status}`);
  }
  return res.json();
}

export async function fetchRunCode(code: string): Promise<AnalysisResponse> {
  const res = await fetch(`${AI_BASE}/eval/run_code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text}`);
  }
  return res.json();
}
