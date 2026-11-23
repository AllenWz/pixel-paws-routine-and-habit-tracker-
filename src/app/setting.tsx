import * as Notifications from "expo-notifications";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useAppPreferences } from "@/hooks/use-app-preferences";

export default function SettingsScreen() {
  const { colors, fontFamily, language, mode, setLanguage, setMode, t } =
    useAppPreferences();
  const styles = createStyles(colors, fontFamily);

  const handleTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t("testNotificationTitle"),
        body: t("notificationBody"),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    alert(t("notificationScheduled"));
  };

  const handleResetData = () => {
    Alert.alert(t("reloadTitle"), t("reloadMessage"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("runSeed"),
        onPress: () => alert(t("seedCompleted")),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>🐾 {t("settings")}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("language")}</Text>
          <View style={styles.choiceRow}>
            {(["en", "my"] as const).map((option) => {
              const selected = language === option;
              return (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={[
                    styles.choiceButton,
                    selected && styles.choiceSelected,
                  ]}
                  onPress={() => setLanguage(option)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      selected && styles.choiceTextSelected,
                    ]}
                  >
                    {option === "en"
                      ? `EN · ${t("english")}`
                      : `MM · ${t("myanmar")}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("displayMode")}</Text>
          <View style={styles.choiceRow}>
            {(["light", "dark"] as const).map((option) => {
              const selected = mode === option;
              return (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={[
                    styles.choiceButton,
                    selected && styles.choiceSelected,
                  ]}
                  onPress={() => setMode(option)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      selected && styles.choiceTextSelected,
                    ]}
                  >
                    {option === "light"
                      ? `☀ ${t("lightMode")}`
                      : `☾ ${t("darkMode")}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.hint}>{t("appearanceHint")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("notifications")}</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleTestNotification}
          >
            <Text style={styles.settingText}>{t("testAlarm")}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("data")}</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetData}
          >
            <Text style={styles.settingText}>{t("reloadSample")}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{t("about")}</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>{t("appName")}</Text>
            <Text style={styles.infoValue}>Pixel Paws</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>{t("version")}</Text>
            <Text style={styles.infoValue}>1.0.0 (SQLite Local)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  colors: ReturnType<typeof useAppPreferences>["colors"],
  fontFamily?: string,
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 18,
      paddingBottom: 32,
    },
    headerTitle: {
      fontSize: 17,
      fontFamily,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 20,
    },
    section: {
      marginBottom: 22,
    },
    sectionHeader: {
      fontSize: 10,
      fontFamily,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 9,
      letterSpacing: 0.3,
    },
    choiceRow: {
      flexDirection: "row",
      gap: 8,
    },
    choiceButton: {
      flex: 1,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      backgroundColor: colors.cardBg,
      borderWidth: 2,
      borderColor: colors.textLight,
    },
    choiceSelected: {
      backgroundColor: colors.backgroundSelected,
      borderColor: colors.primary,
    },
    choiceText: {
      color: colors.textLight,
      fontSize: 10,
      fontFamily,
      fontWeight: "bold",
      textAlign: "center",
    },
    choiceTextSelected: {
      color: colors.text,
    },
    hint: {
      color: colors.textLight,
      fontFamily,
      fontSize: 10,
      marginTop: 9,
    },
    settingItem: {
      backgroundColor: colors.cardBg,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 2,
      borderColor: colors.text,
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    settingText: {
      fontSize: 11,
      fontFamily,
      color: colors.text,
      fontWeight: "500",
    },
    settingArrow: {
      fontSize: 20,
      color: colors.primary,
      fontFamily,
      fontWeight: "bold",
    },
    infoBox: {
      backgroundColor: colors.cardBg,
      padding: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.text,
      marginBottom: 6,
    },
    infoLabel: {
      fontSize: 10,
      fontFamily,
      color: colors.textLight,
    },
    infoValue: {
      fontSize: 10,
      fontFamily,
      fontWeight: "600",
      color: colors.text,
    },
  });
}
