// ResultsScreen.js — Zentrue Theme
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
  Modal,        // ← ADDED
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { saveImageToGallery } from "../utils/imageHelper";
import { COLORS } from "../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const GRID_PADDING = 20;
const GRID_GAP = 10;

const MAX_CONTENT_WIDTH = 480;
const EFFECTIVE_WIDTH = Math.min(SCREEN_WIDTH, MAX_CONTENT_WIDTH);

const SINGLE_IMAGE_W = EFFECTIVE_WIDTH - GRID_PADDING * 2;
const DOUBLE_IMAGE_W = (EFFECTIVE_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

const getImageHeight = (width) => width * (4 / 3);

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [savingIndex, setSavingIndex] = useState(null);
  const [savedIndices, setSavedIndices] = useState([]);

  // ── ADDED: fullscreen modal state ──
  const [previewUrl, setPreviewUrl] = useState(null);

  let images = [];
  try {
    images = JSON.parse(params.images || "[]");
  } catch {
    images = [];
  }

  const count = images.length;
  const isSingle = count === 1;
  const tileWidth = isSingle ? SINGLE_IMAGE_W : DOUBLE_IMAGE_W;
  const tileHeight = getImageHeight(tileWidth);

  // CHANGED: pehle window.open karta tha — ab modal open karta hai
  const handleOpenImage = (url) => {
    setPreviewUrl(url);
  };

  const handleDownload = async (url, index) => {
    setSavingIndex(index);
    try {
      await saveImageToGallery(url);
      setSavedIndices((prev) => [...prev, index]);
      if (Platform.OS === "web") {
        window.alert("Image saved to your gallery.");
      } else {
        Alert.alert("Saved!", "Image saved to your gallery.");
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("Save failed: " + (error.message || "Could not save image."));
      } else {
        Alert.alert("Save failed", error.message || "Could not save image.");
      }
    } finally {
      setSavingIndex(null);
    }
  };

  const handleRegenerate = (url, index) => {
    if (Platform.OS === "web") {
      window.alert("Coming soon: Regeneration will be available soon.");
    } else {
      Alert.alert(
        "Regenerate similar",
        "This will create a new variation with the same outfit, style and pose direction.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Regenerate",
            onPress: () => Alert.alert("Coming soon", "Regeneration will be available soon."),
          },
        ]
      );
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      await handleDownload(images[i].url, i);
    }
  };

  // ─── Empty State ──────────────────────────────────────────────
  if (images.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Feather name="image" size={32} color={COLORS.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No images to display</Text>
          <Text style={styles.emptySubtitle}>
            Something went wrong. Try generating again.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.replace("/")}
          >
            <Feather name="arrow-left" size={15} color={COLORS.accent} />
            <Text style={styles.emptyBtnText}>Start over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main Screen ──────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>

      {/* ── ADDED: Fullscreen Image Modal ── */}
      <Modal
        visible={!!previewUrl}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUrl(null)}
      >
        <View style={styles.modalBackdrop}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setPreviewUrl(null)}
          >
            <Feather name="x" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Full image */}
          {previewUrl && (
            <Image
              source={{ uri: previewUrl }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}

          {/* Download from modal */}
          <TouchableOpacity
            style={styles.modalDownloadBtn}
            onPress={() => {
              const idx = images.findIndex((img) => img.url === previewUrl);
              handleDownload(previewUrl, idx);
            }}
          >
            <Feather name="download" size={16} color="#fff" />
            <Text style={styles.modalDownloadText}>Download</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.replace("/")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={14} color={COLORS.accent} />
            <Text style={styles.backLinkText}>New generation</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Results</Text>
          <Text style={styles.subtitle}>
            {count} {count === 1 ? "image" : "images"} generated
          </Text>
        </View>

        {/* ── Image Grid ── */}
        <View style={[styles.grid, isSingle && styles.gridSingle]}>
          {images.map((img, index) => (
            <View
              key={index}
              style={[styles.tile, { width: tileWidth }]}
            >
              {/* Image — tap to open fullscreen modal */}
              <Pressable
                onPress={() => handleOpenImage(img.url)}
                style={{ width: tileWidth, height: tileHeight }}
              >
                <Image
                  source={{ uri: img.url }}
                  style={styles.image}
                  resizeMode="cover"
                />

                {/* Badge */}
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{index + 1}</Text>
                </View>

                {/* Tap to expand hint */}
                <View style={styles.expandHint}>
                  <Feather name="maximize-2" size={11} color="#fff" />
                </View>

                {/* Saved checkmark overlay */}
                {savedIndices.includes(index) && (
                  <View style={styles.savedOverlay}>
                    <View style={styles.savedBadge}>
                      <Feather name="check" size={13} color="#fff" />
                      <Text style={styles.savedBadgeText}>Saved</Text>
                    </View>
                  </View>
                )}
              </Pressable>

              {/* Action Bar below image */}
              <View style={styles.tileActions}>
                <Text style={styles.tileLabel} numberOfLines={1}>
                  Model {index + 1}
                </Text>

                <View style={styles.actionRow}>
                  {/* Regenerate */}
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => handleRegenerate(img.url, index)}
                    accessibilityLabel="Regenerate similar"
                  >
                    <Feather name="refresh-cw" size={15} color={COLORS.textPrimary} />
                  </TouchableOpacity>

                  {/* Download */}
                  <TouchableOpacity
                    style={[styles.iconBtn, styles.iconBtnPrimary]}
                    onPress={() => handleDownload(img.url, index)}
                    disabled={savingIndex === index}
                    accessibilityLabel="Download image"
                  >
                    {savingIndex === index ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Feather name="download" size={15} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Save All ── */}
        {count > 1 && (
          <TouchableOpacity style={styles.saveAllBtn} onPress={handleDownloadAll}>
            <Feather name="download-cloud" size={17} color={COLORS.textPrimary} />
            <Text style={styles.saveAllText}>Save all to gallery</Text>
          </TouchableOpacity>
        )}

        {/* ── Generate Again ── */}
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={() => router.replace("/")}
        >
          <Feather name="zap" size={17} color="#fff" />
          <Text style={styles.generateText}>Generate new models</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: Platform.OS === "web" ? 0 : 12,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 20,
    maxWidth: MAX_CONTENT_WIDTH,
    width: "100%",
    alignSelf: "center",
  },

  // ── ADDED: Modal styles ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.78,
  },
  modalDownloadBtn: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
  },
  modalDownloadText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // ── Header ──
  header: { marginBottom: 20 },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  backLinkText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },

  // ── Grid ──
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    marginBottom: 16,
  },
  gridSingle: { justifyContent: "center" },

  // ── Tile ──
  tile: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.surface,
  },

  // ── Badge ──
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  // ── ADDED: Expand hint icon ──
  expandHint: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.30)",
    borderRadius: 6,
    padding: 5,
  },

  // ── Saved overlay ──
  savedOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  savedBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  // ── Tile action bar ──
  tileActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceRaised,
    gap: 8,
  },
  tileLabel: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnPrimary: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },

  // ── Bottom buttons ──
  saveAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  saveAllText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  generateText: {
    color: COLORS.textOnAccent,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // ── Empty state ──
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.accentDim,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "500",
  },
});