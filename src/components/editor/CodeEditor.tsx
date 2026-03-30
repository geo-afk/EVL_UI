import { Box, Flex, Text } from "@chakra-ui/react";
import {
  Editor,
  type BeforeMount,
  type OnChange,
  type OnMount,
  type OnValidate,
} from "@monaco-editor/react";
import * as Monaco from "monaco-editor";
import { useRef, useState, useCallback } from "react";
import {
  Play,
  Cpu,
  AlertCircle,
  Download,
  Upload,
  TriangleAlert,
  X,
  Wrench,
  BookOpen,
  Link,
  Check,
} from "lucide-react";
import { ReferencePanel } from "./ReferencePanel";
import { setup_eval, updateDiagnostics } from "../../eval/lsp/setup";
import { retrieveCodeDiagnostics } from "../../eval/lsp/validator";
import { EVAL_LANGUAGE_ID } from "../../model/models";
import {
  EDITOR_THEMES,
  DEFAULT_THEME_ID,
  registerAllThemes,
  type EditorTheme,
} from "../../model/editorThemes";
import { ThemeDropdown } from "./EditorTheme";
import { useAutocomplete } from "./useAutocomplete";
import { fetchAIComplete } from "../../api";

// How long the user must stop typing before an autocomplete request fires (ms)
const AUTOCOMPLETE_DEBOUNCE_MS = 600;

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onAIRun: () => void;
  onAIInsights: () => void;
  isAILoading: boolean;
  isRunning?: boolean;
  onShare: () => void;
  onEditorMount?: (
    monaco: typeof Monaco,
    editor: Monaco.editor.IStandaloneCodeEditor,
  ) => void;
}

// ─── Import/Export Feedback Toast ─────────────────────────────────────────────
type ToastState = { message: string; kind: "success" | "error" } | null;

const Toast = ({ toast }: { toast: ToastState }) => {
  if (!toast) return null;
  const isError = toast.kind === "error";
  return (
    <Box
      position="absolute"
      bottom="36px"
      left="50%"
      style={{ transform: "translateX(-50%)", animation: "toastIn 0.2s ease" }}
      zIndex={999}
      px="14px"
      py="8px"
      borderRadius="6px"
      bg={isError ? "#1a0808" : "#081a0e"}
      border={`1px solid ${isError ? "#5a1e1e" : "#1e5a30"}`}
      boxShadow={`0 4px 20px ${isError ? "#f8717130" : "#4ade8030"}`}
      pointerEvents="none"
      whiteSpace="nowrap"
    >
      <Text
        fontSize="11.5px"
        color={isError ? "#f87171" : "#4ade80"}
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontWeight="600"
        letterSpacing="0.04em"
      >
        {toast.message}
      </Text>
    </Box>
  );
};

// ─── Export Error Dialog ──────────────────────────────────────────────────────
interface ExportErrorDialogProps {
  errorCount: number;
  onFix: () => void;
  onExportAnyway: () => void;
  onCancel: () => void;
}

const ExportErrorDialog = ({
  errorCount,
  onFix,
  onExportAnyway,
  onCancel,
}: ExportErrorDialogProps) => (
  <>
    {/* Backdrop */}
    <Box
      position="fixed"
      inset="0"
      zIndex={1000}
      bg="rgba(0,0,0,0.6)"
      style={{
        animation: "backdropIn 0.15s ease",
        backdropFilter: "blur(2px)",
      }}
      onClick={onCancel}
    />

    {/* Dialog */}
    <Box
      position="fixed"
      top="50%"
      left="50%"
      zIndex={1001}
      style={{
        transform: "translate(-50%, -50%)",
        animation: "dialogIn 0.18s ease",
      }}
      bg="var(--bg-panel)"
      border="1px solid #5a1e1e"
      borderRadius="10px"
      boxShadow="0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(248,113,113,0.08)"
      w="340px"
      overflow="hidden"
    >
      {/* Header stripe */}
      <Box h="3px" bg="linear-gradient(90deg, #f87171, #fb923c)" />

      {/* Content */}
      <Box p="20px">
        {/* Title row */}
        <Flex align="flex-start" gap="12px" mb="14px">
          <Box
            w="32px"
            h="32px"
            borderRadius="8px"
            bg="#2d1a1a"
            border="1px solid #5a1e1e"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <TriangleAlert size={15} color="#f87171" />
          </Box>
          <Box>
            <Text
              fontSize="13px"
              fontWeight="700"
              color="var(--text-primary)"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="0.03em"
              mb="4px"
            >
              Export with errors?
            </Text>
            <Text
              fontSize="12px"
              color="var(--text-secondary)"
              lineHeight="1.6"
            >
              Your code has{" "}
              <Text as="span" color="#f87171" fontWeight="600">
                {errorCount} {errorCount === 1 ? "error" : "errors"}
              </Text>
              . Exporting now will save a broken file.
            </Text>
          </Box>

          {/* Close X */}
          <button
            onClick={onCancel}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-ghost)",
              padding: "2px",
              display: "flex",
              flexShrink: 0,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-ghost)")
            }
          >
            <X size={14} />
          </button>
        </Flex>

        {/* Action buttons */}
        <Flex gap="8px">
          {/* Fix errors — primary */}
          <button
            onClick={onFix}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              padding: "8px 14px",
              background: "#16301a",
              border: "1px solid #22543d",
              borderRadius: "7px",
              color: "#4ade80",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              letterSpacing: "0.04em",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "#1a3d20";
              b.style.borderColor = "#2d6a4f";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "#16301a";
              b.style.borderColor = "#22543d";
            }}
          >
            <Wrench size={12} />
            Fix errors
          </button>

          {/* Export anyway — destructive secondary */}
          <button
            onClick={onExportAnyway}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              padding: "8px 14px",
              background: "#2d1a1a",
              border: "1px solid #7f1d1d",
              borderRadius: "7px",
              color: "#f87171",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              letterSpacing: "0.04em",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "#3d1a1a";
              b.style.borderColor = "#b91c1c";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "#2d1a1a";
              b.style.borderColor = "#7f1d1d";
            }}
          >
            <Download size={12} />
            Export anyway
          </button>
        </Flex>
      </Box>
    </Box>

    <style>{`
      @keyframes backdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes dialogIn {
        from { opacity: 0; transform: translate(-50%, -52%) scale(0.97); }
        to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `}</style>
  </>
);

// ─── Toolbar Icon Button ──────────────────────────────────────────────────────
const ToolbarIconBtn = ({
  icon: Icon,
  title,
  onClick,
  disabled = false,
  active = false,
}: {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "30px",
      height: "30px",
      background: active ? "var(--accent-dim)" : "transparent",
      border: `1px solid ${active ? "var(--accent-border)" : "transparent"}`,
      borderRadius: "6px",
      color: active
        ? "var(--accent)"
        : disabled
          ? "var(--text-ghost)"
          : "var(--text-secondary)",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s ease",
      flexShrink: 0,
      opacity: disabled ? 0.4 : 1,
    }}
    onMouseEnter={(e) => {
      if (disabled || active) return;
      const b = e.currentTarget as HTMLButtonElement;
      b.style.background = "var(--bg-elevated)";
      b.style.borderColor = "var(--border)";
      b.style.color = "var(--text-primary)";
    }}
    onMouseLeave={(e) => {
      if (disabled || active) return;
      const b = e.currentTarget as HTMLButtonElement;
      b.style.background = "transparent";
      b.style.borderColor = "transparent";
      b.style.color = "var(--text-secondary)";
    }}
  >
    <Icon size={14} />
  </button>
);

// ─── Main Editor ──────────────────────────────────────────────────────────────
export const CodeEditor = ({
  code,
  onCodeChange,
  onRun,
  onAIInsights,
  isAILoading,
  isRunning = false,
  onShare,
  onEditorMount,
}: CodeEditorProps) => {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<number>(0);
  const [toast, setToast] = useState<ToastState>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeTheme, setActiveTheme] = useState<EditorTheme>(() => {
    const savedId = localStorage.getItem("editorThemeId");
    return (
      EDITOR_THEMES.find((t) => t.id === (savedId ?? DEFAULT_THEME_ID)) ??
      EDITOR_THEMES[0]
    );
  });

  // Debounce timer ref for autocomplete
  const autocompleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autocompleteRequestId = useRef(0);
  const autocompleteAbortController = useRef<AbortController | null>(null);
  // Latest pending inline completion so the provider can read it synchronously
  const pendingCompletion = useRef<string>("");

  const { triggerAutocomplete, getPendingCompletion, clearPendingCompletion } = useAutocomplete(editorRef);

  // ─── Toast helper ──────────────────────────────────────────────────────────
  const showToast = useCallback(
    (message: string, kind: "success" | "error") => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({ message, kind });
      toastTimer.current = setTimeout(() => setToast(null), 2800);
    },
    [],
  );

  // ─── Export (core) ────────────────────────────────────────────────────────
  const doExport = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "program.eval";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported as program.eval", "success");
  }, [code, showToast]);

  // ─── Export (entry — checks errors first) ────────────────────────────────
  const handleExport = useCallback(() => {
    if (!code.trim()) {
      showToast("Nothing to export — editor is empty", "error");
      return;
    }
    if (errors > 0) {
      setShowExportDialog(true);
      return;
    }
    doExport();
  }, [code, errors, doExport, showToast]);

  const handleExportAnyway = useCallback(() => {
    setShowExportDialog(false);
    doExport();
  }, [doExport]);

  const handleFixErrors = useCallback(() => {
    setShowExportDialog(false);
    editorRef.current?.focus();
  }, []);

  // ─── Import (trigger picker) ───────────────────────────────────────────────
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ─── Import (handle file selection) ───────────────────────────────────────
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";

      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".eval")) {
        showToast(
          `"${file.name}" is not a .eval file — import rejected`,
          "error",
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result;
        if (typeof content !== "string") {
          showToast("Failed to read file", "error");
          return;
        }
        onCodeChange(content);
        showToast(`Imported ${file.name}`, "success");
      };
      reader.onerror = () => showToast("Failed to read file", "error");
      reader.readAsText(file);
    },
    [onCodeChange, showToast],
  );

  const handleThemeSelect = (theme: EditorTheme) => {
    setActiveTheme(theme);
    localStorage.setItem("editorThemeId", theme.id);
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme.id);
    }
  };

  const handleEditorChange: OnChange = (value) => {
    onCodeChange(value ?? "");
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    onEditorMount?.(monaco, editor);
    editor.focus();

    registerAllThemes(monaco);
    monaco.editor.setTheme(activeTheme.id);

    // Ctrl+Enter → Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    // Ctrl+Shift+/ → Quick reference
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Slash,
      () => {
        setShowRef((v) => !v);
      },
    );

    // Ctrl+Shift+S → Share
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS,
      () => {
        onShare();
      },
    );

    // ── Diagnostics + debounced autocomplete prefetch ─────────────────────
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      updateDiagnostics(value, monaco);
      retrieveCodeDiagnostics(value, monaco, editor);

      const model = editor.getModel();
      if (model) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });

        const errCount = markers.filter(
          (m: Monaco.editor.IMarker) =>
            m.severity === monaco.MarkerSeverity.Error,
        ).length;

        const warnCount = markers.filter(
          (m: Monaco.editor.IMarker) =>
            m.severity === monaco.MarkerSeverity.Warning,
        ).length;
        setErrors(errCount + warnCount);
      }

      if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current);
      autocompleteRequestId.current += 1;

      autocompleteAbortController.current?.abort();
      autocompleteAbortController.current = new AbortController();
      pendingCompletion.current = "";

      const position = editor.getPosition();
      if (position) {
        const currentModel = editor.getModel();
        if (currentModel) {
          const lineText = currentModel
            .getLineContent(position.lineNumber)
            .substring(0, position.column - 1)
            .trim();
          triggerAutocomplete(lineText);
        }
      }
    });

    // ── Inline completions provider ───────────────────────────────────────
    monaco.languages.registerInlineCompletionsProvider(EVAL_LANGUAGE_ID, {
      provideInlineCompletions: (
        _model: Monaco.editor.ITextModel,
        position: Monaco.Position,
      ) => {
        const completion = getPendingCompletion();
        if (!completion) return { items: [] };

        return {
          items: [
            {
              insertText: completion,
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              },
            },
          ],
        };
      },
      freeInlineCompletions: () => {
        clearPendingCompletion();
      },
      disposeInlineCompletions: () => {},
    });
  };

  const handleEditorWillMount: BeforeMount = (monaco) => {
    setup_eval(monaco);
    registerAllThemes(monaco);
  };

  const handleEditorValidation: OnValidate = () => {};

  return (
    <Flex direction="column" h="100%" bg="var(--bg-base)" position="relative">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".eval"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Export error confirmation dialog */}
      {showExportDialog && (
        <ExportErrorDialog
          errorCount={errors}
          onFix={handleFixErrors}
          onExportAnyway={handleExportAnyway}
          onCancel={() => setShowExportDialog(false)}
        />
      )}

      {/* Editor Toolbar */}
      <Flex
        h="44px"
        align="center"
        px="14px"
        gap="10px"
        borderBottom="1px solid var(--border)"
        flexShrink={0}
      >
        {/* Theme Selector */}
        <ThemeDropdown
          currentTheme={activeTheme}
          onSelect={handleThemeSelect}
        />

        {/* Import / Export */}
        <Box w="1px" h="20px" bg="var(--border-subtle)" flexShrink={0} />
        <ToolbarIconBtn
          icon={Upload}
          title="Import .eval file"
          onClick={handleImportClick}
        />
        <ToolbarIconBtn
          icon={Download}
          title="Export as .eval file"
          onClick={handleExport}
          disabled={!code.trim()}
        />

        {/* Quick Reference + Parse Tree */}
        <Box w="1px" h="20px" bg="var(--border-subtle)" flexShrink={0} />
        <ToolbarIconBtn
          icon={BookOpen}
          title="Quick Reference (Ctrl+Shift+/)"
          onClick={() => setShowRef((v) => !v)}
          active={showRef}
        />

        {/* Share button */}
        <button
          onClick={() => {
            onShare();
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2200);
          }}
          disabled={!code.trim()}
          title="Copy shareable link (Ctrl+Shift+S)"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            width: "30px",
            height: "30px",
            background: shareCopied ? "rgba(74,222,128,0.1)" : "transparent",
            border: `1px solid ${shareCopied ? "rgba(74,222,128,0.35)" : "transparent"}`,
            borderRadius: "6px",
            color: shareCopied ? "#4ade80" : "var(--text-secondary)",
            cursor: !code.trim() ? "not-allowed" : "pointer",
            opacity: !code.trim() ? 0.4 : 1,
            transition: "all 0.15s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!code.trim() || shareCopied) return;
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "var(--bg-elevated)";
            b.style.borderColor = "var(--border)";
            b.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            if (shareCopied) return;
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "transparent";
            b.style.borderColor = "transparent";
            b.style.color = "var(--text-secondary)";
          }}
        >
          {shareCopied ? <Check size={14} /> : <Link size={14} />}
        </button>

        <Box flex="1" />

        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={errors > 0 || isRunning || !code.trim()}
          title="Run code (Ctrl+Enter)"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 14px",
            background: errors > 0 ? "#2d1a1a" : "#16301a",
            border: `1px solid ${errors > 0 ? "#7f1d1d" : "#22543d"}`,
            borderRadius: "6px",
            color: errors > 0 ? "#f87171" : "#4ade80",
            fontSize: "12px",
            fontWeight: "600",
            cursor: errors > 0 || isRunning ? "not-allowed" : "pointer",
            letterSpacing: "0.04em",
            transition: "all 0.15s ease",
            opacity: isRunning ? 0.7 : 1,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
          onMouseEnter={(e) => {
            if (errors > 0 || isRunning) return;
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "#1a3d20";
            b.style.borderColor = "#2d6a4f";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = errors > 0 ? "#2d1a1a" : "#16301a";
            b.style.borderColor = errors > 0 ? "#7f1d1d" : "#22543d";
          }}
        >
          {errors > 0 ? (
            <AlertCircle size={12} fill="#f87171" color="#f87171" />
          ) : isRunning ? (
            <Cpu size={12} color="#4ade80" style={{ opacity: 0.7 }} />
          ) : (
            <Play size={12} fill="#4ade80" color="#4ade80" />
          )}
          {errors > 0
            ? `FIX: ${errors} error${errors === 1 ? "" : "s"}`
            : isRunning
              ? "Running..."
              : "Run code (Ctrl+Enter)"}
        </button>

        {/* Divider */}
        <Box w="1px" h="20px" bg="#2a2a38" />

        {/* AI Insights Button */}
        <button
          onClick={onAIInsights}
          disabled={isAILoading}
          title="Get AI insights and analysis on your code"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 14px",
            background: isAILoading
              ? "var(--bg-surface)"
              : "var(--accent2-dim)",
            border: `1px solid ${
              isAILoading ? "var(--border)" : "var(--accent2-border)"
            }`,
            borderRadius: "6px",
            color: isAILoading ? "var(--text-muted)" : "var(--accent2)",
            fontSize: "12px",
            fontWeight: "600",
            cursor: isAILoading ? "not-allowed" : "pointer",
            letterSpacing: "0.04em",
            transition: "all 0.15s ease",
            opacity: isAILoading ? 0.6 : 1,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
          onMouseEnter={(e) => {
            if (!isAILoading)
              (e.currentTarget as HTMLButtonElement).style.filter =
                "brightness(1.2)";
          }}
          onMouseLeave={(e) => {
            if (!isAILoading)
              (e.currentTarget as HTMLButtonElement).style.filter = "";
          }}
        >
          <Cpu size={12} />
          AI INSIGHTS
        </button>
      </Flex>

      {/* Monaco Editor */}
      <Box flex="1" overflow="hidden">
        <Editor
          height="100%"
          theme={activeTheme.id}
          language={EVAL_LANGUAGE_ID}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          beforeMount={handleEditorWillMount}
          onValidate={handleEditorValidation}
          options={{
            fontSize: 14,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace",
            fontLigatures: true,
            lineHeight: 22,
            padding: { top: 16, bottom: 16 },
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "phase",
            cursorSmoothCaretAnimation: "on",
            renderLineHighlight: "line",
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            suggest: {
              showIcons: true,
            },
            inlineSuggest: {
              enabled: true,
            },
          }}
        />
      </Box>

      {/* Quick Reference Panel — slides in from the right over the editor */}
      <ReferencePanel isOpen={showRef} onClose={() => setShowRef(false)} />

      {/* Bottom status bar */}
      <Flex
        h="24px"
        align="center"
        px="14px"
        borderTop="1px solid var(--border)"
        flexShrink={0}
        gap="8px"
      >
        <Text
          fontSize="10px"
          color="var(--text-ghost)"
          fontFamily="monospace"
          letterSpacing="0.05em"
        >
          · Ctrl+Enter to run · Ctrl+Shift+/ for reference · Ctrl+Shift+T for
          parse tree · Ctrl+Shift+S to share
        </Text>
        {isRunning && (
          <Text
            fontSize="10px"
            color="var(--accent)"
            fontFamily="monospace"
            letterSpacing="0.05em"
          >
            · running...
          </Text>
        )}
      </Flex>

      {/* Toast notification */}
      <Toast toast={toast} />

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </Flex>
  );
};
