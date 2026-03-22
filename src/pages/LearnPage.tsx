import { useState } from "react";
import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LESSONS, LESSONS_BY_DIFFICULTY, Lesson } from "@/data/lessons";
import { LessonCard } from "@/components/learn/LessonCard";
import { LessonView } from "@/components/learn/LessonView";
import { LearnHero } from "@/components/learn/LearnHero";


// ─── Difficulty section header ────────────────────────────────────────────────
const DIFF_META = {
  Beginner:     { color: "#4ade80", label: "BEGINNER"     },
  Intermediate: { color: "#facc15", label: "INTERMEDIATE" },
  Advanced:     { color: "#f87171", label: "ADVANCED"     },
};

function DifficultySection({
  level,
  lessons,
  globalStartIndex,
  onSelect,
}: {
  level: keyof typeof DIFF_META;
  lessons: Lesson[];
  globalStartIndex: number;
  onSelect: (lesson: Lesson) => void;
}) {
  const { color, label } = DIFF_META[level];

  return (
    <Box mb="44px">
      <Flex align="center" gap="10px" mb="18px">
        <Box w="3px" h="16px" bg={color} borderRadius="2px" />
        <Text fontSize="11px" fontWeight="800" color={color} fontFamily="monospace" letterSpacing="0.14em">
          {label}
        </Text>
        <Box px="8px" py="3px" bg={`${color}10`} border={`1px solid ${color}30`} borderRadius="20px">
          <Text fontSize="10px" color={color} fontFamily="monospace" letterSpacing="0.06em">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
          </Text>
        </Box>
        <Box flex={1} h="1px" bg="var(--border)" />
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(296px, 1fr))" gap="14px">
        {lessons.map((lesson, i) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            index={globalStartIndex + i}
            onClick={() => onSelect(lesson)}
          />
        ))}
      </Grid>
    </Box>
  );
}

// ─── Quick stats bar ──────────────────────────────────────────────────────────
function QuickStats() {
  const totalSections = LESSONS.reduce((a, l) => a + l.sections.length, 0);
  const totalTopics   = LESSONS.reduce((a, l) => a + l.topics.length, 0);

  const stats = [
    { label: "Lessons",  value: LESSONS.length  },
    { label: "Sections", value: totalSections    },
    { label: "Topics",   value: totalTopics      },
    { label: "Language", value: "EVAL"           },
  ];

  return (
    <Flex gap="0" border="1px solid var(--border)" borderRadius="10px" overflow="hidden" mb="36px">
      {stats.map((s, i) => (
        <Flex
          key={s.label}
          flex={1}
          direction="column"
          align="center"
          justify="center"
          py="14px"
          px="12px"
          bg="var(--bg-surface)"
          borderRight={i < stats.length - 1 ? "1px solid var(--border)" : "none"}
          gap="4px"
        >
          <Text
            fontSize="20px"
            fontWeight="900"
            color="var(--text-primary)"
            fontFamily="'Courier New', monospace"
            letterSpacing="-0.02em"
          >
            {s.value}
          </Text>
          <Text
            fontSize="9px"
            color="var(--text-ghost)"
            fontFamily="monospace"
            letterSpacing="0.1em"
            textTransform="uppercase"
          >
            {s.label}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export const LearnPage = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  /**
   * Navigate to the editor pre-loaded with a specific code string.
   * Each code block on the lesson page calls this with its own snippet,
   * so the user lands in the editor with exactly the example they clicked.
   */
  const openInEditor = (code: string) => {
    navigate("/", { state: { code, language: "eval" } });
  };

  // ── Lesson detail view ────────────────────────────────────────────────────
  if (selectedLesson) {
    const globalIndex = LESSONS.findIndex((l) => l.id === selectedLesson.id);
    return (
      <LessonView
        lesson={selectedLesson}
        lessonIndex={globalIndex}
        totalLessons={LESSONS.length}
        onBack={() => setSelectedLesson(null)}
        onTryInEditor={openInEditor}
      />
    );
  }

  // ── Lesson grid ───────────────────────────────────────────────────────────
  const beginnerStart     = 0;
  const intermediateStart = LESSONS_BY_DIFFICULTY.Beginner.length;
  const advancedStart     = intermediateStart + LESSONS_BY_DIFFICULTY.Intermediate.length;

  return (
    <Box h="100%" overflow="auto" bg="var(--bg-panel)">
      <LearnHero lessonCount={LESSONS.length} />

      <Box px={{ base: "24px", md: "48px" }} py="36px">
        <QuickStats />

        <DifficultySection
          level="Beginner"
          lessons={LESSONS_BY_DIFFICULTY.Beginner}
          globalStartIndex={beginnerStart}
          onSelect={setSelectedLesson}
        />
        <DifficultySection
          level="Intermediate"
          lessons={LESSONS_BY_DIFFICULTY.Intermediate}
          globalStartIndex={intermediateStart}
          onSelect={setSelectedLesson}
        />
        <DifficultySection
          level="Advanced"
          lessons={LESSONS_BY_DIFFICULTY.Advanced}
          globalStartIndex={advancedStart}
          onSelect={setSelectedLesson}
        />

        <Flex align="center" justify="center" pt="8px" pb="20px" borderTop="1px solid var(--border)">
          <Text fontSize="11px" color="var(--text-ghost)" fontFamily="monospace" letterSpacing="0.06em">
            EVAL Language — Interactive Learning Environment
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default LearnPage;