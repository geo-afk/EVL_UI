import { Lesson } from "@/data/lessons";
import { DIFF_COLORS, estimateReadTime } from "@/util/lesson-helpers";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ChevronRight, Clock } from "lucide-react";


export function LessonCard({ lesson, onClick, index }: { lesson: Lesson; onClick: () => void; index: number }) {
  const diff = DIFF_COLORS[lesson.difficulty];
  const readTime = estimateReadTime(lesson);

  return (
    <Box
      bg="var(--bg-panel)"
      border="1px solid var(--border)"
      borderRadius="14px"
      cursor="pointer"
      transition="all 0.22s ease"
      onClick={onClick}
      role="button"
      position="relative"
      overflow="hidden"
      _hover={{
        borderColor: `${lesson.accentColor}55`,
        transform: "translateY(-4px)",
        boxShadow: `0 12px 40px ${lesson.accentColor}18, 0 4px 12px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Top accent stripe */}
      <Box
        h="3px"
        bg={`linear-gradient(90deg, ${lesson.accentColor}, ${lesson.accentColor}44)`}
      />

      {/* Ambient glow */}
      <Box
        position="absolute"
        top="0"
        right="0"
        w="120px"
        h="120px"
        borderRadius="50%"
        bg={lesson.accentColor}
        opacity={0.04}
        filter="blur(30px)"
        pointerEvents="none"
      />

      <Box p="22px">
        {/* Header row */}
        <Flex justify="space-between" align="center" mb="14px">
          <Flex
            w="40px"
            h="40px"
            borderRadius="10px"
            bg={`${lesson.accentColor}12`}
            border={`1px solid ${lesson.accentColor}28`}
            align="center"
            justify="center"
            color={lesson.accentColor}
            flexShrink={0}
          >
            {lesson.icon}
          </Flex>

          <Flex align="center" gap="6px">
            <Text
              fontSize="9px"
              fontWeight="700"
              color={diff.color}
              bg={diff.bg}
              border="1px solid"
              borderColor={diff.border}
              px="8px"
              py="3px"
              borderRadius="20px"
              letterSpacing="0.08em"
              fontFamily="monospace"
            >
              {lesson.difficulty.toUpperCase()}
            </Text>
          </Flex>
        </Flex>

        {/* Lesson number + subtitle */}
        <Flex align="center" gap="6px" mb="5px">
          <Text
            fontSize="9px"
            color="var(--text-ghost)"
            fontFamily="monospace"
            letterSpacing="0.08em"
          >
            {String(index + 1).padStart(2, "0")} —
          </Text>
          <Text
            fontSize="9px"
            color={lesson.accentColor}
            fontFamily="monospace"
            letterSpacing="0.1em"
            fontWeight="700"
          >
            {lesson.subtitle.toUpperCase()}
          </Text>
        </Flex>

        <Text
          fontSize="16px"
          fontWeight="800"
          color="var(--text-primary)"
          mb="8px"
          fontFamily="'Courier New', monospace"
          letterSpacing="-0.02em"
          lineHeight="1.3"
        >
          {lesson.title}
        </Text>

        <Text fontSize="12.5px" color="var(--text-muted)" mb="16px" lineHeight="1.65">
          {lesson.description}
        </Text>

        {/* Topics pills */}
        <Flex gap="5px" wrap="wrap" mb="18px" minH="22px">
          {lesson.topics.slice(0, 4).map((t) => (
            <Text
              key={t}
              fontSize="10px"
              color="var(--text-ghost)"
              bg="var(--bg-surface)"
              border="1px solid var(--border)"
              px="8px"
              py="2px"
              borderRadius="4px"
              fontFamily="monospace"
            >
              {t}
            </Text>
          ))}
          {lesson.topics.length > 4 && (
            <Text fontSize="10px" color="var(--text-ghost)" px="2px" py="2px" fontFamily="monospace">
              +{lesson.topics.length - 4}
            </Text>
          )}
        </Flex>

        {/* Footer */}
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="5px" color="var(--text-ghost)">
            <Clock size={11} />
            <Text fontSize="11px" fontFamily="monospace">
              ~{readTime} min
            </Text>
          </Flex>
          <Flex
            align="center"
            gap="4px"
            color={lesson.accentColor}
            fontSize="11.5px"
            fontFamily="monospace"
            fontWeight="600"
          >
            <Text>Open lesson</Text>
            <ChevronRight size={13} />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}