export function syntax_definition() {
  return {
    defaultToken: '',

    // === Keyword groups (mirrors ANTLR lexer) ===
    keywords: [
      'int',
      'float',
      'const',
      'print',
      'try',
      'catch',
    ],

    builtins: [
      'pow',
      'cast',
      'sqrt',
      'min',
      'max',
      'round',
    ],

    constants: [
      'DAYS_IN_WEEK',
      'HOURS_IN_DAY',
      'YEAR',
      'PI',
    ],

    operators: [
      '=', '+', '-', '*', '/', '%'
    ],

    symbols: /[=+\-*\/%]+/,

    // === Tokenizer ===
    tokenizer: {
      root: [
        // Identifiers & keywords
        [/[a-zA-Z_][a-zA-Z0-9_]*/, {
          cases: {
            '@keywords': 'keyword',
            '@builtins': 'predefined.function',
            '@constants': 'constant',
            '@default': 'identifier'
          }
        }],

        // Whitespace & comments
        { include: '@whitespace' },

        // Numbers
        [/-?\d+\.\d+/, 'number.float'],
        [/-?\d+/, 'number'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string'],

        // Delimiters
        [/[{}]/, 'delimiter.bracket'],
        [/[()]/, 'delimiter.parenthesis'],
        [/[;,]/, 'delimiter'],

        // Operators
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\/.*$/, 'comment'],
        [/\/\*.*?\*\//, 'comment'],
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop'],
      ],
    },
  };
}
