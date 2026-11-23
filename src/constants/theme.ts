import { Platform } from "react-native";

export type ThemeMode = "light" | "dark";

export const RetroTheme = {
  fonts: {
    family: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },
  borderRadius: {
    sm: 0,
    md: 2,
    lg: 4,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
};

export const ThemePalettes = {
  dark: {
    background: "#090F1E",
    cardBg: "#141F36",
    primary: "#42F5C5",
    secondary: "#4569F5",
    accent: "#FFD166",
    text: "#EAF5FF",
    textLight: "#A4B7D2",
    border: "#42F5C5",
    success: "#55D6A4",
    danger: "#FF6685",
    lavender: "#A88BFF",
    blush: "#173D4A",
    shadow: "#030712",
    backgroundElement: "#141F36",
    backgroundSelected: "#234B59",
    textSecondary: "#A4B7D2",
    tint: "#42F5C5",
    icon: "#A4B7D2",
    tabIconDefault: "#A4B7D2",
    tabIconSelected: "#42F5C5",
  },
  light: {
    background: "#EAF1FF",
    cardBg: "#FAFCFF",
    primary: "#126B67",
    secondary: "#6E8DF7",
    accent: "#E8B83E",
    text: "#17233D",
    textLight: "#536582",
    border: "#126B67",
    success: "#278567",
    danger: "#C83E5C",
    lavender: "#7961C9",
    blush: "#CBEFE8",
    shadow: "#A2B3D3",
    backgroundElement: "#FAFCFF",
    backgroundSelected: "#CBEFE8",
    textSecondary: "#536582",
    tint: "#126B67",
    icon: "#536582",
    tabIconDefault: "#536582",
    tabIconSelected: "#126B67",
  },
} as const;

export type AppThemeColors = (typeof ThemePalettes)[ThemeMode];
export type ThemeColor = keyof AppThemeColors;

export const Colors = {
  light: {
    text: ThemePalettes.light.text,
    background: ThemePalettes.light.background,
    tint: ThemePalettes.light.tint,
    icon: ThemePalettes.light.icon,
    tabIconDefault: ThemePalettes.light.tabIconDefault,
    tabIconSelected: ThemePalettes.light.tabIconSelected,
    backgroundElement: ThemePalettes.light.backgroundElement,
    backgroundSelected: ThemePalettes.light.backgroundSelected,
    textSecondary: ThemePalettes.light.textSecondary,
  },
  dark: {
    text: ThemePalettes.dark.text,
    background: ThemePalettes.dark.background,
    tint: ThemePalettes.dark.tint,
    icon: ThemePalettes.dark.icon,
    tabIconDefault: ThemePalettes.dark.tabIconDefault,
    tabIconSelected: ThemePalettes.dark.tabIconSelected,
    backgroundElement: ThemePalettes.dark.backgroundElement,
    backgroundSelected: ThemePalettes.dark.backgroundSelected,
    textSecondary: ThemePalettes.dark.textSecondary,
  },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
};

export const BottomTabInset = 64;
export const MaxContentWidth = 560;

export const Fonts = Platform.select({
  ios: {
    sans: "Menlo",
    serif: "Georgia",
    rounded: "Menlo",
    mono: "Menlo",
  },
  default: {
    sans: "monospace",
    serif: "serif",
    rounded: "monospace",
    mono: "monospace",
  },
});
