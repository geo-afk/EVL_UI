import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Terminal,
  Code2,
  Database,
  AlertTriangle,
  Activity,
  Gauge,
} from "lucide-react";
import { AnalysisResponse, StepModel, ScopeEntry } from "../model/models";

// ─────────────────────────────────────────────────────────────────────────────
// SESSION SHAPE
// ─────────────────────────────────────────────────────────────────────────────

interface DebugSession {
  analysis: AnalysisResponse;
  code: string;
}

function readDebugSession(): DebugSession | null {
  try {
    const raw = sessionStorage.getItem("eval_last_debug");
    return raw ? (JSON.parse(raw) as DebugSession) : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIABLE DIFF HELPERS
// Converts a scope snapshot into a display-ready map and detects changes
// between the current step and the previous one.
// ─────────────────────────────────────────────────────────────────────────────

function formatValue(entry: ScopeEntry): string {
  const v = entry.value;
  if (v === null || v === undefined) return "null";
  if (entry.type === "string") return `"${v}"`;
  return String(v);
}

function typeColor(type: string): string {
  switch (type) {
    case "int":    return "#38bdf8";
    case "float":  return "#a78bfa";
    case "string": return "#86efac";
    case "bool":   return "#fb923c";
    default:       return "var(--text-muted)";
  }
}

/**
 * Returns the set of variable names whose value changed between two scopes.
 * A new variable (exists in current, not in prev) is also considered changed.
 */
function changedVars(
  prev: Record<string, ScopeEntry>,
  curr: Record<string, ScopeEntry>,
): Set<string> {
  const changed = new Set<string>();
  for (const [name, entry] of Object.entries(curr)) {
    if (!(name in prev) || String(prev[name].value) !== String(entry.value)) {
      changed.add(name);
    }
  }
  return changed;
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({ onGoToEditor }: { onGoToEditor: () => void }) {
  return (
    <Flex direction="column" h="100%" align="center" justify="center" gap="16px" bg="var(--bg-base)">
      <Flex
        w="56px" h="56px" borderRadius="14px"
        bg="var(--bg-surface)" border="1px solid var(--border)"
        align="center" justify="center"
      >
        <Activity size={24} color="var(--text-ghost)" />
      </Flex>
      <Flex direction="column" align="center" gap="6px">
        <Text fontSize="15px" fontWeight="700" color="var(--text-primary)" fontFamily="monospace">
          No execution recorded
        </Text>
        <Text fontSize="12px" color="var(--text-muted)" textAlign="center" maxW="320px" lineHeight="1.7">
          Run your code from the Editor first. The debugger captures a full
          step-by-step trace of every statement executed.
        </Text>
      </Flex>
      <button
        onClick={onGoToEditor}
        style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "9px 18px",
          background: "var(--accent)", border: "none",
          borderRadius: "8px", color: "var(--bg-base)",
          fontSize: "12px", fontWeight: "700",
          fontFamily: "monospace", letterSpacing: "0.04em",
          cursor: "pointer",
        }}
      >
        <Code2 size={13} />
        Go to Editor
      </button>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP TIMELINE (left column)
// ─────────────────────────────────────────────────────────────────────────────

interface StepTimelineProps{

  steps: StepModel[];
  activeIdx: number;
  onSelect: (index: number) => void; 
  errorLines: Set<number>;

}


function StepTimeline({
  steps,
  activeIdx,
  onSelect,
  errorLines,
}: StepTimelineProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIdx]);

  return (
    <Flex direction="column" h="100%" bg="var(--bg-code)"
      borderRight="1px solid var(--border)" overflow="hidden">

      {/* Header */}
      <Flex h="38px" align="center" px="14px" gap="8px"
        borderBottom="1px solid var(--border)" flexShrink={0} bg="var(--bg-base)">
        <Activity size={11} color="var(--text-ghost)" />
        <Text fontSize="10.5px" fontWeight="700" color="var(--text-ghost)"
          letterSpacing="0.14em" fontFamily="monospace">
          STEPS
        </Text>
        <Box px="6px" py="1px" bg="var(--bg-surface)"
          border="1px solid var(--border)" borderRadius="3px" ml="2px">
          <Text fontSize="9.5px" color="var(--text-ghost)" fontFamily="monospace">
            {steps.length}
          </Text>
        </Box>
      </Flex>

      {/* List */}
      <Box flex={1} overflow="auto" py="6px"
        css={{
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-thumb": { background: "var(--border)", borderRadius: "2px" },
        }}
      >
        {steps.map((step, i) => {
          const isActive  = i === activeIdx;
          const hasOutput = step.output.length > 0;
          const hasError  = errorLines.has(step.line);

          return (
            <Box
              key={step.id}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(i)}
              cursor="pointer"
              px="12px" py="8px" mx="6px" mb="2px"
              borderRadius="7px"
              bg={isActive ? "var(--accent-dim)" : "transparent"}
              border="1px solid"
              borderColor={isActive ? "var(--accent-border)" : "transparent"}
              transition="all 0.12s"
              _hover={{ bg: isActive ? "var(--accent-dim)" : "var(--bg-surface)" }}
            >
              <Flex align="center" gap="8px">
                {/* Step number badge */}
                <Flex
                  w="22px" h="22px" borderRadius="50%" flexShrink={0}
                  bg={isActive ? "var(--accent)" : "var(--bg-elevated)"}
                  align="center" justify="center" transition="background 0.15s"
                >
                  <Text fontSize="9px" fontWeight="800" fontFamily="monospace"
                    color={isActive ? "var(--bg-base)" : "var(--text-ghost)"}>
                    {String(i + 1).padStart(2, "0")}
                  </Text>
                </Flex>

                <Flex direction="column" gap="2px" flex={1} minW={0}>
                  {/* Phase + line */}
                  <Flex align="center" gap="5px">
                    <Text fontSize="10px"
                      color={isActive ? "var(--accent)" : "var(--text-muted)"}
                      fontFamily="monospace" fontWeight="600">
                      line {step.line}
                    </Text>
                    {step.phase && (
                      <Text fontSize="9px" color="var(--text-ghost)" fontFamily="monospace"
                        overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                        · {step.phase}
                      </Text>
                    )}
                  </Flex>

                  {/* Title preview */}
                  <Text fontSize="10px" color="var(--text-muted)" fontFamily="monospace"
                    overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {step.title}
                  </Text>
                </Flex>

                {/* Indicators */}
                <Flex gap="4px" align="center" flexShrink={0}>
                  {hasOutput && (
                    <Box w="5px" h="5px" borderRadius="50%" bg="#4ade80"
                      title="Produces output" />
                  )}
                  {hasError && (
                    <Box w="5px" h="5px" borderRadius="50%" bg="#f87171"
                      title="Error on this line" />
                  )}
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </Box>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE VIEWER
// ─────────────────────────────────────────────────────────────────────────────

function SourceViewer({
  code,
  activeLine,
  errorLines,
}: {
  code: string;
  activeLine: number;
  errorLines: Set<number>;
}) {
  const lineRef = useRef<HTMLDivElement>(null);
  const codeLines = code.split("\n");

  useEffect(() => {
    lineRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeLine]);

  return (
    <Flex direction="column" h="100%" overflow="hidden">
      {/* Header */}
      <Flex h="38px" align="center" px="14px" gap="8px"
        borderBottom="1px solid var(--border)" flexShrink={0} bg="var(--bg-base)">
        <Code2 size={11} color="var(--text-ghost)" />
        <Text fontSize="10.5px" fontWeight="700" color="var(--text-ghost)"
          letterSpacing="0.14em" fontFamily="monospace">
          SOURCE
        </Text>
        {activeLine > 0 && (
          <Box px="6px" py="1px" bg="var(--accent-dim)"
            border="1px solid var(--accent-border)" borderRadius="3px" ml="2px">
            <Text fontSize="9.5px" color="var(--accent)" fontFamily="monospace">
              line {activeLine}
            </Text>
          </Box>
        )}
      </Flex>

      {/* Code body */}
      <Box
        flex={1} overflow="auto" bg="#0d1117"
        fontFamily="'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
        fontSize="12.5px"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.08)", borderRadius: "2px",
          },
        }}
      >
        <Box py="10px">
          {codeLines.map((line, i) => {
            const lineNum  = i + 1;
            const isActive = activeLine === lineNum;
            const isError  = errorLines.has(lineNum);

            return (
              <Flex
                key={i}
                ref={isActive ? lineRef : undefined}
                align="flex-start"
                bg={
                  isActive ? "rgba(251,146,60,0.12)"
                  : isError ? "rgba(248,113,113,0.06)"
                  : "transparent"
                }
                borderLeft="3px solid"
                borderColor={
                  isActive ? "#fb923c"
                  : isError ? "#f87171"
                  : "transparent"
                }
                py="1px"
                transition="background 0.15s, border-color 0.15s"
              >
                {/* Line number gutter */}
                <Text
                  w="44px" flexShrink={0} textAlign="right" pr="16px"
                  fontSize="11px" lineHeight="1.8" userSelect="none"
                  fontFamily="monospace"
                  color={
                    isActive ? "#fb923c"
                    : isError ? "#f87171"
                    : "rgba(255,255,255,0.12)"
                  }
                >
                  {lineNum}
                </Text>

                {/* Code text */}
                <Text
                  flex={1} whiteSpace="pre" lineHeight="1.8" pr="20px"
                  color={
                    isActive ? "#fde68a"
                    : isError ? "#fca5a5"
                    : "rgba(255,255,255,0.78)"
                  }
                >
                  {line || " "}
                </Text>
              </Flex>
            );
          })}
        </Box>
      </Box>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIABLE TABLE
// Reads directly from StepModel.scope — no source parsing needed.
// ─────────────────────────────────────────────────────────────────────────────

function VariableTable({
  scope,
  prevScope,
}: {
  scope: Record<string, ScopeEntry>;
  prevScope: Record<string, ScopeEntry>;
}) {
  const entries = Object.entries(scope);
  const changed = changedVars(prevScope, scope);

  if (entries.length === 0) {
    return (
      <Flex align="center" justify="center" h="100%" direction="column" gap="6px">
        <Database size={16} color="var(--text-ghost)" opacity={0.4} />
        <Text fontSize="11px" color="var(--text-ghost)" opacity={0.4}
          fontFamily="monospace">
          no variables in scope
        </Text>
      </Flex>
    );
  }

  return (
    <Box overflow="auto" h="100%"
      css={{
        "&::-webkit-scrollbar": { width: "3px" },
        "&::-webkit-scrollbar-thumb": { background: "var(--border)", borderRadius: "2px" },
      }}
    >
      {/* Table header */}
      <Flex px="14px" py="7px" position="sticky" top={0}
        bg="var(--bg-surface)" borderBottom="1px solid var(--border)">
        {(["NAME", "TYPE", "VALUE"] as const).map((h) => (
          <Text key={h} flex={h === "VALUE" ? 2 : 1}
            fontSize="9px" fontWeight="700" color="var(--text-ghost)"
            fontFamily="monospace" letterSpacing="0.12em">
            {h}
          </Text>
        ))}
      </Flex>

      {/* Rows */}
      {entries.map(([name, entry]) => {
        const isNew      = !(name in prevScope);
        const didChange  = changed.has(name);
        const displayVal = formatValue(entry);

        return (
          <Flex
            key={name} px="14px" py="8px"
            borderBottom="1px solid var(--border)"
            bg={
              isNew      ? "rgba(74,222,128,0.04)"
              : didChange ? "rgba(251,146,60,0.04)"
              : "transparent"
            }
            align="center"
            transition="background 0.2s"
          >
            {/* Name + flags */}
            <Flex flex={1} align="center" gap="6px" minW={0}>
              <Text fontSize="12px" fontFamily="monospace" color="var(--text-primary)"
                fontWeight={didChange ? "700" : "400"}
                overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {name}
              </Text>
              {entry.const && (
                <Text fontSize="9px" color="var(--text-ghost)" fontFamily="monospace"
                  border="1px solid var(--border)" px="4px" borderRadius="3px"
                  flexShrink={0}>
                  const
                </Text>
              )}
              {isNew && (
                <Box w="5px" h="5px" borderRadius="50%" bg="#4ade80"
                  title="New variable" flexShrink={0} />
              )}
              {!isNew && didChange && (
                <Box w="5px" h="5px" borderRadius="50%" bg="#fb923c"
                  title="Value changed" flexShrink={0} />
              )}
            </Flex>

            {/* Type */}
            <Text flex={1} fontSize="11px" fontFamily="monospace"
              color={typeColor(entry.type)}>
              {entry.type}
            </Text>

            {/* Value */}
            <Text flex={2} fontSize="12px" fontFamily="monospace"
              color={didChange || isNew ? "#fde68a" : "var(--text-secondary)"}
              fontWeight={didChange || isNew ? "600" : "400"}
              overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {displayVal}
            </Text>
          </Flex>
        );
      })}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP DETAIL PANEL (description + changed hint)
// ─────────────────────────────────────────────────────────────────────────────

function StepDetail({ step }: { step: StepModel }) {
  return (
    <Flex direction="column" h="100%" overflow="auto" p="14px 16px" gap="10px"
      css={{
        "&::-webkit-scrollbar": { width: "3px" },
        "&::-webkit-scrollbar-thumb": { background: "var(--border)", borderRadius: "2px" },
      }}
    >
      {/* Phase badge + title */}
      <Flex align="center" gap="8px" flexWrap="wrap">
        {step.phase && (
          <Box px="8px" py="2px"
            bg="var(--accent-dim)" border="1px solid var(--accent-border)"
            borderRadius="4px">
            <Text fontSize="9.5px" fontWeight="700" color="var(--accent)"
              fontFamily="monospace" letterSpacing="0.08em">
              {step.phase.toUpperCase()}
            </Text>
          </Box>
        )}
        <Text fontSize="12.5px" fontWeight="700" color="var(--text-primary)"
          fontFamily="monospace">
          {step.title}
        </Text>
      </Flex>

      {/* Description */}
      {step.description && (
        <Text fontSize="12.5px" color="var(--text-secondary)" lineHeight="1.75">
          {step.description}
        </Text>
      )}

      {/* Changed variable hint */}
      {step.changed && (
        <Flex align="center" gap="8px" p="8px 12px"
          bg="rgba(251,146,60,0.06)" border="1px solid rgba(251,146,60,0.2)"
          borderLeft="3px solid #fb923c" borderRadius="5px">
          <Text fontSize="10px" color="#fb923c" fontFamily="monospace"
            fontWeight="700" letterSpacing="0.08em" flexShrink={0}>
            CHANGED
          </Text>
          <Text fontSize="11.5px" color="#fde68a" fontFamily="monospace">
            {step.changed}
          </Text>
        </Flex>
      )}

      {/* Details */}
      {step.details && step.details !== step.description && (
        <Text fontSize="12px" color="var(--text-muted)" lineHeight="1.7"
          borderTop="1px solid var(--border)" pt="10px">
          {step.details}
        </Text>
      )}
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function StepOutput({
  step,
  allSteps,
  activeIdx,
  tab,
  onTabChange,
}: {
  step: StepModel;
  allSteps: StepModel[];
  activeIdx: number;
  tab: "step" | "accumulated";
  onTabChange: (t: "step" | "accumulated") => void;
}) {
  const accumulated = useMemo(
    () => allSteps.slice(0, activeIdx + 1).flatMap((s) => s.output),
    [allSteps, activeIdx],
  );

  const renderLines = (lines: string[]) => {
    if (lines.length === 0) {
      return (
        <Flex align="center" justify="center" h="60px">
          <Text fontSize="11px" color="var(--text-ghost)" opacity={0.4}
            fontFamily="monospace">
            no output at this step
          </Text>
        </Flex>
      );
    }
    return lines.map((line, i) => (
      <Flex key={i} align="flex-start" px="14px" py="2px" gap="10px">
        <Text fontSize="10.5px" color="var(--text-ghost)" opacity={0.4}
          fontFamily="monospace" flexShrink={0}>›</Text>
        <Text fontSize="12px" fontFamily="'JetBrains Mono', monospace"
          color="var(--text-primary)" whiteSpace="pre-wrap" wordBreak="break-word">
          {line}
        </Text>
      </Flex>
    ));
  };

  return (
    <Flex direction="column" h="100%" overflow="hidden">
      {/* Tabs */}
      <Flex h="34px" align="center" px="12px" gap="2px"
        borderBottom="1px solid var(--border)" bg="var(--bg-base)" flexShrink={0}>
        {(["step", "accumulated"] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            style={{
              padding: "4px 10px",
              background: tab === t ? "var(--bg-elevated)" : "transparent",
              border: "1px solid",
              borderColor: tab === t ? "var(--border)" : "transparent",
              borderRadius: "5px",
              color: tab === t ? "var(--text-primary)" : "var(--text-ghost)",
              fontSize: "10px",
              fontWeight: tab === t ? "700" : "500",
              fontFamily: "monospace",
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t === "step" ? "THIS STEP" : "ACCUMULATED"}
          </button>
        ))}
        {accumulated.length > 0 && (
          <Box ml="auto" px="6px" py="1px"
            bg="var(--bg-surface)" border="1px solid var(--border)" borderRadius="3px">
            <Text fontSize="9px" color="var(--text-ghost)" fontFamily="monospace">
              {accumulated.length} line{accumulated.length !== 1 ? "s" : ""}
            </Text>
          </Box>
        )}
      </Flex>

      <Box flex={1} overflow="auto" py="8px"
        css={{
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-thumb": { background: "var(--border)", borderRadius: "2px" },
        }}
      >
        {renderLines(tab === "step" ? step.output : accumulated)}
      </Box>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV BAR (bottom)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Speed tiers ──────────────────────────────────────────────────────────────
export type PlaySpeed = "slow" | "normal" | "fast";

const SPEED_CONFIG: Record<PlaySpeed, { label: string; ms: number; color: string }> = {
  slow:   { label: "0.5×", ms: 1600, color: "#38bdf8" },
  normal: { label: "1×",   ms: 800,  color: "#4ade80" },
  fast:   { label: "2×",   ms: 300,  color: "#fb923c" },
};
const SPEED_ORDER: PlaySpeed[] = ["slow", "normal", "fast"];

function NavBtn({
  onClick, disabled, children, title, accent = false,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  title: string;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "32px", height: "28px",
        background: accent && !disabled ? "var(--accent-dim)" : "transparent",
        border: `1px solid ${accent && !disabled ? "var(--accent-border)" : "var(--border)"}`,
        borderRadius: "6px",
        color: accent && !disabled
          ? "var(--accent)"
          : disabled ? "var(--text-ghost)" : "var(--text-muted)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.borderColor = "var(--accent)";
          if (!accent) b.style.color = "var(--accent)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.borderColor = accent ? "var(--accent-border)" : "var(--border)";
          b.style.color = accent ? "var(--accent)" : "var(--text-muted)";
        }
      }}
    >
      {children}
    </button>
  );
}

function NavBar({
  activeIdx,
  total,
  isPlaying,
  speed,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onTogglePlay,
  onSpeedChange,
}: {
  activeIdx: number;
  total: number;
  isPlaying: boolean;
  speed: PlaySpeed;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onTogglePlay: () => void;
  onSpeedChange: (s: PlaySpeed) => void;
}) {
  const progress  = total > 1 ? (activeIdx / (total - 1)) * 100 : 100;
  const atEnd     = activeIdx === total - 1;
  const speedCfg  = SPEED_CONFIG[speed];

  return (
    <Flex
      h="48px" align="center" px="16px" gap="10px"
      borderTop="1px solid var(--border)" bg="var(--bg-base)" flexShrink={0}
    >
      {/* Step controls */}
      <Flex gap="4px" align="center">
        <NavBtn onClick={onFirst} disabled={activeIdx === 0} title="First step (Home)">
          <SkipBack size={12} />
        </NavBtn>
        <NavBtn onClick={onPrev} disabled={activeIdx === 0} title="Previous (←)">
          <ChevronLeft size={14} />
        </NavBtn>

        {/* ── Play / Pause ── */}
        <button
          onClick={onTogglePlay}
          disabled={atEnd && !isPlaying}
          title={isPlaying ? "Pause (Space)" : atEnd ? "Rewind to replay" : "Play (Space)"}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "36px", height: "28px",
            background: isPlaying ? "var(--accent)" : "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            borderRadius: "7px",
            color: isPlaying ? "var(--bg-base)" : "var(--accent)",
            cursor: atEnd && !isPlaying ? "not-allowed" : "pointer",
            opacity: atEnd && !isPlaying ? 0.4 : 1,
            transition: "all 0.15s",
            boxShadow: isPlaying ? "0 0 10px var(--accent)44" : "none",
          }}
        >
          {isPlaying
            ? <Pause size={13} />
            : <Play  size={13} style={{ marginLeft: "1px" }} />
          }
        </button>

        <NavBtn onClick={onNext} disabled={atEnd} title="Next (→)">
          <ChevronRight size={14} />
        </NavBtn>
        <NavBtn onClick={onLast} disabled={atEnd} title="Last step (End)">
          <SkipForward size={12} />
        </NavBtn>
      </Flex>

      {/* Divider */}
      <Box h="16px" w="1px" bg="var(--border)" flexShrink={0} />

      {/* Speed selector */}
      <Flex align="center" gap="5px">
        <Gauge size={11} color="var(--text-ghost)" />
        <Flex gap="3px">
          {SPEED_ORDER.map((s) => {
            const cfg       = SPEED_CONFIG[s];
            const isActive  = s === speed;
            return (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                title={`${cfg.label} — ${cfg.ms}ms per step`}
                style={{
                  padding: "3px 8px",
                  background: isActive ? `${cfg.color}18` : "transparent",
                  border: `1px solid ${isActive ? cfg.color + "55" : "var(--border)"}`,
                  borderRadius: "5px",
                  color: isActive ? cfg.color : "var(--text-ghost)",
                  fontSize: "10px",
                  fontWeight: isActive ? "700" : "500",
                  fontFamily: "monospace",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: isActive && isPlaying ? `0 0 6px ${cfg.color}44` : "none",
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </Flex>
      </Flex>

      {/* Divider */}
      <Box h="16px" w="1px" bg="var(--border)" flexShrink={0} />

      {/* Step counter */}
      <Flex align="baseline" gap="4px" flexShrink={0}>
        <Text fontSize="13px" fontWeight="700" color="var(--text-primary)"
          fontFamily="monospace">
          {activeIdx + 1}
        </Text>
        <Text fontSize="10px" color="var(--text-ghost)" fontFamily="monospace">
          / {total}
        </Text>
      </Flex>

      {/* Progress bar */}
      <Box flex={1} h="3px" bg="var(--bg-elevated)" borderRadius="2px" overflow="hidden">
        <Box
          h="100%" borderRadius="2px"
          bg={isPlaying ? speedCfg.color : "var(--accent)"}
          style={{
            width: `${progress}%`,
            transition: isPlaying
              ? `width ${speedCfg.ms}ms linear`
              : "width 0.18s ease",
          }}
        />
      </Box>

      {/* Hint — swaps to playing indicator when running */}
      {isPlaying ? (
        <Flex align="center" gap="5px" flexShrink={0}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i} w="4px" h="4px" borderRadius="50%"
              bg={speedCfg.color}
              style={{ animation: `dotPulse 1s ease-in-out ${i * 0.18}s infinite` }}
            />
          ))}
        </Flex>
      ) : (
        <Text fontSize="9.5px" color="var(--text-ghost)" fontFamily="monospace"
          letterSpacing="0.04em" opacity={0.45} flexShrink={0}>
          Space to play
        </Text>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.7); }
          40%            { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export const DebuggerPage = () => {
  const navigate = useNavigate();
  const session  = readDebugSession();

  const [activeIdx,    setActiveIdx]    = useState(0);
  const [outputTab,    setOutputTab]    = useState<"step" | "accumulated">("step");
  const [bottomPanel,  setBottomPanel]  = useState<"variables" | "output" | "detail">("variables");
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [speed,        setSpeed]        = useState<PlaySpeed>("normal");

  const steps = useMemo(
    () => session?.analysis.steps ?? [],
    [session?.analysis.steps],
  );
  const code = session?.code ?? "";
  const errors = useMemo(
    () => session?.analysis.errors ?? [],
    [session?.analysis.errors],
  );
  const warnings = useMemo(
    () => session?.analysis.warnings ?? [],
    [session?.analysis.warnings],
  );

  // Set of line numbers that carry errors — used by source viewer + timeline
  const errorLines = useMemo(
    () => new Set([...errors, ...warnings].map((e) => e.line_number)),
    [errors, warnings],
  );

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(i, steps.length - 1)),
    [steps],
  );
  const goTo = useCallback((i: number) => setActiveIdx(clamp(i)), [clamp]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't steal keys from inputs
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); goTo(activeIdx - 1); }
      if (e.key === "ArrowRight" || e.key === "ArrowDown")  { e.preventDefault(); goTo(activeIdx + 1); }
      if (e.key === "Home")  { e.preventDefault(); goTo(0); }
      if (e.key === "End")   { e.preventDefault(); goTo(steps.length - 1); }
      if (e.key === " ")     { e.preventDefault(); setIsPlaying((p) => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIdx, goTo, steps.length]);

  // Auto-play interval — advances one step at the chosen speed
  useEffect(() => {
    if (!isPlaying) return;
    const ms = SPEED_CONFIG[speed].ms;
    const id = window.setInterval(() => {
      setActiveIdx((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          // Reached the end — stop playing
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, ms);
    return () => window.clearInterval(id);
  }, [isPlaying, speed, steps.length]);

  if (!session || steps.length === 0) {
    return <EmptyState onGoToEditor={() => navigate("/")} />;
  }

  const activeStep = steps[activeIdx];
  const prevStep   = steps[activeIdx - 1];
  const currentScope = activeStep.scope ?? {};
  const prevScope    = prevStep?.scope  ?? {};

  return (
    <Flex direction="column" h="100%" bg="var(--bg-base)" overflow="hidden">

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <Flex h="40px" align="center" px="16px" gap="12px"
        borderBottom="1px solid var(--border)" bg="var(--bg-base)"
        flexShrink={0} justify="space-between">

        <Flex align="center" gap="10px">
          <Play size={12} color="var(--accent)" />
          <Text fontSize="11px" fontWeight="700" color="var(--text-primary)"
            fontFamily="monospace" letterSpacing="0.08em">
            STEP-THROUGH DEBUGGER
          </Text>
          <Box h="12px" w="1px" bg="var(--border)" />
          <Text fontSize="10px" color="var(--text-muted)" fontFamily="monospace">
            {steps.length} steps · {code.split("\n").length} lines
          </Text>
          {errors.length > 0 && (
            <Flex align="center" gap="5px" px="8px" py="2px"
              bg="rgba(248,113,113,0.08)"
              border="1px solid rgba(248,113,113,0.2)" borderRadius="4px">
              <AlertTriangle size={10} color="#f87171" />
              <Text fontSize="9.5px" color="#f87171" fontFamily="monospace">
                {errors.length} error{errors.length !== 1 ? "s" : ""}
              </Text>
            </Flex>
          )}
        </Flex>

        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "5px 12px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)", borderRadius: "6px",
            color: "var(--text-muted)", fontSize: "11px",
            fontFamily: "monospace", cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          }}
        >
          <Code2 size={11} />
          Back to Editor
        </button>
      </Flex>

      {/* ── Main layout ───────────────────────────────────────────── */}
      <Flex flex={1} overflow="hidden">

        {/* Left: step timeline */}
        <Box w="220px" flexShrink={0} overflow="hidden">
          <StepTimeline
            steps={steps}
            activeIdx={activeIdx}
            onSelect={goTo}
            errorLines={errorLines}
          />
        </Box>

        {/* Right: source + details */}
        <Flex flex={1} direction="column" overflow="hidden">

          {/* Source viewer — top portion */}
          <Box flex="55" overflow="hidden" borderBottom="1px solid var(--border)">
            <SourceViewer
              code={code}
              activeLine={activeStep.line}
              errorLines={errorLines}
            />
          </Box>

          {/* Bottom panel — variables / output / detail */}
          <Flex flex="45" direction="column" overflow="hidden">

            {/* Panel tab bar */}
            <Flex h="38px" align="center" px="14px" gap="4px"
              borderBottom="1px solid var(--border)"
              bg="var(--bg-base)" flexShrink={0}>

              {(
                [
                  { key: "variables", icon: <Database size={11} />, label: "VARIABLES",
                    badge: Object.keys(currentScope).length || undefined, badgeGreen: false },
                  { key: "output",    icon: <Terminal size={11} />, label: "OUTPUT",
                    badge: activeStep.output.length || undefined, badgeGreen: true },
                  { key: "detail",    icon: <Activity size={11} />, label: "DETAIL",
                    badge: undefined, badgeGreen: false },
                ] as const
              ).map(({ key, icon, label, badge, badgeGreen }) => (
                <button
                  key={key}
                  onClick={() => setBottomPanel(key)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "5px 12px",
                    background: bottomPanel === key ? "var(--bg-elevated)" : "transparent",
                    border: "1px solid",
                    borderColor: bottomPanel === key ? "var(--border)" : "transparent",
                    borderRadius: "6px",
                    color: bottomPanel === key ? "var(--text-primary)" : "var(--text-ghost)",
                    fontSize: "10.5px", fontWeight: "600",
                    fontFamily: "monospace", letterSpacing: "0.08em",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {icon}
                  {label}
                  {badge !== undefined && (
                    <Box
                      as="span" px="5px" py="1px"
                      bg={badgeGreen ? "rgba(74,222,128,0.1)" : "var(--bg-surface)"}
                      border={`1px solid ${badgeGreen ? "rgba(74,222,128,0.2)" : "var(--border)"}`}
                      borderRadius="3px" fontSize="9px"
                      color={badgeGreen ? "#4ade80" : "var(--text-ghost)"}
                      fontFamily="monospace"
                    >
                      {badge}
                    </Box>
                  )}
                </button>
              ))}

              {/* Inline "changed" hint */}
              {activeStep.changed && (
                <Flex align="center" gap="6px" ml="auto"
                  px="10px" py="3px"
                  bg="rgba(251,146,60,0.06)"
                  border="1px solid rgba(251,146,60,0.2)"
                  borderRadius="5px" maxW="340px" overflow="hidden">
                  <Text fontSize="9px" color="#fb923c" fontFamily="monospace"
                    fontWeight="700" flexShrink={0}>
                    CHANGED
                  </Text>
                  <Text fontSize="11px" color="#fde68a" fontFamily="monospace"
                    overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {activeStep.changed}
                  </Text>
                </Flex>
              )}
            </Flex>

            {/* Panel body */}
            <Box flex={1} overflow="hidden" bg="var(--bg-code)">
              {bottomPanel === "variables" && (
                <VariableTable scope={currentScope} prevScope={prevScope} />
              )}
              {bottomPanel === "output" && (
                <StepOutput
                  step={activeStep}
                  allSteps={steps}
                  activeIdx={activeIdx}
                  tab={outputTab}
                  onTabChange={setOutputTab}
                />
              )}
              {bottomPanel === "detail" && (
                <StepDetail step={activeStep} />
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {/* ── Navigation bar ────────────────────────────────────────── */}
      <NavBar
        activeIdx={activeIdx}
        total={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onPrev={() => { setIsPlaying(false); goTo(activeIdx - 1); }}
        onNext={() => { setIsPlaying(false); goTo(activeIdx + 1); }}
        onFirst={() => { setIsPlaying(false); goTo(0); }}
        onLast={() => { setIsPlaying(false); goTo(steps.length - 1); }}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onSpeedChange={setSpeed}
      />
    </Flex>
  );
};