import { Box, Flex, Text } from "@chakra-ui/react";
import { ChevronLeft, Clock, BookOpen } from "lucide-react";
import { SectionBlock } from "./SectionBlock";
import { Lesson } from "@/data/lessons";
import { DIFF_COLORS } from "@/util/lesson-helpers";


type LessonViewProps = {
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  onBack: () => void;
  onTryInEditor: (code: string) => void;  // <--- change here
}

export function LessonView({
  lesson,
  lessonIndex,
  totalLessons,
  onBack,
  onTryInEditor,
}: LessonViewProps) {
  const diff = DIFF_COLORS[lesson.difficulty];

  return (
    <Flex h="100%" overflow="hidden" bg="var(--bg-panel)">

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <Box
        w="230px"
        flexShrink={0}
        bg="var(--bg-code)"
        borderRight="1px solid var(--border)"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Back button */}
        <Box px="16px" pt="20px" pb="16px" borderBottom="1px solid var(--border)">
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-muted)",
              fontSize: "11px",
              fontFamily: "monospace",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              cursor: "pointer",
              padding: "7px 12px",
              letterSpacing: "0.04em",
              width: "100%",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.color = "var(--text-primary)";
              b.style.borderColor = "var(--border)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.color = "var(--text-muted)";
              b.style.borderColor = "var(--border-subtle)";
            }}
          >
            <ChevronLeft size={12} />
            All Lessons
          </button>
        </Box>

        {/* Lesson meta */}
        <Box px="16px" py="16px" borderBottom="1px solid var(--border)">
          <Flex align="center" gap="6px" mb="6px">
            <Text fontSize="9px" color="var(--text-ghost)" fontFamily="monospace">
              {String(lessonIndex + 1).padStart(2, "0")} / {String(totalLessons).padStart(2, "0")}
            </Text>
            <Box
              px="6px"
              py="2px"
              bg={diff.bg}
              border="1px solid"
              borderColor={diff.border}
              borderRadius="20px"
            >
              <Text fontSize="9px" color={diff.color} fontFamily="monospace" fontWeight="700" letterSpacing="0.06em">
                {lesson.difficulty.toUpperCase()}
              </Text>
            </Box>
          </Flex>

          <Text
            fontSize="13px"
            fontWeight="800"
            color="var(--text-primary)"
            fontFamily="'Courier New', monospace"
            lineHeight="1.3"
            mb="8px"
          >
            {lesson.title}
          </Text>

          <Flex align="center" gap="6px" color="var(--text-ghost)">
            <Clock size={10} />
            <Text fontSize="10px" fontFamily="monospace">
              ~{lesson.sections.length * 2} min read
            </Text>
          </Flex>
        </Box>

        {/* Sections nav */}
        <Box flex={1} overflow="auto" px="12px" py="14px">
          <Flex align="center" gap="6px" mb="10px" px="4px">
            <BookOpen size={10} color="var(--text-ghost)" />
            <Text fontSize="9px" color="var(--text-ghost)" fontFamily="monospace" letterSpacing="0.1em">
              ON THIS PAGE
            </Text>
          </Flex>

          {lesson.sections.map((s: typeof lesson.sections[number], i: number) => (
            <Flex key={i} align="center" gap="9px" mb="3px">
              <Box
                w="18px"
                h="18px"
                borderRadius="50%"
                bg="var(--bg-surface)"
                border="1px solid var(--border)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text fontSize="8px" color="var(--text-ghost)" fontFamily="monospace" fontWeight="700">
                  {i + 1}
                </Text>
              </Box>
              <Text
                fontSize="11px"
                color="var(--text-muted)"
                fontFamily="monospace"
                lineHeight="1.5"
                cursor="pointer"
                _hover={{ color: lesson.accentColor }}
                transition="color 0.15s"
              >
                {s.heading}
              </Text>
            </Flex>
          ))}

          <Box h="1px" bg="var(--border)" my="16px" />

          <Text
            fontSize="9px"
            color="var(--text-ghost)"
            fontFamily="monospace"
            letterSpacing="0.1em"
            mb="10px"
            px="4px"
          >
            TOPICS COVERED
          </Text>

          <Flex gap="5px" wrap="wrap">
            {lesson.topics.map((t: string) => (
              <Box
                key={t}
                px="7px"
                py="3px"
                bg="var(--bg-surface)"
                border="1px solid var(--border)"
                borderRadius="4px"
              >
                <Text fontSize="9.5px" color="var(--text-ghost)" fontFamily="monospace">
                  {t}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* ── Main content ──────────────────────────────────────────── */}
      <Box flex={1} overflow="auto" p="40px 48px">

        {/* Lesson header — no Try in Editor button here anymore */}
        <Flex align="center" gap="10px" mb="10px">
          <Box
            color={lesson.accentColor}
            p="6px"
            bg={`${lesson.accentColor}12`}
            borderRadius="7px"
            border={`1px solid ${lesson.accentColor}22`}
          >
            {lesson.icon}
          </Box>
          <Text
            fontSize="10px"
            color={lesson.accentColor}
            fontFamily="monospace"
            letterSpacing="0.14em"
            fontWeight="700"
          >
            EVAL — {lesson.subtitle.toUpperCase()}
          </Text>
          <Box
            px="7px"
            py="2px"
            bg={diff.bg}
            border="1px solid"
            borderColor={diff.border}
            borderRadius="20px"
          >
            <Text fontSize="9px" color={diff.color} fontFamily="monospace" fontWeight="700" letterSpacing="0.06em">
              {lesson.difficulty.toUpperCase()}
            </Text>
          </Box>
        </Flex>

        <Text
          fontSize="32px"
          fontWeight="900"
          color="var(--text-primary)"
          fontFamily="'Courier New', monospace"
          letterSpacing="-0.03em"
          lineHeight="1.15"
          mb="12px"
        >
          {lesson.title}
        </Text>

        <Text fontSize="14px" color="var(--text-muted)" lineHeight="1.7" maxW="580px" mb="8px">
          {lesson.description}
        </Text>

        {/* Hint that each code block is interactive */}
        <Flex align="center" gap="6px" mb="28px">
          <Box w="6px" h="6px" borderRadius="50%" bg={lesson.accentColor} opacity={0.6} />
          <Text fontSize="11px" color="var(--text-ghost)" fontFamily="monospace" letterSpacing="0.04em">
            Each code example has its own{" "}
            <Box as="span" color={lesson.accentColor} opacity={0.8}>
              Try in Editor
            </Box>{" "}
            button — click it to open that specific snippet.
          </Text>
        </Flex>

        <Box h="1px" bg="var(--border)" mb="28px" />

        {/* Sections — each SectionBlock gets the onTryInEditor callback */}
        {lesson.sections.map((s: typeof lesson.sections[number], i) => (
          <SectionBlock
            key={i}
            section={s}
            accent={lesson.accentColor}
            index={i}
            onTryInEditor={onTryInEditor}
          />
        ))}
      </Box>
    </Flex>
  );
}