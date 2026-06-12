import axios from "axios";

// ─── Backend URL from .env ────────────────────────────────────
// Expo requires EXPO_PUBLIC_ prefix to expose vars to the app
// Set in your .env file:
//   EXPO_PUBLIC_API_URL=http://192.168.x.x:5000   (local dev)
//   EXPO_PUBLIC_API_URL=https://your-app.onrender.com  (production)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 min — AI generation can be slow
});

/**
 * Generate fashion model images
 * @param {object} params
 * @param {string[]} params.imageUris     - Local file URIs from image picker
 * @param {string}   params.ageGroup      - kid | adult | senior
 * @param {string}   params.gender        - male | female
 * @param {string}   params.backgroundColor - hex e.g. #FFFFFF
 * @param {string}   params.modelStyle    - ecommerce | fashion | luxury | casual | traditional
 * @param {string}   params.pose          - standing_front | standing_angle | walking | crossed_arms
 * @param {number}   params.generations   - 1 | 2 | 4 | 8
 * @returns {Promise<Array<{url: string}>>}
 */
export const generateModels = async ({
  imageUris,
  ageGroup,
  gender,
  backgroundColor,
  modelStyle,
  pose,
  generations,
}) => {
  const formData = new FormData();

  // ─── Append images ────────────────────────────────────────
  imageUris.forEach((uri, index) => {
    const filename = uri.split("/").pop() || `image_${index}.jpg`;
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeType =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

    formData.append("images", {
      uri,
      name: filename,
      type: mimeType,
    });
  });

  // ─── Append fields ────────────────────────────────────────
  formData.append("ageGroup", ageGroup);
  formData.append("gender", gender);
  formData.append("backgroundColor", backgroundColor || "#FFFFFF");
  formData.append("modelStyle", modelStyle || "ecommerce");
  formData.append("pose", pose || "standing_front");
  formData.append("generations", String(generations || 1));

  const response = await apiClient.post("/generate-models", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "Generation failed");
  }

  return response.data.images;
};

/**
 * Health check — verify backend is reachable
 */
export const checkHealth = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};