# AI Fashion Model Generator — Frontend Documentation

## Tech Stack

- **Framework:** React Native + Expo (SDK 56)
- **Routing:** Expo Router (file-based)
- **HTTP Client:** Axios
- **Image Picker:** react-native-image-picker
- **Animations:** React Native Animated API
- **Language:** JavaScript (JSX)

---

## Folder Structure

```
mobile/
├── app/                        # Expo Router route files (thin wrappers only)
│   ├── _layout.tsx             # Root layout — GestureHandler, StatusBar, Stack navigator
│   ├── index.tsx               # → renders HomeScreen
│   ├── loading.tsx             # → renders LoadingScreen
│   └── results.tsx             # → renders ResultsScreen
│
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js       # Main form screen
│   │   ├── LoadingScreen.js    # Generation in-progress screen
│   │   └── ResultsScreen.js    # Generated images grid + actions
│   │
│   ├── components/
│   │   ├── ImageUploader.js    # Multi-image picker (1–4 images)
│   │   ├── AgeGroupSelector.js # Bottom sheet dropdown
│   │   ├── GenderSelector.js   # Radio button pair
│   │   ├── BackgroundSelector.js # Color presets + custom hex input
│   │   ├── ModelStyleSelector.js # Bottom sheet dropdown with descriptions
│   │   ├── PoseSelector.js     # Bottom sheet dropdown with icons
│   │   └── GenerationCount.js  # Segmented button 1/2/4/8
│   │
│   ├── services/
│   │   └── api.js              # Axios instance + generateModels()
│   │
│   └── utils/
│       └── imageHelper.js      # Validate, save to gallery, file size label
│
├── .env                        # Your actual env vars (never commit)
├── .env.example                # Template
└── package.json
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install additional Expo packages
npx expo install expo-media-library expo-file-system

# 3. Create .env
cp .env.example .env

# 4. Set your backend URL in .env
EXPO_PUBLIC_API_URL=http://192.168.x.x:5000

# 5. Run
npx expo start
```

---

## Environment Variables

Expo requires the `EXPO_PUBLIC_` prefix for any variable you want accessible inside the app.

```env
# .env (mobile root)

# Local dev — use your machine's LAN IP (not localhost)
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000

# Production
# EXPO_PUBLIC_API_URL=https://your-app.onrender.com
```

> **Why not `localhost`?**
> On a physical device or Android emulator, `localhost` points to the device itself, not your machine. Always use your machine's actual local IP (e.g. `192.168.1.x`). Find it with `ipconfig` (Windows) or `ifconfig` (Mac/Linux).

> **After changing `.env`** — restart Expo with cache clear:
> ```bash
> npx expo start --clear
> ```

---

## Screen Flow

```
app/index.tsx
    │
    ▼
HomeScreen.js          ← User fills form, taps Generate
    │
    ▼ router.push("/loading")
LoadingScreen.js       ← Spinner + rotating messages (non-dismissable)
    │
    ▼ router.replace("/results")  on success
ResultsScreen.js       ← Image grid + download + generate again
    │
    ▼ router.replace("/")  on "Generate New Models"
HomeScreen.js
```

On error → `router.back()` (returns to HomeScreen) + Alert shown.

---

## Components

### ImageUploader
- Horizontal scroll row of image tiles
- Max 4 images, min 1 required
- Tap `+` → opens device image library (multi-select)
- Tap `✕` → removes that image
- Validates mime type and file size before adding

**Props:**
```js
<ImageUploader
  images={[{ uri, fileSize, fileName }]}
  onChange={(updatedImages) => {}}
/>
```

---

### AgeGroupSelector
- Bottom sheet modal with 3 options: Kid / Adult / Senior
- Purple `✓` checkmark on selected option

**Props:**
```js
<AgeGroupSelector value="adult" onChange={(val) => {}} />
```

---

### GenderSelector
- Two side-by-side radio cards: Female / Male
- Purple border + background tint on selection

**Props:**
```js
<GenderSelector value="female" onChange={(val) => {}} />
```

---

### BackgroundSelector
- 5 preset color circles: White / Grey / Black / Cream / Blue
- Custom hex input with live color preview swatch
- Auto-prefixes `#` if user forgets
- Validates hex format, shows inline error

**Props:**
```js
<BackgroundSelector value="#FFFFFF" onChange={(val) => {}} />
```

---

### ModelStyleSelector
- Bottom sheet dropdown
- Each option has a label + short description
- Options: Ecommerce / Fashion / Luxury / Casual / Traditional

**Props:**
```js
<ModelStyleSelector value="ecommerce" onChange={(val) => {}} />
```

---

### PoseSelector
- Bottom sheet dropdown with emoji icons
- Options: Standing Front / Standing Angle / Walking / Crossed Arms

**Props:**
```js
<PoseSelector value="standing_front" onChange={(val) => {}} />
```

---

### GenerationCount
- Segmented control: 1 | 2 | 4 | 8
- Purple fill on selected segment
- Hint text updates based on selection

**Props:**
```js
<GenerationCount value={1} onChange={(val) => {}} />
```

---

## API Service

**File:** `src/services/api.js`

```js
import { generateModels, checkHealth } from "../services/api";

// Generate images
const images = await generateModels({
  imageUris: ["file:///..."],   // local URIs from image picker
  ageGroup: "adult",
  gender: "female",
  backgroundColor: "#FFFFFF",
  modelStyle: "ecommerce",
  pose: "standing_front",
  generations: 2,
});
// Returns: [{ url: "https://..." }, { url: "https://..." }]

// Health check
const status = await checkHealth();
```

- Axios timeout: **120 seconds** (AI generation can be slow)
- Images sent as `multipart/form-data`
- On error: throws with `error.message` from backend

---

## Image Helper Utils

**File:** `src/utils/imageHelper.js`

```js
import { validateImage, saveImageToGallery, getFileSizeLabel } from "../utils/imageHelper";

// Validate before upload
const { valid, error } = validateImage(uri, fileSizeInBytes);

// Save generated image to device gallery
// Works with remote URLs and base64 data URIs
await saveImageToGallery("https://...");

// Human-readable size
getFileSizeLabel(1048576); // → "1.0 MB"
```

---

## Navigation (Expo Router)

Data is passed between screens via route params:

**HomeScreen → LoadingScreen:**
```js
router.push({
  pathname: "/loading",
  params: { generations: 2 }
});
```

**LoadingScreen → ResultsScreen** (called from HomeScreen after API resolves):
```js
router.replace({
  pathname: "/results",
  params: {
    images: JSON.stringify([{ url: "..." }]),
    generations: 2,
  }
});
```

**Reading params in a screen:**
```js
import { useLocalSearchParams } from "expo-router";
const { images, generations } = useLocalSearchParams();
const parsedImages = JSON.parse(images);
```

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Background | `#0A0A0A` | App background |
| Surface | `#141414` | Cards, inputs |
| Surface Raised | `#1A1A1A` | Bottom sheets |
| Border | `#2A2A2A` | Input borders |
| Accent | `#A855F7` | Purple — selected state, buttons |
| Accent Dim | `#1A0D2E` | Selected card background tint |
| Text Primary | `#FFFFFF` | Labels, values |
| Text Secondary | `#888888` | Descriptions |
| Text Muted | `#555555` | Hints, counters |
| Error | `#EF4444` | Validation errors |

---

## Required Permissions

Add to `app.json` under `expo.android.permissions` and `expo.ios.infoPlist`:

**Android (`app.json`):**
```json
{
  "expo": {
    "android": {
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES"
      ]
    }
  }
}
```

**iOS (`app.json`):**
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Required to save generated model images to your gallery.",
        "NSPhotoLibraryAddUsageDescription": "Required to save generated model images to your gallery."
      }
    }
  }
}
```

---

## Additional Packages to Install

These are not in `package.json` by default — install with `npx expo install`:

```bash
npx expo install expo-media-library expo-file-system
```

| Package | Used in | Purpose |
|---|---|---|
| `expo-media-library` | `imageHelper.js` | Save images to device gallery |
| `expo-file-system` | `imageHelper.js` | Download remote URL to local cache |

---

## Common Issues

| Problem | Fix |
|---|---|
| API call fails on device | Use machine's LAN IP in `.env`, not `localhost` |
| Images not saving | Check gallery permissions in `app.json` |
| Env var is `undefined` | Must use `EXPO_PUBLIC_` prefix; restart with `--clear` |
| Picker not opening | `react-native-image-picker` needs no extra permissions on Expo Go |
| Loading screen stuck | Backend timeout — check Render cold start, increase axios timeout |
| Bottom sheet not closing | Tap outside overlay (Pressable backdrop) or select an option |