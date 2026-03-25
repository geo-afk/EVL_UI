import { useState, useCallback, useEffect, useRef } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { Terminal, Sparkles, GitBranch } from "lucide-react";
import { CodeEditor } from "../components/editor/CodeEditor";
import { OutputPanel } from "../components/panels/OutputPanel";
import { AIPanel } from "../components/panels/AIPanel";
import { ParseTreePanel } from "../components/panels/ParseTreePanel";
import { SplitLayout } from "../components/layout/SplitLayout";
import { StackedPanes } from "../components/layout/StackedPanes";
import { AnalysisResponse, EVAL_SAMPLE } from "../model/models";
import { fetchAIInsights, fetchRunCode } from "../api";
import { setError } from "../eval/lsp/setup";
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
const STORAGE_KEY_RUN = "eval_output_result";
const STORAGE_KEY_AI = "eval_ai_result";
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

// ─── Left-panel tab ids ───────────────────────────────────────────────────────
type LeftTab = "results" | "tree";

// ─── Tab button component ─────────────────────────────────────────────────────
function LeftTabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
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
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--text-secondary)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--text-muted)";
      }}
    >
      <Icon size={11} />
      {label}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export const EditorPage = () => {
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  const monacoRef = useRef<typeof Monaco | null>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount = useCallback(
    (monaco: typeof Monaco, editor: Monaco.editor.IStandaloneCodeEditor) => {
      monacoRef.current = monaco;
      editorRef.current = editor;
    },
    [],
  );

  // Priority order for initial code:
  //   1. URL hash  (shareable link — highest priority)
  //   2. Router state  (coming from Learn page "Try in Editor")
  //   3. sessionStorage  (persisted from last edit session)
  //   4. Default sample code
  const hashCode = readHashCode();
  const incomingCode = hashCode ?? locationState?.code ?? null;

  const [code, setCode] = useState<string>(() => {
    if (incomingCode) return incomingCode;
    return readSession<string>(STORAGE_KEY_CODE) ?? EVAL_SAMPLE.defaultCode;
  });

  // Rehydrate panels from sessionStorage so output survives page navigation
  const [runResult, setRunResult] = useState<CodeRunResult | null>(() =>
    readSession(STORAGE_KEY_RUN),
  );
  const [aiResult, setAiResult] = useState<AIResult | null>(() =>
    readSession(STORAGE_KEY_AI),
  );
  const [activeMode, setActiveMode] = useState<"run" | "insights" | null>(() =>
    readSession(STORAGE_KEY_MODE),
  );

  const [isRunning, setIsRunning] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  // Left panel tab state
  const [leftTab, setLeftTab] = useState<LeftTab>("results");

  // Persist code changes so they survive navigation
  useEffect(() => {
    writeSession(STORAGE_KEY_CODE, code);
  }, [code]);

  // Clear incoming code sources from the URL / history
  useEffect(() => {
    if (hashCode) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    } else if (locationState?.code) {
      window.history.replaceState({}, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunResult(null);
    setAiResult(null);
    setActiveMode(null);
    clearSession(STORAGE_KEY_RUN, STORAGE_KEY_AI, STORAGE_KEY_MODE);

    // Switch to the results tab so the user sees the output
    setLeftTab("results");

    try {
      const analysis = await fetchRunCode(code);

      if (analysis.has_errors && monacoRef.current) {
        setError(analysis.errors, monacoRef.current);
      }

      const result = toRunResult(analysis);
      setRunResult(result);
      writeSession(STORAGE_KEY_RUN, result);

      sessionStorage.setItem(
        "eval_last_debug",
        JSON.stringify({ analysis, code }),
      );
    } catch (err) {
      const result: CodeRunResult = {
        logs: [],
        error:
          err instanceof Error
            ? err.message
            : "Network error — is the backend running?",
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
    setLeftTab("results");

    try {
      const data = await fetchAIInsights(code);
      const result = { content: data.content };
      setAiResult(result);
      writeSession(STORAGE_KEY_AI, result);
    } catch (err) {
      const result = {
        error:
          err instanceof Error
            ? err.message
            : "Network error — is the backend running?",
      };
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
    setLeftTab("results");

    try {
      const data = await fetchAIInsights(code);
      const result = { content: data.content };
      setAiResult(result);
      writeSession(STORAGE_KEY_AI, result);
    } catch (err) {
      const result = {
        error:
          err instanceof Error
            ? err.message
            : "Network error — is the backend running?",
      };
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
    const hash = encodeCodeToHash(code);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    window.history.replaceState(null, "", `#${hash}`);
    navigator.clipboard.writeText(url).catch(() => {});
  }, [code]);

  // ── Layout ───────────────────────────────────────────────────────────────────
  const leftPanel = (
    <Flex direction="column" h="100%">
      {/* ── Tab bar ── */}
      <Flex
        h="34px"
        align="stretch"
        borderBottom="1px solid var(--border)"
        bg="var(--bg-panel)"
        flexShrink={0}
        px="4px"
        gap="2px"
      >
        <LeftTabBtn
          active={leftTab === "results"}
          onClick={() => setLeftTab("results")}
          icon={Terminal}
          label="OUTPUT & AI"
        />
        <LeftTabBtn
          active={leftTab === "tree"}
          onClick={() => setLeftTab("tree")}
          icon={GitBranch}
          label="PARSE TREE"
        />

        {/* right-side badge when run result is present */}
        {runResult && leftTab !== "results" && (
          <Flex align="center" ml="auto" pr="8px">
            <Box
              w="6px"
              h="6px"
              borderRadius="50%"
              bg={
                runResult.error ? "rgba(239,68,68,0.8)" : "rgba(34,197,94,0.8)"
              }
              boxShadow={
                runResult.error
                  ? "0 0 6px rgba(239,68,68,0.5)"
                  : "0 0 6px rgba(34,197,94,0.5)"
              }
              title={
                runResult.error ? "Run finished with errors" : "Run finished"
              }
            />
          </Flex>
        )}

        {/* right-side badge when AI result is present */}
        {aiResult && !runResult && leftTab !== "results" && (
          <Flex align="center" ml="auto" pr="8px">
            <Sparkles size={9} color="var(--accent)" opacity={0.7} />
          </Flex>
        )}
      </Flex>

      {/* ── Panel content ── */}
      <Box flex={1} overflow="hidden">
        {leftTab === "results" ? (
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
    </Box>
  );
};

// ─── Unused import guard (keeps TS happy for Sparkles) ────────────────────────
void Text;

