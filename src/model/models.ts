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
  defaultCode: `int x = 10
float y = 20.5
int sum = x + y  // Implicit conversion (weak typing)

print("Sum:", sum)
const int newVal = cast(y, int)


int pi = PI
int dayOfWeek = DAYS_IN_WEEK
int hourInDay =  HOURS_IN_DAY
int year = YEAR

float g = pow(by, number)
int val = sqrt(num)
int minimum= min(y, r)
int maxVal = max(t, w)
float value = round(y)


try {
  int result = 100 / 0
} catch {
  print("Error: Division by zero!")
}

int c = 20 + 40 * 40  // Correctly evaluates to 1620`,
};


