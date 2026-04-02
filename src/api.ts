import { AnalysisResponse } from "./model/models";

const AI_BASE = "/api";

// Default timeout for all API calls (ms). Prevents indefinite hangs.
const DEFAULT_TIMEOUT_MS = 30_000;

// Combines an optional caller-supplied AbortSignal with an internal timeout.
// Returns a cleanup fn the caller must invoke in a finally block.
function makeSignal(
  callerSignal?: AbortSignal,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new Error("Request timed out")),
    timeoutMs,
  );
  const clear = () => clearTimeout(timer);

  callerSignal?.addEventListener("abort", () => {
    clear();
    controller.abort(callerSignal.reason);
  });

  return { signal: controller.signal, clear };
}

async function parseError(res: Response): Promise<Error> {
  const text = await res.text().catch(() => "");
  return new Error(`Server error ${res.status}${text ? `: ${text}` : ""}`);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchAIInsights(
  code: string,
  options?: { signal?: AbortSignal },
): Promise<{ content: string }> {
  const { /* The `signal` parameter in the functions `fetchAIInsights`, `fetchAIComplete`, and
  `fetchRunCode` is used to provide an optional `AbortSignal` to the fetch request. This
  signal allows the caller to abort the request if needed, for example, in cases where the
  request is taking too long or needs to be cancelled for any reason. */
  signal, clear } = makeSignal(options?.signal);
  try {
    const res = await fetch(`${AI_BASE}/ai/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      signal,
    });
    if (!res.ok) throw await parseError(res);
    return res.json();
  } finally {
    clear();
  }
}

export async function fetchAIComplete(
  line: string,
  options?: { signal?: AbortSignal },
): Promise<{ completion: string }> {
  const { signal, clear } = makeSignal(options?.signal);
  try {
    const res = await fetch(`${AI_BASE}/ai/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ line }),
      signal,
    });
    if (!res.ok) throw await parseError(res);
    return res.json();
  } finally {
    clear();
  }
}

export async function fetchRunCode(
  code: string,
  options?: { signal?: AbortSignal },
): Promise<AnalysisResponse> {
  const { signal, clear } = makeSignal(options?.signal);
  try {
    const res = await fetch(`${AI_BASE}/eval/run_code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      signal,
    });
    if (!res.ok) throw await parseError(res);
    return res.json();
  } finally {
    clear();
  }
}