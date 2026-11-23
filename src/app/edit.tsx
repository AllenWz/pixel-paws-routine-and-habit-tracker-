import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAppPreferences } from "@/hooks/use-app-preferences";
import {
    getHabitById,
    getRenewalTaskById,
    updateHabit,
    updateRenewalTask,
} from "../database/queries";

export default function EditScreen() {
  const router = useRouter();
  const { colors, fontFamily, t } = useAppPreferences();
  const styles = createStyles(colors, fontFamily);
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: "task" | "habit";
  }>();

  const [title, setTitle] = useState(() => {
    if (type === "task") {
      return getRenewalTaskById(Number(id))?.title ?? "";
    }
    return getHabitById(Number(id))?.title ?? "";
  });
  const [extraParam, setExtraParam] = useState(() => {
    if (type === "task") {
      return getRenewalTaskById(Number(id))?.frequency_days.toString() ?? "";
    }
    return getHabitById(Number(id))?.scheduled_time ?? "";
  });

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert(t("title"), t("titleRequired"));
      return;
    }

    if (type === "task") {
      updateRenewalTask(Number(id), title, Number(extraParam) || 1);
    } else {
      updateHabit(Number(id), title, extraParam || "08:00");
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>
          {type === "task" ? t("editTask") : t("editHabit")}
        </Text>

        <Text style={styles.label}>{t("title")}</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={t("enterTitle")}
          placeholderTextColor={colors.textLight}
        />

        <Text style={styles.label}>
          {type === "task" ? t("frequencyLabel") : t("timeLabel")}
        </Text>
        <TextInput
          style={styles.input}
          value={extraParam}
          onChangeText={setExtraParam}
          keyboardType={type === "task" ? "numeric" : "default"}
          placeholderTextColor={colors.textLight}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t("saveChanges")}</Text>
        </TouchableOpacity>
      </View>
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
      padding: 20,
      justifyContent: "center",
    },
    card: {
      backgroundColor: colors.cardBg,
      padding: 24,
      borderWidth: 2,
      borderColor: colors.text,
      shadowColor: colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    header: {
      fontSize: 14,
      fontFamily,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 20,
      textAlign: "center",
    },
    label: {
      fontSize: 10,
      fontFamily,
      fontWeight: "600",
      color: colors.textLight,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.cardBg,
      borderWidth: 2,
      borderColor: colors.text,
      padding: 12,
      fontSize: 13,
      fontFamily,
      color: colors.text,
      marginBottom: 16,
    },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.text,
      alignItems: "center",
      marginTop: 10,
      shadowColor: colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    saveButtonText: {
      color: colors.cardBg,
      fontFamily,
      fontWeight: "bold",
      fontSize: 11,
    },
  });
}
