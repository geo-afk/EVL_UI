import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface QuizQuestion {
  q: string; // question text
  options: string[]; // exactly 4 choices
  correct: number; // 0-based index of the right answer
  explanation: string; // shown after the user answers
}

interface SectionQuizProps {
  questions: QuizQuestion[];
  accent: string;
}

// ─── Single question view ─────────────────────────────────────────────────────
function QuestionView({
  question,
  accent,
  onAnswered,
}: {
  question: QuizQuestion;
  accent: string;
  onAnswered: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    onAnswered(idx === question.correct);
  };

  const getOptionStyle = (idx: number): React.CSSProperties => {
    if (!answered) {
      return {
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
      };
    }
    if (idx === question.correct) {
      return {
        background: "rgba(74,222,128,0.08)",
        border: "1px solid rgba(74,222,128,0.4)",
        color: "#4ade80",
      };
    }
    if (idx === selected) {
      return {
        background: "rgba(248,113,113,0.08)",
        border: "1px solid rgba(248,113,113,0.35)",
        color: "#fca5a5",
      };
    }
    return {
      background: "transparent",
      border: "1px solid var(--border)",
      color: "var(--text-ghost)",
      opacity: 0.45,
    };
  };

  return (
    <Box>
      {/* Question text */}
      <Text
        fontSize="13px"
        fontWeight="600"
        color="var(--text-primary)"
        lineHeight="1.7"
        mb="14px"
      >
        {question.q}
      </Text>

      {/* Options */}
      <Flex direction="column" gap="7px" mb="14px">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={answered}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "8px",
              cursor: answered ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.15s",
              width: "100%",
              ...getOptionStyle(idx),
            }}
            onMouseEnter={(e) => {
              if (answered) return;
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                `${accent}66`;
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              if (answered) return;
              const s = getOptionStyle(idx);
              (e.currentTarget as HTMLButtonElement).style.borderColor = (
                s.border as string
              ).replace("1px solid ", "");
              (e.currentTarget as HTMLButtonElement).style.color =
                s.color as string;
            }}
          >
            {/* Option letter badge */}
            <Flex
              w="22px"
              h="22px"
              borderRadius="50%"
              flexShrink={0}
              align="center"
              justify="center"
              style={{
                background:
                  answered && idx === question.correct
                    ? "rgba(74,222,128,0.2)"
                    : answered && idx === selected && idx !== question.correct
                      ? "rgba(248,113,113,0.2)"
                      : `${accent}18`,
                border: `1px solid ${
                  answered && idx === question.correct
                    ? "rgba(74,222,128,0.4)"
                    : answered && idx === selected && idx !== question.correct
                      ? "rgba(248,113,113,0.35)"
                      : `${accent}33`
                }`,
              }}
            >
              {answered && idx === question.correct ? (
                <CheckCircle2 size={12} color="#4ade80" />
              ) : answered && idx === selected && idx !== question.correct ? (
                <XCircle size={12} color="#f87171" />
              ) : (
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  fontFamily="monospace"
                  color={accent}
                >
                  {String.fromCharCode(65 + idx)}
                </Text>
              )}
            </Flex>

            <Text
              fontSize="12.5px"
              lineHeight="1.5"
              flex={1}
              fontFamily={
                opt.includes("(") || /^[a-z]+\s/.test(opt)
                  ? "'JetBrains Mono', monospace"
                  : "inherit"
              }
            >
              {opt}
            </Text>
          </button>
        ))}
      </Flex>

      {/* Explanation — shown after answering */}
      {answered && (
        <Flex
          align="flex-start"
          gap="10px"
          p="12px 14px"
          borderRadius="8px"
          bg={
            selected === question.correct
              ? "rgba(74,222,128,0.06)"
              : "rgba(248,113,113,0.06)"
          }
          border={`1px solid ${
            selected === question.correct
              ? "rgba(74,222,128,0.2)"
              : "rgba(248,113,113,0.2)"
          }`}
          style={{
            animation: "quizFadeIn 0.2s ease",
          }}
        >
          {selected === question.correct ? (
            <CheckCircle2
              size={14}
              color="#4ade80"
              style={{ flexShrink: 0, marginTop: "1px" }}
            />
          ) : (
            <XCircle
              size={14}
              color="#f87171"
              style={{ flexShrink: 0, marginTop: "1px" }}
            />
          )}
          <Box>
            <Text
              fontSize="11px"
              fontWeight="700"
              color={selected === question.correct ? "#4ade80" : "#f87171"}
              fontFamily="monospace"
              letterSpacing="0.08em"
              mb="3px"
            >
              {selected === question.correct ? "CORRECT!" : "NOT QUITE"}
            </Text>
            <Text
              fontSize="12.5px"
              color="var(--text-secondary)"
              lineHeight="1.65"
            >
              {question.explanation}
            </Text>
          </Box>
        </Flex>
      )}
    </Box>
  );
}

// ─── Main quiz component ──────────────────────────────────────────────────────
export function SectionQuiz({ questions, accent }: SectionQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);

  const total = questions.length;
  const current = questions[currentIdx];

  const handleAnswered = (correct: boolean) => {
    setAnswered(true);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx((i) => i + 1);
      setAnswered(false);
    } else {
      setDone(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setScore(0);
    setAnswered(false);
    setDone(false);
  };

  const finalPct = Math.round((score / total) * 100);
  const allCorrect = score === total;

  return (
    <Box mt="20px">
      {/* ── Toggle header ───────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          padding: "11px 16px",
          background: open ? `${accent}0c` : "var(--bg-surface)",
          border: `1px solid ${open ? `${accent}33` : "var(--border)"}`,
          borderRadius: open ? "10px 10px 0 0" : "10px",
          cursor: "pointer",
          transition: "all 0.18s",
        }}
        onMouseEnter={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              `${accent}44`;
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border)";
          }
        }}
      >
        <Flex
          w="28px"
          h="28px"
          borderRadius="8px"
          bg={`${accent}14`}
          border={`1px solid ${accent}30`}
          align="center"
          justify="center"
          flexShrink={0}
        >
          <HelpCircle size={13} color={accent} />
        </Flex>

        <Box flex={1} textAlign="left">
          <Text
            fontSize="12px"
            fontWeight="700"
            color="var(--text-primary)"
            fontFamily="monospace"
          >
            Test yourself
          </Text>
          <Text fontSize="10.5px" color="var(--text-ghost)">
            {total} question{total !== 1 ? "s" : ""} on this section
          </Text>
        </Box>

        {/* Score pill — only show if attempted */}
        {done && (
          <Flex
            align="center"
            gap="5px"
            px="8px"
            py="3px"
            bg={allCorrect ? "rgba(74,222,128,0.1)" : "rgba(250,204,21,0.1)"}
            border={`1px solid ${allCorrect ? "rgba(74,222,128,0.3)" : "rgba(250,204,21,0.3)"}`}
            borderRadius="20px"
          >
            {allCorrect && <CheckCircle2 size={10} color="#4ade80" />}
            <Text
              fontSize="10px"
              fontWeight="700"
              color={allCorrect ? "#4ade80" : "#facc15"}
              fontFamily="monospace"
            >
              {score}/{total}
            </Text>
          </Flex>
        )}

        <Box
          color="var(--text-ghost)"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.18s",
          }}
        >
          <ChevronRight size={14} />
        </Box>
      </button>

      {/* ── Quiz body ───────────────────────────────────────────── */}
      {open && (
        <Box
          p="20px 22px"
          bg="var(--bg-base)"
          border={`1px solid ${accent}22`}
          borderTop="none"
          borderRadius="0 0 10px 10px"
          style={{ animation: "quizFadeIn 0.18s ease" }}
        >
          {!done ? (
            <>
              {/* Progress dots */}
              {total > 1 && (
                <Flex align="center" gap="6px" mb="16px">
                  {questions.map((_, i) => (
                    <Box
                      key={i}
                      h="3px"
                      flex={1}
                      borderRadius="2px"
                      bg={
                        i < currentIdx
                          ? "#4ade80"
                          : i === currentIdx
                            ? accent
                            : "var(--bg-elevated)"
                      }
                      transition="background 0.2s"
                    />
                  ))}
                  <Text
                    fontSize="10px"
                    color="var(--text-ghost)"
                    fontFamily="monospace"
                    flexShrink={0}
                    ml="4px"
                  >
                    {currentIdx + 1}/{total}
                  </Text>
                </Flex>
              )}

              <QuestionView
                key={currentIdx}
                question={current}
                accent={accent}
                onAnswered={handleAnswered}
              />

              {/* Next / done button */}
              {answered && (
                <Flex justify="flex-end" mt="14px">
                  <button
                    onClick={handleNext}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: accent,
                      border: "none",
                      borderRadius: "8px",
                      color: "var(--bg-base)",
                      fontSize: "12px",
                      fontWeight: "700",
                      fontFamily: "monospace",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.opacity =
                        "0.85";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.opacity =
                        "1";
                    }}
                  >
                    {currentIdx < total - 1 ? "Next question" : "See results"}
                    <ChevronRight size={13} />
                  </button>
                </Flex>
              )}
            </>
          ) : (
            /* ── Results screen ── */
            <Flex direction="column" align="center" gap="16px" py="8px">
              {/* Score ring */}
              <Box position="relative" w="72px" h="72px">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke="var(--bg-elevated)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke={allCorrect ? "#4ade80" : accent}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(finalPct / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                    transform="rotate(-90 36 36)"
                    style={{ transition: "stroke-dasharray 0.5s ease" }}
                  />
                </svg>
                <Flex
                  position="absolute"
                  inset="0"
                  align="center"
                  justify="center"
                  direction="column"
                >
                  <Text
                    fontSize="16px"
                    fontWeight="900"
                    color={allCorrect ? "#4ade80" : "var(--text-primary)"}
                    fontFamily="monospace"
                    lineHeight="1"
                  >
                    {score}/{total}
                  </Text>
                </Flex>
              </Box>

              <Box textAlign="center">
                <Text
                  fontSize="14px"
                  fontWeight="700"
                  color={allCorrect ? "#4ade80" : "var(--text-primary)"}
                  mb="4px"
                >
                  {allCorrect
                    ? "Perfect score! 🎉"
                    : score >= total * 0.6
                      ? "Good work!"
                      : "Keep practising!"}
                </Text>
                <Text fontSize="12px" color="var(--text-muted)">
                  {allCorrect
                    ? "You nailed every question in this section."
                    : `You got ${score} out of ${total} right. Re-read the section and try again.`}
                </Text>
              </Box>

              <button
                onClick={handleReset}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: "600",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = `${accent}55`;
                  b.style.color = accent;
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = "var(--border)";
                  b.style.color = "var(--text-muted)";
                }}
              >
                <RefreshCw size={12} />
                Try again
              </button>
            </Flex>
          )}
        </Box>
      )}

      <style>{`
        @keyframes quizFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}

