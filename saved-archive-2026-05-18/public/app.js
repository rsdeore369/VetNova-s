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
function loadLocalReports() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_REPORTS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
function saveLocalReport(r) {
  const list = loadLocalReports();
  const fingerprint = (r.diagnosis || "") + "|" + (r.symptoms || []).join(",");
  if (list.length > 0) {
    const last = list[0];
    const lastFp = (last.diagnosis || "") + "|" + (last.symptoms || []).join(",");
    const recent = Date.now() - new Date(last._ts).getTime() < 60000;
    if (lastFp === fingerprint && recent) return list;
  }
  const record = {
    ...r,
    _id: Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    _ts: new Date().toISOString(),
  };
  list.unshift(record);
  if (list.length > 100) list.length = 100;
  localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(list));
  return list;
}
function deleteLocalReport(id) {
  const list = loadLocalReports().filter((r) => r._id !== id);
  localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(list));
  return list;
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
  const s = String(text || "");
  if (/gemini api|daily quota|quota is used|quota exceeded|offline mode/i.test(s)) return "";
  return s;
}

function GeminiChatDock({ lang, onNavigate }) {
  const t = useTr();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!t.chatWelcome) return;
    setMsgs((prev) => {
      if (prev.some((m) => m.role === "user")) return prev;
      return [{ role: "assistant", text: t.chatWelcome }];
    });
  }, [lang, t.chatWelcome]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, open]);

  const buildApiThread = (list) =>
    list
      .filter((m) => m.text && String(m.text).trim())
      .slice(-12)
      .map((m) => ({ role: m.role, text: String(m.text).trim() }));

  const sendText = async (rawText) => {
    const text = String(rawText || input).trim();
    if (!text || busy) return;
    setInput("");
    const thread = buildApiThread([...msgs, { role: "user", text }]);
    setMsgs([...thread, { role: "assistant", text: "" }]);
    setBusy(true);
    const setAssistant = (reply) => {
      setMsgs((prev) => {
        const copy = prev.map((m) => ({ ...m, text: m.text }));
        const last = copy[copy.length - 1];
        if (last?.role === "assistant") last.text = reply;
        return copy;
      });
    };
    const appendAssistant = (piece) => {
      setMsgs((prev) => {
        const copy = prev.map((m) => ({ ...m, text: m.text }));
        const last = copy[copy.length - 1];
        if (last?.role === "assistant") last.text += piece;
        return copy;
      });
    };
    try {
      const j = await api("/api/chat", { body: { thread, lang: lang || "en" } });
      let reply = sanitizeChatText(j.text) || "";
      if (!reply.trim()) {
        const loc = await api("/api/chat/local", { body: { thread, lang: lang || "en" } });
        reply = loc.text || t.chatError;
      }
      setAssistant(reply);
    } catch {
      try {
        const loc = await api("/api/chat/local", { body: { thread, lang: lang || "en" } });
        setAssistant(loc.text || t.chatError);
      } catch (e) {
        setAssistant(e.message || String(t.chatError));
      }
    }
    setBusy(false);
  };

  const send = () => sendText(input);

  const quickAsk = (q) => sendText(q);

  return (
    <div className="cb-chat-root">
      <button type="button" className="cb-chat-fab" aria-expanded={open} aria-label={t.chatTitle} onClick={() => setOpen(!open)}>
        💬
      </button>
      {open && (
        <div className="cb-chat-panel" role="dialog" aria-label={t.chatTitle}>
          <div className="cb-chat-head">
            <div>
              <div className="cb-chat-title">{t.chatTitle}</div>
              <div className="cb-chat-sub">{t.chatHint}</div>
            </div>
            <button type="button" className="cb-chat-x" onClick={() => setOpen(false)} aria-label={t.chatClose}>
              ×
            </button>
          </div>
          <div className="cb-chat-messages" ref={listRef}>
            {msgs.length === 0 && <p className="muted cb-chat-empty">{t.chatPlaceholder}</p>}
            {msgs.map((m, i) => (
              <div key={i} className={"cb-msg cb-msg-" + m.role}>
                {m.text || (m.role === "assistant" && busy && !String(m.text).trim() ? t.chatBusy : "")}
              </div>
            ))}
          </div>
          <div className="cb-chat-quick">
            <button type="button" className="cb-quick-chip" onClick={() => quickAsk(t.chatQuickFever || "fever")}>
              {t.chatQuickFever || "🌡️ Fever"}
            </button>
            <button type="button" className="cb-quick-chip" onClick={() => quickAsk(t.chatQuickEat || "not eating")}>
              {t.chatQuickEat || "🍽️ Not eating"}
            </button>
            {onNavigate ? (
              <>
                <button type="button" className="cb-quick-chip cb-quick-primary" onClick={() => onNavigate("category")}>
                  {t.chatQuickDiag || "🩺 Diagnosis"}
                </button>
                <button type="button" className="cb-quick-chip" onClick={() => onNavigate("doctors")}>
                  {t.chatQuickDoc || "👨‍⚕️ Doctors"}
                </button>
              </>
            ) : null}
          </div>
          <div className="cb-chat-input-row">
            <input
              className="cb-chat-input"
              value={input}
              placeholder={t.chatPlaceholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={busy}
            />
            <button type="button" className="btn btn-primary cb-chat-send" disabled={busy || !input.trim()} onClick={send}>
              {t.chatSend}
            </button>
          </div>
        </div>
      )}
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
    summary: "When headlines cannot load, you can still browse the rest of Care Bridge. Check connectivity and try again.",
    date: "Just now",
    source: "Care Bridge",
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
  <div className="topbar">
    {onBack && (
      <button type="button" className="back" onClick={onBack}>
        ←
      </button>
    )}
    <h1>{title}</h1>
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
    if (analysis.ok && analysis.mode === "gemini-vision" && analysis.result) {
      const r = analysis.result;
      const blob = JSON.stringify(r).toLowerCase();
      if (/without an api key|cloud vision cannot run|image received[\s\S]{0,40}api key/.test(blob)) {
        return (
          <div className="analysis-card">
            <h4>{t.imageAnalysis}</h4>
            <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              The vision step did not return real image analysis (often a missing or invalid API key on the server). Check
              <code style={{ margin: "0 4px" }}>.env</code> next to <code style={{ margin: "0 4px" }}>server.js</code>, restart{" "}
              <code style={{ margin: "0 4px" }}>npm start</code>, then upload again.
            </p>
            {renderEnvCheck()}
          </div>
        );
      }
      const meta = r._model ? `Model: ${r._model}` : "";
      const { _model, _json_mode, ...rest } = r;
      return (
        <div className="analysis-card">
          <h4>{t.imageAnalysis}</h4>
          {meta && (
            <p className="muted" style={{ fontSize: 11, margin: "0 0 8px" }}>
              {meta}
            </p>
          )}
          <pre style={{ margin: 0, fontFamily: "inherit", fontSize: 12, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(rest, null, 2)}
          </pre>
        </div>
      );
    }
    return (
      <div className="analysis-card">
        <h4>{t.imageAnalysis}</h4>
        <pre style={{ margin: 0, fontFamily: "inherit", fontSize: 12, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(analysis.result || analysis, null, 2)}
        </pre>
      </div>
    );
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
