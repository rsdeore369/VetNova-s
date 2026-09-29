# Care Bridge — Project Analysis (saved 2026-05-18)

## What this folder is

**Care Bridge** (`care-bridge` v1.0.0) is a full-stack **animal health companion** web app aimed at farmers and pet owners in India. It is **not** an AR (augmented reality) app despite the desktop folder name `AR`.

This archive is a **snapshot of all application source** (no `node_modules`) for reuse, backup, or migration.

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Runtime | Node.js 18+ (ES modules) |
| Server | Express 4, CORS, dotenv |
| AI | Google Gemini (`@google/generative-ai`) — vision + optional chat |
| News | RSS via `rss-parser` (Google News India feeds) |
| Maps | OpenStreetMap Overpass API + Nominatim reverse geocode |
| Frontend | React 18 (CDN), Babel in-browser, no build step |
| Styling | `styles.css` + `styles-premium.css` |
| i18n | English, Hindi, Marathi (`locales.json`) |
| Persistence | In-memory Maps on server; `localStorage` on client |

---

## Project layout

```
AR/  (workspace root)
├── server.js          # Express API + Gemini vision + static hosting
├── local-chat.js      # Offline rule-based chat assistant
├── package.json
├── .env.example       # API keys template (copy to .env)
├── public/
│   ├── index.html     # Shell + React/Babel scripts
│   ├── app.js         # API helpers, geo, chat dock, hospitals, image upload
│   ├── screens.js     # All UI screens + App router
│   ├── symptoms.json  # Animals, categories, symptom definitions
│   ├── locales.json   # UI strings (en/hi/mr)
│   ├── styles.css
│   └── styles-premium.css
└── saved-archive-2026-05-18/   # This backup
```

---

## How to run (from original project root)

```bash
npm install
cp .env.example .env   # add GEMINI_API_KEY from https://aistudio.google.com/apikey
npm start              # http://localhost:3000
```

- **Chat default**: built-in assistant (no API quota). Set `USE_GEMINI_CHAT=true` for Gemini chat.
- **Vision**: requires `GEMINI_API_KEY` for medicine label / skin photo analysis.

---

## Architecture

```mermaid
flowchart TB
  subgraph client [Browser - React SPA]
    Boot --> App
    App --> Screens[screens.js flows]
    App --> Dock[GeminiChatDock]
    App --> API[fetch /api/*]
  end
  subgraph server [Node Express]
    Static[public/ static]
    News[/api/news RSS]
    Geo[/api/nearby-hospitals OSM]
    Diagnose[/api/diagnose rules]
    Vision[/api/analyze-image Gemini]
    Chat[/api/chat local or Gemini]
    Auth[users + doctors in-memory]
    Video[video-call room IDs]
  end
  client --> server
  Vision --> Gemini[Google Gemini API]
  News --> GNews[Google News RSS]
  Geo --> OSM[Overpass + Nominatim]
```

---

## User flows

### Farmer / pet owner
1. Splash → language (en/hi/mr) → role → register/login (phone + password)
2. **Dashboard**: start diagnosis, news, find doctors, history, profile
3. **Diagnosis wizard**: category → animal → symptoms (voice optional) → severity → allergy photo → medicine photo → analyze → result
4. **Result**: rule-based diagnosis + medicines (educational); call doctor / video call
5. **Floating chat**: `/api/chat` (local by default) or streaming `/api/chat/stream`

### Veterinarian
1. Doctor register/login (seeded demo doctors in `server.js`, password `doctor123`)
2. Toggle availability, accept/decline video calls, view activity

---

## API reference (server.js)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/news?filter=` | Live RSS articles (classified) |
| GET | `/api/nearby-hospitals?lat&lon` | OSM vets + fallback list |
| GET | `/api/geocode?lat&lon` | Reverse geocode label |
| POST | `/api/analyze-image` | Gemini vision (medicine / skin / generic) |
| GET | `/api/health` | Vision + chat key status |
| GET | `/api/env-check` | Non-secret env diagnostics |
| POST | `/api/chat`, `/api/chat/local`, `/api/chat/stream` | Assistant |
| POST | `/api/register`, `/api/login` | User auth |
| POST | `/api/doctor/*` | Doctor auth + availability |
| GET | `/api/doctors` | List doctors |
| POST | `/api/diagnose` | Symptom-based triage |
| GET | `/api/history/:userId` | Diagnosis history |
| POST | `/api/video-call/*` | Request / accept / decline / end calls |

**Note**: All user/doctor/call data is **in-memory** — restarts wipe accounts except seeded doctors.

---

## Key design decisions

1. **No frontend build** — fast to edit; loads React from unpkg + Babel transpile at runtime.
2. **Graceful AI degradation** — chat falls back to `localChatAssistant()`; vision returns 503 without key.
3. **Separate API keys** — `GEMINI_API_KEY` (vision) vs `GEMINI_CHAT_API_KEY` (chat quota isolation).
4. **Multilingual** — symptom names and chat tips in en/hi/mr; pattern matching for Hindi/Marathi keywords.
5. **Medical disclaimers** — vision prompts require JSON with vet disclaimers; no prescription dosages.

---

## Environment variables (.env.example)

| Variable | Role |
|----------|------|
| `GEMINI_API_KEY` | Image analysis (medicine, skin) |
| `GEMINI_CHAT_API_KEY` | Optional dedicated chat key |
| `GEMINI_VISION_MODEL` / `GEMINI_CHAT_MODEL` | Override model names |
| `USE_GEMINI_CHAT` | `true` to use Gemini for chat |
| `PORT` | Server port (default 3000) |

---

## Files worth reusing

- **`local-chat.js`** — standalone offline assistant; can port to mobile or embed without Gemini.
- **`public/symptoms.json`** — structured symptom catalog per species.
- **`server.js` `geminiAnalyzeImage` + `buildVisionPrompt`** — vision pipeline with model fallback chain.
- **`public/app.js` `ImageUploader`** — client-side capture + `/api/analyze-image` integration.
- **`public/screens.js` `App` screen map** — complete SPA navigation pattern.

---

## Limitations / production gaps

- No database, sessions, or password hashing
- Video calls use room name strings only (no WebRTC/signaling server in repo)
- Doctor passwords stored plain text in memory
- `.env` may contain secrets — never commit; archive excludes `.env`

---

## Restore from this archive

Copy contents of `saved-archive-2026-05-18/` to a new folder, run `npm install`, add `.env`, then `npm start`.
