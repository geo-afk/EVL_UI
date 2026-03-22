import { useState, useCallback, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { CodeEditor } from "../components/editor/CodeEditor";
import { OutputPanel } from "../components/panels/OutputPanel";
import { AIPanel } from "../components/panels/AIPanel";
import { SplitLayout } from "../components/layout/SplitLayout";
import { StackedPanes } from "../components/layout/StackedPanes";
import { AnalysisResponse, EVAL_SAMPLE } from "../model/models";
import { fetchAIInsights, fetchRunCode } from "../api";
import { setError } from "../eval/lsp/setup";   // adjust path to match your project
import * as Monaco from "monaco-editor";


interface AIResult {
  content?: string;
  error?: string;
}

interface CodeRunResult {
  logs: string[];
  error?: string;
  returnValue?: string;
}

interface LocationState {
  code?: string;
  language?: string;
}

// ─── sessionStorage keys ──────────────────────────────────────────────────────
const STORAGE_KEY_RUN  = "eval_output_result";
const STORAGE_KEY_AI   = "eval_ai_result";
const STORAGE_KEY_MODE = "eval_ai_mode";
const STORAGE_KEY_CODE = "eval_editor_code";

function readSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

function clearSession(...keys: string[]) {
  keys.forEach((k) => sessionStorage.removeItem(k));
}

// ─── URL hash encode / decode ─────────────────────────────────────────────────
function encodeCodeToHash(code: string): string {
  return btoa(encodeURIComponent(code));
}

function decodeCodeFromHash(hash: string): string | null {
  try {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!raw) return null;
    return decodeURIComponent(atob(raw));
  } catch {
    return null;
  }
}

function readHashCode(): string | null {
  if (typeof window === "undefined") return null;
  return decodeCodeFromHash(window.location.hash);
}
function toRunResult(analysis: AnalysisResponse): CodeRunResult {
  const logs = analysis.output.length
    ? analysis.output
    : analysis.steps.flatMap((s) => s.output);

  const errorMessages = analysis.errors
    .map((e) => `[${e.line_number}:${e.column_number}] ${e.message}`)
    .join("\n");

  return {
    logs,
    error: errorMessages || undefined,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export const EditorPage = () => {
  const location      = useLocation();
  const locationState = location.state as LocationState | null;


const monacoRef = useRef<typeof Monaco | null>(null);
const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

// 3. The callback passed to <CodeEditor>
const handleEditorMount = useCallback(
  (monaco: typeof Monaco, editor: Monaco.editor.IStandaloneCodeEditor) => {
    monacoRef.current = monaco;
    editorRef.current = editor;
  },
  [],
);

  // Priority order for initial code:
  //   1. URL hash  (shareable link — highest priority, overrides everything)
  //   2. Router state  (coming from Learn page "Try in Editor")
  //   3. sessionStorage  (persisted from last edit session)
  //   4. Default sample code
  const hashCode     = readHashCode();
  const incomingCode = hashCode ?? locationState?.code ?? null;

  const [code, setCode] = useState<string>(() => {
    if (incomingCode) return incomingCode;
    return readSession<string>(STORAGE_KEY_CODE) ?? EVAL_SAMPLE.defaultCode;
  });

  // Rehydrate panels from sessionStorage so output survives page navigation
  const [runResult,  setRunResult]  = useState<CodeRunResult | null>(() => readSession(STORAGE_KEY_RUN));
  const [aiResult,   setAiResult]   = useState<AIResult | null>(()     => readSession(STORAGE_KEY_AI));
  const [activeMode, setActiveMode] = useState<"run" | "insights" | null>(() => readSession(STORAGE_KEY_MODE));

  const [isRunning,   setIsRunning]   = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  // Persist code changes so they survive navigation
  useEffect(() => {
    writeSession(STORAGE_KEY_CODE, code);
  }, [code]);

  // Clear incoming code sources from the URL/history so a hard refresh
  // doesn't re-apply them over whatever the user has typed since.
  useEffect(() => {
    if (hashCode) {
      // Remove the hash without adding a history entry
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else if (locationState?.code) {
      window.history.replaceState({}, "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunResult(null);
    setAiResult(null);
    setActiveMode(null);
    clearSession(STORAGE_KEY_RUN, STORAGE_KEY_AI, STORAGE_KEY_MODE);

    try {
      const analysis = await fetchRunCode(code);


      if (analysis.has_errors && monacoRef.current) {
        setError(analysis.errors, monacoRef.current);
      }
      

      const result   = toRunResult(analysis);
      setRunResult(result);
      writeSession(STORAGE_KEY_RUN, result);
      
      sessionStorage.setItem("eval_last_debug", JSON.stringify({ analysis, code }));
    } catch (err) {
      const result: CodeRunResult = {
        logs: [],
        error: err instanceof Error ? err.message : "Network error — is the backend running?",
      };
      setRunResult(result);
      writeSession(STORAGE_KEY_RUN, result);
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning]);

  const handleAIRun = useCallback(async () => {
    if (isAILoading) return;
    setIsAILoading(true);
    setActiveMode("run");
    setAiResult(null);
    writeSession(STORAGE_KEY_MODE, "run");
    clearSession(STORAGE_KEY_AI);

    try {
      const data   = await fetchAIInsights(code);
      const result = { content: data.content };
      setAiResult(result);
      writeSession(STORAGE_KEY_AI, result);
    } catch (err) {
      const result = { error: err instanceof Error ? err.message : "Network error — is the backend running?" };
      setAiResult(result);
      writeSession(STORAGE_KEY_AI, result);
    } finally {
      setIsAILoading(false);
    }
  }, [code, isAILoading]);

  const handleAIInsights = useCallback(async () => {
    if (isAILoading) return;
    setIsAILoading(true);
    setActiveMode("insights");
    setAiResult(null);
    writeSession(STORAGE_KEY_MODE, "insights");
    clearSession(STORAGE_KEY_AI);

    try {
      const data   = await fetchAIInsights(code);
      const result = { content: data.content };
      setAiResult(result);
      writeSession(STORAGE_KEY_AI, result);
    } catch (err) {
      const result = { error: err instanceof Error ? err.message : "Network error — is the backend running?" };
      setAiResult(result);
      writeSession(STORAGE_KEY_AI, result);
    } finally {
      setIsAILoading(false);
    }
  }, [code, isAILoading]);


  const onClear = useCallback(() => {
    setRunResult(null);
    setAiResult(null);
    setActiveMode(null);
    clearSession(STORAGE_KEY_RUN, STORAGE_KEY_AI, STORAGE_KEY_MODE);
  }, []);

  const handleShare = useCallback(() => {
    if (!code.trim()) return;
    const hash   = encodeCodeToHash(code);
    const url    = `${window.location.origin}${window.location.pathname}#${hash}`;
    // Update the address bar so the user can also copy from there
    window.history.replaceState(null, "", `#${hash}`);
    navigator.clipboard.writeText(url).catch(() => {
      // Clipboard unavailable — the hash is still in the address bar
    });
  }, [code]);

  // ── Layout ───────────────────────────────────────────────────────────────────
  const leftPanel = (
    <StackedPanes
      top={
        <OutputPanel
          result={runResult}
          isRunning={isRunning}
          onClear={onClear}
        />
      }
      bottom={
        <AIPanel
          result={aiResult}
          isLoading={isAILoading}
          activeMode={activeMode}
          onClear={onClear}
        />
      }
      defaultTopPercent={48}
    />
  );

  const rightPanel = (
    <CodeEditor
      code={code}
      onCodeChange={setCode}
      onRun={handleRun}
      onAIRun={handleAIRun}
      onAIInsights={handleAIInsights}
      isAILoading={isAILoading}
      isRunning={isRunning}
      onShare={handleShare}
      onEditorMount={handleEditorMount} 
    />
  );

  return (
    <Box h="100%" bg="var(--bg-base)">
      <SplitLayout
        left={leftPanel}
        right={rightPanel}
        defaultLeftPercent={36}
        minLeftPx={260}
        minRightPx={340}
      />
    </Box>
  );
};