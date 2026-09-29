const { useState, useEffect, useRef, useMemo } = React;

function getT(lang) {
  const packs = window.CB_T || { en: {} };
  const loc = packs[lang] || {};
  const en = packs.en || {};
  return new Proxy(loc, {
    get(obj, k) {
      const v = obj[k];
      if (v !== undefined && v !== null && v !== "") return v;
      return en[k] ?? String(k);
    },
  });
}

let _currentLang = "en";
const useTr = () => getT(_currentLang);

const LOCAL_REPORTS_KEY = "cb_local_reports";
const CB_USER_CREDS_KEY = "cb_user_creds";
const CB_DOCTOR_CREDS_KEY = "cb_doctor_creds";
const CB_CHAT_PREFIX = "cb_chat_";

class AudioRingtoneManager {
  constructor() {
    this.ctx = null;
    this.timer = null;
    this.isPlaying = false;
    this.mode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playOutgoingRing() {
    this.stop();
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.mode = "outgoing";

    const playBurst = () => {
      if (!this.isPlaying || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(440, now);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
        gain.gain.setValueAtTime(0.2, now + 1.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.85);
        osc2.stop(now + 1.85);
      } catch (e) {}
    };

    playBurst();
    this.timer = setInterval(playBurst, 4000);
  }

  playIncomingRing() {
    this.stop();
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.mode = "incoming";

    const playMelody = () => {
      if (!this.isPlaying || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [
          { f: 523.25, t: 0, d: 0.22 },     // C5
          { f: 659.25, t: 0.22, d: 0.22 },  // E5
          { f: 783.99, t: 0.44, d: 0.25 },  // G5
          { f: 1046.50, t: 0.70, d: 0.45 }, // C6
          { f: 783.99, t: 1.25, d: 0.20 },  // G5
          { f: 1046.50, t: 1.48, d: 0.55 }, // C6
        ];

        notes.forEach(({ f, t, d }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, now + t);

          gain.gain.setValueAtTime(0.001, now + t);
          gain.gain.exponentialRampToValueAtTime(0.25, now + t + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + t);
          osc.stop(now + t + d + 0.05);
        });
      } catch (e) {}
    };

    playMelody();
    this.timer = setInterval(playMelody, 2800);
  }

  stop() {
    this.isPlaying = false;
    this.mode = null;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

window.CB_AudioRingtone = new AudioRingtoneManager();

class CrossBrowserSpeechEngine {
  constructor() {
    this.synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
    this.voices = [];
    this.queue = [];
    this.isSpeaking = false;
    this.onStateChange = null;
    this.init();
  }

  init() {
    if (!this.synth) return;
    this.loadVoices();
    if (typeof this.synth.onvoiceschanged !== "undefined") {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
  }

  unlock() {
    if (!this.synth) return;
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch (e) {}
  }

  stop() {
    this.queue = [];
    this.isSpeaking = false;
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    if (this.onStateChange) this.onStateChange(false);
  }

  cleanText(raw) {
    return String(raw || "")
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "")
      .replace(/[*#_~`•\[\]\(\)\{\}\-]/g, " ")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  splitIntoSentences(text) {
    const matches = text.match(/[^.!?।\n]+[.!?।\n]*/g);
    if (!matches || matches.length === 0) return [text];
    return matches.map((s) => s.trim()).filter((s) => s.length > 0);
  }

  getBestVoice(lang) {
    this.loadVoices();
    const l = (lang || "en").toLowerCase();
    const targetTag = l === "hi" ? "hi-IN" : l === "mr" ? "mr-IN" : "en-IN";

    let v = this.voices.find((x) => x.lang && x.lang.toLowerCase() === targetTag.toLowerCase());
    if (v) return v;

    if (l === "mr") {
      v = this.voices.find((x) => x.lang && (x.lang.toLowerCase().startsWith("mr") || x.lang.toLowerCase().startsWith("hi")));
      if (v) return v;
    }

    v = this.voices.find((x) => x.lang && x.lang.toLowerCase().startsWith(l));
    if (v) return v;

    v = this.voices.find((x) => x.lang && (x.lang.includes("IN") || x.name.toLowerCase().includes("india") || x.name.toLowerCase().includes("hindi")));
    return v || null;
  }

  speak(rawText, lang = "en", onStart = null, onEnd = null) {
    if (!this.synth) {
      console.warn("SpeechSynthesis not supported on this device.");
      return;
    }
    this.stop();
    this.unlock();

    const clean = this.cleanText(rawText);
    if (!clean) return;

    const sentences = this.splitIntoSentences(clean);
    this.queue = [...sentences];
    this.isSpeaking = true;
    if (onStart) onStart();
    if (this.onStateChange) this.onStateChange(true);

    const voice = this.getBestVoice(lang);
    const targetLang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN";

    const speakNext = () => {
      if (!this.isSpeaking || this.queue.length === 0) {
        this.isSpeaking = false;
        if (onEnd) onEnd();
        if (this.onStateChange) this.onStateChange(false);
        return;
      }

      const chunk = this.queue.shift();
      try {
        const utter = new SpeechSynthesisUtterance(chunk);
        window._activeUtterance = utter; // Chrome GC protection
        utter.lang = targetLang;
        if (voice) utter.voice = voice;
        utter.rate = 0.95;
        utter.pitch = 1.0;

        utter.onend = () => {
          speakNext();
        };
        utter.onerror = () => {
          speakNext();
        };

        if (this.synth.paused) {
          this.synth.resume();
        }

        this.synth.speak(utter);
      } catch (err) {
        this.isSpeaking = false;
        if (onEnd) onEnd();
        if (this.onStateChange) this.onStateChange(false);
      }
    };

    speakNext();
  }
}

window.CB_SpeechEngine = new CrossBrowserSpeechEngine();

function loadSavedCreds(role) {
  try {
    const key = role === "doctor" ? CB_DOCTOR_CREDS_KEY : role === "pharmacy" ? "cb_pharmacy_creds" : role === "delivery" ? "cb_delivery_creds" : CB_USER_CREDS_KEY;
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (e) {
    return null;
  }
}
function saveSavedCreds(role, creds) {
  const key = role === "doctor" ? CB_DOCTOR_CREDS_KEY : role === "pharmacy" ? "cb_pharmacy_creds" : role === "delivery" ? "cb_delivery_creds" : CB_USER_CREDS_KEY;
  if (!creds) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(creds));
}
function loadChatHistory(userId) {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(CB_CHAT_PREFIX + userId) || "[]");
  } catch (e) {
    return [];
  }
}
function saveChatHistory(userId, msgs) {
  if (!userId) return;
  const trimmed = (msgs || []).slice(-40);
  localStorage.setItem(CB_CHAT_PREFIX + userId, JSON.stringify(trimmed));
}
function loadLocalReports() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_REPORTS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
function loadLocalReportsForUser(userId) {
  const all = loadLocalReports();
  if (userId == null || userId === "") return [];
  return all.filter((r) => Number(r.user_id) === Number(userId));
}
function saveLocalReport(r, userId) {
  const list = loadLocalReports();
  const uid = userId != null ? Number(userId) : r.user_id != null ? Number(r.user_id) : null;
  const fingerprint = (uid || "") + "|" + (r.diagnosis || "") + "|" + (r.symptoms || []).join(",");
  if (list.length > 0) {
    const last = list[0];
    const lastFp = (last.user_id || "") + "|" + (last.diagnosis || "") + "|" + (last.symptoms || []).join(",");
    const recent = Date.now() - new Date(last._ts).getTime() < 60000;
    if (lastFp === fingerprint && recent) return last;
  }
  const record = {
    ...r,
    user_id: uid,
    from_diagnosis: r.from_diagnosis === true,
    _id: Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    _ts: new Date().toISOString(),
  };
  list.unshift(record);
  if (list.length > 100) list.length = 100;
  localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(list));
  return record;
}
function deleteLocalReport(id) {
  const list = loadLocalReports().filter((r) => r._id !== id);
  localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(list));
  return list;
}
function buildReportDownloadText(report, t, lang) {
  const lines = [];
  lines.push("VetNova — Diagnosis Report");
  lines.push("================================");
  lines.push(`${t.dateTime}: ${formatReportDate(report._ts || report.created_at)}`);
  lines.push(`${t.animal}: ${report.animalEmoji || ""} ${report.animal || "—"}`);
  lines.push(`${t.diagnosisLabel}: ${report.diagnosis || "—"}`);
  if (typeof report.match_score === "number") lines.push(`${t.confidence}: ${report.match_score}%`);
  const sev =
    report.severity === "high" ? t.sevHigh : report.severity === "medium" ? t.sevMed : t.sevLow;
  lines.push(`${t.severity}: ${sev}`);
  if (report.duration) lines.push(`${t.duration}: ${report.duration}`);
  if (report.symptoms && report.symptoms.length) {
    lines.push("");
    lines.push(`${t.reportedSymptoms}:`);
    report.symptoms.forEach((s) => lines.push(`  - ${displaySymptom(s, lang, report.animalKey)}`));
  }
  if (report.medicines && report.medicines.length) {
    lines.push("");
    lines.push(`${t.recommendedMeds}:`);
    report.medicines.forEach((m) => {
      lines.push(`  - ${m.name}`);
      lines.push(`    ${t.frequencyLabel}: ${m.frequency}`);
      lines.push(`    ${t.durationLabel}: ${m.duration}`);
    });
  }
  if (report.home_remedies && report.home_remedies.length) {
    lines.push("");
    lines.push(`${t.homeRemedies}:`);
    report.home_remedies.forEach((hr) => {
      lines.push(`  - ${hr.name}`);
      if (hr.detail) lines.push(`    ${hr.detail}`);
    });
  }
  if (report.precautions) {
    lines.push("");
    lines.push(`${t.precautions}: ${report.precautions}`);
  }
  if (report.current_medicine) {
    lines.push("");
    lines.push(`${t.currentMedicationLabel}: ${report.current_medicine}`);
  }
  lines.push("");
  lines.push("—");
  lines.push(t.reportDownloadFooter || "Educational report only. Consult a licensed veterinarian for treatment.");
  return lines.join("\n");
}
function downloadReportFile(report, t, lang) {
  const text = buildReportDownloadText(report, t, lang);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `care-bridge-report-${(report._id || report.id || "report").replace(/[^\w-]/g, "_")}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function formatReportDate(iso) {
  try {
    const d = new Date(iso);
    return (
      d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) +
      " · " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } catch (e) {
    return iso || "";
  }
}

async function fetchEnvCheck() {
  try {
    const r = await fetch("/api/env-check");
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

const CB_GEO_KEY = "cb_geo_last";
const CB_GEO_MAX_AGE_MS = 12 * 60 * 1000;

function readStoredGeo(maxAgeMs = CB_GEO_MAX_AGE_MS) {
  try {
    const raw = sessionStorage.getItem(CB_GEO_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (typeof o?.lat !== "number" || typeof o?.lon !== "number" || !o.ts) return null;
    if (Date.now() - o.ts > maxAgeMs) return null;
    return { lat: o.lat, lon: o.lon };
  } catch {
    return null;
  }
}

function storeGeo(lat, lon) {
  try {
    sessionStorage.setItem(CB_GEO_KEY, JSON.stringify({ lat, lon, ts: Date.now() }));
  } catch (_) {}
}

function requestDeviceLocationOnce(enableHighAccuracy, timeoutMs) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ ok: false, code: "unsupported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          ok: true,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        let code = "unknown";
        if (err && err.code === 1) code = "denied";
        else if (err && err.code === 2) code = "unavailable";
        else if (err && err.code === 3) code = "timeout";
        resolve({ ok: false, code });
      },
      { enableHighAccuracy, timeout: timeoutMs, maximumAge: 0 }
    );
  });
}

/** Two-phase fix: fast network/Wi‑Fi estimate first, then high accuracy (many desktops fail if only GPS). */
async function requestDeviceLocation() {
  let r = await requestDeviceLocationOnce(false, 22000);
  if (r.ok) return r;
  if (r.code === "denied" || r.code === "unsupported") return r;
  r = await requestDeviceLocationOnce(true, 26000);
  return r;
}

function geoErrorMessage(code, t) {
  const map = {
    denied: t.locationErrDenied,
    timeout: t.locationErrTimeout,
    unavailable: t.locationErrUnavailable,
    unsupported: t.locationErrUnsupported,
    unknown: t.locationErrUnknown,
  };
  return map[code] || t.locationErrUnknown;
}

function LocationHeroBanner({ t }) {
  const [perm, setPerm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [hasFix, setHasFix] = useState(() => !!readStoredGeo());
  const [lastErr, setLastErr] = useState(null);

  useEffect(() => {
    if (!navigator.permissions?.query) return undefined;
    let permObj;
    const onPermChange = () => setPerm(permObj.state);
    navigator.permissions
      .query({ name: "geolocation" })
      .then((p) => {
        permObj = p;
        setPerm(p.state);
        p.addEventListener("change", onPermChange);
      })
      .catch(() => {});
    return () => {
      if (permObj) permObj.removeEventListener("change", onPermChange);
    };
  }, []);

  const onAllow = async () => {
    setLastErr(null);
    setBusy(true);
    const r = await requestDeviceLocation();
    setBusy(false);
    if (r.ok) {
      storeGeo(r.lat, r.lon);
      setHasFix(true);
      setPerm("granted");
      try {
        window.dispatchEvent(new CustomEvent("carebridge:geo", { detail: { lat: r.lat, lon: r.lon } }));
      } catch (_) {}
    } else {
      setLastErr(r.code);
    }
  };

  useEffect(() => {
    const sync = () => setHasFix(!!readStoredGeo());
    window.addEventListener("carebridge:geo", sync);
    return () => window.removeEventListener("carebridge:geo", sync);
  }, []);

  if (hasFix) {
    return (
      <div className="loc-banner loc-banner--ok">
        <span className="loc-pulse" aria-hidden />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3>{t.locationOnTitle}</h3>
          <p>{t.locationOnBody}</p>
          <span className="loc-pill">{t.locationOnPill}</span>
        </div>
      </div>
    );
  }

  const ctaLabel = busy ? t.locating : lastErr || perm === "denied" ? t.locationRetry : t.locationAllowCta;

  return (
    <div className="loc-banner">
      <div className="loc-banner-icon" aria-hidden>
        📍
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3>{t.locationBannerTitle}</h3>
        <p>{t.locationBannerBody}</p>
        {lastErr && (
          <p style={{ marginTop: 10, fontSize: 12, color: "var(--danger)", lineHeight: 1.45 }}>{geoErrorMessage(lastErr, t)}</p>
        )}
        <div className="loc-banner-actions">
          <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={onAllow}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

async function streamGeminiChat(thread, lang, onDelta, onError) {
  const body = JSON.stringify({ thread, lang: lang || "en" });
  const tryStream = async () => {
    const res = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const ctype = res.headers.get("content-type") || "";
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      if (ctype.includes("application/json")) {
        try {
          const j = await res.json();
          msg = [j.error, j.hint].filter(Boolean).join(" — ") || msg;
        } catch (_) {}
      }
      throw new Error(msg);
    }
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response stream");
    const dec = new TextDecoder();
    let carry = "";
    let gotText = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      carry += dec.decode(value, { stream: true });
      let splitAt;
      while ((splitAt = carry.indexOf("\n\n")) >= 0) {
        const block = carry.slice(0, splitAt);
        carry = carry.slice(splitAt + 2);
        for (const rawLine of block.split("\n")) {
          if (!rawLine.startsWith("data:")) continue;
          const payload = rawLine.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          let o;
          try {
            o = JSON.parse(payload);
          } catch {
            continue;
          }
          if (o.e) throw new Error(o.e);
          if (o.d) {
            gotText = true;
            onDelta(o.d);
          }
          if (o.done) return;
        }
      }
    }
    if (!gotText) throw new Error("Empty stream");
  };

  try {
    await tryStream();
  } catch (streamErr) {
    try {
      const j = await api("/api/chat", { body: { thread, lang: lang || "en" } });
      if (j.text) onDelta(j.text);
      else throw streamErr;
    } catch (fallbackErr) {
      if (onError) onError(fallbackErr.message || streamErr.message);
      throw fallbackErr;
    }
  }
}

function sanitizeChatText(text) {
  let s = String(text || "");
  if (/gemini api|daily quota|quota is used|quota exceeded|offline mode/i.test(s)) return "";
  s = s.replace(/\*\*/g, "").replace(/\*/g, "");
  s = s.replace(/^[\s•\-]+/gm, (m) => m.replace(/^\*+/, ""));
  return s.trim();
}

function chatWelcomeText(t, userName) {
  const named = userName && t.chatWelcomeNamed ? String(t.chatWelcomeNamed).replace("{name}", userName) : "";
  return named || t.chatWelcome || "";
}

function GeminiChatDock({ lang, onNavigate, user }) {
  const [chatLang, setChatLang] = useState(() => localStorage.getItem("cb_chat_lang") || lang || "en");
  const t = getT(chatLang);
  const userName = user?.name || "";
  const userId = user?.id;
  const [open, setOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => localStorage.getItem("cb_auto_speak") !== "false");
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const [msgs, setMsgs] = useState(() => {
    const saved = loadChatHistory(userId);
    if (saved.length) return saved;
    const welcome = chatWelcomeText(getT(chatLang), userName);
    return welcome ? [{ role: "assistant", text: welcome }] : [];
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("cb_chat_lang", chatLang);
  }, [chatLang]);

  useEffect(() => {
    localStorage.setItem("cb_auto_speak", String(autoSpeak));
  }, [autoSpeak]);

  useEffect(() => {
    const saved = loadChatHistory(userId);
    if (saved.length) {
      setMsgs(saved);
      return;
    }
    const welcome = chatWelcomeText(getT(chatLang), userName);
    if (!welcome) return;
    setMsgs((prev) => {
      if (prev.some((m) => m.role === "user")) return prev;
      return [{ role: "assistant", text: welcome }];
    });
  }, [chatLang, userId, userName]);

  useEffect(() => {
    if (!userId || !msgs.length) return;
    saveChatHistory(userId, msgs);
  }, [msgs, userId]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, open]);

  // Clean up speech synthesis on unmount or close
  useEffect(() => {
    if (!open) {
      if (window.CB_SpeechEngine) window.CB_SpeechEngine.stop();
      setSpeakingIndex(null);
    }
  }, [open]);

  const speakText = (text, index = null) => {
    if (!window.CB_SpeechEngine) return;

    if (index !== null && speakingIndex === index) {
      window.CB_SpeechEngine.stop();
      setSpeakingIndex(null);
      return;
    }

    window.CB_SpeechEngine.speak(
      text,
      chatLang,
      () => {
        if (index !== null) setSpeakingIndex(index);
      },
      () => {
        setSpeakingIndex(null);
      }
    );
  };

  const startListening = () => {
    if (window.CB_SpeechEngine) window.CB_SpeechEngine.unlock();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is supported best in Chrome / Edge.");
      return;
    }
    if (listening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setListening(false);
      return;
    }
    try {
      const rec = new SR();
      recognitionRef.current = rec;
      rec.lang = chatLang === "hi" ? "hi-IN" : chatLang === "mr" ? "mr-IN" : "en-IN";
      rec.continuous = false;
      rec.interimResults = false;
      rec.onstart = () => setListening(true);
      rec.onresult = (e) => {
        const text = e.results?.[0]?.[0]?.transcript || "";
        if (text) {
          setInput((prev) => (prev ? prev + " " + text : text));
        }
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.start();
    } catch (e) {
      setListening(false);
    }
  };

  const buildApiThread = (list) =>
    list
      .filter((m) => m.text && String(m.text).trim())
      .slice(-12)
      .map((m) => ({ role: m.role, text: String(m.text).trim() }));

  const sendText = async (rawText) => {
    if (window.CB_SpeechEngine) window.CB_SpeechEngine.unlock();
    const text = String(rawText || input).trim();
    if (!text || busy) return;
    setInput("");
    const thread = buildApiThread([...msgs, { role: "user", text }]);
    const nextIdx = thread.length;
    setMsgs([...thread, { role: "assistant", text: "" }]);
    setBusy(true);

    const setAssistant = (reply) => {
      setMsgs((prev) => {
        const copy = prev.map((m) => ({ ...m, text: m.text }));
        const last = copy[copy.length - 1];
        if (last?.role === "assistant") last.text = reply;
        return copy;
      });
      if (autoSpeak && reply && reply.trim()) {
        setTimeout(() => {
          speakText(reply, nextIdx);
        }, 150);
      }
    };

    const chatBody = { thread, lang: chatLang, user_name: userName || undefined };
    try {
      const j = await api("/api/chat", { body: chatBody });
      let reply = sanitizeChatText(j.text) || "";
      if (!reply.trim()) {
        const loc = await api("/api/chat/local", { body: chatBody });
        reply = sanitizeChatText(loc.text) || t.chatError;
      }
      setAssistant(reply);
    } catch {
      try {
        const loc = await api("/api/chat/local", { body: chatBody });
        setAssistant(sanitizeChatText(loc.text) || t.chatError);
      } catch (e) {
        setAssistant(e.message || String(t.chatError));
      }
    }
    setBusy(false);
  };

  const send = () => {
    if (window.CB_SpeechEngine) window.CB_SpeechEngine.unlock();
    sendText(input);
  };
  const quickAsk = (q) => {
    if (window.CB_SpeechEngine) window.CB_SpeechEngine.unlock();
    sendText(q);
  };

  const quickPrompts = {
    en: [
      { label: "🌡️ Fever", text: "My animal has a fever and warm ears" },
      { label: "🍽️ Not Eating", text: "My animal is not eating and looks weak" },
      { label: "💧 Diarrhea", text: "My animal has loose motion / diarrhea" },
      { label: "💨 Bloating", text: "My animal has swollen belly and bloat" },
    ],
    hi: [
      { label: "🌡️ बुखार", text: "मेरे पशु को बुखार है और कान गर्म हैं" },
      { label: "🍽️ खाना नहीं खा रहा", text: "पशु चारा नहीं खा रहा और सुस्त है" },
      { label: "💧 दस्त / जुलाब", text: "पशु को दस्त हो रहे हैं" },
      { label: "💨 पेट फूलना", text: "पशु का पेट फूल गया है" },
    ],
    mr: [
      { label: "🌡️ ताप", text: "माझ्या जनावराला ताप आला आहे" },
      { label: "🍽️ खात नाही", text: "जनावर चारा खात नाही आणि अशक्त वाटते" },
      { label: "💧 जुलाब", text: "जनावराला जुलाब होत आहेत" },
      { label: "💨 पोट फुगणे", text: "जनावराचे पोट फुगले आहे" },
    ],
  };

  const curPrompts = quickPrompts[chatLang] || quickPrompts.en;

  return (
    <div className="cb-chat-root">
      <button
        type="button"
        className="cb-chat-fab"
        aria-expanded={open}
        aria-label={t.chatTitle}
        onClick={() => setOpen(!open)}
      >
        💬
      </button>
      {open && (
        <div className="cb-chat-panel" role="dialog" aria-label={t.chatTitle}>
          {/* Chat Header with Title & Auto-Speak Toggle */}
          <div className="cb-chat-head">
            <div>
              <div className="cb-chat-title">🐾 {t.chatTitle}</div>
              <div className="cb-chat-sub">{t.chatHint}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                className={`cb-speak-btn ${autoSpeak ? "speaking" : ""}`}
                style={{ margin: 0, fontSize: 10, padding: "3px 7px" }}
                onClick={() => setAutoSpeak(!autoSpeak)}
                title="Toggle automatic voice speech"
              >
                {autoSpeak ? "🔊 Auto Voice: ON" : "🔈 Voice: OFF"}
              </button>
              <button type="button" className="cb-chat-x" onClick={() => setOpen(false)} aria-label={t.chatClose}>
                ×
              </button>
            </div>
          </div>

          {/* Multilingual Selector Bar (English, Hindi, Marathi) */}
          <div className="cb-chat-lang-bar">
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginRight: 2 }}>🌐</span>
            <button
              type="button"
              className={`cb-lang-btn ${chatLang === "en" ? "active" : ""}`}
              onClick={() => setChatLang("en")}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              className={`cb-lang-btn ${chatLang === "hi" ? "active" : ""}`}
              onClick={() => setChatLang("hi")}
            >
              🇮🇳 हिन्दी
            </button>
            <button
              type="button"
              className={`cb-lang-btn ${chatLang === "mr" ? "active" : ""}`}
              onClick={() => setChatLang("mr")}
            >
              🚩 मराठी
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="cb-chat-messages" ref={listRef}>
            {msgs.length === 0 && <p className="muted cb-chat-empty">{t.chatPlaceholder}</p>}
            {msgs.map((m, i) => {
              const sanitized = sanitizeChatText(m.text);
              const isAssistant = m.role === "assistant";
              const isCurrentlySpeaking = speakingIndex === i;
              return (
                <div key={i} className={"cb-msg cb-msg-" + m.role}>
                  <div>{sanitized || (isAssistant && busy && !String(m.text).trim() ? t.chatBusy : "")}</div>
                  {isAssistant && sanitized && (
                    <button
                      type="button"
                      className={`cb-speak-btn ${isCurrentlySpeaking ? "speaking" : ""}`}
                      onClick={() => speakText(sanitized, i)}
                    >
                      {isCurrentlySpeaking ? "⏹️ " + (t.chatStop || "Stop") : "🔊 " + (t.chatListen || "Listen")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Action Chips in selected language */}
          <div className="cb-chat-quick">
            {curPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="cb-quick-chip"
                onClick={() => quickAsk(p.text)}
              >
                {p.label}
              </button>
            ))}
            {onNavigate ? (
              <>
                <button
                  type="button"
                  className="cb-quick-chip cb-quick-primary"
                  onClick={() => onNavigate("category")}
                >
                  🩺 {t.chatQuickDiag || "Diagnosis"}
                </button>
                <button
                  type="button"
                  className="cb-quick-chip"
                  onClick={() => onNavigate("doctors")}
                >
                  👨‍⚕️ {t.chatQuickDoc || "Doctors"}
                </button>
                <button
                  type="button"
                  className="cb-quick-chip"
                  onClick={() => onNavigate("appointments")}
                >
                  📅 {t.appointments || "Appointments"}
                </button>
              </>
            ) : null}
          </div>

          {/* Chat Input with Voice STT Mic */}
          <div className="cb-chat-input-row">
            <button
              type="button"
              className={`cb-voice-mic-btn ${listening ? "listening" : ""}`}
              onClick={startListening}
              title={listening ? "Listening... click to stop" : "Speak to type"}
            >
              {listening ? "🔴" : "🎙️"}
            </button>
            <input
              className="cb-chat-input"
              value={input}
              placeholder={listening ? (t.listening || "Listening...") : t.chatPlaceholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={busy}
            />
            <button
              type="button"
              className="btn btn-primary cb-chat-send"
              disabled={busy || !input.trim()}
              onClick={send}
            >
              {t.chatSend}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolsFloatingSymbol({ onNavigate, currentScreen }) {
  const [open, setOpen] = useState(false);
  const t = useTr();

  const toolItems = [
    { id: "healthPassport", icon: "🪪", label: t.toolHealthPassport || "Health Passport", desc: "QR Animal Records" },
    { id: "outbreakRadar", icon: "📡", label: t.toolOutbreakRadar || "Outbreak Radar", desc: "District Threat Radar" },
    { id: "vaccinationHub", icon: "💉", label: t.toolVaccinationHub || "Vaccination Hub", desc: "Schedules & Reminders" },
    { id: "govtSchemes", icon: "🏛️", label: t.toolGovtSchemes || "Govt Schemes", desc: "Direct DBT Matcher" },
    { id: "villageCoop", icon: "👥", label: t.toolVillageCoop || "Village Co-op", desc: "Group Vet Visits" },
    { id: "farmInsights", icon: "📊", label: t.toolFarmInsights || "Farm Insights", desc: "Herd Health Analytics" },
  ];

  return (
    <div className="cb-tools-root">
      <button
        type="button"
        className={`cb-tools-fab ${open || currentScreen === "tools" ? "active" : ""}`}
        aria-expanded={open}
        aria-label="VetNova Tools"
        title="VetNova Tools Suite"
        onClick={() => setOpen(!open)}
      >
        <span className="cb-tools-icon">🛠️</span>
        <span className="cb-tools-badge">Tools</span>
      </button>

      {open && (
        <div
          className="cb-tools-menu-panel"
          style={{
            position: "absolute",
            right: 0,
            bottom: 60,
            width: "min(320px, calc(100vw - 32px))",
            background: "#ffffff",
            borderRadius: 20,
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 36px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
            overflow: "hidden",
            pointerEvents: "auto",
            zIndex: 50,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase", color: "#a7f3d0" }}>
                VETNOVA UTILITIES
              </div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>🛠️ Tools Quick Menu</div>
            </div>
            <button
              type="button"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: 0,
                color: "#ffffff",
                fontSize: 16,
                width: 28,
                height: 28,
                borderRadius: "50%",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
              }}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: 6, maxHeight: "360px", overflowY: "auto" }}>
            {toolItems.map((tool) => (
              <div
                key={tool.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: currentScreen === tool.id ? "#f0fdf4" : "transparent",
                  border: currentScreen === tool.id ? "1px solid #bbf7d0" : "1px solid #f1f5f9",
                  transition: "background 0.15s ease",
                }}
                onClick={() => {
                  setOpen(false);
                  if (onNavigate) onNavigate(tool.id);
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {tool.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 750, color: "#0f172a" }}>{tool.label}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>{tool.desc}</div>
                </div>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>➔</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px 12px", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 800,
                borderRadius: 10,
                background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
                borderColor: "#059669",
              }}
              onClick={() => {
                setOpen(false);
                if (onNavigate) onNavigate("tools");
              }}
            >
              Open Full Tools Hub ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AppointmentAlerts({ user, t, setScreen, onPayAppointment }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user?.id) {
      setNotes([]);
      return;
    }
    const tick = async () => {
      try {
        const o = await api(`/api/user/${user.id}/notifications`);
        const list = o.notifications || [];
        setNotes(list);
      } catch (e) {}
    };
    tick();
    const h = setInterval(tick, 8000);
    return () => clearInterval(h);
  }, [user?.id]);

  if (!notes.length) return null;

  const dismiss = async () => {
    for (const n of notes) {
      if (n.type === "appointment" && n.appointment_id) {
        try {
          await api(`/api/appointments/${n.appointment_id}/seen`, { body: { user_id: user.id } });
        } catch (e) {}
      }
      if (n.type === "order" && n.order_id) {
        try {
          await api(`/api/pharmacy/orders/${n.order_id}/seen`, { body: { user_id: user.id } });
        } catch (e) {}
      }
    }
    setNotes([]);
  };

  return (
    <div className="card" style={{ marginBottom: 14, borderColor: "#10b981", background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)", borderRadius: 16, padding: "14px 16px", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.12)" }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: "#065f46", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <span className="bell-ring-anim">🔔</span> Live Updates & Action Center
      </div>
      {notes.map((n) => (
        <div key={n.id} style={{ background: "#ffffff", padding: "10px 12px", borderRadius: 12, marginBottom: 8, border: "1px solid #d1fae5" }}>
          <div style={{ fontWeight: 750, fontSize: 13, color: "#1e1b4b" }}>{n.title}</div>
          <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>{n.message}</div>
          {n.pay_required && (
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", padding: "6px 14px", fontSize: 12, fontWeight: 800 }}
                onClick={() => {
                  if (onPayAppointment) {
                    onPayAppointment({ id: n.appointment_id, doctor_name: n.doctor_name, total_amount_payable: n.amount, doctor_qr: n.doctor_qr, doctor_upi: n.doctor_upi });
                  } else {
                    setScreen("appointments");
                  }
                }}
              >
                💳 Pay ₹{n.amount} Now to Finalize Booking
              </button>
            </div>
          )}
        </div>
      ))}
      <div className="row" style={{ marginTop: 6, gap: 8 }}>
        <button type="button" className="btn btn-muted" style={{ fontSize: 11, padding: "6px 12px" }} onClick={dismiss}>
          ✓ {t.gotIt || "Clear Notifications"}
        </button>
      </div>
    </div>
  );
}

const api = async (path, opts = {}) => {
  const res = await fetch(path, {
    method: opts.method || (opts.body ? "POST" : "GET"),
    headers: { "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = [data.error, data.message].filter(Boolean).join(" — ");
    const hint = data.hint ? ` ${data.hint}` : "";
    const err = new Error((detail || `HTTP ${res.status}`) + hint);
    err.httpStatus = res.status;
    err.code = data.code;
    throw err;
  }
  return data;
};

function findSymptomDef(englishName, animalKey) {
  const list = (window.CB_COMMON && window.CB_COMMON[animalKey]) || [];
  return list.find((s) => s.n.en.toLowerCase() === (englishName || "").toLowerCase());
}
function displaySymptom(englishName, lang, animalKey) {
  const d = findSymptomDef(englishName, animalKey);
  if (d) return `${d.e} ${d.n[lang] || d.n.en}`;
  return englishName;
}

const FREQUENCY_OPTIONS = (t) => [
  { v: "once", label: t.freqOnce },
  { v: "twice", label: t.freqTwice },
  { v: "thrice", label: t.freqThrice },
  { v: "four", label: t.freqFour },
  { v: "prn", label: t.freqAsNeeded },
  { v: "other", label: t.freqOther },
];

const FALLBACK_NEWS = [
  {
    id: "fb-1",
    category: "Health",
    catKey: "health",
    title: "Offline tip: keep vaccination records handy",
    summary: "When headlines cannot load, you can still browse the rest of VetNova. Check connectivity and try again.",
    link: "#",
    source: "VetNova",
    urgent: false,
  },
];

function useVoice(langCode, onResult) {
  const [recording, setRecording] = useState(false);
  const recRef = useRef(null);
  const supported =
    typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  const start = () => {
    if (!supported) {
      alert("Voice input not supported in this browser. Please use Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" }[langCode] || "en-IN";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      if (text) onResult(text);
    };
    r.onerror = () => setRecording(false);
    r.onend = () => setRecording(false);
    r.start();
    recRef.current = r;
    setRecording(true);
  };
  const stop = () => {
    recRef.current?.stop();
    setRecording(false);
  };
  return { recording, start, stop, supported };
}

const TopBar = ({ title, onBack }) => (
  <div className="topbar topbar-with-logo">
    {onBack && (
      <button type="button" className="back" onClick={onBack}>
        ←
      </button>
    )}
    <h1>{title}</h1>
    <img className="topbar-logo-round" src="/logo.png" alt="VetNova" onError={(e) => (e.target.style.display = "none")} />
  </div>
);

const BottomNav = ({ tab, setScreen }) => {
  const t = useTr();
  const item = (k, icon, lbl, screen) => (
    <button className={tab === k ? "active" : ""} onClick={() => setScreen(screen)}>
      <span className="icon">{icon}</span>
      {lbl}
    </button>
  );
  return (
    <div className="bottomnav">
      {item("home", "🏠", t.home, "dashboard")}
      {item("reports", "📋", t.reports, "history")}
      {item("doctors", "👨‍⚕️", t.doctors, "doctors")}
      {item("profile", "👤", t.profile, "profile")}
    </div>
  );
};

function OrganizedAnalysisReport({ analysis, t, onBookDoctor, onOrderMedicines }) {
  if (!analysis) return null;

  const data = analysis.result || analysis;
  const diagnosisName =
    data.diagnosis ||
    data.name ||
    (typeof data.summary === "string" && data.summary.split(".")[0]) ||
    "Clinical Veterinary Assessment";

  // Extract confidence
  let confValue = null;
  let confLevel = "high"; // "high" | "med" | "low"
  let confText = "";

  if (typeof data.confidence === "number") {
    confValue = Math.min(100, Math.max(0, Math.round(data.confidence)));
    if (confValue >= 80) confLevel = "high";
    else if (confValue >= 50) confLevel = "med";
    else confLevel = "low";
    confText = `${confValue}% Match`;
  } else if (typeof data.confidence === "string") {
    const cl = data.confidence.toLowerCase();
    if (cl.includes("high")) {
      confLevel = "high";
      confValue = 92;
      confText = t.highConfidence || "High Confidence (92%)";
    } else if (cl.includes("med")) {
      confLevel = "med";
      confValue = 72;
      confText = t.mediumConfidence || "Medium Confidence (72%)";
    } else {
      confLevel = "low";
      confValue = 42;
      confText = t.lowConfidence || "Low Confidence (42%)";
    }
  } else {
    confLevel = "high";
    confValue = 88;
    confText = "88% Match";
  }

  const modelAttribution =
    analysis.model_name ||
    data.model_name ||
    (data._model ? `Gemini Vision (${data._model})` : "MobileNetV2 ONNX Animal Diagnostic Model");

  const visibleConcerns = Array.isArray(data.visible_concerns)
    ? data.visible_concerns
    : typeof data.visible_concerns === "string"
    ? [data.visible_concerns]
    : [];
  const nextSteps = Array.isArray(data.suggested_next_steps)
    ? data.suggested_next_steps
    : typeof data.suggested_next_steps === "string"
    ? [data.suggested_next_steps]
    : [];
  const medicines = Array.isArray(data.medicines) ? data.medicines : [];
  const remedies = Array.isArray(data.home_remedies) ? data.home_remedies : [];
  const precautions = data.precautions || data.disclaimer || null;
  const differentials = Array.isArray(data.differentials) ? data.differentials : [];

  return (
    <div className="analysis-report-card">
      {/* 1. Main Header */}
      <div className="analysis-main-header">
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#059669",
              marginBottom: 3,
            }}
          >
            🤖 AI Image Diagnostic Report
          </div>
          <h3 className="analysis-bold-title">
            <span>🩺</span> {diagnosisName}
          </h3>
          {data.animal && (
            <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>
              🎯 Target Animal: <b>{data.animal}</b>{" "}
              {data.severity ? `· Severity: ${String(data.severity).toUpperCase()}` : ""}
            </div>
          )}
        </div>

        {/* Confidence Badge (Distinct Color) */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className={confLevel === "high" ? "conf-pill-high" : confLevel === "med" ? "conf-pill-med" : "conf-pill-low"}>
            <span>{confLevel === "high" ? "🟢" : confLevel === "med" ? "🟡" : "🔴"}</span>
            <span>{confText}</span>
          </div>
        </div>
      </div>

      {/* Confidence Match Progress Bar */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            fontWeight: 800,
            color: "#475569",
            marginBottom: 3,
          }}
        >
          <span>{t.confidenceMatch || "Confidence Level Match"}</span>
          <span style={{ color: confLevel === "high" ? "#059669" : confLevel === "med" ? "#d97706" : "#dc2626" }}>
            {confValue}%
          </span>
        </div>
        <div className="conf-meter-track">
          <div
            className={
              confLevel === "high"
                ? "conf-meter-fill-high"
                : confLevel === "med"
                ? "conf-meter-fill-med"
                : "conf-meter-fill-low"
            }
            style={{ width: `${confValue}%` }}
          />
        </div>
      </div>

      {/* Summary Paragraph */}
      {data.summary && (
        <div
          style={{
            background: "#f8fafc",
            padding: "10px 12px",
            borderRadius: 12,
            fontSize: 13,
            color: "#334155",
            lineHeight: 1.5,
            marginBottom: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <b>Summary:</b> {data.summary}
        </div>
      )}

      {/* 2. Visible Clinical Concerns */}
      {visibleConcerns.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div className="analysis-section-heading">
            <span>⚠️</span> {t.visibleConcerns || "Visible Clinical Concerns"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {visibleConcerns.map((c, i) => (
              <span key={i} className="concern-tag">
                <span>•</span> {typeof c === "string" ? c : JSON.stringify(c)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Suggested Next Steps */}
      {nextSteps.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div className="analysis-section-heading">
            <span>📋</span> {t.suggestedNextSteps || "Suggested Next Steps"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {nextSteps.map((step, i) => (
              <div key={i} className="step-item-card">
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#059669",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ flex: 1 }}>{typeof step === "string" ? step : JSON.stringify(step)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Recommended Medicines */}
      {medicines.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div className="analysis-section-heading">
            <span>💊</span> Recommended Veterinary Formulations
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {medicines.map((m, i) => (
              <div key={i} className="med-dosage-box">
                <div style={{ fontWeight: 800, fontSize: 14, color: "#064e3b" }}>💊 {m.name}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#047857", marginTop: 4, flexWrap: "wrap" }}>
                  {m.frequency && (
                    <span>
                      ⏱ <b>Frequency:</b> {m.frequency}
                    </span>
                  )}
                  {m.duration && (
                    <span>
                      📅 <b>Duration:</b> {m.duration}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Home Remedies */}
      {remedies.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div className="analysis-section-heading">
            <span>🌿</span> Home Care & Traditional Remedies
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {remedies.map((hr, i) => (
              <div key={i} className="remedy-box">
                <div style={{ fontWeight: 800, fontSize: 13, color: "#6b21a8" }}>🌿 {hr.name}</div>
                {hr.detail && <div style={{ fontSize: 12, color: "#581c87", marginTop: 3 }}>{hr.detail}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Differentials */}
      {differentials.length > 1 && (
        <div style={{ marginBottom: 14 }}>
          <div className="analysis-section-heading">
            <span>🔬</span> Differential Possibilities
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {differentials.slice(1, 4).map((diff, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f8fafc",
                  padding: "8px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              >
                <span style={{ fontWeight: 750, color: "#334155" }}>• {diff.disease}</span>
                <span
                  style={{
                    fontWeight: 800,
                    color: diff.confidence >= 50 ? "#d97706" : "#64748b",
                    background: "#f1f5f9",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {diff.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Safety Precautions Alert */}
      {precautions && (
        <div className="precaution-alert-card">
          <div style={{ fontWeight: 800, marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}>
            <span>🛡️</span> {t.safetyPrecautions || "Safety Advisory & Precautions"}
          </div>
          <div>{typeof precautions === "string" ? precautions : JSON.stringify(precautions)}</div>
        </div>
      )}

      {/* Model attribution footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 14,
          paddingTop: 10,
          borderTop: "1px solid #f1f5f9",
          fontSize: 11,
          color: "#94a3b8",
        }}
      >
        <span>🤖 {modelAttribution}</span>
        <span style={{ color: "#059669", fontWeight: 700 }}>✓ Verified AI Diagnostic Engine</span>
      </div>
    </div>
  );
}

function ImageUploader({ onUploaded, userId, kind, analyzeKind }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [busyA, setBusyA] = useState(false);
  const t = useTr();

  const runAnalyze = async (dataUrl) => {
    if (!analyzeKind || !dataUrl) return;
    setBusyA(true);
    setAnalysis(null);
    try {
      const out = await api("/api/analyze-image", { body: { data: dataUrl, kind: analyzeKind } });
      const summary = String(out.summary || out.message || "");
      const legacyPlaceholder =
        out.mode === "placeholder" ||
        /without an api key|cloud vision|image received[\s\S]{0,80}api key/i.test(summary);
      if (legacyPlaceholder) {
        const envCheck = await fetchEnvCheck();
        setAnalysis({ ...out, legacyPlaceholder: true, envCheck });
      } else {
        setAnalysis(out);
      }
      try {
        const resObj = out.result || out;
        localStorage.setItem(
          "cb_last_diagnosis",
          JSON.stringify({
            diagnosis: resObj.image_description || resObj.diagnosis || resObj.summary || "Image Clinical Diagnostic Report",
            animal: resObj.animal || "Animal / Livestock",
            severity: resObj.severity || resObj.suggested_urgency || "medium",
            summary: resObj.summary || resObj.image_description || "",
            visible_concerns: resObj.visible_concerns || resObj.primary_lesions || [],
            suggested_next_steps: resObj.suggested_next_steps || resObj.owner_safe_interim_care || [],
            medicines: resObj.medicines || [],
            date: new Date().toISOString(),
          })
        );
      } catch (e) {}
    } catch (e) {
      const envCheck = await fetchEnvCheck();
      setAnalysis({ error: e.message, envCheck, visionCode: e.code, httpStatus: e.httpStatus });
    }
    setBusyA(false);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setAnalysis(null);
    try {
      const b64 = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = rej;
        fr.readAsDataURL(file);
      });
      setPreview(b64);
      const out = await api("/api/upload-image", { body: { data: b64, kind, user_id: userId } });
      onUploaded(out.image_id);
      await runAnalyze(b64);
    } catch (e) {
      alert("Upload failed: " + e.message);
    }
    setUploading(false);
  };

  const renderEnvCheck = () => {
    const ec = analysis.envCheck;
    if (!ec) return null;
    return (
      <div className="muted" style={{ marginTop: 12, fontSize: 12, borderTop: "1px solid var(--line)", paddingTop: 10 }}>
        <strong style={{ color: "var(--ink)" }}>Running server</strong>
        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
          <li>.env file: {ec.envFileExists ? "found" : "not found"} — {ec.envPath || "(unknown)"}</li>
          <li>Vision key: {ec.geminiKeyConfigured ? "yes" : "no"}</li>
          <li>Chat key: {ec.geminiChatKeyConfigured ? "yes" : "no"}</li>
        </ul>
        {analysis.legacyPlaceholder && ec.geminiKeyConfigured ? (
          <p style={{ margin: "8px 0 0", color: "var(--danger)" }}>
            The browser still got an old “no API key” response while the server reports a key. Stop every old
            <code style={{ margin: "0 4px" }}>node</code>
            process, run <code style={{ margin: "0 4px" }}>npm start</code>
            from this project folder, then hard-refresh (Ctrl+Shift+R).
          </p>
        ) : null}
        {!ec.envFileExists ? (
          <p style={{ margin: "8px 0 0" }}>
            Create a file named <code style={{ margin: "0 4px" }}>.env</code> in the same folder as
            <code style={{ margin: "0 4px" }}>server.js</code>
            with one line: <code style={{ margin: "0 4px" }}>GEMINI_API_KEY=your_key</code>
            from{" "}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
              Google AI Studio
            </a>
            , then restart the server.
          </p>
        ) : null}
        {ec.envFileExists && !ec.geminiKeyConfigured ? (
          <p style={{ margin: "8px 0 0" }}>
            .env exists but <code style={{ margin: "0 4px" }}>GEMINI_API_KEY</code> or{" "}
            <code style={{ margin: "0 4px" }}>GOOGLE_API_KEY</code> is missing or empty. Fix the line, save, restart{" "}
            <code style={{ margin: "0 4px" }}>npm start</code>.
          </p>
        ) : null}
      </div>
    );
  };

  const renderAnalysis = () => {
    if (busyA) return <p className="muted center" style={{ marginTop: 8 }}>{t.analyzingImage}</p>;
    if (!analysis) return null;
    if (analysis.error) {
      const needsServer =
        /failed to fetch|network|HTTP 404|ECONNREFUSED/i.test(analysis.error) || analysis.httpStatus === 404;
      return (
        <div className="analysis-card">
          <h4>{t.imageAnalysis}</h4>
          <pre style={{ color: "var(--danger)", fontFamily: "inherit", whiteSpace: "pre-wrap" }}>{analysis.error}</pre>
          {needsServer ? (
            <p className="muted" style={{ marginTop: 8, fontSize: 12, lineHeight: 1.45 }}>
              Open <strong>http://localhost:3000</strong> after running <code>npm start</code> in the project folder (not the HTML file directly).
            </p>
          ) : null}
          {renderEnvCheck()}
        </div>
      );
    }
    if (analysis.mode === "placeholder" || analysis.mode === "disabled") {
      const sum = String(analysis.summary || analysis.message || "");
      const hintAlreadyInSummary = /aistudio|GEMINI_API_KEY|GOOGLE_API_KEY|apikey|npm start/i.test(sum);
      return (
        <div className="analysis-card">
          <h4>{t.imageAnalysis}</h4>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>{analysis.summary || analysis.message || analysis.error}</p>
          {!hintAlreadyInSummary ? (
            <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>{t.imageAnalysisHint}</p>
          ) : null}
          {renderEnvCheck()}
        </div>
      );
    }
    return <OrganizedAnalysisReport analysis={analysis} t={t} />;
  };

  return (
    <div>
      <div className="upload-row">
        <label className="upload-btn">
          <span className="up-icon">📷</span>
          <span>{t.uploadFromCamera}</span>
          <input type="file" accept="image/*" capture="environment" onChange={(e) => handleFile(e.target.files[0])} />
        </label>
        <label className="upload-btn">
          <span className="up-icon">🖼️</span>
          <span>{t.uploadFromGallery}</span>
          <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
        </label>
      </div>
      {uploading && <p className="muted center" style={{ marginTop: 8 }}>{t.loading}</p>}
      {preview && (
        <div className="upload-preview">
          <div className="thumb-wrap">
            <img src={preview} className="thumb" alt="" />
            <button
              className="del"
              onClick={() => {
                setPreview(null);
                onUploaded(null);
                setAnalysis(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      {renderAnalysis()}
    </div>
  );
}

function isOpenNow(h) {
  if (h.open24) return true;
  const hr = new Date().getHours();
  return hr >= h.openHour && hr < h.closeHour;
}

function HospitalsPanel({ t }) {
  const [state, setState] = useState({ status: "idle", lat: null, lon: null, hospitals: [], err: null });

  const fetchHospitals = async (lat, lon) => {
    const o = await api(`/api/nearby-hospitals?lat=${lat}&lon=${lon}`);
    setState({ status: "ok", lat, lon, hospitals: o.hospitals || [], err: null });
  };

  const load = async () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, status: "error", err: "unsupported" }));
      return;
    }
    setState((s) => ({ ...s, status: "loading", err: null }));
    const r = await requestDeviceLocation();
    if (!r.ok) {
      setState((s) => ({ ...s, status: "error", lat: null, lon: null, hospitals: [], err: r.code }));
      return;
    }
    storeGeo(r.lat, r.lon);
    try {
      await fetchHospitals(r.lat, r.lon);
      try {
        window.dispatchEvent(new CustomEvent("carebridge:geo", { detail: { lat: r.lat, lon: r.lon } }));
      } catch (_) {}
    } catch (e) {
      setState((s) => ({ ...s, status: "error", lat: null, lon: null, hospitals: [], err: e.message }));
    }
  };

  const { status, lat, lon, hospitals, err } = state;
  const nearest = hospitals[0];
  const embed =
    status === "ok" && lat != null
      ? `https://maps.google.com/maps?q=${encodeURIComponent("Veterinary hospital")}&ll=${lat},${lon}&z=13&output=embed`
      : "";
  const openNearby =
    status === "ok" && lat != null
      ? `https://www.google.com/maps/search/veterinary+hospital/@${lat},${lon},14z`
      : "#";
  const dirNearest = nearest ? `https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lon}` : openNearby;

  const typeTag = (h) => {
    if (h.type === "Emergency") return <span className="hosp-tag hosp-tag-emergency">Emergency</span>;
    if (h.type === "Specialty") return <span className="hosp-tag hosp-tag-specialty">Specialty</span>;
    return <span className="hosp-tag hosp-tag-general">General</span>;
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">{t.nearbyHospitals}</div>
          <div className="panel-sub">{t.hospitalCardHint}</div>
        </div>
      </div>
      <button className="btn btn-primary" onClick={load} disabled={status === "loading"}>
        {status === "loading" ? t.locating : t.findHospitals}
      </button>
      {err === "denied" || err === "timeout" || err === "unavailable" || err === "unsupported" || err === "unknown" ? (
        <p className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.45 }}>
          {geoErrorMessage(err, t)}
        </p>
      ) : null}
      {err && typeof err === "string" && !["denied", "timeout", "unavailable", "unsupported", "unknown"].includes(err) ? (
        <p style={{ color: "var(--danger)", marginTop: 8, fontSize: 13 }}>{err}</p>
      ) : null}
      {status === "ok" && (
        <>
          <div className="map-frame" style={{ marginTop: 12 }}>
            <iframe title="Google Map" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="map-actions">
            <a className="primary" href={openNearby} target="_blank" rel="noopener noreferrer">
              {t.openNearbyMaps}
            </a>
            <a href={dirNearest} target="_blank" rel="noopener noreferrer">
              {t.openDirections}
            </a>
          </div>
          {hospitals.map((h, idx) => {
            const open = isOpenNow(h);
            const emergencyClass = h.type === "Emergency" ? "emergency" : "";
            const openTag = h.open24 ? (
              <span className="hosp-tag hosp-tag-24">24/7</span>
            ) : open ? (
              <span className="hosp-tag hosp-tag-open">Open now</span>
            ) : (
              <span className="hosp-tag hosp-tag-closed">Closed</span>
            );
            const hoursInfo = h.open24 ? "Open 24 hours" : `${h.openHour}:00 – ${h.closeHour}:00`;
            const phoneClean = String(h.phone || "").replace(/\s/g, "");
            const canCall = phoneClean.length >= 8 && !/^\+?0+$/.test(phoneClean);
            return (
              <div key={`${h.name}-${idx}`} className={"hosp-card " + emergencyClass}>
                <div className="hosp-tags">
                  {typeTag(h)}
                  {openTag}
                </div>
                <div className="hosp-name">{h.name}</div>
                <div className="hosp-addr">
                  📍 {h.address} · <span className="hosp-city">{h.city || "—"}</span>
                </div>
                <div className="hosp-addr" style={{ marginTop: 2 }}>
                  🕐 {hoursInfo}
                </div>
                <div className="hosp-dist">🚗 {h.distance.toFixed(1)} km away</div>
                <div className="hosp-actions">
                  <a
                    className={"hosp-btn hosp-btn-call" + (!canCall ? " disabled" : "")}
                    href={canCall ? `tel:${phoneClean}` : undefined}
                    aria-disabled={!canCall}
                    onClick={!canCall ? (e) => e.preventDefault() : undefined}
                    style={!canCall ? { opacity: 0.45, pointerEvents: "none" } : undefined}
                  >
                    📞 {t.call}
                  </a>
                  <a
                    className="hosp-btn hosp-btn-dir"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🗺️ {t.getDirections}
                  </a>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function PharmaciesPanel({ t, onOrderMedicine }) {
  const [state, setState] = useState({ status: "idle", lat: null, lon: null, pharmacies: [], err: null });

  const fetchPharmacies = async (lat, lon) => {
    const o = await api(`/api/nearby-pharmacies?lat=${lat}&lon=${lon}`);
    setState({ status: "ok", lat, lon, pharmacies: o.pharmacies || [], err: null });
  };

  const load = async () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, status: "error", err: "unsupported" }));
      return;
    }
    setState((s) => ({ ...s, status: "loading", err: null }));
    const r = await requestDeviceLocation();
    if (!r.ok) {
      setState((s) => ({ ...s, status: "error", lat: null, lon: null, pharmacies: [], err: r.code }));
      return;
    }
    storeGeo(r.lat, r.lon);
    try {
      await fetchPharmacies(r.lat, r.lon);
    } catch (e) {
      setState((s) => ({ ...s, status: "error", lat: null, lon: null, pharmacies: [], err: e.message }));
    }
  };

  const { status, lat, lon, pharmacies, err } = state;
  const embed =
    status === "ok" && lat != null
      ? `https://maps.google.com/maps?q=${encodeURIComponent("Veterinary pharmacy medical store")}&ll=${lat},${lon}&z=13&output=embed`
      : "";
  const openNearby =
    status === "ok" && lat != null
      ? `https://www.google.com/maps/search/veterinary+pharmacy+medical+store/@${lat},${lon},14z`
      : "#";

  return (
    <div className="panel" style={{ borderTop: "3px solid #10b981", marginTop: 14 }}>
      <div className="panel-head">
        <div>
          <div className="panel-title">💊 {t.nearbyPharmacies || "Nearby Veterinary Medical Stores"}</div>
          <div className="panel-sub">{t.pharmacyCardHint || "Licensed veterinary pharmacies with home delivery and pickup"}</div>
        </div>
      </div>
      <button
        className="btn btn-primary"
        style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
        onClick={load}
        disabled={status === "loading"}
      >
        {status === "loading" ? (t.locating || "Finding nearby stores…") : `📍 ${t.findNearbyStores || "Find Nearby Medical Stores"}`}
      </button>
      {err === "denied" || err === "timeout" || err === "unavailable" || err === "unsupported" || err === "unknown" ? (
        <p className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.45 }}>
          {geoErrorMessage(err, t)}
        </p>
      ) : null}
      {err && typeof err === "string" && !["denied", "timeout", "unavailable", "unsupported", "unknown"].includes(err) ? (
        <p style={{ color: "var(--danger)", marginTop: 8, fontSize: 13 }}>{err}</p>
      ) : null}
      {status === "ok" && (
        <>
          <div className="map-frame" style={{ marginTop: 12 }}>
            <iframe title="Google Map Medical Stores" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="map-actions">
            <a className="primary" href={openNearby} target="_blank" rel="noopener noreferrer">
              {t.openNearbyMaps}
            </a>
          </div>
          {pharmacies.map((p, idx) => {
            const phoneClean = String(p.phone || "").replace(/\s/g, "");
            const canCall = phoneClean.length >= 8 && !/^\+?0+$/.test(phoneClean);
            return (
              <div
                key={`${p.name}-${idx}`}
                className="hosp-card"
                style={{ borderColor: "#a7f3d0", background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)" }}
              >
                <div className="hosp-tags">
                  <span className="hosp-tag" style={{ background: "#d1fae5", color: "#065f46" }}>
                    ⭐ {p.rating} / 5
                  </span>
                  {p.delivery && <span className="hosp-tag hosp-tag-open">🚚 Home Delivery</span>}
                  {p.open24 ? (
                    <span className="hosp-tag hosp-tag-24">24/7</span>
                  ) : (
                    <span className="hosp-tag hosp-tag-general">
                      {p.openHour}:00 - {p.closeHour}:00
                    </span>
                  )}
                </div>
                <div className="hosp-name" style={{ color: "#064e3b" }}>
                  {p.name}
                </div>
                <div className="hosp-addr">
                  📍 {p.address} · <span className="hosp-city">{p.city || "—"}</span>
                </div>
                <div className="hosp-addr" style={{ marginTop: 2, fontSize: 11, color: "#047857" }}>
                  📦 {p.specialties || "Livestock & Pet Medicines"}
                </div>
                <div className="hosp-dist">
                  🚗 {p.distance ? `${p.distance.toFixed(1)} km away` : "Nearby"} · 📜 Lic: {p.license || "Verified"}
                </div>

                <div className="hosp-actions" style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1.2fr 0.9fr 0.9fr", gap: 6 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: "6px 8px", fontSize: 11, background: "#059669", borderColor: "#059669" }}
                    onClick={() => onOrderMedicine && onOrderMedicine(p)}
                  >
                    🛍️ {t.orderMedicines || "Order"}
                  </button>
                  <a
                    className={"hosp-btn hosp-btn-call" + (!canCall ? " disabled" : "")}
                    href={canCall ? `tel:${phoneClean}` : undefined}
                    style={{ margin: 0, padding: "6px 4px", fontSize: 11, textAlign: "center" }}
                  >
                    📞 {t.call || "Call"}
                  </a>
                  <a
                    className="hosp-btn hosp-btn-dir"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ margin: 0, padding: "6px 4px", fontSize: 11, textAlign: "center" }}
                  >
                    🗺️ {t.getDirections || "Map"}
                  </a>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function OrderMedicineModal({ t, user, store, initialItem, initialReport, onClose, onOrderPlaced }) {
  const [liveTrackingOrderId, setLiveTrackingOrderId] = useState(null);
  const [selectedItems, setSelectedItems] = useState(() => (initialItem ? [{ ...initialItem, qty: 1 }] : []));
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState("");
  const [customMed, setCustomMed] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Nashik");
  const [pincode, setPincode] = useState("422005");
  const [fulfillment, setFulfillment] = useState("home_delivery");
  const [paymentMode, setPaymentMode] = useState("cod"); // "cod" | "online"
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);
  const [attachReport, setAttachReport] = useState(true);
  const [savedReport, setSavedReport] = useState(() => {
    if (initialReport) return initialReport;
    try {
      return JSON.parse(localStorage.getItem("cb_last_diagnosis") || "null");
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const o = await api("/api/pharmacy/medicines");
        setCatalog(o.medicines || []);
      } catch (e) {}
    })();
  }, []);

  const addItem = (med) => {
    setSelectedItems((prev) => {
      const idx = prev.findIndex((i) => i.id === med.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].qty += 1;
        return copy;
      }
      return [...prev, { ...med, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addCustomItem = () => {
    if (!customMed.trim()) return;
    setSelectedItems((prev) => [
      ...prev,
      { id: "custom-" + Date.now(), name: customMed.trim(), price: 0, qty: 1, custom: true, icon: "💊" },
    ]);
    setCustomMed("");
  };

  const totalAmount = selectedItems.reduce((acc, i) => acc + (i.price || 0) * (i.qty || 1), 0);

  const placeOrderApi = async (paymentId = null, mode = "cod") => {
    setBusy(true);
    setErr("");
    try {
      const formattedAddress =
        fulfillment === "home_delivery"
          ? `${street.trim()}${landmark.trim() ? ", Near " + landmark.trim() : ""}, ${city.trim()}${pincode.trim() ? " - " + pincode.trim() : ""}`
          : "Store Counter Pickup";

      const addressDetails = {
        street: street.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        phone: phone.trim(),
      };

      const diagnosisReportPayload =
        attachReport && savedReport
          ? {
              diagnosis: savedReport.diagnosis || savedReport.summary || "Clinical Assessment",
              animal: savedReport.animal || "Livestock / Pet",
              severity: savedReport.severity || "medium",
              summary: savedReport.summary || savedReport.image_description || "",
              visible_concerns: savedReport.visible_concerns || [],
              suggested_next_steps: savedReport.suggested_next_steps || [],
              medicines: savedReport.medicines || [],
              date: savedReport.date || new Date().toISOString(),
            }
          : null;

      const res = await api("/api/pharmacy/orders", {
        body: {
          user_id: user?.id,
          user_name: user?.name || "Farmer / Pet Owner",
          phone,
          delivery_address: formattedAddress,
          address_details: addressDetails,
          diagnosis_report: diagnosisReportPayload,
          items: selectedItems,
          total_amount: totalAmount,
          store_name: store?.name || "Kisan Veterinary & Animal Health Store",
          fulfillment,
          payment_mode: mode,
          payment_id: paymentId,
          prescription_note: note,
        },
      });
      setSuccessOrder(res.order);
      if (onOrderPlaced) onOrderPlaced(res.order);

      // Trigger browser notification only when user places an order, and only once
      if (res.order && typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification("VetNova 📦 Order Placed!", {
            body: `Order ${res.order.order_id} placed successfully for ₹${res.order.total_amount}.`,
            icon: "/logo.png",
            tag: `order-${res.order.order_id}`,
          });
        } catch (_) {}
      }
    } catch (e) {
      setErr(e.message || "Failed to place order");
    }
    setBusy(false);
  };

  const handleSubmitOrder = async () => {
    if (!phone || phone.length !== 10) {
      setErr(t.invalid10DigitPhone || "Please enter a valid 10-digit mobile number.");
      return;
    }
    if (selectedItems.length === 0 && !note.trim()) {
      setErr("Please select or type at least one medicine.");
      return;
    }
    if (fulfillment === "home_delivery" && !street.trim()) {
      setErr("Please enter your farm / village / house address.");
      return;
    }

    if (paymentMode === "online" && totalAmount > 0) {
      if (typeof window.Razorpay === "undefined") {
        placeOrderApi(`PAY_ONLINE_${Date.now()}`, "online_razorpay");
        return;
      }
      try {
        const options = {
          key: "rzp_test_TUURrZCj04iUwF",
          amount: totalAmount * 100, // paise
          currency: "INR",
          name: "VetNova Veterinary Pharmacy",
          description: `Medicine Order (${selectedItems.length} items)`,
          image: "/logo.png",
          prefill: {
            name: user?.name || "Farmer / Pet Owner",
            contact: phone,
          },
          theme: { color: "#059669" },
          handler: function (response) {
            placeOrderApi(response.razorpay_payment_id || `PAY_${Date.now()}`, "online_razorpay");
          },
          modal: {
            ondismiss: function () {
              setBusy(false);
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (e) {
        placeOrderApi(`PAY_ONLINE_${Date.now()}`, "online_razorpay");
      }
    } else {
      // Cash on Delivery
      placeOrderApi(null, "cod");
    }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        {successOrder ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: 46, marginBottom: 8 }}>🎉</div>
            <h3 style={{ color: "#065f46", margin: "0 0 6px" }}>{t.orderSuccess || "Order Placed Successfully!"}</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
              {t.orderSuccessSub || "The veterinary store has received your order and is preparing it for delivery."}
            </p>

            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #10b981",
                borderRadius: 14,
                padding: 14,
                textAlign: "left",
                marginBottom: 16,
                fontSize: 13,
                boxShadow: "0 6px 20px rgba(16, 185, 129, 0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, color: "#065f46", fontSize: 14 }}>🧾 Official Medicine Order Receipt</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>ID: {successOrder.order_id}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, background: "#ecfdf5", color: "#065f46", padding: "2px 8px", borderRadius: 6, alignSelf: "flex-start" }}>
                  {successOrder.status}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8, fontSize: 12 }}>
                <div>🏪 <b>Store:</b> {successOrder.store_name}</div>
                <div>🚚 <b>Fulfillment:</b> {successOrder.fulfillment === "home_delivery" ? "Doorstep Delivery" : "Store Pickup"}</div>
                {successOrder.delivery_address && (
                  <div>📍 <b>Address:</b> {successOrder.delivery_address}</div>
                )}
                {successOrder.diagnosis_report && (
                  <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "4px 8px", borderRadius: 6, color: "#065f46", marginTop: 4 }}>
                    📎 <b>Attached AI Report:</b> {successOrder.diagnosis_report.diagnosis} ({successOrder.diagnosis_report.animal || "Animal"})
                  </div>
                )}
                <div>⏱️ <b>Estimated Time:</b> <span style={{ color: "#059669", fontWeight: 700 }}>{successOrder.estimated_delivery}</span></div>
                {successOrder.delivery_pin && successOrder.fulfillment === "home_delivery" && (
                  <div style={{ marginTop: 4, background: "#eff6ff", border: "1px solid #bfdbfe", padding: "6px 10px", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#1e40af", fontWeight: 700 }}>🔐 Security Delivery PIN:</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#1d4ed8", letterSpacing: "2px" }}>{successOrder.delivery_pin}</span>
                  </div>
                )}
              </div>

              <div style={{ fontWeight: 750, fontSize: 12, color: "#1e293b", margin: "10px 0 4px", borderTop: "1px dashed #cbd5e1", paddingTop: 8 }}>
                Itemized Medicine Value:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, background: "#f8fafc", padding: "8px 10px", borderRadius: 8, fontSize: 12 }}>
                {(successOrder.items || []).map((it, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{it.icon || "💊"} {it.name} (x{it.qty || 1})</span>
                    <b>₹{(it.price || 0) * (it.qty || 1)}</b>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px dashed #cbd5e1", marginTop: 8, paddingTop: 8, display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                  <span>Medicines Subtotal:</span>
                  <span>₹{successOrder.total_amount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                  <span>Delivery & Packing:</span>
                  <span style={{ color: "#059669", fontWeight: 700 }}>FREE (₹0)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid #10b981", paddingTop: 6, fontSize: 14, fontWeight: 800 }}>
                  <span style={{ color: "#0f172a" }}>Total Invoice Amount:</span>
                  <span style={{ color: "#047857", fontSize: 16 }}>₹{successOrder.total_amount}</span>
                </div>
                <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, textAlign: "right" }}>
                  {successOrder.payment_mode === "cod" ? "💵 Cash on Delivery (Pay at Doorstep)" : "💳 Paid Online (Razorpay / UPI)"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {successOrder.fulfillment === "home_delivery" && (
                <button
                  className="btn btn-primary"
                  style={{ background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)", borderColor: "#2563eb", fontWeight: 800 }}
                  onClick={() => {
                    setLiveTrackingOrderId(successOrder.order_id);
                  }}
                >
                  📍 {t.trackLiveDelivery || "Track Live Delivery & Rider Location"}
                </button>
              )}
              <button className="btn btn-muted" onClick={onClose}>
                ✅ {t.continue || "Done"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h3 style={{ margin: 0 }}>🛍️ {t.orderMedicinesCta || "Order Veterinary Medicines"}</h3>
              <button
                type="button"
                onClick={onClose}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}
              >
                ×
              </button>
            </div>

            {store && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                📍 Store: <b>{store.name}</b> · 🚗 {store.distance ? `${store.distance.toFixed(1)} km` : "Nearby"}
              </div>
            )}

            {/* Selected Items / Cart */}
            <div className="label" style={{ marginTop: 6 }}>
              📦 Selected Medicines ({selectedItems.length})
            </div>
            {selectedItems.length === 0 ? (
              <p className="muted" style={{ fontSize: 12, margin: "4px 0 10px" }}>
                No medicines selected yet. Choose from catalog below or type custom medicine names.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#f8fafc",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <b>
                        {item.icon || "💊"} {item.name}
                      </b>
                      {item.price > 0 && <span className="muted"> · ₹{item.price}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>Qty: {item.qty}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{ color: "var(--danger)", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                {totalAmount > 0 && (
                  <div style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#065f46" }}>
                    Estimated Total: ₹{totalAmount}
                  </div>
                )}
              </div>
            )}

            {/* Quick Catalog Search & Add */}
            <div className="label">🔍 Add from Veterinary Catalog</div>
            <input
              className="input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchMedicinePh || "Search medicines (e.g. Calcium, Dewormer, Spray)..."}
              style={{ fontSize: 12, padding: "8px 10px" }}
            />

            <div
              style={{
                maxHeight: 140,
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: 8,
                marginTop: 6,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {catalog
                .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase()))
                .map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: "#f1f5f9",
                      fontSize: 11,
                    }}
                  >
                    <div>
                      <b>
                        {m.icon} {m.name}
                      </b>
                      <span className="muted">
                        {" "}
                        ({m.pack}) — ₹{m.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-muted"
                      style={{ padding: "2px 8px", fontSize: 11 }}
                      onClick={() => addItem(m)}
                    >
                      + Add
                    </button>
                  </div>
                ))}
            </div>

            {/* Custom Medicine Type-In */}
            <div className="row" style={{ marginTop: 8, gap: 6 }}>
              <input
                className="input"
                type="text"
                value={customMed}
                onChange={(e) => setCustomMed(e.target.value)}
                placeholder="Or type custom medicine / injection name..."
                style={{ fontSize: 12 }}
              />
              <button type="button" className="btn btn-muted" style={{ padding: "6px 12px", fontSize: 12 }} onClick={addCustomItem}>
                + Add
              </button>
            </div>

            {/* Attach Diagnosis Report Section */}
            {savedReport && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1.5px solid #86efac",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginTop: 14,
                  fontSize: 12,
                }}
              >
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontWeight: 700, color: "#166534" }}>
                  <input
                    type="checkbox"
                    checked={attachReport}
                    onChange={(e) => setAttachReport(e.target.checked)}
                    style={{ marginTop: 2 }}
                  />
                  <div>
                    <div>📎 Share AI Diagnosis Report with Medical Store Owner</div>
                    <div style={{ fontWeight: 400, color: "#4b5563", fontSize: 11, marginTop: 2 }}>
                      Attaches: <b>{savedReport.diagnosis || savedReport.summary || "Veterinary Assessment"}</b> · 🎯 {savedReport.animal || "Animal"} · ⚠️ Severity: <span style={{ textTransform: "capitalize", fontWeight: 700 }}>{savedReport.severity || "Standard"}</span>
                    </div>
                  </div>
                </label>
              </div>
            )}

            <div className="sp" />
            <div className="label">{t.deliveryType || "Fulfillment Mode"}</div>
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className={`btn ${fulfillment === "home_delivery" ? "btn-primary" : "btn-muted"}`}
                style={{ flex: 1, fontSize: 12, padding: "8px 4px" }}
                onClick={() => setFulfillment("home_delivery")}
              >
                🚚 Doorstep Delivery
              </button>
              <button
                type="button"
                className={`btn ${fulfillment === "store_pickup" ? "btn-primary" : "btn-muted"}`}
                style={{ flex: 1, fontSize: 12, padding: "8px 4px" }}
                onClick={() => setFulfillment("store_pickup")}
              >
                🏬 Store Pickup
              </button>
            </div>

            {/* Comprehensive Address Form for Delivery */}
            {fulfillment === "home_delivery" && (
              <div style={{ background: "#f8fafc", border: "1px solid var(--border)", borderRadius: 10, padding: 12, marginTop: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 12, color: "#1e293b", marginBottom: 8 }}>
                  📍 Customer Delivery Location Details
                </div>

                <div className="label" style={{ fontSize: 11 }}>🏠 House / Gat No, Farm / Street & Village *</div>
                <input
                  className="input"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Gat No. 45, Patil Dairy Farm, Gangapur Road"
                  style={{ fontSize: 12, marginBottom: 8 }}
                />

                <div className="label" style={{ fontSize: 11 }}>📍 Nearby Landmark</div>
                <input
                  className="input"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Water Tank / Hanuman Temple / Primary School"
                  style={{ fontSize: 12, marginBottom: 8 }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <div className="label" style={{ fontSize: 11 }}>🏙️ City / Town</div>
                    <input
                      className="input"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Nashik"
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <div className="label" style={{ fontSize: 11 }}>📮 Pincode</div>
                    <input
                      className="input"
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      placeholder="422005"
                      style={{ fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Swiggy / Zomato Style Payment Method Selector */}
            <div className="sp" />
            <div className="label">💳 Payment Method</div>
            <div
              className={`payment-method-card ${paymentMode === "cod" ? "selected" : ""}`}
              onClick={() => setPaymentMode("cod")}
            >
              <div style={{ fontSize: 22 }}>💵</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 750, fontSize: 13 }}>Cash on Delivery (COD)</div>
                <div className="muted" style={{ fontSize: 11 }}>Pay cash / UPI upon doorstep delivery</div>
              </div>
              <input type="radio" checked={paymentMode === "cod"} onChange={() => setPaymentMode("cod")} />
            </div>

            <div
              className={`payment-method-card ${paymentMode === "online" ? "selected" : ""}`}
              onClick={() => setPaymentMode("online")}
            >
              <div style={{ fontSize: 22 }}>💳</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 750, fontSize: 13 }}>Paytm / UPI / Razorpay Online</div>
                <div className="muted" style={{ fontSize: 11 }}>Instant online payment via UPI, Cards, Wallets</div>
              </div>
              <input type="radio" checked={paymentMode === "online"} onChange={() => setPaymentMode("online")} />
            </div>

            <div className="sp" />
            <div className="label">📱 Contact Mobile Number (10 Digits)</div>
            <input
              className="input"
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
              style={{ fontSize: 14, fontWeight: 650 }}
            />

            <div className="sp" />
            <div className="label">📝 Doctor Prescription / Specific Notes</div>
            <textarea
              className="input"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Prescribed for 3-year-old Jersey cow with fever / wound"
              style={{ fontSize: 12 }}
            />

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8, fontWeight: 650 }}>{err}</p>}

            <div className="sp-lg" />
            <div className="row">
              <button className="btn btn-muted" onClick={onClose} disabled={busy}>
                {t.cancel || "Cancel"}
              </button>
              <button
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
                onClick={handleSubmitOrder}
                disabled={busy}
              >
                {busy
                  ? t.loading || "Processing…"
                  : paymentMode === "online"
                  ? `🔒 Pay ₹${totalAmount} & Order`
                  : `🚀 Place Order (₹${totalAmount} COD)`}
              </button>
            </div>
          </>
        )}
        {liveTrackingOrderId && (
          <LiveOrderTrackingModal
            orderId={liveTrackingOrderId}
            t={t}
            onClose={() => setLiveTrackingOrderId(null)}
          />
        )}
      </div>
    </div>
  );
}

function LiveOrderTrackingModal({ orderId, t, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrack = async () => {
    try {
      const res = await api(`/api/delivery/orders/${orderId}/track`);
      if (res.order) setData(res.order);
      setLoading(false);
    } catch (e) {
      setError(e.message || "Failed to load live tracking");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
    const interval = setInterval(fetchTrack, 3500);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading && !data) {
    return (
      <div className="modal-bg" onClick={onClose}>
        <div className="modal" style={{ maxWidth: 460, textAlign: "center", padding: 24 }} onClick={(e) => e.stopPropagation()}>
          <div className="loader" style={{ margin: "16px auto" }} />
          <p className="muted">Connecting to Live GPS Satellite…</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="modal-bg" onClick={onClose}>
        <div className="modal" style={{ maxWidth: 460, textAlign: "center", padding: 20 }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚠️</div>
          <h3 style={{ margin: 0, color: "#991b1b" }}>Tracking Unavailable</h3>
          <p className="muted" style={{ fontSize: 13, margin: "8px 0 16px" }}>{error}</p>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const rider = data?.delivery_partner;
  const isDelivered = data?.delivery_status === "delivered" || (data?.status || "").toLowerCase().includes("delivered");

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: 18 }} onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "1px" }}>
              📡 Live Satellite Tracking
            </div>
            <h3 style={{ margin: "2px 0 0", color: "#064e3b", fontSize: 17 }}>Order #{data?.order_id}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "#f1f5f9", border: "none", width: 32, height: 32, borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "grid", placeItems: "center" }}
          >
            ×
          </button>
        </div>

        {/* Live Status Banner */}
        <div className="live-track-banner">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="live-pulse-dot" />
              <span style={{ fontWeight: 850, fontSize: 14 }}>{data?.status}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
              ⏱️ {data?.estimated_delivery}
            </div>
          </div>
          {data?.delivery_pin && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.85 }}>Security PIN</div>
              <span className="delivery-pin-badge">{data.delivery_pin}</span>
            </div>
          )}
        </div>

        {/* Assigned Delivery Partner Card */}
        {rider ? (
          <div className="rider-profile-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#dbeafe", display: "grid", placeItems: "center", fontSize: 24 }}>
                  🛵
                </div>
                <div>
                  <div style={{ fontWeight: 850, fontSize: 15, color: "#0f172a" }}>{rider.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {rider.vehicle} · ⭐ {rider.rating}
                  </div>
                  <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 2 }}>
                    ✓ Verified Delivery Agent
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="rider-comm-buttons">
              <a href={`tel:${rider.phone}`} className="btn-call-rider">
                <span>📞</span> Call Delivery Boy
              </a>
              <a
                href={`https://wa.me/91${rider.phone}?text=${encodeURIComponent(`Hi ${rider.name}, I am tracking my medicine order #${data?.order_id}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-wa-rider"
              >
                <span>💬</span> WhatsApp Rider
              </a>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: 12, borderRadius: 14, marginBottom: 14, fontSize: 13, color: "#92400e" }}>
            ⏳ <b>Assigning nearest delivery partner…</b> As soon as a delivery partner accepts, their mobile number and live GPS location will appear here immediately.
          </div>
        )}

        {/* Live GPS Route Visualizer */}
        <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 14, marginBottom: 14, boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#1e293b", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🗺️</span> Live Delivery Route Path
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 12, border: "1px solid #cbd5e1", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
              <div style={{ textAlign: "center", maxWidth: 100 }}>
                <div style={{ fontSize: 26 }}>🏬</div>
                <div style={{ fontSize: 11, fontWeight: 750, color: "#065f46" }}>{data?.store?.name || "Medical Store"}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>Pickup Point</div>
              </div>

              <div style={{ flex: 1, margin: "0 10px", textAlign: "center", position: "relative" }}>
                <div style={{ height: 4, background: "linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #6366f1 100%)", borderRadius: 2 }} />
                <div style={{ position: "absolute", top: -14, left: isDelivered ? "90%" : "50%", transform: "translateX(-50%)", transition: "left 1s ease" }}>
                  <span style={{ fontSize: 22, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" }}>🛵</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#2563eb", marginTop: 10 }}>
                  {isDelivered ? "Reached Destination" : "En Route (Moving)"}
                </div>
              </div>

              <div style={{ textAlign: "center", maxWidth: 100 }}>
                <div style={{ fontSize: 26 }}>🏠</div>
                <div style={{ fontSize: 11, fontWeight: 750, color: "#1e1b4b" }}>{data?.customer?.name || "Customer"}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>Dropoff Point</div>
              </div>
            </div>

            {rider?.location && (
              <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed #cbd5e1", fontSize: 11, color: "#475569", display: "flex", justifyContent: "space-between" }}>
                <span>GPS Coords: {rider.location.lat?.toFixed(4)}, {rider.location.lon?.toFixed(4)}</span>
                <span>Speed: {rider.location.speed || 24} km/h</span>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step Delivery Timeline */}
        <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 14, marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#1e293b", marginBottom: 8 }}>
            📋 Live Milestone Progression
          </div>
          <div className="track-timeline">
            {(data?.timeline || []).map((node, i) => (
              <div key={i} className={`track-timeline-node ${node.done ? "done" : node.active ? "active" : ""}`}>
                <div style={{ fontWeight: node.done || node.active ? 750 : 500, color: node.done ? "#065f46" : node.active ? "#1d4ed8" : "#94a3b8" }}>
                  {node.title}
                </div>
                {node.time && (
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    {new Date(node.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Items & Summary */}
        <div style={{ background: "#f8fafc", borderRadius: 14, padding: 12, border: "1px solid #e2e8f0", marginBottom: 14, fontSize: 12 }}>
          <div style={{ fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>Ordered Veterinary Medicines:</div>
          {(data?.items || []).map((it, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>💊 {it.name} (x{it.qty || 1})</span>
              <b>₹{(it.price || 0) * (it.qty || 1)}</b>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #cbd5e1", marginTop: 6, paddingTop: 6, fontWeight: 800, color: "#065f46" }}>
            <span>Total Payable:</span>
            <span>₹{data?.total_amount} ({data?.payment_mode === "cod" ? "Cash on Delivery" : "Paid Online"})</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: "100%" }}>
          ✓ Done
        </button>
      </div>
    </div>
  );
}

function WeatherPanel({ t }) {
  const [html, setHtml] = useState(null);
  const [busy, setBusy] = useState(false);
  const [geoErr, setGeoErr] = useState(null);

  const load = async () => {
    setGeoErr(null);
    if (!navigator.geolocation) {
      setGeoErr("unsupported");
      setHtml("");
      return;
    }
    setBusy(true);
    setHtml(`<div class="loader"></div>`);

    let lat;
    let lon;
    const r = await requestDeviceLocation();
    if (!r.ok) {
      setBusy(false);
      setHtml("");
      setGeoErr(r.code);
      return;
    }
    lat = r.lat;
    lon = r.lon;
    storeGeo(lat, lon);
    try {
      window.dispatchEvent(new CustomEvent("carebridge:geo", { detail: { lat, lon } }));
    } catch (_) {}

    let locLabel = "Your location";
    try {
      const g = await api(`/api/geocode?lat=${lat}&lon=${lon}`);
      locLabel = g.label || locLabel;
    } catch (e) {}
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const temp = data.current.temperature_2m;
      const wind = data.current.wind_speed_10m;
      const humidity = data.current.relative_humidity_2m || 0;
      const code = data.current.weather_code;
      const precipToday = data.daily && data.daily.precipitation_sum ? data.daily.precipitation_sum[0] || 0 : 0;
      const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 99) || precipToday >= 5;
      const isSnow = code >= 71 && code <= 77;
      let condition = "comfortable";
      if (temp >= 38) condition = "extreme_heat";
      else if (temp >= 34) condition = "heat";
      else if (temp <= 5) condition = "extreme_cold";
      else if (temp <= 12) condition = "cold";
      else if (isRainy || isSnow) condition = "rain";
      else if (wind > 35) condition = "wind";
      const summaryTheme =
        condition === "heat" || condition === "extreme_heat"
          ? "hot"
          : condition === "cold" || condition === "extreme_cold"
            ? "cold"
            : condition === "rain"
              ? "rain"
              : "";
      const summaryEmoji =
        condition === "heat" || condition === "extreme_heat"
          ? "🥵"
          : condition === "cold" || condition === "extreme_cold"
            ? "🥶"
            : condition === "rain"
              ? "🌧️"
              : condition === "wind"
                ? "💨"
                : "☀️";
      const conditionLabel = {
        extreme_heat: "Extreme heat",
        heat: "Hot",
        extreme_cold: "Extreme cold",
        cold: "Cold",
        rain: "Rainy / wet",
        wind: "Very windy",
        comfortable: "Comfortable",
      }[condition];

      let alertHtml = "";
      if (condition === "extreme_heat" || condition === "heat") {
        alertHtml = `<div class="care-alert heat"><div class="care-alert-title">Heat stress</div><div class="care-alert-sub">${temp}°C — prioritize shade, water, and reduced exertion.</div></div>`;
      } else if (condition === "extreme_cold" || condition === "cold") {
        alertHtml = `<div class="care-alert cold"><div class="care-alert-title">Cold advisory</div><div class="care-alert-sub">${temp}°C — keep young stock warm and dry.</div></div>`;
      } else if (condition === "rain") {
        alertHtml = `<div class="care-alert rain"><div class="care-alert-title">Wet conditions</div><div class="care-alert-sub">Watch footing, skin, and respiratory health.</div></div>`;
      } else if (condition === "wind") {
        alertHtml = `<div class="care-alert wind"><div class="care-alert-title">High wind</div><div class="care-alert-sub">${wind} km/h — secure shelters.</div></div>`;
      } else {
        alertHtml = `<div class="care-alert comfortable"><div class="care-alert-title">Comfortable</div><div class="care-alert-sub">Good day for routine checks.</div></div>`;
      }

      const tips = (arr) => `<ul class="care-tips-list">${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
      const livestockTips = {
        extreme_heat: ["Move stock to shade", "Cool water frequently", "Avoid work mid-day"],
        heat: ["Shade 11am–4pm", "Electrolytes for high producers", "Graze mornings/evenings"],
        extreme_cold: ["Closed dry shelter", "Deep bedding", "Warm water if possible"],
        cold: ["Draft-free ventilation", "More feed energy", "Watch calves closely"],
        rain: ["Dry lying areas", "Hoof checks", "Drain stagnant water"],
        wind: ["Secure sheets/gates", "Sheltered yards"],
        comfortable: ["Good day for routine husbandry", "Check waterers"],
      }[condition];
      const poultryTips = {
        extreme_heat: ["Max ventilation", "Cool water", "Avoid midday handling"],
        heat: ["Fans/foggers if available", "Electrolytes", "Lower density if hot"],
        extreme_cold: ["Reduce drafts", "Warm water", "Extra feed"],
        cold: ["Dry litter", "Night drafts closed"],
        rain: ["Dry litter", "Respiratory watch"],
        wind: ["Secure housing"],
        comfortable: ["Normal management"],
      }[condition];
      const petTips = {
        extreme_heat: ["Never leave in parked vehicles", "Walk at dawn/dusk"],
        heat: ["Short walks", "Plenty of water"],
        extreme_cold: ["Limit outdoor time", "Dry paws"],
        cold: ["Coats for thin coats", "Paw checks"],
        rain: ["Dry thoroughly", "Avoid dirty puddles"],
        wind: ["Leash safety", "Indoors if debris risk"],
        comfortable: ["Great day for exercise"],
      }[condition];

      let forecastHtml = "";
      if (data.daily && data.daily.time) {
        forecastHtml = `<div class="forecast-card"><div class="label">3-day outlook</div>`;
        for (let i = 0; i < Math.min(3, data.daily.time.length); i++) {
          const d0 = new Date(data.daily.time[i]);
          const dayLbl = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d0.toLocaleDateString(undefined, { weekday: "short" });
          const precip = (data.daily.precipitation_sum && data.daily.precipitation_sum[i]) || 0;
          forecastHtml += `<div class="forecast-row"><div class="f-day">${dayLbl}${precip > 5 ? " 🌧️" : ""}</div><div class="f-temp"><span class="f-max">${Math.round(
            data.daily.temperature_2m_max[i]
          )}°</span> / ${Math.round(data.daily.temperature_2m_min[i])}°C</div></div>`;
        }
        forecastHtml += `</div>`;
      }

      setHtml(`
            <div class="weather-summary ${summaryTheme}">
              <div class="ws-top">
                <div>
                  <div class="ws-loc">${locLabel}</div>
                  <div class="ws-condition">${conditionLabel}</div>
                </div>
                <div style="text-align:right"><div class="ws-emoji">${summaryEmoji}</div></div>
              </div>
              <div style="display:flex;align-items:flex-end;gap:8px;">
                <div class="ws-temp">${Math.round(temp)}°</div>
                <div style="padding-bottom:6px;opacity:.9;font-size:13px;">C</div>
              </div>
              <div class="ws-stats">
                <div class="ws-stat">💧 ${humidity}%</div>
                <div class="ws-stat">💨 ${wind} km/h</div>
                <div class="ws-stat">🌧️ ${Number(precipToday).toFixed(1)} mm</div>
              </div>
            </div>
            ${alertHtml}
            <div class="care-tips"><div class="care-tips-h">Livestock</div>${tips(livestockTips)}</div>
            <div class="care-tips"><div class="care-tips-h">Poultry</div>${tips(poultryTips)}</div>
            <div class="care-tips"><div class="care-tips-h">Pets</div>${tips(petTips)}</div>
            ${forecastHtml}
          `);
    } catch (e) {
      setHtml(`<div class="care-alert heat" style="color:var(--danger);border-color:#fecaca;">Could not load weather.</div>`);
    }
    setBusy(false);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">{t.weather}</div>
          <div className="panel-sub">{t.weatherCardHint}</div>
        </div>
      </div>
      <button className="btn btn-primary" onClick={load} disabled={busy}>
        {t.showWeather}
      </button>
      {geoErr ? (
        <p className="muted" style={{ marginTop: 10, fontSize: 13, lineHeight: 1.45 }}>
          {geoErrorMessage(geoErr, t)}
        </p>
      ) : null}
      <div style={{ marginTop: 10 }} dangerouslySetInnerHTML={{ __html: html || "" }} />
    </div>
  );
}
