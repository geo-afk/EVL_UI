import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  ArrowLeft,
  Bug,
  SkipBack,
  ChevronLeft,
  Play,
  Pause,
  ChevronRight,
  SkipForward,
  Terminal,
  Layers,
  FileCode,
  AlertTriangle,
  CheckCircle,
  Lock,
  Variable,
} from "lucide-react";
import { fetchRunCode } from "../api";
import type {
  AnalysisResponse,
  StepModel,
  ScopeEntry,
} from "../model/models.ts";

// ── Route state shape ─────────────────────────────────────────────────────────
interface DebuggerState {
  analysis?: AnalysisResponse;
  code: string;
  loading?: boolean;
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const AMBER = "#fbbf24";
const AMBER_DIM = "rgba(251,191,36,0.10)";
const AMBER_BORDER = "rgba(251,191,36,0.22)";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ScopeEntries {
  [key: string]: ScopeEntry;
}

// Phase color map
const PHASE_COLORS: Record<string, string> = {
  init: "#60a5fa",
  call: "#a78bfa",
  eval: "#34d399",
  assign: AMBER,
  return: "#f472b6",
  error: "#f87171",
  output: "#4ade80",
  expression: "#38bdf8",
};

function phaseColor(phase: string): string {
  return PHASE_COLORS[phase.toLowerCase()] ?? "var(--text-muted)";
}

// Shared scrollbar style injected once
let _scrollStyleInjected = false;
function injectScrollStyle(): void {
  if (_scrollStyleInjected) return;
  _scrollStyleInjected = true;
  const el = document.createElement("style");
  el.textContent = `
    .dbg-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
    .dbg-scroll::-webkit-scrollbar-track { background: transparent; }
    .dbg-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
    .dbg-scope-row:hover { background: var(--bg-surface) !important; }
    @keyframes dbg-fade { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
    .dbg-card { animation: dbg-fade 0.18s ease; }
  `;
  document.head.appendChild(el);
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface PhaseBadgeProps {
  phase: string;
}

function PhaseBadge({ phase }: PhaseBadgeProps) {
  const c = phaseColor(phase);
  return (
    <Box
      px="7px"
      py="2px"
      borderRadius="4px"
      bg={`${c}18`}
      border={`1px solid ${c}44`}
      display="inline-flex"
      alignItems="center"
      flexShrink={0}
    >
      <Text
        fontSize="9px"
        fontWeight="700"
        color={c}
        letterSpacing="0.12em"
        fontFamily="'JetBrains Mono', monospace"
      >
        {phase.toUpperCase()}
      </Text>
    </Box>
  );
}

interface ScopeValueProps {
  value: unknown;
}

function ScopeValue({ value }: ScopeValueProps) {
  const str = JSON.stringify(value, null, 0);
  const color =
    typeof value === "string"
      ? "#86efac"
      : typeof value === "number"
        ? "#93c5fd"
        : typeof value === "boolean" || value === null
          ? "#f0abfc"
          : "var(--text-primary)";
  return (
    <Text
      fontSize="12px"
      fontFamily="'JetBrains Mono', monospace"
      color={color}
      style={{ wordBreak: "break-all" }}
    >
      {str}
    </Text>
  );
}

interface TBtnProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function TBtn({ onClick, disabled, active, title, children }: TBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "30px",
        height: "30px",
        background: active ? AMBER_DIM : "transparent",
        border: `1px solid ${active ? AMBER_BORDER : "transparent"}`,
        borderRadius: "6px",
        color: active
          ? AMBER
          : disabled
            ? "var(--text-ghost)"
            : "var(--text-secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        transition: "all 0.12s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const b = e.currentTarget as HTMLButtonElement;
        b.style.background = AMBER_DIM;
        b.style.borderColor = AMBER_BORDER;
        b.style.color = AMBER;
      }}
      onMouseLeave={(e) => {
        if (active) return;
        const b = e.currentTarget as HTMLButtonElement;
        b.style.background = "transparent";
        b.style.borderColor = "transparent";
        b.style.color = disabled
          ? "var(--text-ghost)"
          : "var(--text-secondary)";
      }}
    >
      {children}
    </button>
  );
}

interface StepItemProps {
  step: StepModel;
  idx: number;
  isActive: boolean;
  isPast: boolean;
  onClick: () => void;
}

function StepItem({ step, idx, isActive, isPast, onClick }: StepItemProps) {
  const c = phaseColor(step.phase);
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        width: "100%",
        padding: "8px 12px",
        background: isActive ? `${c}12` : "transparent",
        border: "none",
        borderLeft: `2px solid ${isActive ? c : isPast ? `${c}50` : "transparent"}`,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.12s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--bg-surface)";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLButtonElement).style.background = isActive
            ? `${c}12`
            : "transparent";
      }}
    >
      {/* Step number bubble */}
      <Box
        flexShrink={0}
        style={{ marginTop: "2px" }}
        w="18px"
        h="18px"
        borderRadius="full"
        bg={isActive ? c : isPast ? `${c}30` : "var(--bg-elevated)"}
        border={`1px solid ${isActive ? c : isPast ? `${c}50` : "var(--border)"}`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          fontSize="8px"
          fontWeight="800"
          fontFamily="'JetBrains Mono', monospace"
          color={isActive ? "var(--bg-base)" : isPast ? c : "var(--text-ghost)"}
        >
          {idx + 1}
        </Text>
      </Box>

      <Box flex="1" minW="0">
        <Text
          fontSize="11px"
          fontWeight={isActive ? "600" : "400"}
          color={isActive ? "var(--text-primary)" : "var(--text-secondary)"}
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          mb="2px"
        >
          {step.title}
        </Text>
        <Flex align="center" gap="5px">
          <Box w="5px" h="5px" borderRadius="full" bg={c} flexShrink={0} />
          <Text
            fontSize="10px"
            color="var(--text-ghost)"
            fontFamily="'JetBrains Mono', monospace"
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {step.phase} · L{step.line}
          </Text>
        </Flex>
      </Box>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function DebuggerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as DebuggerState | null;

  // ALL hooks must be declared before any conditional returns
  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Stored result state — populated either from location state, sessionStorage, or a fresh fetch
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const steps = analysis?.steps ?? [];
  const total = steps.length;

  // Get scope entries from current step
  const scopeEntries = useMemo<[string, ScopeEntry][]>(() => {
    if (!analysis || !steps[idx]?.scope) return [];
    return Object.entries(steps[idx].scope as ScopeEntries);
  }, [analysis, steps, idx]);

  // On mount: resolve data from location state → sessionStorage → fresh fetch
  useEffect(() => {
    // Fresh navigation from editor with code to run
    if (state?.loading && state.code) {
      // Check sessionStorage first — if same code, reuse cached result
      const saved = sessionStorage.getItem("eval_last_debug");
      if (saved) {
        try {
          const cached = JSON.parse(saved) as DebuggerState;
          if (cached.code === state.code && cached.analysis) {
            setAnalysis(cached.analysis);
            setIdx(0);
            return;
          }
        } catch {
          /* ignore */
        }
      }
      // Different code — run it
      setIsLoading(true);
      setRunError(null);
      setAnalysis(null);
      setIdx(0);
      fetchRunCode(state.code)
        .then((result) => {
          setAnalysis(result);
          sessionStorage.setItem(
            "eval_last_debug",
            JSON.stringify({ analysis: result, code: state.code }),
          );
        })
        .catch((err) => {
          setRunError(
            err instanceof Error
              ? err.message
              : "Network error — is the backend running?",
          );
        })
        .finally(() => setIsLoading(false));
      return;
    }

    // Returning to /debug via nav link — restore from location state or sessionStorage
    if (state?.analysis) {
      setAnalysis(state.analysis);
      setIdx(0);
      return;
    }
    const saved = sessionStorage.getItem("eval_last_debug");
    if (saved) {
      try {
        const cached = JSON.parse(saved) as DebuggerState;
        if (cached.analysis) {
          setAnalysis(cached.analysis);
          setIdx(0);
        }
      } catch {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  // Inject scrollbar CSS once
  useEffect(() => {
    injectScrollStyle();
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || !analysis) return;
    if (idx >= total - 1) {
      setIsPlaying(false);
      return;
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 650);
    return () => clearTimeout(t);
  }, [isPlaying, idx, total, analysis]);

  // Scroll active step into view
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [idx]);

  const goFirst = useCallback(() => {
    setIsPlaying(false);
    setIdx(0);
  }, []);

  const goPrev = useCallback(() => {
    setIsPlaying(false);
    setIdx((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIsPlaying(false);
    setIdx((i) => Math.min(total - 1, i + 1));
  }, [total]);

  const goLast = useCallback(() => {
    setIsPlaying(false);
    setIdx(total - 1);
  }, [total]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  // ── Loading screen ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Flex
        direction="column"
        h="100%"
        align="center"
        justify="center"
        bg="var(--bg-base)"
        gap="14px"
      >
        <Box
          w="36px"
          h="36px"
          borderRadius="full"
          border={`3px solid ${AMBER_BORDER}`}
          borderTop={`3px solid ${AMBER}`}
          style={{ animation: "dbg-spin 0.75s linear infinite" }}
        />
        <style>{`@keyframes dbg-spin { to { transform: rotate(360deg); } }`}</style>
        <Text
          fontSize="13px"
          fontWeight="600"
          color={AMBER}
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.08em"
        >
          RUNNING...
        </Text>
        <Text fontSize="11px" color="var(--text-ghost)" fontFamily="monospace">
          Analysing your code
        </Text>
      </Flex>
    );
  }

  // ── Error screen ──────────────────────────────────────────────────────────
  if (runError) {
    return (
      <Flex
        direction="column"
        h="100%"
        align="center"
        justify="center"
        bg="var(--bg-base)"
        gap="14px"
      >
        <AlertTriangle size={32} color="#f87171" style={{ opacity: 0.7 }} />
        <Text
          fontSize="14px"
          fontWeight="600"
          color="#f87171"
          fontFamily="'JetBrains Mono', monospace"
        >
          Run failed
        </Text>
        <Box
          px="24px"
          py="10px"
          borderRadius="8px"
          bg="rgba(248,113,113,0.08)"
          border="1px solid rgba(248,113,113,0.25)"
          maxW="480px"
        >
          <Text
            fontSize="12px"
            color="#f87171"
            fontFamily="'JetBrains Mono', monospace"
            style={{ wordBreak: "break-all" }}
          >
            {runError}
          </Text>
        </Box>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 18px",
            background: AMBER_DIM,
            border: `1px solid ${AMBER_BORDER}`,
            borderRadius: "7px",
            color: AMBER,
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "'JetBrains Mono', monospace",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          <ArrowLeft size={13} /> Back to Editor
        </button>
      </Flex>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!analysis) {
    return (
      <Flex
        direction="column"
        h="100%"
        align="center"
        justify="center"
        bg="var(--bg-base)"
        gap="16px"
      >
        <Bug size={36} color={AMBER} style={{ opacity: 0.5 }} />
        <Text
          fontSize="15px"
          fontWeight="600"
          color="var(--text-secondary)"
          fontFamily="'JetBrains Mono', monospace"
        >
          No execution trace yet
        </Text>
        <Text fontSize="12px" color="var(--text-ghost)" fontFamily="monospace">
          Run some code from the Editor first.
        </Text>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 18px",
            background: AMBER_DIM,
            border: `1px solid ${AMBER_BORDER}`,
            borderRadius: "7px",
            color: AMBER,
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "'JetBrains Mono', monospace",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          <ArrowLeft size={13} /> Go to Editor
        </button>
      </Flex>
    );
  }

  const step = steps[idx];
  const atStart = idx === 0;
  const atEnd = idx === total - 1;
  const progress = total > 1 ? (idx / (total - 1)) * 100 : 100;
  const hasErrors = analysis.has_errors || analysis.errors.length > 0;
  const finalOutput = analysis.output.length
    ? analysis.output
    : (step?.output ?? []);

  return (
    <Flex direction="column" h="100%" bg="var(--bg-base)" overflow="hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <Flex
        h="48px"
        align="center"
        px="16px"
        gap="10px"
        borderBottom="1px solid var(--border)"
        flexShrink={0}
        bg="var(--bg-panel)"
        position="relative"
      >
        {/* Progress underline */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          h="2px"
          style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
          bg={`linear-gradient(90deg, ${AMBER}, ${AMBER}55)`}
          borderRadius="0 1px 1px 0"
        />

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          title="Back to editor"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace",
            padding: "4px 8px",
            borderRadius: "5px",
            transition: "all 0.12s ease",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "var(--bg-surface)";
            b.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "transparent";
            b.style.color = "var(--text-secondary)";
          }}
        >
          <ArrowLeft size={13} /> Editor
        </button>

        <Box w="1px" h="20px" bg="var(--border)" />

        {/* Title */}
        <Flex align="center" gap="6px">
          <Bug
            size={13}
            color={AMBER}
            style={{ filter: `drop-shadow(0 0 4px ${AMBER}80)` }}
          />
          <Text
            fontSize="12px"
            fontWeight="700"
            color={AMBER}
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.1em"
            style={{ textShadow: `0 0 8px ${AMBER}50` }}
          >
            EXECUTION TRACE
          </Text>
        </Flex>

        {/* Status */}
        <Flex align="center" gap="5px" ml="4px">
          {hasErrors ? (
            <>
              <AlertTriangle size={11} color="#f87171" />
              <Text fontSize="11px" color="#f87171" fontFamily="monospace">
                {analysis.errors.length} error
                {analysis.errors.length !== 1 ? "s" : ""}
              </Text>
            </>
          ) : (
            <>
              <CheckCircle size={11} color="#4ade80" />
              <Text fontSize="11px" color="#4ade80" fontFamily="monospace">
                clean
              </Text>
            </>
          )}
        </Flex>

        <Box flex="1" />

        {/* Transport controls */}
        <Flex align="center" gap="3px">
          <TBtn onClick={goFirst} disabled={atStart} title="First step">
            <SkipBack size={12} />
          </TBtn>
          <TBtn onClick={goPrev} disabled={atStart} title="Previous">
            <ChevronLeft size={14} />
          </TBtn>
          <TBtn
            onClick={togglePlay}
            disabled={atEnd && !isPlaying}
            active={isPlaying}
            title={isPlaying ? "Pause" : "Auto-play"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </TBtn>
          <TBtn onClick={goNext} disabled={atEnd} title="Next">
            <ChevronRight size={14} />
          </TBtn>
          <TBtn onClick={goLast} disabled={atEnd} title="Last step">
            <SkipForward size={12} />
          </TBtn>
        </Flex>

        <Box w="1px" h="20px" bg="var(--border)" mx="4px" />
        <Text
          fontSize="12px"
          fontFamily="'JetBrains Mono', monospace"
          color={AMBER}
          fontWeight="700"
        >
          {idx + 1}
        </Text>
        <Text fontSize="11px" fontFamily="monospace" color="var(--text-ghost)">
          / {total}
        </Text>
      </Flex>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <Flex flex="1" overflow="hidden">
        {/* LEFT — step timeline */}
        <Flex
          direction="column"
          w="230px"
          flexShrink={0}
          borderRight="1px solid var(--border)"
          bg="var(--bg-panel)"
          overflow="hidden"
        >
          <Flex
            h="32px"
            align="center"
            px="12px"
            gap="6px"
            borderBottom="1px solid var(--border-subtle)"
            flexShrink={0}
          >
            <Layers size={11} color="var(--text-ghost)" />
            <Text
              fontSize="10px"
              fontWeight="700"
              color="var(--text-ghost)"
              letterSpacing="0.1em"
              fontFamily="monospace"
            >
              STEPS
            </Text>
          </Flex>

          <Box
            flex="1"
            overflowY="auto"
            className="dbg-scroll"
            ref={timelineRef}
          >
            {steps.map((s, i) => (
              <Box key={s.id} ref={i === idx ? activeItemRef : undefined}>
                <StepItem
                  step={s}
                  idx={i}
                  isActive={i === idx}
                  isPast={i < idx}
                  onClick={() => {
                    setIsPlaying(false);
                    setIdx(i);
                  }}
                />
              </Box>
            ))}
          </Box>
        </Flex>

        {/* CENTER + RIGHT */}
        <Flex direction="column" flex="1" overflow="hidden">
          <Flex flex="1" overflow="hidden">
            {/* CENTER — step detail */}
            <Flex
              direction="column"
              flex="1"
              overflow="hidden"
              borderRight="1px solid var(--border)"
            >
              <Flex
                h="32px"
                align="center"
                px="16px"
                gap="6px"
                borderBottom="1px solid var(--border-subtle)"
                flexShrink={0}
              >
                <FileCode size={11} color="var(--text-ghost)" />
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  color="var(--text-ghost)"
                  letterSpacing="0.1em"
                  fontFamily="monospace"
                >
                  STEP DETAIL
                </Text>
              </Flex>

              <Box flex="1" overflowY="auto" p="20px" className="dbg-scroll">
                {step && (
                  <Box className="dbg-card" key={step.id}>
                    {/* Phase + line badges */}
                    <Flex align="center" gap="8px" mb="14px" flexWrap="wrap">
                      <PhaseBadge phase={step.phase} />
                      <Box
                        px="7px"
                        py="2px"
                        borderRadius="4px"
                        bg="var(--bg-elevated)"
                        border="1px solid var(--border)"
                      >
                        <Text
                          fontSize="10px"
                          fontFamily="'JetBrains Mono', monospace"
                          color="var(--text-muted)"
                          letterSpacing="0.08em"
                        >
                          line {step.line}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Title */}
                    <Text
                      fontSize="17px"
                      fontWeight="700"
                      color="var(--text-primary)"
                      mb="8px"
                      lineHeight="1.3"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {step.title}
                    </Text>

                    {/* Description */}
                    {step.description && (
                      <Text
                        fontSize="13px"
                        color="var(--text-secondary)"
                        lineHeight="1.7"
                        mb="16px"
                      >
                        {step.description}
                      </Text>
                    )}

                    {/* Details */}
                    {step.details && (
                      <Box
                        mb="16px"
                        p="12px"
                        borderRadius="8px"
                        bg="var(--bg-elevated)"
                        border="1px solid var(--border)"
                      >
                        <Text
                          fontSize="12px"
                          color="var(--text-secondary)"
                          lineHeight="1.7"
                          fontFamily="'JetBrains Mono', monospace"
                          whiteSpace="pre-wrap"
                        >
                          {step.details}
                        </Text>
                      </Box>
                    )}

                    {/* Changed */}
                    {step.changed && (
                      <Flex
                        align="center"
                        gap="8px"
                        mb="16px"
                        p="10px 12px"
                        borderRadius="7px"
                        bg={AMBER_DIM}
                        border={`1px solid ${AMBER_BORDER}`}
                      >
                        <Text
                          fontSize="10px"
                          fontWeight="700"
                          color={AMBER}
                          letterSpacing="0.1em"
                          fontFamily="monospace"
                          flexShrink={0}
                        >
                          CHANGED
                        </Text>
                        <Text
                          fontSize="12px"
                          fontFamily="'JetBrains Mono', monospace"
                          color="var(--text-primary)"
                          style={{ wordBreak: "break-all" }}
                        >
                          {step.changed}
                        </Text>
                      </Flex>
                    )}

                    {/* Step output */}
                    {step.output.length > 0 && (
                      <Box>
                        <Text
                          fontSize="10px"
                          fontWeight="700"
                          color="var(--text-ghost)"
                          letterSpacing="0.1em"
                          fontFamily="monospace"
                          mb="8px"
                        >
                          STEP OUTPUT
                        </Text>
                        <Box
                          p="10px 12px"
                          borderRadius="7px"
                          bg="rgba(74,222,128,0.05)"
                          border="1px solid rgba(74,222,128,0.15)"
                        >
                          {step.output.map((line, i) => (
                            <Text
                              key={i}
                              fontSize="12px"
                              fontFamily="'JetBrains Mono', monospace"
                              color="#4ade80"
                              lineHeight="1.7"
                              whiteSpace="pre-wrap"
                            >
                              {line}
                            </Text>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Flex>

            {/* RIGHT — scope inspector */}
            <Flex direction="column" w="260px" flexShrink={0} overflow="hidden">
              <Flex
                h="32px"
                align="center"
                px="12px"
                gap="6px"
                borderBottom="1px solid var(--border-subtle)"
                flexShrink={0}
              >
                <Variable size={11} color="var(--text-ghost)" />
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  color="var(--text-ghost)"
                  letterSpacing="0.1em"
                  fontFamily="monospace"
                >
                  SCOPE
                </Text>
                {scopeEntries.length > 0 && (
                  <Box
                    ml="auto"
                    px="5px"
                    py="1px"
                    borderRadius="3px"
                    bg="var(--bg-elevated)"
                  >
                    <Text
                      fontSize="9px"
                      color="var(--text-ghost)"
                      fontFamily="monospace"
                    >
                      {scopeEntries.length}
                    </Text>
                  </Box>
                )}
              </Flex>

              <Box flex="1" overflowY="auto" className="dbg-scroll">
                {scopeEntries.length === 0 ? (
                  <Flex h="60px" align="center" justify="center">
                    <Text
                      fontSize="11px"
                      color="var(--text-ghost)"
                      fontFamily="monospace"
                    >
                      — empty —
                    </Text>
                  </Flex>
                ) : (
                  scopeEntries.map(([name, entry]) => (
                    <Box
                      key={name}
                      className="dbg-scope-row"
                      px="12px"
                      py="8px"
                      borderBottom="1px solid var(--border-subtle)"
                      style={{ transition: "background 0.1s" }}
                    >
                      <Flex align="center" gap="5px" mb="3px">
                        <Text
                          fontSize="12px"
                          fontWeight="600"
                          color="var(--text-primary)"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {name}
                        </Text>
                        {entry.const && <Lock size={9} color={AMBER} />}
                        <Box
                          ml="auto"
                          px="5px"
                          py="1px"
                          borderRadius="3px"
                          bg="var(--bg-elevated)"
                          border="1px solid var(--border)"
                        >
                          <Text
                            fontSize="9px"
                            color="var(--text-ghost)"
                            fontFamily="'JetBrains Mono', monospace"
                          >
                            {entry.type}
                          </Text>
                        </Box>
                      </Flex>
                      <ScopeValue value={entry.value} />
                    </Box>
                  ))
                )}
              </Box>
            </Flex>
          </Flex>

          {/* BOTTOM — program output */}
          <Box
            h="160px"
            flexShrink={0}
            borderTop="1px solid var(--border)"
            bg="var(--bg-panel)"
          >
            <Flex
              h="32px"
              align="center"
              px="16px"
              gap="6px"
              borderBottom="1px solid var(--border-subtle)"
            >
              <Terminal size={11} color="var(--text-ghost)" />
              <Text
                fontSize="10px"
                fontWeight="700"
                color="var(--text-ghost)"
                letterSpacing="0.1em"
                fontFamily="monospace"
              >
                OUTPUT
              </Text>
              {hasErrors && (
                <Box ml="auto">
                  <Text fontSize="10px" color="#f87171" fontFamily="monospace">
                    {analysis.errors.length} error
                    {analysis.errors.length !== 1 ? "s" : ""}
                  </Text>
                </Box>
              )}
            </Flex>

            <Box
              h="128px"
              overflowY="auto"
              px="16px"
              py="10px"
              className="dbg-scroll"
              fontFamily="'JetBrains Mono', 'Courier New', monospace"
              fontSize="12px"
              lineHeight="1.7"
            >
              {finalOutput.length === 0 && analysis.errors.length === 0 && (
                <Text color="var(--text-ghost)" userSelect="none">
                  // no output
                </Text>
              )}
              {finalOutput.map((line, i) => (
                <Text key={i} color="var(--text-primary)" whiteSpace="pre-wrap">
                  {line}
                </Text>
              ))}
              {analysis.errors.map((e, i) => (
                <Flex key={i} gap="8px" align="flex-start">
                  <Text color="#f87171" flexShrink={0}>
                    ✗
                  </Text>
                  <Text color="#f87171" whiteSpace="pre-wrap">
                    [{e.line_number}:{e.column_number}] {e.message}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
