import type * as monaco from "monaco-editor";

// ─── Message parsers ──────────────────────────────────────────────────────────

function extractVarName(message: string): string | null {
  const match = message.match(/[Vv]ariable '(\w+)'/);
  return match ? match[1] : null;
}

function extractIdentifierName(message: string): string | null {
  const match = message.match(/identifier '(\w+)'/);
  return match ? match[1] : null;
}

function extractFunctionName(message: string): string | null {
  const match = message.match(/[Ff]unction '(\w+)'/);
  return match ? match[1] : null;
}

function extractCastType(message: string): string | null {
  const match = message.match(/cast target type '(\w+)'/);
  return match ? match[1] : null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function codeActions(EVAL_LANGUAGE_ID: string, monacoInstance: typeof monaco) {
  monacoInstance.languages.registerCodeActionProvider(EVAL_LANGUAGE_ID, {
    provideCodeActions: (
      model: monaco.editor.ITextModel,
      range: monaco.Range,
      context: monaco.languages.CodeActionContext,
      _token: monaco.CancellationToken
    ) => {
      const actions: monaco.languages.CodeAction[] = [];
      const lineContent = model.getLineContent(range.startLineNumber);

      context.markers.forEach(marker => {
        const msg = marker.message;

        // ── Fix: variable declared but never assigned ─────────────────────────
        // e.g.  int x  →  int x = 0
        if (msg.includes("declared but never assigned")) {
          const varName = extractVarName(msg);
          if (varName) {
            const markerLine = model.getLineContent(marker.startLineNumber);
            const isFloat = markerLine.trimStart().startsWith("float");
            const defaultVal = isFloat ? "0.0" : "0";

            actions.push({
              title: `Assign default value to '${varName}' (${defaultVal})`,
              diagnostics: [marker],
              kind: "quickfix",
              edit: {
                edits: [{
                  resource: model.uri,
                  textEdit: {
                    range: new monacoInstance.Range(
                      marker.startLineNumber,
                      1,
                      marker.startLineNumber,
                      markerLine.length + 1
                    ),
                    text: markerLine.trimEnd() + ` = ${defaultVal}`,
                  },
                  versionId: model.getVersionId(),
                }],
              },
              isPreferred: true,
            });
          }
        }

        // ── Fix: duplicate variable declaration → remove the duplicate line ───
        if (msg.includes("already declared")) {
          const varName = extractVarName(msg);
          actions.push({
            title: `Remove duplicate declaration${varName ? ` of '${varName}'` : ""}`,
            diagnostics: [marker],
            kind: "quickfix",
            edit: {
              edits: [{
                resource: model.uri,
                textEdit: {
                  range: new monacoInstance.Range(
                    marker.startLineNumber,
                    1,
                    marker.startLineNumber + 1,
                    1
                  ),
                  text: "",
                },
                versionId: model.getVersionId(),
              }],
            },
            isPreferred: true,
          });
        }

        // ── Fix: implicit float → int conversion → insert explicit cast ───────
        // e.g.  int x = y  →  int x = cast(y, int)
        if (msg.includes("implicit conversion")) {
          const markerLine = model.getLineContent(marker.startLineNumber);

          // Extract the RHS of the assignment
          const assignMatch = markerLine.match(/=\s*(.+)$/);
          if (assignMatch) {
            const rhs = assignMatch[1].trim();
            const fixed = markerLine.replace(/=\s*.+$/, `= cast(${rhs}, int)`);

            actions.push({
              title: "Add explicit cast to int",
              diagnostics: [marker],
              kind: "quickfix",
              edit: {
                edits: [{
                  resource: model.uri,
                  textEdit: {
                    range: new monacoInstance.Range(
                      marker.startLineNumber,
                      1,
                      marker.startLineNumber,
                      markerLine.length + 1
                    ),
                    text: fixed,
                  },
                  versionId: model.getVersionId(),
                }],
              },
              isPreferred: true,
            });
          }
        }

        // ── Fix: division by zero → wrap in try/catch ─────────────────────────
        if (msg.includes("Division by zero")) {
          const markerLine = model.getLineContent(marker.startLineNumber);
          const indented = "    " + markerLine.trim();

          actions.push({
            title: "Wrap in try/catch block",
            diagnostics: [marker],
            kind: "quickfix",
            edit: {
              edits: [{
                resource: model.uri,
                textEdit: {
                  range: new monacoInstance.Range(
                    marker.startLineNumber,
                    1,
                    marker.startLineNumber,
                    markerLine.length + 1
                  ),
                  text: `try {\n${indented}\n} catch {\n    print("Error: Division by zero!")\n}`,
                },
                versionId: model.getVersionId(),
              }],
            },
            isPreferred: true,
          });
        }

        // ── Fix: undeclared identifier → declare it above the current line ────
        if (msg.includes("undeclared identifier")) {
          const identName = extractIdentifierName(msg);
          if (identName) {
            actions.push({
              title: `Declare 'int ${identName} = 0' above this line`,
              diagnostics: [marker],
              kind: "quickfix",
              edit: {
                edits: [{
                  resource: model.uri,
                  textEdit: {
                    range: new monacoInstance.Range(
                      marker.startLineNumber,
                      1,
                      marker.startLineNumber,
                      1
                    ),
                    text: `int ${identName} = 0\n`,
                  },
                  versionId: model.getVersionId(),
                }],
              },
              isPreferred: false,
            });

            // Second option: declare as float
            actions.push({
              title: `Declare 'float ${identName} = 0.0' above this line`,
              diagnostics: [marker],
              kind: "quickfix",
              edit: {
                edits: [{
                  resource: model.uri,
                  textEdit: {
                    range: new monacoInstance.Range(
                      marker.startLineNumber,
                      1,
                      marker.startLineNumber,
                      1
                    ),
                    text: `float ${identName} = 0.0\n`,
                  },
                  versionId: model.getVersionId(),
                }],
              },
              isPreferred: false,
            });
          }
        }

        // ── Fix: invalid cast type → replace with 'int' or 'float' ───────────
        if (msg.includes("Invalid cast target type")) {
          const badType = extractCastType(msg);
          const markerLine = model.getLineContent(marker.startLineNumber);

          if (badType) {
            ["int", "float"].forEach(correctType => {
              actions.push({
                title: `Replace invalid cast type with '${correctType}'`,
                diagnostics: [marker],
                kind: "quickfix",
                edit: {
                  edits: [{
                    resource: model.uri,
                    textEdit: {
                      range: new monacoInstance.Range(
                        marker.startLineNumber,
                        1,
                        marker.startLineNumber,
                        markerLine.length + 1
                      ),
                      text: markerLine.replace(badType, correctType),
                    },
                    versionId: model.getVersionId(),
                  }],
                },
                isPreferred: correctType === "int",
              });
            });
          }
        }

        // ── Fix: wrong argument count → show the correct signature ─────────────
        if (msg.includes("expects") && msg.includes("argument")) {
          const fnName = extractFunctionName(msg);
          if (fnName) {
            actions.push({
              title: `View correct signature for '${fnName}' in documentation`,
              diagnostics: [marker],
              kind: "quickfix",
              // No edit — just surfaces the hint as a clickable action for awareness
            });
          }
        }

        // ── Fix: missing variable name (`int = ...`) → prompt correct syntax ──
        if (msg.includes("missing a name")) {
          const markerLine = model.getLineContent(marker.startLineNumber);
          const fixed = markerLine.replace(
            /^(\s*(?:const\s+)?(?:int|float))\s*=/,
            "$1 myVar ="
          );

          actions.push({
            title: 'Add placeholder variable name "myVar"',
            diagnostics: [marker],
            kind: "quickfix",
            edit: {
              edits: [{
                resource: model.uri,
                textEdit: {
                  range: new monacoInstance.Range(
                    marker.startLineNumber,
                    1,
                    marker.startLineNumber,
                    markerLine.length + 1
                  ),
                  text: fixed,
                },
                versionId: model.getVersionId(),
              }],
            },
            isPreferred: true,
          });
        }
      });

      // ── Refactor: inline arithmetic → add const for reuse ──────────────────
      // If the highlighted line has a plain arithmetic RHS, offer to make it const
      const assignMatch = lineContent.match(/^(\s*)(int|float)\s+(\w+)\s*=\s*(.+)$/);
      if (assignMatch && !lineContent.trimStart().startsWith("const")) {
        const [, indent, type, name, expr] = assignMatch;

        actions.push({
          title: `Make '${name}' a constant (const)`,
          kind: "refactor",
          edit: {
            edits: [{
              resource: model.uri,
              textEdit: {
                range: new monacoInstance.Range(
                  range.startLineNumber,
                  1,
                  range.startLineNumber,
                  lineContent.length + 1
                ),
                text: `${indent}const ${type} ${name} = ${expr}`,
              },
              versionId: model.getVersionId(),
            }],
          },
        });
      }

      // ── Refactor: int variable holding float expr → suggest float type ──────
      if (lineContent.match(/^\s*int\s+\w+\s*=\s*[\w.]+\.[\w.]+/)) {
        const fixed = lineContent.replace(/\bint\b/, "float");
        actions.push({
          title: "Change type from 'int' to 'float'",
          kind: "refactor",
          edit: {
            edits: [{
              resource: model.uri,
              textEdit: {
                range: new monacoInstance.Range(
                  range.startLineNumber,
                  1,
                  range.startLineNumber,
                  lineContent.length + 1
                ),
                text: fixed,
              },
              versionId: model.getVersionId(),
            }],
          },
        });
      }

      return {
        actions,
        dispose: () => { },
      };
    },
  });
}
