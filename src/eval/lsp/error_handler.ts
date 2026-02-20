import { CharStream, CommonTokenStream } from "antlr4ng";
import { EVALLexer } from "../generated/EVALLexer";
import { EVALParser } from "../generated/EVALParser";



interface ANTLRError {
  line: number;
  column: number;
  message: string;
  type: 'error' | 'warning' | 'info';
}


class CollectingErrorListener {
  public errors: ANTLRError[] = [];

  syntaxError(
    _recognizer: any,
    offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: any
  ) {

    let message = `${msg} (token: "${offendingSymbol?.text ?? 'unknown'}")`

    this.errors.push({
      line,
      column: charPositionInLine,
      message: message,
      type: 'error'
    });
  }

  reportAmbiguity(
    recognizer: any,
    _dfa: any,
    startIndex: number,
    stopIndex: number,
    _exact: boolean,
    _ambigAlts: any,
    _configs: any
  ) {
    let line = 0;
    let column = startIndex;

    if (recognizer && recognizer.inputStream) {
      const input = recognizer.inputStream;
      line = input.getLine(startIndex) ?? 0;
      column = input.getColumn(startIndex) ?? startIndex;
    }

    this.errors.push({
      line,
      column,
      message: `Ambiguity detected from index ${startIndex} to ${stopIndex}`,
      type: 'warning',
    });

    console.warn(`Ambiguity at ${startIndex}:${stopIndex}`);
  }


  reportAttemptingFullContext(
    _recognizer: any,
    _dfa: any,
    _startIndex: number,
    _stopIndex: number,
    _conflictingAlts: any,
    _configs: any
  ) {
    // optional: log for debugging complex grammars
  }

  reportContextSensitivity(
    _recognizer: any,
    _dfa: any,
    _startIndex: number,
    _stopIndex: number,
    _prediction: number,
    _configs: any
  ) {
    // optional: log context sensitivity
  }
}



export function parseCode(code: string): ANTLRError[] {
  const listener = new CollectingErrorListener();
  const input = CharStream.fromString(code);
  const lexer = new EVALLexer(input);
  lexer.removeErrorListeners();
  lexer.addErrorListener(listener);

  const tokens = new CommonTokenStream(lexer);
  const parser = new EVALParser(tokens);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);

  let parseTree: any;
  try {
    parseTree = parser.program();
  } catch (e: any) {
    listener.errors.push({
      line: e?.line ?? 0,
      column: e?.column ?? 0,
      message: e?.message ?? String(e),
      type: 'error',
    });
  }

  return listener.errors;
}


