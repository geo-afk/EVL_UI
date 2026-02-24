import { Box, Flex, Text } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, Palette } from "lucide-react";
import { EDITOR_THEMES, type EditorTheme } from "../../model/editorThemes";

// ─── Theme Dropdown ───────────────────────────────────────────────────────────
interface ThemeDropdownProps {
  currentTheme: EditorTheme;
  onSelect: (theme: EditorTheme) => void;
}

export const ThemeDropdown = ({
  currentTheme,
  onSelect,
}: ThemeDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <Box position="relative" ref={dropdownRef} flexShrink={0}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Select editor theme"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "5px 10px",
          background: open ? "#1e1e2e" : "#16161e",

          border: `1px solid ${open ? "#3a3a52" : "#2a2a38"}`,
          borderRadius: "6px",
          color: "#8a8a9a",
          fontSize: "12px",
          fontWeight: "500",
          cursor: "pointer",
          letterSpacing: "0.03em",
          transition: "all 0.15s ease",
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.background = "#1e1e2e";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#3a3a52";
            (e.currentTarget as HTMLButtonElement).style.color = "#d4d4e8";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.background = "#16161e";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#2a2a38";
            (e.currentTarget as HTMLButtonElement).style.color = "#8a8a9a";
          }
        }}
      >
        <Palette size={11} />
        {/* Accent swatch */}
        <Box
          as="span"
          display="inline-block"
          w="8px"
          h="8px"
          borderRadius="50%"
          bg={currentTheme.accent}
          flexShrink={0}
          style={{ boxShadow: `0 0 6px ${currentTheme.accent}80` }}
        />
        <span>{currentTheme.label}</span>
        <ChevronDown
          size={10}
          style={{
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.6,
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left="0"
          zIndex={999}
          bg="#12121a"
          border="1px solid #2a2a38"
          borderRadius="8px"
          overflow="hidden"
          boxShadow="0 8px 32px rgba(0,0,0,0.6)"
          minW="160px"
          style={{
            animation: "dropdownFadeIn 0.12s ease",
          }}
        >
          {/* Header */}
          <Flex
            align="center"
            gap="6px"
            px="12px"
            py="8px"
            borderBottom="1px solid #1e1e28"
          >
            <Palette size={10} color="#4a4a5e" />
            <Text
              fontSize="10px"
              fontWeight="700"
              color="#4a4a5e"
              letterSpacing="0.1em"
              fontFamily="monospace"
            >
              THEME
            </Text>
          </Flex>

          {/* Theme options */}
          {EDITOR_THEMES.map((theme) => {
            const isActive = theme.id === currentTheme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelect(theme);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "8px 12px",
                  background: isActive ? "#1e1e2e" : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${isActive ? theme.accent : "transparent"}`,
                  cursor: "pointer",
                  color: isActive ? "#e2e2e8" : "#8a8a9a",
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  letterSpacing: "0.03em",
                  textAlign: "left",
                  transition: "all 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#1a1a26";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#d4d4e8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#8a8a9a";
                  }
                }}
              >
                {/* Swatch */}
                <Box
                  as="span"
                  display="inline-block"
                  w="10px"
                  h="10px"
                  borderRadius="50%"
                  bg={theme.accent}
                  flexShrink={0}
                  style={{
                    boxShadow: isActive ? `0 0 8px ${theme.accent}80` : "none",
                  }}
                />
                <span>{theme.label}</span>
                {isActive && (
                  <Box
                    as="span"
                    ml="auto"
                    fontSize="9px"
                    color={theme.accent}
                    fontWeight="700"
                    letterSpacing="0.06em"
                  >
                    ✓
                  </Box>
                )}
              </button>
            );
          })}
        </Box>
      )}

      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};
