import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, FlatList, Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const OPTIONS = [
  { label: "Ecommerce",   value: "ecommerce",   desc: "Clean product shots for online stores", icon: "storefront-outline" },
  { label: "Fashion",     value: "fashion",      desc: "Editorial, magazine-style looks",       icon: "camera-outline" },
  { label: "Luxury",      value: "luxury",       desc: "Premium, high-end aesthetic",           icon: "diamond-outline" },
  { label: "Casual",      value: "casual",       desc: "Relaxed, lifestyle photography",        icon: "sunny-outline" },
  { label: "Traditional", value: "traditional",  desc: "Classic, conventional style",           icon: "shirt-outline" },
];

export default function ModelStyleSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = OPTIONS.find((o) => o.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Model Style</Text>

      <TouchableOpacity style={styles.dropdown} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <View style={styles.dropdownLeft}>
          {selected && (
            <Ionicons name={selected.icon} size={16} color={COLORS.accent} style={styles.dropdownIcon} />
          )}
          <View>
            <Text style={styles.dropdownText}>{selected ? selected.label : "Select style"}</Text>
            {selected && <Text style={styles.dropdownDesc}>{selected.desc}</Text>}
          </View>
        </View>
        <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>Model Style</Text>
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
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                        {item.label}
                      </Text>
                      <Text style={styles.optionDesc}>{item.desc}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark" size={18} color={COLORS.accent} />}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  dropdownIcon: { marginRight: 10 },
  dropdownText: { color: COLORS.textPrimary, fontSize: 14 },
  dropdownDesc: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
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
  optionContent: { flex: 1 },
  optionLabel: { color: COLORS.textSecondary, fontSize: 15 },
  optionLabelSelected: { color: COLORS.accent, fontWeight: "600" },
  optionDesc: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  separator: { height: 1, backgroundColor: COLORS.border },
});