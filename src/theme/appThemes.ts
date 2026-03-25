export interface AppTheme {
  id: string;
  label: string;
  swatch: string; // preview dot color
  vars: Record<string, string>;
}

// ─── Token Reference ──────────────────────────────────────────────────────────
//
//  Backgrounds
//    --bg-base       deepest app background
//    --bg-panel      panel / sidebar bg
//    --bg-surface    card / widget surface
//    --bg-elevated   hover / elevated surface
//    --bg-code       code block inner bg
//
//  Borders
//    --border        main border
//    --border-subtle very subtle separator
//
//  Text
//    --text-primary  readable body text
//    --text-secondary secondary / label text
//    --text-muted    hints, dim labels
//    --text-ghost    decorative / placeholder
//
//  Accent (primary — buttons, active states, cursor)
//    --accent        accent color
//    --accent-dim    tinted background for accent buttons
//    --accent-border accent border tone
//    --accent-glow   glow for accent elements
//
//  Accent2 (secondary — AI panel, info)
//    --accent2
//    --accent2-dim
//    --accent2-border
//
// ─────────────────────────────────────────────────────────────────────────────

export const APP_THEMES: AppTheme[] = [
  // ── 1. VOID — original near-black, orange ──────────────────────────────────
  {
    id: "void",
    label: "Void",
    swatch: "#fb923c",
    vars: {
      "--bg-base": "#0e0e12",
      "--bg-panel": "#0a0a0f",
      "--bg-surface": "#16161e",
      "--bg-elevated": "#1e1e2e",
      "--bg-code": "#07070b",

      "--border": "#1e1e28",
      "--border-subtle": "#141420",

      "--text-primary": "#d4d4e8",
      "--text-secondary": "#8a8a9a",
      "--text-muted": "#4a4a5e",
      "--text-ghost": "#2a2a38",

      "--accent": "#fb923c",
      "--accent-dim": "rgba(251,146,60,0.12)",
      "--accent-border": "rgba(251,146,60,0.25)",
      "--accent-glow": "rgba(251,146,60,0.4)",

      "--accent2": "#7dd3fc",
      "--accent2-dim": "rgba(125,211,252,0.10)",
      "--accent2-border": "#1e4976",

      "--drag-handle": "#1a1a22",
    },
  },

  // ── 2. OCEAN — deep navy, cyan ─────────────────────────────────────────────
  {
    id: "ocean",
    label: "Ocean",
    swatch: "#22d3ee",
    vars: {
      "--bg-base": "#090e18",
      "--bg-panel": "#060c14",
      "--bg-surface": "#0f1928",
      "--bg-elevated": "#162235",
      "--bg-code": "#050910",

      "--border": "#1a2840",
      "--border-subtle": "#111d2e",

      "--text-primary": "#c8daf0",
      "--text-secondary": "#7a9ab8",
      "--text-muted": "#3a5a78",
      "--text-ghost": "#1e3248",

      "--accent": "#22d3ee",
      "--accent-dim": "rgba(34,211,238,0.10)",
      "--accent-border": "rgba(34,211,238,0.22)",
      "--accent-glow": "rgba(34,211,238,0.35)",

      "--accent2": "#a78bfa",
      "--accent2-dim": "rgba(167,139,250,0.10)",
      "--accent2-border": "#3730a3",

      "--drag-handle": "#111d30",
    },
  },

  // ── 3. OBSIDIAN — true black, purple ──────────────────────────────────────
  {
    id: "obsidian",
    label: "Obsidian",
    swatch: "#a78bfa",
    vars: {
      "--bg-base": "#08080e",
      "--bg-panel": "#050508",
      "--bg-surface": "#101018",
      "--bg-elevated": "#18182a",
      "--bg-code": "#020205",

      "--border": "#1a1a2e",
      "--border-subtle": "#10101e",

      "--text-primary": "#e0d8f8",
      "--text-secondary": "#8a7ab8",
      "--text-muted": "#4a3a78",
      "--text-ghost": "#2a1e4e",

      "--accent": "#a78bfa",
      "--accent-dim": "rgba(167,139,250,0.12)",
      "--accent-border": "rgba(167,139,250,0.25)",
      "--accent-glow": "rgba(167,139,250,0.40)",

      "--accent2": "#f472b6",
      "--accent2-dim": "rgba(244,114,182,0.10)",
      "--accent2-border": "#831843",

      "--drag-handle": "#14142a",
    },
  },

  // ── 4. FOREST — dark green, lime ──────────────────────────────────────────
  {
    id: "forest",
    label: "Forest",
    swatch: "#4ade80",
    vars: {
      "--bg-base": "#080f08",
      "--bg-panel": "#060c06",
      "--bg-surface": "#0f1a0e",
      "--bg-elevated": "#172416",
      "--bg-code": "#040804",

      "--border": "#1a2e1a",
      "--border-subtle": "#111f10",

      "--text-primary": "#d0e8c8",
      "--text-secondary": "#7a9a72",
      "--text-muted": "#3a5a34",
      "--text-ghost": "#1e3218",

      "--accent": "#4ade80",
      "--accent-dim": "rgba(74,222,128,0.10)",
      "--accent-border": "rgba(74,222,128,0.22)",
      "--accent-glow": "rgba(74,222,128,0.35)",

      "--accent2": "#fbbf24",
      "--accent2-dim": "rgba(251,191,36,0.10)",
      "--accent2-border": "#78350f",

      "--drag-handle": "#111f11",
    },
  },

  // ── 5. DUSK — warm dark brown, amber ──────────────────────────────────────
  {
    id: "dusk",
    label: "Dusk",
    swatch: "#f59e0b",
    vars: {
      "--bg-base": "#100a04",
      "--bg-panel": "#0c0702",
      "--bg-surface": "#1a1008",
      "--bg-elevated": "#241810",
      "--bg-code": "#080402",

      "--border": "#2e1e0a",
      "--border-subtle": "#1e1408",

      "--text-primary": "#e8d8c0",
      "--text-secondary": "#9a8060",
      "--text-muted": "#5a4030",
      "--text-ghost": "#2e2010",

      "--accent": "#f59e0b",
      "--accent-dim": "rgba(245,158,11,0.12)",
      "--accent-border": "rgba(245,158,11,0.25)",
      "--accent-glow": "rgba(245,158,11,0.40)",

      "--accent2": "#f87171",
      "--accent2-dim": "rgba(248,113,113,0.10)",
      "--accent2-border": "#7f1d1d",

      "--drag-handle": "#1e1408",
    },
  },

  // ── 6. DRACULA — classic dracula, purple ──────────────────────────────────
  {
    id: "dracula",
    label: "Dracula",
    swatch: "#bd93f9",
    vars: {
      "--bg-base": "#1e1f29",
      "--bg-panel": "#191a24",
      "--bg-surface": "#282a36",
      "--bg-elevated": "#44475a",
      "--bg-code": "#13141c",

      "--border": "#44475a",
      "--border-subtle": "#343746",

      "--text-primary": "#f8f8f2",
      "--text-secondary": "#6272a4",
      "--text-muted": "#4a5070",
      "--text-ghost": "#2d2f3e",

      "--accent": "#bd93f9",
      "--accent-dim": "rgba(189,147,249,0.12)",
      "--accent-border": "rgba(189,147,249,0.25)",
      "--accent-glow": "rgba(189,147,249,0.40)",

      "--accent2": "#8be9fd",
      "--accent2-dim": "rgba(139,233,253,0.10)",
      "--accent2-border": "#1a6070",

      "--drag-handle": "#343746",
    },
  },

  // ── 7. SLATE — dark charcoal, soft blue ───────────────────────────────────
  {
    id: "slate",
    label: "Slate",
    swatch: "#60a5fa",
    vars: {
      "--bg-base": "#111318",
      "--bg-panel": "#0d0f14",
      "--bg-surface": "#191c24",
      "--bg-elevated": "#222530",
      "--bg-code": "#0a0b10",

      "--border": "#252830",
      "--border-subtle": "#1a1d24",

      "--text-primary": "#d0d4e8",
      "--text-secondary": "#7a80a0",
      "--text-muted": "#454a60",
      "--text-ghost": "#2a2d3a",

      "--accent": "#60a5fa",
      "--accent-dim": "rgba(96,165,250,0.12)",
      "--accent-border": "rgba(96,165,250,0.25)",
      "--accent-glow": "rgba(96,165,250,0.40)",

      "--accent2": "#34d399",
      "--accent2-dim": "rgba(52,211,153,0.10)",
      "--accent2-border": "#065f46",

      "--drag-handle": "#1a1d28",
    },
  },

  // ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
  // MEDIUM-LIGHT THEMES (balanced, comfortable mid-tones)
  // ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄

  // ── 8. BREEZE — soft sky blue, medium-light ────────────────────────────────
  {
    id: "breeze",
    label: "Breeze",
    swatch: "#0ea5e9",
    vars: {
      "--bg-base": "#eef2f8",
      "--bg-panel": "#e8edf5",
      "--bg-surface": "#f5f8fc",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#eef3fa",

      "--border": "#dce3ec",
      "--border-subtle": "#e6ecf3",

      "--text-primary": "#1e293b",
      "--text-secondary": "#475569",
      "--text-muted": "#7e8a98",
      "--text-ghost": "#b9c2ce",

      "--accent": "#0ea5e9",
      "--accent-dim": "rgba(14,165,233,0.10)",
      "--accent-border": "rgba(14,165,233,0.25)",
      "--accent-glow": "rgba(14,165,233,0.20)",

      "--accent2": "#8b5cf6",
      "--accent2-dim": "rgba(139,92,246,0.08)",
      "--accent2-border": "#c4b5fd",

      "--drag-handle": "#e2e8f0",
    },
  },

  // ── 9. MIST — soft sage, medium-light ──────────────────────────────────────
  {
    id: "mist",
    label: "Mist",
    swatch: "#84cc16",
    vars: {
      "--bg-base": "#eff3ea",
      "--bg-panel": "#e9eee2",
      "--bg-surface": "#f7faf2",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#f0f5e8",

      "--border": "#dfe6d4",
      "--border-subtle": "#e9efe0",

      "--text-primary": "#1e2a1e",
      "--text-secondary": "#4a5a42",
      "--text-muted": "#8b9a7a",
      "--text-ghost": "#c2d0b2",

      "--accent": "#84cc16",
      "--accent-dim": "rgba(132,204,22,0.10)",
      "--accent-border": "rgba(132,204,22,0.25)",
      "--accent-glow": "rgba(132,204,22,0.15)",

      "--accent2": "#f97316",
      "--accent2-dim": "rgba(249,115,22,0.08)",
      "--accent2-border": "#fed7aa",

      "--drag-handle": "#e2e8dc",
    },
  },

  // ── 10. ROSE — soft rose, medium-light ─────────────────────────────────────
  {
    id: "rose",
    label: "Rose",
    swatch: "#f43f5e",
    vars: {
      "--bg-base": "#fef0f0",
      "--bg-panel": "#fae8e8",
      "--bg-surface": "#fff8f8",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#fef5f5",

      "--border": "#f0dfdf",
      "--border-subtle": "#f8ecec",

      "--text-primary": "#2d1f1f",
      "--text-secondary": "#6e4e4e",
      "--text-muted": "#b28e8e",
      "--text-ghost": "#e6cccc",

      "--accent": "#f43f5e",
      "--accent-dim": "rgba(244,63,94,0.08)",
      "--accent-border": "rgba(244,63,94,0.20)",
      "--accent-glow": "rgba(244,63,94,0.12)",

      "--accent2": "#fb923c",
      "--accent2-dim": "rgba(251,146,60,0.08)",
      "--accent2-border": "#fed7aa",

      "--drag-handle": "#f0e0e0",
    },
  },

  // ── 11. LAVENDER — soft purple, medium-light ────────────────────────────────
  {
    id: "lavender",
    label: "Lavender",
    swatch: "#a78bfa",
    vars: {
      "--bg-base": "#f2effc",
      "--bg-panel": "#ece8f8",
      "--bg-surface": "#fbfaff",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#f6f3ff",

      "--border": "#e4def5",
      "--border-subtle": "#eeeafb",

      "--text-primary": "#26223a",
      "--text-secondary": "#625c82",
      "--text-muted": "#a69fc2",
      "--text-ghost": "#ded7f0",

      "--accent": "#a78bfa",
      "--accent-dim": "rgba(167,139,250,0.10)",
      "--accent-border": "rgba(167,139,250,0.22)",
      "--accent-glow": "rgba(167,139,250,0.15)",

      "--accent2": "#2dd4bf",
      "--accent2-dim": "rgba(45,212,191,0.08)",
      "--accent2-border": "#ccfbf1",

      "--drag-handle": "#e8e2f8",
    },
  },

  // ── 12. COTTON — clean medium, indigo ──────────────────────────────────────
  {
    id: "cotton",
    label: "Cotton",
    swatch: "#4f46e5",
    vars: {
      "--bg-base": "#f0f0f8",
      "--bg-panel": "#eaeaef",
      "--bg-surface": "#fafaff",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#f5f5fc",

      "--border": "#e2e2ea",
      "--border-subtle": "#ececf2",

      "--text-primary": "#252537",
      "--text-secondary": "#5a5a72",
      "--text-muted": "#9b9bb0",
      "--text-ghost": "#d0d0e0",

      "--accent": "#4f46e5",
      "--accent-dim": "rgba(79,70,229,0.08)",
      "--accent-border": "rgba(79,70,229,0.20)",
      "--accent-glow": "rgba(79,70,229,0.12)",

      "--accent2": "#ec489a",
      "--accent2-dim": "rgba(236,72,153,0.06)",
      "--accent2-border": "#fbcfe8",

      "--drag-handle": "#e2e2ea",
    },
  },

  // ── 13. HONEY — warm honey, medium-light ───────────────────────────────────
  {
    id: "honey",
    label: "Honey",
    swatch: "#eab308",
    vars: {
      "--bg-base": "#fef7e8",
      "--bg-panel": "#fcf0de",
      "--bg-surface": "#fffef8",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#fef9ec",

      "--border": "#f3e5ce",
      "--border-subtle": "#faf0e0",

      "--text-primary": "#3a2a18",
      "--text-secondary": "#7a623a",
      "--text-muted": "#b89e72",
      "--text-ghost": "#eedbc0",

      "--accent": "#eab308",
      "--accent-dim": "rgba(234,179,8,0.10)",
      "--accent-border": "rgba(234,179,8,0.22)",
      "--accent-glow": "rgba(234,179,8,0.18)",

      "--accent2": "#f97316",
      "--accent2-dim": "rgba(249,115,22,0.08)",
      "--accent2-border": "#ffedd5",

      "--drag-handle": "#f0e4d0",
    },
  },

  // ── 14. MINT — fresh mint, medium-light ────────────────────────────────────
  {
    id: "mint",
    label: "Mint",
    swatch: "#14b8a6",
    vars: {
      "--bg-base": "#eef8f5",
      "--bg-panel": "#e6f2ef",
      "--bg-surface": "#f8fffd",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#f0faf7",

      "--border": "#deece8",
      "--border-subtle": "#eaf5f2",

      "--text-primary": "#1e4642",
      "--text-secondary": "#5f8a84",
      "--text-muted": "#9ec0ba",
      "--text-ghost": "#d5e9e4",

      "--accent": "#14b8a6",
      "--accent-dim": "rgba(20,184,166,0.08)",
      "--accent-border": "rgba(20,184,166,0.20)",
      "--accent-glow": "rgba(20,184,166,0.12)",

      "--accent2": "#8b5cf6",
      "--accent2-dim": "rgba(139,92,246,0.06)",
      "--accent2-border": "#ede9fe",

      "--drag-handle": "#e2ece8",
    },
  },

  // ── 15. PEACH — soft peach, medium-light ───────────────────────────────────
  {
    id: "peach",
    label: "Peach",
    swatch: "#f97316",
    vars: {
      "--bg-base": "#fef2e8",
      "--bg-panel": "#fceae0",
      "--bg-surface": "#fffbf8",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#fef5ec",

      "--border": "#f5e2d4",
      "--border-subtle": "#fceee4",

      "--text-primary": "#3b2a1f",
      "--text-secondary": "#8b6b50",
      "--text-muted": "#c6a282",
      "--text-ghost": "#f2e0d0",

      "--accent": "#f97316",
      "--accent-dim": "rgba(249,115,22,0.08)",
      "--accent-border": "rgba(249,115,22,0.20)",
      "--accent-glow": "rgba(249,115,22,0.12)",

      "--accent2": "#06b6d4",
      "--accent2-dim": "rgba(6,182,212,0.08)",
      "--accent2-border": "#cffafe",

      "--drag-handle": "#f0e0d4",
    },
  },

  // ── 16. FROST — cool gray, medium-light ────────────────────────────────────
  {
    id: "frost",
    label: "Frost",
    swatch: "#06b6d4",
    vars: {
      "--bg-base": "#edf2f7",
      "--bg-panel": "#e6ecf2",
      "--bg-surface": "#f8fbfe",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#f0f5fa",

      "--border": "#dfe6ef",
      "--border-subtle": "#e9f0f5",

      "--text-primary": "#1e2e3e",
      "--text-secondary": "#5b6e7e",
      "--text-muted": "#9aaebc",
      "--text-ghost": "#cedae4",

      "--accent": "#06b6d4",
      "--accent-dim": "rgba(6,182,212,0.08)",
      "--accent-border": "rgba(6,182,212,0.18)",
      "--accent-glow": "rgba(6,182,212,0.12)",

      "--accent2": "#a855f7",
      "--accent2-dim": "rgba(168,85,247,0.06)",
      "--accent2-border": "#ede9fe",

      "--drag-handle": "#e2e8f0",
    },
  },

  // ── 17. STONE — warm neutral, medium-light ─────────────────────────────────
  {
    id: "stone",
    label: "Stone",
    swatch: "#78716c",
    vars: {
      "--bg-base": "#f5f2ef",
      "--bg-panel": "#eeebe8",
      "--bg-surface": "#fefcf9",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#f8f5f2",

      "--border": "#e8e2dc",
      "--border-subtle": "#f0ece8",

      "--text-primary": "#2b2520",
      "--text-secondary": "#6b625a",
      "--text-muted": "#b0a69c",
      "--text-ghost": "#e2dad2",

      "--accent": "#78716c",
      "--accent-dim": "rgba(120,113,108,0.10)",
      "--accent-border": "rgba(120,113,108,0.20)",
      "--accent-glow": "rgba(120,113,108,0.12)",

      "--accent2": "#d97706",
      "--accent2-dim": "rgba(217,119,6,0.08)",
      "--accent2-border": "#fed7aa",

      "--drag-handle": "#e8e2dc",
    },
  },

  // ── 18. OCEAN BREEZE — light blue, medium-light ────────────────────────────
  {
    id: "ocean-breeze",
    label: "Ocean Breeze",
    swatch: "#3b82f6",
    vars: {
      "--bg-base": "#eef3fc",
      "--bg-panel": "#e8eef8",
      "--bg-surface": "#fafdff",
      "--bg-elevated": "#ffffff",
      "--bg-code": "#f0f6fe",

      "--border": "#dfe8f2",
      "--border-subtle": "#eaf1f8",

      "--text-primary": "#1e2a3a",
      "--text-secondary": "#5a6e82",
      "--text-muted": "#9aaebf",
      "--text-ghost": "#cfdeec",

      "--accent": "#3b82f6",
      "--accent-dim": "rgba(59,130,246,0.08)",
      "--accent-border": "rgba(59,130,246,0.20)",
      "--accent-glow": "rgba(59,130,246,0.12)",

      "--accent2": "#f97316",
      "--accent2-dim": "rgba(249,115,22,0.08)",
      "--accent2-border": "#fed7aa",

      "--drag-handle": "#e2eaf2",
    },
  },
];

export const DEFAULT_THEME_ID = "void";

/** Inject CSS variables onto :root by writing them to document.documentElement */
export function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
}
