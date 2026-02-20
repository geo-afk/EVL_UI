
import type * as monaco from "monaco-editor";

export function completionSuggestions(
  range: monaco.IRange,
  monacoInstance: typeof monaco
) {
  return [
    // =====================
    // Variable Declarations
    // =====================
    {
      label: 'int',
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: 'int ${1:name} = ${2:value}',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Declare an integer variable',
      range,
    },
    {
      label: 'float',
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: 'float ${1:name} = ${2:value}',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Declare a floating-point variable',
      range,
    },
    {
      label: 'const',
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: 'const ${1:type} ${2:name} = ${3:value}',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Declare a constant value',
      range,
    },

    // ==========
    // Functions
    // ==========
    {
      label: 'print',
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: 'print(${1:value})',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Print values to standard output',
      range,
    },
    {
      label: 'cast',
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: 'cast(${1:value}, ${2:type})',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Explicitly cast a value to a type',
      range,
    },
    {
      label: 'pow',
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: 'pow(${1:base}, ${2:exponent})',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Raise a number to a power',
      range,
    },
    {
      label: 'sqrt',
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: 'sqrt(${1:value})',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Calculate square root',
      range,
    },
    {
      label: 'min',
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: 'min(${1:a}, ${2:b})',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Return the smaller value',
      range,
    },
    {
      label: 'max',
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: 'max(${1:a}, ${2:b})',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Return the larger value',
      range,
    },
    {
      label: 'round',
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: 'round(${1:value})',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Round a floating-point value',
      range,
    },

    // ==========
    // Constants
    // ==========
    {
      label: 'PI',
      kind: monacoInstance.languages.CompletionItemKind.Constant,
      insertText: 'PI',
      documentation: 'Mathematical constant π',
      range,
    },
    {
      label: 'DAYS_IN_WEEK',
      kind: monacoInstance.languages.CompletionItemKind.Constant,
      insertText: 'DAYS_IN_WEEK',
      documentation: 'Number of days in a week',
      range,
    },
    {
      label: 'HOURS_IN_DAY',
      kind: monacoInstance.languages.CompletionItemKind.Constant,
      insertText: 'HOURS_IN_DAY',
      documentation: 'Number of hours in a day',
      range,
    },
    {
      label: 'YEAR',
      kind: monacoInstance.languages.CompletionItemKind.Constant,
      insertText: 'YEAR',
      documentation: 'Current year constant',
      range,
    },

    // ==================
    // Control Flow
    // ==================
    {
      label: 'try',
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: 'try {\n\t${1:// code}\n}',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Begin a try block',
      range,
    },
    {
      label: 'catch',
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: 'catch {\n\t${1:// error handling}\n}',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: 'Handle errors from a try block',
      range,
    },

    // ==========
    // Operators
    // ==========
    ...['+', '-', '*', '/', '%', '='].map(op => ({
      label: op,
      kind: monacoInstance.languages.CompletionItemKind.Operator,
      insertText: op,
      documentation: `Operator ${op}`,
      range,
    })),
  ];
}
