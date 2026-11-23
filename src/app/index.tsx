import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PixelCat } from "../components/pixel-cat";
import { RetroTheme } from "../constants/theme";
import {
  deleteHabit,
  deleteRenewalTask,
  executeRenewalTask,
  getHabits,
  getHabitStreak,
  getRenewalTasks,
  Habit,
  isHabitCompletedToday,
  RenewalTask,
} from "../database/queries";
import { useAppPreferences } from "../hooks/use-app-preferences";

export default function DashboardScreen() {
  const [renewalTasks, setRenewalTasks] = useState<RenewalTask[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const router = useRouter();
  const { colors, fontFamily, t } = useAppPreferences();
  const styles = createStyles(colors, fontFamily);

  const loadData = () => {
    setRenewalTasks(getRenewalTasks());
    setHabits(getHabits());
  };

  // Re-loads tasks and habits every time navigate back to the dashboard
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const completedHabits = habits.filter((habit) =>
    isHabitCompletedToday(habit.id, todayStr),
  ).length;

  const handleRenew = (id: number, frequencyDays: number) => {
    executeRenewalTask(id, frequencyDays);
    loadData(); // Refresh UI
  };

  const handleDeleteRenewal = (id: number, title: string) => {
    Alert.alert(t("deleteTaskTitle"), t("deleteConfirm", { title }), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          deleteRenewalTask(id);
          loadData();
        },
      },
    ]);
  };

  const handleDeleteHabit = (id: number, title: string) => {
    Alert.alert(t("deleteHabitTitle"), t("deleteConfirm", { title }), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          deleteHabit(id);
          loadData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>{t("heroEyebrow")}</Text>
            <Text style={styles.headerTitle}>{t("heroTitle")}</Text>
            <Text style={styles.heroSubtitle}>
              {t("dailyProgress", {
                done: completedHabits,
                total: habits.length,
              })}
            </Text>
          </View>
          <PixelCat pixelSize={6} />
        </View>

        {/* SECTION 1: INTERVAL RENEWALS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("renewals")}</Text>
        </View>

        {renewalTasks.length === 0 ? (
          <Text style={styles.emptyText}>{t("emptyRenewals")}</Text>
        ) : (
          renewalTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/edit",
                  params: { id: task.id, type: "task" },
                })
              }
            >
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>🐾 {task.title}</Text>
                <Text style={styles.cardSubtitle}>
                  {t("nextDue", {
                    date: task.next_due_at,
                    days: task.frequency_days,
                  })}
                </Text>
                {task.last_executed_at && (
                  <Text style={styles.cardMeta}>
                    {t("lastDone", { date: task.last_executed_at })}
                  </Text>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRenew(task.id, task.frequency_days)}
                >
                  <Text style={styles.actionButtonText}>{t("renew")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteRenewal(task.id, task.title)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* SECTION 2: DAILY HABITS */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>{t("habits")}</Text>
        </View>

        {habits.length === 0 ? (
          <Text style={styles.emptyText}>{t("emptyHabits")}</Text>
        ) : (
          habits.map((habit) => {
            const isCompleted = isHabitCompletedToday(habit.id, todayStr);
            const streak = getHabitStreak(habit.id);

            return (
              <TouchableOpacity
                key={habit.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/edit",
                    params: { id: habit.id, type: "habit" },
                  })
                }
              >
                <View style={styles.cardInfo}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={styles.cardTitle}>🐱 {habit.title}</Text>
                    {streak > 0 && (
                      <View style={styles.streakBadge}>
                        <Text style={styles.streakText}>
                          {t("streak", { days: streak })}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardSubtitle}>
                    {t("scheduledTime")}: ⏰ {habit.scheduled_time}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      isCompleted
                        ? styles.completedButton
                        : { backgroundColor: colors.primary },
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/habit-detail",
                        params: { id: habit.id, title: habit.title },
                      })
                    }
                  >
                    <Text style={styles.actionButtonText}>
                      {isCompleted ? t("done") : t("start")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteHabit(habit.id, habit.title)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
    heroCard: {
      backgroundColor: colors.blush,
      borderWidth: 3,
      borderColor: colors.text,
      padding: 16,
      marginBottom: 26,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
    },
    heroCopy: {
      flex: 1,
      paddingRight: 8,
    },
    heroEyebrow: {
      fontSize: 10,
      fontFamily,
      fontWeight: "bold",
      letterSpacing: 0.4,
      color: colors.text,
      marginBottom: 8,
    },
    heroSubtitle: {
      fontSize: 11,
      fontFamily,
      color: colors.text,
      marginTop: 6,
    },
    headerTitle: {
      fontSize: 20,
      lineHeight: 27,
      fontFamily,
      fontWeight: "bold",
      color: colors.text,
    },
    sectionHeader: {
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.text,
      paddingVertical: 9,
      paddingHorizontal: 10,
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily,
      fontWeight: "bold",
      color: colors.text,
      textTransform: "uppercase",
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: RetroTheme.borderRadius.sm,
      padding: 13,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 2,
      borderColor: colors.text,
      shadowColor: colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    cardInfo: {
      flex: 1,
      marginRight: 12,
    },
    cardTitle: {
      fontSize: 14,
      fontFamily,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 11,
      fontFamily,
      color: colors.textLight,
    },
    cardMeta: {
      fontSize: 11,
      fontFamily,
      color: colors.textLight,
      marginTop: 3,
    },
    actionButton: {
      backgroundColor: colors.success,
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: colors.text,
    },
    actionButtonText: {
      color: colors.text,
      fontFamily,
      fontWeight: "bold",
      fontSize: 10,
    },
    emptyText: {
      color: colors.textLight,
      fontFamily,
      fontStyle: "italic",
      fontSize: 11,
      backgroundColor: colors.cardBg,
      borderWidth: 2,
      borderColor: colors.text,
      padding: 14,
      marginBottom: 14,
      textAlign: "center",
    },
    streakBadge: {
      backgroundColor: colors.accent,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: colors.text,
    },
    streakText: {
      fontSize: 9,
      fontFamily,
      fontWeight: "bold",
      color: colors.text,
    },
    completedButton: {
      backgroundColor: colors.success,
    },
    cardActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    deleteButton: {
      backgroundColor: colors.danger,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 2,
      borderColor: colors.text,
    },
    deleteButtonText: {
      color: colors.text,
      fontFamily,
      fontWeight: "bold",
      fontSize: 13,
    },
  });
}
