import type * as Monaco from "monaco-editor";
import { EVAL_LANGUAGE_ID } from "../../model/models";

// ─── Function signatures ──────────────────────────────────────────────────────
// Each entry defines the parameter name + expected type shown as the hint label.

const FUNCTION_SIGNATURES: Record<string, { name: string; type: string }[]> = {
  cast: [{ name: "value", type: "int | float" }, { name: "target", type: "type" }],
  pow: [{ name: "base", type: "float" }, { name: "exp", type: "float" }],
  sqrt: [{ name: "value", type: "float" }],
  min: [{ name: "a", type: "int | float" }, { name: "b", type: "int | float" }],
  max: [{ name: "a", type: "int | float" }, { name: "b", type: "int | float" }],
  round: [{ name: "value", type: "float" }],
  print: [{ name: "...values", type: "any" }],
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const setInlayHints = (monacoInstance: typeof Monaco) => {
  monacoInstance.languages.registerInlayHintsProvider(EVAL_LANGUAGE_ID, {
    provideInlayHints(model, _range, _token) {
      const hints: Monaco.languages.InlayHint[] = [];
      const lines = model.getLinesContent();

      lines.forEach((line, i) => {
        const lineNumber = i + 1;

        // Strip inline comments so we don't match inside them
        const stripped = line.replace(/\/\/.*$/, "");

        // Find every function call on this line
        // Regex: captures function name + everything inside the parentheses
        const callRe = /\b(\w+)\s*\(([^)]*)\)/g;
        let match: RegExpExecArray | null;

        while ((match = callRe.exec(stripped)) !== null) {
          const fnName = match[1];
          const argsRaw = match[2];
          const signature = FUNCTION_SIGNATURES[fnName];

          if (!signature) continue;

          // Absolute index of the opening '(' in the line
          const parenOpenIndex = match.index + match[0].indexOf("(");

          // Split args and track each one's offset within argsRaw
          const args = splitArgs(argsRaw);

          args.forEach((_arg, argIndex) => {
            const param = signature[Math.min(argIndex, signature.length - 1)];
            if (!param) return;

            // Find where this arg starts within argsRaw
            const argOffsetInRaw = findArgOffset(argsRaw, argIndex);

            // +1 for '(', +1 for Monaco's 1-based columns
            const column = parenOpenIndex + 1 + argOffsetInRaw + 2;

            hints.push({
              kind: monacoInstance.languages.InlayHintKind.Parameter,
              position: { lineNumber, column },
              label: `${param.name}: ${param.type}`,
              paddingRight: true,
            });
          });
        }
      });

      return { hints, dispose: () => { } };
    },
  });
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Splits a raw argument string by commas (top-level only, respects nesting).
 * e.g. "pow(x, 2), y" → ["pow(x, 2)", " y"]
 */
function splitArgs(argsRaw: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let current = "";

  for (const ch of argsRaw) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;

    if (ch === "," && depth === 0) {
      args.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  if (current.trim() !== "" || args.length > 0) args.push(current);
  return args;
}

/**
 * Returns the character offset of the Nth argument within the raw args string.
 * This is used to position the hint right before that argument.
 */
function findArgOffset(argsRaw: string, argIndex: number): number {
  let depth = 0;
  let currentArg = 0;

  for (let ci = 0; ci < argsRaw.length; ci++) {
    const ch = argsRaw[ci];

    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;

    if (currentArg === argIndex) return ci;

    if (ch === "," && depth === 0) {
      currentArg++;
    }
  }

  return 0;
}

