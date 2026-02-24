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
];

export const DEFAULT_THEME_ID = "void";

/** Inject CSS variables onto :root by writing them to document.documentElement */
export function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
}
