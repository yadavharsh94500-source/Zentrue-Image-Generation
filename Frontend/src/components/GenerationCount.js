import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const OPTIONS = [1, 2, 3, 4];

export default function GenerationCount({ value, onChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Number of Images</Text>
      <View style={styles.segmented}>
        {OPTIONS.map((count, index) => {
          const isSelected = value === count;
          const isFirst = index === 0;
          const isLast = index === OPTIONS.length - 1;

          return (
            <TouchableOpacity
              key={count}
              style={[
                styles.segment,
                isSelected && styles.segmentSelected,
                isFirst && styles.segmentFirst,
                isLast && styles.segmentLast,
              ]}
              onPress={() => onChange(count)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentText,
                  isSelected && styles.segmentTextSelected,
                ]}
              >
                {count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.hint}>
        {value === 8
          ? "More images — longer wait time"
          : value === 1
          ? "Fast generation"
          : `Generates ${value} variations`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 28 },
  label: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  segmentFirst: {
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  segmentLast: {
    borderRightWidth: 0,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  segmentSelected: {
    backgroundColor: COLORS.accent,
  },
  segmentText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  segmentTextSelected: {
    color: COLORS.textOnAccent,
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 7,
  },
});