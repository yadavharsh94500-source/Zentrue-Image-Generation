// components/Header.js
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      {/* Left — Logo */}
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* Right — Badge */}
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>AI Powered</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#7337D2",
  },

  logoImage: {
    width: 150,
    height: 50,
  },

  // ── Badge ──
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
});