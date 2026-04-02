import { useRef, useCallback } from "react";
import * as Monaco from "monaco-editor";
import { fetchAIComplete } from "../../api";

// ─── Tunable ─────────────────────────────────────────────────────────────────
const DEBOUNCE_MS = 320;  // wait this long after the last keystroke before fetching
const MIN_LINE_LEN = 3;    // skip fetches for very short / empty lines

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAutocomplete(
    editorRef: React.RefObject<Monaco.editor.IStandaloneCodeEditor | null>,
) {
    // The completion text that provideInlineCompletions will read.
    const pendingCompletion = useRef<string | null>(null);
    // The exact line text that was sent to produce the current pending result.
    // Used to detect stale completions at both write-time and read-time.
    const completionForLine = useRef<string | null>(null);
    // AbortController for the currently in-flight fetch.
    const abortCtrl = useRef<AbortController | null>(null);
    // Debounce timer.
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── triggerAutocomplete ──────────────────────────────────────────────────
    // Called on every onDidChangeModelContent with the text of the current
    // line up to the cursor column.
    const triggerAutocomplete = useCallback((lineText: string) => {
        // Reset debounce on every keystroke.
        if (debounceTimer.current !== null) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }

        // Skip trivially short input.
        if (lineText.trim().length < MIN_LINE_LEN) {
            if (pendingCompletion.current !== null) {
                pendingCompletion.current = null;
                completionForLine.current = null;
                editorRef.current?.trigger(
                    "autocomplete",
                    "editor.action.inlineSuggest.hide",
                    {},
                );
            }
            return;
        }

        debounceTimer.current = setTimeout(async () => {
            debounceTimer.current = null;

            // Cancel the previous in-flight request.
            abortCtrl.current?.abort();
            abortCtrl.current = new AbortController();
            const { signal } = abortCtrl.current;

            // Snapshot the line we are fetching for.
            const fetchedForLine = lineText;

            try {
                const { completion } = await fetchAIComplete(fetchedForLine, { signal });

                // Guard 1: aborted — discard silently.
                if (signal.aborted) return;

                // Guard 2: the cursor has moved since we fired — discard stale result.
                const editor = editorRef.current;
                if (editor) {
                    const pos = editor.getPosition();
                    const model = editor.getModel();
                    if (pos && model) {
                        const currentLine = model
                            .getLineContent(pos.lineNumber)
                            .substring(0, pos.column - 1)
                            .trim();
                        if (currentLine !== fetchedForLine) return;
                    }
                }

                // Guard 3: empty completion is useless.
                if (!completion?.trim()) return;

                pendingCompletion.current = completion;
                completionForLine.current = fetchedForLine;

                // Ask Monaco to re-run provideInlineCompletions with the new result.
                editorRef.current?.trigger(
                    "autocomplete",
                    "editor.action.inlineSuggest.trigger",
                    {},
                );
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                // Non-fatal: clear ghost text on any other error.
                pendingCompletion.current = null;
                completionForLine.current = null;
            }
        }, DEBOUNCE_MS);
    }, [editorRef]);

    // ── getPendingCompletion ─────────────────────────────────────────────────
    // Called synchronously by Monaco's provideInlineCompletions.
    // Accepts the current line text for a final read-time stale check —
    // this closes the remaining race window between the write-time guard and
    // the Monaco provider call.
    const getPendingCompletion = useCallback(
        (currentLineText?: string): string | null => {
            if (pendingCompletion.current === null) return null;

            if (
                currentLineText !== undefined &&
                currentLineText !== completionForLine.current
            ) {
                pendingCompletion.current = null;
                completionForLine.current = null;
                return null;
            }

            return pendingCompletion.current;
        },
        [],
    );

    // ── clearPendingCompletion ───────────────────────────────────────────────
    // Called by Monaco's freeInlineCompletions when ghost text is dismissed.
    const clearPendingCompletion = useCallback(() => {
        pendingCompletion.current = null;
        completionForLine.current = null;
    }, []);

    return { triggerAutocomplete, getPendingCompletion, clearPendingCompletion };
}