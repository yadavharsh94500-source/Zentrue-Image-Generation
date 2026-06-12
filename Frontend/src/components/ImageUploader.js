import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { validateImage } from "../utils/imageHelper";

const MAX_IMAGES = 4;

export default function ImageUploader({ images, onChange }) {
  const handleAdd = () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Limit Reached", "Maximum 4 images allowed.");
      return;
    }

    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: MAX_IMAGES - images.length,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel || response.errorCode) return;

        const newImages = [];

        for (const asset of response.assets || []) {
          const validation = validateImage(asset.uri, asset.fileSize);
          if (!validation.valid) {
            Alert.alert("Invalid Image", validation.error);
            continue;
          }
          newImages.push({
            uri: asset.uri,
            fileSize: asset.fileSize,
            fileName: asset.fileName,
          });
        }

        if (newImages.length > 0) {
          onChange([...images, ...newImages].slice(0, MAX_IMAGES));
        }
      }
    );
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Clothing Images</Text>
      <Text style={styles.sublabel}>Upload 1–4 photos of the clothing item</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {/* Existing images */}
        {images.map((img, index) => (
          <View key={index} style={styles.tile}>
            <Image source={{ uri: img.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemove(index)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.removeX}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add button */}
        {images.length < MAX_IMAGES && (
          <TouchableOpacity style={styles.addTile} onPress={handleAdd}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={styles.counter}>
        {images.length}/{MAX_IMAGES} images added
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  sublabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 4,
  },
  tile: {
    width: 100,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  removeX: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  },
  addTile: {
    width: 100,
    height: 120,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#333",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#141414",
    gap: 6,
  },
  addIcon: {
    color: "#666",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "300",
  },
  addText: {
    color: "#666",
    fontSize: 11,
  },
  counter: {
    color: "#555",
    fontSize: 11,
    marginTop: 8,
    textAlign: "right",
  },
});