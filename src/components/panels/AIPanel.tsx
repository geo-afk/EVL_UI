import { useMemo, memo } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Cpu, Loader, Trash2, Zap, Eye } from "lucide-react";
import { AIResult } from "../../model/models";

interface AIPanelProps {
  result: AIResult | null;
  isLoading: boolean;
  activeMode: "run" | "insights" | null;
  onClear: () => void;
}

// ─── AI content renderer ──────────────────────────────────────────────────────
// Memoised so React does not reconstruct every element on unrelated re-renders.
function useRenderedAIContent(content: string | undefined) {
  return useMemo(() => {
    if (!content) return null;

    const lines    = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = "";

    lines.forEach((line, i) => {
      // ── Code block delimiters ──────────────────────────────────────────
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang    = line.slice(3).trim();
          codeLines   = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <Box key={`code-${i}`} bg="var(--bg-code)" border="1px solid var(--border)"
              borderRadius="6px" p="10px 14px" my="6px" overflow="auto"
            >
              {codeLang && (
                <Text fontSize="10px" color="var(--text-muted)" letterSpacing="0.06em"
                  mb="4px" fontFamily="monospace"
                >
                  {codeLang.toUpperCase()}
                </Text>
              )}
              {codeLines.map((cl, ci) => (
                <Text key={ci} fontSize="12.5px"
                  fontFamily="'JetBrains Mono', 'Courier New', monospace"
                  color="var(--text-primary)" whiteSpace="pre" lineHeight="1.7"
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

      if (inCodeBlock) { codeLines.push(line); return; }

      // ── Bold heading: lines that START with **text** ───────────────────
      const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)/);
      if (boldMatch) {
        elements.push(
          <Flex key={i} align="baseline" gap="6px" mt={i > 0 ? "12px" : "0"} mb="4px">
            <Text fontSize="11px" fontWeight="700" color="var(--accent)"
              letterSpacing="0.08em" fontFamily="monospace"
            >
              {boldMatch[1].toUpperCase()}
            </Text>
            {boldMatch[2] && (
              <Text fontSize="12.5px" color="var(--text-primary)">{boldMatch[2]}</Text>
            )}
          </Flex>,
        );
        return;
      }

      // ── Bullet list ────────────────────────────────────────────────────
      if (line.startsWith("- ") || line.startsWith("• ")) {
        elements.push(
          <Flex key={i} align="flex-start" gap="8px" pl="4px">
            <Text color="var(--text-ghost)" flexShrink={0} mt="2px" fontSize="10px">▸</Text>
            <Text fontSize="12.5px" color="var(--text-secondary)" lineHeight="1.7">
              {line.slice(2)}
            </Text>
          </Flex>,
        );
        return;
      }

      // ── Blank spacer ───────────────────────────────────────────────────
      if (line === "") { elements.push(<Box key={i} h="4px" />); return; }

      // ── Plain text ─────────────────────────────────────────────────────
      elements.push(
        <Text key={i} fontSize="12.5px" color="var(--text-secondary)" lineHeight="1.7">
          {line}
        </Text>,
      );
    });

    return elements;
  }, [content]);
}

// ─── Mode icon — stable component, no re-creation needed ─────────────────────
const ModeIcon = memo(({ mode }: { mode: "run" | "insights" | null }) => {
  if (mode === "run")      return <Zap  size={12} color="var(--accent)"  />;
  if (mode === "insights") return <Eye  size={12} color="var(--accent2)" />;
  return                          <Cpu  size={12} color="var(--text-muted)" />;
});
ModeIcon.displayName = "ModeIcon";

// ─── Component ────────────────────────────────────────────────────────────────
export const AIPanel = memo(({
  result,
  isLoading,
  activeMode,
  onClear,
}: AIPanelProps) => {
  const renderedContent = useRenderedAIContent(result?.content);

  const modeLabel =
    activeMode === "run"
      ? "AI RUN"
      : activeMode === "insights"
        ? "AI INSIGHTS"
        : "AI";

  const hasContent  = result && (result.content || result.error);
  const headerColor =
    activeMode === "run"
      ? "var(--accent)"
      : activeMode === "insights"
        ? "var(--accent2)"
        : "var(--text-muted)";

  return (
    <Flex direction="column" h="100%" bg="var(--bg-panel)">
      {/* Header */}
      <Flex h="36px" align="center" px="14px" gap="8px"
        borderBottom="1px solid var(--border)" flexShrink={0} justify="space-between"
      >
        <Flex align="center" gap="6px">
          <ModeIcon mode={activeMode} />
          <Text fontSize="11px" fontWeight="600" color={headerColor}
            letterSpacing="0.08em" fontFamily="monospace" transition="color 0.2s"
          >
            {modeLabel}
          </Text>
          {isLoading && (
            <Box animation="spin 1s linear infinite" display="flex" ml="4px">
              <Loader size={11} color="var(--accent)" />
            </Box>
          )}
        </Flex>

        {hasContent && !isLoading && (
          <button
            onClick={onClear} title="Clear AI results"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-ghost)", padding: "2px", display: "flex",
              alignItems: "center", transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-ghost)")
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
              <Box key={i} h="12px" w={`${w}%`} bg="var(--bg-elevated)" borderRadius="4px"
                style={{ animation: `aiPulse 1.5s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </Flex>
        )}

        {!isLoading && !hasContent && (
          <Flex direction="column" gap="6px" align="flex-start" justify="center" h="100%">
            <Text color="var(--text-ghost)" fontSize="12px" fontFamily="monospace">
              // Use AI RUN to simulate execution
            </Text>
            <Text color="var(--text-ghost)" fontSize="12px" fontFamily="monospace">
              // Use AI INSIGHTS to analyze your code
            </Text>
          </Flex>
        )}

        {!isLoading && result?.error && (
          <Flex gap="8px" bg="#1a0808" border="1px solid #3a1010" borderRadius="6px"
            p="10px 14px"
          >
            <Text color="#f87171" fontSize="12.5px" fontFamily="monospace" whiteSpace="pre-wrap">
              {result.error}
            </Text>
          </Flex>
        )}

        {!isLoading && renderedContent && (
          <Box>{renderedContent}</Box>
        )}
      </Box>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes aiPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </Flex>
  );
});

AIPanel.displayName = "AIPanel";