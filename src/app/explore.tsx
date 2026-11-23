import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PixelCat } from "@/components/pixel-cat";
import { useAppPreferences } from "@/hooks/use-app-preferences";

export default function CatCodexScreen() {
  const { colors, fontFamily, t } = useAppPreferences();
  const styles = createStyles(colors, fontFamily);
  const entries = [
    {
      number: "01",
      title: t("codexOneTitle"),
      detail: t("codexOneDetail"),
      color: colors.secondary,
      cat: "🐈",
    },
    {
      number: "02",
      title: t("codexTwoTitle"),
      detail: t("codexTwoDetail"),
      color: colors.accent,
      cat: "🐈‍⬛",
    },
    {
      number: "03",
      title: t("codexThreeTitle"),
      detail: t("codexThreeDetail"),
      color: colors.backgroundSelected,
      cat: "🐱",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.introCard}>
        <Text style={styles.eyebrow}>{t("codexEyebrow")}</Text>
        <View style={styles.introTitleRow}>
          <Text style={styles.title}>{t("codexTitle")}</Text>
          <PixelCat pixelSize={4} />
        </View>
        <Text style={styles.subtitle}>{t("codexSubtitle")}</Text>
      </View>

      {entries.map((entry) => (
        <View
          key={entry.number}
          style={[styles.entry, { backgroundColor: entry.color }]}
        >
          <View style={styles.entryTop}>
            <Text style={styles.number}>#{entry.number}</Text>
            <Text style={styles.cat}>{entry.cat}</Text>
          </View>
          <Text style={styles.entryTitle}>{entry.title}</Text>
          <Text style={styles.detail}>{entry.detail}</Text>
        </View>
      ))}

      <Text style={styles.footer}>{t("codexFooter")}</Text>
    </ScrollView>
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
    content: {
      padding: 18,
      paddingBottom: 32,
      gap: 16,
    },
    introCard: {
      backgroundColor: colors.cardBg,
      borderWidth: 3,
      borderColor: colors.text,
      padding: 18,
      shadowColor: colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    eyebrow: {
      color: colors.primary,
      fontFamily,
      fontSize: 10,
      fontWeight: "bold",
      marginBottom: 8,
    },
    title: {
      color: colors.text,
      fontFamily,
      fontSize: 20,
      fontWeight: "bold",
      flexShrink: 1,
    },
    introTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    subtitle: {
      color: colors.textLight,
      fontFamily,
      fontSize: 11,
      lineHeight: 18,
      marginTop: 8,
    },
    entry: {
      borderWidth: 2,
      borderColor: colors.text,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    entryTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    number: {
      color: colors.text,
      fontFamily,
      fontSize: 10,
      fontWeight: "bold",
    },
    cat: {
      fontSize: 26,
    },
    entryTitle: {
      color: colors.text,
      fontFamily,
      fontSize: 12,
      fontWeight: "bold",
      marginBottom: 6,
    },
    detail: {
      color: colors.text,
      fontFamily,
      fontSize: 10,
      lineHeight: 17,
    },
    footer: {
      color: colors.textLight,
      fontFamily,
      fontSize: 9,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 4,
    },
  });
}
