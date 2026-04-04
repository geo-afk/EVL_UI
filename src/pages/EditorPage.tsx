import { useState, useCallback, useEffect, useRef } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { Terminal, Sparkles, GitBranch, Bug } from "lucide-react";
import { CodeEditor } from "../components/editor/CodeEditor";
import { OutputPanel } from "../components/panels/OutputPanel";
import { AIPanel } from "../components/panels/AIPanel";
import { ParseTreePanel } from "../components/panels/ParseTreePanel";
import { SplitLayout } from "../components/layout/SplitLayout";
import { StackedPanes } from "../components/layout/StackedPanes";
import {
  AnalysisResponse,
  DiagnosticModel,
  CodeRunResult,
  AIResult,
} from "../model/models";
import { fetchAIInsights, fetchRunCode } from "../api";
import { setError } from "../eval/lsp/setup";
import * as Monaco from "monaco-editor";
import { DiagnosticsPanel } from "@/components/panels/Diagnosticspanel";
import { ToastStack } from "@/components/toast/ToastStack";
import { useToasts } from "@/components/toast/useToasts";

interface LocationState {
  code?: string;
  language?: string;
}

// ─── sessionStorage keys ──────────────────────────────────────────────────────
const SK = {
  RUN:  "eval_output_result",
  AI:   "eval_ai_result",
  MODE: "eval_ai_mode",
  CODE: "eval_editor_code",
} as const;

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
  const raw = window.location.hash;
  if (!raw || raw === "#") return null;
  return decodeCodeFromHash(raw);
}

// Converts a successful AnalysisResponse into the OutputPanel-facing result.
// Code-level errors are handled separately via diagErrors state and the
// DiagnosticsPanel — they must NOT appear in the OutputPanel.
function toRunResult(analysis: AnalysisResponse): CodeRunResult {
  const logs = analysis.output.length
    ? analysis.output
    : analysis.steps.flatMap((s) => s.output);

  return { logs };
}


function writeDebugSnapshot(analysis: AnalysisResponse, code: string) {
  writeSession("eval_last_debug", {
    code,
    output:     analysis.output,
    has_errors: analysis.has_errors,
    errors:     analysis.errors,
    warnings:   analysis.warnings,
    steps:      analysis.steps, // Include steps for debugger functionality
  });
}

// ─── Left-panel tab ids ───────────────────────────────────────────────────────
type LeftTab = "results" | "tree" | "diagnostics";

// ─── Tab button ───────────────────────────────────────────────────────────────
function LeftTabBtn({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "0 10px",
        height: "100%",
        fontSize: "10.5px",
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontWeight: active ? "700" : "500",
        letterSpacing: "0.06em",
        cursor: "pointer",
        background: "transparent",
        border: "none",
        borderBottom: active
          ? "2px solid var(--accent)"
          : "2px solid transparent",
        color: active ? "var(--accent)" : "var(--text-muted)",
        transition: "color 0.15s, border-color 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
      }}
    >
      <Icon size={11} />
      {label}
      {badge != null && badge > 0 && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--diag-error, #f87171)",
            color: "var(--bg-base)",
            borderRadius: "3px",
            fontSize: "9px",
            fontWeight: 700,
            lineHeight: 1,
            padding: "1px 4px",
            minWidth: "14px",
            marginLeft: "2px",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export const EditorPage = () => {
  const location     = useLocation();
  const locationState = location.state as LocationState | null;

  const monacoRef       = useRef<typeof Monaco | null>(null);
  const editorRef       = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const storageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const handleEditorMount = useCallback(
    (monaco: typeof Monaco, editor: Monaco.editor.IStandaloneCodeEditor) => {
      monacoRef.current = monaco;
      editorRef.current = editor;
    },
    [],
  );

  // Priority: URL hash > router state > sessionStorage > empty
  const hashCode     = readHashCode();
  const incomingCode = hashCode ?? locationState?.code ?? null;

  const [code, setCode] = useState<string>(
    () => incomingCode ?? readSession<string>(SK.CODE) ?? "",
  );

  const [runResult,   setRunResult]   = useState<CodeRunResult | null>(() => readSession(SK.RUN));
  const [aiResult,    setAiResult]    = useState<AIResult | null>(()     => readSession(SK.AI));
  const [activeMode,  setActiveMode]  = useState<"run" | "insights" | null>(() => readSession(SK.MODE));
  const [diagErrors,  setDiagErrors]  = useState<DiagnosticModel[]>([]);
  const [diagWarnings,setDiagWarnings]= useState<DiagnosticModel[]>([]);
  const [isRunning,   setIsRunning]   = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [leftTab,     setLeftTab]     = useState<LeftTab>("results");

  // Debounced sessionStorage write — avoids serialising on every keystroke.
  useEffect(() => {
    if (storageTimerRef.current) clearTimeout(storageTimerRef.current);
    storageTimerRef.current = setTimeout(() => writeSession(SK.CODE, code), 300);
    return () => { if (storageTimerRef.current) clearTimeout(storageTimerRef.current); };
  }, [code]);

  // On mount: clear incoming code sources from URL/history
  useEffect(() => {
    if (hashCode) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else if (locationState?.code) {
      window.history.replaceState({}, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Jump to line in Monaco ─────────────────────────────────────────────────
  const handleGoToLine = useCallback((line: number, column?: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.revealLineInCenter(line);
    editor.setPosition({ lineNumber: line, column: column ?? 1 });
    editor.focus();
  }, []);

  // ── Run ────────────────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunResult(null);
    setAiResult(null);
    setActiveMode(null);
    setDiagErrors([]);
    setDiagWarnings([]);
    clearSession(SK.RUN, SK.AI, SK.MODE, "eval_last_debug");
    setLeftTab("results");

    try {
      const analysis = await fetchRunCode(code);

      if (analysis.has_errors && monacoRef.current) {
        setError(analysis.errors, monacoRef.current);
      }

      setDiagErrors(analysis.errors ?? []);
      setDiagWarnings(analysis.warnings ?? []);

      // Auto-switch to diagnostics tab when errors are present.
      if ((analysis.errors?.length ?? 0) > 0) {
        setLeftTab("diagnostics");
      }

      // OutputPanel only receives logs — errors go to DiagnosticsPanel.
      const result = toRunResult(analysis);
      setRunResult(result);
      writeSession(SK.RUN, result);

      // Persist a trimmed debug snapshot for DevTools inspection.
      // Stored via writeSession so quota errors are swallowed, not thrown.
      writeDebugSnapshot(analysis, code);
    } catch (err) {
      // Network / server errors are system failures, not code output.
      // Route them to the toast stack so they are visible and dismissible
      // without polluting the OutputPanel.
      const message =
        err instanceof Error ? err.message : "Network error — is the backend running?";
      pushToast("error", "Run failed", message);
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning, pushToast]);

  // ── AI action ─────────────────────────────────────────────────────────────
  const handleAIAction = useCallback(
    async (mode: "run" | "insights") => {
      if (isAILoading) return;
      setIsAILoading(true);
      setActiveMode(mode);
      setAiResult(null);
      writeSession(SK.MODE, mode);
      clearSession(SK.AI);
      setLeftTab("results");

      try {
        const data = await fetchAIInsights(code);
        const result: AIResult = { content: data.content };
        setAiResult(result);
        writeSession(SK.AI, result);
      } catch (err) {
        // AI endpoint failures are also system errors — show as toast and
        // clear the AI panel rather than leaving stale error state there.
        const message =
          err instanceof Error ? err.message : "Network error — is the backend running?";
        pushToast("error", "AI request failed", message);
        setAiResult(null);
        clearSession(SK.AI, SK.MODE);
        setActiveMode(null);
      } finally {
        setIsAILoading(false);
      }
    },
    [code, isAILoading, pushToast],
  );

  const handleAIRun      = useCallback(() => handleAIAction("run"),      [handleAIAction]);
  const handleAIInsights = useCallback(() => handleAIAction("insights"), [handleAIAction]);

  // ── Clear ──────────────────────────────────────────────────────────────────
  const onClear = useCallback(() => {
    setRunResult(null);
    setAiResult(null);
    setActiveMode(null);
    setDiagErrors([]);
    setDiagWarnings([]);
    clearSession(SK.RUN, SK.AI, SK.MODE);
  }, []);

  // ── Share ──────────────────────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    if (!code.trim()) return;
    const hash = encodeCodeToHash(code);
    window.history.replaceState(null, "", `#${hash}`);
    navigator.clipboard
      .writeText(`${window.location.origin}${window.location.pathname}#${hash}`)
      .catch(() => {});
  }, [code]);

  const totalDiagCount = diagErrors.length + diagWarnings.length;

  // ── Layout ─────────────────────────────────────────────────────────────────
  const leftPanel = (
    <Flex direction="column" h="100%">
      {/* Tab bar */}
      <Flex
        h="34px" align="stretch" borderBottom="1px solid var(--border)"
        bg="var(--bg-panel)" flexShrink={0} px="4px" gap="2px"
      >
        <LeftTabBtn
          active={leftTab === "results"}
          onClick={() => setLeftTab("results")}
          icon={Terminal} label="OUTPUT & AI"
        />
        <LeftTabBtn
          active={leftTab === "diagnostics"}
          onClick={() => setLeftTab("diagnostics")}
          icon={Bug} label="DIAGNOSTICS" badge={totalDiagCount}
        />
        <LeftTabBtn
          active={leftTab === "tree"}
          onClick={() => setLeftTab("tree")}
          icon={GitBranch} label="PARSE TREE"
        />
        {aiResult && leftTab === "tree" && (
          <Flex align="center" ml="auto" pr="8px">
            <Sparkles size={9} color="var(--accent)" opacity={0.7} />
          </Flex>
        )}
      </Flex>

      {/* Panel content */}
      <Box flex={1} overflow="hidden">
        {leftTab === "results" ? (
          <StackedPanes
            top={<OutputPanel result={runResult} isRunning={isRunning} onClear={onClear} />}
            bottom={<AIPanel result={aiResult} isLoading={isAILoading} activeMode={activeMode} onClear={onClear} />}
            defaultTopPercent={48}
          />
        ) : leftTab === "diagnostics" ? (
          <DiagnosticsPanel errors={diagErrors} warnings={diagWarnings} onGoToLine={handleGoToLine} />
        ) : (
          <ParseTreePanel code={code} />
        )}
      </Box>
    </Flex>
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

      {/* System error toasts — rendered outside the split layout so they
          float above everything and are never clipped by overflow:hidden */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </Box>
  );
};