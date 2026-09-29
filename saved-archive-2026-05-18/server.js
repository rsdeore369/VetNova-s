import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import Parser from "rss-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadSymptomsForChat, localChatAssistant } from "./local-chat.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadSymptomsForChat();
// Load .env from the project folder (same folder as server.js), not from wherever Node was started.
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath, override: true });
if (!fs.existsSync(envPath)) {
  console.warn(`[Care Bridge] No .env at ${envPath} — add GEMINI_API_KEY there for vision.`);
} else {
  console.log(`[Care Bridge] Loaded .env from ${envPath}`);
}
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "12mb" }));

const images = new Map();
let nextImgId = 1;
let nextUserId = 1;
let nextDoctorId = 1;
let nextCallId = 1;

const users = new Map();
const doctors = new Map();
const calls = new Map();
const historyByUser = new Map();

function seedDoctors() {
  const seed = [
    { name: "Dr. Ananya Patil", phone: "+919876543210", specialization: "Livestock", experience: 12, rating: 4.8, available: true, accepts_video: true, available_from: "09:00", available_until: "18:00", password: "doctor123" },
    { name: "Dr. Rohit Kulkarni", phone: "+919811223344", specialization: "Mixed Practice", experience: 8, rating: 4.6, available: true, accepts_video: true, available_from: "10:00", available_until: "20:00", password: "doctor123" },
    { name: "Dr. Sneha Deshmukh", phone: "+919922334455", specialization: "Poultry", experience: 6, rating: 4.7, available: false, accepts_video: true, available_from: "08:00", available_until: "15:00", password: "doctor123" },
  ];
  seed.forEach((d) => {
    const id = nextDoctorId++;
    doctors.set(id, { id, ...d });
  });
}
seedDoctors();

const rss = new Parser({ timeout: 12000 });

const NEWS_FEEDS = [
  { url: "https://news.google.com/rss/search?q=animal+health+India+veterinary&hl=en-IN&gl=IN&ceid=IN:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=livestock+disease+India&hl=en-IN&gl=IN&ceid=IN:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=poultry+vaccination+India&hl=en-IN&gl=IN&ceid=IN:en", source: "Google News" },
];

function classifyArticle(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/outbreak|alert|bird flu|h5n1|emergency|fmd|lumpy|quarantine/.test(t)) return { catKey: "alert", category: "Alert" };
  if (/vaccin|immuniz|ranikhet|newcastle|rabies/.test(t)) return { catKey: "vaccination", category: "Vaccination" };
  if (/scheme|subsidy|kcc|government|ministry|camp/.test(t)) return { catKey: "scheme", category: "Scheme" };
  if (/dog|cat|pet|stray|monsoon pet/.test(t)) return { catKey: "pets", category: "Pet Care" };
  if (/research|study|trial|ai /.test(t)) return { catKey: "research", category: "Research" };
  if (/disease|infection|mastitis|tick|parasite/.test(t)) return { catKey: "disease", category: "Disease" };
  return { catKey: "health", category: "Health" };
}

function relTime(iso) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m || 1} min ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} hours ago`;
  const days = Math.floor(h / 24);
  return `${days} days ago`;
}

app.get("/api/news", async (req, res) => {
  const filter = (req.query.filter || "all").toLowerCase();
  try {
    const seen = new Set();
    const items = [];
    for (const feed of NEWS_FEEDS) {
      try {
        const parsed = await rss.parseURL(feed.url);
        for (const it of parsed.items || []) {
          const link = it.link || it.guid || "";
          if (!link || seen.has(link)) continue;
          seen.add(link);
          const { catKey, category } = classifyArticle(it.title, it.contentSnippet || it.content || "");
          const urgent = /alert|outbreak|bird flu|h5n1|emergency|fmd|lumpy/i.test(`${it.title} ${it.contentSnippet || ""}`);
          items.push({
            id: `live-${seen.size}-${Buffer.from(link).toString("base64url").slice(0, 10)}`,
            category,
            catKey,
            title: it.title || "Untitled",
            summary: (it.contentSnippet || it.summary || "").replace(/<[^>]+>/g, "").slice(0, 320),
            date: relTime(it.isoDate || it.pubDate || new Date().toISOString()),
            source: it.creator || feed.source,
            urgent,
            link,
            isoDate: it.isoDate || null,
          });
        }
      } catch {
        /* skip broken feed */
      }
    }
    items.sort((a, b) => new Date(b.isoDate || 0) - new Date(a.isoDate || 0));
    const shown = filter === "all" ? items : items.filter((a) => a.catKey === filter);
    res.json({ articles: shown.slice(0, 40), fetchedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message || "News fetch failed", articles: [] });
  }
});

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

app.get("/api/nearby-hospitals", async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ error: "lat and lon required" });
  }
  const fallback = [
    { name: "Nashik Veterinary Hospital", lat: 19.9975, lon: 73.7898, address: "College Road", city: "Nashik", phone: "+912532579900", type: "Emergency", open24: true, openHour: 0, closeHour: 24 },
    { name: "Malegaon Animal Hospital", lat: 20.5579, lon: 74.5287, address: "Main Road", city: "Malegaon", phone: "+919999911111", type: "General", open24: false, openHour: 9, closeHour: 20 },
    { name: "Pune Vet Care Hospital", lat: 18.5204, lon: 73.8567, address: "Koregaon Park", city: "Pune", phone: "+912026127788", type: "Specialty", open24: true, openHour: 0, closeHour: 24 },
    { name: "Mumbai Veterinary Hospital", lat: 19.076, lon: 72.8777, address: "Parel", city: "Mumbai", phone: "+912224137518", type: "Emergency", open24: true, openHour: 0, closeHour: 24 },
  ];

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="veterinary"](around:40000,${lat},${lon});
      way["amenity"="veterinary"](around:40000,${lat},${lon});
      relation["amenity"="veterinary"](around:40000,${lat},${lon});
    );
    out center tags 40;
  `.trim();

  let list = [];
  try {
    const r = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
    });
    const data = await r.json();
    const els = data.elements || [];
    for (const el of els) {
      let plat = el.lat;
      let plon = el.lon;
      if (el.center) {
        plat = el.center.lat;
        plon = el.center.lon;
      }
      if (!Number.isFinite(plat) || !Number.isFinite(plon)) continue;
      const tags = el.tags || {};
      const name = tags.name || tags["name:en"] || "Veterinary clinic";
      const phone = (tags.phone || tags["contact:phone"] || "").replace(/\s/g, "") || "";
      const addr = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]].filter(Boolean).join(", ") || "Address not listed";
      const city = tags["addr:city"] || tags["addr:district"] || "";
      const open24 = /24|24\/7/i.test(tags.opening_hours || "");
      const type = /emergency|24/i.test(tags.healthcare || tags.amenity || "") ? "Emergency" : tags.healthcare === "speciality" ? "Specialty" : "General";
      list.push({
        name,
        lat: plat,
        lon: plon,
        address: addr,
        city,
        phone,
        type,
        open24,
        openHour: 9,
        closeHour: 19,
        source: "osm",
      });
    }
  } catch {
    list = [];
  }

  if (list.length === 0) list = fallback;

  list.forEach((h) => {
    h.distance = haversineKm(lat, lon, h.lat, h.lon);
  });
  list.sort((a, b) => a.distance - b.distance);
  res.json({ lat, lon, hospitals: list.slice(0, 25) });
});

app.get("/api/geocode", async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return res.status(400).json({ error: "bad coords" });
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const r = await fetch(url, { headers: { "User-Agent": "CareBridge/1.0 (contact: local)" } });
    const j = await r.json();
    const label = j.display_name || "";
    res.json({ label: label.split(",").slice(0, 3).join(",").trim() || "Your area" });
  } catch {
    res.json({ label: "Your location" });
  }
});

function visionApiKey() {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
}

/** Dedicated key for text chat (falls back to vision key if unset). */
function chatApiKey() {
  return (process.env.GEMINI_CHAT_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
}

/** Chat uses GEMINI_CHAT_API_KEY only (separate from vision/analysis key). */
function chatApiKeys() {
  return [(process.env.GEMINI_CHAT_API_KEY || "").trim()].filter(Boolean);
}

function buildChatSystemInstruction(lang) {
  const l = String(lang || "en").slice(0, 2).toLowerCase();
  const langLine =
    l === "hi"
      ? "Prefer Hindi (Devanagari) when the user writes in Hindi; otherwise mirror the user's language."
      : l === "mr"
        ? "Prefer Marathi when the user writes in Marathi; otherwise mirror the user's language."
        : "Reply in clear English unless the user is clearly writing in Hindi or Marathi.";
  return `You are "Care Bridge Coach", the in-app AI helper for an animal-health app used by farmers and pet owners in India.

Your role: practical first-aid style guidance, husbandry tips, and triage suggestions for livestock, poultry, and pets.

Rules you MUST follow:
- You have NOT examined any animal. Never claim a definitive diagnosis or give prescription drugs, withdrawal periods, or legal dosages.
- Urgent symptoms (collapse, bloat, unable to stand, severe bleeding, difficulty breathing, suspected poisoning): tell the user to contact a veterinarian immediately and what to watch while waiting.
- Encourage professional veterinary care for anything beyond simple home monitoring.
- Be warm, concise, and step-by-step. Avoid unexplained jargon.
- ${langLine}`;
}

/** Accept data:image/...;base64,... or raw base64 from FileReader */
function parseImagePayload(data) {
  if (typeof data !== "string") throw new Error("data must be a string");
  const s = data.trim();
  const m = /^data:([^;]+);base64,([\s\S]+)$/i.exec(s);
  if (m) {
    const mime = (m[1] || "image/jpeg").split(";")[0].trim().toLowerCase();
    const b64 = m[2].replace(/\s/g, "");
    if (!b64) throw new Error("Empty base64 in data URL");
    return { mimeType: mime || "image/jpeg", base64: b64 };
  }
  const b64 = s.replace(/\s/g, "");
  if (b64.length < 32) throw new Error("Image payload too small");
  return { mimeType: "image/jpeg", base64: b64 };
}

function normalizeImageMime(mimeType) {
  let mt = (mimeType || "image/jpeg").toLowerCase();
  if (mt === "image/jpg") mt = "image/jpeg";
  const ok = /^image\/(jpeg|png|webp|gif|heic|heif)$/i.test(mt);
  return ok ? mt : "image/jpeg";
}

function buildVisionPrompt(kind) {
  const base = `You are assisting a licensed-veterinarian workflow for the Care Bridge animal-health app.
Read the attached image carefully: transcribe visible printed or handwritten text (OCR), and describe clinically relevant visual findings.
Output MUST be a single valid JSON object only — no markdown code fences, no text before or after the JSON.`;

  if (kind === "medicine") {
    return `${base}

Task: Read veterinary or human medicine packaging, blister strips, bottles, vials, sachets, prescription slips, or pharmacy labels in the image.

Return exactly this JSON shape (use null where unknown):
{
  "visible_text": string,
  "product_name_best_guess": string | null,
  "active_ingredient_guess": string | null,
  "strength_dosage_guess": string | null,
  "batch_or_lot": string | null,
  "expiry_date_guess": string | null,
  "manufacturer_brand": string | null,
  "form": "tablet"|"capsule"|"liquid"|"injection"|"powder"|"topical"|"unknown",
  "species_intended_guess": string | null,
  "human_medication_warning": boolean,
  "language_detected": string | null,
  "read_confidence": "high"|"medium"|"low",
  "notes_for_vet": string,
  "disclaimer": string
}

Rules:
- Copy readable text into visible_text (can be multi-sentence).
- If glare/blur prevents reading, set read_confidence to "low" and explain in notes_for_vet.
- human_medication_warning true if packaging suggests human pharmacy and species is unclear.
- disclaimer must state that only a veterinarian can confirm product, dose, withdrawal, and legality for food animals.`;
  }

  if (kind === "skin_rash" || kind === "allergy") {
    return `${base}

Task: Triage photograph of skin, ears, muzzle, paws, udder/teat, wound, or mucosa on an animal. This is NOT a definitive diagnosis.

Return exactly this JSON shape:
{
  "image_description": string,
  "affected_areas_visible": string[],
  "primary_lesions": string[],
  "secondary_changes": string[],
  "distribution_pattern_guess": string | null,
  "possible_differentials_for_vet": string[],
  "suggested_urgency": "routine"|"soon"|"urgent"|"emergency",
  "owner_safe_interim_care": string[],
  "important_not_to_do": string[],
  "confidence": "high"|"medium"|"low",
  "disclaimer": string
}

Rules:
- List differentials as possibilities for the vet to confirm (e.g. infection, allergy, parasites, immune-mediated, trauma) — never assert one diagnosis.
- If photo is too dark or out of focus, set confidence "low" and say why.
- disclaimer must require an in-person veterinary examination for diagnosis and treatment.`;
  }

  return `${base}

Task: General veterinary triage image.

Return JSON:
{"summary": string, "visible_concerns": string[], "suggested_next_steps": string[], "confidence": "high"|"medium"|"low", "disclaimer": string}`;
}

async function runVisionModel(genAI, modelName, prompt, mimeType, base64, useJsonMime) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
      ...(useJsonMime ? { responseMimeType: "application/json" } : {}),
    },
  });
  const result = await model.generateContent([{ text: prompt }, { inlineData: { mimeType, data: base64 } }]);
  const response = result.response;
  const cand = response.candidates?.[0];
  const fr = cand?.finishReason;
  if (fr && fr !== "STOP" && fr !== "MAX_TOKENS") {
    throw new Error(`Model stopped: ${fr}`);
  }
  let text = "";
  try {
    text = response.text();
  } catch {
    const pf = response.promptFeedback;
    if (pf?.blockReason) throw new Error(`Blocked: ${pf.blockReason}`);
    throw new Error("Empty model response");
  }
  text = (text || "").trim();
  if (useJsonMime) {
    try {
      return JSON.parse(text);
    } catch {
      /* fall through to brace extraction */
    }
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return { raw_model_text: text, parse_error: true };
    }
  }
  return { raw_model_text: text };
}

async function geminiAnalyzeImage(dataUrl, kind) {
  const apiKey = visionApiKey();
  if (!apiKey) throw new Error("VISION_KEY_MISSING");

  const { mimeType, base64 } = parseImagePayload(dataUrl);
  const mt = normalizeImageMime(mimeType);

  const genAI = new GoogleGenerativeAI(apiKey);
  const preferred = process.env.GEMINI_VISION_MODEL?.trim();
  const fallbacks = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
  ];
  const modelOrder = preferred ? [preferred, ...fallbacks.filter((x) => x !== preferred)] : fallbacks;
  const prompt = buildVisionPrompt(kind);

  let lastError = null;
  for (const modelName of modelOrder) {
    for (const useJsonMime of [true, false]) {
      try {
        const parsed = await runVisionModel(genAI, modelName, prompt, mt, base64, useJsonMime);
        return { ...parsed, _model: modelName, _json_mode: useJsonMime };
      } catch (e) {
        lastError = e;
        if (isQuotaOrRateLimit(e)) break;
        const msg = e?.message || String(e);
        if (/not found|404|Unsupported|does not exist|is not supported|NOT_FOUND|Unknown model/i.test(msg)) {
          break;
        }
      }
    }
  }
  const msg = lastError?.message || String(lastError);
  const err = new Error(msg || "All Gemini vision models failed for this key/region.");
  err.cause = lastError;
  throw err;
}

app.post("/api/analyze-image", async (req, res) => {
  try {
    const { data, kind } = req.body || {};
    if (!data || typeof data !== "string") {
      return res.status(400).json({ error: "data required (base64 or data URL)" });
    }
    if (!visionApiKey()) {
      return res.status(503).json({
        ok: false,
        code: "VISION_KEY_MISSING",
        mode: "disabled",
        error:
          "No GEMINI_API_KEY or GOOGLE_API_KEY set. Add one to .env from https://aistudio.google.com/apikey and restart the server.",
      });
    }
    const result = await geminiAnalyzeImage(data, kind || "generic");
    if (result == null) {
      return res.status(503).json({
        ok: false,
        code: "VISION_KEY_MISSING",
        mode: "disabled",
        error:
          "No GEMINI_API_KEY or GOOGLE_API_KEY set. Add one to .env from https://aistudio.google.com/apikey and restart the server.",
      });
    }
    res.json({ ok: true, mode: "gemini-vision", result });
  } catch (e) {
    const msg = e?.message || String(e);
    if (/VISION_KEY_MISSING|^No API key$/i.test(msg)) {
      return res.status(503).json({
        ok: false,
        code: "VISION_KEY_MISSING",
        mode: "disabled",
        error:
          "No GEMINI_API_KEY or GOOGLE_API_KEY set. Add one to .env from https://aistudio.google.com/apikey and restart the server.",
      });
    }
    if (/API_KEY_INVALID|invalid api key|401|403|PERMISSION_DENIED/i.test(msg)) {
      return res.status(503).json({
        ok: false,
        code: "VISION_KEY_INVALID",
        mode: "disabled",
        error:
          "Gemini rejected this API key (invalid, revoked, or restricted). Create a new key at https://aistudio.google.com/apikey, update GEMINI_API_KEY in .env next to server.js, and restart npm start.",
      });
    }
    if (isQuotaOrRateLimit(e) || isQuotaOrRateLimit(e.cause)) {
      return res.status(429).json({
        ok: false,
        code: "QUOTA_EXCEEDED",
        mode: "error",
        error:
          "Gemini API quota exceeded for image analysis. Wait about a minute, try again, or add a new API key in .env from https://aistudio.google.com/apikey",
      });
    }
    res.status(502).json({
      ok: false,
      code: "VISION_FAILED",
      mode: "error",
      error: msg,
      hint:
        "Confirm the key works in Google AI Studio, billing is OK if required, and Gemini API access is enabled. Try GEMINI_VISION_MODEL=gemini-2.0-flash in .env.",
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    vision: visionApiKey().length > 0,
    chat: chatApiKey().length > 0,
  });
});

/** Non-secret diagnostics: helps confirm the running server sees .env and the key. */
app.get("/api/env-check", (_req, res) => {
  res.json({
    ok: true,
    envFileExists: fs.existsSync(envPath),
    envPath,
    geminiKeyConfigured: visionApiKey().length > 0,
    geminiChatKeyConfigured: chatApiKey().length > 0,
  });
});

function chatModelOrder() {
  const preferred = process.env.GEMINI_CHAT_MODEL?.trim();
  const fallbacks = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
  ];
  return preferred ? [preferred, ...fallbacks.filter((x) => x !== preferred)] : fallbacks;
}

function threadToPrompt(thread) {
  const lines = [];
  for (const m of thread) {
    const text = String(m.text || "").trim();
    if (!text) continue;
    lines.push(m.role === "user" ? `User: ${text}` : `Assistant: ${text}`);
  }
  lines.push("Assistant:");
  return lines.join("\n\n");
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label || "Request"} timed out after ${ms / 1000}s`)), ms)),
  ]);
}

function isQuotaOrRateLimit(err) {
  const msg = (err?.message || String(err)).toLowerCase();
  return err?.status === 429 || /429|quota|rate limit|too many requests|resource_exhausted/i.test(msg);
}

function useGeminiForChat() {
  return String(process.env.USE_GEMINI_CHAT || "").trim().toLowerCase() === "true";
}

async function runGeminiChatWithKeys(keys, thread, lang, onDelta) {
  let lastError = null;
  for (const key of keys) {
    try {
      return await runGeminiChat(key, thread, lang, onDelta);
    } catch (e) {
      lastError = e;
      if (isQuotaOrRateLimit(e) || isQuotaOrRateLimit(e.cause)) continue;
      throw e;
    }
  }
  if (lastError) {
    lastError.code = "QUOTA_EXCEEDED";
    throw lastError;
  }
  throw new Error("No API keys configured");
}

async function runGeminiChat(key, thread, lang, onDelta) {
  const genAI = new GoogleGenerativeAI(key);
  const prompt = threadToPrompt(thread);
  const sys = buildChatSystemInstruction(lang);
  const modelName = chatModelOrder()[0];
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: sys,
    generationConfig: { temperature: 0.35, maxOutputTokens: 1024 },
  });

  try {
    if (onDelta) {
      const streamResult = await withTimeout(model.generateContentStream(prompt), 12000, "Chat");
      let buf = "";
      for await (const chunk of streamResult.stream) {
        let piece = "";
        try {
          piece = typeof chunk.text === "function" ? chunk.text() : "";
        } catch {
          /* blocked chunk */
        }
        if (piece) {
          buf += piece;
          onDelta(piece);
        }
      }
      if (!buf.trim()) {
        const resp = await streamResult.response;
        buf = resp.text() || "";
        if (buf.trim()) onDelta(buf);
      }
      if (!buf.trim()) throw new Error("Empty chat response");
      return { model: modelName };
    }
    const result = await withTimeout(model.generateContent(prompt), 6000, "Chat");
    const text = result.response.text() || "";
    if (!text.trim()) throw new Error("Empty chat response");
    return { model: modelName, text };
  } catch (e) {
    if (isQuotaOrRateLimit(e) || isQuotaOrRateLimit(e.cause)) {
      const err = new Error("Gemini API quota exceeded");
      err.code = "QUOTA_EXCEEDED";
      err.status = 429;
      throw err;
    }
    throw e;
  }
}

/** Built-in assistant — always works, no API quota. */
app.post("/api/chat/local", (req, res) => {
  const { thread, lang } = req.body || {};
  if (!Array.isArray(thread) || thread.length === 0) {
    return res.status(400).json({ error: "thread required" });
  }
  res.json({ ok: true, text: localChatAssistant(thread, lang), mode: "local" });
});

/** Chat: local assistant by default; Gemini only if USE_GEMINI_CHAT=true in .env */
app.post("/api/chat", async (req, res) => {
  const { thread, lang } = req.body || {};
  if (!Array.isArray(thread) || thread.length === 0) {
    return res.status(400).json({ error: "thread required" });
  }
  const last = thread[thread.length - 1];
  if (!last || last.role !== "user" || !String(last.text || "").trim()) {
    return res.status(400).json({ error: "last message must be from user" });
  }

  if (!useGeminiForChat()) {
    return res.json({ ok: true, text: localChatAssistant(thread, lang), mode: "local" });
  }

  const keys = chatApiKeys();
  if (!keys.length) {
    return res.json({ ok: true, text: localChatAssistant(thread, lang), mode: "local" });
  }

  try {
    const meta = await runGeminiChatWithKeys(keys, thread, lang, null);
    res.json({ ok: true, text: meta.text, model: meta?.model, mode: "gemini" });
  } catch (e) {
    const msg = e?.message || String(e);
    if (/API_KEY_INVALID|invalid api key|401|403|PERMISSION_DENIED/i.test(msg)) {
      return res.json({ ok: true, text: localChatAssistant(thread, lang), mode: "local" });
    }
    res.json({ ok: true, text: localChatAssistant(thread, lang), mode: "local" });
  }
});

/**
 * Streaming chat (SSE). Body: { thread: [{ role: "user"|"assistant", text }], lang?: string }
 */
app.post("/api/chat/stream", async (req, res) => {
  const keys = chatApiKeys();
  if (!keys.length) {
    return res.status(503).json({
      error: "No chat API key configured.",
      code: "CHAT_KEY_MISSING",
      hint: "Set GEMINI_CHAT_API_KEY (or GEMINI_API_KEY) in .env next to server.js and restart.",
    });
  }
  const { thread, lang } = req.body || {};
  if (!Array.isArray(thread) || thread.length === 0) {
    return res.status(400).json({ error: "thread required: array of {role, text}" });
  }
  const last = thread[thread.length - 1];
  if (!last || last.role !== "user" || !String(last.text || "").trim()) {
    return res.status(400).json({ error: "last message must be { role: \"user\", text: \"...\" }" });
  }

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  if (typeof res.flushHeaders === "function") res.flushHeaders();

  const send = (obj) => {
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
  };

  if (!useGeminiForChat()) {
    send({ d: localChatAssistant(thread, lang) });
    send({ done: true });
    res.end();
    return;
  }

  try {
    await runGeminiChatWithKeys(keys, thread, lang, (piece) => send({ d: piece }));
    send({ done: true });
    res.end();
  } catch {
    send({ d: localChatAssistant(thread, lang) });
    send({ done: true });
    res.end();
  }
});

app.post("/api/upload-image", (req, res) => {
  const { data, kind, user_id } = req.body || {};
  if (!data) return res.status(400).json({ error: "data required" });
  const id = `img_${nextImgId++}`;
  images.set(id, { data, kind, user_id, at: new Date().toISOString() });
  res.json({ image_id: id });
});

app.post("/api/register", (req, res) => {
  const { phone, password, name, language } = req.body || {};
  if (!phone || !password) return res.status(400).json({ error: "phone and password required" });
  for (const u of users.values()) {
    if (u.phone === phone) return res.status(400).json({ error: "Phone already registered" });
  }
  const id = nextUserId++;
  const user = { id, phone, name: name || "User", language: language || "en" };
  users.set(id, { ...user, password });
  res.json({ user });
});

app.post("/api/login", (req, res) => {
  const { phone, password } = req.body || {};
  for (const u of users.values()) {
    if (u.phone === phone && u.password === password) {
      const { password: _p, ...user } = u;
      return res.json({ user });
    }
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

app.post("/api/doctor/register", (req, res) => {
  const body = req.body || {};
  if (!body.phone || !body.password) return res.status(400).json({ error: "missing fields" });
  for (const d of doctors.values()) {
    if (d.phone === body.phone) return res.status(400).json({ error: "Phone already registered" });
  }
  const id = nextDoctorId++;
  const doctor = {
    id,
    name: body.name || "Doctor",
    phone: body.phone,
    password: body.password,
    specialization: body.specialization || "General",
    experience: Number(body.experience || 0),
    languages: body.languages || "",
    rating: 4.5,
    available: false,
    accepts_video: true,
    available_from: "09:00",
    available_until: "18:00",
  };
  doctors.set(id, doctor);
  const { password: _p, ...pub } = doctor;
  res.json({ doctor: pub });
});

app.post("/api/doctor/login", (req, res) => {
  const { phone, password } = req.body || {};
  for (const d of doctors.values()) {
    if (d.phone === phone && d.password === password) {
      const { password: _p, ...doctor } = d;
      return res.json({ doctor });
    }
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

app.post("/api/doctor/availability", (req, res) => {
  const { doctor_id, available, available_from, available_until, accepts_video } = req.body || {};
  const d = doctors.get(Number(doctor_id));
  if (!d) return res.status(404).json({ error: "Doctor not found" });
  if (typeof available === "boolean") d.available = available;
  if (available_from) d.available_from = available_from;
  if (available_until) d.available_until = available_until;
  if (typeof accepts_video === "boolean") d.accepts_video = accepts_video;
  const { password: _p, ...doctor } = d;
  res.json({ doctor });
});

app.get("/api/doctors", (_req, res) => {
  const list = [...doctors.values()].map((d) => {
    const { password: _p, ...rest } = d;
    return rest;
  });
  res.json({ doctors: list });
});

function simpleDiagnose(input) {
  const syms = (input.symptoms || []).map((s) => String(s).toLowerCase()).join(" ");
  let diagnosis = "Non-specific illness";
  let match_score = 62;
  let severity = input.severity || "medium";
  if (/fever|tap|temperature/.test(syms)) {
    diagnosis = "Possible infectious / feverish condition";
    match_score = 74;
  }
  if (/diarrhea|dast|jula/.test(syms)) {
    diagnosis = "Gastrointestinal upset — parasitic or dietary differentials";
    match_score = 71;
  }
  if (/not eating|khana|khat/.test(syms)) {
    diagnosis = "Inappetence — metabolic, infectious, or oral causes";
    match_score = 68;
  }
  if (severity === "high") match_score = Math.min(88, match_score + 10);

  const medicines = [
    { name: "Oral rehydration / electrolytes (species-appropriate)", frequency: "As directed by vet", duration: "Until stable" },
    { name: "Supportive care: isolate, monitor temperature, fresh water", frequency: "Continuous", duration: "24–72h" },
  ];
  const precautions =
    "This is an educational assistant, not a licensed diagnosis. Contact your veterinarian for examination, diagnostics, and prescriptions.";
  return { diagnosis, match_score, severity, medicines, precautions };
}

app.post("/api/diagnose", (req, res) => {
  const body = req.body || {};
  const out = simpleDiagnose(body);
  const uid = body.user_id;
  if (uid) {
    const arr = historyByUser.get(Number(uid)) || [];
    arr.unshift({
      id: `h_${Date.now()}`,
      created_at: new Date().toISOString(),
      diagnosis: out.diagnosis,
      severity: out.severity,
    });
    historyByUser.set(Number(uid), arr.slice(0, 50));
  }
  res.json(out);
});

app.get("/api/history/:userId", (req, res) => {
  const arr = historyByUser.get(Number(req.params.userId)) || [];
  res.json({ history: arr });
});

app.post("/api/video-call/request", (req, res) => {
  const { user_id, user_name, doctor_id, severity, diagnosis_summary } = req.body || {};
  const d = doctors.get(Number(doctor_id));
  if (!d) return res.status(404).json({ error: "Doctor not found" });
  if (!d.available || !d.accepts_video) return res.status(400).json({ error: "Doctor unavailable" });
  const id = nextCallId++;
  const room = `carebridge-${id}-${Math.random().toString(36).slice(2, 8)}`;
  const call = {
    id,
    user_id,
    user_name: user_name || "Patient",
    doctor_id: d.id,
    severity: severity || "medium",
    diagnosis_summary: diagnosis_summary || "",
    status: "pending",
    room,
    created_at: new Date().toISOString(),
  };
  calls.set(id, call);
  const { password: _p, ...doctor } = d;
  res.json({ call_id: id, room, doctor });
});

app.get("/api/video-call/status/:id", (req, res) => {
  const c = calls.get(Number(req.params.id));
  if (!c) return res.status(404).json({ error: "not found" });
  res.json({ call: c });
});

app.post("/api/video-call/:id/accept", (req, res) => {
  const c = calls.get(Number(req.params.id));
  if (!c) return res.status(404).json({ error: "not found" });
  c.status = "accepted";
  res.json({ room: c.room });
});

app.post("/api/video-call/:id/decline", (req, res) => {
  const c = calls.get(Number(req.params.id));
  if (!c) return res.status(404).json({ error: "not found" });
  c.status = "declined";
  res.json({ ok: true });
});

app.post("/api/video-call/:id/end", (req, res) => {
  const c = calls.get(Number(req.params.id));
  if (c) c.status = "ended";
  res.json({ ok: true });
});

app.get("/api/video-call/pending/:doctorId", (req, res) => {
  const did = Number(req.params.doctorId);
  const pending = [...calls.values()].filter((c) => c.doctor_id === did && c.status === "pending");
  res.json({ calls: pending });
});

app.get("/api/doctor/activity/:doctorId", (req, res) => {
  const did = Number(req.params.doctorId);
  const activity = [...calls.values()]
    .filter((c) => c.doctor_id === did)
    .map((c) => ({
      id: `a_${c.id}`,
      activity: c.status === "accepted" ? "call_accepted" : c.status === "declined" ? "call_declined" : "call_requested",
      details: c.diagnosis_summary || "Video call",
      created_at: c.created_at,
    }));
  res.json({ activity });
});

const publicDir = path.join(__dirname, "public");
if (fs.existsSync(publicDir)) {
  app.use(
    express.static(publicDir, {
      setHeaders(res, filePath) {
        const base = path.basename(filePath);
        if (
          base === "index.html" ||
          base === "app.js" ||
          base === "screens.js" ||
          base === "styles.css" ||
          base === "styles-premium.css" ||
          base === "logo.png" ||
          base === "splash-logo.png"
        ) {
          res.setHeader("Cache-Control", "no-store");
        }
      },
    })
  );
}

app.get("*", (_req, res) => {
  const index = path.join(publicDir, "index.html");
  if (fs.existsSync(index)) {
    res.setHeader("Cache-Control", "no-store");
    return res.sendFile(index);
  }
  res.type("text").send("Place index.html inside /public and run npm start");
});

app.listen(PORT, () => {
  const k = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
  const visionOn = k.length > 0;
  const ck = chatApiKey();
  const chatOn = ck.length > 0;
  const chatDedicated = !!(process.env.GEMINI_CHAT_API_KEY || "").trim();
  console.log(`Care Bridge server http://localhost:${PORT}`);
  console.log(
    visionOn
      ? "Gemini vision: ON (API key loaded from .env next to server.js)"
      : "Gemini vision: OFF — put .env next to server.js with GEMINI_API_KEY=... and restart"
  );
  console.log(
    chatOn
      ? chatDedicated
        ? "Gemini chat key: loaded (GEMINI_CHAT_API_KEY)"
        : "Gemini chat key: loaded (GEMINI_API_KEY)"
      : "Gemini chat key: none"
  );
  console.log(
    useGeminiForChat()
      ? "Chat mode: Gemini (USE_GEMINI_CHAT=true)"
      : "Chat mode: built-in assistant (no API quota — set USE_GEMINI_CHAT=true for Gemini)"
  );
});
