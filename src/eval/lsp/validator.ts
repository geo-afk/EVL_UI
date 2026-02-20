import type * as monaco from "monaco-editor";
import { EVAL_LANGUAGE_ID, type Diagnostics } from "../../model/models";

export function retrieveCodeDiagnostics(
  code: string,
  monacoInstance: typeof monaco,
  editor: monaco.editor.IStandaloneCodeEditor
) {
  const model = editor.getModel();
  const diagnostics = analyzeCode(code);

  const markers = diagnostics.map(diag => ({
    severity:
      diag.severity === "error"
        ? monacoInstance.MarkerSeverity.Error
        : monacoInstance.MarkerSeverity.Warning,
    startLineNumber: diag.line,
    startColumn: diag.column ?? 1,
    endLineNumber: diag.line,
    endColumn: diag.endColumn ?? 1000,
    message: diag.message,
    source: "EVAL Analyzer"
  }));

  if (!model) return;
  monacoInstance.editor.setModelMarkers(model, EVAL_LANGUAGE_ID, markers);
}


// ─── Constants & built-ins ───────────────────────────────────────────────────

const BUILTIN_CONSTANTS = new Set(["PI", "DAYS_IN_WEEK", "HOURS_IN_DAY", "YEAR"]);

const BUILTIN_FUNCTIONS: Record<string, { minArgs: number; maxArgs: number }> = {
  cast: { minArgs: 2, maxArgs: 2 },
  pow: { minArgs: 2, maxArgs: 2 },
  sqrt: { minArgs: 1, maxArgs: 1 },
  min: { minArgs: 2, maxArgs: 2 },
  max: { minArgs: 2, maxArgs: 2 },
  round: { minArgs: 1, maxArgs: 1 },
  print: { minArgs: 1, maxArgs: Infinity },
};

const VALID_TYPES = new Set(["int", "float"]);

// Matches: [const] int|float <name> = <expr>
const DECL_RE = /^(const\s+)?(int|float)\s+(\w+)\s*=\s*(.+)/;

// Matches: int|float <name>  — missing "= expr" (incomplete declaration)
const DECL_NO_ASSIGN_RE = /^(const\s+)?(int|float)\s+(\w+)\s*$/;

// Matches: int|float = ...  — missing variable name
const DECL_NO_NAME_RE = /^(const\s+)?(int|float)\s*=\s*/;


// ─── Main analyzeCode ────────────────────────────────────────────────────────

function analyzeCode(code: string): Diagnostics[] {
  const diagnostics: Diagnostics[] = [];
  const rawLines = code.split("\n");

  // Strip inline comments and trailing semicolons for analysis, keep originals for display
  const lines = rawLines.map(l => l.replace(/\/\/.*$/, "").replace(/;$/, "").trim());

  // Track declared variables: name → type
  const variables = new Map<string, "int" | "float">();

  function error(line: number, msg: string, col?: number, end?: number) {
    diagnostics.push({ severity: "error", line, column: col, endColumn: end, message: msg });
  }

  function warn(line: number, msg: string, col?: number, end?: number) {
    diagnostics.push({ severity: "warning", line, column: col, endColumn: end, message: msg });
  }

  // ── PASS 1: collect all declared variable names (so forward refs work) ──
  lines.forEach((t, _i) => {
    const m = t.match(DECL_RE);
    if (m) {
      const [, , type, name] = m;
      variables.set(name, type as "int" | "float");
    }
  });

  // ── PASS 2: full validation ──
  let insideTryCatch = false;

  lines.forEach((t, i) => {
    const ln = i + 1;
    if (t === "") return;

    // Track try/catch blocks (simple heuristic)
    if (t.startsWith("try")) { insideTryCatch = true; return; }
    if (t.startsWith("catch") || t === "}" || t === "{") return;

    // ── Missing variable name: `int = ...` ──────────────────────────────────
    if (DECL_NO_NAME_RE.test(t) && !DECL_RE.test(t)) {
      error(ln, "Variable declaration is missing a name (e.g. `int x = ...`)");
      return;
    }

    // ── Variable declaration ─────────────────────────────────────────────────
    const declMatch = t.match(DECL_RE);
    if (declMatch) {
      const [, isConst, declaredType, varName, expr] = declMatch;

      // Duplicate declaration
      if (variables.has(varName) && !isConst) {
        // Only warn on duplicate (shadowing), not error, since first-pass added it
        // We detect true duplicates by checking if it was already added before this line
        const prevLines = lines.slice(0, i);
        const alreadyDeclared = prevLines.some(pl => {
          const pm = pl.match(DECL_RE);
          return pm && pm[3] === varName;
        });
        if (alreadyDeclared) warn(ln, `Variable '${varName}' is already declared`);
      }

      // Type vs literal value check
      const trimmedExpr = expr.trim();

      if (VALID_TYPES.has(declaredType)) {
        // int assigned a float literal → warn (implicit conversion)
        if (declaredType === "int" && /^\d+\.\d+$/.test(trimmedExpr)) {
          warn(ln, `Assigning float literal to 'int' variable '${varName}' — implicit conversion`);
        }

        // float assigned an int literal → fine, no warning needed

        // int assigned a known float variable
        const rhsVar = variables.get(trimmedExpr);
        if (rhsVar === "float" && declaredType === "int") {
          warn(ln, `Assigning float variable to 'int' variable '${varName}' — implicit conversion`);
        }
      }

      // Check division by zero in expression
      if (/\/\s*0(?!\.)/.test(trimmedExpr) && !insideTryCatch) {
        error(ln, "Division by zero detected");
      }

      // Check for undeclared variable references in expression
      checkUndeclaredRefs(trimmedExpr, variables, ln, varName, error, warn);

      // Validate any function calls in the expression
      validateFunctionCalls(trimmedExpr, ln, error, warn);

      return;
    }

    // ── Incomplete declaration (no assignment) ───────────────────────────────
    if (DECL_NO_ASSIGN_RE.test(t)) {
      const m = t.match(DECL_NO_ASSIGN_RE)!;
      warn(ln, `Variable '${m[3]}' declared but never assigned`);
      return;
    }

    // ── Standalone print(...) ────────────────────────────────────────────────
    if (/^print\s*\(/.test(t)) {
      validateFunctionCalls(t, ln, error, warn);
      return;
    }

    // ── Standalone function call (not in declaration) ────────────────────────
    if (/^\w+\s*\(/.test(t)) {
      validateFunctionCalls(t, ln, error, warn);
      return;
    }

    // ── Division by zero outside try/catch ───────────────────────────────────
    if (/\/\s*0(?!\.)/.test(t) && !insideTryCatch) {
      error(ln, "Division by zero detected outside try/catch block");
      return;
    }

    // ── Bare expression / unknown statement ─────────────────────────────────
    // Anything that doesn't match anything we understand
    if (!/^\s*$/.test(t)) {
      warn(ln, `Unrecognized statement: '${t}'`);
    }
  });

  return diagnostics;
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Scans an expression for identifiers and warns if they're not declared
 * variables, built-in constants, or function names.
 */
function checkUndeclaredRefs(
  expr: string,
  variables: Map<string, "int" | "float">,
  ln: number,
  currentVar: string,
  _error: (l: number, m: string) => void,
  warn: (l: number, m: string) => void
) {
  // Remove string literals and function call names before checking
  const stripped = expr
    .replace(/"[^"]*"/g, "")                   // remove strings
    .replace(/\b(\w+)\s*\(/g, " (")            // remove function names (keep args)
    .replace(/\b(int|float|cast)\b/g, "");     // remove type keywords

  // Extract identifiers
  const identifiers = stripped.match(/\b[a-zA-Z_]\w*\b/g) ?? [];

  for (const id of identifiers) {
    if (
      variables.has(id) ||
      BUILTIN_CONSTANTS.has(id) ||
      BUILTIN_FUNCTIONS[id] ||
      VALID_TYPES.has(id) ||
      id === currentVar
    ) continue;

    warn(ln, `Reference to undeclared identifier '${id}'`);
  }
}

/**
 * Validates function calls found in an expression — argument counts and
 * unknown function names.
 */
function validateFunctionCalls(
  expr: string,
  ln: number,
  error: (l: number, m: string) => void,
  warn: (l: number, m: string) => void
) {
  const callRe = /(\w+)\s*\(([^)]*)\)/g;
  let match: RegExpExecArray | null;

  while ((match = callRe.exec(expr)) !== null) {
    const [, fnName, argsRaw] = match;

    // Skip type keywords used as cast targets
    if (VALID_TYPES.has(fnName)) continue;

    const args = argsRaw.split(",").map(a => a.trim()).filter(a => a !== "");
    const argCount = args.length;

    const sig = BUILTIN_FUNCTIONS[fnName];

    if (!sig) {
      warn(ln, `Unknown function '${fnName}' — is this a built-in or typo?`);
      continue;
    }

    if (argCount < sig.minArgs) {
      error(
        ln,
        `Function '${fnName}' expects at least ${sig.minArgs} argument(s), got ${argCount}`
      );
    } else if (argCount > sig.maxArgs) {
      error(
        ln,
        `Function '${fnName}' expects at most ${sig.maxArgs} argument(s), got ${argCount}`
      );
    }

    // cast(val, type) — second arg must be a valid type
    if (fnName === "cast" && args.length === 2 && !VALID_TYPES.has(args[1])) {
      error(ln, `Invalid cast target type '${args[1]}' — expected 'int' or 'float'`);
    }
  }
}
