import { Box, Flex, Text } from "@chakra-ui/react";
import { Cpu, Loader, Trash2, Zap, Eye } from "lucide-react";

interface AIResult {
  content?: string;
  error?: string;
}

interface AIPanelProps {
  result: AIResult | null;
  isLoading: boolean;
  activeMode: "run" | "insights" | null;
  onClear: () => void;
}

// Very lightweight "renderer" for the AI markdown output
function renderAIContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        // Close code block
        inCodeBlock = false;
        elements.push(
          <Box
            key={`code-${i}`}
            bg="#0a0a0f"
            border="1px solid #1e1e28"
            borderRadius="6px"
            p="10px 14px"
            my="6px"
            overflow="auto"
          >
            {codeLang && (
              <Text
                fontSize="10px"
                color="#4a4a5e"
                letterSpacing="0.06em"
                mb="4px"
                fontFamily="monospace"
              >
                {codeLang.toUpperCase()}
              </Text>
            )}
            {codeLines.map((cl, ci) => (
              <Text
                key={ci}
                fontSize="12.5px"
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                color="#d4d4e8"
                whiteSpace="pre"
                lineHeight="1.7"
              >
                {cl}
              </Text>
            ))}
          </Box>,
        );
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Bold headers like **Output:** or **Strengths:**
    if (line.startsWith("**") && line.includes("**")) {
      const match = line.match(/^\*\*(.+?)\*\*(.*)/);
      if (match) {
        elements.push(
          <Flex
            key={i}
            align="baseline"
            gap="6px"
            mt={i > 0 ? "12px" : "0"}
            mb="4px"
          >
            <Text
              fontSize="11px"
              fontWeight="700"
              color="#fb923c"
              letterSpacing="0.08em"
              fontFamily="monospace"
            >
              {match[1].toUpperCase()}
            </Text>
            {match[2] && (
              <Text fontSize="12.5px" color="#d4d4e8">
                {match[2]}
              </Text>
            )}
          </Flex>,
        );
        return;
      }
    }

    // Bullet points
    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <Flex key={i} align="flex-start" gap="8px" pl="4px">
          <Text color="#3a3a4e" flexShrink={0} mt="2px" fontSize="10px">
            ▸
          </Text>
          <Text fontSize="12.5px" color="#b4b4c8" lineHeight="1.7">
            {line.slice(2)}
          </Text>
        </Flex>,
      );
      return;
    }

    if (line === "") {
      elements.push(<Box key={i} h="4px" />);
      return;
    }

    elements.push(
      <Text key={i} fontSize="12.5px" color="#b4b4c8" lineHeight="1.7">
        {line}
      </Text>,
    );
  });

  return elements;
}

const ModeIcon = ({ mode }: { mode: "run" | "insights" | null }) => {
  if (mode === "run") return <Zap size={12} color="#fb923c" />;
  if (mode === "insights") return <Eye size={12} color="#7dd3fc" />;
  return <Cpu size={12} color="#4a4a5e" />;
};

export const AIPanel = ({
  result,
  isLoading,
  activeMode,
  onClear,
}: AIPanelProps) => {
  const modeLabel =
    activeMode === "run"
      ? "AI RUN"
      : activeMode === "insights"
        ? "AI INSIGHTS"
        : "AI";

  const hasContent = result && (result.content || result.error);

  return (
    <Flex direction="column" h="100%" bg="#0a0a0f">
      {/* Header */}
      <Flex
        h="36px"
        align="center"
        px="14px"
        gap="8px"
        borderBottom="1px solid #1e1e28"
        flexShrink={0}
        justify="space-between"
      >
        <Flex align="center" gap="6px">
          <ModeIcon mode={activeMode} />
          <Text
            fontSize="11px"
            fontWeight="600"
            color={
              activeMode === "run"
                ? "#fb923c"
                : activeMode === "insights"
                  ? "#7dd3fc"
                  : "#4a4a5e"
            }
            letterSpacing="0.08em"
            fontFamily="monospace"
            transition="color 0.2s"
          >
            {modeLabel}
          </Text>
          {isLoading && (
            <Box animation="spin 1s linear infinite" display="flex" ml="4px">
              <Loader size={11} color="#fb923c" />
            </Box>
          )}
        </Flex>

        {hasContent && !isLoading && (
          <button
            onClick={onClear}
            title="Clear AI results"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#3a3a4e",
              padding: "2px",
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#6a6a7e")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#3a3a4e")
            }
          >
            <Trash2 size={12} />
          </button>
        )}
      </Flex>

      {/* Content */}
      <Box flex="1" overflow="auto" p="12px">
        {isLoading && (
          <Flex direction="column" gap="8px">
            {[70, 90, 55, 80].map((w, i) => (
              <Box
                key={i}
                h="12px"
                w={`${w}%`}
                bg="#1a1a22"
                borderRadius="4px"
                style={{
                  animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </Flex>
        )}

        {!isLoading && !hasContent && (
          <Flex
            direction="column"
            gap="6px"
            align="flex-start"
            justify="center"
            h="100%"
          >
            <Text color="#2a2a38" fontSize="12px" fontFamily="monospace">
              // Use AI RUN to simulate execution
            </Text>
            <Text color="#2a2a38" fontSize="12px" fontFamily="monospace">
              // Use AI INSIGHTS to analyze your code
            </Text>
          </Flex>
        )}

        {!isLoading && result?.error && (
          <Flex
            gap="8px"
            bg="#1a0808"
            border="1px solid #3a1010"
            borderRadius="6px"
            p="10px 14px"
          >
            <Text
              color="#f87171"
              fontSize="12.5px"
              fontFamily="monospace"
              whiteSpace="pre-wrap"
            >
              {result.error}
            </Text>
          </Flex>
        )}

        {!isLoading && result?.content && (
          <Box>{renderAIContent(result.content)}</Box>
        )}
      </Box>

      {/* Inline animation styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </Flex>
  );
};
