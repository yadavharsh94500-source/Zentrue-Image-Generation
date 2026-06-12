import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OPTIONS = [
  { label: "Female", value: "female", icon: "♀" },
  { label: "Male", value: "male", icon: "♂" },
];

export default function GenderSelector({ value, onChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.icon, isSelected && styles.iconSelected]}>
                {opt.icon}
              </Text>
              <Text style={[styles.text, isSelected && styles.textSelected]}>
                {opt.label}
              </Text>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  option: {
    flex: 1,
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionSelected: {
    borderColor: "#A855F7",
    backgroundColor: "#1A0D2E",
  },
  icon: {
    fontSize: 18,
    color: "#555",
  },
  iconSelected: {
    color: "#A855F7",
  },
  text: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  textSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#A855F7",
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#A855F7",
  },
});