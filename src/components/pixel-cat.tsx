import { StyleSheet, View } from "react-native";

import { useAppPreferences } from "@/hooks/use-app-preferences";

const CAT_PIXELS = [
  "..KK..KK",
  ".KKKKKK.",
  "KKWKKWKK",
  "KKKKKKKK",
  ".KKKPKK.",
  ".KKKKKK.",
  "..K..K..",
];

type PixelCatProps = {
  pixelSize?: number;
};

export function PixelCat({ pixelSize = 6 }: PixelCatProps) {
  const { colors } = useAppPreferences();
  const pixelColors: Record<string, string> = {
    K: colors.text,
    W: colors.cardBg,
    P: colors.primary,
  };

  return (
    <View accessible accessibilityLabel="Pixel cat mascot">
      {CAT_PIXELS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {[...row].map((pixel, pixelIndex) => (
            <View
              key={`${rowIndex}-${pixelIndex}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: pixelColors[pixel],
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 1,
  },
});
