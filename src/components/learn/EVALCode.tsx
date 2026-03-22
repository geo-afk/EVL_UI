import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Play, Check } from "lucide-react";

// ─── Token categories ─────────────────────────────────────────────────────────
const KEYWORDS     = ["int","float","string","bool","const","if","else","while","for","break","continue","return","try","catch","print","cast","null"];
const BOOL_LITERALS = ["true", "false"];
const BUILTINS     = ["pow", "sqrt", "min", "max", "round", "abs"];
const CONSTANTS    = ["PI", "DAYS_IN_WEEK", "HOURS_IN_DAY", "YEAR"];

function tokenizeLine(line: string): React.ReactNode[] {
  if (line.trim().startsWith("//")) {
    return [
      <span key="comment" style={{ color: "#6b7280", fontStyle: "italic" }}>
        {line}
      </span>,
    ];
  }

  const wordRx = /(\+\+|--|[+\-*/%]=|-?\d+\.\d+|-?\d+|"[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*|[+\-*/%=!<>&|();{},]|\S)/g;
  const tokens: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = wordRx.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(<span key={`ws-${lastIndex}`} style={{ color: "#d4d4e8" }}>{line.slice(lastIndex, match.index)}</span>);
    }
    const tok = match[0];
    let color = "#d4d4e8";
    if      (KEYWORDS.includes(tok))                                          color = "#c084fc";
    else if (BOOL_LITERALS.includes(tok))                                     color = "#fb923c";
    else if (BUILTINS.includes(tok))                                          color = "#38bdf8";
    else if (CONSTANTS.includes(tok))                                         color = "#fb923c";
    else if (tok === "null")                                                   color = "#94a3b8";
    else if (tok.startsWith('"'))                                             color = "#86efac";
    else if (/^-?\d/.test(tok))                                              color = "#fbbf24";
    else if (["++", "--"].includes(tok))                                      color = "#f472b6";
    else if (["+=", "-=", "*=", "/="].includes(tok))                         color = "#f472b6";
    else if (["+","-","*","/","%","=","!","<",">","&","|"].includes(tok))    color = "#f472b6";

    tokens.push(<span key={`tok-${match.index}`} style={{ color }}>{tok}</span>);
    lastIndex = wordRx.lastIndex;
  }
  if (lastIndex < line.length) {
    tokens.push(<span key="tail" style={{ color: "#d4d4e8" }}>{line.slice(lastIndex)}</span>);
  }
  return tokens;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface EVALCodeProps {
  code: string;
  label?: string;
  /** When provided, a "Try in Editor" button is rendered in the title bar */
  onTryInEditor?: () => void;
  accentColor?: string;
}

export function EVALCode({ code, label, onTryInEditor, accentColor = "#fb923c" }: EVALCodeProps) {
  const lines = code.split("\n");
  const [launched, setLaunched] = useState(false);

  const handleTry = () => {
    if (!onTryInEditor) return;
    onTryInEditor();
    setLaunched(true);
    setTimeout(() => setLaunched(false), 2000);
  };

  return (
    <Box my="16px">
      {/* Optional label above the block */}
      {label && (
        <Flex align="center" gap="6px" mb="8px">
          <Box w="3px" h="12px" bg={accentColor} borderRadius="2px" />
          <Text fontSize="10px" color={accentColor} fontFamily="monospace" letterSpacing="0.12em" fontWeight="700">
            {label.toUpperCase()}
          </Text>
        </Flex>
      )}

      <Box
        bg="#0d1117"
        border="1px solid rgba(255,255,255,0.06)"
        borderRadius="12px"
        overflow="hidden"
        boxShadow="0 4px 24px rgba(0,0,0,0.4)"
        transition="box-shadow 0.2s"
        _hover={onTryInEditor ? { boxShadow: `0 4px 28px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}22` } : {}}
      >
        {/* ── Title bar ─────────────────────────────────────────── */}
        <Flex
          align="center"
          gap="6px"
          px="14px"
          py="9px"
          bg="rgba(255,255,255,0.03)"
          borderBottom="1px solid rgba(255,255,255,0.06)"
        >
          {/* macOS dots */}
          <Box w="10px" h="10px" borderRadius="50%" bg="#f87171" opacity={0.8} />
          <Box w="10px" h="10px" borderRadius="50%" bg="#fbbf24" opacity={0.8} />
          <Box w="10px" h="10px" borderRadius="50%" bg="#4ade80" opacity={0.8} />

          <Text ml="10px" fontSize="10px" color="rgba(255,255,255,0.18)" fontFamily="monospace" letterSpacing="0.08em">
            eval
          </Text>

          <Box flex={1} />

          {/* Line count */}
          <Text fontSize="9px" color="rgba(255,255,255,0.12)" fontFamily="monospace" mr={onTryInEditor ? "10px" : "0"}>
            {lines.length} {lines.length === 1 ? "line" : "lines"}
          </Text>

          {/* Try in Editor button — only rendered when callback is wired up */}
          {onTryInEditor && (
            <button
              onClick={handleTry}
              title="Open this example in the editor"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                background: launched ? `${accentColor}28` : `${accentColor}14`,
                border: `1px solid ${launched ? accentColor + "60" : accentColor + "30"}`,
                borderRadius: "5px",
                color: launched ? accentColor : accentColor + "cc",
                fontSize: "10px",
                fontWeight: "600",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.18s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!launched) {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = `${accentColor}22`;
                  b.style.borderColor = `${accentColor}55`;
                  b.style.color = accentColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!launched) {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = `${accentColor}14`;
                  b.style.borderColor = `${accentColor}30`;
                  b.style.color = `${accentColor}cc`;
                }
              }}
            >
              {launched ? <Check size={10} /> : <Play size={10} />}
              <span>{launched ? "Opened!" : "Try in Editor"}</span>
            </button>
          )}
        </Flex>

        {/* ── Code body ─────────────────────────────────────────── */}
        <Box p="14px 18px" overflow="auto">
          {lines.map((line, i) => (
            <Text
              key={i}
              as="div"
              fontFamily="'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
              fontSize="12.5px"
              lineHeight="1.8"
              whiteSpace="pre"
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.1)",
                  userSelect: "none",
                  marginRight: "20px",
                  fontSize: "11px",
                  minWidth: "24px",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {i + 1}
              </span>
              {tokenizeLine(line)}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}