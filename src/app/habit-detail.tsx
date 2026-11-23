import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useAppPreferences } from "@/hooks/use-app-preferences";
import {
    finishHabitLog,
    getHabitChecklist,
    type HabitChecklistStep,
} from "../database/queries";

export default function HabitDetailScreen() {
  const router = useRouter();
  const { colors, fontFamily, t } = useAppPreferences();
  const styles = createStyles(colors, fontFamily);
  const params = useLocalSearchParams();
  const habitId = Number(params.id);
  const habitTitle = (params.title as string) || t("dailyHabit");

  const [steps] = useState<HabitChecklistStep[]>(() =>
    habitId ? getHabitChecklist(habitId) : [],
  );
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {},
  );

  const toggleCheck = (stepId: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleFinishHabit = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    finishHabitLog(habitId, todayStr);
    alert(t("habitCompleted", { title: habitTitle }));
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>{habitTitle}</Text>
        <Text style={styles.subtitle}>{t("checklistHint")}</Text>

        {steps.length === 0 ? (
          <Text style={styles.emptyText}>{t("noChecklist")}</Text>
        ) : (
          steps.map((step) => {
            const isChecked = !!checkedItems[step.id];
            return (
              <TouchableOpacity
                key={step.id}
                style={[styles.checkCard, isChecked && styles.checkedCard]}
                onPress={() => toggleCheck(step.id)}
              >
                <View
                  style={[styles.checkbox, isChecked && styles.checkboxChecked]}
                >
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[styles.stepText, isChecked && styles.stepTextChecked]}
                >
                  {step.step_name}
                </Text>
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishHabit}
        >
          <Text style={styles.finishButtonText}>{t("finishQuest")}</Text>
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
      fontSize: 18,
      fontFamily,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 11,
      fontFamily,
      color: colors.textLight,
      marginBottom: 20,
    },
    checkCard: {
      backgroundColor: colors.cardBg,
      padding: 16,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.text,
      shadowColor: colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    checkedCard: {
      backgroundColor: colors.backgroundSelected,
      borderColor: colors.primary,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: colors.text,
      marginRight: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: colors.success,
      borderColor: colors.text,
    },
    checkmark: {
      color: colors.text,
      fontFamily,
      fontWeight: "bold",
      fontSize: 14,
    },
    stepText: {
      fontSize: 13,
      fontFamily,
      color: colors.text,
      flex: 1,
    },
    stepTextChecked: {
      textDecorationLine: "line-through",
      color: colors.textLight,
    },
    finishButton: {
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.text,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    finishButtonText: {
      color: colors.cardBg,
      fontSize: 11,
      fontFamily,
      fontWeight: "bold",
    },
    emptyText: {
      color: colors.textLight,
      fontFamily,
      fontStyle: "italic",
    },
  });
}
