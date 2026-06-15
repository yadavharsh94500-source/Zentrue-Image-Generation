# AI Fashion Model Generator

Generate photorealistic AI fashion models wearing your clothing — upload product images, pick a model style, pose, age group, gender, and background, and get studio-quality catalogue images back.

A full-stack app with an Express.js backend (multi-provider AI image generation) and a React Native (Expo) mobile frontend.

---

## Project Structure

```
.
├── backend/      # Node.js + Express API (image generation)
├── mobile/       # React Native + Expo app (Expo Router)
└── README.md     # This file
```

- See [`backend/README.md`](./backend/README.md) for API setup, environment variables, and deployment.
- See [`mobile/README.md`](./mobile/README.md) for app setup, screens, and components.

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React Native, Expo (SDK 56), Expo Router, Axios |
| Backend | Node.js, Express.js, Multer |
| AI Providers | OpenAI GPT-image-1, Replicate (IDM-VTON), Fashn.ai |
| Deploy | Render / Railway (backend), Expo (mobile) |

---

## How It Works

```
Mobile App (Expo)
   │  multipart/form-data: images + form fields
   ▼
Express Backend (/generate-models)
   │  rate limit → upload → validate → build prompt
   ▼
AI Provider (OpenAI / Replicate / Fashn.ai)
   │  returns generated image URL(s)
   ▼
Mobile App → Results screen (view, save, regenerate)
```

The user uploads 1–4 clothing reference images and configures:
- **Age group:** kid / adult / senior
- **Gender:** male / female
- **Model style:** ecommerce / fashion / luxury / casual / traditional
- **Pose:** standing front / standing angle / walking / crossed arms
- **Background color:** preset or custom hex
- **Generation count:** 1 / 2 / 4 / 8

The backend builds a structured prompt from these inputs and sends it (with the reference images) to the configured AI provider, returning generated image URLs to the app.

---

## Quick Start

### 1. Clone the repo

```bash
git clone <repo-url>
cd <repo-name>
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Add your AI provider API key to .env
npm run dev
```

Backend runs at `http://localhost:5000` by default.

### 3. Mobile setup

```bash
cd mobile
npm install
npx expo install expo-media-library expo-file-system
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your machine's LAN IP, e.g. http://192.168.1.100:5000
npx expo start
```

Scan the QR code with Expo Go (or run on an emulator).

> **Important:** Use your machine's LAN IP, not `localhost`, in the mobile `.env` — `localhost` on a physical device/emulator points to the device itself.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
AI_PROVIDER=openai   # openai | replicate | fashn

OPENAI_API_KEY=your_openai_key_here
REPLICATE_API_KEY=your_replicate_key_here
FASHN_API_KEY=your_fashn_key_here

MAX_FILE_SIZE_MB=10
RATE_LIMIT_PER_MINUTE=10
```

### Mobile (`mobile/.env`)

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Returns API status and active AI provider |
| POST | `/generate-models` | Generates AI fashion model images from uploaded clothing photos |

Full request/response specs, error codes, and provider details are in [`backend/README.md`](./backend/README.md).

---

## Switching AI Providers

Change a single value in `backend/.env`:

```env
AI_PROVIDER=replicate   # or: openai, fashn
```

No code changes required — each provider implements the same `generate(prompt, imageBuffers, count)` interface.

---

## Deployment

- **Backend:** Deploy to Render or Railway. Push without `.env`, set environment variables in the dashboard, build command `npm install`, start command `npm start`.
- **Mobile:** Update `EXPO_PUBLIC_API_URL` to your deployed backend URL and build with EAS or Expo Go.

> Render free tier spins down after 15 min of inactivity — first request after idle may take ~30s (cold start).

---

## Security Notes

- AI provider API keys live only in `backend/.env` and are never exposed to the mobile app
- All AI calls are proxied through the backend
- Requests are rate-limited (default: 10/min per IP)
- Uploaded files are validated for MIME type, size (max 10MB), and count (max 4) before any AI call

---

## Common Issues

| Problem | Fix |
|---|---|
| API call fails on device | Use your machine's LAN IP in mobile `.env`, not `localhost` |
| Env var is `undefined` in app | Must be prefixed `EXPO_PUBLIC_`; restart with `npx expo start --clear` |
| Loading screen stuck | Check backend logs — Render cold start or AI provider timeout |
| 429 Too Many Requests | Rate limit hit — wait a minute, or raise `RATE_LIMIT_PER_MINUTE` |
| Images not saving to gallery | Check gallery permissions in `app.json` |

---

## License

MIT (or update as applicable)   