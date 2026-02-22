import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  APP_THEMES,
  DEFAULT_THEME_ID,
  applyTheme,
  type AppTheme,
} from "./appThemes";

interface ThemeContextValue {
  theme: AppTheme;
  setThemeById: (id: string) => void;
  themes: AppTheme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(
    () => APP_THEMES.find((t) => t.id === DEFAULT_THEME_ID) ?? APP_THEMES[0],
  );

  // Apply CSS variables on mount and whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setThemeById = (id: string) => {
    const found = APP_THEMES.find((t) => t.id === id);
    if (found) setTheme(found);
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeById, themes: APP_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used inside AppThemeProvider");
  return ctx;
}
