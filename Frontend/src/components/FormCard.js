// components/FormCard.js — Light Theme
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

/**
 * FormCard — wraps any form section in a clean card
 *
 * Props:
 *   icon     {string}  — Feather icon name (e.g. "upload", "user", "image")
 *   title    {string}  — Card heading
 *   subtitle {string}  — Optional muted description below title
 *   children           — Form content inside the card
 */
export default function FormCard({ icon, title, subtitle, children }) {
  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.iconWrap}>
          <Feather name={icon} size={14} color="#7C3AED" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

/**
 * FormCard.Divider — thin separator between sections inside a card
 * Usage: <FormCard.Divider />
 */
FormCard.Divider = function Divider() {
  return <View style={dividerStyle} />;
};

const dividerStyle = {
  height: 0.5,
  backgroundColor: "#F0F0F0",
  marginVertical: 14,
  marginHorizontal: -16,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E8E8E8",
    marginBottom: 12,
    overflow: "hidden",
    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Header ──
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F5F3FF",
    borderWidth: 0.5,
    borderColor: "#DDD6FE",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 1,
  },

  // ── Body ──
  cardBody: {
    padding: 16,
  },
});