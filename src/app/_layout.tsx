import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

import {
    AppPreferencesProvider,
    useAppPreferences,
} from "@/hooks/use-app-preferences";
import { initDatabase } from "../database/db";
import { registerForPushNotificationsAsync } from "../services/notificationService";

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AppPreferencesProvider>
      <AppNavigator />
    </AppPreferencesProvider>
  );
}

function AppNavigator() {
  const router = useRouter();
  const { colors, fontFamily, mode, t } = useAppPreferences();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
          fontFamily,
          fontSize: 12,
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        statusBarStyle: mode === "dark" ? "light" : "dark",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("dashboardTitle"),
          headerLeft: () => (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t("settingsTitle")}
              onPress={() => router.push("/setting")}
              style={{ marginRight: 15, padding: 6 }}
            >
              <Text style={{ color: colors.text, fontSize: 18 }}>⚙</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push("/create")}
              style={{
                backgroundColor: colors.primary,
                borderWidth: 2,
                borderColor: colors.text,
                paddingHorizontal: 10,
                paddingVertical: 7,
              }}
            >
              <Text
                style={{
                  color: colors.background,
                  fontFamily,
                  fontWeight: "bold",
                  fontSize: 10,
                }}
              >
                {t("addQuest")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="habit-detail" options={{ title: t("dailyQuest") }} />
      <Stack.Screen name="create" options={{ title: t("newQuest") }} />
      <Stack.Screen name="edit" options={{ title: t("editQuest") }} />
      <Stack.Screen name="setting" options={{ title: t("settingsTitle") }} />
    </Stack>
  );
}
