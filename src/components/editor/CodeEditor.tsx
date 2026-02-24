import { Box, Flex, Text } from "@chakra-ui/react";
import {
  Editor,
  type BeforeMount,
  type OnChange,
  type OnMount,
  type OnValidate,
} from "@monaco-editor/react";
import * as Monaco from "monaco-editor";
import { useRef, useState } from "react";
import { Play, Cpu } from "lucide-react";
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

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onAIRun: () => void;
  onAIInsights: () => void;
  isAILoading: boolean;
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
export const CodeEditor = ({
  code,
  onCodeChange,
  onRun,
  onAIRun,
  onAIInsights,
  isAILoading,
}: CodeEditorProps) => {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const [errors, setErrors] = useState<number>(0);
  const [activeTheme, setActiveTheme] = useState<EditorTheme>(
    () =>
      EDITOR_THEMES.find((t) => t.id === DEFAULT_THEME_ID) ?? EDITOR_THEMES[0],
  );

  const handleThemeSelect = (theme: EditorTheme) => {
    setActiveTheme(theme);
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
    editor.focus();

    // Register all themes now that monaco is available
    registerAllThemes(monaco);
    monaco.editor.setTheme(activeTheme.id);

    // Custom keybinding: Cmd/Ctrl+Enter to run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      updateDiagnostics(value, monaco);
      retrieveCodeDiagnostics(value, monaco, editor);

      const model = editor.getModel();
      if (model) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        const err = markers.filter(
          (m: { severity: any }) => m.severity === monaco.MarkerSeverity.Error,
        );
        const warnings = markers.filter(
          (m: { severity: any }) =>
            m.severity === monaco.MarkerSeverity.Warning,
        );
        setErrors(err.length + warnings.length);
      }
    });
  };

  const handleEditorWillMount: BeforeMount = (monaco) => {
    setup_eval(monaco);
    registerAllThemes(monaco);
  };

  const handleEditorValidation: OnValidate = () => {};

  return (
    <Flex direction="column" h="100%" bg="var(--bg-base)">
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

        <Box flex="1" />

        {/* Run Button */}
        <button
          onClick={onRun}
          title="Run code (Ctrl+Enter)"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 14px",
            background: "#16301a",
            border: "1px solid #22543d",
            borderRadius: "6px",
            color: "#4ade80",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            letterSpacing: "0.04em",
            transition: "all 0.15s ease",
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1a3d20";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#2d6a4f";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#16301a";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#22543d";
          }}
        >
          {" "}
          <Play size={12} fill="#4ade80" />
          {errors ? "RUN" : "NO"}
        </button>

        {/* Divider */}
        <Box w="1px" h="20px" bg="#2a2a38" />

        {/* AI Run Button */}
        <button
          onClick={onAIRun}
          disabled={isAILoading}
          title="Ask AI to simulate running this code"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 14px",
            background: isAILoading ? "var(--bg-surface)" : "var(--accent-dim)",
            border: `1px solid ${
              isAILoading ? "var(--border)" : "var(--accent-border)"
            }`,
            borderRadius: "6px",
            color: isAILoading ? "var(--text-muted)" : "var(--accent)",
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
          AI RUN
        </button>

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
          }}
        />
      </Box>
      {/* Bottom status bar */}
      <Flex
        h="24px"
        align="center"
        px="14px"
        borderTop="1px solid var(--border)"
        flexShrink={0}
      >
        <Text
          fontSize="10px"
          color="var(--text-ghost)"
          fontFamily="monospace"
          letterSpacing="0.05em"
        >
          · Ctrl+Enter to run
        </Text>
      </Flex>{" "}
    </Flex>
  );
};
