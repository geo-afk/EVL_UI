import { Box, Flex, Text } from "@chakra-ui/react";

type NoteType = "note" | "tip" | "warn";

const NOTE_STYLES: Record<NoteType, { border: string; bg: string; icon: string; label: string; color: string }> = {
  note: {
    border: "rgba(96,165,250,0.25)",
    bg: "rgba(96,165,250,0.05)",
    icon: "💡",
    label: "NOTE",
    color: "#60a5fa",
  },
  tip: {
    border: "rgba(74,222,128,0.25)",
    bg: "rgba(74,222,128,0.05)",
    icon: "✅",
    label: "TIP",
    color: "#4ade80",
  },
  warn: {
    border: "rgba(251,191,36,0.25)",
    bg: "rgba(251,191,36,0.05)",
    icon: "⚠️",
    label: "IMPORTANT",
    color: "#fbbf24",
  },
};

export function NoteBox({ text, type = "note" }: { text: string; type?: NoteType }) {
  const s = NOTE_STYLES[type];
  return (
    <Box
      bg={s.bg}
      border={`1px solid ${s.border}`}
      borderLeft={`3px solid ${s.color}`}
      borderRadius="8px"
      p="14px 18px"
      my="16px"
    >
      <Flex align="center" gap="7px" mb="5px">
        <Text fontSize="12px">{s.icon}</Text>
        <Text
          fontSize="10px"
          fontWeight="700"
          color={s.color}
          letterSpacing="0.12em"
          fontFamily="monospace"
        >
          {s.label}
        </Text>
      </Flex>
      <Text fontSize="13px" color="var(--text-secondary)" lineHeight="1.75">
        {text}
      </Text>
    </Box>
  );
}