export const EVAL_LANGUAGE_ID = 'evl';

export interface Diagnostics {
  severity: string;
  line: number;
  column?: number;
  endColumn?: number;
  message: string;
}



export const FUNCTION_SIGNATURES = {
  pow: {
    label: 'pow(base: number, exponent: number) → float',
    documentation: 'Raises base to the power of exponent.',
    parameters: [
      { label: 'base', documentation: 'Base value' },
      { label: 'exponent', documentation: 'Exponent value' },
    ],
  },
  cast: {
    label: 'cast(value: any, type: type) → any',
    documentation: 'Explicitly converts a value to a type.',
    parameters: [
      { label: 'value', documentation: 'Value to convert' },
      { label: 'type', documentation: 'Target type' },
    ],
  },
  sqrt: {
    label: 'sqrt(value: number) → float',
    documentation: 'Returns the square root of a number.',
    parameters: [
      { label: 'value', documentation: 'Input number' },
    ],
  },
};




export interface Language {
  id: string;
  label: string;
  monacoLang: string;
  defaultCode: string;
}

export const EVAL_SAMPLE: Language = {
  id: EVAL_LANGUAGE_ID,
  label: "Eval",
  monacoLang: "Eval",
  defaultCode: ``,
};


