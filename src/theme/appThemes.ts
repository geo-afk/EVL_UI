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
  // MEDIUM-LIGHT THEMES (now darker & more comfortable)
  // ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄

  // ── 8. BREEZE — soft sky blue, darker tone ────────────────────────────────
  {
    id: "breeze",
    label: "Breeze",
    swatch: "#0ea5e9",
    vars: {
      "--bg-base": "#e0e7f0",
      "--bg-panel": "#d1dbe9",
      "--bg-surface": "#f0f4fa",
      "--bg-elevated": "#f8fafd",
      "--bg-code": "#e6edf7",

      "--border": "#cbd5e1",
      "--border-subtle": "#d9e2ef",

      "--text-primary": "#1e293b",
      "--text-secondary": "#475569",
      "--text-muted": "#64748b",
      "--text-ghost": "#94a3b8",

      "--accent": "#0ea5e9",
      "--accent-dim": "rgba(14,165,233,0.12)",
      "--accent-border": "rgba(14,165,233,0.28)",
      "--accent-glow": "rgba(14,165,233,0.25)",

      "--accent2": "#8b5cf6",
      "--accent2-dim": "rgba(139,92,246,0.10)",
      "--accent2-border": "#c4b5fd",

      "--drag-handle": "#d1dbe9",
    },
  },

  // ── 9. MIST — soft sage, darker tone ──────────────────────────────────────
  {
    id: "mist",
    label: "Mist",
    swatch: "#84cc16",
    vars: {
      "--bg-base": "#e4e9df",
      "--bg-panel": "#d8e0d2",
      "--bg-surface": "#eef2e9",
      "--bg-elevated": "#f6f9f2",
      "--bg-code": "#e9f0e2",

      "--border": "#c8d4b9",
      "--border-subtle": "#d8e3cc",

      "--text-primary": "#1f2a1f",
      "--text-secondary": "#4a5a42",
      "--text-muted": "#6f7f5f",
      "--text-ghost": "#9bad8a",

      "--accent": "#84cc16",
      "--accent-dim": "rgba(132,204,22,0.12)",
      "--accent-border": "rgba(132,204,22,0.28)",
      "--accent-glow": "rgba(132,204,22,0.20)",

      "--accent2": "#f97316",
      "--accent2-dim": "rgba(249,115,22,0.10)",
      "--accent2-border": "#fed7aa",

      "--drag-handle": "#d8e0d2",
    },
  },

  // ── 10. ROSE — soft rose, darker tone ─────────────────────────────────────
  {
    id: "rose",
    label: "Rose",
    swatch: "#f43f5e",
    vars: {
      "--bg-base": "#f2e4e4",
      "--bg-panel": "#e8d6d6",
      "--bg-surface": "#f8ecec",
      "--bg-elevated": "#fdf4f4",
      "--bg-code": "#f0e0e0",

      "--border": "#e0c6c6",
      "--border-subtle": "#ecd6d6",

      "--text-primary": "#2d1f1f",
      "--text-secondary": "#6e4e4e",
      "--text-muted": "#9c7a7a",
      "--text-ghost": "#d4b8b8",

      "--accent": "#f43f5e",
      "--accent-dim": "rgba(244,63,94,0.10)",
      "--accent-border": "rgba(244,63,94,0.25)",
      "--accent-glow": "rgba(244,63,94,0.18)",

      "--accent2": "#fb923c",
      "--accent2-dim": "rgba(251,146,60,0.10)",
      "--accent2-border": "#fed7aa",

      "--drag-handle": "#e8d6d6",
    },
  },

  // ── 11. LAVENDER — soft purple, darker tone ───────────────────────────────
  {
    id: "lavender",
    label: "Lavender",
    swatch: "#a78bfa",
    vars: {
      "--bg-base": "#e8e4f5",
      "--bg-panel": "#dcd6f0",
      "--bg-surface": "#f0ebf9",
      "--bg-elevated": "#f8f5fe",
      "--bg-code": "#e9e4f5",

      "--border": "#d1c6e8",
      "--border-subtle": "#e0d6f0",

      "--text-primary": "#26223a",
      "--text-secondary": "#625c82",
      "--text-muted": "#8a7eb0",
      "--text-ghost": "#c4b8e0",

      "--accent": "#a78bfa",
      "--accent-dim": "rgba(167,139,250,0.12)",
      "--accent-border": "rgba(167,139,250,0.28)",
      "--accent-glow": "rgba(167,139,250,0.20)",

      "--accent2": "#2dd4bf",
      "--accent2-dim": "rgba(45,212,191,0.10)",
      "--accent2-border": "#ccfbf1",

      "--drag-handle": "#dcd6f0",
    },
  },

  // ── 12. COTTON — clean medium, indigo, darker tone ────────────────────────
  {
    id: "cotton",
    label: "Cotton",
    swatch: "#4f46e5",
    vars: {
      "--bg-base": "#e6e6f0",
      "--bg-panel": "#d8d8e6",
      "--bg-surface": "#f0f0f8",
      "--bg-elevated": "#f8f8fe",
      "--bg-code": "#e9e9f3",

      "--border": "#c8c8e0",
      "--border-subtle": "#d8d8e8",

      "--text-primary": "#252537",
      "--text-secondary": "#5a5a72",
      "--text-muted": "#7f7f9e",
      "--text-ghost": "#b8b8d0",

      "--accent": "#4f46e5",
      "--accent-dim": "rgba(79,70,229,0.10)",
      "--accent-border": "rgba(79,70,229,0.25)",
      "--accent-glow": "rgba(79,70,229,0.18)",

      "--accent2": "#ec489a",
      "--accent2-dim": "rgba(236,72,153,0.08)",
      "--accent2-border": "#fbcfe8",

      "--drag-handle": "#d8d8e6",
    },
  },

  // ── 13. HONEY — warm honey, darker tone ───────────────────────────────────
  {
    id: "honey",
    label: "Honey",
    swatch: "#eab308",
    vars: {
      "--bg-base": "#f0e6d4",
      "--bg-panel": "#e6d9c2",
      "--bg-surface": "#f8f0e0",
      "--bg-elevated": "#fdf8ec",
      "--bg-code": "#f0e4d0",

      "--border": "#e0d0b0",
      "--border-subtle": "#ecd9be",

      "--text-primary": "#3a2a18",
      "--text-secondary": "#7a623a",
      "--text-muted": "#a07f5f",
      "--text-ghost": "#d4c4a0",

      "--accent": "#eab308",
      "--accent-dim": "rgba(234,179,8,0.12)",
      "--accent-border": "rgba(234,179,8,0.28)",
      "--accent-glow": "rgba(234,179,8,0.22)",

      "--accent2": "#f97316",
      "--accent2-dim": "rgba(249,115,22,0.10)",
      "--accent2-border": "#ffedd5",

      "--drag-handle": "#e6d9c2",
    },
  },

  // ── 14. MINT — fresh mint, darker tone ────────────────────────────────────
  {
    id: "mint",
    label: "Mint",
    swatch: "#14b8a6",
    vars: {
      "--bg-base": "#e0f0eb",
      "--bg-panel": "#d0e8e2",
      "--bg-surface": "#e8f5f1",
      "--bg-elevated": "#f0faf6",
      "--bg-code": "#e2f0ea",

      "--border": "#b8e0d4",
      "--border-subtle": "#c8e8df",

      "--text-primary": "#1e4642",
      "--text-secondary": "#5f8a84",
      "--text-muted": "#7eb8a8",
      "--text-ghost": "#a8d4c8",

      "--accent": "#14b8a6",
      "--accent-dim": "rgba(20,184,166,0.10)",
      "--accent-border": "rgba(20,184,166,0.25)",
      "--accent-glow": "rgba(20,184,166,0.18)",

      "--accent2": "#8b5cf6",
      "--accent2-dim": "rgba(139,92,246,0.08)",
      "--accent2-border": "#ede9fe",

      "--drag-handle": "#d0e8e2",
    },
  },

  // ── 15. PEACH — soft peach, darker tone ───────────────────────────────────
  {
    id: "peach",
    label: "Peach",
    swatch: "#f97316",
    vars: {
      "--bg-base": "#f0e4d8",
      "--bg-panel": "#e6d4c2",
      "--bg-surface": "#f8ede0",
      "--bg-elevated": "#fdf6ec",
      "--bg-code": "#f0e0d0",

      "--border": "#e0c8a8",
      "--border-subtle": "#ecd4b8",

      "--text-primary": "#3b2a1f",
      "--text-secondary": "#8b6b50",
      "--text-muted": "#b38a6f",
      "--text-ghost": "#d8c8b0",

      "--accent": "#f97316",
      "--accent-dim": "rgba(249,115,22,0.10)",
      "--accent-border": "rgba(249,115,22,0.25)",
      "--accent-glow": "rgba(249,115,22,0.18)",

      "--accent2": "#06b6d4",
      "--accent2-dim": "rgba(6,182,212,0.10)",
      "--accent2-border": "#cffafe",

      "--drag-handle": "#e6d4c2",
    },
  },

  // ── 16. FROST — cool gray, darker tone ────────────────────────────────────
  {
    id: "frost",
    label: "Frost",
    swatch: "#06b6d4",
    vars: {
      "--bg-base": "#e4ecf7",
      "--bg-panel": "#d6e2f0",
      "--bg-surface": "#ecf2f9",
      "--bg-elevated": "#f4f9fe",
      "--bg-code": "#e9f0f8",

      "--border": "#c8d8ec",
      "--border-subtle": "#d6e4f2",

      "--text-primary": "#1e2e3e",
      "--text-secondary": "#5b6e7e",
      "--text-muted": "#7e9ab8",
      "--text-ghost": "#b8cce4",

      "--accent": "#06b6d4",
      "--accent-dim": "rgba(6,182,212,0.10)",
      "--accent-border": "rgba(6,182,212,0.22)",
      "--accent-glow": "rgba(6,182,212,0.18)",

      "--accent2": "#a855f7",
      "--accent2-dim": "rgba(168,85,247,0.08)",
      "--accent2-border": "#ede9fe",

      "--drag-handle": "#d6e2f0",
    },
  },

  // ── 17. STONE — warm neutral, darker tone ─────────────────────────────────
  {
    id: "stone",
    label: "Stone",
    swatch: "#78716c",
    vars: {
      "--bg-base": "#ebe6e0",
      "--bg-panel": "#e2dad2",
      "--bg-surface": "#f2ede6",
      "--bg-elevated": "#f8f5f0",
      "--bg-code": "#f0e9e0",

      "--border": "#d9d0c4",
      "--border-subtle": "#e4dbd0",

      "--text-primary": "#2b2520",
      "--text-secondary": "#6b625a",
      "--text-muted": "#9c8f7f",
      "--text-ghost": "#d1c6b8",

      "--accent": "#78716c",
      "--accent-dim": "rgba(120,113,108,0.12)",
      "--accent-border": "rgba(120,113,108,0.25)",
      "--accent-glow": "rgba(120,113,108,0.15)",

      "--accent2": "#d97706",
      "--accent2-dim": "rgba(217,119,6,0.10)",
      "--accent2-border": "#fed7aa",

      "--drag-handle": "#e2dad2",
    },
  },

  // ── 18. OCEAN BREEZE — light blue, darker tone ────────────────────────────
  {
    id: "ocean-breeze",
    label: "Ocean Breeze",
    swatch: "#3b82f6",
    vars: {
      "--bg-base": "#e4ebf8",
      "--bg-panel": "#d6e2f2",
      "--bg-surface": "#ecf2fb",
      "--bg-elevated": "#f4f9fe",
      "--bg-code": "#e9f0f9",

      "--border": "#c8d8f0",
      "--border-subtle": "#d6e4f5",

      "--text-primary": "#1e2a3a",
      "--text-secondary": "#5a6e82",
      "--text-muted": "#7e96b8",
      "--text-ghost": "#b8cce8",

      "--accent": "#3b82f6",
      "--accent-dim": "rgba(59,130,246,0.10)",
      "--accent-border": "rgba(59,130,246,0.25)",
      "--accent-glow": "rgba(59,130,246,0.20)",

      "--accent2": "#f97316",
      "--accent2-dim": "rgba(249,115,22,0.10)",
      "--accent2-border": "#fed7aa",

      "--drag-handle": "#d6e2f2",
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
