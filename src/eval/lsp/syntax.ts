export function syntax_definition() {
  return {
    defaultToken: "",

    // === Keyword groups (mirrors ANTLR lexer) ===
    keywords: [
      // Type keywords
      "int",
      "float",
      "string",
      "bool",
      "const",
      // Control flow
      "if",
      "else",
      "while",
      "for",
      "break",
      "continue",
      "return",
      // Error handling
      "try",
      "catch",
      // Literals
      "true",
      "false",
      "null",
    ],

    builtins: ["print", "pow", "cast", "sqrt", "min", "max", "round", "abs"],

    constants: ["DAYS_IN_WEEK", "HOURS_IN_DAY", "YEAR", "PI"],

    // Ordered longest-first so multi-char operators are matched before prefixes
    operators: [
      // Logical
      "&&",
      "||",
      // Comparison (two-char before one-char)
      "==",
      "!=",
      "<=",
      ">=",
      "<",
      ">",
      // Compound assignment (must come before ASSIGN)
      "+=",
      "-=",
      "*=",
      "/=",
      // Increment / decrement (must come before + -)
      "++",
      "--",
      // Arithmetic / assignment
      "+",
      "-",
      "*",
      "/",
      "%",
      "=",
      // Unary
      "!",
    ],

    // Covers every operator character so the tokenizer can classify them
    symbols: /[=!<>&|+\-*\/%]+/,

    // === Tokenizer ===
    tokenizer: {
      root: [
        // Identifiers & keywords
        [
          /[a-zA-Z_][a-zA-Z0-9_]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@builtins": "predefined.function",
              "@constants": "constant",
              "@default": "identifier",
            },
          },
        ],

        // Whitespace & comments
        { include: "@whitespace" },

        // Numbers (REAL before INTEGER — mirrors ANTLR lexer ordering)
        [/-?\d+\.\d+/, "number.float"],
        [/-?\d+/, "number"],

        // Strings
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string"],

        // Delimiters
        [/[{}]/, "delimiter.bracket"],
        [/[()]/, "delimiter.parenthesis"],
        [/\[\]/, "delimiter.square"],
        [/[;,]/, "delimiter"],

        // Operators
        [
          /@symbols/,
          {
            cases: {
              "@operators": "operator",
              "@default": "",
            },
          },
        ],
      ],

      whitespace: [
        [/[ \t\r\n]+/, ""],
        [/\/\/.*$/, "comment"],
        [/\/\*.*?\*\//, "comment"],
      ],

      string: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string", "@pop"],
      ],
    },
  };
}
