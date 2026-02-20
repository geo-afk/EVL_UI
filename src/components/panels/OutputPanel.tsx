import { Box, Flex, Text } from "@chakra-ui/react";
import { Terminal, CircleAlert, Trash2 } from "lucide-react";

interface CodeRunResult {
  logs: string[];
  error?: string;
  returnValue?: string;
}

interface OutputPanelProps {
  result: CodeRunResult | null;
  isRunning: boolean;
  onClear: () => void;
}

export const OutputPanel = ({
  result,
  isRunning,
  onClear,
}: OutputPanelProps) => {
  const hasOutput =
    result && (result.logs.length > 0 || result.error || result.returnValue);

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
          <Terminal size={12} color="#4a4a5e" />
          <Text
            fontSize="11px"
            fontWeight="600"
            color="#4a4a5e"
            letterSpacing="0.08em"
            fontFamily="monospace"
          >
            OUTPUT
          </Text>
          {result && !result.error && (
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg="#4ade80"
              ml="4px"
              boxShadow="0 0 6px #4ade8080"
            />
          )}
          {result?.error && (
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg="#f87171"
              ml="4px"
              boxShadow="0 0 6px #f8717180"
            />
          )}
        </Flex>

        {hasOutput && (
          <button
            onClick={onClear}
            title="Clear output"
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
      <Box
        flex="1"
        overflow="auto"
        p="12px"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="12.5px"
        lineHeight="1.7"
      >
        {isRunning && (
          <Text color="#4a4a5e" fontStyle="italic">
            Running...
          </Text>
        )}

        {!isRunning && !hasOutput && (
          <Text color="#2a2a38" userSelect="none">
            // Output will appear here
          </Text>
        )}

        {result?.logs.map((log, i) => (
          <Text
            key={i}
            color={
              log.startsWith("[WARN]")
                ? "#fde68a"
                : log.startsWith("[ERROR]")
                  ? "#f87171"
                  : "#d4d4e8"
            }
            whiteSpace="pre-wrap"
            wordBreak="break-word"
          >
            {log}
          </Text>
        ))}

        {result?.returnValue !== undefined && (
          <Flex align="flex-start" gap="8px" mt="4px">
            <Text color="#4a4a5e" flexShrink={0}>
              ←
            </Text>
            <Text color="#c4b5fd" whiteSpace="pre-wrap" wordBreak="break-word">
              {result.returnValue}
            </Text>
          </Flex>
        )}

        {result?.error && (
          <Flex
            gap="8px"
            bg="#1a0808"
            border="1px solid #3a1010"
            borderRadius="6px"
            p="10px"
            mt="4px"
          >
            <CircleAlert
              size={14}
              color="#f87171"
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <Text color="#f87171" whiteSpace="pre-wrap" wordBreak="break-word">
              {result.error}
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
