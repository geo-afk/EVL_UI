import { Box, Flex, Text } from "@chakra-ui/react";
import { Cpu, BookOpen } from "lucide-react";

const TOKEN_STRIP = [
  { label: "int",          color: "#c084fc" },
  { label: "float",        color: "#c084fc" },
  { label: "string",       color: "#c084fc" },
  { label: "bool",         color: "#c084fc" },
  { label: "const",        color: "#c084fc" },
  { label: "if / else",    color: "#38bdf8" },
  { label: "while",        color: "#38bdf8" },
  { label: "try / catch",  color: "#f87171" },
  { label: "print()",      color: "#86efac" },
  { label: "pow()",        color: "#38bdf8" },
  { label: "sqrt()",       color: "#38bdf8" },
  { label: "abs()",        color: "#38bdf8" },
  { label: "cast()",       color: "#38bdf8" },
  { label: "&&  ||  !",    color: "#f472b6" },
  { label: "++ / --",      color: "#f472b6" },
  { label: "PI",           color: "#fb923c" },
  { label: "YEAR",         color: "#fb923c" },
];

export function LearnHero({ lessonCount }: { lessonCount: number }) {
  return (
    <Box
      px={{ base: "24px", md: "48px" }}
      pt="48px"
      pb="40px"
      borderBottom="1px solid var(--border)"
      position="relative"
      overflow="hidden"
    >
      {/* Grid bg */}
      <Box
        position="absolute"
        inset="0"
        opacity={0.025}
        bgImage="linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)"
        bgSize="36px 36px"
        pointerEvents="none"
      />

      {/* Radial glow */}
      <Box
        position="absolute"
        top="-60px"
        right="-60px"
        w="300px"
        h="300px"
        borderRadius="50%"
        bg="var(--accent)"
        opacity={0.04}
        filter="blur(60px)"
        pointerEvents="none"
      />

      {/* Badge row */}
      <Flex align="center" gap="10px" mb="20px" flexWrap="wrap">
        <Flex
          align="center"
          gap="7px"
          px="12px"
          py="5px"
          bg="var(--accent-dim)"
          border="1px solid var(--accent-border)"
          borderRadius="20px"
        >
          <Cpu size={11} color="#fb923c" />
          <Text fontSize="10px" color="#fb923c" fontFamily="monospace" letterSpacing="0.12em" fontWeight="700">
            EVAL LANGUAGE
          </Text>
        </Flex>

        <Flex align="center" gap="7px" px="12px" py="5px" bg="var(--bg-surface)" border="1px solid var(--border)" borderRadius="20px">
          <BookOpen size={11} color="var(--text-ghost)" />
          <Text fontSize="10px" color="var(--text-ghost)" fontFamily="monospace" letterSpacing="0.1em">
            {lessonCount} LESSONS
          </Text>
        </Flex>

        <Flex align="center" gap="5px">
          <Box w="6px" h="6px" borderRadius="50%" bg="#4ade80" />
          <Text fontSize="10px" color="var(--text-ghost)" fontFamily="monospace">
            Beginner Friendly
          </Text>
        </Flex>
      </Flex>

      {/* Headline */}
      <Text
        fontSize={{ base: "36px", md: "52px" }}
        fontWeight="900"
        color="var(--text-primary)"
        fontFamily="'Courier New', monospace"
        letterSpacing="-0.04em"
        lineHeight="1.1"
        mb="6px"
      >
        Learn{" "}
        <Box as="span" color="var(--accent)" position="relative">
          EVAL
          <Box
            as="span"
            position="absolute"
            bottom="-2px"
            left="0"
            right="0"
            h="3px"
            bg="var(--accent)"
            opacity={0.4}
            borderRadius="2px"
          />
        </Box>
      </Text>
      <Text
        fontSize={{ base: "36px", md: "52px" }}
        fontWeight="900"
        color="var(--text-muted)"
        fontFamily="'Courier New', monospace"
        letterSpacing="-0.04em"
        lineHeight="1.1"
        mb="22px"
        opacity={0.35}
      >
        from scratch.
      </Text>

      <Text fontSize="14.5px" color="var(--text-muted)" mb="32px" maxW="580px" lineHeight="1.75">
        A complete, beginner-friendly guide to the EVAL programming language — from your very first
        variable to control flow, error handling, and real programs. Every concept explained simply
        with working examples.
      </Text>

      {/* Token strip */}
      <Flex gap="6px" wrap="wrap">
        {TOKEN_STRIP.map((item) => (
          <Box
            key={item.label}
            px="10px"
            py="5px"
            bg="var(--bg-surface)"
            border="1px solid var(--border)"
            borderRadius="5px"
            transition="all 0.15s"
            _hover={{ borderColor: `${item.color}44`, bg: "var(--bg-elevated)" }}
          >
            <Text
              fontSize="10.5px"
              color={item.color}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
            >
              {item.label}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}