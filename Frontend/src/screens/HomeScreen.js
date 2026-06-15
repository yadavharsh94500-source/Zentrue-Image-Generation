// HomeScreen.js — Light Theme
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import Header from "../components/Header";
import FormCard from "../components/FormCard";
import ImageUploader from "../components/ImageUploader";
import AgeGroupSelector from "../components/AgeGroupSelector";
import GenderSelector from "../components/GenderSelector";
import BackgroundSelector from "../components/BackgroundSelector";
import ModelStyleSelector from "../components/ModelStyleSelector";
import PoseSelector from "../components/PoseSelector";
import GenerationCount from "../components/GenerationCount";
import { generateModels } from "../services/api";

const DEFAULT_STATE = {
  images: [],
  ageGroup: "adult",
  gender: "female",
  backgroundColor: "#FFFFFF",
  modelStyle: "ecommerce",
  pose: "standing_front",
  generations: 1,
};

export default function HomeScreen() {
  const router = useRouter();
  const [form, setForm] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(false);

  const isFormValid = form.images.length > 0 && form.ageGroup && form.gender;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setLoading(true);
    router.push({
      pathname: "/loading",
      params: { generations: form.generations },
    });
    try {
      const generatedImages = await generateModels({
        images: form.images,
        ageGroup: form.ageGroup,
        gender: form.gender,
        backgroundColor: form.backgroundColor,
        modelStyle: form.modelStyle,
        pose: form.pose,
        generations: form.generations,
      });
      router.replace({
        pathname: "/results",
        params: {
          images: JSON.stringify(generatedImages),
          generations: form.generations,
        },
      });
    } catch (error) {
      console.log("[HomeScreen] Generation error:", error.message);
      router.back();

      // Alert.alert web pe kaam nahi karta
      // Platform check lagao
      if (Platform.OS === "web") {
        window.alert(
          "Generation Failed\n\n" +
            (error.message || "Something went wrong. Please try again."),
        );
      } else {
        Alert.alert(
          "Generation Failed",
          error.message || "Something went wrong. Please try again.",
          [{ text: "OK" }],
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header (full width, outside centerWrap) ── */}
      <Header />

      <View style={styles.centerWrap}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Hero ── */}
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>AI Fashion Model Generator</Text>
            <Text style={styles.heroSubtitle}>
              Upload your clothing — get studio-quality model photos in seconds.
            </Text>
          </View>

          {/* ── Card 1: Clothing Images ── */}
          <FormCard
            icon="upload"
            title="Clothing images"
            subtitle="Upload 1–4 product photos"
          >
            <ImageUploader
              images={form.images}
              onChange={(val) => updateField("images", val)}
            />
          </FormCard>

          {/* ── Card 2: Model Profile ── */}
          <FormCard
            icon="user"
            title="Model profile"
            subtitle="Age group and gender"
          >
            <View style={styles.row}>
              <View style={styles.half}>
                <AgeGroupSelector
                  value={form.ageGroup}
                  onChange={(val) => updateField("ageGroup", val)}
                />
              </View>
              <View style={styles.half}>
                <GenderSelector
                  value={form.gender}
                  onChange={(val) => updateField("gender", val)}
                />
              </View>
            </View>
          </FormCard>

          {/* ── Card 3: Scene Settings ── */}
          <FormCard
            icon="image"
            title="Scene settings"
            subtitle="Background, style and pose"
          >
            <BackgroundSelector
              value={form.backgroundColor}
              onChange={(val) => updateField("backgroundColor", val)}
            />
            <FormCard.Divider />
            <ModelStyleSelector
              value={form.modelStyle}
              onChange={(val) => updateField("modelStyle", val)}
            />
            <FormCard.Divider />
            <PoseSelector
              value={form.pose}
              onChange={(val) => updateField("pose", val)}
            />
          </FormCard>

          {/* ── Card 4: Output ── */}
          <FormCard
            icon="layers"
            title="Output"
            subtitle="How many images to generate"
          >
            <GenerationCount
              value={form.generations}
              onChange={(val) => updateField("generations", val)}
            />
          </FormCard>

          {/* ── Validation Hint ── */}
          {!isFormValid && (
            <View style={styles.hintRow}>
              <Feather name="info" size={13} color="#7C3AED" />
              <Text style={styles.hintText}>
                {form.images.length === 0
                  ? "Upload at least one clothing image to continue"
                  : "Select age group and gender to continue"}
              </Text>
            </View>
          )}

          {/* ── Generate Button ── */}
          <TouchableOpacity
            style={[
              styles.generateBtn,
              !isFormValid && styles.generateBtnDisabled,
            ]}
            onPress={handleGenerate}
            disabled={!isFormValid || loading}
            activeOpacity={0.85}
          >
            <Feather
              name="zap"
              size={17}
              color={!isFormValid ? "#AAAAAA" : "#FFFFFF"}
            />
            <Text
              style={[
                styles.generateBtnText,
                !isFormValid && styles.generateBtnTextDisabled,
              ]}
            >
              Generate Models
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomPad} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F4F8",
  },
  // centerWrap: {
  //   flex: 1,
  //   width: "100%",
  //   maxWidth: 640,
  //   alignSelf: "center",
  // },
  centerWrap: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 640 : "100%",
    alignSelf: "center",
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },

  // ── Hero ──
  hero: {
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  heroTitle: {
    color: "#111111",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
  },

  // ── Row inside card ──
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: { flex: 1 },

  // ── Hint ──
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    marginBottom: 14,
  },
  hintText: {
    color: "#7C3AED",
    fontSize: 12,
    opacity: 0.85,
    flexShrink: 1,
  },

  // ── Generate Button ──
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 17,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  generateBtnDisabled: {
    backgroundColor: "#E2E2E2",
    shadowOpacity: 0,
    elevation: 0,
  },
  generateBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  generateBtnTextDisabled: {
    color: "#AAAAAA",
  },

  bottomPad: { height: 40 },
});
