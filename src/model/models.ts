export const EVAL_LANGUAGE_ID = "evl";

// ── Shared result types (imported by EditorPage, OutputPanel, AIPanel) ─────────
// Centralizing these here eliminates the duplicate local definitions that lived
// in both EditorPage and each panel component.

export interface CodeRunResult {
  logs: string[];
  error?: string;
  returnValue?: string;
}

export interface AIResult {
  content?: string;
  error?: string;
}

// ── Diagnostics ───────────────────────────────────────────────────────────────
// Legacy interface kept for any LSP / validator callers that still reference it.
export interface Diagnostics {
  severity: string;
  line: number;
  column?: number;
  endColumn?: number;
  message: string;
}

// ── Function signatures ────────────────────────────────────────────────────────
// Previously the FUNCTION_SIGNATURES object used implicit inline types.
// A named interface makes it easy to add new entries without silently diverging.
export interface FunctionSignatureParam {
  label: string;
  documentation: string;
}

export interface FunctionSignature {
  label: string;
  documentation: string;
  parameters: FunctionSignatureParam[];
}

export const FUNCTION_SIGNATURES: Record<string, FunctionSignature> = {
  pow: {
    label: "pow(base: number, exponent: number) → float",
    documentation: "Raises base to the power of exponent.",
    parameters: [
      { label: "base", documentation: "Base value" },
      { label: "exponent", documentation: "Exponent value" },
    ],
  },
  cast: {
    label: "cast(value: any, type: type) → any",
    documentation: "Explicitly converts a value to a type.",
    parameters: [
      { label: "value", documentation: "Value to convert" },
      { label: "type", documentation: "Target type" },
    ],
  },
  sqrt: {
    label: "sqrt(value: number) → float",
    documentation: "Returns the square root of a number.",
    parameters: [{ label: "value", documentation: "Input number" }],
  },
};

export interface Language {
  id: string;
  label: string;
  monacoLang: string;
  defaultCode: string;
}

// ── Scope ─────────────────────────────────────────────────────────────────────
export interface ScopeEntry {
  type: string;
  value: unknown;
  const: boolean;
}

// ── Step ──────────────────────────────────────────────────────────────────────
export interface StepModel {
  id: number;
  phase: string;
  title: string;
  description: string;
  line: number;
  changed: string;
  details: string;
  scope: Record<string, ScopeEntry>;
  output: string[];
}

// ── Diagnostic ────────────────────────────────────────────────────────────────
export interface DiagnosticModel {
  message: string;
  line_number: number;
  column_number: number;
  severity: number;
}

// ── Top-level response ────────────────────────────────────────────────────────
export interface AnalysisResponse {
  steps: StepModel[];
  output: string[];
  errors: DiagnosticModel[];
  warnings: DiagnosticModel[];
  has_errors: boolean;
}