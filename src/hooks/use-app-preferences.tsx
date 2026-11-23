import Storage from "expo-sqlite/kv-store";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

import {
    RetroTheme,
    ThemePalettes,
    type AppThemeColors,
    type ThemeMode,
} from "@/constants/theme";
import { translations, type TranslationKey } from "@/constants/translations";

export type AppLanguage = "en" | "my";

const LANGUAGE_KEY = "habit-tracker.language";
const THEME_KEY = "habit-tracker.theme";

type TranslationValues = Record<string, string | number>;

type AppPreferencesContextValue = {
  language: AppLanguage;
  mode: ThemeMode;
  colors: AppThemeColors;
  fontFamily?: string;
  setLanguage: (language: AppLanguage) => void;
  setMode: (mode: ThemeMode) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(
  null,
);

function readStoredValue(key: string, fallback: string): string {
  try {
    return Storage.getItemSync(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function AppPreferencesProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<AppLanguage>(() =>
    readStoredValue(LANGUAGE_KEY, "en") === "my" ? "my" : "en",
  );
  const [mode, setModeState] = useState<ThemeMode>(() =>
    readStoredValue(THEME_KEY, "dark") === "light" ? "light" : "dark",
  );

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    try {
      Storage.setItemSync(LANGUAGE_KEY, nextLanguage);
    } catch (error) {
      console.warn("Could not save language preference", error);
    }
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    try {
      Storage.setItemSync(THEME_KEY, nextMode);
    } catch (error) {
      console.warn("Could not save theme preference", error);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, values?: TranslationValues) => {
      let message: string = translations[language][key];
      for (const [name, value] of Object.entries(values ?? {})) {
        message = message.replaceAll(`{${name}}`, String(value));
      }
      return message;
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      mode,
      colors: ThemePalettes[mode],
      fontFamily: language === "my" ? undefined : RetroTheme.fonts.family,
      setLanguage,
      setMode,
      t,
    }),
    [language, mode, setLanguage, setMode, t],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error(
      "useAppPreferences must be used within AppPreferencesProvider",
    );
  }
  return context;
}
