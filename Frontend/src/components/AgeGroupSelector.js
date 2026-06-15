import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, FlatList, Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const OPTIONS = [
  { label: "Kid",    value: "kid",    icon: "happy-outline" },
  { label: "Adult",  value: "adult",  icon: "person-outline" },
  { label: "Senior", value: "senior", icon: "accessibility-outline" },
];

export default function AgeGroupSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = OPTIONS.find((o) => o.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Age Group</Text>

      <TouchableOpacity style={styles.dropdown} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <View style={styles.dropdownLeft}>
          {selected && (
            <Ionicons name={selected.icon} size={16} color={COLORS.accent} style={styles.dropdownIcon} />
          )}
          <Text style={[styles.dropdownText, !selected && styles.placeholder]}>
            {selected ? selected.label : "Select age group"}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select Age Group</Text>
            <FlatList
              data={OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => { onChange(item.value); setOpen(false); }}
                  >
                    <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={isSelected ? COLORS.accent : COLORS.textMuted}
                      />
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={COLORS.accent} />}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { color: COLORS.textPrimary, fontSize: 15, fontWeight: "600", marginBottom: 8 },
  dropdown: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  dropdownIcon: { marginRight: 10 },
  dropdownText: { color: COLORS.textPrimary, fontSize: 14 },
  placeholder: { color: COLORS.textMuted },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  sheet: {
  backgroundColor: COLORS.surfaceRaised,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingTop: 20,
  paddingBottom: 40,
  paddingHorizontal: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 10,
  width: "100%",
  maxWidth: 640,
  alignSelf: "center",
},
  sheetTitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionSelected: { backgroundColor: COLORS.accentDim },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSelected: { backgroundColor: COLORS.accentDim },
  optionText: { color: COLORS.textSecondary, fontSize: 15, flex: 1 },
  optionTextSelected: { color: COLORS.accent, fontWeight: "600" },
});