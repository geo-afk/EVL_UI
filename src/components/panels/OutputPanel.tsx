import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Terminal, Trash2, Copy, Check, CircleCheck } from "lucide-react";
import { CodeRunResult } from "../../model/models";

interface OutputPanelProps {
  result: CodeRunResult | null;
  isRunning: boolean;
  onClear: () => void;
}

// ─── Classify each log line ───────────────────────────────────────────────────
type LineKind = "warn" | "error" | "info" | "normal";

function classifyLine(log: string): LineKind {
  if (log.startsWith("[WARN]"))  return "warn";
  if (log.startsWith("[ERROR]")) return "error";
  if (log.startsWith("[INFO]"))  return "info";
  return "normal";
}

const LINE_COLORS: Record<LineKind, { text: string; prefix: string; bg: string }> = {
  warn:   { text: "#fde68a", prefix: "#f59e0b", bg: "rgba(245,158,11,0.05)"  },
  error:  { text: "#fca5a5", prefix: "#ef4444", bg: "rgba(239,68,68,0.05)"   },
  info:   { text: "#93c5fd", prefix: "#3b82f6", bg: "rgba(59,130,246,0.05)"  },
  normal: { text: "var(--text-primary)", prefix: "var(--text-ghost)", bg: "transparent" },
};

// ─── Single output line ───────────────────────────────────────────────────────
// Key uses a content prefix so the fade-in animation reliably re-triggers on
// every new run, even when the line count is unchanged.
function OutputLine({ log, lineNum }: { log: string; lineNum: number }) {
  const kind   = classifyLine(log);
  const colors = LINE_COLORS[kind];

  return (
    <Flex
      align="flex-start" px="14px" py="2px" gap="0"
      bg={colors.bg} borderRadius="3px"
      _hover={{ bg: kind === "normal" ? "var(--bg-elevated)" : colors.bg }}
      transition="background 0.1s"
      fontFamily="'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
      fontSize="12px" lineHeight="1.75"
      style={{
        animation: "outputFadeIn 0.18s ease both",
        animationDelay: `${Math.min(lineNum * 0.035, 0.4)}s`,
      }}
    >
      <Text color="var(--text-ghost)" opacity={0.4} userSelect="none"
        flexShrink={0} w="28px" textAlign="right" mr="14px" mt="0.5px" fontSize="10.5px"
      >
        {lineNum}
      </Text>
      <Text color={colors.prefix} flexShrink={0} mr="10px" mt="0.5px"
        fontSize="11px" userSelect="none"
      >
        ›
      </Text>
      <Text color={colors.text} whiteSpace="pre-wrap" wordBreak="break-word" flex={1}>
        {log}
      </Text>
    </Flex>
  );
}

// ─── Return value row ─────────────────────────────────────────────────────────
function ReturnLine({ value }: { value: string }) {
  return (
    <Flex
      align="flex-start" px="14px" py="3px" gap="0"
      bg="rgba(139,92,246,0.06)" borderLeft="2px solid rgba(139,92,246,0.35)"
      mt="4px"
      fontFamily="'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
      fontSize="12px" lineHeight="1.75"
    >
      <Text color="var(--text-ghost)" opacity={0.4} userSelect="none"
        w="28px" textAlign="right" mr="14px" mt="0.5px" fontSize="10.5px"
      >
        ←
      </Text>
      <Text color="#a78bfa" whiteSpace="pre-wrap" wordBreak="break-word">
        {value}
      </Text>
    </Flex>
  );
}

// ─── Running cursor ───────────────────────────────────────────────────────────
function RunningCursor() {
  return (
    <Flex align="center" px="14px" py="6px" gap="10px">
      <Text color="var(--text-ghost)" opacity={0.4} userSelect="none"
        w="28px" textAlign="right" mr="14px" fontSize="10.5px" fontFamily="monospace"
      >
        {" "}
      </Text>
      <Text color="#4ade80" fontFamily="monospace" fontSize="11px" userSelect="none" mr="10px">
        ›
      </Text>
      <Flex align="center" gap="8px">
        <Text fontSize="12px" color="var(--text-ghost)" fontFamily="monospace" fontStyle="italic">
          running
        </Text>
        <Flex gap="3px" align="center">
          {[0, 1, 2].map((i) => (
            <Box key={i} w="4px" h="4px" borderRadius="50%" bg="#4ade80"
              style={{ animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <Flex direction="column" justify="center" align="flex-start"
      h="100%" px="14px" gap="3px" userSelect="none"
    >
      {["// Run your code to see output", "// print() calls will appear here"].map((text, idx) => (
        <Flex key={idx} align="center" gap="10px" mb={idx === 0 ? "6px" : "0"}>
          <Box w="28px" textAlign="right" mr="14px">
            <Text fontSize="10.5px" color="var(--text-ghost)" opacity={0.3} fontFamily="monospace">
              {idx + 1}
            </Text>
          </Box>
          <Text fontSize="12px" color="var(--text-ghost)" opacity={0.3}
            fontFamily="'JetBrains Mono', monospace"
          >
            {text}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
// The OutputPanel is a pure stdout viewer.
// - Code-level errors → DiagnosticsPanel
// - System/network errors → ToastStack (EditorPage level)
// This component renders only: logs, return values, and the running indicator.
export const OutputPanel = memo(({
  result,
  isRunning,
  onClear,
}: OutputPanelProps) => {
  const scrollRef    = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);

  const hasLogs     = (result?.logs.length ?? 0) > 0;
  const hasReturn   = result?.returnValue !== undefined;
  const hasAnything = hasLogs || hasReturn;

  useEffect(() => {
    return () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current); };
  }, []);

  // Auto-scroll to bottom on new output.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result, isRunning]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = [
      ...result.logs,
      result.returnValue ? `← ${result.returnValue}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
    });
  }, [result]);

  // Status dot reflects only output presence — errors live elsewhere.
  const statusDot = isRunning
    ? { color: "#facc15", shadow: "#facc1566", pulse: true  }
    : hasAnything
    ? { color: "#4ade80", shadow: "#4ade8066", pulse: false }
    : { color: "var(--text-ghost)", shadow: "transparent",  pulse: false };

  return (
    <Flex direction="column" h="100%" bg="var(--bg-code)" overflow="hidden">
      {/* Header */}
      <Flex h="38px" align="center" px="14px" gap="8px"
        borderBottom="1px solid var(--border)" flexShrink={0}
        justify="space-between" bg="var(--bg-base)"
      >
        <Flex align="center" gap="8px">
          <Terminal size={12} color="var(--text-ghost)" />
          <Text fontSize="10.5px" fontWeight="700" color="var(--text-ghost)"
            letterSpacing="0.14em" fontFamily="monospace"
          >
            OUTPUT
          </Text>
          <Box
            w="6px" h="6px" borderRadius="50%"
            bg={statusDot.color} boxShadow={`0 0 6px ${statusDot.shadow}`} ml="2px"
            style={statusDot.pulse ? { animation: "statusPulse 1s ease-in-out infinite" } : undefined}
            transition="background 0.3s, box-shadow 0.3s"
          />
          {hasLogs && (
            <Box px="6px" py="1px" bg="var(--bg-surface)"
              border="1px solid var(--border)" borderRadius="3px" ml="2px"
            >
              <Text fontSize="9.5px" color="var(--text-ghost)" fontFamily="monospace" letterSpacing="0.06em">
                {result!.logs.length} lines
              </Text>
            </Box>
          )}
        </Flex>

        <Flex align="center" gap="4px">
          {hasAnything && (
            <button
              onClick={handleCopy} title="Copy output"
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: copied ? "#4ade80" : "var(--text-ghost)",
                padding: "4px 6px", display: "flex", alignItems: "center",
                gap: "4px", borderRadius: "4px",
                transition: "color 0.15s, background 0.15s",
                fontFamily: "monospace", fontSize: "10px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = copied ? "#4ade80" : "var(--text-ghost)";
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              <span>{copied ? "copied" : "copy"}</span>
            </button>
          )}
          {hasAnything && (
            <button
              onClick={onClear} title="Clear output"
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--text-ghost)", padding: "4px 6px", display: "flex",
                alignItems: "center", gap: "4px", borderRadius: "4px",
                transition: "color 0.15s, background 0.15s",
                fontFamily: "monospace", fontSize: "10px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-ghost)";
              }}
            >
              <Trash2 size={11} /><span>clear</span>
            </button>
          )}
        </Flex>
      </Flex>

      {/* Body — stdout only */}
      <Box
        ref={scrollRef} flex="1" overflow="auto" py="10px"
        css={{
          "&::-webkit-scrollbar":       { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "var(--border)", borderRadius: "2px" },
        }}
      >
        {!isRunning && !hasAnything && <EmptyState />}

        {result?.logs.map((log, i) => (
          <OutputLine key={`${i}-${log.slice(0, 20)}`} log={log} lineNum={i + 1} />
        ))}

        {hasReturn && <ReturnLine value={result!.returnValue!} />}

        {isRunning && <RunningCursor />}
      </Box>

      {/* Status bar */}
      <Flex h="22px" align="center" px="14px" borderTop="1px solid var(--border)"
        bg="var(--bg-base)" flexShrink={0} justify="space-between" gap="12px"
      >
        <Flex align="center" gap="5px">
          {hasAnything ? (
            <>
              <CircleCheck size={9} color="#4ade80" />
              <Text fontSize="9.5px" color="#4ade80" fontFamily="monospace" letterSpacing="0.06em">
                ok
              </Text>
            </>
          ) : (
            <Text fontSize="9.5px" color="var(--text-ghost)" opacity={0.4}
              fontFamily="monospace" letterSpacing="0.06em"
            >
              {isRunning ? "executing..." : "ready"}
            </Text>
          )}
        </Flex>
        <Text fontSize="9.5px" color="var(--text-ghost)" opacity={0.35}
          fontFamily="monospace" letterSpacing="0.04em"
        >
          eval · stdout
        </Text>
      </Flex>

      <style>{`
        @keyframes outputFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%           { opacity: 1;   transform: scale(1);   }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>
    </Flex>
  );
});

OutputPanel.displayName = "OutputPanel";