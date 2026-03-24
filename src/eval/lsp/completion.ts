import type * as monaco from "monaco-editor";

export function completionSuggestions(
  range: monaco.IRange,
  monacoInstance: typeof monaco,
) {
  return [
    // =====================
    // Variable Declarations
    // =====================
    {
      label: "int",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "int ${1:name} = ${2:value}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Declare an integer variable",
      range,
    },
    {
      label: "float",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "float ${1:name} = ${2:value}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Declare a floating-point variable",
      range,
    },
    {
      label: "string",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: 'string ${1:name} = "${2:value}"',
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Declare a string variable",
      range,
    },
    {
      label: "bool",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "bool ${1:name} = ${2|true,false|}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Declare a boolean variable",
      range,
    },
    {
      label: "const",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "const ${1|int,float,string,bool|} ${2:name} = ${3:value}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Declare a constant value",
      range,
    },

    // ==========
    // Functions
    // ==========
    {
      label: "print",
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: "print(${1:value})",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Print values to standard output",
      range,
    },
    {
      label: "cast",
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: "cast(${1:value}, ${2|int,float,string,bool|})",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Explicitly cast a value to a type",
      range,
    },
    {
      label: "pow",
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: "pow(${1:base}, ${2:exponent})",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Raise a number to a power",
      range,
    },
    {
      label: "sqrt",
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: "sqrt(${1:value})",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Calculate square root",
      range,
    },
    {
      label: "min",
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: "min(${1:a}, ${2:b})",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Return the smaller value",
      range,
    },
    {
      label: "max",
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: "max(${1:a}, ${2:b})",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Return the larger value",
      range,
    },
    {
      label: "round",
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: "round(${1:value})",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Round a floating-point value to the nearest integer",
      range,
    },
    {
      label: "abs",
      kind: monacoInstance.languages.CompletionItemKind.Function,
      insertText: "abs(${1:value})",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Return the absolute (non-negative) value",
      range,
    },

    // ==========
    // Constants
    // ==========
    {
      label: "PI",
      kind: monacoInstance.languages.CompletionItemKind.Constant,
      insertText: "PI",
      documentation: "Mathematical constant pi (~3.14159)",
      range,
    },
    {
      label: "DAYS_IN_WEEK",
      kind: monacoInstance.languages.CompletionItemKind.Constant,
      insertText: "DAYS_IN_WEEK",
      documentation: "Number of days in a week (7)",
      range,
    },
    {
      label: "HOURS_IN_DAY",
      kind: monacoInstance.languages.CompletionItemKind.Constant,
      insertText: "HOURS_IN_DAY",
      documentation: "Number of hours in a day (24)",
      range,
    },
    {
      label: "YEAR",
      kind: monacoInstance.languages.CompletionItemKind.Constant,
      insertText: "YEAR",
      documentation: "Current year constant",
      range,
    },

    // ==================
    // Control Flow
    // ==================
    {
      label: "if",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "if (${1:condition}) {\n\t${2:// code}\n}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation:
        "If statement — executes a block when the condition is true",
      range,
    },
    {
      label: "if / else",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText:
        "if (${1:condition}) {\n\t${2:// code}\n} else {\n\t${3:// code}\n}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "If / else statement",
      range,
    },
    {
      label: "else if",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "else if (${1:condition}) {\n\t${2:// code}\n}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Add an else-if branch to an existing if statement",
      range,
    },
    {
      label: "while",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "while (${1:condition}) {\n\t${2:// code}\n}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "While loop — repeats while the condition is true",
      range,
    },
    {
      label: "try",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "try {\n\t${1:// code}\n}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Begin a try block",
      range,
    },
    {
      // FIX: grammar requires  catch (identifier) { }  — bare catch { } is invalid
      label: "catch",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "catch (${1:e}) {\n\t${2:// error handling}\n}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Handle errors from a try block",
      range,
    },
    {
      // Combined try/catch — the most common use-case
      label: "try / catch",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText:
        "try {\n\t${1:// code}\n} catch (${2:e}) {\n\t${3:// error handling}\n}",
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "Try/catch block for error handling",
      range,
    },
    {
      label: "break",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "break",
      documentation: "Exit the nearest enclosing loop",
      range,
    },
    {
      label: "continue",
      kind: monacoInstance.languages.CompletionItemKind.Keyword,
      insertText: "continue",
      documentation: "Skip to the next loop iteration",
      range,
    },

    // ==========
    // Literals
    // ==========
    {
      label: "true",
      kind: monacoInstance.languages.CompletionItemKind.Value,
      insertText: "true",
      documentation: "Boolean true literal",
      range,
    },
    {
      label: "false",
      kind: monacoInstance.languages.CompletionItemKind.Value,
      insertText: "false",
      documentation: "Boolean false literal",
      range,
    },
    {
      label: "null",
      kind: monacoInstance.languages.CompletionItemKind.Value,
      insertText: "null",
      documentation: "Null / no-value literal",
      range,
    },

    // ==========
    // Operators
    // ==========
    ...[
      "+",
      "-",
      "*",
      "/",
      "%",
      "=",
      "==",
      "!=",
      "<",
      ">",
      "<=",
      ">=",
      "&&",
      "||",
      "!",
    ].map((op) => ({
      label: op,
      kind: monacoInstance.languages.CompletionItemKind.Operator,
      insertText: op,
      documentation: `Operator: ${op}`,
      range,
    })),
  ];
}
