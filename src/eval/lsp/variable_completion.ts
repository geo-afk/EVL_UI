import type * as monaco from "monaco-editor";

// ─── Parsed variable record ───────────────────────────────────────────────────

export interface DeclaredVariable {
  name: string;
  type: string; // "int" | "float" | "string" | "bool"
  isConst: boolean;
  initValue: string; // the literal RHS as written, e.g. "32" or `"hello"`
  line: number; // 1-based declaration line
}

// ─── Regex patterns (mirrors validator.ts) ────────────────────────────────────

// const int x = 32  |  int x = 32
const DECL_RE =
  /^\s*(const\s+)?(int|float|string|bool)\s+([a-zA-Z_]\w*)\s*=\s*(.+)/;

// ─── Document scanner ─────────────────────────────────────────────────────────

/**
 * Scans every line of `code` that appears AT OR BEFORE `cursorLine` (1-based)
 * and returns one record per unique variable / constant declaration found.
 *
 * Variables declared on lines after the cursor are excluded so autocomplete
 * never suggests names that aren't yet in scope.
 */
export function extractDeclaredVariables(
  code: string,
  cursorLine: number,
): DeclaredVariable[] {
  const seen = new Set<string>();
  const result: DeclaredVariable[] = [];

  // First, strip all comments from the code
  const rawLines = code.split("\n");
  let inBlockComment = false;
  const processedLines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i];

    if (inBlockComment) {
      const endCommentIndex = line.indexOf("*/");
      if (endCommentIndex !== -1) {
        line = line.substring(endCommentIndex + 2);
        inBlockComment = false;
        processedLines.push(line);
      } else {
        processedLines.push("");
      }
    } else {
      const startCommentIndex = line.indexOf("/*");
      if (startCommentIndex !== -1) {
        const endCommentIndex = line.indexOf("*/", startCommentIndex + 2);
        if (endCommentIndex !== -1) {
          line = line.substring(0, startCommentIndex) + line.substring(endCommentIndex + 2);
          processedLines.push(line);
        } else {
          line = line.substring(0, startCommentIndex);
          processedLines.push(line);
          inBlockComment = true;
        }
      } else {
        processedLines.push(line);
      }
    }
  }

  const lines = processedLines;
  const limit = Math.min(cursorLine, lines.length);

  for (let i = 0; i < limit; i++) {
    // Strip inline comments after block comments are handled
    const stripped = lines[i]
      .replace(/\/\/.*$/, "")
      .replace(/;$/, "")
      .trim();

    // Skip if this line is now empty (was a comment line)
    if (!stripped) continue;

    const m = stripped.match(DECL_RE);
    if (!m) continue;

    const [, constKw, type, name, rawValue] = m;
    if (seen.has(name)) continue;

    seen.add(name);
    result.push({
      name,
      type,
      isConst: !!constKw,
      initValue: rawValue.trim(),
      line: i + 1,
    });
  }

  return result;
}

// ─── Context detector ─────────────────────────────────────────────────────────

/**
 * Returns `true` when the cursor sits inside an unclosed function-call paren,
 * i.e. the text before the cursor on the current line contains `word(` with
 * more `(` than `)` following it.
 *
 * Examples that return true:
 *   print(|          pow(x, |          min(a, max(b, |
 *
 * Used purely to adjust sort priority — variable suggestions are always
 * included regardless of context.
 */
export function isInsideFunctionArgs(textBeforeCursor: string): boolean {
  let depth = 0;
  for (const ch of textBeforeCursor) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
  }
  return depth > 0;
}

/**
 * Returns `true` when the cursor is inside a control-flow condition, e.g.
 *   if (|    while (|    else if (|
 */
export function isInsideCondition(textBeforeCursor: string): boolean {
  return /\b(if|else\s+if|while|for)\s*\([^)]*$/.test(textBeforeCursor);
}

// ─── Completion item builder ───────────────────────────────────────────────────

/**
 * Converts the list of declared variables into Monaco completion items.
 *
 * Sort behaviour:
 *   • When the cursor is inside a function argument OR a condition, variable
 *     suggestions use sortText "0_<name>" so they appear ABOVE keywords.
 *   • Otherwise they use "1_<name>" (same tier as keywords) so they don't
 *     crowd the list in neutral positions.
 */
export function variableCompletionItems(
  variables: DeclaredVariable[],
  range: monaco.IRange,
  monacoInstance: typeof monaco,
  prioritise: boolean,
): monaco.languages.CompletionItem[] {
  return variables.map((v) => {
    const typeLabel = v.isConst ? `const ${v.type}` : v.type;
    const sortPrefix = prioritise ? "0" : "1";

    return {
      label: v.name,
      kind: v.isConst
        ? monacoInstance.languages.CompletionItemKind.Constant
        : monacoInstance.languages.CompletionItemKind.Variable,

      // Shown in the right-hand gutter of the suggestion widget
      detail: typeLabel,

      // Shown in the expanded docs panel
      documentation: {
        value: [
          `**${v.name}** \`${typeLabel}\``,
          ``,
          `Declared on line ${v.line} with initial value \`${v.initValue}\`.`,
          v.isConst
            ? `\n> ⚠ This is a **constant** — it cannot be reassigned.`
            : "",
        ]
          .join("\n")
          .trim(),
        isTrusted: true,
      },

      insertText: v.name,
      sortText: `${sortPrefix}_${v.name}`,
      range,
    };
  });
}
