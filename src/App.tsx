import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Code2, BookOpen, Palette, ChevronDown } from "lucide-react";
import { EditorPage } from "./pages/EditorPage";
import { LearnPage } from "./pages/LearnPage";
import { AppThemeProvider, useAppTheme } from "./theme/ThemeContext";

// ─── Nav Item ─────────────────────────────────────────────────────────────────
const NavItem = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) => (
  <NavLink to={to} end={to === "/"}>
    {({ isActive }) => (
      <Flex
        align="center"
        gap="8px"
        px="14px"
        py="7px"
        borderRadius="6px"
        fontSize="13px"
        fontWeight="500"
        letterSpacing="0.02em"
        cursor="pointer"
        transition="all 0.15s ease"
        bg={isActive ? "var(--accent-dim)" : "transparent"}
        color={isActive ? "var(--accent)" : "var(--text-secondary)"}
        border="1px solid"
        borderColor={isActive ? "var(--accent-border)" : "transparent"}
        _hover={{ color: "var(--text-primary)", bg: "var(--bg-surface)" }}
      >
        <Icon size={14} />
        <Text>{label}</Text>
      </Flex>
    )}
  </NavLink>
);

// ─── Theme Switcher ───────────────────────────────────────────────────────────
function ThemeSwitcher() {
  const { theme, setThemeById, themes } = useAppTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <Box position="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Switch app theme"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "5px 11px",
          background: open ? "var(--bg-elevated)" : "var(--bg-surface)",
          border: `1px solid ${open ? "var(--border)" : "var(--border-subtle)"}`,
          borderRadius: "6px",
          color: "var(--text-secondary)",
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
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "var(--bg-elevated)";
            b.style.color = "var(--text-primary)";
            b.style.borderColor = "var(--border)";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = "var(--bg-surface)";
            b.style.color = "var(--text-secondary)";
            b.style.borderColor = "var(--border-subtle)";
          }
        }}
      >
        <Palette size={12} />
        {/* Swatch for active theme */}
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: theme.swatch,
            flexShrink: 0,
            boxShadow: `0 0 6px ${theme.swatch}80`,
          }}
        />
        <span>{theme.label}</span>
        <ChevronDown
          size={10}
          style={{
            opacity: 0.5,
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Panel */}
      {open && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          right="0"
          zIndex={999}
          bg="var(--bg-panel)"
          border="1px solid var(--border)"
          borderRadius="10px"
          overflow="hidden"
          boxShadow="0 12px 40px rgba(0,0,0,0.7)"
          minW="170px"
          style={{ animation: "themeDropIn 0.14s ease" }}
        >
          {/* Header */}
          <Flex
            align="center"
            gap="6px"
            px="12px"
            py="9px"
            borderBottom="1px solid var(--border-subtle)"
          >
            <Palette size={10} color="var(--text-muted)" />
            <Text
              fontSize="10px"
              fontWeight="700"
              color="var(--text-muted)"
              letterSpacing="0.12em"
              fontFamily="monospace"
            >
              APP THEME
            </Text>
          </Flex>

          {/* Options */}
          {themes.map((t) => {
            const isActive = t.id === theme.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setThemeById(t.id);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "9px 12px",
                  background: isActive ? "var(--bg-elevated)" : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${isActive ? t.swatch : "transparent"}`,
                  cursor: "pointer",
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  letterSpacing: "0.03em",
                  textAlign: "left",
                  transition: "all 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "var(--bg-surface)";
                    b.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "transparent";
                    b.style.color = "var(--text-secondary)";
                  }
                }}
              >
                {/* Color swatch */}
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: t.swatch,
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 8px ${t.swatch}80` : "none",
                    transition: "box-shadow 0.15s",
                  }}
                />
                <span style={{ flex: 1 }}>{t.label}</span>
                {isActive && (
                  <span
                    style={{
                      fontSize: "10px",
                      color: t.swatch,
                      fontWeight: "700",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </Box>
      )}

      <style>{`
        @keyframes themeDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}

// ─── Inner App (needs theme context) ─────────────────────────────────────────
function AppInner() {
  return (
    <BrowserRouter>
      <Flex direction="column" h="100vh" bg="var(--bg-base)" overflow="hidden">
        {/* Top Nav */}
        <Flex
          h="44px"
          align="center"
          px="18px"
          gap="6px"
          borderBottom="1px solid var(--border)"
          flexShrink={0}
          justify="space-between"
        >
          {/* Logo */}
          <Flex align="center" gap="10px">
            <Box
              w="22px"
              h="22px"
              borderRadius="5px"
              bg="linear-gradient(135deg, var(--accent), var(--accent))"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Code2 size={12} color="var(--bg-base)" />
            </Box>
            <Text
              fontSize="13px"
              fontWeight="700"
              color="var(--text-primary)"
              fontFamily="'Courier New', monospace"
              letterSpacing="0.05em"
            >
              EVAL Lang
            </Text>
          </Flex>

          {/* Nav links */}
          <Flex gap="4px">
            <NavItem to="/" icon={Code2} label="Editor" />
            <NavItem to="/learn" icon={BookOpen} label="Learn" />
          </Flex>

          {/* Theme switcher */}
          <ThemeSwitcher />
        </Flex>

        {/* Page content */}
        <Box flex="1" overflow="hidden">
          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/learn" element={<LearnPage />} />
          </Routes>
        </Box>
      </Flex>
    </BrowserRouter>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppThemeProvider>
      <AppInner />
    </AppThemeProvider>
  );
}
