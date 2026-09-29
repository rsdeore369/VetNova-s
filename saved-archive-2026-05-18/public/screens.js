function Splash({ t }) {
  return (
    <div className="splash">
      <div className="splash-card">
        <img className="splash-logo" src="/splash-logo.png" alt="Care Bridge" onError={(e) => (e.target.style.display = "none")} />
        <h1 className="splash-brand">Care Bridge</h1>
        <p className="splash-tagline">{t.tagline}</p>
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function LangScreen({ lang, setLang, onNext }) {
  const t = getT(lang);
  const opts = [
    { k: "en", flag: "🇬🇧", nm: "English", sub: "English" },
    { k: "hi", flag: "🇮🇳", nm: "हिन्दी", sub: "Hindi" },
    { k: "mr", flag: "🇮🇳", nm: "मराठी", sub: "Marathi" },
  ];
  return (
    <>
      <TopBar title={t.selectLanguage} />
      <div className="screen">
        {opts.map((o) => (
          <div key={o.k} className={"lang-tile " + (lang === o.k ? "on" : "")} onClick={() => setLang(o.k)}>
            <div className="flag">{o.flag}</div>
            <div>
              <div className="nm">{o.nm}</div>
              <div className="sub">{o.sub}</div>
            </div>
          </div>
        ))}
        <div className="sp-lg" />
        <button className="btn btn-primary" onClick={onNext}>
          {t.continue}
        </button>
      </div>
    </>
  );
}

function RoleScreen({ t, onUser, onDoctor }) {
  return (
    <>
      <TopBar title="Care Bridge" />
      <div className="screen">
        <div className="center" style={{ padding: "10px 0 8px" }}>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>
            {t.tagline}
          </p>
        </div>
        <LocationHeroBanner t={t} />
        <div className="sp-sm" />
        <div className="card card-click" onClick={onUser}>
          <div className="row">
            <div style={{ flex: "0 0 auto", fontSize: 36 }}>🧑‍🌾</div>
            <div>
              <div style={{ fontWeight: 750 }}>{t.iAmUser}</div>
              <div className="muted">{t.iAmUserSub}</div>
            </div>
          </div>
        </div>
        <div className="card card-click" onClick={onDoctor}>
          <div className="row">
            <div style={{ flex: "0 0 auto", fontSize: 36 }}>👨‍⚕️</div>
            <div>
              <div style={{ fontWeight: 750 }}>{t.iAmDoctor}</div>
              <div className="muted">{t.iAmDoctorSub}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function UserAuth({ t, lang, onLogged, onBack }) {
  const [mode, setMode] = useState("login");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setErr("");
    setBusy(true);
    try {
      const path = mode === "login" ? "/api/login" : "/api/register";
      const body = mode === "login" ? { phone, password: pw } : { phone, password: pw, name, language: lang };
      const out = await api(path, { body });
      onLogged(out.user);
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };
  return (
    <>
      <TopBar title={mode === "login" ? t.login : t.register} onBack={onBack} />
      <div className="screen">
        {mode === "register" && (
          <>
            <div className="label">{t.name}</div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" />
            <div className="sp" />
          </>
        )}
        <div className="label">{t.phone}</div>
        <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9999999999" />
        <div className="sp" />
        <div className="label">{t.password}</div>
        <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••" />
        {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{err}</p>}
        <div className="sp-lg" />
        <button className="btn btn-primary" disabled={busy} onClick={go}>
          {busy ? t.loading : mode === "login" ? t.login : t.register}
        </button>
        <div className="sp" />
        <div className="center">
          <button
            className="link"
            onClick={() => {
              setErr("");
              setMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? t.registerHere : t.loginHere}
          </button>
        </div>
      </div>
    </>
  );
}

function DoctorAuth({ t, onLogged, onBack }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({
    phone: "",
    password: "",
    name: "",
    specialization: "General",
    experience: 0,
    languages: "English, Hindi, Marathi",
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF({ ...f, [k]: v });
  const go = async () => {
    setErr("");
    setBusy(true);
    try {
      const out = await api(mode === "login" ? "/api/doctor/login" : "/api/doctor/register", { body: f });
      onLogged(out.doctor);
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };
  return (
    <>
      <TopBar title={t.doctorPortal} onBack={onBack} />
      <div className="screen">
        <div className="tab-row">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            {t.login}
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            {t.register}
          </button>
        </div>
        {mode === "register" && (
          <>
            <div className="label">{t.name}</div>
            <input className="input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Dr. ..." />
            <div className="sp" />
            <div className="label">{t.specialization}</div>
            <select className="select" value={f.specialization} onChange={(e) => set("specialization", e.target.value)}>
              <option>Livestock</option>
              <option>Pets</option>
              <option>Poultry</option>
              <option>Mixed Practice</option>
              <option>General</option>
            </select>
            <div className="sp" />
            <div className="label">{t.experience}</div>
            <input className="input" type="number" min="0" value={f.experience} onChange={(e) => set("experience", parseInt(e.target.value || 0, 10))} />
            <div className="sp" />
            <div className="label">{t.languagesSpoken}</div>
            <input className="input" value={f.languages} onChange={(e) => set("languages", e.target.value)} />
            <div className="sp" />
          </>
        )}
        <div className="label">{t.phone}</div>
        <input className="input" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9999999999" />
        <div className="sp" />
        <div className="label">{t.password}</div>
        <input className="input" type="password" value={f.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••" />
        {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{err}</p>}
        {mode === "login" && (
          <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
            Demo doctors default password: <b>doctor123</b>
          </p>
        )}
        <div className="sp-lg" />
        <button className="btn btn-primary" disabled={busy} onClick={go}>
          {busy ? t.loading : mode === "login" ? t.login : t.register}
        </button>
      </div>
    </>
  );
}

function Dashboard({ t, user, setScreen }) {
  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div className="dash-topbar-inner">
          <div>
            <h1 className="dash-welcome-label">{t.welcome}</h1>
            <div className="dash-welcome-name">{user?.name || "Guest"}</div>
          </div>
          <div className="dash-topbar-badge" aria-hidden>
            ✦
          </div>
        </div>
      </div>
      <div className="screen">
        <p className="dash-intro muted">{t.dashboardSub}</p>
        <div className="sp-lg" />
        <div className="dash-cta-card" onClick={() => setScreen("category")}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="dash-cta-icon" aria-hidden>
              🩺
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="dash-cta-kicker">{t.diagnosisCtaKicker}</div>
              <div className="dash-cta-title">{t.startDiagnosis}</div>
              <div className="dash-cta-sub">{t.dashboardSub}</div>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="dash-tile" onClick={() => setScreen("history")}>
            <div className="dt-ico" aria-hidden>
              📋
            </div>
            <div className="dt-lbl">{t.pastReports}</div>
          </div>
          <div className="dash-tile" onClick={() => setScreen("doctors")}>
            <div className="dt-ico" aria-hidden>
              👨‍⚕️
            </div>
            <div className="dt-lbl">{t.findDoctor}</div>
          </div>
          <div className="dash-tile" onClick={() => setScreen("news")}>
            <div className="dt-ico" aria-hidden>
              📰
            </div>
            <div className="dt-lbl">{t.news}</div>
          </div>
          <div className="dash-tile" onClick={() => setScreen("profile")}>
            <div className="dt-ico" aria-hidden>
              👤
            </div>
            <div className="dt-lbl">{t.profile}</div>
          </div>
        </div>

        <HospitalsPanel t={t} />
        <WeatherPanel t={t} />
      </div>
      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

function NewsScreen({ t, onBack }) {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  const load = async () => {
    setErr("");
    try {
      const o = await api(`/api/news?filter=${encodeURIComponent(filter)}`);
      setItems(o.articles || []);
    } catch (e) {
      setErr(t.newsLoadError);
      setItems(FALLBACK_NEWS);
    }
  };
  useEffect(() => {
    load();
  }, [filter]);

  const filters = [
    { k: "all", lbl: "📰 All" },
    { k: "alert", lbl: "🚨 Alerts" },
    { k: "disease", lbl: "🦠 Diseases" },
    { k: "vaccination", lbl: "💉 Vaccinations" },
    { k: "scheme", lbl: "🏛️ Schemes" },
    { k: "pets", lbl: "🐾 Pet Care" },
    { k: "health", lbl: "💚 Health" },
    { k: "research", lbl: "🔬 Research" },
  ];

  const shown = items || [];
  const urgentItems = shown.filter((a) => a.urgent);

  const catTagClass = (k) =>
    ({
      alert: "news-cat-alert",
      disease: "news-cat-disease",
      scheme: "news-cat-scheme",
      pets: "news-cat-pets",
      vaccination: "news-cat-vaccination",
      research: "news-cat-research",
      health: "news-cat-health",
    }[k] || "news-cat-health");

  const catIcon = (k) =>
    ({
      alert: "🚨",
      disease: "🦠",
      scheme: "🏛️",
      pets: "🐾",
      vaccination: "💉",
      research: "🔬",
      health: "💚",
    }[k] || "📰");

  return (
    <>
      <TopBar title={t.animalNews} onBack={onBack} />
      <div className="screen">
        <div className="panel" style={{ marginTop: 0 }}>
          <div className="panel-title">{t.liveNews}</div>
          <div className="panel-sub">{t.latestUpdates}</div>
        </div>
        {err && <p className="muted" style={{ marginTop: 6 }}>{err}</p>}

        {filter === "all" && urgentItems.length > 0 && (
          <div className="urgent-banner" onClick={() => setFilter("alert")}>
            <div className="ub-icon">🚨</div>
            <div className="ub-txt">
              {urgentItems.length} urgent alert{urgentItems.length > 1 ? "s" : ""} — tap to filter
            </div>
            <div className="ub-count">{urgentItems.length}</div>
          </div>
        )}

        <div className="news-filter-row">
          {filters.map((f) => (
            <button key={f.k} className={"news-chip " + (filter === f.k ? "on" : "")} onClick={() => setFilter(f.k)}>
              {f.lbl}
            </button>
          ))}
        </div>

        {!items && <div className="loader" />}

        {items && shown.length === 0 && (
          <div className="news-empty">
            <div className="ne-icon">📭</div>
            <p>No articles in this category yet.</p>
          </div>
        )}

        {items &&
          shown.map((article) => (
            <div key={article.id} className={"news-card " + (article.urgent ? "urgent" : "")}>
              <div className="news-card-top">
                <span className={"news-cat-tag " + catTagClass(article.catKey)}>
                  {catIcon(article.catKey)} {article.category}
                  {article.urgent ? " · URGENT" : ""}
                </span>
                <span className="news-card-date">{article.date}</span>
              </div>
              <div className="news-card-title">{article.title}</div>
              <div className="news-card-summary">{article.summary}</div>
              <div className="news-card-footer">
                <span>📰 {article.source}</span>
                {article.link && (
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {t.readArticle}
                  </a>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

function CategoryScreen({ t, lang, onPick, onBack }) {
  const C = window.CB_CATS || {};
  const cats = [
    { k: "dairy", n: t.dairy, e: C.dairy?.icon || "🐄", ct: C.dairy?.animals?.length || 0 },
    { k: "farm", n: t.farm, e: C.farm?.icon || "🐐", ct: C.farm?.animals?.length || 0 },
    { k: "pets", n: t.pets, e: C.pets?.icon || "🐕", ct: C.pets?.animals?.length || 0 },
    { k: "poultry", n: t.poultry, e: C.poultry?.icon || "🐔", ct: C.poultry?.animals?.length || 0 },
  ];
  return (
    <>
      <TopBar title={t.selectCategory} onBack={onBack} />
      <div className="screen">
        <div className="cat-grid">
          {cats.map((c) => (
            <div key={c.k} className="cat-tile" onClick={() => onPick(c.k)}>
              <span className="emoji">{c.e}</span>
              <div className="nm">{c.n}</div>
              <div className="ct">
                {c.ct} {t.animalsCount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AnimalScreen({ t, lang, category, onPick, onBack }) {
  const list = (window.CB_CATS && window.CB_CATS[category] && window.CB_CATS[category].animals) || [];
  return (
    <>
      <TopBar title={t.selectAnimal} onBack={onBack} />
      <div className="screen">
        <div className="cat-grid">
          {list.map((a) => (
            <div key={a.k} className="cat-tile" onClick={() => onPick(a)}>
              <span className="emoji">{a.e}</span>
              <div className="nm">{a.n[lang] || a.n.en}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SymptomsScreen({ t, lang, wiz, setWiz, onNext, onBack }) {
  const [syms, setSyms] = useState(wiz.symptoms || []);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const animalKey = wiz.animal?.k;
  const animalName = wiz.animal?.n?.[lang] || wiz.animal?.n?.en || "";
  const animalEmoji = wiz.animal?.e || "🐾";
  const commonList = (window.CB_COMMON && window.CB_COMMON[animalKey]) || [];
  const filteredCommon = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return commonList;
    return commonList.filter((s) => (s.n.en + " " + (s.n.hi || "") + " " + (s.n.mr || "")).toLowerCase().includes(q));
  }, [search, commonList]);
  const isOn = (s) => syms.some((x) => x.toLowerCase() === s.n.en.toLowerCase());
  const toggleCommon = (s) => {
    if (isOn(s)) setSyms(syms.filter((x) => x.toLowerCase() !== s.n.en.toLowerCase()));
    else setSyms([...syms, s.n.en]);
  };
  const addCustom = (v) => {
    const val = v.trim();
    if (val && !syms.some((x) => x.toLowerCase() === val.toLowerCase())) setSyms([...syms, val]);
    setText("");
  };
  const rm = (s) => setSyms(syms.filter((x) => x !== s));
  const voice = useVoice(lang, (txt) => {
    const parts = txt.split(/,|\sand\s|\sऔर\s|\sआणि\s/i).map((s) => s.trim()).filter(Boolean);
    const next = [...syms];
    for (const p of parts) if (!next.some((x) => x.toLowerCase() === p.toLowerCase())) next.push(p);
    setSyms(next);
  });
  const go = () => {
    if (syms.length === 0) {
      alert(t.atLeastOne);
      return;
    }
    setWiz({ ...wiz, symptoms: syms });
    onNext();
  };
  return (
    <>
      <TopBar title={t.describeSymptoms} onBack={onBack} />
      <div className="screen">
        <div className="sym-header">
          <div className="sym-h-emoji">{animalEmoji}</div>
          <div>
            <div className="sym-h-title">{animalName}</div>
            <div className="sym-h-sub">{t.voiceHint}</div>
          </div>
        </div>
        <div className="center">
          <button className={"mic " + (voice.recording ? "recording" : "")} onClick={() => (voice.recording ? voice.stop() : voice.start())}>
            {voice.recording ? "⏹" : "🎤"}
          </button>
          <div className="muted" style={{ fontSize: 12, marginTop: -4 }}>
            {voice.recording ? t.listening : voice.supported ? t.tapToSelect : t.chromeHint}
          </div>
        </div>
        {syms.length > 0 && (
          <div className="sym-summary">
            <div className="sym-summary-title">
              <span>✓ {t.selected}</span>
              <span className="sym-summary-count">
                {syms.length} {syms.length === 1 ? t.symptomOne : t.symptomMany}
              </span>
            </div>
            <div className="chipbox">
              {syms.map((s) => (
                <span key={s} className="chip">
                  {displaySymptom(s, lang, animalKey)}
                  <button onClick={() => rm(s)}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="section-title">📋 {t.commonSymptoms}</div>
        <div className="search-bar">
          <span className="s-icon">🔍</span>
          <input placeholder={t.searchSymptoms} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {filteredCommon.length === 0 ? (
          <div className="no-match">
            <div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div>
            {t.noSymptomsFound}
          </div>
        ) : (
          <div className="sym-grid">
            {filteredCommon.map((s) => (
              <div key={s.k} className={"sym-item " + (isOn(s) ? "on" : "")} onClick={() => toggleCommon(s)} role="button" tabIndex={0}>
                <span className="sym-emoji">{s.e}</span>
                <span className="sym-lbl">{s.n[lang] || s.n.en}</span>
                <span className="sym-check">✓</span>
              </div>
            ))}
          </div>
        )}
        <div className="section-title">✍️ {t.customSymptom}</div>
        <div className="custom-input-card">
          <div className="row">
            <input
              className="input"
              placeholder={t.typeSymptom}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom(text)}
              style={{ background: "#fff" }}
            />
            <button className="btn btn-primary btn-sm" style={{ flex: "0 0 auto" }} onClick={() => addCustom(text)}>
              {t.add}
            </button>
          </div>
        </div>
        <div className="sp-lg" />
        <button className="btn btn-primary btn-with-count" onClick={go} disabled={syms.length === 0}>
          {t.next}
          {syms.length > 0 && <span className="btn-count-pill">{syms.length}</span>}
        </button>
      </div>
    </>
  );
}

function SeverityScreen({ t, wiz, setWiz, onNext, onBack }) {
  const [sev, setSev] = useState(wiz.severity || "");
  const [dur, setDur] = useState(wiz.duration || "");
  const durs = [t.hoursFew, t.oneDay, t.fewDays, t.week];
  const go = () => {
    if (!sev) {
      alert(t.selectSeverity);
      return;
    }
    setWiz({ ...wiz, severity: sev, duration: dur || durs[1] });
    onNext();
  };
  return (
    <>
      <TopBar title={t.severity} onBack={onBack} />
      <div className="screen">
        <div className="sev-grid">
          <div className={"sev-tile " + (sev === "low" ? "on-low" : "")} onClick={() => setSev("low")}>
            <div className="sev-emoji">🙂</div>
            <div className="sev-label">{t.sevLow}</div>
            <div className="sev-sub">{t.sevLowSub}</div>
          </div>
          <div className={"sev-tile " + (sev === "medium" ? "on-med" : "")} onClick={() => setSev("medium")}>
            <div className="sev-emoji">😟</div>
            <div className="sev-label">{t.sevMed}</div>
            <div className="sev-sub">{t.sevMedSub}</div>
          </div>
          <div className={"sev-tile " + (sev === "high" ? "on-high" : "")} onClick={() => setSev("high")}>
            <div className="sev-emoji">😣</div>
            <div className="sev-label">{t.sevHigh}</div>
            <div className="sev-sub">{t.sevHighSub}</div>
          </div>
        </div>
        <div className="sp-lg" />
        <div className="label">{t.duration}</div>
        <div className="grid-2">
          {durs.map((d) => (
            <button key={d} className={"btn " + (dur === d ? "btn-primary" : "btn-muted")} onClick={() => setDur(d)}>
              {d}
            </button>
          ))}
        </div>
        <div className="sp-lg" />
        <button className="btn btn-primary" onClick={go}>
          {t.next}
        </button>
      </div>
    </>
  );
}

function AllergyScreen({ t, wiz, setWiz, user, onNext, onBack }) {
  const [text, setText] = useState(wiz.allergies || "");
  const [imgId, setImgId] = useState(wiz.allergy_image_id || null);
  const go = () => {
    setWiz({ ...wiz, allergies: text, allergy_image_id: imgId });
    onNext();
  };
  return (
    <>
      <TopBar title={t.allergiesTitle} onBack={onBack} />
      <div className="screen">
        <p className="muted">{t.allergiesSub}</p>
        <div className="sp" />
        <div className="label">{t.allergyText}</div>
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. skin rash after eating grass..." />
        <div className="sp" />
        <ImageUploader userId={user?.id} kind="allergy" analyzeKind="skin_rash" onUploaded={setImgId} />
        <div className="sp-lg" />
        <div className="row">
          <button className="btn btn-ghost" onClick={onNext}>
            {t.skip}
          </button>
          <button className="btn btn-primary" onClick={go}>
            {t.next}
          </button>
        </div>
      </div>
    </>
  );
}

function MedicineScreen({ t, wiz, setWiz, user, onNext, onBack }) {
  const [name, setName] = useState(wiz.current_medicine || "");
  const [freq, setFreq] = useState(wiz.current_medicine_frequency_key || "");
  const [other, setOther] = useState("");
  const [imgId, setImgId] = useState(wiz.current_medicine_image_id || null);
  const opts = FREQUENCY_OPTIONS(t);
  const go = () => {
    const finalFreq = freq === "other" ? other : opts.find((o) => o.v === freq)?.label || "";
    setWiz({
      ...wiz,
      current_medicine: name,
      current_medicine_frequency: finalFreq,
      current_medicine_frequency_key: freq,
      current_medicine_image_id: imgId,
    });
    onNext();
  };
  return (
    <>
      <TopBar title={t.currentMedicineTitle} onBack={onBack} />
      <div className="screen">
        <p className="muted">{t.currentMedicineSub}</p>
        <div className="sp" />
        <div className="label">{t.currentMedicineName}</div>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amoxicillin" />
        <div className="sp" />
        <div className="label">{t.frequency}</div>
        <select className="select" value={freq} onChange={(e) => setFreq(e.target.value)}>
          <option value="">{t.freqPlaceholder}</option>
          {opts.map((o) => (
            <option key={o.v} value={o.v}>
              {o.label}
            </option>
          ))}
        </select>
        {freq === "other" && (
          <>
            <div className="sp" />
            <input className="input" value={other} onChange={(e) => setOther(e.target.value)} placeholder="Describe frequency…" />
          </>
        )}
        <div className="sp-lg" />
        <div className="label">{t.uploadMedicine}</div>
        <ImageUploader userId={user?.id} kind="medicine" analyzeKind="medicine" onUploaded={setImgId} />
        <div className="sp-lg" />
        <div className="row">
          <button className="btn btn-ghost" onClick={onNext}>
            {t.skip}
          </button>
          <button className="btn btn-primary" onClick={go}>
            {t.next}
          </button>
        </div>
      </div>
    </>
  );
}

function AnalyzeScreen({ t, lang, wiz, user, onDone }) {
  useEffect(() => {
    (async () => {
      try {
        await new Promise((r) => setTimeout(r, 900));
        const out = await api("/api/diagnose", {
          body: {
            user_id: user?.id,
            animal: wiz.animal?.k,
            category: wiz.category,
            symptoms: wiz.symptoms || [],
            severity: wiz.severity || "medium",
            duration: wiz.duration || "",
            allergies: wiz.allergies || "",
            allergy_image_id: wiz.allergy_image_id || null,
            current_medicine: wiz.current_medicine || "",
            current_medicine_frequency: wiz.current_medicine_frequency || "",
            current_medicine_image_id: wiz.current_medicine_image_id || null,
            language: lang,
          },
        });
        onDone(out);
      } catch (e) {
        alert("Analysis failed: " + e.message);
        onDone(null);
      }
    })();
  }, []);
  return (
    <div className="screen center" style={{ paddingTop: 120 }}>
      <img src="/logo.png" style={{ width: 80, height: 80, objectFit: "contain", opacity: 0.75 }} onError={(e) => (e.target.style.display = "none")} />
      <div className="loader" />
      <h2 style={{ margin: "10px 0 4px" }}>{t.analyzing}</h2>
      <p className="muted">{t.analyzingSub}</p>
    </div>
  );
}

function DoctorPicker({ t, onClose, onPick }) {
  const [docs, setDocs] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const o = await api("/api/doctors");
        setDocs(o.doctors);
      } catch (e) {
        setDocs([]);
      }
    })();
  }, []);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{t.nearbyDoctors}</h3>
        <p>{t.waitingForDoctor}</p>
        <div style={{ maxHeight: 320, overflowY: "auto", margin: "12px 0" }}>
          {!docs && <div className="loader" />}
          {(docs || [])
            .filter((d) => d.available && d.accepts_video)
            .map((d) => (
              <div key={d.id} className="doc-card" style={{ cursor: "pointer" }} onClick={() => onPick(d)}>
                <div className="doc-avatar">{(d.name.split(" ").slice(-1)[0] || "D")[0]}</div>
                <div className="doc-main">
                  <div className="doc-name">{d.name}</div>
                  <div className="doc-meta">
                    {d.specialization} · {d.experience}y
                  </div>
                  <div className="doc-pills">
                    <span className="pill pill-success">
                      <span className="dot dot-on" />
                      {t.available}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          {docs && docs.filter((d) => d.available && d.accepts_video).length === 0 && (
            <p className="muted center" style={{ padding: "10px 0" }}>
              {t.doctorOffline}
            </p>
          )}
        </div>
        <button className="btn btn-muted" onClick={onClose}>
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

function ResultScreen({ t, lang, diag, wiz, user, onVideoCall, onDoctors, onBack }) {
  const [pickingDoc, setPickingDoc] = useState(false);
  const sev = diag?.severity || "medium";
  const sevBannerClass = sev;
  const sevLabel = sev === "high" ? t.urgent : sev === "medium" ? t.seeVet : t.homeCare;
  const sevIcon = sev === "high" ? "🚨" : sev === "medium" ? "⚠️" : "✅";
  const animalKey = wiz.animal?.k;
  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current || !diag) return;
    savedRef.current = true;
    saveLocalReport({
      diagnosis: diag.diagnosis || "",
      match_score: Math.round(diag.match_score || 0),
      severity: sev,
      animal: wiz.animal?.n?.en || "",
      animalKey: animalKey || "",
      animalEmoji: wiz.animal?.e || "🐾",
      category: wiz.category || "",
      symptoms: wiz.symptoms || [],
      duration: wiz.duration || "",
      medicines: diag.medicines || [],
      precautions: diag.precautions || "",
      allergies: wiz.allergies || "",
      current_medicine: wiz.current_medicine || "",
    });
  }, [diag]);

  const startVideo = async (doctorId) => {
    try {
      const diagSummary = `${wiz.animal?.n?.[lang] || wiz.animal?.n?.en || "Animal"} — ${diag?.diagnosis || ""} (${sev})`;
      const out = await api("/api/video-call/request", {
        body: {
          user_id: user?.id,
          user_name: user?.name || "Guest",
          doctor_id: doctorId,
          severity: sev,
          diagnosis_summary: diagSummary,
        },
      });
      onVideoCall({
        call_id: out.call_id,
        room: out.room,
        doctor_name: out.doctor.name,
        severity: sev,
        role: "user",
      });
    } catch (e) {
      alert(e.message || "Could not start call. The doctor may be offline.");
    }
  };

  return (
    <>
      <TopBar title={t.yourDiagnosis} onBack={onBack} />
      <div className="screen">
        <div className={"severity-banner " + sevBannerClass}>
          <div className="sev-icon">{sevIcon}</div>
          <div>
            <h3>{diag?.diagnosis || "—"}</h3>
            <p>
              {sevLabel} · {t.confidence}: {Math.round(diag?.match_score || 0)}%
            </p>
          </div>
        </div>
        {wiz.symptoms && wiz.symptoms.length > 0 && (
          <>
            <div className="section-title">
              📋 {t.selected} {t.symptomMany}
            </div>
            <div className="chipbox" style={{ marginBottom: 12 }}>
              {wiz.symptoms.map((s) => (
                <span
                  key={s}
                  className="chip"
                  style={{ background: "var(--brand-light)", color: "var(--brand-dark)", boxShadow: "none" }}
                >
                  {displaySymptom(s, lang, animalKey)}
                </span>
              ))}
            </div>
          </>
        )}
        <div className="section-title">💊 {t.recommendedMeds}</div>
        {(diag?.medicines || []).length === 0 && <p className="muted">—</p>}
        {(diag?.medicines || []).map((m, i) => (
          <div key={i} className="med-item">
            <div className="med-name">💊 {m.name}</div>
            <div className="med-meta">
              <span>
                ⏱ <b>{t.frequencyLabel}:</b> {m.frequency}
              </span>
              <span>
                📅 <b>{t.durationLabel}:</b> {m.duration}
              </span>
            </div>
          </div>
        ))}
        {diag?.precautions && (
          <>
            <div className="section-title">🛡️ {t.precautions}</div>
            <div className="card card-tight">
              <p style={{ margin: 0 }}>{diag.precautions}</p>
            </div>
          </>
        )}
        <div className="sp" />
        <button className={"btn " + (sev === "high" ? "btn-danger pulse" : "btn-primary")} onClick={() => setPickingDoc(true)}>
          🎥 {sev === "high" ? t.videoConsultUrgent : t.videoConsult}
        </button>
        <div className="sp" />
        <button className="btn btn-ghost" onClick={onDoctors}>
          👨‍⚕️ {t.nearbyDoctors}
        </button>
      </div>
      {pickingDoc && (
        <DoctorPicker
          t={t}
          onClose={() => setPickingDoc(false)}
          onPick={(d) => {
            setPickingDoc(false);
            startVideo(d.id);
          }}
        />
      )}
    </>
  );
}

function DoctorsScreen({ t, user, diag, setScreen, onVideoCall }) {
  const [docs, setDocs] = useState([]);
  const load = async () => {
    try {
      const o = await api("/api/doctors");
      setDocs(o.doctors);
    } catch (e) {}
  };
  useEffect(() => {
    load();
    const tt = setInterval(load, 10000);
    return () => clearInterval(tt);
  }, []);

  const startVideo = async (d) => {
    if (!d.available) {
      alert(t.doctorOffline);
      return;
    }
    try {
      const out = await api("/api/video-call/request", {
        body: {
          user_id: user?.id,
          user_name: user?.name || "Guest",
          doctor_id: d.id,
          severity: diag?.severity || "medium",
          diagnosis_summary: diag?.diagnosis || "General consultation",
        },
      });
      onVideoCall({
        call_id: out.call_id,
        room: out.room,
        doctor_name: d.name,
        severity: diag?.severity || "medium",
        role: "user",
      });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <TopBar title={t.nearbyDoctors} onBack={() => setScreen("dashboard")} />
      <div className="screen">
        {docs.length === 0 && <div className="loader" />}
        {docs.map((d) => {
          const initials = (d.name.split(" ").slice(-1)[0] || "D")[0];
          const sev = diag?.severity || "medium";
          return (
            <div key={d.id} className="doc-card">
              <div className="doc-avatar">{initials}</div>
              <div className="doc-main">
                <div className="doc-name">{d.name}</div>
                <div className="doc-meta">
                  {d.specialization} · {d.experience}y · ⭐ {d.rating}
                </div>
                <div className="doc-pills">
                  {d.available ? (
                    <span className="pill pill-success">
                      <span className="dot dot-on" />
                      {t.available}
                    </span>
                  ) : (
                    <span className="pill pill-muted">
                      <span className="dot dot-off" />
                      {t.offline}
                    </span>
                  )}
                  <span className="pill pill-brand">
                    ⏰ {d.available_from}–{d.available_until}
                  </span>
                  {d.accepts_video ? (
                    <span className="pill pill-brand">
                      📹 {t.video}
                    </span>
                  ) : (
                    <span className="pill pill-muted">
                      📹 {t.videoOff}
                    </span>
                  )}
                </div>
                <div className="doc-actions">
                  <a className="call" href={`tel:${String(d.phone).replace(/\s/g, "")}`}>
                    📞 {t.call}
                  </a>
                  <button
                    className={"video " + (sev !== "high" ? "soft" : "") + (!d.available || !d.accepts_video ? " disabled" : "")}
                    onClick={() => startVideo(d)}
                  >
                    🎥 {t.video}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav tab="doctors" setScreen={setScreen} />
    </>
  );
}

function VideoCallScreen({ t, call, role, onEnd }) {
  const [status, setStatus] = useState(role === "doctor" ? "connected" : "waiting");
  useEffect(() => {
    if (role !== "user") return;
    let alive = true;
    const tick = async () => {
      try {
        const o = await api(`/api/video-call/status/${call.call_id}`);
        if (!alive) return;
        if (o.call?.status === "accepted") setStatus("connected");
        else if (o.call?.status === "declined") setStatus("declined");
      } catch (e) {}
    };
    const h = setInterval(tick, 2500);
    tick();
    return () => {
      alive = false;
      clearInterval(h);
    };
  }, []);
  const endCall = async () => {
    try {
      await api(`/api/video-call/${call.call_id}/end`, { body: {} });
    } catch (e) {}
    onEnd();
  };
  if (status === "declined") {
    return (
      <div className="screen center" style={{ padding: 40 }}>
        <div style={{ fontSize: 50 }}>😔</div>
        <h2>{t.callDeclined}</h2>
        <div className="sp-lg" />
        <button className="btn btn-primary" onClick={onEnd}>
          {t.back}
        </button>
      </div>
    );
  }
  if (status === "waiting") {
    return (
      <div className="screen center" style={{ padding: 40 }}>
        <div className="loader" />
        <h2>{t.connecting}</h2>
        <p className="muted">{t.waitingForDoctor}</p>
        <p className="muted" style={{ fontSize: 12 }}>
          Dr. {call.doctor_name}
        </p>
        <div className="sp-lg" />
        <button className="btn btn-muted" onClick={endCall}>
          {t.cancel}
        </button>
      </div>
    );
  }
  const jitsiUrl = `https://meet.jit.si/${call.room}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName=${encodeURIComponent(
    role === "doctor" ? "Doctor" : "Patient"
  )}`;
  return (
    <div className="video-wrap">
      <div className="video-head">
        <span className="live" />
        <span>LIVE · Dr. {call.doctor_name || "—"}</span>
        <span style={{ marginLeft: "auto", opacity: 0.7, fontSize: 11 }}>{call.severity} severity</span>
      </div>
      <iframe src={jitsiUrl} allow="camera; microphone; fullscreen; display-capture; autoplay" allowFullScreen />
      <div className="video-end">
        <button className="btn-danger" onClick={endCall}>
          🔴 {t.endCall}
        </button>
      </div>
    </div>
  );
}

function ReportDetailModal({ t, lang, report, onClose }) {
  const sevClass =
    report.severity === "high" ? "rm-sev-high" : report.severity === "medium" ? "rm-sev-med" : "rm-sev-low";
  const sevLabel = report.severity === "high" ? t.sevHigh : report.severity === "medium" ? t.sevMed : t.sevLow;
  const sevIcon = report.severity === "high" ? "🚨" : report.severity === "medium" ? "⚠️" : "✅";
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28 }}>{report.animalEmoji || "🐾"}</span>
          {t.reportDetails}
        </h3>
        <div className="rm-section">
          <div className="rm-label">{t.diagnosisLabel}</div>
          <div className="rm-val">
            <b>{report.diagnosis || "—"}</b>
          </div>
          {typeof report.match_score === "number" && (
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              {t.confidence}: {report.match_score}%
            </div>
          )}
        </div>
        <div className="rm-section">
          <div className="rm-label">{t.severity}</div>
          <div className={"rm-val " + sevClass}>
            {sevIcon} {sevLabel}
          </div>
        </div>
        <div className="rm-section">
          <div className="rm-label">{t.animal}</div>
          <div className="rm-val">
            {report.animalEmoji} {report.animal || "—"}
          </div>
        </div>
        <div className="rm-section">
          <div className="rm-label">{t.dateTime}</div>
          <div className="rm-val">{formatReportDate(report._ts)}</div>
        </div>
        {report.duration && (
          <div className="rm-section">
            <div className="rm-label">{t.duration}</div>
            <div className="rm-val">{report.duration}</div>
          </div>
        )}
        <div className="rm-section">
          <div className="rm-label">{t.reportedSymptoms}</div>
          {report.symptoms && report.symptoms.length > 0 ? (
            <div className="rm-sym-chips">
              {report.symptoms.map((s, i) => (
                <span key={i} className="rm-sym-chip">
                  {displaySymptom(s, lang, report.animalKey)}
                </span>
              ))}
            </div>
          ) : (
            <div className="muted" style={{ fontSize: 13 }}>
              {t.noSymptoms}
            </div>
          )}
        </div>
        {report.medicines && report.medicines.length > 0 && (
          <div className="rm-section">
            <div className="rm-label">{t.medicines}</div>
            {report.medicines.map((m, i) => (
              <div key={i} className="med-item" style={{ marginTop: i === 0 ? 0 : 8 }}>
                <div className="med-name">💊 {m.name}</div>
                <div className="med-meta">
                  <span>⏱ {m.frequency}</span>
                  <span>📅 {m.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {report.precautions && (
          <div className="rm-section">
            <div className="rm-label">{t.precautions}</div>
            <div className="rm-val">{report.precautions}</div>
          </div>
        )}
        {report.current_medicine && (
          <div className="rm-section">
            <div className="rm-label">{t.currentMedicationLabel}</div>
            <div className="rm-val">{report.current_medicine}</div>
          </div>
        )}
        <div className="sp-lg" />
        <button className="btn btn-primary" onClick={onClose}>
          {t.back}
        </button>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ t, onCancel, onConfirm }) {
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 340 }}>
        <div className="confirm-box">
          <div className="c-icon">🗑️</div>
          <h3>{t.confirmDeleteTitle}</h3>
          <p>{t.confirmDeleteMsg}</p>
        </div>
        <div className="row">
          <button className="btn btn-muted" onClick={onCancel}>
            {t.cancel}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            🗑 {t.yesDelete}
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryScreen({ t, lang, user, setScreen }) {
  const [localReports, setLocalReports] = useState(loadLocalReports());
  const [selected, setSelected] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        await api(`/api/history/${user.id}`);
      } catch (e) {}
    })();
  }, []);
  const doDelete = (id) => {
    setLocalReports(deleteLocalReport(id));
    setConfirmDel(null);
  };
  const sevPill = (sev) => {
    if (sev === "high") return <span className="pill pill-danger">🚨 {t.sevHigh}</span>;
    if (sev === "medium") return <span className="pill pill-warn">⚠️ {t.sevMed}</span>;
    return <span className="pill pill-success">✅ {t.sevLow}</span>;
  };
  const items = localReports;
  return (
    <>
      <TopBar title={t.pastReports} onBack={() => setScreen("dashboard")} />
      <div className="screen">
        {items.length === 0 && (
          <div className="empty">
            <span className="empty-icon">📋</span>
            <p>
              <b>{t.noHistory}</b>
            </p>
            <p style={{ fontSize: 12, marginTop: 4 }}>{t.noHistoryHint}</p>
            <div className="sp-lg" />
            <button className="btn btn-primary" style={{ maxWidth: 260, margin: "0 auto" }} onClick={() => setScreen("category")}>
              🩺 {t.startDiagnosis}
            </button>
          </div>
        )}
        {items.map((h) => {
          const symsDisplay = (h.symptoms || []).slice(0, 3).map((s) => displaySymptom(s, lang, h.animalKey)).join(" · ");
          const moreCount = Math.max(0, (h.symptoms || []).length - 3);
          return (
            <div key={h._id} className="history-item">
              <span className="hi-emoji" onClick={() => setSelected(h)}>
                {h.animalEmoji || "🐾"}
              </span>
              <div className="hi-main" onClick={() => setSelected(h)}>
                <div className="hi-top">
                  <div className="hi-diag">{h.diagnosis || "—"}</div>
                </div>
                <div className="hi-meta">
                  <span>🐾 {h.animal || "—"}</span>
                  <span>·</span>
                  <span>🕐 {formatReportDate(h._ts)}</span>
                </div>
                <div className="hi-pills" style={{ marginTop: 6 }}>
                  {sevPill(h.severity)}
                  {typeof h.match_score === "number" && <span className="pill pill-brand">{h.match_score}% match</span>}
                </div>
                {h.symptoms && h.symptoms.length > 0 && (
                  <div className="hi-syms">
                    <b>{t.reportedSymptoms}:</b> {symsDisplay}
                    {moreCount > 0 ? ` +${moreCount} more` : ""}
                  </div>
                )}
                <div className="hi-actions">
                  <button
                    className="hi-btn hi-btn-view"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(h);
                    }}
                  >
                    👁 {t.viewReport}
                  </button>
                  <button
                    className="hi-btn hi-btn-del"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDel(h);
                    }}
                  >
                    🗑 {t.deleteReport}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav tab="reports" setScreen={setScreen} />
      {selected && <ReportDetailModal t={t} lang={lang} report={selected} onClose={() => setSelected(null)} />}
      {confirmDel && <ConfirmDeleteModal t={t} onCancel={() => setConfirmDel(null)} onConfirm={() => doDelete(confirmDel._id)} />}
    </>
  );
}

function ProfileScreen({ t, user, lang, setLang, onLogout, setScreen }) {
  return (
    <>
      <TopBar title={t.profileSettings} onBack={() => setScreen("dashboard")} />
      <div className="screen">
        <div className="card">
          <div className="row">
            <div className="doc-avatar" style={{ flex: "0 0 auto", width: 52, height: 52, fontSize: 22 }}>
              {(user?.name?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 750, fontSize: 16 }}>{user?.name || "Guest"}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                📞 {user?.phone || "—"}
              </div>
            </div>
          </div>
        </div>
        <div className="label">{t.language}</div>
        <div className="grid-3">
          {["en", "hi", "mr"].map((l) => (
            <button key={l} className={"btn " + (lang === l ? "btn-primary" : "btn-muted")} onClick={() => setLang(l)}>
              {l === "en" ? "English" : l === "hi" ? "हिन्दी" : "मराठी"}
            </button>
          ))}
        </div>
        <div className="sp-lg" />
        <button className="btn btn-ghost" onClick={onLogout}>
          {t.logOut}
        </button>
      </div>
      <BottomNav tab="profile" setScreen={setScreen} />
    </>
  );
}

function DoctorDashboard({ t, doctor, setDoctor, onVideoCall, onLogout }) {
  const [avail, setAvail] = useState(!!doctor?.available);
  const [af, setAf] = useState(doctor?.available_from || "09:00");
  const [au, setAu] = useState(doctor?.available_until || "18:00");
  const [vid, setVid] = useState(!!doctor?.accepts_video);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState([]);
  const [activity, setActivity] = useState([]);

  const saveAvail = async (patch = {}) => {
    setSaving(true);
    try {
      const body = {
        doctor_id: doctor.id,
        available: patch.available !== undefined ? patch.available : avail,
        available_from: patch.af !== undefined ? patch.af : af,
        available_until: patch.au !== undefined ? patch.au : au,
        accepts_video: patch.vid !== undefined ? patch.vid : vid,
      };
      const o = await api("/api/doctor/availability", { body });
      setDoctor(o.doctor);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) {}
    setSaving(false);
  };

  useEffect(() => {
    if (!doctor) return;
    let alive = true;
    const poll = async () => {
      try {
        const o = await api(`/api/video-call/pending/${doctor.id}`);
        if (alive) setPending(o.calls || []);
      } catch (e) {}
    };
    const h = setInterval(poll, 3000);
    poll();
    return () => {
      alive = false;
      clearInterval(h);
    };
  }, [doctor?.id]);

  useEffect(() => {
    if (!doctor) return;
    (async () => {
      try {
        const o = await api(`/api/doctor/activity/${doctor.id}`);
        setActivity(o.activity);
      } catch (e) {}
    })();
  }, [doctor?.id, saved, pending.length]);

  const accept = async (c) => {
    const o = await api(`/api/video-call/${c.id}/accept`, { body: {} });
    onVideoCall({
      call_id: c.id,
      room: o.room,
      doctor_name: doctor.name,
      severity: c.severity,
      role: "doctor",
      patient: c.user_name,
      summary: c.diagnosis_summary,
    });
  };
  const decline = async (c) => {
    await api(`/api/video-call/${c.id}/decline`, { body: {} });
    setPending(pending.filter((x) => x.id !== c.id));
  };

  return (
    <>
      <div className="topbar" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>{t.doctorWelcome}</h1>
          <div style={{ fontSize: 16, fontWeight: 750 }}>{doctor?.name}</div>
        </div>
        <button className="link" onClick={onLogout}>
          {t.logOut}
        </button>
      </div>
      <div className="screen">
        {pending.map((c) => (
          <div key={c.id} className="card" style={{ borderColor: "var(--danger)", background: "#fff5f5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 750, color: "var(--danger)" }}>
              📹 {t.incomingCall} {c.severity === "high" && <span className="pill pill-danger">URGENT</span>}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 650 }}>{c.user_name}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {t.patientSummary}: {c.diagnosis_summary}
              </div>
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn btn-muted" onClick={() => decline(c)}>
                {t.decline}
              </button>
              <button className={"btn " + (c.severity === "high" ? "btn-danger" : "btn-primary")} onClick={() => accept(c)}>
                🎥 {t.accept}
              </button>
            </div>
          </div>
        ))}

        <div className="card">
          <div className="row" style={{ alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 750 }}>{t.availabilityTitle}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {t.availabilitySub}
              </div>
            </div>
            <label className="toggle" style={{ flex: "0 0 auto" }}>
              <input
                type="checkbox"
                checked={avail}
                onChange={(e) => {
                  setAvail(e.target.checked);
                  saveAvail({ available: e.target.checked });
                }}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="sp" />
          <div className="row">
            <div style={{ flex: 1 }}>
              <div className="label">{t.availableFrom}</div>
              <input
                className="input"
                type="time"
                value={af}
                onChange={(e) => {
                  setAf(e.target.value);
                  saveAvail({ af: e.target.value });
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">{t.availableUntil}</div>
              <input
                className="input"
                type="time"
                value={au}
                onChange={(e) => {
                  setAu(e.target.value);
                  saveAvail({ au: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="sp" />
          <div className="row" style={{ alignItems: "center" }}>
            <div style={{ fontWeight: 650 }}>{t.acceptVideo}</div>
            <label className="toggle" style={{ flex: "0 0 auto" }}>
              <input
                type="checkbox"
                checked={vid}
                onChange={(e) => {
                  setVid(e.target.checked);
                  saveAvail({ vid: e.target.checked });
                }}
              />
              <span className="slider" />
            </label>
          </div>
          {saved && (
            <p style={{ color: "var(--success)", fontSize: 12, marginTop: 8 }}>
              {t.statusSaved}
            </p>
          )}
        </div>

        <div className="stat-grid">
          <div className="stat">
            <div className="n">{pending.length}</div>
            <div className="t">Pending</div>
          </div>
          <div className="stat">
            <div className="n">{activity.filter((a) => a.activity === "call_accepted").length}</div>
            <div className="t">Accepted</div>
          </div>
          <div className="stat">
            <div className="n">{doctor?.experience || 0}y</div>
            <div className="t">Experience</div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 750, marginBottom: 6 }}>Profile</div>
          <div className="muted" style={{ fontSize: 13 }}>
            📞 {doctor?.phone}
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            🩺 {doctor?.specialization}
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            🗣 {doctor?.languages}
          </div>
        </div>

        <div className="section-title">{t.recentActivity}</div>
        {activity.length === 0 && <p className="muted">{t.noActivity}</p>}
        {activity.slice(0, 8).map((a) => (
          <div key={a.id} className="card card-tight">
            <div style={{ fontSize: 13, fontWeight: 650 }}>{a.activity.replace(/_/g, " ")}</div>
            <div className="muted" style={{ fontSize: 11 }}>
              {a.details} · {a.created_at}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function App() {
  const [screen, setScreen] = useState("splash");
  const [lang, setLang] = useState(localStorage.getItem("cb_lang") || "en");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("cb_user") || "null"));
  const [doctor, setDoctor] = useState(() => JSON.parse(localStorage.getItem("cb_doctor") || "null"));
  const [wiz, setWiz] = useState({});
  const [diagnosis, setDiagnosis] = useState(null);
  const [videoCall, setVideoCall] = useState(null);
  _currentLang = lang;
  const t = useTr();

  useEffect(() => {
    if (screen !== "splash") return;
    const to = setTimeout(() => {
      if (!localStorage.getItem("cb_lang")) setScreen("lang");
      else if (doctor) setScreen("doctorDashboard");
      else if (user) setScreen("dashboard");
      else setScreen("role");
    }, 1400);
    return () => clearTimeout(to);
  }, [screen, doctor, user]);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("cb_lang", l);
    _currentLang = l;
  };
  const logoutUser = () => {
    localStorage.removeItem("cb_user");
    setUser(null);
    setScreen("role");
  };
  const logoutDoctor = () => {
    localStorage.removeItem("cb_doctor");
    setDoctor(null);
    setScreen("role");
  };

  const screens = {
    splash: <Splash t={t} />,
    lang: <LangScreen lang={lang} setLang={changeLang} onNext={() => setScreen("role")} />,
    role: <RoleScreen t={t} onUser={() => setScreen("userAuth")} onDoctor={() => setScreen("doctorAuth")} />,
    userAuth: (
      <UserAuth
        t={t}
        lang={lang}
        onLogged={(u) => {
          setUser(u);
          localStorage.setItem("cb_user", JSON.stringify(u));
          setScreen("dashboard");
        }}
        onBack={() => setScreen("role")}
      />
    ),
    doctorAuth: (
      <DoctorAuth
        t={t}
        onLogged={(d) => {
          setDoctor(d);
          localStorage.setItem("cb_doctor", JSON.stringify(d));
          setScreen("doctorDashboard");
        }}
        onBack={() => setScreen("role")}
      />
    ),
    dashboard: <Dashboard t={t} user={user} setScreen={setScreen} />,
    news: <NewsScreen t={t} onBack={() => setScreen("dashboard")} />,
    category: (
      <CategoryScreen
        t={t}
        lang={lang}
        onPick={(c) => {
          setWiz({ ...wiz, category: c });
          setScreen("animal");
        }}
        onBack={() => setScreen("dashboard")}
      />
    ),
    animal: (
      <AnimalScreen
        t={t}
        lang={lang}
        category={wiz.category}
        onPick={(a) => {
          setWiz({ ...wiz, animal: a });
          setScreen("symptoms");
        }}
        onBack={() => setScreen("category")}
      />
    ),
    symptoms: (
      <SymptomsScreen
        t={t}
        lang={lang}
        wiz={wiz}
        setWiz={setWiz}
        onNext={() => setScreen("severity")}
        onBack={() => setScreen("animal")}
      />
    ),
    severity: (
      <SeverityScreen t={t} wiz={wiz} setWiz={setWiz} onNext={() => setScreen("allergy")} onBack={() => setScreen("symptoms")} />
    ),
    allergy: (
      <AllergyScreen t={t} wiz={wiz} setWiz={setWiz} user={user} onNext={() => setScreen("medicine")} onBack={() => setScreen("severity")} />
    ),
    medicine: (
      <MedicineScreen t={t} wiz={wiz} setWiz={setWiz} user={user} onNext={() => setScreen("analyze")} onBack={() => setScreen("allergy")} />
    ),
    analyze: (
      <AnalyzeScreen
        t={t}
        lang={lang}
        wiz={wiz}
        user={user}
        onDone={(d) => {
          setDiagnosis(d);
          setScreen("result");
        }}
      />
    ),
    result: (
      <ResultScreen
        t={t}
        lang={lang}
        diag={diagnosis}
        wiz={wiz}
        user={user}
        onVideoCall={(call) => {
          setVideoCall(call);
          setScreen("videoCall");
        }}
        onDoctors={() => setScreen("doctors")}
        onBack={() => setScreen("dashboard")}
      />
    ),
    doctors: (
      <DoctorsScreen
        t={t}
        user={user}
        diag={diagnosis}
        setScreen={setScreen}
        onVideoCall={(call) => {
          setVideoCall(call);
          setScreen("videoCall");
        }}
      />
    ),
    videoCall: videoCall && (
      <VideoCallScreen
        t={t}
        call={videoCall}
        role="user"
        onEnd={() => {
          setVideoCall(null);
          setScreen(diagnosis ? "result" : "doctors");
        }}
      />
    ),
    history: <HistoryScreen t={t} lang={lang} user={user} setScreen={setScreen} />,
    profile: <ProfileScreen t={t} user={user} lang={lang} setLang={changeLang} onLogout={logoutUser} setScreen={setScreen} />,
    doctorDashboard: (
      <DoctorDashboard
        t={t}
        doctor={doctor}
        setDoctor={(d) => {
          setDoctor(d);
          localStorage.setItem("cb_doctor", JSON.stringify(d));
        }}
        onVideoCall={(call) => {
          setVideoCall(call);
          setScreen("doctorVideoCall");
        }}
        onLogout={logoutDoctor}
      />
    ),
    doctorVideoCall: videoCall && (
      <VideoCallScreen
        t={t}
        call={videoCall}
        role="doctor"
        onEnd={() => {
          setVideoCall(null);
          setScreen("doctorDashboard");
        }}
      />
    ),
  };

  return (
    <div className="viewport">
      {screens[screen] || screens.splash}
      {screen !== "splash" && screen !== "lang" && <GeminiChatDock lang={lang} onNavigate={setScreen} />}
    </div>
  );
}

function Boot() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const [locales, sy] = await Promise.all([
          fetch("/locales.json").then((r) => r.json()),
          fetch("/symptoms.json").then((r) => r.json()),
        ]);
        window.CB_T = locales;
        window.CB_COMMON = sy.COMMON_SYMPTOMS;
        window.CB_CATS = sy.CATEGORIES;
        setReady(true);
      } catch (e) {
        console.error(e);
        window.CB_T = { en: { tagline: "Care Bridge" } };
        window.CB_COMMON = {};
        window.CB_CATS = {};
        setReady(true);
      }
    })();
  }, []);
  if (!ready) {
    return (
      <div className="viewport">
        <div className="splash">
          <div className="splash-card">
            <img className="splash-logo" src="/splash-logo.png" alt="" onError={(e) => (e.target.style.display = "none")} />
            <div className="loader" style={{ margin: "16px auto 0" }} />
            <p className="muted" style={{ marginTop: 12 }}>
              Preparing…
            </p>
          </div>
        </div>
      </div>
    );
  }
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Boot />);
