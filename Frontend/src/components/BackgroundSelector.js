import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const PRESETS = [
  { label: "White", value: "#FFFFFF" },
  { label: "Grey", value: "#CCCCCC" },
  { label: "Black", value: "#000000" },
  { label: "Cream", value: "#F5F0E8" },
  { label: "Blue", value: "#E8F0FE" },
];

const HEX_REGEX = /^#([0-9A-Fa-f]{6})$/;

export default function BackgroundSelector({ value, onChange }) {
  const [customHex, setCustomHex] = useState("");
  const [hexError, setHexError] = useState("");

  const isPreset = PRESETS.some((p) => p.value === value);
  const isCustomActive = !isPreset && HEX_REGEX.test(value);

  const handleCustomChange = (text) => {
    // Auto prefix #
    let hex = text.trim();
    if (hex && !hex.startsWith("#")) hex = `#${hex}`;
    setCustomHex(hex);

    if (hex === "" || hex === "#") {
      setHexError("");
      return;
    }

    if (HEX_REGEX.test(hex)) {
      setHexError("");
      onChange(hex);
    } else {
      setHexError("Enter a valid hex e.g. #FF5733");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Background Color</Text>

      {/* Preset swatches */}
      <View style={styles.presetsRow}>
        {PRESETS.map((preset) => {
          const isSelected = value === preset.value;
          const isDark = preset.value === "#000000";
          return (
            <TouchableOpacity
              key={preset.value}
              style={[
                styles.swatch,
                { backgroundColor: preset.value },
                isSelected && styles.swatchSelected,
                isDark && styles.swatchDark,
              ]}
              onPress={() => {
                onChange(preset.value);
                setCustomHex("");
                setHexError("");
              }}
              activeOpacity={0.7}
            >
              {isSelected && (
                <Text style={[styles.tick, isDark && styles.tickLight]}>✓</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Preset labels */}
      <View style={styles.labelsRow}>
        {PRESETS.map((preset) => (
          <Text key={preset.value} style={styles.swatchLabel}>
            {preset.label}
          </Text>
        ))}
      </View>

      {/* Custom hex input */}
      <View style={styles.customRow}>
        <View
          style={[
            styles.colorPreview,
            {
              backgroundColor:
                isCustomActive ? value : HEX_REGEX.test(customHex) ? customHex : "#1A1A1A",
            },
            isCustomActive && styles.colorPreviewActive,
          ]}
        />
        <TextInput
          style={[styles.hexInput, hexError ? styles.hexInputError : null]}
          placeholder="Custom  #RRGGBB"
          placeholderTextColor="#444"
          value={customHex}
          onChangeText={handleCustomChange}
          maxLength={7}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>
      {hexError ? <Text style={styles.errorText}>{hexError}</Text> : null}
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
    marginBottom: 12,
  },
  presetsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  swatchSelected: {
    borderWidth: 2.5,
    borderColor: "#A855F7",
  },
  swatchDark: {
    borderColor: "#444",
  },
  tick: {
    fontSize: 16,
    color: "#333",
    fontWeight: "700",
  },
  tickLight: {
    color: "#EEE",
  },
  labelsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  swatchLabel: {
    width: 44,
    textAlign: "center",
    color: "#555",
    fontSize: 10,
  },
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  colorPreview: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  colorPreviewActive: {
    borderColor: "#A855F7",
    borderWidth: 2,
  },
  hexInput: {
    flex: 1,
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "monospace",
  },
  hexInputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 11,
    marginTop: 5,
    marginLeft: 48,
  },
});