import { Platform } from "react-native";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export const validateImage = (uri, fileSizeBytes) => {
  const ext = uri.split(".").pop()?.toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: "Please upload JPG, PNG or WEBP only." };
  }

  if (fileSizeBytes && fileSizeBytes > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: "File size must be under 10MB." };
  }

  return { valid: true };
};

export const saveImageToGallery = async (url) => {
  // Web pe gallery save supported nahi hai
  if (Platform.OS === "web") {
    const link = document.createElement("a");
    link.href = url;
    link.download = `fashion_model_${Date.now()}.jpg`;
    link.click();
    return true;
  }

  const MediaLibrary = await import("expo-media-library");
  const FileSystem = await import("expo-file-system");

  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Gallery permission denied. Please allow in Settings.");
  }

  let localUri = url;

  if (url.startsWith("http")) {
    const filename = `fashion_model_${Date.now()}.jpg`;
    const downloadPath = `${FileSystem.cacheDirectory}${filename}`;
    const result = await FileSystem.downloadAsync(url, downloadPath);
    localUri = result.uri;
  }

  if (url.startsWith("data:image")) {
    const base64Data = url.split(",")[1];
    const filename = `fashion_model_${Date.now()}.jpg`;
    const filePath = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(filePath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    localUri = filePath;
  }

  await MediaLibrary.saveToLibraryAsync(localUri);
  return true;
};

export const getFileSizeLabel = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};