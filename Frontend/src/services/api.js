import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is not set. Add it to your .env file and restart with: npx expo start --clear"
  );
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
});

// ─── Response Interceptor ─────────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Dev logs (server mein dikhega, user ko nahi)
    console.log("[API] Error status:", err.response?.status);
    console.log("[API] Error data:", JSON.stringify(err.response?.data));
    console.log("[API] Error code:", err.code);
    console.log("[API] Error message:", err.message);

    let msg;

    if (err.response) {
      // ── Server ne response diya (4xx / 5xx) ────────────────
      // Backend ne message set kiya hai — wahi use karo
      // (validate.js, upload.js, openai.js sab ne already
      //  user-friendly message set kar diya hai)
      const serverMessage = err.response.data?.message;
      const status = err.response.status;

      if (serverMessage) {
        // Backend ka message sabse reliable hai — directly use karo
        msg = serverMessage;
      } else if (status === 429) {
        msg = "You are generating too fast. Please wait 1 minute and try again.";
      } else if (status === 503) {
        msg = "Image generation is temporarily unavailable. Please try again later.";
      } else if (status === 502) {
        msg = "AI service is temporarily down. Please try again in a few minutes.";
      } else if (status >= 500) {
        msg = "Something went wrong on our end. Please try again.";
      } else {
        msg = `Server error (${status}). Please try again.`;
      }

    } else if (err.code === "ECONNABORTED") {
      // ── Axios timeout (120 seconds) ─────────────────────────
      // CHANGED: helpful message — Render cold start mention
      msg =
        "Generation is taking too long. If this is your first request, the server may be starting up. Please wait 30 seconds and try again.";

    } else if (err.message === "Network Error") {
      // ── Server tak pahuncha hi nahi ─────────────────────────
      // CHANGED: show actual URL so dev can debug
      msg = `Cannot reach the server. Make sure the backend is running and check your EXPO_PUBLIC_API_URL in .env (currently: ${BASE_URL}).`;

    } else {
      msg = err.message || "Something went wrong. Please try again.";
    }

    throw new Error(msg);
  }
);

// ─── Generate Models ──────────────────────────────────────────
export const generateModels = async ({
  images,
  ageGroup,
  gender,
  backgroundColor,
  modelStyle,
  pose,
  generations,
}) => {
  // Client-side guard — catch karo API call se pehle
  if (!images || images.length === 0) {
    throw new Error("Please add at least 1 clothing photo to continue.");
  }
  if (images.length > 4) {
    throw new Error("You can only upload up to 4 photos at once.");
  }

  const formData = new FormData();

  // ─── Images append karo ────────────────────────────────────
  for (let index = 0; index < images.length; index++) {
    const image = images[index];

    if (image._webFile) {
      // Web: actual File object — blob URI kaam nahi karta
      formData.append("images", image._webFile, image.fileName);
    } else {
      // Native (Android / iOS)
      const { uri, fileName, type } = image;
      const resolvedName = fileName || `image_${index}.jpg`;
      let resolvedMime = type;
      if (!resolvedMime) {
        const ext = resolvedName.split(".").pop()?.toLowerCase();
        resolvedMime =
          ext === "png" ? "image/png"
          : ext === "webp" ? "image/webp"
          : "image/jpeg";
      }
      formData.append("images", { uri, name: resolvedName, type: resolvedMime });
    }
  }

  // ─── Fields append karo ────────────────────────────────────
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
    throw new Error(response.data.message || "Generation failed. Please try again.");
  }

  return response.data.images;
};

// ─── Health Check ─────────────────────────────────────────────
export const checkHealth = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};