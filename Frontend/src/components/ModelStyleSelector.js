import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
} from "react-native";

const OPTIONS = [
  { label: "Ecommerce", value: "ecommerce", desc: "Clean product shots for online stores" },
  { label: "Fashion", value: "fashion", desc: "Editorial, magazine-style looks" },
  { label: "Luxury", value: "luxury", desc: "Premium, high-end aesthetic" },
  { label: "Casual", value: "casual", desc: "Relaxed, lifestyle photography" },
  { label: "Traditional", value: "traditional", desc: "Classic, conventional style" },
];

export default function ModelStyleSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = OPTIONS.find((o) => o.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Model Style</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.dropdownText}>
            {selected ? selected.label : "Select style"}
          </Text>
          {selected && (
            <Text style={styles.dropdownDesc}>{selected.desc}</Text>
          )}
        </View>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Model Style</Text>
            <FlatList
              data={OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionLabel,
                        item.value === value && styles.optionLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.optionDesc}>{item.desc}</Text>
                  </View>
                  {item.value === value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: { color: "#FFFFFF", fontSize: 14 },
  dropdownDesc: { color: "#555", fontSize: 11, marginTop: 2 },
  chevron: { color: "#666", fontSize: 14 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  sheetTitle: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  option: {
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionSelected: { backgroundColor: "#1E1E1E" },
  optionContent: { flex: 1 },
  optionLabel: { color: "#CCC", fontSize: 15 },
  optionLabelSelected: { color: "#FFF", fontWeight: "600" },
  optionDesc: { color: "#555", fontSize: 12, marginTop: 2 },
  checkmark: { color: "#A855F7", fontSize: 16, fontWeight: "700" },
  separator: { height: 1, backgroundColor: "#1E1E1E" },
});