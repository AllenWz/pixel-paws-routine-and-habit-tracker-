/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useAppPreferences } from "@/hooks/use-app-preferences";

export function useTheme() {
  return useAppPreferences().colors;
}
