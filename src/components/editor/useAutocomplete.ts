import { useRef, useCallback } from "react";
import * as Monaco from "monaco-editor";
import { fetchAIComplete } from "../../api";

const AUTOCOMPLETE_DEBOUNCE_MS = 600;

export function useAutocomplete(editorRef: React.RefObject<Monaco.editor.IStandaloneCodeEditor | null>) {
    const autocompleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autocompleteRequestId = useRef(0);
    const autocompleteAbortController = useRef<AbortController | null>(null);
    const pendingCompletion = useRef<string>("");

    const triggerAutocomplete = useCallback((lineText: string) => {
        if (!lineText.trim()) return;

        if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current);
        autocompleteRequestId.current += 1;
        const requestId = autocompleteRequestId.current;

        autocompleteAbortController.current?.abort();
        autocompleteAbortController.current = new AbortController();
        pendingCompletion.current = "";

        autocompleteTimer.current = setTimeout(async () => {
            const editor = editorRef.current;
            if (!editor) return;

            try {
                const data = await fetchAIComplete(lineText, {
                    signal: autocompleteAbortController.current?.signal,
                });

                if (requestId !== autocompleteRequestId.current) return;

                if (data?.completion) {
                    pendingCompletion.current = data.completion;

                    if (requestId === autocompleteRequestId.current) {
                        try {
                            editor.trigger("ai", "editor.action.inlineSuggest.trigger", {});
                        } catch {
                            // Ignore editor trigger exceptions
                        }
                    }
                }
            } catch (error) {
                if ((error as Error)?.name === "AbortError") return;
                pendingCompletion.current = "";
            }
        }, AUTOCOMPLETE_DEBOUNCE_MS);
    }, [editorRef]);

    const getPendingCompletion = useCallback(() => pendingCompletion.current, []);

    const clearPendingCompletion = useCallback(() => {
        pendingCompletion.current = "";
    }, []);

    return {
        triggerAutocomplete,
        getPendingCompletion,
        clearPendingCompletion,
    };
}