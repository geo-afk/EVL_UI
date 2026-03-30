import { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Input } from "@chakra-ui/react";
import { X, Search } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE DATA
// ─────────────────────────────────────────────────────────────────────────────

interface FnEntry   { sig: string; returns: string; note: string; }
interface ConstEntry{ name: string; value: string; note: string; }
interface TokenGroup{ label: string; color: string; tokens: string[]; }

interface Section {
  id: string;
  heading: string;
  accentColor: string;
  kind: "snippets" | "functions" | "constants" | "operators";
  groups?:    TokenGroup[];
  functions?: FnEntry[];
  constants?: ConstEntry[];
  snippets?:  { label: string; code: string }[];
}

const SECTIONS: Section[] = [
  {
    id: "types",
    heading: "Types",
    accentColor: "#38bdf8",
    kind: "snippets",
    snippets: [
      { label: "integer",  code: "int x = 10"           },
      { label: "decimal",  code: "float y = 3.14"        },
      { label: "text",     code: 'string s = "hello"'   },
      { label: "boolean",  code: "bool flag = true"      },
      { label: "constant", code: "const int MAX = 100"   },
      { label: "null",     code: "int empty = null"      },
    ],
  },
  {
    id: "operators",
    heading: "Operators",
    accentColor: "#f472b6",
    kind: "operators",
    groups: [
      { label: "Arithmetic",       color: "#f472b6", tokens: ["+", "-", "*", "/", "%"] },
      { label: "Comparison",       color: "#a78bfa", tokens: ["==", "!=", "<", ">", "<=", ">="] },
      { label: "Logical",          color: "#fb923c", tokens: ["&&", "||", "!"] },
      { label: "Compound assign",  color: "#38bdf8", tokens: ["+=", "-=", "*=", "/="] },
    ],
  },
  {
    id: "control",
    heading: "Control Flow",
    accentColor: "#34d399",
    kind: "snippets",
    snippets: [
      { label: "if",       code: "if (x > 0) { }"                      },
      { label: "if/else",  code: "if (x > 0) { } else { }"             },
      { label: "else if",  code: "else if (x == 0) { }"                },
      { label: "while",    code: "while (x < 10) { x+=1 }"              },
      { label: "break",    code: "break"                                },
      { label: "continue", code: "continue"                             },
    ],
  },
  {
    id: "errors",
    heading: "Error Handling",
    accentColor: "#f87171",
    kind: "snippets",
    snippets: [
      { label: "try/catch", code: "try { } catch (err) { }" },
    ],
  },
  {
    id: "builtins",
    heading: "Built-in Functions",
    accentColor: "#38bdf8",
    kind: "functions",
    functions: [
      { sig: "print(arg, ...)",   returns: "—",      note: "Print values to output"          },
      { sig: "cast(value, type)", returns: "type",   note: "Convert value to target type"    },
      { sig: "pow(base, exp)",    returns: "float",  note: "Raise base to the power exp"     },
      { sig: "sqrt(value)",       returns: "float",  note: "Square root"                     },
      { sig: "abs(value)",        returns: "number", note: "Absolute value (removes sign)"   },
      { sig: "min(a, b)",         returns: "value",  note: "Smaller of two values"           },
      { sig: "max(a, b)",         returns: "value",  note: "Larger of two values"            },
      { sig: "round(value)",      returns: "float",  note: "Round to nearest whole number"   },
    ],
  },
  {
    id: "constants",
    heading: "Built-in Constants",
    accentColor: "#fb923c",
    kind: "constants",
    constants: [
      { name: "PI",           value: "3.14159…", note: "Mathematical constant π"  },
      { name: "DAYS_IN_WEEK", value: "7",        note: "Days in a week"           },
      { name: "HOURS_IN_DAY", value: "24",       note: "Hours in a day"           },
      { name: "YEAR",         value: "current",  note: "Current calendar year"    },
    ],
  },
  {
    id: "comments",
    heading: "Comments",
    accentColor: "#6b7280",
    kind: "snippets",
    snippets: [
      { label: "single line", code: "// comment"      },
      { label: "multi line",  code: "/* comment */"   },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sectionMatches(s: Section, q: string): boolean {
  if (!q) return true;
  const lq = q.toLowerCase();
  if (s.heading.toLowerCase().includes(lq)) return true;
  if (s.snippets?.some((x) => x.label.includes(lq) || x.code.toLowerCase().includes(lq))) return true;
  if (s.functions?.some((f) => f.sig.toLowerCase().includes(lq) || f.note.toLowerCase().includes(lq))) return true;
  if (s.constants?.some((c) => c.name.toLowerCase().includes(lq) || c.note.toLowerCase().includes(lq))) return true;
  if (s.groups?.some((g) => g.tokens.some((t) => t.includes(lq)) || g.label.toLowerCase().includes(lq))) return true;
  return false;
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1400);
    });
  };
  return { copied, copy };
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SnippetRow({
  label, code, accent, copied, onCopy,
}: {
  label: string; code: string; accent: string; copied: boolean; onCopy: () => void;
}) {
  return (
    <Flex
      direction="column" gap="3px"
      px="12px" py="8px"
      borderRadius="6px"
      bg="var(--bg-base)"
      border="1px solid var(--border)"
      cursor="pointer"
      role="button"
      title="Click to copy"
      onClick={onCopy}
      transition="border-color 0.15s, background 0.15s"
      _hover={{ borderColor: `${accent}55`, bg: "var(--bg-surface)" }}
    >
      <Flex align="center" justify="space-between">
        <Text fontSize="9.5px" color="var(--text-ghost)" fontFamily="monospace"
          letterSpacing="0.08em" textTransform="uppercase">
          {label}
        </Text>
        <Text
          fontSize="9px" fontFamily="monospace"
          color={copied ? "#4ade80" : "var(--text-ghost)"}
          opacity={copied ? 1 : 0.45}
          transition="color 0.15s, opacity 0.15s"
        >
          {copied ? "copied!" : "copy"}
        </Text>
      </Flex>
      <Text
        fontSize="11.5px"
        fontFamily="'JetBrains Mono', 'Fira Code', monospace"
        color={accent}
        whiteSpace="pre"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {code}
      </Text>
    </Flex>
  );
}

function FunctionRow({ fn, accent, copied, onCopy }: { fn: FnEntry; accent: string; copied: boolean; onCopy: () => void }) {
  return (
    <Flex
      direction="column" gap="4px"
      px="12px" py="9px"
      borderRadius="6px"
      bg="var(--bg-base)"
      border="1px solid var(--border)"
      cursor="pointer"
      role="button"
      title="Click to copy"
      onClick={onCopy}
      transition="border-color 0.15s, background 0.15s"
      _hover={{ borderColor: `${accent}55`, bg: "var(--bg-surface)" }}
    >
      <Flex align="center" justify="space-between" gap="8px">
        <Text
          fontSize="11.5px"
          fontFamily="'JetBrains Mono', monospace"
          color={accent}
          overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap"
          flex={1}
        >
          {fn.sig}
        </Text>
        <Box
          px="6px" py="1px" flexShrink={0}
          bg={`${accent}14`} border={`1px solid ${accent}30`} borderRadius="4px"
        >
          <Text 
            fontSize="9px" 
            color={copied ? "#4ade80" : accent} 
            fontFamily="monospace" 
            fontWeight="700"
            transition="color 0.15s"
          >
            {copied ? "copied!" : fn.returns}
          </Text>
        </Box>
      </Flex>
      <Text fontSize="11px" color="var(--text-muted)" lineHeight="1.5">
        {fn.note}
      </Text>
    </Flex>
  );
}

function ConstantRow({ c, accent, copied, onCopy }: { c: ConstEntry; accent: string; copied: boolean; onCopy: () => void }) {
  return (
    <Flex
      align="center" gap="10px"
      px="12px" py="8px"
      borderRadius="6px"
      bg="var(--bg-base)"
      border="1px solid var(--border)"
      cursor="pointer"
      role="button"
      title="Click to copy"
      onClick={onCopy}
      transition="border-color 0.15s, background 0.15s"
      _hover={{ borderColor: `${accent}55`, bg: "var(--bg-surface)" }}
    >
      <Text
        fontSize="12px" fontFamily="'JetBrains Mono', monospace"
        color={accent} fontWeight="700"
        w="110px" flexShrink={0}
      >
        {c.name}
      </Text>
      <Box
        px="6px" py="1px" flexShrink={0}
        bg={`${accent}14`} border={`1px solid ${accent}30`} borderRadius="4px"
      >
        <Text 
          fontSize="9.5px" 
          color={copied ? "#4ade80" : accent} 
          fontFamily="monospace"
          transition="color 0.15s"
        >
          {copied ? "copied!" : c.value}
        </Text>
      </Box>
      <Text fontSize="10.5px" color="var(--text-muted)" flex={1}
        overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {c.note}
      </Text>
    </Flex>
  );
}

function OperatorGroups({ groups, copied, onCopy }: { groups: TokenGroup[]; copied: string | null; onCopy: (token: string) => void }) {
  return (
    <Flex direction="column" gap="10px"
      px="12px" py="10px"
      bg="var(--bg-base)"
      border="1px solid var(--border)"
      borderRadius="6px"
    >
      {groups.map((g) => (
        <Box key={g.label}>
          <Text fontSize="9px" color="var(--text-ghost)" fontFamily="monospace"
            letterSpacing="0.1em" mb="5px" textTransform="uppercase">
            {g.label}
          </Text>
          <Flex gap="5px" flexWrap="wrap">
            {g.tokens.map((tok) => (
              <Box
                key={tok}
                px="9px" py="4px"
                bg={`${g.color}0e`}
                border={`1px solid ${g.color}33`}
                borderRadius="5px"
                cursor="pointer"
                role="button"
                title="Click to copy"
                onClick={() => onCopy(tok)}
                transition="border-color 0.15s, background 0.15s, color 0.15s"
                _hover={{
                  borderColor: `${g.color}66`,
                  bg: `${g.color}15`,
                }}
              >
                <Text 
                  fontSize="13px" 
                  fontFamily="'JetBrains Mono', monospace"
                  color={copied === tok ? "#4ade80" : g.color} 
                  fontWeight="700"
                  transition="color 0.15s"
                >
                  {copied === tok ? "✓" : tok}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      ))}
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION BLOCK — collapsible
// ─────────────────────────────────────────────────────────────────────────────
function RefSection({ section, defaultOpen = true }: { section: Section; defaultOpen?: boolean }) {
  const { copied, copy } = useCopy();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box mb="2px">
      {/* Header */}
      <Flex
        align="center" justify="space-between"
        px="12px" py="7px"
        cursor="pointer"
        borderRadius="6px"
        transition="background 0.12s"
        onClick={() => setOpen((v) => !v)}
        _hover={{ bg: "var(--bg-elevated)" }}
      >
        <Flex align="center" gap="7px">
          <Box w="3px" h="14px" bg={section.accentColor} borderRadius="2px" flexShrink={0} />
          <Text fontSize="10.5px" fontWeight="700" color="var(--text-primary)"
            fontFamily="monospace" letterSpacing="0.08em">
            {section.heading.toUpperCase()}
          </Text>
        </Flex>
        <Text
          fontSize="9px" color="var(--text-ghost)" fontFamily="monospace"
          opacity={0.4}
          style={{
            display: "inline-block",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.18s ease",
          }}
        >
          ▾
        </Text>
      </Flex>

      {/* Body */}
      {open && (
        <Flex direction="column" gap="4px" px="6px" pb="8px">
          {section.kind === "snippets" && section.snippets?.map((s) => (
            <SnippetRow
              key={s.label}
              label={s.label}
              code={s.code}
              accent={section.accentColor}
              copied={copied === s.label + s.code}
              onCopy={() => copy(s.code, s.label + s.code)}
            />
          ))}
          {section.kind === "functions" && section.functions?.map((f) => (
            <FunctionRow 
              key={f.sig} 
              fn={f} 
              accent={section.accentColor}
              copied={copied === f.sig}
              onCopy={() => copy(f.sig, f.sig)}
            />
          ))}
          {section.kind === "constants" && section.constants?.map((c) => (
            <ConstantRow 
              key={c.name} 
              c={c} 
              accent={section.accentColor}
              copied={copied === c.name}
              onCopy={() => copy(c.name, c.name)}
            />
          ))}
          {section.kind === "operators" && section.groups && (
            <OperatorGroups 
              groups={section.groups}
              copied={copied}
              onCopy={(token: string) => copy(token, token)}
            />
          )}
        </Flex>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORTED PANEL
// ─────────────────────────────────────────────────────────────────────────────
export interface ReferencePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferencePanel = ({ isOpen, onClose }: ReferencePanelProps) => {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-focus search on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setQuery("");
        searchRef.current?.focus();
      }, 140);
    }
  }, [isOpen]);

  // Escape closes
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const filtered = SECTIONS.filter((s) => sectionMatches(s, query));

  return (
    <>
      {/* Click-outside backdrop */}
      {isOpen && (
        <Box
          position="absolute" inset="0"
          zIndex={19}
          onClick={onClose}
        />
      )}

      {/* Slide-in drawer */}
      <Box
        position="absolute"
        top="0" right="0" bottom="0"
        w="292px"
        zIndex={20}
        bg="var(--bg-panel)"
        borderLeft="1px solid var(--border)"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        boxShadow="-10px 0 40px rgba(0,0,0,0.45)"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: isOpen ? "all" : "none",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <Flex
          h="44px" align="center" px="14px" gap="8px"
          borderBottom="1px solid var(--border)"
          bg="var(--bg-base)" flexShrink={0}
        >
          <Box
            w="7px" h="7px" borderRadius="50%"
            bg="var(--accent)"
            boxShadow="0 0 8px var(--accent)99"
            flexShrink={0}
          />
          <Text
            fontSize="11px" fontWeight="700"
            color="var(--text-primary)"
            fontFamily="monospace" letterSpacing="0.1em"
            flex={1}
          >
            QUICK REFERENCE
          </Text>

          <Box
            px="6px" py="2px"
            bg="var(--bg-elevated)"
            border="1px solid var(--border)"
            borderRadius="4px"
          >
            <Text fontSize="9px" color="var(--text-ghost)" fontFamily="monospace">
              Ctrl+?
            </Text>
          </Box>

          <button
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "26px", height: "26px",
              background: "transparent",
              border: "1px solid transparent",
              borderRadius: "5px",
              color: "var(--text-ghost)",
              cursor: "pointer",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background  = "var(--bg-elevated)";
              b.style.borderColor = "var(--border)";
              b.style.color       = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background  = "transparent";
              b.style.borderColor = "transparent";
              b.style.color       = "var(--text-ghost)";
            }}
          >
            <X size={13} />
          </button>
        </Flex>

        {/* ── Search bar ──────────────────────────────────────────── */}
        <Box
          px="10px" py="8px"
          borderBottom="1px solid var(--border)"
          flexShrink={0}
        >
          <Flex
            align="center" gap="8px"
            px="10px" py="7px"
            bg="var(--bg-base)"
            border="1px solid var(--border)"
            borderRadius="7px"
            transition="border-color 0.15s"
            _focusWithin={{ borderColor: "var(--accent-border)" }}
          >
            <Search size={11} color="var(--text-ghost)" style={{ flexShrink: 0 }} />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search tokens, functions…"
              bg="transparent"
              border="none"
              outline="none"
              fontSize="11.5px"
              color="var(--text-primary)"
              fontFamily="'JetBrains Mono', monospace"
              flex={1}
              _placeholder={{ color: "var(--text-ghost)" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  background: "none", border: "none",
                  cursor: "pointer", padding: 0,
                  color: "var(--text-ghost)", display: "flex",
                }}
              >
                <X size={10} />
              </button>
            )}
          </Flex>
        </Box>

        {/* ── Section list ────────────────────────────────────────── */}
        <Box
          flex={1} overflow="auto" py="4px"
          css={{
            "&::-webkit-scrollbar":       { width: "3px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: "var(--border)", borderRadius: "2px" },
          }}
        >
          {filtered.length === 0 ? (
            <Flex align="center" justify="center" direction="column" gap="8px" py="32px">
              <Text fontSize="12px" color="var(--text-ghost)" fontFamily="monospace">
                no results for "{query}"
              </Text>
              <button
                onClick={() => setQuery("")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--accent)", fontSize: "11px", fontFamily: "monospace",
                }}
              >
                clear search
              </button>
            </Flex>
          ) : (
            filtered.map((s, i) => (
              <RefSection key={s.id} section={s} defaultOpen={i < 3} />
            ))
          )}
        </Box>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <Flex
          h="26px" align="center" px="14px"
          borderTop="1px solid var(--border)"
          bg="var(--bg-base)" flexShrink={0}
        >
          <Text fontSize="9.5px" color="var(--text-ghost)" fontFamily="monospace" opacity={0.4}>
            Click a snippet to copy · Esc to close
          </Text>
        </Flex>
      </Box>
    </>
  );
};