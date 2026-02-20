import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { CodeEditor } from "../components/editor/CodeEditor";
import { OutputPanel } from "../components/panels/OutputPanel";
import { AIPanel } from "../components/panels/AIPanel";
import { SplitLayout } from "../components/layout/SplitLayout";
import { StackedPanes } from "../components/layout/StackedPanes";
import { EVAL_SAMPLE } from "../model/models";

export const EditorPage = () => {
  const [code, setCode] = useState(EVAL_SAMPLE.defaultCode);

  const handleLanguageChange = () => {
    setCode(EVAL_SAMPLE.defaultCode);
  };

  const handleRun = () => {};

  const handleAIRun = () => {};

  const handleAIInsights = () => {};
  const onClear = () => {};
  const isAILoading = () => {
    return true;
  };

  const leftPanel = (
    <StackedPanes
      top={<OutputPanel result={null} isRunning={false} onClear={onClear} />}
      bottom={
        <AIPanel
          result={null}
          isLoading={true}
          activeMode="insights"
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
      onLanguageChange={handleLanguageChange}
      onRun={handleRun}
      onAIRun={handleAIRun}
      onAIInsights={handleAIInsights}
      isAILoading={isAILoading()}
    />
  );

  return (
    <Box h="100%" bg="#0e0e12">
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
