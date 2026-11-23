import { useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { createHabit, createRenewalTask } from "../database/queries";
import { useAppPreferences } from "../hooks/use-app-preferences";
import { scheduleDailyHabitReminder } from "../services/notificationService";

export default function CreateTaskScreen() {
  const router = useRouter();
  const { colors, fontFamily, t } = useAppPreferences();
  const styles = createStyles(colors, fontFamily);
  const [isRenewalMode, setIsRenewalMode] = useState(true);

  // Renewal Form State
  const [renewalTitle, setRenewalTitle] = useState("");
  const [frequencyDays, setFrequencyDays] = useState("7");

  // Habit Form State
  const [habitTitle, setHabitTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("18:30"); // Format: HH:MM
  const [stepsInput, setStepsInput] = useState("Push-ups\nSquats\nStretch");

  const handleSave = async () => {
    if (isRenewalMode) {
      if (!renewalTitle.trim()) {
        alert(t("enterTask"));
        return;
      }
      const days = parseInt(frequencyDays) || 7;
      const today = new Date().toISOString().split("T")[0];

      createRenewalTask(renewalTitle, days, today, "09:00");
      alert(t("taskCreated"));
    } else {
      if (!habitTitle.trim()) {
        alert(t("enterHabit"));
        return;
      }
      const stepsArray = stepsInput
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      createHabit(habitTitle, scheduledTime, stepsArray);

      // Schedule local notification alarm
      // Note: In a real app we'd grab the inserted ID, but for now we schedule it
      await scheduleDailyHabitReminder(Date.now(), habitTitle, scheduledTime);

      alert(t("habitCreated"));
    }

    router.back(); // Return to dashboard
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>{t("createTitle")}</Text>
        <Text style={styles.screenHint}>{t("createHint")}</Text>

        {/* Mode Selector Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isRenewalMode && styles.toggleActive]}
            onPress={() => setIsRenewalMode(true)}
          >
            <Text
              style={[
                styles.toggleText,
                isRenewalMode && styles.toggleTextActive,
              ]}
            >
              {t("intervalRenewal")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isRenewalMode && styles.toggleActive]}
            onPress={() => setIsRenewalMode(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !isRenewalMode && styles.toggleTextActive,
              ]}
            >
              {t("dailyHabit")}
            </Text>
          </TouchableOpacity>
        </View>

        {isRenewalMode ? (
          /* ================= RENEWAL FORM ================= */
          <View style={styles.formSection}>
            <Text style={styles.label}>{t("taskTitle")}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Wash Bed Sheets"
              placeholderTextColor={colors.textLight}
              value={renewalTitle}
              onChangeText={setRenewalTitle}
            />

            <Text style={styles.label}>{t("frequencyDays")}</Text>
            <TextInput
              style={styles.input}
              placeholder="7"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
              value={frequencyDays}
              onChangeText={setFrequencyDays}
            />
            <Text style={styles.hint}>{t("nextDueHint")}</Text>
          </View>
        ) : (
          /* ================= DAILY HABIT FORM ================= */
          <View style={styles.formSection}>
            <Text style={styles.label}>{t("habitTitle")}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Evening Workout"
              placeholderTextColor={colors.textLight}
              value={habitTitle}
              onChangeText={setHabitTitle}
            />

            <Text style={styles.label}>{t("scheduledTime")}</Text>
            <TextInput
              style={styles.input}
              placeholder="18:30"
              placeholderTextColor={colors.textLight}
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />

            <Text style={styles.label}>{t("checklistSteps")}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t("stepPlaceholder")}
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              value={stepsInput}
              onChangeText={setStepsInput}
            />
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t("saveQuest")}</Text>
        </TouchableOpacity>
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
      fontSize: 19,
      fontFamily,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 6,
    },
    screenHint: {
      color: colors.textLight,
      fontFamily,
      fontSize: 11,
      marginBottom: 20,
    },
    toggleContainer: {
      flexDirection: "row",
      backgroundColor: colors.secondary,
      borderWidth: 2,
      borderColor: colors.text,
      padding: 4,
      marginBottom: 24,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 11,
      alignItems: "center",
    },
    toggleActive: {
      backgroundColor: colors.cardBg,
      borderWidth: 2,
      borderColor: colors.text,
    },
    toggleText: {
      fontSize: 10,
      fontFamily,
      fontWeight: "600",
      color: colors.textLight,
    },
    toggleTextActive: {
      color: colors.text,
    },
    formSection: {
      gap: 16,
    },
    label: {
      fontSize: 11,
      fontFamily,
      fontWeight: "600",
      color: colors.text,
      marginBottom: -8,
    },
    input: {
      backgroundColor: colors.cardBg,
      borderWidth: 2,
      borderColor: colors.text,
      paddingHorizontal: 13,
      paddingVertical: 12,
      fontSize: 14,
      fontFamily,
      color: colors.text,
      shadowColor: colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },
    hint: {
      fontSize: 10,
      fontFamily,
      color: colors.textLight,
      marginTop: -10,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.text,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 32,
      shadowColor: colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    saveButtonText: {
      color: colors.cardBg,
      fontSize: 11,
      fontFamily,
      fontWeight: "bold",
    },
  });
}
