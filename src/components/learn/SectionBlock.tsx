import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EVALCode } from "./EVALCode";
import { NoteBox } from "./NoteBox";
import { Section } from "@/data/lessons";
import { SectionQuiz } from "./SectionQuiz";


interface SectionBlockProps {
  section: Section;
  accent: string;
  index: number;
  /** Called with the specific code string when the user clicks "Try in Editor" on a block */
  onTryInEditor: (code: string) => void;
}

export function SectionBlock({ section, accent, index, onTryInEditor }: SectionBlockProps) {
  const [open, setOpen] = useState(true);

  return (
    <Box
      border="1px solid var(--border)"
      borderRadius="12px"
      overflow="hidden"
      mb="12px"
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: open ? `0 0 0 1px ${accent}22` : "none" }}
    >
      {/* ── Accordion header ──────────────────────────────────── */}
      <Flex
        align="center"
        justify="space-between"
        px="22px"
        py="16px"
        bg="var(--bg-surface)"
        cursor="pointer"
        onClick={() => setOpen((v) => !v)}
        _hover={{ bg: "var(--bg-elevated)" }}
        transition="background 0.15s"
        gap="12px"
      >
        <Flex align="center" gap="14px">
          {/* Step number pill */}
          <Flex
            w="26px"
            h="26px"
            borderRadius="50%"
            bg={open ? accent : "var(--bg-elevated)"}
            align="center"
            justify="center"
            flexShrink={0}
            transition="background 0.2s"
          >
            <Text
              fontSize="10px"
              fontWeight="800"
              color={open ? "var(--bg-base)" : "var(--text-ghost)"}
              fontFamily="monospace"
            >
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Flex>

          <Text
            fontFamily="'Courier New', monospace"
            fontSize="14px"
            fontWeight="700"
            color={open ? "var(--text-primary)" : "var(--text-secondary)"}
            transition="color 0.15s"
          >
            {section.heading}
          </Text>
        </Flex>

        <Box color={open ? accent : "var(--text-ghost)"} transition="color 0.15s" flexShrink={0}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </Box>
      </Flex>

      {/* ── Accordion body ────────────────────────────────────── */}
      {open && (
        <Box px="22px" py="18px" bg="var(--bg-code)" borderTop={`1px solid ${accent}18`}>
          {/* Prose body */}
          {section.body.split("\n").map((line, i) =>
            line === "" ? (
              <Box key={i} h="10px" />
            ) : (
              <Text key={i} fontSize="13.5px" color="var(--text-secondary)" lineHeight="1.85" mb="4px">
                {line}
              </Text>
            ),
          )}

          {/* Call-out boxes */}
          {section.note && <NoteBox text={section.note} type="note" />}
          {section.tip  && <NoteBox text={section.tip}  type="tip"  />}
          {section.warn && <NoteBox text={section.warn} type="warn" />}

          {/* Code blocks — each gets its own Try in Editor button */}
          {section.codeBlocks?.map((cb, i) => (
            <EVALCode
              key={i}
              code={cb.code}
              label={cb.label}
              accentColor={accent}
              onTryInEditor={() => onTryInEditor(cb.code)}
            />
          ))}

          {/* Quiz — shown at the bottom of the section if questions are defined */}
          {section.quiz && section.quiz.length > 0 && (
            <SectionQuiz questions={section.quiz} accent={accent} />
          )}
        </Box>
      )}
    </Box>
  );
}