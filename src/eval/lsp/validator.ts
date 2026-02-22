import type * as monaco from "monaco-editor";
import { EVAL_LANGUAGE_ID, type Diagnostics } from "../../model/models";

// ─── Shared type alias ────────────────────────────────────────────────────────
type EVALType = "int" | "float" | "string" | "bool";

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

// Each built-in constant maps to its concrete EVALType.
// PI is a float (3.14159…); the calendar constants are whole-number ints.
const BUILTIN_CONSTANTS = new Map<string, EVALType>([
  ["PI", "float"],
  ["DAYS_IN_WEEK", "int"],
  ["HOURS_IN_DAY", "int"],
  ["YEAR", "int"],
]);

// All types recognised by the grammar.
const VALID_TYPES = new Set<string>(["int", "float", "string", "bool"]);

const BUILTIN_FUNCTIONS: Record<string, { minArgs: number; maxArgs: number }> = {
  cast: { minArgs: 2, maxArgs: 2 },
  pow: { minArgs: 2, maxArgs: 2 },
  sqrt: { minArgs: 1, maxArgs: 1 },
  min: { minArgs: 2, maxArgs: 2 },
  max: { minArgs: 2, maxArgs: 2 },
  round: { minArgs: 1, maxArgs: 1 },
  print: { minArgs: 1, maxArgs: Infinity },
  abs: { minArgs: 1, maxArgs: 1 },
};

/**
 * Describes how a built-in function's return type is determined:
 *
 *   "fixed-float"  → always returns float  (sqrt, pow)
 *   "fixed-int"    → always returns int    (round)
 *   "arg0"         → returns the same type as its first argument (min, max, abs)
 *   "cast-target"  → returns the type named in its second argument (cast)
 *   "void"         → cannot be used in an expression (print)
 */
type FnReturnKind = "fixed-float" | "fixed-int" | "arg0" | "cast-target" | "void";

const FUNCTION_RETURN_KIND: Record<string, FnReturnKind> = {
  pow: "fixed-float",
  sqrt: "fixed-float",
  round: "fixed-int",
  min: "arg0",
  max: "arg0",
  abs: "arg0",
  cast: "cast-target",
  print: "void",
};

/**
 * Functions whose VALUE arguments must all resolve to the same EVALType.
 * Mixed-type arguments (e.g. min(intVar, floatVar)) are a type error.
 */
const HOMOGENEOUS_ARG_FNS = new Set(["min", "max", "pow", "sqrt", "round", "abs"]);

// ─── Regex patterns ───────────────────────────────────────────────────────────

// [const] int|float|string|bool <n> = <expr>
const DECL_RE = /^(const\s+)?(int|float|string|bool)\s+(\w+)\s*=\s*(.+)/;
// [const] int|float|string|bool <n>          (no assignment)
const DECL_NO_ASSIGN_RE = /^(const\s+)?(int|float|string|bool)\s+(\w+)\s*$/;
// [const] int|float|string|bool = ...        (missing variable name)
const DECL_NO_NAME_RE = /^(const\s+)?(int|float|string|bool)\s*=\s*/;


// ─── Parenthesis-aware utilities ─────────────────────────────────────────────

/**
 * Splits a raw argument string on TOP-LEVEL commas only.
 * Handles nested calls correctly:
 *   "cast(x, int), y"  →  ["cast(x, int)", "y"]
 */
function splitTopLevelArgs(argsStr: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let cur = "";

  for (const ch of argsStr) {
    if (ch === "(" || ch === "[") { depth++; cur += ch; }
    else if (ch === ")" || ch === "]") { depth--; cur += ch; }
    else if (ch === "," && depth === 0) { args.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  if (cur.trim() !== "") args.push(cur.trim());
  return args;
}

/**
 * Finds ALL function calls anywhere in `expr`, including nested ones, and
 * returns `{ name, args }` pairs using a proper parenthesis counter.
 *
 * Example:
 *   print(cast(x, int))
 *   → [{ name:"print", args:["cast(x, int)"] },
 *      { name:"cast",  args:["x", "int"]     }]
 */
function extractAllCalls(expr: string): Array<{ name: string; args: string[] }> {
  const result: Array<{ name: string; args: string[] }> = [];
  const re = /([a-zA-Z_]\w*)\s*\(/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(expr)) !== null) {
    const name = m[1];
    const parenOpen = m.index + m[0].length;

    let depth = 1, j = parenOpen;
    while (j < expr.length && depth > 0) {
      if (expr[j] === "(") depth++;
      else if (expr[j] === ")") depth--;
      j++;
    }

    const argsStr = expr.slice(parenOpen, j - 1);
    result.push({ name, args: splitTopLevelArgs(argsStr) });
  }

  return result;
}


// ─── Type inference ───────────────────────────────────────────────────────────

/**
 * Attempts to resolve the EVALType of a single expression token or call.
 *
 * Returns `undefined` when the type cannot be determined statically
 * (complex arithmetic, unknown identifiers, etc.).  Callers skip
 * type-mismatch checks in that case rather than emitting false positives.
 */
function inferExprType(
  expr: string,
  variables: Map<string, EVALType>
): EVALType | undefined {

  const t = expr.trim();

  if (/^\d+$/.test(t)) return "int";      // integer literal  e.g. 42
  if (/^\d+\.\d+$/.test(t)) return "float";    // float literal    e.g. 3.14
  if (/^"[^"]*"$/.test(t)) return "string";   // string literal
  if (t === "true" || t === "false") return "bool";

  // Known variable
  if (variables.has(t)) return variables.get(t);

  // Built-in macro constants — each has its own declared type
  if (BUILTIN_CONSTANTS.has(t)) return BUILTIN_CONSTANTS.get(t);

  // Negative literals
  if (/^-\d+$/.test(t)) return "int";
  if (/^-\d+\.\d+$/.test(t)) return "float";

  // Parenthesised sub-expression
  if (t.startsWith("(") && t.endsWith(")")) {
    return inferExprType(t.slice(1, -1), variables);
  }

  // Top-level function call
  const fnMatch = t.match(/^([a-zA-Z_]\w*)\s*\((.+)\)$/s);
  if (fnMatch) {
    const fnName = fnMatch[1];
    const argsRaw = fnMatch[2];
    const args = splitTopLevelArgs(argsRaw);
    const kind = FUNCTION_RETURN_KIND[fnName];

    if (!kind) return undefined;

    switch (kind) {
      case "fixed-float": return "float";
      case "fixed-int": return "int";
      case "void": return undefined;
      case "arg0": return inferExprType(args[0] ?? "", variables);
      case "cast-target": {
        const castType = (args[1] ?? "").trim();
        return VALID_TYPES.has(castType) ? castType as EVALType : undefined;
      }
    }
  }

  return undefined; // complex expression — can't determine statically
}


// ─── Main analyzeCode ────────────────────────────────────────────────────────

function analyzeCode(code: string): Diagnostics[] {
  const diagnostics: Diagnostics[] = [];
  const rawLines = code.split("\n");

  // Strip inline comments and trailing semicolons, then trim whitespace
  const lines = rawLines.map(l => l.replace(/\/\/.*$/, "").replace(/;$/, "").trim());

  // Declared variables: name → type
  const variables = new Map<string, EVALType>();

  function error(line: number, msg: string, col?: number, end?: number) {
    diagnostics.push({ severity: "error", line, column: col, endColumn: end, message: msg });
  }
  function warn(line: number, msg: string, col?: number, end?: number) {
    diagnostics.push({ severity: "warning", line, column: col, endColumn: end, message: msg });
  }

  // ── PASS 1: collect all declared variable names (enables forward refs) ───────
  lines.forEach(t => {
    const m = t.match(DECL_RE);
    if (m) variables.set(m[3], m[2] as EVALType);
  });

  // ── PASS 2: full validation ──────────────────────────────────────────────────
  //
  // Try/catch tracking — brace-depth counter lets us reset `insideTryCatch`
  // accurately when the catch block closes.
  let insideTryCatch = false;
  let braceDepth = 0;
  let tryStartDepth = -1;

  lines.forEach((t, i) => {
    const ln = i + 1;
    if (t === "") return;

    const openBraces = (t.match(/\{/g) ?? []).length;
    const closeBraces = (t.match(/\}/g) ?? []).length;

    // ── try { ────────────────────────────────────────────────────────────────
    if (/^try\s*\{/.test(t)) {
      insideTryCatch = true;
      tryStartDepth = braceDepth;
      braceDepth += openBraces - closeBraces;
      return;
    }

    // ── } catch (id) { ───────────────────────────────────────────────────────
    // Grammar: tryStatement : TRY block CATCH LPAREN IDENTIFIER RPAREN block
    if (/^}\s*catch\s*\(\s*\w+\s*\)\s*\{/.test(t)) {
      braceDepth += openBraces - closeBraces; // net 0 for the standard form
      return;
    }

    // ── bare catch (guard against odd formatting) ─────────────────────────────
    if (/^catch\s*\(/.test(t)) {
      braceDepth += openBraces - closeBraces;
      return;
    }

    // ── bare brace lines  { or } ──────────────────────────────────────────────
    if (/^[{}]$/.test(t)) {
      braceDepth += openBraces - closeBraces;
      if (insideTryCatch && braceDepth <= tryStartDepth) {
        insideTryCatch = false;
        tryStartDepth = -1;
      }
      return;
    }

    // Update depth for all other lines
    braceDepth += openBraces - closeBraces;
    if (insideTryCatch && braceDepth <= tryStartDepth) {
      insideTryCatch = false;
      tryStartDepth = -1;
    }

    // ── Missing variable name:  int = ...  ───────────────────────────────────
    if (DECL_NO_NAME_RE.test(t) && !DECL_RE.test(t)) {
      error(ln, "Variable declaration is missing a name (e.g. `int x = ...`)");
      return;
    }

    // ── Variable declaration ──────────────────────────────────────────────────
    const declMatch = t.match(DECL_RE);
    if (declMatch) {
      const [, isConst, declaredType, varName, expr] = declMatch;
      const trimmedExpr = expr.trim();

      // ── Duplicate declaration ───────────────────────────────────────────────
      if (variables.has(varName) && !isConst) {
        const alreadyDeclared = lines
          .slice(0, i)
          .some(pl => { const pm = pl.match(DECL_RE); return pm && pm[3] === varName; });
        if (alreadyDeclared)
          warn(ln, `Variable '${varName}' is already declared`);
      }

      // ── Numeric type-compatibility (int / float only) ──────────────────────
      if (declaredType === "int" || declaredType === "float") {

        // ── Rule: float variables must use a float literal  (e.g. 34.0 not 34) ─
        //
        // In EVAL's grammar, INTEGER and REAL are distinct tokens.  Initialising
        // a float variable with a bare integer (e.g. `float x = 34`) assigns an
        // INTEGER token where a REAL token is required — this is a type error.
        if (declaredType === "float" && /^\d+$/.test(trimmedExpr)) {
          error(
            ln,
            `Float variable '${varName}' must be initialised with a float literal — ` +
            `use ${trimmedExpr}.0 instead of ${trimmedExpr}`
          );
        }

        // float literal assigned to int variable → implicit conversion
        if (declaredType === "int" && /^\d+\.\d+$/.test(trimmedExpr)) {
          warn(
            ln,
            `Assigning float literal to 'int' variable '${varName}' — implicit conversion`
          );
        }

        // known float variable assigned directly to int variable → implicit conversion
        if (declaredType === "int" && variables.get(trimmedExpr) === "float") {
          warn(
            ln,
            `Assigning float variable to 'int' variable '${varName}' — implicit conversion`
          );
        }

        // ── cast(expr, type) — target type must match declared type ────────────
        const castMatch = trimmedExpr.match(/^cast\s*\((.+),\s*(\w+)\s*\)$/);
        if (castMatch) {
          const castTargetType = castMatch[2].trim();
          if (!VALID_TYPES.has(castTargetType)) {
            error(ln, `Invalid cast target type '${castTargetType}' — expected 'int' or 'float'`);
          } else if (castTargetType !== declaredType) {
            error(
              ln,
              `Cast type '${castTargetType}' does not match declared variable type ` +
              `'${declaredType}' for '${varName}' — use cast(expr, ${declaredType})`
            );
          }
        } else {
          // ── Infer RHS type and compare against declared type ─────────────────
          //    (handles function return types, variable references, literals)
          const inferredRhsType = inferExprType(trimmedExpr, variables);

          if (
            inferredRhsType !== undefined &&
            inferredRhsType !== declaredType &&
            (inferredRhsType === "int" || inferredRhsType === "float") &&
            (declaredType === "int" || declaredType === "float")
          ) {
            if (inferredRhsType === "float" && declaredType === "int") {
              // This is also caught (with more detail) by validateFunctionCalls
              // for the function-return case; only emit here for non-function RHS.
              const isTopLevelFnCall = /^[a-zA-Z_]\w*\s*\(/.test(trimmedExpr);
              if (!isTopLevelFnCall) {
                warn(
                  ln,
                  `Expression evaluates to 'float' but variable '${varName}' is declared as 'int' — implicit conversion`
                );
              }
            }
          }
        }
      }

      // ── Division by zero ──────────────────────────────────────────────────
      if (/\/\s*0(?!\.)/.test(trimmedExpr) && !insideTryCatch) {
        error(ln, "Division by zero detected");
      }

      // ── Undeclared identifier references ──────────────────────────────────
      checkUndeclaredRefs(trimmedExpr, variables, ln, varName, error, warn);

      // ── Validate every function call in the expression ────────────────────
      validateFunctionCalls(trimmedExpr, ln, declaredType as EVALType, variables, error, warn);

      return;
    }

    // ── Incomplete declaration (no assignment) ────────────────────────────────
    if (DECL_NO_ASSIGN_RE.test(t)) {
      const m = t.match(DECL_NO_ASSIGN_RE)!;
      warn(ln, `Variable '${m[3]}' declared but never assigned`);
      return;
    }

    // ── print(…) — may contain arbitrary nested expressions ──────────────────
    if (/^print\s*\(/.test(t)) {
      validateFunctionCalls(t, ln, undefined, variables, error, warn);
      return;
    }

    // ── Any other standalone function call ────────────────────────────────────
    if (/^[a-zA-Z_]\w*\s*\(/.test(t)) {
      validateFunctionCalls(t, ln, undefined, variables, error, warn);
      return;
    }

    // ── Standalone reassignment  x = 5  or  x += 1 ────────────────────────────
    if (/^[a-zA-Z_]\w*\s*(\+|-|\*|\/)?=\s*/.test(t)) {
      const rhsMatch = t.match(/=\s*(.+)$/);
      if (rhsMatch) {
        if (/\/\s*0(?!\.)/.test(rhsMatch[1]) && !insideTryCatch)
          error(ln, "Division by zero detected");
        validateFunctionCalls(rhsMatch[1], ln, undefined, variables, error, warn);
      }
      return;
    }

    // ── Division by zero in a bare expression ─────────────────────────────────
    if (/\/\s*0(?!\.)/.test(t) && !insideTryCatch) {
      error(ln, "Division by zero detected");
      return;
    }

    // ── Unrecognised statement ─────────────────────────────────────────────────
    if (!/^\s*$/.test(t)) {
      warn(ln, `Unrecognized statement: '${t}'`);
    }
  });

  return diagnostics;
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Scans `expr` for identifier references that are not declared variables,
 * built-in constants, or known function names and warns about each one.
 */
function checkUndeclaredRefs(
  expr: string,
  variables: Map<string, EVALType>,
  ln: number,
  currentVar: string,
  _error: (l: number, m: string) => void,
  warn: (l: number, m: string) => void
) {
  const stripped = expr
    .replace(/"[^"]*"/g, "")                            // remove string literals
    .replace(/\b([a-zA-Z_]\w*)\s*\(/g, " (")           // remove function-call names
    .replace(/\b(int|float|string|bool|cast)\b/g, "");  // remove type keywords

  for (const id of (stripped.match(/\b[a-zA-Z_]\w*\b/g) ?? [])) {
    if (
      variables.has(id) ||
      BUILTIN_CONSTANTS.has(id) ||
      id in BUILTIN_FUNCTIONS ||
      VALID_TYPES.has(id) ||
      id === currentVar ||
      id === "true" ||
      id === "false"
    ) continue;
    warn(ln, `Reference to undeclared identifier '${id}'`);
  }
}

/**
 * Validates every function call found anywhere in `expr`, including calls
 * nested inside other calls (e.g. `print(cast(x, int))`).
 *
 * Checks:
 *   1. Argument count against the function signature
 *   2. cast — second argument must be a valid type; must match `declaredType`
 *   3. Homogeneous-arg functions (min, max, pow, sqrt, round, abs) — all
 *      resolvable argument types must be the same EVALType
 *   4. Return type vs. declared variable type — the inferred return type of
 *      the outermost call must be compatible with `declaredType`
 */
function validateFunctionCalls(
  expr: string,
  ln: number,
  declaredType: EVALType | undefined,
  variables: Map<string, EVALType>,
  error: (l: number, m: string) => void,
  warn: (l: number, m: string) => void
) {
  const calls = extractAllCalls(expr);
  if (calls.length === 0) return;

  // extractAllCalls returns calls in source order; the first is the outermost.
  const outermostCallName = calls[0].name;

  for (const { name: fnName, args } of calls) {
    if (VALID_TYPES.has(fnName)) continue; // type keywords, not real calls

    const argCount = args.length;
    const sig = BUILTIN_FUNCTIONS[fnName];

    if (!sig) {
      warn(ln, `Unknown function '${fnName}' — is this a built-in or typo?`);
      continue;
    }

    // ── 1. Argument count ────────────────────────────────────────────────────
    if (argCount < sig.minArgs) {
      error(ln, `Function '${fnName}' expects at least ${sig.minArgs} argument(s), got ${argCount}`);
      continue;
    }
    if (sig.maxArgs !== Infinity && argCount > sig.maxArgs) {
      error(ln, `Function '${fnName}' expects at most ${sig.maxArgs} argument(s), got ${argCount}`);
      continue;
    }

    // ── 2. cast-specific validation ───────────────────────────────────────────
    if (fnName === "cast" && args.length === 2) {
      const castTargetType = args[1].trim();
      if (!VALID_TYPES.has(castTargetType)) {
        error(ln, `Invalid cast target type '${castTargetType}' — expected 'int' or 'float'`);
      } else if (
        declaredType &&
        fnName === outermostCallName &&
        (castTargetType === "int" || castTargetType === "float") &&
        castTargetType !== declaredType
      ) {
        error(
          ln,
          `Cast type '${castTargetType}' does not match declared variable type '${declaredType}' — ` +
          `use cast(expr, ${declaredType})`
        );
      }
      // cast's second arg is a type keyword, not a value — skip homogeneity check
      continue;
    }

    // ── 3. Argument type homogeneity ──────────────────────────────────────────
    //
    // For min, max, pow, sqrt, round, abs all VALUE arguments must resolve to
    // the same EVALType.  If we cannot infer a type we skip rather than
    // emit a false positive.
    if (HOMOGENEOUS_ARG_FNS.has(fnName) && argCount >= 1) {
      const argTypes = args.map(a => inferExprType(a, variables));
      const knownTypes = argTypes.filter((t): t is EVALType => t !== undefined);

      if (knownTypes.length > 0) {
        const firstType = knownTypes[0];
        const allSame = knownTypes.every(t => t === firstType);

        if (!allSame) {
          const typeSummary = args
            .map((a, idx) => `'${a.trim()}' (${argTypes[idx] ?? "unknown"})`)
            .join(", ");
          error(
            ln,
            `Function '${fnName}' requires all arguments to be the same type, ` +
            `but received mixed types: ${typeSummary}. ` +
            `Use cast() to convert arguments to a common type.`
          );
        } else if (declaredType && fnName === outermostCallName) {
          // ── 4a. Return type check for "arg0" functions ────────────────────
          //        (min, max, abs — return the same type as their arguments)
          const kind = FUNCTION_RETURN_KIND[fnName];
          let returnType: EVALType | undefined;

          if (kind === "fixed-float") returnType = "float";
          else if (kind === "fixed-int") returnType = "int";
          else if (kind === "arg0") returnType = firstType;

          if (
            returnType && returnType !== declaredType &&
            (returnType === "int" || returnType === "float") &&
            (declaredType === "int" || declaredType === "float")
          ) {
            if (returnType === "float" && declaredType === "int") {
              error(
                ln,
                `Function '${fnName}' with '${firstType}' arguments returns '${returnType}', ` +
                `but variable is declared as '${declaredType}' — ` +
                `change the variable type to '${returnType}' or cast the result`
              );
            }
            // returnType "int" → declaredType "float": safe, no error
          }
        }
      }
    }

    // ── 4b. Return type check for fixed-return functions (sqrt, pow) ──────────
    //        Applied to the outermost call only.
    if (
      fnName === outermostCallName &&
      declaredType &&
      (declaredType === "int" || declaredType === "float")
    ) {
      const kind = FUNCTION_RETURN_KIND[fnName];

      if (kind === "fixed-float" && declaredType === "int") {
        error(
          ln,
          `Function '${fnName}' always returns 'float', but variable is declared as 'int' — ` +
          `change the variable type to 'float' or wrap with cast(${fnName}(...), int)`
        );
      }
      // fixed-int (round) assigned to float → safe
    }
  }
}
