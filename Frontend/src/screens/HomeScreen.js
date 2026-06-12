import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

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

  // Required: images + ageGroup + gender
  const isFormValid =
    form.images.length > 0 && form.ageGroup && form.gender;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setLoading(true);

    // Navigate to loading screen immediately for UX
    router.push({
      pathname: "/loading",
      params: {
        generations: form.generations,
      },
    });

    try {
      const images = await generateModels({
        imageUris: form.images.map((img) => img.uri),
        ageGroup: form.ageGroup,
        gender: form.gender,
        backgroundColor: form.backgroundColor,
        modelStyle: form.modelStyle,
        pose: form.pose,
        generations: form.generations,
      });

      // Navigate to results with generated images
      router.replace({
        pathname: "/results",
        params: {
          images: JSON.stringify(images),
          generations: form.generations,
        },
      });
    } catch (error) {
      console.error("[HomeScreen] Generation error:", error.message);

      // Go back from loading screen
      router.back();

      Alert.alert(
        "Generation Failed",
        error.message || "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Fashion Model</Text>
          <Text style={styles.subtitle}>
            Upload clothing → Generate studio-quality model photos
          </Text>
        </View>

        {/* Fields */}
        <ImageUploader
          images={form.images}
          onChange={(val) => updateField("images", val)}
        />

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

        <BackgroundSelector
          value={form.backgroundColor}
          onChange={(val) => updateField("backgroundColor", val)}
        />

        <ModelStyleSelector
          value={form.modelStyle}
          onChange={(val) => updateField("modelStyle", val)}
        />

        <PoseSelector
          value={form.pose}
          onChange={(val) => updateField("pose", val)}
        />

        <GenerationCount
          value={form.generations}
          onChange={(val) => updateField("generations", val)}
        />

        {/* Required fields hint */}
        {!isFormValid && (
          <Text style={styles.requiredHint}>
            {form.images.length === 0
              ? "⬆ Upload at least one clothing image to continue"
              : "Select age group and gender to continue"}
          </Text>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateBtn, !isFormValid && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={!isFormValid || loading}
          activeOpacity={0.85}
        >
          <Text style={styles.generateBtnText}>
            ✦ Generate Models
          </Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    color: "#666",
    fontSize: 13,
    lineHeight: 18,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  requiredHint: {
    color: "#A855F7",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 14,
    opacity: 0.8,
  },
  generateBtn: {
    backgroundColor: "#A855F7",
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  generateBtnDisabled: {
    backgroundColor: "#2A2A2A",
    shadowOpacity: 0,
    elevation: 0,
  },
  generateBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  bottomPad: {
    height: 40,
  },
});