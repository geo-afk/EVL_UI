
export function language_configuration(): import('monaco-editor').languages.LanguageConfiguration {
  // for convenience, import the types locally
  type CharacterPair = import('monaco-editor').languages.CharacterPair;
  type IAutoClosingPair = import('monaco-editor').languages.IAutoClosingPair;

  const brackets: CharacterPair[] = [
    ['{', '}'],
    ['(', ')'],
  ];

  const autoClosingPairs: IAutoClosingPair[] = [
    { open: '{', close: '}' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ];

  const surroundingPairs: IAutoClosingPair[] = [
    { open: '{', close: '}' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ];

  return {
    comments: {
      lineComment: '//',
      blockComment: ["/*", "*/"],
    },
    brackets,
    autoClosingPairs,
    surroundingPairs,
  };
}
