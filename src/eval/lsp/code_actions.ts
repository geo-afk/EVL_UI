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

/** Extracts { badType, correctType } from a cast type-mismatch error. */
function extractCastTypeMismatch(message: string): { badType: string; correctType: string } | null {
  const match = message.match(/Cast type '(\w+)' does not match declared variable type '(\w+)'/);
  return match ? { badType: match[1], correctType: match[2] } : null;
}

/**
 * Extracts the bad integer value from a float-literal error message.
 * e.g. "Float variable 'x' must be initialised with a float literal — use 34.0 instead of 34"
 */
function extractFloatLiteralFix(message: string): { intVal: string; floatVal: string } | null {
  const match = message.match(/use (\d+\.\d+) instead of (\d+)/);
  return match ? { floatVal: match[1], intVal: match[2] } : null;
}

/**
 * Extracts the correct type from a "returns 'X', but variable is declared as 'Y'" message.
 * Returns { returnType, declaredType }.
 */
function extractReturnTypeMismatch(
  message: string
): { returnType: string; declaredType: string } | null {
  const match = message.match(/returns '(\w+)'.*declared as '(\w+)'/);
  return match ? { returnType: match[1], declaredType: match[2] } : null;
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
        const markerLine = model.getLineContent(marker.startLineNumber);

        // Helper to push a line-replacement edit
        const replaceMarkerLine = (
          title: string,
          text: string,
          preferred = false,
          kind: string = "quickfix"
        ) => {
          actions.push({
            title,
            diagnostics: [marker],
            kind,
            edit: {
              edits: [{
                resource: model.uri,
                textEdit: {
                  range: new monacoInstance.Range(
                    marker.startLineNumber, 1,
                    marker.startLineNumber, markerLine.length + 1
                  ),
                  text,
                },
                versionId: model.getVersionId(),
              }],
            },
            isPreferred: preferred,
          });
        };

        // ── Fix: variable declared but never assigned → add default value ─────
        if (msg.includes("declared but never assigned")) {
          const varName = extractVarName(msg);
          if (varName) {
            const isFloat = markerLine.trimStart().startsWith("float");
            const defaultVal = isFloat ? "0.0" : "0";
            replaceMarkerLine(
              `Assign default value to '${varName}' (${defaultVal})`,
              markerLine.trimEnd() + ` = ${defaultVal}`,
              true
            );
          }
        }

        // ── Fix: float variable initialised with integer literal ──────────────
        //    e.g.  float x = 34  →  float x = 34.0
        if (msg.includes("must be initialised with a float literal")) {
          const fix = extractFloatLiteralFix(msg);
          if (fix) {
            // Replace the bare integer at the end of the line
            const fixed = markerLine.replace(
              new RegExp(`\\b${fix.intVal}\\b\\s*$`),
              fix.floatVal
            );
            replaceMarkerLine(
              `Change ${fix.intVal} to ${fix.floatVal}`,
              fixed,
              true
            );
          }
        }

        // ── Fix: duplicate variable declaration → remove the line ─────────────
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
                    marker.startLineNumber, 1,
                    marker.startLineNumber + 1, 1
                  ),
                  text: "",
                },
                versionId: model.getVersionId(),
              }],
            },
            isPreferred: true,
          });
        }

        // ── Fix: implicit float → int conversion (non-cast RHS) ──────────────
        //    e.g.  int x = y  →  int x = cast(y, int)
        if (msg.includes("implicit conversion") && !msg.includes("Cast type")) {
          const assignMatch = markerLine.match(/=\s*(.+)$/);
          if (assignMatch) {
            const rhs = assignMatch[1].trim();

            // If RHS is already a cast with wrong type, just fix the type arg
            const existingCastMatch = rhs.match(/^cast\s*\((.+),\s*\w+\s*\)$/);
            if (existingCastMatch) {
              const innerExpr = existingCastMatch[1];
              replaceMarkerLine(
                "Fix cast type to 'int'",
                markerLine.replace(/=\s*.+$/, `= cast(${innerExpr}, int)`),
                true
              );
            } else {
              replaceMarkerLine(
                "Add explicit cast to int",
                markerLine.replace(/=\s*.+$/, `= cast(${rhs}, int)`),
                true
              );
            }
          }
        }

        // ── Fix: cast type does not match declared variable type ───────────────
        //    e.g.  int gg = cast(b, float)  →  int gg = cast(b, int)
        if (msg.includes("Cast type") && msg.includes("does not match declared variable type")) {
          const mismatch = extractCastTypeMismatch(msg);
          if (mismatch) {
            const { badType, correctType } = mismatch;

            // Option 1: fix the cast type argument
            const castTypeRe = new RegExp(`(cast\\s*\\([^,]+,\\s*)${badType}(\\s*\\))`);
            const fixed = markerLine.replace(castTypeRe, `$1${correctType}$2`);
            if (fixed !== markerLine) {
              replaceMarkerLine(`Fix cast type to match variable type ('${correctType}')`, fixed, true);
            }

            // Option 2: change the variable's declared type to match the cast
            const fixedDecl = markerLine.replace(
              /^(\s*(?:const\s+)?)(int|float)(\s+)/,
              `$1${badType}$3`
            );
            if (fixedDecl !== markerLine) {
              replaceMarkerLine(`Change variable type to '${badType}' to match cast`, fixedDecl);
            }
          }
        }

        // ── Fix: function return type / argument type mismatch ────────────────
        //
        // Covers two validator messages:
        //   (a) "Function 'X' always returns 'float', but variable is declared as 'int'"
        //   (b) "Function 'X' with 'float' arguments returns 'float', but variable is declared as 'int'"
        if (
          (msg.includes("always returns") || msg.includes("arguments returns")) &&
          msg.includes("but variable is declared as")
        ) {
          const mismatch = extractReturnTypeMismatch(msg);
          if (mismatch) {
            const { returnType, declaredType } = mismatch;

            // Option 1: change the variable's declared type to match the return type
            const fixedDecl = markerLine.replace(
              /^(\s*(?:const\s+)?)(int|float)(\s+)/,
              `$1${returnType}$3`
            );
            if (fixedDecl !== markerLine) {
              replaceMarkerLine(
                `Change variable type to '${returnType}' to match function return`,
                fixedDecl,
                true
              );
            }

            // Option 2: wrap the RHS in a cast to keep the declared type
            const assignMatch = markerLine.match(/=\s*(.+)$/);
            if (assignMatch) {
              const rhs = assignMatch[1].trim();
              replaceMarkerLine(
                `Cast result to '${declaredType}'`,
                markerLine.replace(/=\s*.+$/, `= cast(${rhs}, ${declaredType})`)
              );
            }
          }
        }

        // ── Fix: mixed-type arguments → offer to cast each arg ────────────────
        //
        // "Function 'X' requires all arguments to be the same type, but received
        //  mixed types: 'a' (int), 'b' (float). Use cast() to convert …"
        if (msg.includes("requires all arguments to be the same type")) {
          const fnName = extractFunctionName(msg);
          if (fnName) {
            // Try to extract the call from the line and cast each arg to int or float
            const callRe = new RegExp(`${fnName}\\s*\\(([^)]+)\\)`);
            const callMatch = markerLine.match(callRe);
            if (callMatch) {
              const argsRaw = callMatch[1];
              ["int", "float"].forEach(targetType => {
                // Wrap each comma-separated arg in cast(arg, targetType)
                const fixedArgs = argsRaw
                  .split(",")
                  .map(a => {
                    const trimmed = a.trim();
                    // Don't double-wrap if it's already a cast
                    if (/^cast\s*\(/.test(trimmed)) return trimmed;
                    return `cast(${trimmed}, ${targetType})`;
                  })
                  .join(", ");

                const fixed = markerLine.replace(callRe, `${fnName}(${fixedArgs})`);
                replaceMarkerLine(
                  `Cast all arguments to '${targetType}'`,
                  fixed,
                  targetType === "float"
                );
              });
            }
          }
        }

        // ── Fix: division by zero → wrap in try/catch ─────────────────────────
        if (msg.includes("Division by zero")) {
          const indented = "    " + markerLine.trim();
          replaceMarkerLine(
            "Wrap in try/catch block",
            `try {\n${indented}\n} catch (e) {\n    print("Error: Division by zero!")\n}`,
            true
          );
        }

        // ── Fix: undeclared identifier → insert declaration above ─────────────
        if (msg.includes("undeclared identifier")) {
          const identName = extractIdentifierName(msg);
          if (identName) {
            ["int", "float"].forEach(type => {
              const defaultVal = type === "float" ? "0.0" : "0";
              actions.push({
                title: `Declare '${type} ${identName} = ${defaultVal}' above this line`,
                diagnostics: [marker],
                kind: "quickfix",
                edit: {
                  edits: [{
                    resource: model.uri,
                    textEdit: {
                      range: new monacoInstance.Range(
                        marker.startLineNumber, 1,
                        marker.startLineNumber, 1
                      ),
                      text: `${type} ${identName} = ${defaultVal}\n`,
                    },
                    versionId: model.getVersionId(),
                  }],
                },
                isPreferred: type === "int",
              });
            });
          }
        }

        // ── Fix: invalid cast target type ─────────────────────────────────────
        if (msg.includes("Invalid cast target type")) {
          const badType = extractCastType(msg);
          if (badType) {
            ["int", "float"].forEach(correctType => {
              const castTypeRe = new RegExp(`(cast\\s*\\([^,]+,\\s*)${badType}(\\s*\\))`);
              const fixed = markerLine.replace(castTypeRe, `$1${correctType}$2`);
              replaceMarkerLine(
                `Replace invalid cast type with '${correctType}'`,
                fixed,
                correctType === "int"
              );
            });
          }
        }

        // ── Fix: wrong argument count → surface the correct signature ──────────
        if (msg.includes("expects") && msg.includes("argument(s)")) {
          const fnName = extractFunctionName(msg);
          if (fnName) {
            actions.push({
              title: `View correct signature for '${fnName}' in documentation`,
              diagnostics: [marker],
              kind: "quickfix",
              // No edit — surfaces the hint as a clickable action for awareness
            });
          }
        }

        // ── Fix: missing variable name → insert placeholder ───────────────────
        if (msg.includes("missing a name")) {
          const fixed = markerLine.replace(
            /^(\s*(?:const\s+)?(?:int|float|string|bool))\s*=/,
            "$1 myVar ="
          );
          replaceMarkerLine('Add placeholder variable name "myVar"', fixed, true);
        }
      });

      // ── Refactor: make variable a constant ────────────────────────────────
      const assignMatch = lineContent.match(/^(\s*)(int|float|string|bool)\s+(\w+)\s*=\s*(.+)$/);
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
                  range.startLineNumber, 1,
                  range.startLineNumber, lineContent.length + 1
                ),
                text: `${indent}const ${type} ${name} = ${expr}`,
              },
              versionId: model.getVersionId(),
            }],
          },
        });
      }

      // ── Refactor: int variable with float-looking RHS → suggest float ─────
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
                  range.startLineNumber, 1,
                  range.startLineNumber, lineContent.length + 1
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
