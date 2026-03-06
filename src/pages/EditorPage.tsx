import { useState, useCallback } from "react";
import { Box } from "@chakra-ui/react";
import { CodeEditor } from "../components/editor/CodeEditor";
import { OutputPanel } from "../components/panels/OutputPanel";
import { AIPanel } from "../components/panels/AIPanel";
import { SplitLayout } from "../components/layout/SplitLayout";
import { StackedPanes } from "../components/layout/StackedPanes";
import { EVAL_SAMPLE } from "../model/models";
import { fetchAIInsights } from "../api";

interface AIResult {
  content?: string;
  error?: string;
}

export const EditorPage = () => {
  const [code, setCode] = useState(EVAL_SAMPLE.defaultCode);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [activeMode, setActiveMode] = useState<"run" | "insights" | null>(null);

  // const handleLanguageChange = () => {
  //   setCode(EVAL_SAMPLE.defaultCode);
  // };

  const handleRun = useCallback(() => {}, []);

  const handleAIRun = useCallback(async () => {
    if (isAILoading) return;
    setIsAILoading(true);
    setActiveMode("run");
    setAiResult(null);
    try {
      const data = await fetchAIInsights(code);
      setAiResult({ content: data.content });
    } catch (err) {
      setAiResult({ error: err instanceof Error ? err.message : "Network error — is the backend running?" });
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
      setAiResult({ error: err instanceof Error ? err.message : "Network error — is the backend running?" });
    } finally {
      setIsAILoading(false);
    }
  }, [code, isAILoading]);

  const onClear = useCallback(() => {
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