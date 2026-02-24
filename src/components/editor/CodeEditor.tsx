import { Box, Flex, Text } from "@chakra-ui/react";
import {
  Editor,
  type BeforeMount,
  type OnChange,
  type OnMount,
  type OnValidate,
} from "@monaco-editor/react";
import draculaTheme from "@/assets/themes/Dracula.json?raw";
import * as Monaco from "monaco-editor";
import type { editor as MonacoEditor } from "monaco-editor";
import { useRef, useState } from "react";
import { Play, Cpu } from "lucide-react";
import { setup_eval, updateDiagnostics } from "../../eval/lsp/setup";
import { retrieveCodeDiagnostics } from "../../eval/lsp/validator";
import { EVAL_LANGUAGE_ID } from "../../model/models";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onAIRun: () => void;
  onAIInsights: () => void;
  isAILoading: boolean;
}

export const CodeEditor = ({
  code,
  onCodeChange,
  onRun,
  onAIRun,
  onAIInsights,
  isAILoading,
}: CodeEditorProps) => {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [errors, setErrors] = useState<number>(0);

  /* ----------------------- */
  /* Editor lifecycle hooks  */
  /* ----------------------- */

  const handleEditorWillMount: BeforeMount = (monaco) => {
    // Language + LSP setup
    setup_eval(monaco);

    // Register Dracula theme EARLY
    monaco.editor.defineTheme("dracula", JSON.parse(draculaTheme));

    // Register custom dark theme EARLY
    monaco.editor.defineTheme("devforge-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "4a4a5e", fontStyle: "italic" },
        { token: "keyword", foreground: "fb923c" },
        { token: "string", foreground: "86efac" },
        { token: "number", foreground: "7dd3fc" },
        { token: "type", foreground: "c4b5fd" },
        { token: "function", foreground: "fde68a" },
      ],
      colors: {
        "editor.background": "#0e0e12",
        "editor.foreground": "#d4d4e8",
        "editorLineNumber.foreground": "#2e2e3e",
        "editorLineNumber.activeForeground": "#fb923c",
        "editor.lineHighlightBackground": "#141420",
        "editorCursor.foreground": "#fb923c",
        "editor.selectionBackground": "#fb923c28",
        "editorGutter.background": "#0e0e12",
        "editorWidget.background": "#16161e",
        "editorSuggestWidget.background": "#16161e",
        "editorSuggestWidget.border": "#2a2a38",
        "editorSuggestWidget.selectedBackground": "#1e1e2e",
      },
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    // Cmd/Ctrl + Enter to run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRun);

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      updateDiagnostics(value, monaco);
      retrieveCodeDiagnostics(value, monaco, editor);

      const model = editor.getModel();
      if (!model) return;

      const markers = monaco.editor.getModelMarkers({
        resource: model.uri,
      });

      const err = markers.filter(
        (m: MonacoEditor.IMarker) =>
          m.severity === monaco.MarkerSeverity.Error
      );

      const warnings = markers.filter(
        (m: MonacoEditor.IMarker) =>
          m.severity === monaco.MarkerSeverity.Warning
      );

      setErrors(err.length + warnings.length);
    });
  };

  const handleEditorChange: OnChange = (value) => {
    onCodeChange(value ?? "");
  };

  const handleEditorValidation: OnValidate = () => {};

  /* ----------------------- */
  /* Render                 */
  /* ----------------------- */

  return (
    <Flex direction="column" h="100%" bg="#0e0e12">
      {/* Toolbar */}
      <Flex
        h="44px"
        align="center"
        px="14px"
        gap="10px"
        borderBottom="1px solid #1e1e28"
        flexShrink={0}
      >
        <Box flex="1" />

        {/* Run */}
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
          }}
        >
          <Play size={12} />
          {errors ? "RUN" : "NO"}
        </button>

        <Box w="1px" h="20px" bg="#2a2a38" />

        {/* AI Run */}
        <button
          onClick={onAIRun}
          disabled={isAILoading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 14px",
            background: "#2a1c0e",
            border: "1px solid #7c3300",
            borderRadius: "6px",
            color: "#fb923c",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            opacity: isAILoading ? 0.6 : 1,
          }}
        >
          <Cpu size={12} />
          AI RUN
        </button>

        {/* AI Insights */}
        <button
          onClick={onAIInsights}
          disabled={isAILoading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 14px",
            background: "#0e1a2a",
            border: "1px solid #1e4976",
            borderRadius: "6px",
            color: "#7dd3fc",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            opacity: isAILoading ? 0.6 : 1,
          }}
        >
          <Cpu size={12} />
          AI INSIGHTS
        </button>
      </Flex>

      {/* Editor */}
      <Box flex="1" overflow="hidden">
        <Editor
          height="100%"
          theme="dracula"
          language={EVAL_LANGUAGE_ID}
          value={code}
          onChange={handleEditorChange}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          onValidate={handleEditorValidation}
          options={{
            fontSize: 14,
            fontFamily:
              "'JetBrains Mono','Fira Code','Cascadia Code','Courier New',monospace",
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
            folding: true,
          }}
        />
      </Box>

      {/* Footer */}
      <Flex
        h="24px"
        align="center"
        px="14px"
        borderTop="1px solid #1e1e28"
      >
        <Text
          fontSize="10px"
          color="#2e2e3e"
          fontFamily="monospace"
          letterSpacing="0.05em"
        >
          Ctrl+Enter to run
        </Text>
      </Flex>
    </Flex>
  );
};