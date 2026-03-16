import { useState, useCallback } from "react";
import { Box } from "@chakra-ui/react";
import { CodeEditor } from "../components/editor/CodeEditor";
import { OutputPanel } from "../components/panels/OutputPanel";
import { AIPanel } from "../components/panels/AIPanel";
import { SplitLayout } from "../components/layout/SplitLayout";
import { StackedPanes } from "../components/layout/StackedPanes";
import { AnalysisResponse, EVAL_SAMPLE } from "../model/models";
import { fetchAIInsights, fetchRunCode } from "../api";

interface AIResult {
  content?: string;
  error?: string;
}

interface CodeRunResult {
  logs: string[];
  error?: string;
  returnValue?: string;
}

function toRunResult(analysis: AnalysisResponse): CodeRunResult {
  // Collect every output line emitted across all steps, then deduplicate
  // against the top-level output array (the server may already unify them).
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

export const EditorPage = () => {
  const [code, setCode] = useState(EVAL_SAMPLE.defaultCode);

  // Run state
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null);

  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [activeMode, setActiveMode] = useState<"run" | "insights" | null>(null);

  // const handleLanguageChange = () => {
  //   setCode(EVAL_SAMPLE.defaultCode);
  // };

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunResult(null);
    setAiResult(null);
    setActiveMode(null);
    try {
      const analysis = await fetchRunCode(code);
      // Show output here
      setRunResult(toRunResult(analysis));
      // Quietly persist for the Debugger page
      sessionStorage.setItem(
        "eval_last_debug",
        JSON.stringify({ analysis, code }),
      );
    } catch (err) {
      setRunResult({
        logs: [],
        error:
          err instanceof Error
            ? err.message
            : "Network error — is the backend running?",
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning]);

  const handleAIRun = useCallback(async () => {
    if (isAILoading) return;
    setIsAILoading(true);
    setActiveMode("run");
    setAiResult(null);
    try {
      const data = await fetchAIInsights(code);
      setAiResult({ content: data.content });
    } catch (err) {
      setAiResult({
        error:
          err instanceof Error
            ? err.message
            : "Network error — is the backend running?",
      });
    } finally {
      setIsAILoading(false);
    }
  }, [code, isAILoading]);

  const handleAIInsights = useCallback(async () => {
    if (isAILoading) return;
    setIsAILoading(true);
    setActiveMode("insights");
    setAiResult(null);
    try {
      const data = await fetchAIInsights(code);
      setAiResult({ content: data.content });
    } catch (err) {
      setAiResult({
        error:
          err instanceof Error
            ? err.message
            : "Network error — is the backend running?",
      });
    } finally {
      setIsAILoading(false);
    }
  }, [code, isAILoading]);

  const onClear = useCallback(() => {
    setRunResult(null);
    setAiResult(null);
    setActiveMode(null);
  }, []);

  const leftPanel = (
    <StackedPanes
      top={<OutputPanel result={null} isRunning={false} onClear={onClear} />}
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

