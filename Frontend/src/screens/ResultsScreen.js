import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { saveImageToGallery } from "../utils/imageHelper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 20;
const GRID_GAP = 10;
const SINGLE_IMAGE_W = SCREEN_WIDTH - GRID_PADDING * 2;
const DOUBLE_IMAGE_W = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [savingIndex, setSavingIndex] = useState(null);

  // Parse images from route params
  let images = [];
  try {
    images = JSON.parse(params.images || "[]");
  } catch {
    images = [];
  }

  const count = images.length;

  // Determine image tile width based on count
  const getTileWidth = () => {
    if (count === 1) return SINGLE_IMAGE_W;
    return DOUBLE_IMAGE_W;
  };

  const getTileHeight = () => {
    const w = getTileWidth();
    return w * 1.25; // 4:5 portrait ratio
  };

  const handleDownload = async (url, index) => {
    setSavingIndex(index);
    try {
      await saveImageToGallery(url);
      Alert.alert("Saved!", "Image saved to your gallery.");
    } catch (error) {
      Alert.alert("Save Failed", error.message || "Could not save image.");
    } finally {
      setSavingIndex(null);
    }
  };

  const handleRegenerate = (url, index) => {
    Alert.alert(
      "Regenerate Similar",
      "This will create a new variation with the same outfit, style and pose direction.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: () => {
            // TODO: pass original form state through params for full regeneration
            Alert.alert("Coming Soon", "Regeneration will be available soon.");
          },
        },
      ]
    );
  };

  if (images.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>⚠</Text>
          <Text style={styles.emptyText}>No images to display.</Text>
          <TouchableOpacity onPress={() => router.replace("/")} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Start Over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backLink}>← New Generation</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Results</Text>
          <Text style={styles.subtitle}>
            {count} {count === 1 ? "image" : "images"} generated
          </Text>
        </View>

        {/* Image Grid */}
        <View style={styles.grid}>
          {images.map((img, index) => (
            <View
              key={index}
              style={[
                styles.tile,
                {
                  width: getTileWidth(),
                  height: getTileHeight(),
                },
              ]}
            >
              <Image
                source={{ uri: img.url }}
                style={styles.image}
                resizeMode="cover"
              />

              {/* Action buttons overlay */}
              <View style={styles.actions}>
                {/* Download */}
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDownload(img.url, index)}
                  disabled={savingIndex === index}
                >
                  {savingIndex === index ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.actionIcon}>⬇</Text>
                  )}
                </TouchableOpacity>

                {/* Regenerate similar */}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnSecondary]}
                  onPress={() => handleRegenerate(img.url, index)}
                >
                  <Text style={styles.actionIcon}>↺</Text>
                </TouchableOpacity>
              </View>

              {/* Image number badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{index + 1}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Download All */}
        {count > 1 && (
          <TouchableOpacity
            style={styles.downloadAllBtn}
            onPress={async () => {
              for (let i = 0; i < images.length; i++) {
                await handleDownload(images[i].url, i);
              }
            }}
          >
            <Text style={styles.downloadAllText}>⬇  Save All to Gallery</Text>
          </TouchableOpacity>
        )}

        {/* Generate Again */}
        <TouchableOpacity
          style={styles.generateAgainBtn}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.generateAgainText}>✦ Generate New Models</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  backLink: {
    color: "#A855F7",
    fontSize: 13,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#666",
    fontSize: 13,
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    marginBottom: 20,
  },
  tile: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#141414",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  actions: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "column",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(168, 85, 247, 0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnSecondary: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  actionIcon: {
    color: "#FFF",
    fontSize: 15,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  downloadAllBtn: {
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  downloadAllText: {
    color: "#CCCCCC",
    fontSize: 15,
    fontWeight: "600",
  },
  generateAgainBtn: {
    backgroundColor: "#A855F7",
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  generateAgainText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  emptyIcon: { fontSize: 36 },
  emptyText: { color: "#666", fontSize: 15 },
  backBtn: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
  },
  backBtnText: { color: "#A855F7", fontSize: 14 },
  bottomPad: { height: 40 },
});