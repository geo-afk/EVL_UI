import type * as Monaco from "monaco-editor";

export interface EditorTheme {
  id: string;
  label: string;
  accent: string; // color used for the dot/swatch in the dropdown
  base: "vs-dark" | "vs" | "hc-black";
  themeData: Monaco.editor.IStandaloneThemeData;
}

// ─── Custom built-in theme ────────────────────────────────────────────────────
const devforgeDark: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "4a4a5e", fontStyle: "italic" },
    { token: "keyword", foreground: "fb923c" },
    { token: "string", foreground: "86efac" },
    { token: "number", foreground: "7dd3fc" },
    { token: "type", foreground: "c4b5fd" },
    { token: "function", foreground: "fde68a" },
  ],
  colors: {
    "editor.background": "#0e0e12",
    "editor.foreground": "#d4d4e8",
    "editorLineNumber.foreground": "#2e2e3e",
    "editorLineNumber.activeForeground": "#fb923c",
    "editor.lineHighlightBackground": "#141420",
    "editorCursor.foreground": "#fb923c",
    "editor.selectionBackground": "#fb923c28",
    "editorGutter.background": "#0e0e12",
    "editorWidget.background": "#16161e",
    "editorSuggestWidget.background": "#16161e",
    "editorSuggestWidget.border": "#2a2a38",
    "editorSuggestWidget.selectedBackground": "#1e1e2e",
  },
};

const nightOwl: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "637777", fontStyle: "italic" },
    { token: "keyword", foreground: "c792ea" },
    { token: "string", foreground: "ecc48d" },
    { token: "number", foreground: "f78c6c" },
    { token: "type", foreground: "ffcb8b" },
    { token: "function", foreground: "82aaff" },
    { token: "variable", foreground: "addb67" },
    { token: "operator", foreground: "7fdbca" },
  ],
  colors: {
    "editor.background": "#011627",
    "editor.foreground": "#d6deeb",
    "editorLineNumber.foreground": "#1d3b53",
    "editorLineNumber.activeForeground": "#c5e4fd",
    "editor.lineHighlightBackground": "#0b2942",
    "editorCursor.foreground": "#80a4c2",
    "editor.selectionBackground": "#1d3b5380",
    "editorGutter.background": "#011627",
    "editorWidget.background": "#04253a",
    "editorSuggestWidget.background": "#04253a",
    "editorSuggestWidget.border": "#1d3b53",
    "editorSuggestWidget.selectedBackground": "#0b2942",
  },
};

const roseGlass: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6b4f5e", fontStyle: "italic" },
    { token: "keyword", foreground: "f4a7b9" },
    { token: "string", foreground: "f9c8d4" },
    { token: "number", foreground: "ffb7c5" },
    { token: "type", foreground: "e8a0b4" },
    { token: "function", foreground: "ffd6df" },
    { token: "variable", foreground: "f7c5d0" },
  ],
  colors: {
    "editor.background": "#180d12",
    "editor.foreground": "#f5dde5",
    "editorLineNumber.foreground": "#3a1c26",
    "editorLineNumber.activeForeground": "#f4a7b9",
    "editor.lineHighlightBackground": "#1f0e16",
    "editorCursor.foreground": "#f4a7b9",
    "editor.selectionBackground": "#f4a7b930",
    "editorGutter.background": "#180d12",
    "editorWidget.background": "#220e18",
    "editorSuggestWidget.background": "#220e18",
    "editorSuggestWidget.border": "#3a1c26",
    "editorSuggestWidget.selectedBackground": "#2c1220",
  },
};

const arcticIce: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "4c6680", fontStyle: "italic" },
    { token: "keyword", foreground: "88c0d0" },
    { token: "string", foreground: "a3be8c" },
    { token: "number", foreground: "b48ead" },
    { token: "type", foreground: "ebcb8b" },
    { token: "function", foreground: "81a1c1" },
    { token: "variable", foreground: "d8dee9" },
    { token: "operator", foreground: "81a1c1" },
  ],
  colors: {
    "editor.background": "#1e2128",
    "editor.foreground": "#d8dee9",
    "editorLineNumber.foreground": "#3b4252",
    "editorLineNumber.activeForeground": "#88c0d0",
    "editor.lineHighlightBackground": "#252a33",
    "editorCursor.foreground": "#88c0d0",
    "editor.selectionBackground": "#434c5e80",
    "editorGutter.background": "#1e2128",
    "editorWidget.background": "#252a33",
    "editorSuggestWidget.background": "#252a33",
    "editorSuggestWidget.border": "#3b4252",
    "editorSuggestWidget.selectedBackground": "#2e3440",
  },
};

const cyberPunk: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "3d3d5c", fontStyle: "italic" },
    { token: "keyword", foreground: "ff2d78" },
    { token: "string", foreground: "00ff9c" },
    { token: "number", foreground: "ffe74c" },
    { token: "type", foreground: "bf5af2" },
    { token: "function", foreground: "0af5ff" },
    { token: "variable", foreground: "e2e2e8" },
    { token: "operator", foreground: "ff2d78" },
  ],
  colors: {
    "editor.background": "#080810",
    "editor.foreground": "#e2e2f0",
    "editorLineNumber.foreground": "#1e1e3a",
    "editorLineNumber.activeForeground": "#ff2d78",
    "editor.lineHighlightBackground": "#0d0d1e",
    "editorCursor.foreground": "#ff2d78",
    "editor.selectionBackground": "#ff2d7830",
    "editorGutter.background": "#080810",
    "editorWidget.background": "#0d0d1e",
    "editorSuggestWidget.background": "#0d0d1e",
    "editorSuggestWidget.border": "#1e1e3a",
    "editorSuggestWidget.selectedBackground": "#14142a",
  },
};

const forestDark: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "4a6741", fontStyle: "italic" },
    { token: "keyword", foreground: "98c379" },
    { token: "string", foreground: "d19a66" },
    { token: "number", foreground: "61afef" },
    { token: "type", foreground: "e5c07b" },
    { token: "function", foreground: "56b6c2" },
    { token: "variable", foreground: "abb2bf" },
    { token: "operator", foreground: "c678dd" },
  ],
  colors: {
    "editor.background": "#0d1a0d",
    "editor.foreground": "#abb2bf",
    "editorLineNumber.foreground": "#1e3a1e",
    "editorLineNumber.activeForeground": "#98c379",
    "editor.lineHighlightBackground": "#111f11",
    "editorCursor.foreground": "#98c379",
    "editor.selectionBackground": "#98c37930",
    "editorGutter.background": "#0d1a0d",
    "editorWidget.background": "#111f11",
    "editorSuggestWidget.background": "#111f11",
    "editorSuggestWidget.border": "#1e3a1e",
    "editorSuggestWidget.selectedBackground": "#162616",
  },
};

const sandstorm: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "5c4f3a", fontStyle: "italic" },
    { token: "keyword", foreground: "e5a550" },
    { token: "string", foreground: "c5a882" },
    { token: "number", foreground: "d4915a" },
    { token: "type", foreground: "e8c87a" },
    { token: "function", foreground: "f0d080" },
    { token: "variable", foreground: "d4c4a8" },
  ],
  colors: {
    "editor.background": "#1a1208",
    "editor.foreground": "#d4c4a8",
    "editorLineNumber.foreground": "#3a2e1c",
    "editorLineNumber.activeForeground": "#e5a550",
    "editor.lineHighlightBackground": "#1f1610",
    "editorCursor.foreground": "#e5a550",
    "editor.selectionBackground": "#e5a55030",
    "editorGutter.background": "#1a1208",
    "editorWidget.background": "#1f1610",
    "editorSuggestWidget.background": "#1f1610",
    "editorSuggestWidget.border": "#3a2e1c",
    "editorSuggestWidget.selectedBackground": "#2a1e0e",
  },
};

const dracula: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6272a4", fontStyle: "italic" },
    { token: "keyword", foreground: "ff79c6" },
    { token: "storage", foreground: "ff79c6" },
    { token: "string", foreground: "f1fa8c" },
    { token: "number", foreground: "bd93f9" },
    { token: "constant", foreground: "bd93f9" },
    { token: "type", foreground: "8be9fd", fontStyle: "italic" },
    { token: "function", foreground: "50fa7b" },
    { token: "variable", foreground: "ffb86c" },
    { token: "variable.parameter", foreground: "ffb86c", fontStyle: "italic" },
    { token: "entity.name.tag", foreground: "ff79c6" },
    { token: "entity.name.class", foreground: "50fa7b" },
    { token: "support.function", foreground: "8be9fd" },
    { token: "operator", foreground: "ff79c6" },
  ],
  colors: {
    "editor.background": "#282a36",
    "editor.foreground": "#f8f8f2",
    "editorLineNumber.foreground": "#44475a",
    "editorLineNumber.activeForeground": "#bd93f9",
    "editor.lineHighlightBackground": "#44475a",
    "editorCursor.foreground": "#f8f8f0",
    "editor.selectionBackground": "#44475a",
    "editorGutter.background": "#282a36",
    "editorWidget.background": "#21222c",
    "editorSuggestWidget.background": "#21222c",
    "editorSuggestWidget.border": "#44475a",
    "editorSuggestWidget.selectedBackground": "#44475a",
  },
};

// ─── Theme Registry ───────────────────────────────────────────────────────────
export const EDITOR_THEMES: EditorTheme[] = [
  {
    id: "devforge-dark",
    label: "DevForge",
    accent: "#fb923c",
    base: "vs-dark",
    themeData: devforgeDark,
  },
  {
    id: "night-owl",
    label: "Night Owl",
    accent: "#82aaff",
    base: "vs-dark",
    themeData: nightOwl,
  },
  {
    id: "arctic-ice",
    label: "Arctic Ice",
    accent: "#88c0d0",
    base: "vs-dark",
    themeData: arcticIce,
  },
  {
    id: "forest-dark",
    label: "Forest",
    accent: "#98c379",
    base: "vs-dark",
    themeData: forestDark,
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    accent: "#ff2d78",
    base: "vs-dark",
    themeData: cyberPunk,
  },
  {
    id: "rose-glass",
    label: "Rose Glass",
    accent: "#f4a7b9",
    base: "vs-dark",
    themeData: roseGlass,
  },
  {
    id: "sandstorm",
    label: "Sandstorm",
    accent: "#e5a550",
    base: "vs-dark",
    themeData: sandstorm,
  },
  {
    id: "dracula",
    label: "Dracula",
    accent: "#bd93f9",
    base: "vs-dark",
    themeData: dracula,
  },
];

export const DEFAULT_THEME_ID = "devforge-dark";

export function registerAllThemes(monaco: typeof import("monaco-editor")) {
  for (const theme of EDITOR_THEMES) {
    monaco.editor.defineTheme(theme.id, theme.themeData);
  }
}
