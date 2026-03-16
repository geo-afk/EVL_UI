import { CharStream, CommonTokenStream } from "antlr4ng";
import { EVALLexer } from "../generated/EVALLexer";
import { EVALParser } from "../generated/EVALParser";

// ─── Public types ─────────────────────────────────────────────────────────────

/** A single diagnostic produced by the ANTLR parse pass. */
export interface ANTLRError {
  line: number;
  column: number;
  message: string;
  type: "error" | "warning" | "info";
}

// ─── Dev-mode error visibility ────────────────────────────────────────────────

/**
 * Call this once at app startup (e.g. in main.ts / index.tsx) to surface
 * otherwise-silent runtime errors when there is no terminal output.
 *
 * It overlays a small red box in the top-right corner whenever an unhandled
 * error or unhandled promise rejection occurs, so a blank screen is never
 * truly silent.
 *
 * No-op in production (NODE_ENV !== "development").
 */
export function installDevErrorOverlay(): void {
  if (!import.meta.env.DEV) return;

  function showOverlay(message: string): void {
    const existing = document.getElementById("__dev_error_overlay");
    if (existing) existing.remove();

    const box = document.createElement("pre");
    box.id = "__dev_error_overlay";
    Object.assign(box.style, {
      position: "fixed",
      top: "0",
      right: "0",
      maxWidth: "60vw",
      maxHeight: "40vh",
      overflow: "auto",
      background: "#1e1e1e",
      color: "#f44",
      border: "2px solid #f44",
      padding: "12px 16px",
      fontSize: "13px",
      fontFamily: "monospace",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      zIndex: "999999",
      borderRadius: "0 0 0 6px",
    });
    box.textContent = "⚠ Runtime error\n\n" + message;
    box.addEventListener("click", () => box.remove());
    document.body.appendChild(box);
  }

  window.addEventListener("error", (event) => {
    console.error(
      "[DevOverlay] Unhandled error:",
      event.error ?? event.message,
    );
    showOverlay(
      event.error instanceof Error
        ? `${event.error.name}: ${event.error.message}\n\n${event.error.stack ?? ""}`
        : String(event.message),
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    console.error("[DevOverlay] Unhandled promise rejection:", reason);
    showOverlay(
      reason instanceof Error
        ? `${reason.name}: ${reason.message}\n\n${reason.stack ?? ""}`
        : String(reason),
    );
  });
}

// ─── Human-readable message cleanup ──────────────────────────────────────────

/**
 * Rewrites raw ANTLR error messages into friendlier user-facing text.
 * Unrecognised messages are returned unchanged.
 */
function humaniseMessage(msg: string, tokenText: string): string {
  if (msg.startsWith("no viable alternative"))
    return `Unexpected token: '${tokenText}' — check for a syntax error here`;

  const mismatch = msg.match(/^mismatched input '(.+?)' expecting (.+)$/);
  if (mismatch) {
    const expected = mismatch[2].replace(/<EOF>/g, "end of file");
    return `Unexpected '${mismatch[1]}' — expected ${expected}`;
  }

  const extraneous = msg.match(/^extraneous input '(.+?)' expecting (.+)$/);
  if (extraneous) {
    const expected = extraneous[2].replace(/<EOF>/g, "end of file");
    return `Extraneous '${extraneous[1]}' — expected ${expected}`;
  }

  const missing = msg.match(/^missing (.+?) at '(.+?)'$/);
  if (missing) return `Missing ${missing[1]} before '${missing[2]}'`;

  if (msg.startsWith("token recognition error"))
    return `Unrecognised character: ${tokenText}`;

  return msg;
}

// ─── Error listener ───────────────────────────────────────────────────────────

/**
 * Plain class (no extends, no implements) that duck-types as an ANTLR error
 * listener.  antlr4ng's addErrorListener() only checks for these methods at
 * runtime — no base class import is needed and none is safe to assume.
 *
 * WHY a plain class (not `extends ErrorListener` or `implements ANTLRErrorListener`):
 *   The symbols exported by antlr4ng differ across patch versions.  Using either
 *   approach caused a hard "X is not a constructor" / "X is not exported" crash
 *   at module load time, producing a blank screen with no terminal output.
 *   Duck-typing is both safer and fully equivalent in runtime behaviour.
 *
 * WHY ambiguity / fullContext / contextSensitivity are empty:
 *   These fire during ANTLR's internal SLL→LL prediction retry and say nothing
 *   about the user's code.  They must never appear as editor markers.
 */
class CollectingErrorListener {
  public readonly errors: ANTLRError[] = [];

  syntaxError(
    _recognizer: unknown,
    offendingSymbol: unknown,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: unknown,
  ): void {
    // offendingSymbol is null for lexer errors — guard before reading .text
    const tokenText =
      offendingSymbol != null &&
      typeof offendingSymbol === "object" &&
      "text" in offendingSymbol
        ? String((offendingSymbol as { text: unknown }).text)
        : "<unknown>";

    this.errors.push({
      line,
      column: charPositionInLine + 1, // ANTLR: 0-based → Monaco: 1-based
      message: humaniseMessage(msg, tokenText),
      type: "error",
    });
  }

  // Required by the ANTLR listener protocol — must exist but must stay silent.
  reportAmbiguity(): void {
    /* SLL→LL fallback — not a user error */
  }
  reportAttemptingFullContext(): void {
    /* full-context retry — not a user error */
  }
  reportContextSensitivity(): void {
    /* context sensitivity — not a user error */
  }
}

// ─── Public entry point ───────────────────────────────────────────────────────

/**
 * Parses `code` through the EVAL ANTLR grammar and returns every syntax error
 * found.  Returns an empty array for valid programs.
 *
 * Any unexpected exception thrown by the parser is caught and converted into a
 * single error entry so callers always receive a stable array.
 */
export function parseCode(code: string): ANTLRError[] {
  const listener = new CollectingErrorListener();

  try {
    const input = CharStream.fromString(code);
    const lexer = new EVALLexer(input);
    lexer.removeErrorListeners();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lexer.addErrorListener(listener as any);

    const tokens = new CommonTokenStream(lexer);
    const parser = new EVALParser(tokens);
    parser.removeErrorListeners();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parser.addErrorListener(listener as any);

    parser.program();
  } catch (e: unknown) {
    // Internal ANTLR exception (e.g. stack overflow on deeply nested input).
    const err = e instanceof Error ? e : new Error(String(e));
    listener.errors.push({
      line: (e as { line?: number }).line ?? 0,
      column: (e as { column?: number }).column ?? 0,
      message: `Internal parser error: ${err.message}`,
      type: "error",
    });
  }

  return listener.errors;
}
