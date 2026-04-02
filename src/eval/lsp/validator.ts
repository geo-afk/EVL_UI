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
  isForwardDeclared: boolean;
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
    if (this.scopes.length === 1) return [];
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
    isForwardDeclared = false,
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
      isForwardDeclared,
    };
    scope.set(name, info);
    return info;
  }

  materializeForwardDeclaration(
    name: string,
    line: number,
    initialized: boolean,
  ): SymbolInfo | undefined {
    const info = this.currentScope.get(name);
    if (!info?.isForwardDeclared) return undefined;
    info.declaredLine = line;
    info.isInitialized = initialized;
    info.isForwardDeclared = false;
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

// [const] int|float|string|bool <n> = <expr>
const DECL_RE = /^(const\s+)?(int|float|string|bool)\s+(\w+)\s*=\s*(.+)/;
// [const] int|float|string|bool <n>           (no assignment)
const DECL_NO_ASSIGN_RE = /^(const\s+)?(int|float|string|bool)\s+(\w+)\s*$/;
// [const] int|float|string|bool = ...            (missing variable name)
const DECL_NO_NAME_RE = /^(const\s+)?(int|float|string|bool)\s*=\s*/;
// x op= rhs   (compound assignment: +=, -=, *=, /=)
const COMPOUND_ASSIGN_RE = /^([a-zA-Z_]\w*)\s*(\+|-|\*|\/)=\s*(.+)$/;
// x = rhs     (simple reassignment — checked AFTER compound to avoid overlap)
const SIMPLE_ASSIGN_RE = /^([a-zA-Z_]\w*)\s*=\s*(.+)$/;

// ─── Diagnostic reporter interfaces ──────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
interface DiagnosticReporter {
  (line: number, message: string, column?: number, endColumn?: number): void;
}

// ─── Logical line structure ───────────────────────────────────────────────────

interface LogicalLine {
  text: string;
  rawText: string;
  lineNumber: number;
}

// ─── BraceTracker ─────────────────────────────────────────────────────────────

/**
 * Manages brace depth and the associated symbol table scope lifecycle.
 * Emits unused-variable warnings when a scope is closed.
 *
 * Single Responsibility: owns all brace-depth / scope-open/close logic.
 */
class BraceTracker {
  private depth = 0;

  get braceDepth(): number {
    return this.depth;
  }

  /**
   * Open `count` new scopes (one per `{` on the current line).
   */
  openScopes(count: number, symbols: SymbolTable): void {
    for (let i = 0; i < count; i++) {
      symbols.pushScope();
      this.depth++;
    }
  }

  /**
   * Close `count` scopes (one per `}` on the current line).
   * Emits unused-variable warnings via `warn` before each scope is discarded.
   */
  closeScopes(
    count: number,
    symbols: SymbolTable,
    warn: DiagnosticReporter,
  ): void {
    for (let i = 0; i < count; i++) {
      this.depth--;
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
  }
}

// ─── TryCatchTracker ─────────────────────────────────────────────────────────

/**
 * Tracks whether the current line is inside a try/catch block.
 *
 * Single Responsibility: owns all try/catch context state.
 */
class TryCatchTracker {
  private active = false;
  private startDepth = -1;

  get insideTryCatch(): boolean {
    return this.active;
  }

  /** Call when a `try {` line is encountered. */
  enter(currentDepth: number): void {
    this.active = true;
    this.startDepth = currentDepth;
  }

  /** Call after every scope-close to check whether we've exited the try block. */
  checkExit(currentDepth: number): void {
    if (this.active && currentDepth <= this.startDepth) {
      this.active = false;
      this.startDepth = -1;
    }
  }
}

// ─── Parenthesis-aware utilities ──────────────────────────────────────────────

/**
 * Splits a raw argument string on TOP-LEVEL commas only.
 *   "cast(x, int), y"  →  ["cast(x, int)", "y"]
 */
function splitTopLevelArgs(argsStr: string): string[] {
  const args: string[] = [];
  let depth = 0,
    cur = "";
  let inString = false;
  let escaping = false;

  for (const ch of argsStr) {
    if (inString) {
      cur += ch;
      if (escaping) {
        escaping = false;
      } else if (ch === "\\") {
        escaping = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      cur += ch;
    } else if (ch === "(" || ch === "[") {
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
  let inString = false;
  let escaping = false;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];

    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (ch === "\\") {
        escaping = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      continue;
    }

    if (!/[a-zA-Z_]/.test(ch)) continue;
    if (i > 0 && /\w/.test(expr[i - 1])) continue;

    let j = i + 1;
    while (j < expr.length && /\w/.test(expr[j])) j++;

    let k = j;
    while (k < expr.length && /\s/.test(expr[k])) k++;
    if (expr[k] !== "(") continue;

    const name = expr.slice(i, j);
    let depth = 1;
    let end = k + 1;
    let nestedInString = false;
    let nestedEscaping = false;

    while (end < expr.length && depth > 0) {
      const innerCh = expr[end];
      if (nestedInString) {
        if (nestedEscaping) {
          nestedEscaping = false;
        } else if (innerCh === "\\") {
          nestedEscaping = true;
        } else if (innerCh === "\"") {
          nestedInString = false;
        }
      } else if (innerCh === "\"") {
        nestedInString = true;
      } else if (innerCh === "(") {
        depth++;
      } else if (innerCh === ")") {
        depth--;
      }
      end++;
    }

    result.push({
      name,
      args: splitTopLevelArgs(expr.slice(k + 1, end - 1)),
    });

    i = k;
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

/**
 * Mirrors the lexer by removing line and block comments before validation,
 * while preserving line breaks and character positions for diagnostics.
 */
function stripCommentsPreserveLayout(code: string): string {
  let result = "";
  let inString = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaping = false;

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      if (ch === "\r" || ch === "\n") {
        inLineComment = false;
        result += ch;
      } else {
        result += " ";
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        result += "  ";
        i++;
        inBlockComment = false;
      } else if (ch === "\r" || ch === "\n") {
        result += ch;
      } else {
        result += " ";
      }
      continue;
    }

    if (inString) {
      result += ch;
      if (escaping) {
        escaping = false;
      } else if (ch === "\\") {
        escaping = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      result += ch;
      continue;
    }

    if (ch === "/" && next === "/") {
      result += "  ";
      i++;
      inLineComment = true;
      continue;
    }

    if (ch === "/" && next === "*") {
      result += "  ";
      i++;
      inBlockComment = true;
      continue;
    }

    result += ch;
  }

  return result;
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

// ─── Reference helpers ────────────────────────────────────────────────────────

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
  warn: DiagnosticReporter,
): void {
  const stripped = expr
    .replace(/"(?:[^"\\]|\\.)*"/g, "")  
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

// ─── Function call validator ──────────────────────────────────────────────────

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
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
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
      validateCastCall(
        args,
        ln,
        declaredType,
        fnName,
        outermostCallName,
        error,
      );
      continue; // cast's second arg is a type keyword — skip homogeneity check
    }

    // ── 3. Argument type homogeneity ─────────────────────────────────────────
    if (HOMOGENEOUS_ARG_FNS.has(fnName) && argCount >= 1) {
      validateHomogeneousArgs(
        fnName,
        args,
        ln,
        declaredType,
        outermostCallName,
        symbols,
        error,
      );
    }

    // ── 4b. Return type check for fixed-return functions (sqrt, pow) ─────────
    validateFixedReturnType(fnName, outermostCallName, declaredType, ln, error);
  }
}

/** Validates cast(expr, type) — second arg must be a valid type and match declaredType. */
function validateCastCall(
  args: string[],
  ln: number,
  declaredType: EVALType | undefined,
  fnName: string,
  outermostCallName: string,
  error: DiagnosticReporter,
): void {
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
}

/** Validates that all args to homogeneous-arg functions share the same type. */
function validateHomogeneousArgs(
  fnName: string,
  args: string[],
  ln: number,
  declaredType: EVALType | undefined,
  outermostCallName: string,
  symbols: SymbolTable,
  error: DiagnosticReporter,
): void {
  const argTypes = args.map((a) => inferExprType(a, symbols));
  const knownTypes = argTypes.filter((t): t is EVALType => t !== undefined);
  if (knownTypes.length === 0) return;

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
    return;
  }

  if (declaredType && fnName === outermostCallName) {
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

/** Validates that a fixed-float function is not assigned to an int variable. */
function validateFixedReturnType(
  fnName: string,
  outermostCallName: string,
  declaredType: EVALType | undefined,
  ln: number,
  error: DiagnosticReporter,
): void {
  if (
    fnName !== outermostCallName ||
    !declaredType ||
    (declaredType !== "int" && declaredType !== "float")
  ) return;

  const kind = FUNCTION_RETURN_KIND[fnName];
  if (kind === "fixed-float" && declaredType === "int") {
    error(
      ln,
      `Function '${fnName}' always returns 'float', but variable is declared as 'int' — ` +
      `change the variable type to 'float' or wrap with cast(${fnName}(...), int)`,
    );
  }
}

// ─── Statement handlers ───────────────────────────────────────────────────────

/**
 * Detects and processes control-flow statements.
 * Returns `true` when the line was a control-flow statement and should not
 * be processed further by other handlers.
 *
 * Single Responsibility: classifies and dispatches control-flow lines.
 */
function handleControlFlow(
  t: string,
  ln: number,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): boolean {
  if (/^try\s*\{?$/.test(t)) return true;

  if (/^(if|else\s+if|while|for)\s*\(/.test(t)) {
    processConditionExpression(t, ln, symbols, error, warn);
    return true;
  }

  if (/^else\b/.test(t) || /^}\s*else\b/.test(t)) return true;

  if (/^}?\s*catch\s*\(\s*[a-zA-Z_]\w*\s*\)\s*\{?$/.test(t)) return true;

  if (/^return\b/.test(t)) {
    processReturnStatement(t, ln, symbols, error, warn);
    return true;
  }

  if (/^(break|continue)\b/.test(t)) return true;

  return false;
}

/** Extracts and validates the condition expression from an if/while/for header. */
function processConditionExpression(
  t: string,
  ln: number,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): void {
  const parenOpen = t.indexOf("(");
  if (parenOpen === -1) return;

  let depth = 0;
  let parenClose = -1;
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

  if (parenClose === -1) return;

  const condition = t.slice(parenOpen + 1, parenClose);
  markUsedRefs(condition, symbols);
  checkUndeclaredRefs(condition, symbols, ln, "", warn);
  validateFunctionCalls(condition, ln, undefined, symbols, error, warn);
}

/** Extracts and validates the expression from a return statement. */
function processReturnStatement(
  t: string,
  ln: number,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): void {
  const retExpr = t.replace(/^return\b\s*/, "");
  if (!retExpr) return;
  markUsedRefs(retExpr, symbols);
  checkUndeclaredRefs(retExpr, symbols, ln, "", warn);
  validateFunctionCalls(retExpr, ln, undefined, symbols, error, warn);
}

// ─── Declaration handler ──────────────────────────────────────────────────────

/**
 * Processes a full variable declaration line: `[const] TYPE name = expr`.
 *
 * Single Responsibility: validates and registers new variable declarations.
 */
function handleDeclaration(
  t: string,
  rawLine: string,
  ln: number,
  insideTryCatch: boolean,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): boolean {
  const declMatch = t.match(DECL_RE);
  if (!declMatch) return false;

  const [, constKeyword, declaredType, varName, expr] = declMatch;
  const isConst = !!constKeyword;
  const trimmedExpr = expr.trim();
  const varCol = findTokenColumn(rawLine, varName);

  checkBuiltinConstantShadow(varName, ln, varCol, warn);
  checkDuplicateDeclaration(varName, ln, varCol, symbols, warn);
  registerVariable(varName, declaredType as EVALType, isConst, ln, symbols);
  validateDeclarationRhs(
    varName,
    declaredType as EVALType,
    trimmedExpr,
    ln,
    varCol,
    insideTryCatch,
    symbols,
    error,
    warn,
  );

  return true;
}

function checkBuiltinConstantShadow(
  varName: string,
  ln: number,
  varCol: number | undefined,
  warn: DiagnosticReporter,
): void {
  if (BUILTIN_CONSTANTS.has(varName)) {
    warn(
      ln,
      `'${varName}' shadows a built-in constant — choose a different name`,
      varCol,
    );
  }
}

function checkDuplicateDeclaration(
  varName: string,
  ln: number,
  varCol: number | undefined,
  symbols: SymbolTable,
  warn: DiagnosticReporter,
): void {
  const existing = symbols.currentScopeSymbols().find((s) => s.name === varName);
  if (existing && !existing.isForwardDeclared && existing.declaredLine !== ln) {
    warn(
      ln,
      `Variable '${varName}' is already declared on line ${existing.declaredLine}`,
      varCol,
    );
  }
}

function registerVariable(
  varName: string,
  declaredType: EVALType,
  isConst: boolean,
  ln: number,
  symbols: SymbolTable,
): void {
  const existing = symbols.currentScopeSymbols().find((s) => s.name === varName);
  if (!existing) {
    symbols.declare(varName, declaredType, isConst, ln, true);
  } else if (existing.isForwardDeclared) {
    symbols.materializeForwardDeclaration(varName, ln, true);
  }
}

/**
 * Validates the right-hand side of a variable declaration.
 * Delegates to type-specific sub-validators.
 */
function validateDeclarationRhs(
  varName: string,
  declaredType: EVALType,
  trimmedExpr: string,
  ln: number,
  varCol: number | undefined,
  insideTryCatch: boolean,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): void {
  if (declaredType === "bool") {
    validateBoolRhs(varName, trimmedExpr, ln, varCol, symbols, error);
  } else if (declaredType === "string") {
    validateStringRhs(varName, trimmedExpr, ln, varCol, symbols, error);
  } else if (declaredType === "int" || declaredType === "float") {
    validateNumericRhs(
      varName,
      declaredType,
      trimmedExpr,
      ln,
      varCol,
      symbols,
      error,
      warn,
    );
  }

  if (/\/\s*0(?!\.)/.test(trimmedExpr) && !insideTryCatch) {
    error(ln, "Division by zero detected");
  }

  checkUndeclaredRefs(trimmedExpr, symbols, ln, varName, warn);
  markUsedRefs(trimmedExpr, symbols);
  validateFunctionCalls(
    trimmedExpr,
    ln,
    declaredType,
    symbols,
    error,
    warn,
  );
}

function validateBoolRhs(
  varName: string,
  trimmedExpr: string,
  ln: number,
  varCol: number | undefined,
  symbols: SymbolTable,
  error: DiagnosticReporter,
): void {
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

function validateStringRhs(
  varName: string,
  trimmedExpr: string,
  ln: number,
  varCol: number | undefined,
  symbols: SymbolTable,
  error: DiagnosticReporter,
): void {
  const rhsType = inferExprType(trimmedExpr, symbols);
  if (rhsType !== undefined && rhsType !== "string") {
    error(
      ln,
      `Cannot assign '${rhsType}' value to string variable '${varName}'`,
      varCol,
    );
  }
}

function validateNumericRhs(
  varName: string,
  declaredType: "int" | "float",
  trimmedExpr: string,
  ln: number,
  varCol: number | undefined,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): void {
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
    validateInlineCast(castMatch, declaredType, varName, ln, symbols, error, warn);
  } else {
    validateInferredNumericType(varName, declaredType, trimmedExpr, ln, symbols, warn);
  }
}

function validateInlineCast(
  castMatch: RegExpMatchArray,
  declaredType: "int" | "float",
  varName: string,
  ln: number,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): void {
  const sourceExpr = castMatch[1].trim();
  const castTarget = castMatch[2].trim();
  if (!VALID_TYPES.has(castTarget)) {
    error(ln, `Invalid cast target type '${castTarget}' — expected 'int' or 'float'`);
  } else if (castTarget !== declaredType) {
    error(
      ln,
      `Cast type '${castTarget}' does not match declared variable type ` +
      `'${declaredType}' for '${varName}' — use cast(expr, ${declaredType})`,
    );
  } else {
    const sourceType = inferExprType(sourceExpr, symbols);
    if (sourceType === castTarget) {
      warn(
        ln,
        `Redundant cast: '${sourceExpr}' is already '${castTarget}' — cast() is unnecessary here`,
      );
    }
  }
}

function validateInferredNumericType(
  varName: string,
  declaredType: "int" | "float",
  trimmedExpr: string,
  ln: number,
  symbols: SymbolTable,
  warn: DiagnosticReporter,
): void {
  const inferredRhsType = inferExprType(trimmedExpr, symbols);
  if (
    inferredRhsType !== undefined &&
    inferredRhsType !== declaredType &&
    (inferredRhsType === "int" || inferredRhsType === "float") &&
    (declaredType === "int" || declaredType === "float")
  ) {
    const isTopLevelFnCall = /^[a-zA-Z_]\w*\s*\(/.test(trimmedExpr);
    if (!isTopLevelFnCall && inferredRhsType === "float" && declaredType === "int") {
      warn(
        ln,
        `Expression evaluates to 'float' but variable '${varName}' is declared as 'int' — implicit conversion`,
      );
    }
  }
}

// ─── Incomplete declaration handler ──────────────────────────────────────────

/**
 * Handles `[const] TYPE name` — declared without an assignment.
 */
function handleIncompleteDeclaration(
  t: string,
  ln: number,
  symbols: SymbolTable,
  warn: DiagnosticReporter,
): boolean {
  if (!DECL_NO_ASSIGN_RE.test(t)) return false;
  const m = t.match(DECL_NO_ASSIGN_RE)!;
  symbols.materializeForwardDeclaration(m[3], ln, false);
  warn(ln, `Variable '${m[3]}' declared but never assigned`);
  return true;
}

// ─── Standalone function call handler ────────────────────────────────────────

/**
 * Handles standalone function calls used as statements (print, etc.).
 */
function handleStandaloneFunctionCall(
  t: string,
  ln: number,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): boolean {
  if (!/^[a-zA-Z_]\w*\s*\(/.test(t)) return false;
  validateFunctionCalls(t, ln, undefined, symbols, error, warn);
  markUsedRefs(t, symbols);
  return true;
}

// ─── Compound assignment handler ──────────────────────────────────────────────

/**
 * Handles `x += expr`, `x -= expr`, `x *= expr`, `x /= expr`.
 *
 * Single Responsibility: validates compound reassignment statements.
 */
function handleCompoundAssignment(
  t: string,
  rawLine: string,
  ln: number,
  insideTryCatch: boolean,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): boolean {
  const match = t.match(COMPOUND_ASSIGN_RE);
  if (!match) return false;

  const [, varName, operator, rhs] = match;
  const sym = symbols.lookup(varName);
  const varCol = findTokenColumn(rawLine, varName);

  if (!sym) {
    error(ln, `Assignment to undeclared variable '${varName}'`, varCol);
    return true;
  }

  if (sym.isConst) {
    error(
      ln,
      `Cannot reassign const variable '${varName}' ` +
      `(declared on line ${sym.declaredLine}) — remove 'const' or use a new variable`,
      varCol,
    );
    return true;
  }

  validateCompoundRhsType(varName, operator, rhs, sym, ln, varCol, warn, error);

  if (/\/\s*0(?!\.)/.test(rhs) && !insideTryCatch)
    error(ln, "Division by zero detected");

  symbols.assign(varName);
  symbols.markUsed(varName);
  validateFunctionCalls(rhs, ln, sym.type, symbols, error, warn);
  markUsedRefs(rhs, symbols);

  return true;
}

function validateCompoundRhsType(
  varName: string,
  operator: string,
  rhs: string,
  sym: SymbolInfo,
  ln: number,
  varCol: number | undefined,
  warn: DiagnosticReporter,
  error: DiagnosticReporter,
): void {
  const rhsType = inferExprType(rhs.trim(), sym as unknown as SymbolTable extends infer T ? never : SymbolTable);
  // Note: inferExprType needs symbols — caller should pass symbols; refactored inline
}

// ─── Simple assignment handler ────────────────────────────────────────────────

/**
 * Handles `x = expr` (simple reassignment, no type keyword on LHS).
 *
 * Single Responsibility: validates simple reassignment statements.
 */
function handleSimpleAssignment(
  t: string,
  rawLine: string,
  ln: number,
  insideTryCatch: boolean,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): boolean {
  const match = t.match(SIMPLE_ASSIGN_RE);
  if (!match) return false;

  const [, varName, rhs] = match;
  const sym = symbols.lookup(varName);
  const varCol = findTokenColumn(rawLine, varName);

  if (!sym) {
    error(ln, `Assignment to undeclared variable '${varName}'`, varCol);
    return true;
  }

  if (sym.isConst) {
    error(
      ln,
      `Cannot reassign const variable '${varName}' ` +
      `(declared on line ${sym.declaredLine}) — remove 'const' or use a new variable`,
      varCol,
    );
    return true;
  }

  validateSimpleRhsType(varName, rhs.trim(), sym, ln, varCol, symbols, error, warn);

  if (/\/\s*0(?!\.)/.test(rhs) && !insideTryCatch)
    error(ln, "Division by zero detected");

  symbols.assign(varName);
  symbols.markUsed(varName);
  validateFunctionCalls(rhs, ln, sym.type, symbols, error, warn);
  markUsedRefs(rhs, symbols);

  return true;
}

function validateSimpleRhsType(
  varName: string,
  rhsTrimmed: string,
  sym: SymbolInfo,
  ln: number,
  varCol: number | undefined,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): void {
  const rhsType = inferExprType(rhsTrimmed, symbols);
  if (rhsType === undefined || rhsType === sym.type) return;

  if (sym.type === "bool") {
    error(ln, `Cannot assign '${rhsType}' value to bool variable '${varName}'`, varCol);
  } else if (sym.type === "string") {
    error(ln, `Cannot assign '${rhsType}' value to string variable '${varName}'`, varCol);
  } else if (sym.type === "int" && rhsType === "float") {
    warn(ln, `Assigning 'float' value to 'int' variable '${varName}' — implicit conversion`, varCol);
  } else if (sym.type === "float" && rhsType === "string") {
    error(ln, `Cannot assign 'string' value to 'float' variable '${varName}'`, varCol);
  }
}

// ─── Statement dispatcher ─────────────────────────────────────────────────────

/**
 * Routes a single logical line to the appropriate handler.
 * Returns without processing when the line is brace-only or control flow.
 *
 * Single Responsibility: statement classification and dispatch only.
 */
function dispatchStatement(
  t: string,
  rawLine: string,
  ln: number,
  insideTryCatch: boolean,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): void {
  // ── Missing variable name ──────────────────────────────────────────────────
  if (DECL_NO_NAME_RE.test(t) && !DECL_RE.test(t)) {
    error(ln, "Variable declaration is missing a name (e.g. `int x = ...`)");
    return;
  }

  // ── Full variable declaration ─────────────────────────────────────────────
  if (handleDeclaration(t, rawLine, ln, insideTryCatch, symbols, error, warn)) return;

  // ── Incomplete declaration ─────────────────────────────────────────────────
  if (handleIncompleteDeclaration(t, ln, symbols, warn)) return;

  // ── Standalone function call ───────────────────────────────────────────────
  if (handleStandaloneFunctionCall(t, ln, symbols, error, warn)) return;

  // ── Compound assignment ────────────────────────────────────────────────────
  if (handleCompoundAssignmentDispatch(t, rawLine, ln, insideTryCatch, symbols, error, warn)) return;

  // ── Simple assignment ──────────────────────────────────────────────────────
  if (handleSimpleAssignment(t, rawLine, ln, insideTryCatch, symbols, error, warn)) return;

  // ── Division by zero in a bare expression ─────────────────────────────────
  if (/\/\s*0(?!\.)/.test(t) && !insideTryCatch) {
    error(ln, "Division by zero detected");
    return;
  }

  // ── Unrecognised statement ─────────────────────────────────────────────────
  if (!/^\s*$/.test(t)) {
    warn(ln, `Unrecognized statement: '${t}'`);
  }
}

/**
 * Wrapper for compound assignment that correctly threads `symbols` into the
 * type-check helper (avoids the circular dependency in the extracted function).
 */
function handleCompoundAssignmentDispatch(
  t: string,
  rawLine: string,
  ln: number,
  insideTryCatch: boolean,
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): boolean {
  const match = t.match(COMPOUND_ASSIGN_RE);
  if (!match) return false;

  const [, varName, operator, rhs] = match;
  const sym = symbols.lookup(varName);
  const varCol = findTokenColumn(rawLine, varName);

  if (!sym) {
    error(ln, `Assignment to undeclared variable '${varName}'`, varCol);
    return true;
  }

  if (sym.isConst) {
    error(
      ln,
      `Cannot reassign const variable '${varName}' ` +
      `(declared on line ${sym.declaredLine}) — remove 'const' or use a new variable`,
      varCol,
    );
    return true;
  }

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

  return true;
}

// ─── Logical line builder ─────────────────────────────────────────────────────

function computeGroupingDepth(text: string): number {
  let depth = 0;
  let inString = false;
  let escaping = false;

  for (const ch of text) {
    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (ch === "\\") {
        escaping = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      continue;
    }

    if (ch === "(" || ch === "[") depth++;
    else if ((ch === ")" || ch === "]") && depth > 0) depth--;
  }

  return depth;
}

function shouldAppendToLogicalLine(
  currentText: string,
  nextText: string,
): boolean {
  if (!currentText || !nextText) return false;

  if (computeGroupingDepth(currentText) > 0) return true;

  if (/(?:\+|-|\*|\/|%|&&|\|\||==|!=|<=|>=|<|>|=|,)$/.test(currentText)) return true;

  if (/^(?:\+|-|\*|\/|%|&&|\|\||==|!=|<=|>=|<|>|,)/.test(nextText)) return true;

  return false;
}

function buildLogicalLines(rawLines: string[]): LogicalLine[] {
  const logicalLines: LogicalLine[] = [];
  let pendingText = "";
  let pendingRawText = "";
  let pendingLineNumber = 0;

  function flushPending(): void {
    if (!pendingText) return;
    logicalLines.push({
      text: pendingText,
      rawText: pendingRawText,
      lineNumber: pendingLineNumber,
    });
    pendingText = "";
    pendingRawText = "";
    pendingLineNumber = 0;
  }

  rawLines.forEach((rawLine, index) => {
    const trimmedLine = rawLine.replace(/;$/, "").trim();

    if (!trimmedLine) {
      flushPending();
      return;
    }

    if (!pendingText) {
      pendingText = trimmedLine;
      pendingRawText = rawLine;
      pendingLineNumber = index + 1;
      return;
    }

    if (shouldAppendToLogicalLine(pendingText, trimmedLine)) {
      pendingText += ` ${trimmedLine}`;
      pendingRawText += `\n${rawLine}`;
      return;
    }

    flushPending();
    pendingText = trimmedLine;
    pendingRawText = rawLine;
    pendingLineNumber = index + 1;
  });

  flushPending();
  return logicalLines;
}

// ─── Forward Declaration Scan (PASS 1) ───────────────────────────────────────

/**
 * Pre-registers top-level variable declarations for forward reference resolution.
 */
function performForwardDeclarationScan(
  lines: LogicalLine[],
  symbols: SymbolTable,
): void {
  let depth = 0;
  lines.forEach(({ text: t }) => {
    const opens = (t.match(/\{/g) ?? []).length;
    const closes = (t.match(/\}/g) ?? []).length;

    if (depth === 0) {
      const mDecl = t.match(DECL_RE);
      if (mDecl) {
        const [, constKw, type, name] = mDecl;
        if (!symbols.has(name))
          symbols.declare(name, type as EVALType, !!constKw, 0, true, true);
      } else {
        const mNoAssign = t.match(DECL_NO_ASSIGN_RE);
        if (mNoAssign) {
          const [, constKw, type, name] = mNoAssign;
          if (!symbols.has(name))
            symbols.declare(name, type as EVALType, !!constKw, 0, false, true);
        }
      }
    }

    depth += opens - closes;
  });
}

// ─── Full Validation (PASS 2) ────────────────────────────────────────────────

/**
 * Performs full line-by-line validation with scope management.
 * Delegates each statement type to a focused handler.
 */
function performFullValidation(
  lines: LogicalLine[],
  symbols: SymbolTable,
  error: DiagnosticReporter,
  warn: DiagnosticReporter,
): void {
  const braceTracker = new BraceTracker();
  const tryCatchTracker = new TryCatchTracker();

  lines.forEach(({ text: t, rawText: rawLine, lineNumber: ln }) => {
    if (t === "") return;

    const openBraces = (t.match(/\{/g) ?? []).length;
    const closeBraces = (t.match(/\}/g) ?? []).length;

    // ── Scope pop (closing braces processed first) ────────────────────────────
    braceTracker.closeScopes(closeBraces, symbols, warn);
    tryCatchTracker.checkExit(braceTracker.braceDepth);

    // ── try/catch bookkeeping ─────────────────────────────────────────────────
    if (/^try\s*\{/.test(t)) {
      tryCatchTracker.enter(braceTracker.braceDepth);
    }

    const isBraceOnly = /^[{}\s]+$/.test(t);

    // ── Control flow ──────────────────────────────────────────────────────────
    const isControlFlow = handleControlFlow(t, ln, symbols, error, warn);

    if (isControlFlow || isBraceOnly) {
      braceTracker.openScopes(openBraces, symbols);
      return;
    }

    // ── Statement dispatch ────────────────────────────────────────────────────
    dispatchStatement(
      t,
      rawLine,
      ln,
      tryCatchTracker.insideTryCatch,
      symbols,
      error,
      warn,
    );

    // ── Scope push (opening braces on non-control-flow lines) ─────────────────
    braceTracker.openScopes(openBraces, symbols);
  });
}

// ─── analyzeCode ─────────────────────────────────────────────────────────────

function analyzeCode(code: string): Diagnostics[] {
  const diagnostics: Diagnostics[] = [];
  const sanitizedCode = stripCommentsPreserveLayout(code);
  const rawLines = sanitizedCode.split(/\r?\n/);
  const logicalLines = buildLogicalLines(rawLines);

  const symbols = new SymbolTable();

  function error(line: number, msg: string, col?: number, end?: number) {
    diagnostics.push({ severity: "error", line, column: col, endColumn: end, message: msg });
  }
  function warn(line: number, msg: string, col?: number, end?: number) {
    diagnostics.push({ severity: "warning", line, column: col, endColumn: end, message: msg });
  }

  // PASS 1: Forward declaration scan
  performForwardDeclarationScan(logicalLines, symbols);

  // PASS 2: Full validation
  performFullValidation(logicalLines, symbols, error, warn);

  // POST-PASS: unused variable warnings for global scope
  for (const sym of symbols.allSymbols()) {
    if (sym.usageCount === 0) {
      warn(sym.declaredLine, `Variable '${sym.name}' is declared but never used`);
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