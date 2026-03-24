import type * as monaco from "monaco-editor";
import { EVAL_LANGUAGE_ID, type Diagnostics } from "../../model/models";

// ─── Shared type alias ────────────────────────────────────────────────────────
type EVALType = "int" | "float" | "string" | "bool";

// ─── SymbolInfo ───────────────────────────────────────────────────────────────

/**
 * Metadata stored for every declared variable.
 *
 * @property name          - Identifier as written in source
 * @property type          - Resolved EVALType
 * @property isConst       - Whether the declaration used the `const` keyword
 * @property declaredLine  - 1-based source line of the declaration
 * @property isInitialized - True when the variable was declared with `= <expr>`
 *                           or later assigned via a standalone assignment
 * @property usageCount    - Number of times the identifier appears in an
 *                           expression *after* its declaration line (reads only)
 */
export interface SymbolInfo {
  name: string;
  type: EVALType;
  isConst: boolean;
  declaredLine: number;
  isInitialized: boolean;
  usageCount: number;
}

// ─── SymbolTable ──────────────────────────────────────────────────────────────

/**
 * Scoped symbol table used by the EVAL static analyser.
 *
 * Each scope is a Map<name, SymbolInfo>.  Scopes are pushed when entering a
 * block construct (try/catch, if, loops…) and popped on exit.  Look-up walks
 * from the innermost scope outward, so inner blocks can shadow outer names
 * while both are independently tracked.
 *
 * Public API
 * ──────────
 *  pushScope()                open a new nested scope
 *  popScope()                 close scope; returns its symbols for analysis
 *  declare(…)                 register a variable in the current scope
 *  assign(name)               mark as initialised; returns false if unknown
 *  markUsed(name)             increment read counter; no-op if unknown
 *  lookup(name)               walk scopes outward; returns SymbolInfo | undef
 *  has(name)                  quick existence check across all scopes
 *  allSymbols()               flat list across every live scope
 *  currentScopeSymbols()      symbols in the innermost scope only
 */
export class SymbolTable {
  private scopes: Map<string, SymbolInfo>[] = [new Map()];

  // ── Scope management ──────────────────────────────────────────────────────

  pushScope(): void {
    this.scopes.push(new Map());
  }

  /**
   * Close the innermost scope and return its symbols so the caller can
   * emit unused-variable warnings before the scope disappears.
   */
  popScope(): SymbolInfo[] {
    const scope = this.scopes.pop() ?? new Map<string, SymbolInfo>();
    return [...scope.values()];
  }

  /** Current nesting depth (1 = global). */
  get depth(): number {
    return this.scopes.length;
  }

  // ── Mutations ─────────────────────────────────────────────────────────────

  /**
   * Register a new variable in the innermost scope.
   * Returns the created SymbolInfo, or `null` when the name is already present
   * in this scope (the caller should emit a duplicate-declaration warning).
   */
  declare(
    name: string,
    type: EVALType,
    isConst: boolean,
    line: number,
    initialized: boolean,
  ): SymbolInfo | null {
    const scope = this.currentScope;
    if (scope.has(name)) return null;
    const info: SymbolInfo = {
      name,
      type,
      isConst,
      declaredLine: line,
      isInitialized: initialized,
      usageCount: 0,
    };
    scope.set(name, info);
    return info;
  }

  /**
   * Mark a variable as assigned (sets `isInitialized = true`).
   * Walks scopes from innermost outward.
   * Returns `false` when the variable is not found in any scope.
   */
  assign(name: string): boolean {
    const info = this.lookup(name);
    if (!info) return false;
    info.isInitialized = true;
    return true;
  }

  /**
   * Increment the read-usage counter for `name`.
   * No-op when the variable is not found (avoids callers having to guard).
   */
  markUsed(name: string): void {
    const info = this.lookup(name);
    if (info) info.usageCount++;
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Returns the innermost SymbolInfo for `name`, searching from the current
   * scope outward.  Returns `undefined` when not found in any scope.
   */
  lookup(name: string): SymbolInfo | undefined {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const info = this.scopes[i].get(name);
      if (info) return info;
    }
    return undefined;
  }

  /** `true` when `name` exists in any live scope. */
  has(name: string): boolean {
    return this.lookup(name) !== undefined;
  }

  /** All symbols across every live scope (useful for the final unused-var pass). */
  allSymbols(): SymbolInfo[] {
    return this.scopes.flatMap((s) => [...s.values()]);
  }

  /** Symbols in the innermost (current) scope only. */
  currentScopeSymbols(): SymbolInfo[] {
    return [...this.currentScope.values()];
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  private get currentScope(): Map<string, SymbolInfo> {
    return this.scopes[this.scopes.length - 1];
  }
}

// ─── Constants & built-ins ───────────────────────────────────────────────────

const BUILTIN_CONSTANTS = new Map<string, EVALType>([
  ["PI", "float"],
  ["DAYS_IN_WEEK", "int"],
  ["HOURS_IN_DAY", "int"],
  ["YEAR", "int"],
]);

const VALID_TYPES = new Set<string>(["int", "float", "string", "bool"]);

const BUILTIN_FUNCTIONS: Record<string, { minArgs: number; maxArgs: number }> =
  {
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
 * "fixed-float"  → always returns float  (sqrt, pow)
 * "fixed-int"    → always returns int    (round)
 * "arg0"         → returns same type as first argument (min, max, abs)
 * "cast-target"  → returns the type named in second argument (cast)
 * "void"         → cannot be used in an expression (print)
 */
type FnReturnKind =
  | "fixed-float"
  | "fixed-int"
  | "arg0"
  | "cast-target"
  | "void";

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

const HOMOGENEOUS_ARG_FNS = new Set([
  "min",
  "max",
  "pow",
  "sqrt",
  "round",
  "abs",
]);

// ─── Regex patterns ───────────────────────────────────────────────────────────

// [const] int|float|string|bool <name> = <expr>
const DECL_RE = /^(const\s+)?(int|float|string|bool)\s+(\w+)\s*=\s*(.+)/;
// [const] int|float|string|bool <name>           (no assignment)
const DECL_NO_ASSIGN_RE = /^(const\s+)?(int|float|string|bool)\s+(\w+)\s*$/;
// [const] int|float|string|bool = ...            (missing variable name)
const DECL_NO_NAME_RE = /^(const\s+)?(int|float|string|bool)\s*=\s*/;
// x op= rhs   (compound assignment: +=, -=, *=, /=)
const COMPOUND_ASSIGN_RE = /^([a-zA-Z_]\w*)\s*(\+|-|\*|\/)=\s*(.+)$/;
// x = rhs     (simple reassignment — checked AFTER compound to avoid overlap)
const SIMPLE_ASSIGN_RE = /^([a-zA-Z_]\w*)\s*=\s*(.+)$/;

// ─── Parenthesis-aware utilities ──────────────────────────────────────────────

/**
 * Splits a raw argument string on TOP-LEVEL commas only.
 *   "cast(x, int), y"  →  ["cast(x, int)", "y"]
 */
function splitTopLevelArgs(argsStr: string): string[] {
  const args: string[] = [];
  let depth = 0,
    cur = "";
  for (const ch of argsStr) {
    if (ch === "(" || ch === "[") {
      depth++;
      cur += ch;
    } else if (ch === ")" || ch === "]") {
      depth--;
      cur += ch;
    } else if (ch === "," && depth === 0) {
      args.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

/**
 * Finds ALL function calls in `expr` (including nested) using a paren counter.
 * Returns `{ name, args }` pairs in source order (outermost first).
 */
function extractAllCalls(
  expr: string,
): Array<{ name: string; args: string[] }> {
  const result: Array<{ name: string; args: string[] }> = [];
  const re = /([a-zA-Z_]\w*)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expr)) !== null) {
    const name = m[1];
    const parenOpen = m.index + m[0].length;
    let depth = 1,
      j = parenOpen;
    while (j < expr.length && depth > 0) {
      if (expr[j] === "(") depth++;
      else if (expr[j] === ")") depth--;
      j++;
    }
    result.push({
      name,
      args: splitTopLevelArgs(expr.slice(parenOpen, j - 1)),
    });
  }
  return result;
}

/**
 * Returns the 1-based column of the first occurrence of `token` in `rawLine`,
 * or `undefined` when not found.  Used to give Monaco precise squiggle ranges.
 */
function findTokenColumn(rawLine: string, token: string): number | undefined {
  const idx = rawLine.indexOf(token);
  return idx >= 0 ? idx + 1 : undefined;
}

// ─── Type inference ───────────────────────────────────────────────────────────

/**
 * Attempts to statically resolve the EVALType of a single expression.
 * Returns `undefined` when the type cannot be determined (complex arithmetic,
 * unknown identifiers, etc.) — callers skip type checks in that case to avoid
 * false positives.
 */
function inferExprType(
  expr: string,
  symbols: SymbolTable,
): EVALType | undefined {
  const t = expr.trim();

  if (/^\d+$/.test(t)) return "int";
  if (/^\d+\.\d+$/.test(t)) return "float";
  if (/^"[^"]*"$/.test(t)) return "string";
  if (t === "true" || t === "false") return "bool";
  if (/^-\d+$/.test(t)) return "int";
  if (/^-\d+\.\d+$/.test(t)) return "float";

  const sym = symbols.lookup(t);
  if (sym) return sym.type;

  if (BUILTIN_CONSTANTS.has(t)) return BUILTIN_CONSTANTS.get(t);

  // Parenthesised sub-expression
  if (t.startsWith("(") && t.endsWith(")"))
    return inferExprType(t.slice(1, -1), symbols);

  // Top-level function call
  const fnMatch = t.match(/^([a-zA-Z_]\w*)\s*\((.+)\)$/s);
  if (fnMatch) {
    const fnName = fnMatch[1];
    const args = splitTopLevelArgs(fnMatch[2]);
    const kind = FUNCTION_RETURN_KIND[fnName];
    if (!kind) return undefined;
    switch (kind) {
      case "fixed-float":
        return "float";
      case "fixed-int":
        return "int";
      case "void":
        return undefined;
      case "arg0":
        return inferExprType(args[0] ?? "", symbols);
      case "cast-target": {
        const ct = (args[1] ?? "").trim();
        return VALID_TYPES.has(ct) ? (ct as EVALType) : undefined;
      }
    }
  }

  return undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Walks every identifier in `expr` and calls `symbols.markUsed()` on each
 * one that maps to a declared variable.  Must be called whenever an expression
 * is evaluated (declarations, assignments, standalone calls) so the
 * unused-variable pass has accurate read counts.
 *
 * Strips string literals, function-call names, and type keywords before
 * scanning to avoid false hits.
 */
function markUsedRefs(expr: string, symbols: SymbolTable): void {
  const stripped = expr
    .replace(/"[^"]*"/g, "")
    .replace(/\b([a-zA-Z_]\w*)\s*\(/g, " (")
    .replace(/\b(int|float|string|bool)\b/g, "");

  for (const id of stripped.match(/\b[a-zA-Z_]\w*\b/g) ?? []) {
    if (
      id === "true" ||
      id === "false" ||
      BUILTIN_CONSTANTS.has(id) ||
      id in BUILTIN_FUNCTIONS
    )
      continue;
    symbols.markUsed(id);
  }
}

/**
 * Scans `expr` for identifier references that are not declared variables,
 * built-in constants, or known function names, and warns about each one.
 */
function checkUndeclaredRefs(
  expr: string,
  symbols: SymbolTable,
  ln: number,
  currentVar: string,
  _error: (l: number, m: string) => void,
  warn: (l: number, m: string) => void,
): void {
  const stripped = expr
    .replace(/"[^"]*"/g, "")
    .replace(/\b([a-zA-Z_]\w*)\s*\(/g, " (")
    .replace(/\b(int|float|string|bool|cast)\b/g, "");

  for (const id of stripped.match(/\b[a-zA-Z_]\w*\b/g) ?? []) {
    if (
      symbols.has(id) ||
      BUILTIN_CONSTANTS.has(id) ||
      id in BUILTIN_FUNCTIONS ||
      VALID_TYPES.has(id) ||
      id === currentVar ||
      id === "true" ||
      id === "false"
    )
      continue;
    warn(ln, `Reference to undeclared identifier '${id}'`);
  }
}

/**
 * Validates every function call found anywhere in `expr` (including nested).
 *
 * Checks:
 *   1. Argument count against the function signature
 *   2. cast — second argument must be a valid type; must match `declaredType`
 *   3. Homogeneous-arg functions — all resolvable argument types must agree
 *   4. Return type vs. declared variable type — inferred return of the
 *      outermost call must be compatible with `declaredType`
 */
function validateFunctionCalls(
  expr: string,
  ln: number,
  declaredType: EVALType | undefined,
  symbols: SymbolTable,
  error: (l: number, m: string) => void,
  warn: (l: number, m: string) => void,
): void {
  const calls = extractAllCalls(expr);
  if (calls.length === 0) return;

  const outermostCallName = calls[0].name;

  for (const { name: fnName, args } of calls) {
    if (VALID_TYPES.has(fnName)) continue; // type keywords aren't real calls

    const argCount = args.length;
    const sig = BUILTIN_FUNCTIONS[fnName];
    if (!sig) {
      warn(ln, `Unknown function '${fnName}' — is this a built-in or a typo?`);
      continue;
    }

    // ── 1. Argument count ────────────────────────────────────────────────────
    if (argCount < sig.minArgs) {
      error(
        ln,
        `Function '${fnName}' expects at least ${sig.minArgs} argument(s), got ${argCount}`,
      );
      continue;
    }
    if (sig.maxArgs !== Infinity && argCount > sig.maxArgs) {
      error(
        ln,
        `Function '${fnName}' expects at most ${sig.maxArgs} argument(s), got ${argCount}`,
      );
      continue;
    }

    // ── 2. cast validation ───────────────────────────────────────────────────
    if (fnName === "cast" && args.length === 2) {
      const castTargetType = args[1].trim();
      if (!VALID_TYPES.has(castTargetType)) {
        error(
          ln,
          `Invalid cast target type '${castTargetType}' — expected 'int' or 'float'`,
        );
      } else if (
        declaredType &&
        fnName === outermostCallName &&
        (castTargetType === "int" || castTargetType === "float") &&
        castTargetType !== declaredType
      ) {
        error(
          ln,
          `Cast type '${castTargetType}' does not match declared variable type '${declaredType}' — ` +
            `use cast(expr, ${declaredType})`,
        );
      }
      continue; // cast's second arg is a type keyword — skip homogeneity check
    }

    // ── 3. Argument type homogeneity ─────────────────────────────────────────
    if (HOMOGENEOUS_ARG_FNS.has(fnName) && argCount >= 1) {
      const argTypes = args.map((a) => inferExprType(a, symbols));
      const knownTypes = argTypes.filter((t): t is EVALType => t !== undefined);

      if (knownTypes.length > 0) {
        const firstType = knownTypes[0];
        const allSame = knownTypes.every((t) => t === firstType);

        if (!allSame) {
          const typeSummary = args
            .map((a, idx) => `'${a.trim()}' (${argTypes[idx] ?? "unknown"})`)
            .join(", ");
          error(
            ln,
            `Function '${fnName}' requires all arguments to be the same type, ` +
              `but received mixed types: ${typeSummary}. ` +
              `Use cast() to convert arguments to a common type.`,
          );
        } else if (declaredType && fnName === outermostCallName) {
          // ── 4a. Return type check for "arg0" functions ───────────────────
          const kind = FUNCTION_RETURN_KIND[fnName];
          let returnType: EVALType | undefined;
          if (kind === "fixed-float") returnType = "float";
          else if (kind === "fixed-int") returnType = "int";
          else if (kind === "arg0") returnType = firstType;

          if (
            returnType &&
            returnType !== declaredType &&
            returnType === "float" &&
            declaredType === "int"
          ) {
            error(
              ln,
              `Function '${fnName}' with '${firstType}' arguments returns '${returnType}', ` +
                `but variable is declared as '${declaredType}' — ` +
                `change the variable type to '${returnType}' or cast the result`,
            );
          }
        }
      }
    }

    // ── 4b. Return type check for fixed-return functions (sqrt, pow) ─────────
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
            `change the variable type to 'float' or wrap with cast(${fnName}(...), int)`,
        );
      }
      // fixed-int (round) assigned to float → safe, no error
    }
  }
}

// ─── Main analyzeCode ─────────────────────────────────────────────────────────

function analyzeCode(code: string): Diagnostics[] {
  const diagnostics: Diagnostics[] = [];
  const rawLines = code.split("\n");

  // Strip inline comments and trailing semicolons, then trim whitespace
  const lines = rawLines.map((l) =>
    l
      .replace(/\/\/.*$/, "")
      .replace(/;$/, "")
      .trim(),
  );

  // Central symbol table — owns all scope/const/usage tracking
  const symbols = new SymbolTable();

  function error(line: number, msg: string, col?: number, end?: number) {
    diagnostics.push({
      severity: "error",
      line,
      column: col,
      endColumn: end,
      message: msg,
    });
  }
  function warn(line: number, msg: string, col?: number, end?: number) {
    diagnostics.push({
      severity: "warning",
      line,
      column: col,
      endColumn: end,
      message: msg,
    });
  }

  // ── PASS 1: forward-declaration scan ────────────────────────────────────────
  // Pre-register every declared variable so forward references in expressions
  // are resolved correctly.  The first occurrence of each name wins.
  lines.forEach((t, i) => {
    const mDecl = t.match(DECL_RE);
    if (mDecl) {
      const [, constKw, type, name] = mDecl;
      if (!symbols.has(name))
        symbols.declare(name, type as EVALType, !!constKw, i + 1, true);
      return;
    }
    const mNoAssign = t.match(DECL_NO_ASSIGN_RE);
    if (mNoAssign) {
      const [, constKw, type, name] = mNoAssign;
      if (!symbols.has(name))
        symbols.declare(name, type as EVALType, !!constKw, i + 1, false);
    }
  });

  // ── PASS 2: full validation ──────────────────────────────────────────────────
  let insideTryCatch = false;
  let braceDepth = 0;
  let tryStartDepth = -1;

  /** Utility: pop a scope and emit unused-variable warnings for its symbols. */
  function closeScope(): void {
    const popped = symbols.popScope();
    for (const sym of popped) {
      if (sym.usageCount === 0) {
        warn(
          sym.declaredLine,
          `Variable '${sym.name}' is declared but never used`,
        );
      }
    }
  }

  lines.forEach((t, i) => {
    const ln = i + 1;
    const rawLine = rawLines[i];
    if (t === "") return;

    const openBraces = (t.match(/\{/g) ?? []).length;
    const closeBraces = (t.match(/\}/g) ?? []).length;

    // ── try { ───────────────────────────────────────────────────────────────
    if (/^try\s*\{/.test(t)) {
      insideTryCatch = true;
      tryStartDepth = braceDepth;
      braceDepth += openBraces - closeBraces;
      symbols.pushScope();
      return;
    }

    // ── } catch (id) { ──────────────────────────────────────────────────────
    if (/^}\s*catch\s*\(\s*\w+\s*\)\s*\{/.test(t)) {
      braceDepth += openBraces - closeBraces;
      return;
    }

    // ── bare catch ──────────────────────────────────────────────────────────
    if (/^catch\s*\(/.test(t)) {
      braceDepth += openBraces - closeBraces;
      return;
    }

    // ── bare brace lines  { or } ─────────────────────────────────────────────
    if (/^[{}]$/.test(t)) {
      braceDepth += openBraces - closeBraces;
      if (insideTryCatch && braceDepth <= tryStartDepth) {
        closeScope();
        insideTryCatch = false;
        tryStartDepth = -1;
      }
      return;
    }

    // Update depth for all other lines
    braceDepth += openBraces - closeBraces;
    if (insideTryCatch && braceDepth <= tryStartDepth) {
      closeScope();
      insideTryCatch = false;
      tryStartDepth = -1;
    }

    // ── Control-flow constructs — not function calls ─────────────────────────
    //
    //  Patterns that must be skipped before the function-call and
    //  unrecognised-statement checks:
    //
    //   • if (...) {        else if (...) {        while (...) {
    //   • else {            } else {               } else if (...) {
    //   • for (...) {
    //   • break             continue               return [expr]
    //
    //  None of these are function calls; passing them to validateFunctionCalls
    //  would produce a spurious "Unknown function 'if'" (or 'while', etc.) warn.
    if (/^(if|else\s+if|while|for)\s*\(/.test(t)) {
      // Extract the top-level condition between the first balanced pair of parens
      // so that any variables referenced inside (e.g. `temperature` in
      // `if (temperature >= 0)`) are counted as reads and do not trigger the
      // "declared but never used" warning.
      const parenOpen = t.indexOf("(");
      if (parenOpen !== -1) {
        let depth = 0,
          parenClose = -1;
        for (let ci = parenOpen; ci < t.length; ci++) {
          if (t[ci] === "(") depth++;
          else if (t[ci] === ")") {
            depth--;
            if (depth === 0) {
              parenClose = ci;
              break;
            }
          }
        }
        if (parenClose !== -1) {
          const condition = t.slice(parenOpen + 1, parenClose);
          markUsedRefs(condition, symbols);
          checkUndeclaredRefs(condition, symbols, ln, "", error, warn);
          validateFunctionCalls(condition, ln, undefined, symbols, error, warn);
        }
      }
      return;
    }

    if (
      /^else\b/.test(t) || // else { … }
      /^}\s*else\b/.test(t) // } else { … }  /  } else if (...) {
    ) {
      return;
    }

    if (/^return\b/.test(t)) {
      // Mark any identifiers in the returned expression as used.
      const retExpr = t.replace(/^return\b\s*/, "");
      if (retExpr) {
        markUsedRefs(retExpr, symbols);
        checkUndeclaredRefs(retExpr, symbols, ln, "", error, warn);
        validateFunctionCalls(retExpr, ln, undefined, symbols, error, warn);
      }
      return;
    }

    if (/^(break|continue)\b/.test(t)) {
      return;
    }

    // ── Missing variable name:  int = ... ────────────────────────────────────
    if (DECL_NO_NAME_RE.test(t) && !DECL_RE.test(t)) {
      error(ln, "Variable declaration is missing a name (e.g. `int x = ...`)");
      return;
    }

    // ── Variable declaration ─────────────────────────────────────────────────
    const declMatch = t.match(DECL_RE);
    if (declMatch) {
      const [, constKeyword, declaredType, varName, expr] = declMatch;
      const isConst = !!constKeyword;
      const trimmedExpr = expr.trim();
      const varCol = findTokenColumn(rawLine, varName);

      // ── Shadowing a built-in constant ──────────────────────────────────────
      if (BUILTIN_CONSTANTS.has(varName)) {
        warn(
          ln,
          `'${varName}' shadows a built-in constant — choose a different name`,
          varCol,
        );
      }

      // ── Duplicate declaration ──────────────────────────────────────────────
      // Pass 1 may have registered this name; if the stored line ≠ current
      // line it was declared earlier.
      const existing = symbols.lookup(varName);
      if (existing && existing.declaredLine !== ln) {
        warn(
          ln,
          `Variable '${varName}' is already declared on line ${existing.declaredLine}`,
          varCol,
        );
      }

      // ── Bool: RHS must be bool-typed ───────────────────────────────────────
      if (declaredType === "bool") {
        const rhsType = inferExprType(trimmedExpr, symbols);
        if (rhsType !== undefined && rhsType !== "bool") {
          error(
            ln,
            `Cannot assign '${rhsType}' value to bool variable '${varName}' — ` +
              `expected 'true', 'false', or a bool expression`,
            varCol,
          );
        }
      }

      // ── String: RHS must be string-typed ──────────────────────────────────
      if (declaredType === "string") {
        const rhsType = inferExprType(trimmedExpr, symbols);
        if (rhsType !== undefined && rhsType !== "string") {
          error(
            ln,
            `Cannot assign '${rhsType}' value to string variable '${varName}'`,
            varCol,
          );
        }
      }

      // ── Numeric type compatibility (int / float) ──────────────────────────
      if (declaredType === "int" || declaredType === "float") {
        // float variable initialised with a bare integer literal
        if (declaredType === "float" && /^\d+$/.test(trimmedExpr)) {
          error(
            ln,
            `Float variable '${varName}' must be initialised with a float literal — ` +
              `use ${trimmedExpr}.0 instead of ${trimmedExpr}`,
          );
        }

        // float literal assigned to int variable
        if (declaredType === "int" && /^\d+\.\d+$/.test(trimmedExpr)) {
          warn(
            ln,
            `Assigning float literal to 'int' variable '${varName}' — implicit conversion`,
          );
        }

        // known float variable assigned directly to int variable
        const rhsSym = symbols.lookup(trimmedExpr);
        if (declaredType === "int" && rhsSym?.type === "float") {
          warn(
            ln,
            `Assigning float variable '${trimmedExpr}' to 'int' variable '${varName}' — implicit conversion`,
          );
        }

        // cast(expr, T) checks
        const castMatch = trimmedExpr.match(/^cast\s*\((.+),\s*(\w+)\s*\)$/);
        if (castMatch) {
          const sourceExpr = castMatch[1].trim();
          const castTarget = castMatch[2].trim();
          if (!VALID_TYPES.has(castTarget)) {
            error(
              ln,
              `Invalid cast target type '${castTarget}' — expected 'int' or 'float'`,
            );
          } else if (castTarget !== declaredType) {
            error(
              ln,
              `Cast type '${castTarget}' does not match declared variable type ` +
                `'${declaredType}' for '${varName}' — use cast(expr, ${declaredType})`,
            );
          } else {
            // ── Redundant cast: source is already the target type ─────────
            const sourceType = inferExprType(sourceExpr, symbols);
            if (sourceType === castTarget) {
              warn(
                ln,
                `Redundant cast: '${sourceExpr}' is already '${castTarget}' — cast() is unnecessary here`,
              );
            }
          }
        } else {
          // Infer RHS type and compare against declared type
          const inferredRhsType = inferExprType(trimmedExpr, symbols);
          if (
            inferredRhsType !== undefined &&
            inferredRhsType !== declaredType &&
            (inferredRhsType === "int" || inferredRhsType === "float") &&
            (declaredType === "int" || declaredType === "float")
          ) {
            const isTopLevelFnCall = /^[a-zA-Z_]\w*\s*\(/.test(trimmedExpr);
            if (
              !isTopLevelFnCall &&
              inferredRhsType === "float" &&
              declaredType === "int"
            ) {
              warn(
                ln,
                `Expression evaluates to 'float' but variable '${varName}' is declared as 'int' — implicit conversion`,
              );
            }
          }
        }
      }

      // ── Division by zero ──────────────────────────────────────────────────
      if (/\/\s*0(?!\.)/.test(trimmedExpr) && !insideTryCatch) {
        error(ln, "Division by zero detected");
      }

      // ── Undeclared identifier references ──────────────────────────────────
      checkUndeclaredRefs(trimmedExpr, symbols, ln, varName, error, warn);

      // ── Mark referenced identifiers as used ───────────────────────────────
      markUsedRefs(trimmedExpr, symbols);

      // ── Validate every function call in the expression ────────────────────
      validateFunctionCalls(
        trimmedExpr,
        ln,
        declaredType as EVALType,
        symbols,
        error,
        warn,
      );

      return;
    }

    // ── Incomplete declaration (no assignment) ────────────────────────────────
    if (DECL_NO_ASSIGN_RE.test(t)) {
      const m = t.match(DECL_NO_ASSIGN_RE)!;
      warn(ln, `Variable '${m[3]}' declared but never assigned`);
      return;
    }

    // ── print(…) ─────────────────────────────────────────────────────────────
    if (/^print\s*\(/.test(t)) {
      validateFunctionCalls(t, ln, undefined, symbols, error, warn);
      markUsedRefs(t, symbols);
      return;
    }

    // ── Any other standalone function call ────────────────────────────────────
    if (/^[a-zA-Z_]\w*\s*\(/.test(t)) {
      validateFunctionCalls(t, ln, undefined, symbols, error, warn);
      markUsedRefs(t, symbols);
      return;
    }

    // ── Compound reassignment  x += expr  /  x -= expr  etc. ─────────────────
    const compoundMatch = t.match(COMPOUND_ASSIGN_RE);
    if (compoundMatch) {
      const [, varName, operator, rhs] = compoundMatch;
      const sym = symbols.lookup(varName);
      const varCol = findTokenColumn(rawLine, varName);

      if (!sym) {
        error(ln, `Assignment to undeclared variable '${varName}'`, varCol);
      } else if (sym.isConst) {
        // ── Const reassignment guard ─────────────────────────────────────────
        error(
          ln,
          `Cannot reassign const variable '${varName}' ` +
            `(declared on line ${sym.declaredLine}) — remove 'const' or use a new variable`,
          varCol,
        );
      } else {
        // Type-check the RHS against the variable's declared type
        const rhsType = inferExprType(rhs.trim(), symbols);
        if (rhsType !== undefined && rhsType !== sym.type) {
          if (
            (sym.type === "int" || sym.type === "float") &&
            (rhsType === "int" || rhsType === "float")
          ) {
            if (rhsType === "float" && sym.type === "int") {
              warn(
                ln,
                `Compound assignment '${operator}=': assigning 'float' expression ` +
                  `to 'int' variable '${varName}' — implicit conversion`,
                varCol,
              );
            }
          } else {
            error(
              ln,
              `Compound assignment '${operator}=': cannot use '${rhsType}' ` +
                `value with '${sym.type}' variable '${varName}'`,
              varCol,
            );
          }
        }

        if (/\/\s*0(?!\.)/.test(rhs) && !insideTryCatch)
          error(ln, "Division by zero detected");

        symbols.assign(varName);
        symbols.markUsed(varName);
        validateFunctionCalls(rhs, ln, sym.type, symbols, error, warn);
        markUsedRefs(rhs, symbols);
      }
      return;
    }

    // ── Simple reassignment  x = expr ────────────────────────────────────────
    const simpleMatch = t.match(SIMPLE_ASSIGN_RE);
    if (simpleMatch) {
      const [, varName, rhs] = simpleMatch;
      const sym = symbols.lookup(varName);
      const varCol = findTokenColumn(rawLine, varName);

      if (!sym) {
        error(ln, `Assignment to undeclared variable '${varName}'`, varCol);
      } else if (sym.isConst) {
        // ── Const reassignment guard ─────────────────────────────────────────
        error(
          ln,
          `Cannot reassign const variable '${varName}' ` +
            `(declared on line ${sym.declaredLine}) — remove 'const' or use a new variable`,
          varCol,
        );
      } else {
        // Type-check RHS
        const rhsType = inferExprType(rhs.trim(), symbols);

        if (rhsType !== undefined && rhsType !== sym.type) {
          if (sym.type === "bool") {
            error(
              ln,
              `Cannot assign '${rhsType}' value to bool variable '${varName}'`,
              varCol,
            );
          } else if (sym.type === "string") {
            error(
              ln,
              `Cannot assign '${rhsType}' value to string variable '${varName}'`,
              varCol,
            );
          } else if (sym.type === "int" && rhsType === "float") {
            warn(
              ln,
              `Assigning 'float' value to 'int' variable '${varName}' — implicit conversion`,
              varCol,
            );
          } else if (sym.type === "float" && rhsType === "string") {
            error(
              ln,
              `Cannot assign 'string' value to 'float' variable '${varName}'`,
              varCol,
            );
          }
        }

        if (/\/\s*0(?!\.)/.test(rhs) && !insideTryCatch)
          error(ln, "Division by zero detected");

        symbols.assign(varName);
        symbols.markUsed(varName);
        validateFunctionCalls(rhs, ln, sym.type, symbols, error, warn);
        markUsedRefs(rhs, symbols);
      }
      return;
    }

    // ── Division by zero in a bare expression ─────────────────────────────────
    if (/\/\s*0(?!\.)/.test(t) && !insideTryCatch) {
      error(ln, "Division by zero detected");
      return;
    }

    // ── Unrecognised statement ────────────────────────────────────────────────
    if (!/^\s*$/.test(t)) {
      warn(ln, `Unrecognized statement: '${t}'`);
    }
  });

  // ── POST-PASS: unused variable warnings ──────────────────────────────────────
  // Any symbol still alive in the global scope that was never read after
  // its declaration is considered unused.
  for (const sym of symbols.allSymbols()) {
    if (sym.usageCount === 0) {
      warn(
        sym.declaredLine,
        `Variable '${sym.name}' is declared but never used`,
      );
    }
  }

  return diagnostics;
}

// ─── Public entry point ───────────────────────────────────────────────────────

export function retrieveCodeDiagnostics(
  code: string,
  monacoInstance: typeof monaco,
  editor: monaco.editor.IStandaloneCodeEditor,
) {
  const model = editor.getModel();
  if (!model) return;

  const diagnosticList = analyzeCode(code);

  const markers = diagnosticList.map((diag) => ({
    severity:
      diag.severity === "error"
        ? monacoInstance.MarkerSeverity.Error
        : monacoInstance.MarkerSeverity.Warning,
    startLineNumber: diag.line,
    startColumn: diag.column ?? 1,
    endLineNumber: diag.line,
    endColumn: diag.endColumn ?? 1000,
    message: diag.message,
    source: "EVAL Analyzer",
  }));

  monacoInstance.editor.setModelMarkers(model, EVAL_LANGUAGE_ID, markers);
}
