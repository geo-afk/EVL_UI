import * as monaco from "monaco-editor";
import { syntax_definition } from "./syntax";
import { language_configuration } from "./configuration";
import { hoverDocs } from "./hover";
import { parseCode } from "./error_handler";
import { codeActions } from "./code_actions";
import { completionSuggestions } from "./completion";
import { EVAL_LANGUAGE_ID, FUNCTION_SIGNATURES } from "../../model/models";





export function setup_eval(monacoInstance: typeof monaco) {

  monacoInstance.languages.register({ id: EVAL_LANGUAGE_ID })

  monacoInstance.languages.setMonarchTokensProvider(EVAL_LANGUAGE_ID, syntax_definition() as monaco.languages.IMonarchLanguage)

  monacoInstance.languages.setLanguageConfiguration(EVAL_LANGUAGE_ID, language_configuration())


  const hover: Record<string, string> = hoverDocs();


  monacoInstance.languages.registerHoverProvider(EVAL_LANGUAGE_ID, {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const docs = hover[word.word.toLowerCase()] || hover[word.word];
      if (!docs) return null;

      return {
        range: new monacoInstance.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: [
          { value: docs }
        ]
      };
    }
  });



  monacoInstance.languages.registerCompletionItemProvider(EVAL_LANGUAGE_ID, {

    provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {


      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };


      const suggestions = completionSuggestions(range, monacoInstance)


      return { suggestions }
    }



  })


  monacoInstance.languages.registerSignatureHelpProvider(EVAL_LANGUAGE_ID, {
    signatureHelpTriggerCharacters: ['(', ','],

    provideSignatureHelp(model, position) {
      const textUntilCursor = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const match = textUntilCursor.match(/(\w+)\s*\(([^)]*)$/);
      if (!match) return null;

      const fnName: string = match[1];
      if (!(fnName in FUNCTION_SIGNATURES)) return null;
      const argIndex = match[2].split(',').length - 1;

      type FunctionName = keyof typeof FUNCTION_SIGNATURES;
      const signature: any = FUNCTION_SIGNATURES[fnName as FunctionName];
      if (!signature) return null;

      return {
        value: {
          signatures: [signature],
          activeSignature: 0,
          activeParameter: argIndex,
        },
        dispose() { },
      };
    },
  });


  codeActions(EVAL_LANGUAGE_ID, monacoInstance)

}


export function updateDiagnostics(code: string, monacoInstance: typeof monaco) {
  const errors = parseCode(code);

  const markers = errors.map(err => ({
    severity: monacoInstance.MarkerSeverity.Error,
    startLineNumber: err.line,
    startColumn: err.column + 1,
    endLineNumber: err.line,
    endColumn: err.column + 2,
    message: err.message
  }));

  const model = monacoInstance.editor.getModels && monacoInstance.editor.getModels()[0];
  if (model) {
    monacoInstance.editor.setModelMarkers(model, 'antlr', markers);
  }
}



export function setError(errors: any, monacoInstance: typeof monaco) {

  const errorMarkers = errors.map((err: any) => ({
    startLineNumber: err.line_number || 1,
    startColumn: err.column_number || 1,
    endLineNumber: err.line_number || 1,
    endColumn: (err.column_number || 1) + 10,
    message: err.message || "Semantic Errors",
    severity: monacoInstance.MarkerSeverity.Error,
  }));

  const model = monacoInstance.editor.getModels && monacoInstance.editor.getModels()[0];
  if (model) {
    monacoInstance.editor.setModelMarkers(model, 'antlr', errorMarkers);
  }

}

