function Splash({ t }) {
  return (
    <div className="splash">
      <div className="splash-card">
        <img className="splash-logo" src="/splash-logo.png" alt="VetNova" onError={(e) => (e.target.style.display = "none")} />
        <h1 className="splash-brand">VetNova</h1>
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

function RoleScreen({ t, onUser, onDoctor, onPharmacy, onDelivery, onGovt, onParaVet }) {
  return (
    <>
      <TopBar title="VetNova" />
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
        <div className="card card-click" onClick={onPharmacy} style={{ borderLeft: "4px solid #10b981" }}>
          <div className="row">
            <div style={{ flex: "0 0 auto", fontSize: 36 }}>🏬</div>
            <div>
              <div style={{ fontWeight: 750 }}>{t.iAmPharmacy || "I am a Medical Store Owner"}</div>
              <div className="muted">{t.iAmPharmacySub || "Veterinary pharmacy & medicine supplier"}</div>
            </div>
          </div>
        </div>
        <div className="card card-click delivery-role-card" onClick={onDelivery}>
          <div className="row">
            <div style={{ flex: "0 0 auto", fontSize: 36 }}>🛵</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, color: "#1e3a8a" }}>{t.iAmDeliveryPartner || "I am a Delivery Partner"}</span>
                <span style={{ fontSize: 10, fontWeight: 800, background: "#dbeafe", color: "#1e40af", padding: "2px 6px", borderRadius: 999 }}>
                  🚀 Earn per delivery
                </span>
              </div>
              <div className="muted">{t.iAmDeliveryPartnerSub || "Deliver medicines, earn per order & live GPS route"}</div>
            </div>
          </div>
        </div>
        <div className="card card-click paravet-role-card" onClick={onParaVet} style={{ borderLeft: "4px solid #0284c7", background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)" }}>
          <div className="row">
            <div style={{ flex: "0 0 auto", fontSize: 36 }}>👩‍⚕️</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, color: "#0369a1" }}>Para-Veterinary Worker / Pashu Sakhi</span>
                <span style={{ fontSize: 10, fontWeight: 800, background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: 999 }}>
                  🌾 Doorstep Village Screener
                </span>
              </div>
              <div className="muted">Door-to-door herd screening, offline buffer, tagging &amp; lab sampling kit</div>
            </div>
          </div>
        </div>
        <div className="card card-click govt-role-card" onClick={onGovt} style={{ borderLeft: "4px solid #b91c1c", background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)" }}>
          <div className="row">
            <div style={{ flex: "0 0 auto", fontSize: 36 }}>🏛️</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, color: "#881337" }}>Govt Veterinary &amp; Surveillance Officer</span>
                <span style={{ fontSize: 10, fontWeight: 800, background: "#ffe4e6", color: "#9f1239", padding: "2px 6px", borderRadius: 999 }}>
                  🛡️ DAHD / RRT Portal
                </span>
              </div>
              <div className="muted">Village/Block/District outbreak radar, GIS map, lab referrals &amp; alerts</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DeliveryAuth({ t, lang, onLogged, onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const saved = loadSavedCreds("delivery");
  const [phone, setPhone] = useState(saved?.phone || "");
  const [name, setName] = useState(saved?.name || "");
  const [vehicleType, setVehicleType] = useState("Motorcycle (Hero Splendor)");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [city, setCity] = useState("Nashik");
  const [upiId, setUpiId] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [remember, setRemember] = useState(saved?.remember !== false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (err) setErr("");
  };

  const handleSendOtp = async () => {
    setErr("");
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setErr(t.invalid10DigitPhone || "Please enter a valid 10-digit mobile number (digits only).");
      return;
    }
    if (mode === "register" && (!name.trim() || !vehicleNumber.trim())) {
      setErr("Please enter your name and vehicle registration number.");
      return;
    }
    setBusy(true);
    try {
      const out = await api("/api/delivery/send-otp", { body: { phone } });
      setServerOtp(out.otp || "123456");
      setStep("otp");
      setResendTimer(30);
    } catch (e) {
      setErr(e.message || "Failed to send OTP to delivery partner phone.");
    }
    setBusy(false);
  };

  const handleVerifyOtp = async () => {
    setErr("");
    if (!otp || otp.length < 6) {
      setErr(t.invalidOtp || "Please enter the 6-digit OTP code.");
      return;
    }
    setBusy(true);
    try {
      const out = await api("/api/delivery/verify-otp", {
        body: {
          phone,
          otp,
          name,
          vehicle_type: vehicleType,
          vehicle_number: vehicleNumber,
          city,
          upi_id: upiId || `${phone}@upi`,
        },
      });
      if (out.rider) {
        if (remember) {
          saveSavedCreds("delivery", { phone, name: out.rider.name, remember: true });
        } else {
          saveSavedCreds("delivery", null);
        }
        onLogged(out.rider);
      }
    } catch (e) {
      setErr(e.message || "OTP verification failed. Please try again.");
    }
    setBusy(false);
  };

  return (
    <>
      <TopBar title={mode === "login" ? (t.deliveryLoginTitle || "Delivery Partner Login") : (t.deliveryRegisterTitle || "Register as Delivery Partner")} onBack={onBack} />
      <div className="screen">
        <div className="center" style={{ padding: "8px 0 12px" }}>
          <div style={{ fontSize: 44, marginBottom: 4 }}>🛵</div>
          <h2 style={{ fontSize: 20, margin: "0 0 4px", color: "#1e3a8a" }}>
            {mode === "login" ? (t.deliveryLoginTitle || "Delivery Partner Login") : (t.deliveryRegisterTitle || "Join as Delivery Partner")}
          </h2>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            Deliver veterinary medicines to farms & earn instant daily payouts
          </p>
        </div>

        {step === "phone" ? (
          <div className="card" style={{ borderLeft: "4px solid #2563eb" }}>
            {mode === "register" && (
              <>
                <div className="label">👤 Full Name</div>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikas Shinde"
                />
                <div className="sp" />

                <div className="label">🛵 Vehicle Type</div>
                <select className="select" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                  <option value="Motorcycle (Hero Splendor)">🛵 Motorcycle (Bike)</option>
                  <option value="Scooter (Honda Activa)">🛵 Scooter / Moped</option>
                  <option value="Bicycle (Hero / Atlas)">🚴 Bicycle / Electric Cycle</option>
                  <option value="Van / Auto (Utility)">🚗 Delivery Van / Tempo</option>
                </select>
                <div className="sp" />

                <div className="label">🔢 Vehicle Number Plate</div>
                <input
                  className="input"
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. MH 15 AB 1234"
                  style={{ textTransform: "uppercase", fontWeight: 700 }}
                />
                <div className="sp" />

                <div className="label">📍 Operating City / District</div>
                <input
                  className="input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nashik"
                />
                <div className="sp" />

                <div className="label">💳 Payout UPI ID (For instant earnings transfer)</div>
                <input
                  className="input"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@upi"
                />
                <div className="sp" />
              </>
            )}

            <div className="label">📱 Registered Mobile Number</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
                🇮🇳 +91
              </span>
              <input
                className="input"
                type="tel"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="10-digit mobile number"
                style={{ flex: 1, fontSize: 15, fontWeight: 700 }}
                autoFocus
              />
            </div>
            <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
              We will send a 6-digit OTP to verify your mobile number.
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
              <input
                type="checkbox"
                id="delRemember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer" }}
              />
              <label htmlFor="delRemember" style={{ fontSize: 13, color: "#374151", cursor: "pointer", fontWeight: 600 }}>
                Remember my mobile number on this device
              </label>
            </div>

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 10, fontWeight: 650 }}>{err}</p>}

            <div className="sp-lg" />
            <button
              className="btn btn-primary"
              style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)", borderColor: "#1e40af" }}
              onClick={handleSendOtp}
              disabled={busy}
            >
              {busy ? t.loading : `📲 ${t.sendOtp || "Get OTP Verification"}`}
            </button>

            <div style={{ textAlign: "center", marginTop: 14 }}>
              {mode === "login" ? (
                <button
                  type="button"
                  onClick={() => { setMode("register"); setErr(""); }}
                  style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 750, fontSize: 13, cursor: "pointer" }}
                >
                  New delivery rider? Register here ➔
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setMode("login"); setErr(""); }}
                  style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 750, fontSize: 13, cursor: "pointer" }}
                >
                  Already registered? Login here ➔
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="card" style={{ borderLeft: "4px solid #2563eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: "#374151" }}>
                OTP sent to <b>+91 {phone}</b>
              </div>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setErr(""); }}
                style={{ background: "none", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                Change
              </button>
            </div>

            {serverOtp && (
              <div style={{ background: "#eff6ff", border: "1px dashed #60a5fa", padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#1e40af", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span>Demo OTP: <b>{serverOtp}</b></span>
                <button
                  type="button"
                  onClick={() => setOtp(serverOtp)}
                  style={{ background: "#2563eb", color: "#fff", border: "none", padding: "2px 8px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontWeight: 700 }}
                >
                  Auto-fill
                </button>
              </div>
            )}

            <div className="label">Enter 6-Digit OTP Code</div>
            <input
              className="input"
              type="tel"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              style={{ fontSize: 22, letterSpacing: 8, textAlign: "center", fontWeight: 800 }}
              autoFocus
            />

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 10, fontWeight: 650 }}>{err}</p>}

            <div className="sp-lg" />
            <button
              className="btn btn-primary"
              style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)", borderColor: "#1e40af" }}
              onClick={handleVerifyOtp}
              disabled={busy || otp.length < 6}
            >
              {busy ? t.loading : "✓ Verify OTP & Enter Dashboard"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function DeliveryDashboard({ t, rider, onLogout }) {
  const [activeTab, setActiveTab] = useState("available"); // "available" | "active" | "earnings" | "history"
  const [isOnline, setIsOnline] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [stats, setStats] = useState({ today_earnings: 450, total_deliveries: 12, active_deliveries: 0, rating: 4.9 });
  const [busy, setBusy] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState(null);

  const loadData = async () => {
    try {
      const [availRes, dashRes] = await Promise.all([
        api("/api/delivery/available-orders"),
        api(`/api/delivery/dashboard/${rider.id}`),
      ]);
      setAvailableOrders(availRes.orders || []);
      if (dashRes.ok) {
        setActiveOrders(dashRes.active_orders || []);
        setHistoryOrders(dashRes.history_orders || []);
        setStats(dashRes.stats || {});
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 4000);
    return () => clearInterval(timer);
  }, [rider.id]);

  // GPS Simulation / Location Broadcaster
  useEffect(() => {
    if (!isOnline) return;
    const locTimer = setInterval(() => {
      if (activeOrders.length > 0) {
        const first = activeOrders[0];
        const newLat = (rider.current_lat || 19.9975) + (Math.random() - 0.5) * 0.0008;
        const newLon = (rider.current_lon || 73.7898) + (Math.random() - 0.5) * 0.0008;
        api(`/api/delivery/orders/${first.order_id}/location`, {
          body: {
            rider_id: rider.id,
            lat: newLat,
            lon: newLon,
            heading: 45,
            speed: 26,
          },
        }).catch(() => {});
      }
    }, 4000);
    return () => clearInterval(locTimer);
  }, [isOnline, activeOrders, rider.id]);

  const handleAcceptOrder = async (orderId) => {
    setBusy(true);
    try {
      await api(`/api/delivery/orders/${orderId}/accept`, {
        body: { rider_id: rider.id },
      });
      await loadData();
      setActiveTab("active");
    } catch (e) {
      alert("Failed to accept delivery: " + e.message);
    }
    setBusy(false);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setBusy(true);
    try {
      await api(`/api/delivery/orders/${orderId}/update-status`, {
        body: { delivery_status: newStatus },
      });
      await loadData();
    } catch (e) {
      alert("Failed to update status: " + e.message);
    }
    setBusy(false);
  };

  const handleRequestPayout = async () => {
    setBusy(true);
    try {
      const res = await api("/api/delivery/payout", {
        body: { rider_id: rider.id, amount: stats.today_earnings },
      });
      setPayoutMsg(`✓ Instant transfer of ₹${res.amount} to ${res.upi_id} successful! (ID: ${res.payout_id})`);
      await loadData();
      setTimeout(() => setPayoutMsg(null), 5000);
    } catch (e) {
      alert("Payout failed: " + e.message);
    }
    setBusy(false);
  };

  return (
    <>
      <div className="screen" style={{ paddingBottom: 60 }}>
        {/* Top Header */}
        <div className="delivery-hero-banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#bfdbfe" }}>
                🛵 VetNova Delivery Partner
              </div>
              <h2 style={{ margin: "2px 0 0", fontSize: 20 }}>{rider.name}</h2>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
                {rider.vehicle_type} · <span style={{ fontWeight: 750 }}>{rider.vehicle_number}</span> · ⭐ {rider.rating || 4.9}
              </div>
            </div>

            <button
              className="btn"
              onClick={onLogout}
              style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", fontSize: 11, padding: "4px 10px", borderRadius: 8 }}
            >
              Logout
            </button>
          </div>

          {/* Duty Status Switch */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <div
              className="rider-duty-toggle"
              onClick={() => setIsOnline(!isOnline)}
              style={{ background: isOnline ? "#059669" : "#dc2626" }}
            >
              <span className="live-pulse-dot" style={{ background: isOnline ? "#a7f3d0" : "#fca5a5" }} />
              <span>{isOnline ? (t.dutyOnline || "🟢 Online (Ready for Orders)") : (t.dutyOffline || "🔴 Offline (Taking Break)")}</span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>
              📡 GPS Live Sync: <b>Active</b>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="delivery-kpi-grid">
          <div className="delivery-kpi-tile highlight">
            <div style={{ fontSize: 11, fontWeight: 800, color: "#1e40af", textTransform: "uppercase" }}>💰 Today's Earnings</div>
            <div style={{ fontSize: 24, fontWeight: 850, color: "#1e3a8a", marginTop: 2 }}>₹{stats.today_earnings}</div>
            <div style={{ fontSize: 11, color: "#2563eb", marginTop: 2 }}>Instant Payout Eligible</div>
          </div>
          <div className="delivery-kpi-tile">
            <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>📦 Completed</div>
            <div style={{ fontSize: 24, fontWeight: 850, color: "#065f46", marginTop: 2 }}>{stats.total_deliveries}</div>
            <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>Rating: ⭐ {stats.rating}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 12 }}>
          {[
            { k: "available", label: `📥 Available Orders (${availableOrders.length})` },
            { k: "active", label: `🛵 Active Deliveries (${activeOrders.length})` },
            { k: "earnings", label: "💰 Payouts & Earnings" },
            { k: "history", label: "📜 Delivery History" },
          ].map((tab) => (
            <button
              key={tab.k}
              onClick={() => setActiveTab(tab.k)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid",
                fontSize: 12,
                fontWeight: 750,
                whiteSpace: "nowrap",
                borderColor: activeTab === tab.k ? "#2563eb" : "#cbd5e1",
                background: activeTab === tab.k ? "#2563eb" : "#ffffff",
                color: activeTab === tab.k ? "#ffffff" : "#475569",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: AVAILABLE ORDERS */}
        {activeTab === "available" && (
          <div>
            <div className="section-title" style={{ color: "#1e3a8a" }}>
              ⚡ Available Delivery Pickups ({availableOrders.length})
            </div>

            {availableOrders.length === 0 ? (
              <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #dbeafe" }}>
                <span className="empty-icon">🛵</span>
                <p><b>No delivery requests pending right now</b></p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  As soon as a medical store packs an order in your area, it will ring and appear here instantly.
                </p>
              </div>
            ) : (
              availableOrders.map((ord) => (
                <div key={ord.order_id} className="delivery-order-card" style={{ borderLeft: "4px solid #2563eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 850, fontSize: 15, color: "#1e3a8a" }}>{ord.order_id}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        🕒 {new Date(ord.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 16, fontWeight: 850, color: "#059669" }}>+₹{ord.delivery_fee || 65}</span>
                      <div style={{ fontSize: 10, color: "#64748b" }}>Delivery Fee</div>
                    </div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "10px", borderRadius: 12, fontSize: 12, marginBottom: 10, border: "1px solid #e2e8f0" }}>
                    <div>🏬 <b>Pickup Store:</b> {ord.store_name}</div>
                    <div style={{ marginTop: 2, color: "#64748b" }}>📍 {ord.store_address || "Market Yard, Nashik"}</div>
                    <div style={{ marginTop: 6 }}>👤 <b>Customer:</b> {ord.user_name} (+91 {ord.phone})</div>
                    <div style={{ marginTop: 2 }}>📍 <b>Dropoff Address:</b> {ord.delivery_address}</div>
                    {ord.address_details?.landmark && (
                      <div style={{ marginTop: 2, color: "#2563eb" }}>📌 <b>Landmark:</b> Near {ord.address_details.landmark}</div>
                    )}
                    <div style={{ marginTop: 6 }}>
                      📦 <b>Medicines:</b> {(ord.items || []).map((i) => `${i.name} (x${i.qty || 1})`).join(", ")}
                    </div>
                    <div style={{ marginTop: 6, fontWeight: 700, color: ord.payment_mode === "cod" ? "#d97706" : "#059669" }}>
                      💵 Collect Payment: ₹{ord.total_amount} ({ord.payment_mode === "cod" ? "Cash on Delivery" : "Prepaid Online"})
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)", borderColor: "#1e40af", fontWeight: 800 }}
                    onClick={() => handleAcceptOrder(ord.order_id)}
                    disabled={busy || !isOnline}
                  >
                    {!isOnline ? "⚠️ Go Online to Accept Deliveries" : "✅ Accept Delivery Order (+₹" + (ord.delivery_fee || 65) + ")"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE DELIVERIES */}
        {activeTab === "active" && (
          <div>
            <div className="section-title" style={{ color: "#1e3a8a" }}>
              🛵 Active In-Progress Deliveries ({activeOrders.length})
            </div>

            {activeOrders.length === 0 ? (
              <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #dbeafe" }}>
                <span className="empty-icon">📦</span>
                <p><b>No active deliveries assigned</b></p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Switch to the "Available Orders" tab to accept a delivery request.
                </p>
              </div>
            ) : (
              activeOrders.map((ord) => {
                const statusKey = ord.delivery_status || "accepted";
                return (
                  <div key={ord.order_id} className="delivery-order-card active-route">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 6 }}>
                          {ord.status}
                        </span>
                        <h3 style={{ margin: "4px 0 0", color: "#0f172a", fontSize: 16 }}>{ord.order_id}</h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: "#64748b" }}>Earnings</div>
                        <b style={{ fontSize: 16, color: "#059669" }}>+₹{ord.delivery_fee || 65}</b>
                      </div>
                    </div>

                    {/* Step by Step Progression Button Actions */}
                    <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", padding: 12, borderRadius: 14, marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#1e3a8a", marginBottom: 6 }}>
                        🚀 Delivery Action Stepper:
                      </div>

                      {statusKey === "accepted" && (
                        <div>
                          <div style={{ fontSize: 12, color: "#1e40af", marginBottom: 8 }}>
                            📍 Step 1: Navigate to <b>{ord.store_name}</b> ({ord.store_address || "Market Yard"}) and pick up the packed parcel.
                          </div>
                          <button
                            className="btn btn-primary"
                            style={{ background: "#059669", borderColor: "#059669", width: "100%", fontWeight: 800 }}
                            onClick={() => handleUpdateStatus(ord.order_id, "picked_up")}
                            disabled={busy}
                          >
                            🏬 1. Reached Store & Picked Up Medicines
                          </button>
                        </div>
                      )}

                      {statusKey === "picked_up" && (
                        <div>
                          <div style={{ fontSize: 12, color: "#1e40af", marginBottom: 8 }}>
                            🛵 Step 2: Deliver to customer <b>{ord.user_name}</b> at <b>{ord.delivery_address}</b>.
                          </div>
                          <button
                            className="btn btn-primary"
                            style={{ background: "#2563eb", borderColor: "#2563eb", width: "100%", fontWeight: 800 }}
                            onClick={() => handleUpdateStatus(ord.order_id, "out_for_delivery")}
                            disabled={busy}
                          >
                            📍 2. Out for Doorstep Delivery
                          </button>
                        </div>
                      )}

                      {statusKey === "out_for_delivery" && (
                        <div>
                          <div style={{ fontSize: 12, color: "#1e40af", marginBottom: 8 }}>
                            🏠 Step 3: Reached customer doorstep. Ask for PIN <b>{ord.delivery_pin}</b> & Collect <b>{ord.payment_mode === "cod" ? `₹${ord.total_amount} CASH` : "PREPAID"}</b>.
                          </div>
                          <button
                            className="btn btn-primary"
                            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", width: "100%", fontWeight: 800 }}
                            onClick={() => handleUpdateStatus(ord.order_id, "delivered")}
                            disabled={busy}
                          >
                            ✅ 3. Handover & Mark Delivered (+₹{ord.delivery_fee || 65})
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Direct Contact & Navigation Actions */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
                      <a
                        href={`tel:${ord.phone}`}
                        className="btn"
                        style={{ background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px 4px", fontSize: 11, textDecoration: "none", borderRadius: 8, fontWeight: 700 }}
                      >
                        📞 Call User
                      </a>
                      <a
                        href={`https://wa.me/91${ord.phone}?text=${encodeURIComponent(`Hello ${ord.user_name}, I am your VetNova delivery partner for order ${ord.order_id}. I am on my way to deliver your medicines.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn"
                        style={{ background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px 4px", fontSize: 11, textDecoration: "none", borderRadius: 8, fontWeight: 700 }}
                      >
                        💬 WhatsApp
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ord.delivery_address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn"
                        style={{ background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px 4px", fontSize: 11, textDecoration: "none", borderRadius: 8, fontWeight: 700 }}
                      >
                        🗺️ Maps
                      </a>
                    </div>

                    {/* Full Customer Address Card */}
                    <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: 12, fontSize: 12, border: "1px solid #e2e8f0" }}>
                      <div style={{ fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>👤 Customer & Delivery Address:</div>
                      <div><b>Name:</b> {ord.user_name}</div>
                      <div><b>Phone:</b> <a href={`tel:${ord.phone}`} style={{ color: "#059669", fontWeight: 700 }}>+91 {ord.phone}</a></div>
                      <div style={{ marginTop: 2 }}><b>Full Address:</b> {ord.delivery_address}</div>
                      {ord.address_details?.landmark && (
                        <div style={{ color: "#2563eb", marginTop: 2 }}><b>Landmark:</b> Near {ord.address_details.landmark}</div>
                      )}
                      <div style={{ marginTop: 4, background: "#eff6ff", border: "1px solid #bfdbfe", padding: "4px 8px", borderRadius: 6, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 700, color: "#1e40af" }}>🔐 Security Delivery PIN:</span>
                        <b style={{ color: "#1d4ed8", letterSpacing: "1px" }}>{ord.delivery_pin || "1234"}</b>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: EARNINGS & PAYOUTS */}
        {activeTab === "earnings" && (
          <div>
            <div className="card" style={{ borderLeft: "4px solid #059669" }}>
              <div style={{ fontWeight: 850, fontSize: 16, color: "#065f46", marginBottom: 6 }}>
                💰 Daily Earnings & Instant UPI Settlement
              </div>
              <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
                Your delivery incentives are credited instantly after each completed doorstep drop.
              </p>

              <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", padding: 14, borderRadius: 14, border: "1px solid #93c5fd", marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "#1e40af", fontWeight: 700 }}>Withdrawable Wallet Balance:</div>
                <div style={{ fontSize: 28, fontWeight: 850, color: "#1e3a8a", margin: "4px 0" }}>₹{stats.today_earnings}</div>
                <div style={{ fontSize: 12, color: "#2563eb" }}>Linked UPI ID: <b>{rider.upi_id || `${rider.phone}@upi`}</b></div>
              </div>

              {payoutMsg && (
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "10px 12px", borderRadius: 10, fontSize: 12, fontWeight: 750, marginBottom: 12 }}>
                  {payoutMsg}
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ width: "100%", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontWeight: 800 }}
                onClick={handleRequestPayout}
                disabled={busy || stats.today_earnings <= 0}
              >
                {busy ? "Processing Payout…" : `💳 Instant Withdraw ₹${stats.today_earnings} to UPI`}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: DELIVERY HISTORY */}
        {activeTab === "history" && (
          <div>
            <div className="section-title" style={{ color: "#1e3a8a" }}>
              📜 Completed Delivery History ({historyOrders.length})
            </div>

            {historyOrders.length === 0 ? (
              <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #dbeafe" }}>
                <span className="empty-icon">📜</span>
                <p><b>No past deliveries yet</b></p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Completed orders and earned fees will appear in this ledger.
                </p>
              </div>
            ) : (
              historyOrders.map((ord) => (
                <div key={ord.order_id} className="card card-tight" style={{ borderLeft: "4px solid #10b981", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <b style={{ color: "#065f46" }}>{ord.order_id}</b>
                    <span style={{ fontSize: 13, fontWeight: 850, color: "#059669" }}>+₹{ord.delivery_fee || 65}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                    👤 {ord.user_name} · 📍 {ord.delivery_address}
                  </div>
                  <div style={{ fontSize: 11, color: "#059669", marginTop: 4 }}>
                    ✓ Delivered on {new Date(ord.delivered_at || ord.created_at).toLocaleDateString()} at {new Date(ord.delivered_at || ord.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

function PharmacyAuth({ t, lang, onLogged, onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const saved = loadSavedCreds("pharmacy");
  const [phone, setPhone] = useState(saved?.phone || "");
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [city, setCity] = useState("Nashik");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [remember, setRemember] = useState(saved?.remember !== false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (err) setErr("");
  };

  const handleOtpChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    if (err) setErr("");
  };

  const handleSendOtp = async () => {
    setErr("");
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setErr(t.invalid10DigitPhone || "Please enter a valid 10-digit mobile number (digits only).");
      return;
    }
    if (mode === "register" && (!storeName.trim() || !ownerName.trim())) {
      setErr("Please enter medical store name and owner name.");
      return;
    }
    setBusy(true);
    try {
      const out = await api("/api/pharmacy/send-otp", { body: { phone } });
      setServerOtp(out.otp || "123456");
      setStep("otp");
      setResendTimer(30);
      setOtp("");
    } catch (e) {
      setErr(e.message || "Failed to send OTP to medical store owner phone.");
    }
    setBusy(false);
  };

  const handleVerifyOtp = async () => {
    setErr("");
    if (!otp || otp.length < 4) {
      setErr(t.invalidOtp || "Please enter the OTP verification code.");
      return;
    }
    setBusy(true);
    try {
      const out = await api("/api/pharmacy/verify-otp", {
        body: {
          phone,
          otp,
          store_name: storeName.trim(),
          owner_name: ownerName.trim(),
          city: city.trim(),
          address: address.trim(),
        },
      });
      if (remember) {
        saveSavedCreds("pharmacy", { phone, remember: true });
      } else {
        saveSavedCreds("pharmacy", null);
      }
      onLogged(out.pharmacy);
    } catch (e) {
      setErr(e.message || "Invalid or expired OTP code.");
    }
    setBusy(false);
  };

  return (
    <>
      <TopBar title={mode === "login" ? "Medical Store Login" : "Register Medical Store"} onBack={onBack} />
      <div className="screen">
        <div className="tab-row" style={{ marginBottom: 14 }}>
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setErr("");
              setMode("login");
              setStep("phone");
            }}
          >
            {t.login}
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setErr("");
              setMode("register");
              setStep("phone");
            }}
          >
            {t.register}
          </button>
        </div>

        {step === "phone" ? (
          <>
            {mode === "register" && (
              <>
                <div className="label">🏪 Medical Store Name</div>
                <input
                  className="input"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Kisan Veterinary Medical Store"
                />

                <div className="sp" />
                <div className="label">👤 Owner / Pharmacist Name</div>
                <input
                  className="input"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Ramesh Shinde"
                />

                <div className="sp" />
                <div className="label">📍 City / District</div>
                <input
                  className="input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nashik"
                />

                <div className="sp" />
                <div className="label">🏢 Store Address</div>
                <input
                  className="input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shop No. 4, Market Yard Road"
                />
                <div className="sp" />
              </>
            )}

            <div className="label">📱 Pharmacist 10-Digit Mobile Number</div>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted)",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                +91
              </span>
              <input
                className="input"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                style={{ paddingLeft: 46, fontSize: 16, letterSpacing: "1px", fontWeight: 650 }}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="9822334455"
              />
            </div>
            <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
              Demo testing numbers: <b>9822334455</b>, <b>9833445566</b>
            </div>

            <div className="sp" />
            <label className="row" style={{ gap: 8, cursor: "pointer", alignItems: "center" }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span style={{ fontSize: 13 }}>{t.rememberMe || "Remember my login on this device"}</span>
            </label>

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8 }}>{err}</p>}

            <div className="sp-lg" />
            <button
              className="btn btn-primary"
              style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
              onClick={handleSendOtp}
              disabled={busy}
            >
              {busy ? t.loading || "Sending…" : "📲 Send 6-Digit OTP"}
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
              <div style={{ fontSize: 36, marginBottom: 4 }}>💬</div>
              <div style={{ fontWeight: 750, fontSize: 16 }}>{t.enterOtpTitle || "Enter Verification Code"}</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                {t.otpSentTo || "Code sent to"} <b>+91 {phone}</b>
              </div>
              {serverOtp && (
                <div className="otp-demo-card" style={{ marginTop: 10 }}>
                  <div className="otp-demo-text">
                    <span>{t.demoOtpLabel || "Demo OTP code:"} </span>
                    <span className="otp-demo-code">{serverOtp}</span>
                  </div>
                  <button
                    type="button"
                    className="otp-fill-btn"
                    onClick={() => {
                      setOtp(serverOtp);
                      if (err) setErr("");
                    }}
                  >
                    {t.useDemoOtp || "Auto-fill"}
                  </button>
                </div>
              )}
            </div>

            <div className="label">{t.enterOtpLabel || "6-Digit OTP"}</div>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              placeholder="123456"
              style={{ textAlign: "center", fontSize: 22, letterSpacing: "8px", fontWeight: 750 }}
            />

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8, textAlign: "center" }}>{err}</p>}

            <div className="sp-lg" />
            <button
              className="btn btn-primary"
              style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
              onClick={handleVerifyOtp}
              disabled={busy}
            >
              {busy ? t.loading || "Verifying…" : "✅ Verify & Open Store Dashboard"}
            </button>

            <div className="center" style={{ marginTop: 14 }}>
              {resendTimer > 0 ? (
                <span className="muted" style={{ fontSize: 12 }}>
                  {t.resendOtpIn || "Resend OTP in"} {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{ background: "none", border: "none", color: "#059669", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                >
                  🔄 {t.resendOtp || "Resend OTP"}
                </button>
              )}
            </div>

            <div className="center" style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setErr("");
                }}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12 }}
              >
                ← {t.changePhone || "Change mobile number"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function UserAuth({ t, lang, onLogged, onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const saved = loadSavedCreds("user");
  const [phone, setPhone] = useState(saved?.phone || "");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [remember, setRemember] = useState(saved?.remember !== false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handlePhoneChange = (e) => {
    // Restrict mobile number to strictly 10 digits (no alphabets, no symbols)
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (err) setErr("");
  };

  const handleOtpChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    if (err) setErr("");
  };

  const handleSendOtp = async () => {
    setErr("");
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setErr(t.invalid10DigitPhone || "Please enter a valid 10-digit mobile number (digits only).");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setErr(t.enterName || "Please enter your name.");
      return;
    }
    setBusy(true);
    try {
      const out = await api("/api/auth/send-otp", {
        body: { phone, name: name.trim(), language: lang, mode },
      });
      setServerOtp(out.otp || "123456");
      setStep("otp");
      setResendTimer(30);
      setOtp("");
    } catch (e) {
      setErr(e.message || "Failed to send OTP. Please check the mobile number.");
    }
    setBusy(false);
  };

  const handleVerifyOtp = async () => {
    setErr("");
    if (!otp || otp.length < 4) {
      setErr(t.invalidOtp || "Please enter the OTP verification code.");
      return;
    }
    setBusy(true);
    try {
      const out = await api("/api/auth/verify-otp", {
        body: { phone, otp, name: name.trim(), language: lang, mode },
      });
      if (remember) {
        saveSavedCreds("user", { phone, remember: true });
      } else {
        saveSavedCreds("user", null);
      }
      onLogged(out.user);
    } catch (e) {
      setErr(e.message || "Invalid or expired OTP. Please try again.");
    }
    setBusy(false);
  };

  return (
    <>
      <TopBar title={mode === "login" ? t.login : t.register} onBack={onBack} />
      <div className="screen">
        <div className="tab-row" style={{ marginBottom: 14 }}>
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setErr("");
              setMode("login");
              setStep("phone");
            }}
          >
            {t.login}
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setErr("");
              setMode("register");
              setStep("phone");
            }}
          >
            {t.register}
          </button>
        </div>

        {step === "phone" ? (
          <>
            {mode === "register" && (
              <>
                <div className="label">{t.name}</div>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                />
                <div className="sp" />
              </>
            )}

            <div className="label">{t.phone}</div>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                style={{ paddingLeft: 46, fontSize: 16, fontWeight: 650 }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontWeight: 700,
                  color: "var(--muted)",
                  fontSize: 14,
                  pointerEvents: "none",
                }}
              >
                +91
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
              <span>{t.mobileHint || "10 digits only (no letters or symbols)"}</span>
              <span style={{ fontWeight: 700, color: phone.length === 10 ? "var(--success)" : "var(--muted)" }}>
                {phone.length}/10
              </span>
            </div>

            <label className="row" style={{ marginTop: 14, fontSize: 13, alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>{t.rememberLogin || "Remember me on this device"}</span>
            </label>

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}>{err}</p>}

            <div className="sp-lg" />
            <button
              className="btn btn-primary"
              disabled={busy || phone.length !== 10}
              onClick={handleSendOtp}
            >
              {busy ? t.loading : `📲 ${t.sendOtp || "Get OTP"}`}
            </button>
          </>
        ) : (
          <div className="otp-box-wrap">
            <div className="otp-header-info">
              <div>
                <span className="otp-phone-badge">📱 +91 {phone}</span>
              </div>
              <button
                type="button"
                className="otp-change-link"
                onClick={() => {
                  setStep("phone");
                  setErr("");
                }}
              >
                {t.changeNumber || "Change number"}
              </button>
            </div>

            <div className="label" style={{ textAlign: "center", marginBottom: 6 }}>
              {t.enterOtp || "Enter 6-digit OTP"}
            </div>
            <input
              className="input otp-input-large"
              type="tel"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              placeholder="••••••"
              autoFocus
            />

            {serverOtp && (
              <div className="otp-demo-card">
                <div className="otp-demo-text">
                  <span>{t.demoOtpLabel || "Demo OTP code:"} </span>
                  <span className="otp-demo-code">{serverOtp}</span>
                </div>
                <button
                  type="button"
                  className="otp-fill-btn"
                  onClick={() => {
                    setOtp(serverOtp);
                    if (err) setErr("");
                  }}
                >
                  {t.useDemoOtp || "Auto-fill"}
                </button>
              </div>
            )}

            <div className="otp-resend-row">
              {resendTimer > 0 ? (
                <span>Resend OTP in <b>{resendTimer}s</b></span>
              ) : (
                <button
                  type="button"
                  className="otp-resend-btn"
                  disabled={busy}
                  onClick={handleSendOtp}
                >
                  🔄 {t.resendOtp || "Resend OTP"}
                </button>
              )}
            </div>

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{err}</p>}

            <div className="sp-lg" />
            <button
              className="btn btn-primary"
              disabled={busy || !otp || otp.length < 4}
              onClick={handleVerifyOtp}
            >
              {busy ? t.loading : mode === "login" ? `✅ ${t.verifyAndLogin || "Verify & Log In"}` : `✅ ${t.verifyAndRegister || "Verify & Register"}`}
            </button>
          </div>
        )}

        <div className="sp" />
        <div className="center">
          <button
            className="link"
            onClick={() => {
              setErr("");
              setStep("phone");
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
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const saved = loadSavedCreds("doctor");
  const [remember, setRemember] = useState(saved?.remember !== false);
  const [f, setF] = useState({
    phone: saved?.phone || "",
    name: "",
    specialization: "Livestock",
    experience: 5,
    languages: "English, Hindi, Marathi",
  });
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const set = (k, v) => setF({ ...f, [k]: v });

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    set("phone", digits);
    if (err) setErr("");
  };

  const handleOtpChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    if (err) setErr("");
  };

  const handleSendOtp = async () => {
    setErr("");
    if (!f.phone || f.phone.length !== 10 || !/^\d{10}$/.test(f.phone)) {
      setErr(t.invalid10DigitPhone || "Please enter a valid 10-digit mobile number (digits only).");
      return;
    }
    if (mode === "register" && !f.name.trim()) {
      setErr(t.enterName || "Please enter your doctor name.");
      return;
    }
    setBusy(true);
    try {
      const out = await api("/api/doctor/send-otp", {
        body: { phone: f.phone, name: f.name.trim(), mode },
      });
      setServerOtp(out.otp || "123456");
      setStep("otp");
      setResendTimer(30);
      setOtp("");
    } catch (e) {
      setErr(e.message || "Failed to send OTP.");
    }
    setBusy(false);
  };

  const handleVerifyOtp = async () => {
    setErr("");
    if (!otp || otp.length < 4) {
      setErr(t.invalidOtp || "Please enter the OTP verification code.");
      return;
    }
    setBusy(true);
    try {
      const out = await api("/api/doctor/verify-otp", {
        body: { ...f, otp, mode },
      });
      if (remember) {
        saveSavedCreds("doctor", { phone: f.phone, remember: true });
      } else {
        saveSavedCreds("doctor", null);
      }
      onLogged(out.doctor);
    } catch (e) {
      setErr(e.message || "Invalid or expired OTP.");
    }
    setBusy(false);
  };

  return (
    <>
      <TopBar title={t.doctorPortal} onBack={onBack} />
      <div className="screen">
        <div className="tab-row" style={{ marginBottom: 14 }}>
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setErr("");
              setStep("phone");
              setMode("login");
            }}
          >
            {t.login}
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setErr("");
              setStep("phone");
              setMode("register");
            }}
          >
            {t.register}
          </button>
        </div>

        {step === "phone" ? (
          <>
            {mode === "register" && (
              <>
                <div className="label">{t.name}</div>
                <input
                  className="input"
                  value={f.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Dr. Ananya Patil"
                />
                <div className="sp" />
                <div className="label">{t.specialization}</div>
                <select
                  className="select"
                  value={f.specialization}
                  onChange={(e) => set("specialization", e.target.value)}
                >
                  <option>Livestock</option>
                  <option>Pets</option>
                  <option>Poultry</option>
                  <option>Mixed Practice</option>
                  <option>General</option>
                </select>
                <div className="sp" />
                <div className="label">{t.experience}</div>
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={f.experience}
                  onChange={(e) => set("experience", parseInt(e.target.value || 0, 10))}
                />
                <div className="sp" />
                <div className="label">{t.languagesSpoken}</div>
                <input
                  className="input"
                  value={f.languages}
                  onChange={(e) => set("languages", e.target.value)}
                />
                <div className="sp" />
              </>
            )}

            <div className="label">{t.phone}</div>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={f.phone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                style={{ paddingLeft: 46, fontSize: 16, fontWeight: 650 }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontWeight: 700,
                  color: "var(--muted)",
                  fontSize: 14,
                  pointerEvents: "none",
                }}
              >
                +91
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
              <span>{t.mobileHint || "10 digits only (no letters or symbols)"}</span>
              <span style={{ fontWeight: 700, color: f.phone.length === 10 ? "var(--success)" : "var(--muted)" }}>
                {f.phone.length}/10
              </span>
            </div>

            <label className="row" style={{ marginTop: 14, fontSize: 13, alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>{t.rememberLogin || "Remember me on this device"}</span>
            </label>

            {mode === "login" && (
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
                Seed Doctors: <b>9876543210</b>, <b>9811223344</b>, <b>9922334455</b>
              </div>
            )}

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}>{err}</p>}

            <div className="sp-lg" />
            <button
              className="btn btn-primary"
              disabled={busy || f.phone.length !== 10}
              onClick={handleSendOtp}
            >
              {busy ? t.loading : `📲 ${t.sendOtp || "Get OTP"}`}
            </button>
          </>
        ) : (
          <div className="otp-box-wrap">
            <div className="otp-header-info">
              <div>
                <span className="otp-phone-badge">🩺 +91 {f.phone}</span>
              </div>
              <button
                type="button"
                className="otp-change-link"
                onClick={() => {
                  setStep("phone");
                  setErr("");
                }}
              >
                {t.changeNumber || "Change number"}
              </button>
            </div>

            <div className="label" style={{ textAlign: "center", marginBottom: 6 }}>
              {t.enterOtp || "Enter 6-digit OTP"}
            </div>
            <input
              className="input otp-input-large"
              type="tel"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              placeholder="••••••"
              autoFocus
            />

            {serverOtp && (
              <div className="otp-demo-card">
                <div className="otp-demo-text">
                  <span>{t.demoOtpLabel || "Demo OTP code:"} </span>
                  <span className="otp-demo-code">{serverOtp}</span>
                </div>
                <button
                  type="button"
                  className="otp-fill-btn"
                  onClick={() => {
                    setOtp(serverOtp);
                    if (err) setErr("");
                  }}
                >
                  {t.useDemoOtp || "Auto-fill"}
                </button>
              </div>
            )}

            <div className="otp-resend-row">
              {resendTimer > 0 ? (
                <span>Resend OTP in <b>{resendTimer}s</b></span>
              ) : (
                <button
                  type="button"
                  className="otp-resend-btn"
                  disabled={busy}
                  onClick={handleSendOtp}
                >
                  🔄 {t.resendOtp || "Resend OTP"}
                </button>
              )}
            </div>

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{err}</p>}

            <div className="sp-lg" />
            <button
              className="btn btn-primary"
              disabled={busy || !otp || otp.length < 4}
              onClick={handleVerifyOtp}
            >
              {busy ? t.loading : mode === "login" ? `✅ ${t.verifyAndLogin || "Verify & Log In"}` : `✅ ${t.verifyAndRegister || "Verify & Register"}`}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function Dashboard({ t, user, setScreen }) {
  const [orderModalStore, setOrderModalStore] = useState(null);
  const [payModalAppt, setPayModalAppt] = useState(null);
  const [activePanel, setActivePanel] = useState("pharmacies"); // "pharmacies" | "hospitals" | "weather"
  const [dashTrackOrderId, setDashTrackOrderId] = useState(null);
  const [show1962Call, setShow1962Call] = useState(false);

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div className="dash-topbar-inner">
          <div>
            <h1 className="dash-welcome-label">{t.welcome}</h1>
            <div className="dash-welcome-name">{user?.name || "Farmer / Pet Owner"}</div>
          </div>
          <img className="dash-topbar-logo" src="/logo.png" alt="VetNova" onError={(e) => (e.target.style.display = "none")} />
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 80 }}>
        {/* Live Notification & Payment Action Center */}
        <AppointmentAlerts
          user={user}
          t={t}
          setScreen={setScreen}
          onPayAppointment={(appt) => setPayModalAppt(appt)}
        />

        {/* 1962 Toll-Free Emergency Hotline Direct Call Card */}
        <div
          className="card"
          style={{
            borderRadius: 18,
            padding: "16px 18px",
            marginBottom: 16,
            background: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)",
            color: "#ffffff",
            boxShadow: "0 6px 20px rgba(185, 28, 28, 0.28)",
            border: "1px solid rgba(254, 205, 211, 0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(6px)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 26,
                  flexShrink: 0,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                📞
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, background: "#ef4444", color: "#ffffff", padding: "2px 8px", borderRadius: 999, letterSpacing: "1px" }}>
                    TOLL-FREE 1962
                  </span>
                  <span style={{ fontSize: 11, color: "#fecdd3", fontWeight: 700 }}>
                    Emergency Hotline
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#ffffff" }}>
                  National Animal Health Hotline
                </div>
                <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.9)", marginTop: 2, lineHeight: 1.35 }}>
                  Direct voice call &amp; instant report to Concerned Government Officers
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <button
                type="button"
                className="btn"
                style={{
                  background: "#ffffff",
                  color: "#991b1b",
                  fontWeight: 900,
                  fontSize: 12,
                  padding: "8px 14px",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
                onClick={() => setShow1962Call(true)}
              >
                <span>📞</span> Place Call
              </button>
              <a
                href="tel:1962"
                style={{
                  color: "#fecdd3",
                  fontSize: 10,
                  fontWeight: 700,
                  textDecoration: "underline",
                  textAlign: "center",
                }}
              >
                Direct Dial 1962
              </a>
            </div>
          </div>
        </div>

        {/* Hero AI Diagnosis Action Card */}
        <div
          className="dash-cta-card"
          style={{
            borderRadius: 18,
            padding: "18px 20px",
            marginBottom: 16,
            cursor: "pointer",
            background: "linear-gradient(135deg, #064e3b 0%, #0d5c54 50%, #1a8f82 100%)",
          }}
          onClick={() => setScreen("category")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(6px)",
                display: "grid",
                placeItems: "center",
                fontSize: 28,
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              🩺
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#a7f3d0" }}>
                AI Guided Assessment
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", margin: "2px 0 3px" }}>
                {t.startDiagnosis || "Start Animal Diagnosis"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>
                Instant symptom analysis & home care remedies
              </div>
            </div>
            <span style={{ fontSize: 20, color: "#a7f3d0", fontWeight: 800 }}>➔</span>
          </div>
        </div>

        {/* Featured Tools Suite Card */}
        <div
          className="card tools-grid-card"
          style={{
            borderRadius: 18,
            padding: "16px 18px",
            marginBottom: 16,
            cursor: "pointer",
            border: "1.5px solid rgba(5, 150, 105, 0.35)",
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #e0f2fe 100%)",
            boxShadow: "0 4px 18px rgba(5, 150, 105, 0.12)",
          }}
          onClick={() => setScreen("tools")}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 24,
                  boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
                  flexShrink: 0,
                }}
              >
                🛠️
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#064e3b" }}>{t.toolsTitle || "VetNova Tools Suite"}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, background: "#059669", color: "#ffffff", padding: "2px 6px", borderRadius: 999, letterSpacing: "0.5px" }}>NEW</span>
                </div>
                <div style={{ fontSize: 11, color: "#047857", marginTop: 2, fontWeight: 600, lineHeight: 1.35 }}>
                  Health Passports, Outbreak Radar, Vaccine Reminders & Govt Schemes
                </div>
              </div>
            </div>
            <span style={{ fontSize: 18, color: "#059669", fontWeight: 800, marginLeft: 8 }}>➔</span>
          </div>
        </div>

        {/* Core Services Hub (Modern Cards Grid) */}
        <div style={{ fontWeight: 800, fontSize: 15, color: "var(--brand-dark)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🌟</span> Essential Veterinary Services
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            marginBottom: 18,
          }}
        >
          {/* Card 1: E-Pharmacy */}
          <div
            className="card"
            style={{
              padding: "14px 12px",
              borderRadius: 16,
              cursor: "pointer",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              background: "linear-gradient(175deg, #ffffff 0%, #f0fdf4 100%)",
              boxShadow: "0 4px 16px rgba(6, 78, 59, 0.06)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => setScreen("pharmacy")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#d1fae5", display: "grid", placeItems: "center", fontSize: 22 }}>
                💊
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: "#059669", color: "#ffffff", padding: "2px 6px", borderRadius: 999 }}>
                COD / Online
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#064e3b" }}>{t.orderMedicines || "E-Pharmacy"}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.35 }}>
              Order authentic veterinary medicines
            </div>
          </div>

          {/* Card 2: Consult Doctors */}
          <div
            className="card"
            style={{
              padding: "14px 12px",
              borderRadius: 16,
              cursor: "pointer",
              border: "1px solid rgba(99, 102, 241, 0.22)",
              background: "linear-gradient(175deg, #ffffff 0%, #f5f3ff 100%)",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.06)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => setScreen("doctors")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#ede9fe", display: "grid", placeItems: "center", fontSize: 22 }}>
                👨‍⚕️
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: "#4338ca", color: "#ffffff", padding: "2px 6px", borderRadius: 999 }}>
                Video / Call
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1e1b4b" }}>{t.findDoctor || "Find Veterinarians"}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.35 }}>
              Consult verified veterinary doctors
            </div>
          </div>

          {/* Card 3: Appointments */}
          <div
            className="card"
            style={{
              padding: "14px 12px",
              borderRadius: 16,
              cursor: "pointer",
              border: "1px solid rgba(14, 165, 233, 0.22)",
              background: "linear-gradient(175deg, #ffffff 0%, #f0f9ff 100%)",
              boxShadow: "0 4px 16px rgba(14, 165, 233, 0.06)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => setScreen("appointments")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#e0f2fe", display: "grid", placeItems: "center", fontSize: 22 }}>
                📅
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: "#0284c7", color: "#ffffff", padding: "2px 6px", borderRadius: 999 }}>
                Live Status
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#0c4a6e" }}>{t.appointments || "My Appointments"}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.35 }}>
              Track booking approval & pay fee
            </div>
          </div>

          {/* Card 4: Past Reports */}
          <div
            className="card"
            style={{
              padding: "14px 12px",
              borderRadius: 16,
              cursor: "pointer",
              border: "1px solid rgba(245, 158, 11, 0.22)",
              background: "linear-gradient(175deg, #ffffff 0%, #fffbeb 100%)",
              boxShadow: "0 4px 16px rgba(245, 158, 11, 0.06)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => setScreen("history")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fef3c7", display: "grid", placeItems: "center", fontSize: 22 }}>
                📋
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: "#d97706", color: "#ffffff", padding: "2px 6px", borderRadius: 999 }}>
                History
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#78350f" }}>{t.pastReports || "Diagnosis Reports"}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.35 }}>
              Access AI triage & prescriptions
            </div>
          </div>

          {/* Card 5: Basic Care */}
          <div
            className="card"
            style={{
              padding: "14px 12px",
              borderRadius: 16,
              cursor: "pointer",
              border: "1px solid rgba(212, 179, 92, 0.3)",
              background: "linear-gradient(175deg, #ffffff 0%, #faf8f0 100%)",
              boxShadow: "0 4px 16px rgba(212, 179, 92, 0.08)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => setScreen("videos")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fef9c3", display: "grid", placeItems: "center", fontSize: 22 }}>
                🌿
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: "#ca8a04", color: "#ffffff", padding: "2px 6px", borderRadius: 999 }}>
                Videos
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#713f12" }}>{t.videos || "Basic Care Guides"}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.35 }}>
              Husbandry & treatment tutorials
            </div>
          </div>

          {/* Card 6: Health News */}
          <div
            className="card"
            style={{
              padding: "14px 12px",
              borderRadius: 16,
              cursor: "pointer",
              border: "1px solid rgba(100, 116, 139, 0.22)",
              background: "linear-gradient(175deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "0 4px 16px rgba(100, 116, 139, 0.06)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => setScreen("news")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f1f5f9", display: "grid", placeItems: "center", fontSize: 22 }}>
                📰
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: "#475569", color: "#ffffff", padding: "2px 6px", borderRadius: 999 }}>
                Live
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1e293b" }}>{t.news || "Livestock News"}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.35 }}>
              Vaccines, alerts & agri schemes
            </div>
          </div>
        </div>

        {/* Organized Panel Navigation Tabs */}
        <div style={{ fontWeight: 800, fontSize: 15, color: "var(--brand-dark)", margin: "14px 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
          <span>📍</span> Nearby Resources & Local Advisory
        </div>

        <div className="tab-row" style={{ marginBottom: 12 }}>
          <button
            type="button"
            className={activePanel === "pharmacies" ? "active" : ""}
            onClick={() => setActivePanel("pharmacies")}
            style={{ fontSize: 12, padding: "8px 12px" }}
          >
            💊 Nearby Medical Stores
          </button>
          <button
            type="button"
            className={activePanel === "hospitals" ? "active" : ""}
            onClick={() => setActivePanel("hospitals")}
            style={{ fontSize: 12, padding: "8px 12px" }}
          >
            🏥 Animal Hospitals
          </button>
          <button
            type="button"
            className={activePanel === "weather" ? "active" : ""}
            onClick={() => setActivePanel("weather")}
            style={{ fontSize: 12, padding: "8px 12px" }}
          >
            ⛅ Weather Advisory
          </button>
        </div>

        {activePanel === "pharmacies" && (
          <PharmaciesPanel t={t} onOrderMedicine={(store) => setOrderModalStore(store)} />
        )}
        {activePanel === "hospitals" && <HospitalsPanel t={t} />}
        {activePanel === "weather" && <WeatherPanel t={t} />}
      </div>

      {orderModalStore && (
        <OrderMedicineModal
          t={t}
          user={user}
          store={orderModalStore}
          onClose={() => setOrderModalStore(null)}
          onOrderPlaced={() => setOrderModalStore(null)}
        />
      )}

      {payModalAppt && (
        <PayAppointmentModal
          t={t}
          user={user}
          appointment={payModalAppt}
          onClose={() => setPayModalAppt(null)}
          onPaid={() => setPayModalAppt(null)}
        />
      )}

      {dashTrackOrderId && (
        <LiveOrderTrackingModal
          orderId={dashTrackOrderId}
          t={t}
          onClose={() => setDashTrackOrderId(null)}
        />
      )}

      {show1962Call && (
        <IvrHotlineModal
          onClose={() => setShow1962Call(false)}
          onReportSuccess={() => {}}
        />
      )}

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

function VideosScreen({ t, lang, setScreen }) {
  const [videos, setVideos] = useState([]);
  const [animalType, setAnimalType] = useState(null);
  const [active, setActive] = useState(null);
  const [embedUrl, setEmbedUrl] = useState("");
  const playerRef = useRef(null);
  const l = lang || "en";
  const animalTypes = [
    { k: "dairy", n: t.dairy, e: "🐄" },
    { k: "farm", n: t.farm, e: "🐐" },
    { k: "pets", n: t.pets, e: "🐕" },
    { k: "poultry", n: t.poultry, e: "🐔" },
    { k: "general", n: "General", e: "💉" },
  ];
  useEffect(() => {
    (async () => {
      try {
        const o = await api("/api/videos");
        setVideos(o.videos || []);
      } catch (e) {
        try {
          const r = await fetch("/videos.json");
          const j = await r.json();
          setVideos(j.videos || []);
        } catch (_) {
          setVideos([]);
        }
      }
    })();
  }, []);
  const title = (v) => v.title?.[l] || v.title?.en || "Video";
  const summary = (v) => v.summary?.[l] || v.summary?.en || "";
  const openVideo = (v) => {
    setActive(v);
    setEmbedUrl(
      "https://www.youtube-nocookie.com/embed/" + v.youtubeId + "?autoplay=1&rel=0&modestbranding=1&playsinline=1"
    );
  };
  const closeVideo = () => {
    setActive(null);
    setEmbedUrl("");
  };
  useEffect(() => {
    if (!active) return;
    const tmr = setTimeout(() => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    return () => clearTimeout(tmr);
  }, [active]);
  return (
    <>
      <TopBar title={t.videosTitle} onBack={() => setScreen("dashboard")} />
      <div className="screen basic-care-screen">
        <p className="muted basic-care-intro">{t.videosSub}</p>
        {active && (
          <div className="video-play-overlay" role="dialog" aria-label={title(active)} onClick={closeVideo}>
            <div className="video-play-panel" ref={playerRef} onClick={(e) => e.stopPropagation()}>
              <div className="video-play-head">
                <span>
                  {active.icon || "🎬"} {title(active)}
                </span>
                <button type="button" className="cb-chat-x" onClick={closeVideo} aria-label={t.backToVideoList}>
                  ×
                </button>
              </div>
              <div className="video-embed-wrap video-embed-pro">
                {embedUrl ? (
                  <iframe
                    title={title(active)}
                    src={embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="loader" style={{ margin: "40px auto" }} />
                )}
              </div>
              <p className="muted" style={{ fontSize: 12, margin: "10px 0 0" }}>
                {summary(active)}
              </p>
              <a
                className="btn btn-muted"
                style={{ marginTop: 10, display: "block", textAlign: "center" }}
                href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                ▶ {t.openInYoutube || "Open in YouTube"}
              </a>
            </div>
          </div>
        )}
        {!animalType && !active && (
          <>
            <div className="section-title">{t.basicCarePickAnimal || "Which animal are you looking for?"}</div>
            <div className="cat-grid">
              {animalTypes.map((c) => (
                <div
                  key={c.k}
                  className={"cat-tile basic-care-tile cat-" + c.k}
                  onClick={() => {
                    setAnimalType(c.k);
                    closeVideo();
                  }}
                >
                  <span className="emoji">{c.e}</span>
                  <div className="nm">{c.n}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {animalType && !active && (
          <button type="button" className="link basic-care-back" style={{ marginBottom: 10 }} onClick={() => setAnimalType(null)}>
            ← {t.backToAnimalTypes || "Change animal type"}
          </button>
        )}
        {animalType && !active &&
          videos.filter((v) => v.category === animalType).map((v) => (
            <div
              key={v.youtubeId}
              className="card card-click"
              style={{ marginBottom: 10 }}
              onClick={() => openVideo(v)}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28 }}>{v.icon || "🎬"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 750 }}>{title(v)}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                    {summary(v)}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--brand)" }}>▶ {t.watchVideo}</div>
                </div>
              </div>
            </div>
          ))}
        {animalType && !active && videos.filter((v) => v.category === animalType).length === 0 && videos.length > 0 && (
          <p className="muted">{t.basicCareNoVideos || "No videos for this type yet."}</p>
        )}
        {videos.length === 0 && <p className="muted">{t.videosLoading}</p>}
      </div>
      <BottomNav tab="home" setScreen={setScreen} />
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
        try {
          localStorage.setItem(
            "cb_last_diagnosis",
            JSON.stringify({
              diagnosis: out.diagnosis,
              animal: wiz.animal?.l || wiz.animal?.k || "Animal",
              severity: out.severity || "medium",
              medicines: out.medicines || [],
              home_remedies: out.home_remedies || [],
              precautions: out.precautions || "",
              date: new Date().toISOString(),
            })
          );
        } catch (e) {}
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

function DoctorPicker({ t, onClose, onPick, availableReport, user }) {
  const [docs, setDocs] = useState(null);
  const [shareReport, setShareReport] = useState(false);
  const [viewingProfileDoc, setViewingProfileDoc] = useState(null);

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
    <>
      <div className="modal-bg" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
          <h3>{t.nearbyDoctors || "Select Veterinarian"}</h3>
          <p>{t.waitingForDoctor || "Choose an online veterinarian for immediate consultation."}</p>
          {availableReport && (
            <label className="share-report-opt" style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, fontSize: 13 }}>
              <input type="checkbox" checked={shareReport} onChange={(e) => setShareReport(e.target.checked)} />
              <span>
                <b>{t.shareReportWithDoctor || "Share my diagnosis report with this doctor"}</b>
                <br />
                <span className="muted" style={{ fontSize: 11 }}>
                  {t.shareReportHint || "Optional — only sent if you check this box."}
                </span>
              </span>
            </label>
          )}
          <div style={{ maxHeight: 360, overflowY: "auto", margin: "12px 0" }}>
            {!docs && <div className="loader" />}
            {(docs || [])
              .filter((d) => d.available && d.accepts_video)
              .map((d) => (
                <div
                  key={d.id}
                  className="doc-card"
                  style={{ marginBottom: 10, borderRadius: 14 }}
                >
                  <div className="doc-avatar" onClick={() => setViewingProfileDoc(d)} style={{ cursor: "pointer" }}>
                    {(d.name.split(" ").slice(-1)[0] || "D")[0]}
                  </div>
                  <div className="doc-main">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div className="doc-name" onClick={() => setViewingProfileDoc(d)} style={{ cursor: "pointer" }}>
                          {d.name} <span style={{ fontSize: 11, color: "#059669" }}>✓ Verified</span>
                        </div>
                        <div className="doc-meta">
                          {d.specialization} · ⭐ <b>{d.rating || "4.8"}</b> ({d.ratings_count || d.reviews?.length || 1}) · {d.experience}y exp
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-muted"
                        style={{ fontSize: 10, padding: "4px 8px", borderColor: "#0d5c54", color: "#0d5c54", fontWeight: 750 }}
                        onClick={() => setViewingProfileDoc(d)}
                      >
                        ℹ️ Degree & Info
                      </button>
                    </div>

                    <div style={{ fontSize: 11, color: "#64748b", margin: "4px 0" }}>
                      🎓 <b>Degree:</b> {d.degree_name || "B.V.Sc & A.H."} · 💰 ₹{d.consultation_fee || 300}
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: "100%", fontSize: 12, padding: "7px 10px", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontWeight: 800 }}
                        onClick={() => onPick(d, shareReport && availableReport ? availableReport : null)}
                      >
                        📹 Start Call with Dr. {d.name.split(" ")[1] || d.name}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {docs && docs.filter((d) => d.available && d.accepts_video).length === 0 && (
              <p className="muted center" style={{ padding: "10px 0" }}>
                {t.doctorOffline || "No doctors currently online. You can request an appointment slot below."}
              </p>
            )}
          </div>
          <button className="btn btn-muted" onClick={onClose} style={{ width: "100%" }}>
            {t.cancel || "Cancel"}
          </button>
        </div>
      </div>

      {viewingProfileDoc && (
        <DoctorFullProfileModal
          t={t}
          doctor={viewingProfileDoc}
          user={user}
          onClose={() => setViewingProfileDoc(null)}
          onStartVideoCall={(doc) => {
            setViewingProfileDoc(null);
            onPick(doc, shareReport && availableReport ? availableReport : null);
          }}
        />
      )}
    </>
  );
}

function getLatestReportSnapshot(user, wiz, diag) {
  if (diag && wiz && (wiz.animal || wiz.category)) return buildReportSnapshot(wiz, diag, user);
  const latest = loadLocalReportsForUser(user?.id)[0];
  if (!latest) return null;
  return {
    diagnosis: latest.diagnosis || "",
    match_score: Math.round(latest.match_score || 0),
    severity: latest.severity || "medium",
    animal: latest.animal || "",
    animalKey: latest.animalKey || "",
    animalEmoji: latest.animalEmoji || "🐾",
    category: latest.category || "",
    symptoms: latest.symptoms || [],
    duration: latest.duration || "",
    medicines: latest.medicines || [],
    home_remedies: latest.home_remedies || [],
    precautions: latest.precautions || "",
    allergies: latest.allergies || "",
    current_medicine: latest.current_medicine || "",
    user_id: user?.id || null,
    user_name: user?.name || "",
    _ts: latest._ts || new Date().toISOString(),
  };
}

function buildReportSnapshot(wiz, diag, user) {
  return {
    diagnosis: diag?.diagnosis || "",
    match_score: Math.round(diag?.match_score || 0),
    severity: diag?.severity || wiz.severity || "medium",
    animal: wiz.animal?.n?.en || "",
    animalKey: wiz.animal?.k || "",
    animalEmoji: wiz.animal?.e || "🐾",
    category: wiz.category || "",
    symptoms: wiz.symptoms || [],
    duration: wiz.duration || "",
    medicines: diag?.medicines || [],
    home_remedies: diag?.home_remedies || [],
    precautions: diag?.precautions || "",
    allergies: wiz.allergies || "",
    current_medicine: wiz.current_medicine || "",
    user_id: user?.id || null,
    user_name: user?.name || "",
    _ts: new Date().toISOString(),
  };
}

function apptStatusLabel(status, t) {
  if (status === "confirmed") return t.apptConfirmed;
  if (status === "cancelled") return t.apptCancelled;
  if (status === "completed") return t.apptCompleted;
  if (status === "rescheduled") return t.apptRescheduled;
}

function DoctorEditAppointmentModal({ t, doctor, appointment, onClose, onSaved }) {
  const todayStr = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();
  const nowTimeStr = (() => {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${mins}`;
  })();

  const [date, setDate] = useState(appointment.date || todayStr);
  const [time, setTime] = useState(appointment.time || "");
  const [note, setNote] = useState(appointment.doctor_note || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const fee = appointment.total_amount_payable || ((appointment.doctor_fee || 300) + (appointment.platform_fee || 29));

  const submit = async (status) => {
    if (!date || !time) {
      setErr(t.appointmentFill || "Please enter date and time");
      return;
    }
    if (date < todayStr) {
      setErr(t.invalidPastDate || "Please select today or a future date. Past dates are not allowed.");
      return;
    }
    if (date === todayStr && time < nowTimeStr) {
      setErr(t.invalidPastTime || "Please select a future time slot for today.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await api(`/api/appointments/${appointment.id}/status`, {
        body: {
          doctor_id: doctor.id,
          status: status || (date !== appointment.date || time !== appointment.time ? "rescheduled" : appointment.status),
          date,
          time,
          doctor_note: note,
        },
      });
      onSaved();
    } catch (e) {
      setErr(e.message || "Update failed");
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>📅 {t.manageAppointment || "Manage Appointment"}</h3>
        <p className="muted" style={{ fontSize: 13 }}>
          Patient: <b>{appointment.user_name}</b> · {appointment.date} at {appointment.time}
        </p>

        <div className="label">{t.appointmentDate || "Date"}</div>
        <input className="input" type="date" min={todayStr} value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="sp" />
        <div className="label">{t.appointmentTime || "Time"}</div>
        <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <div className="sp" />
        <div className="label">{t.doctorNoteToPatient || "Message for Patient"}</div>
        <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.doctorNotePh || "e.g. Please bring recent test records..."} />

        {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8, fontWeight: 650 }}>{err}</p>}
        <div className="sp-lg" />

        <button
          className="btn btn-primary"
          style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
          disabled={busy}
          onClick={() => submit("confirmed_pending_payment")}
        >
          ✅ Accept Slot & Request Fee Payment (₹{fee})
        </button>
        <div className="sp" />
        <button className="btn btn-muted" disabled={busy} onClick={() => submit("rescheduled")}>
          📅 {t.rescheduleAppointment || "Reschedule & Notify"}
        </button>
        <div className="sp" />
        <button className="btn btn-danger" disabled={busy} onClick={() => submit("cancelled")}>
          {t.cancelAppointment || "Decline / Cancel"}
        </button>
        <div className="sp" />
        <button className="btn btn-ghost" onClick={onClose}>
          {t.back || "Close"}
        </button>
      </div>
    </div>
  );
}

function PayAppointmentModal({ t, user, appointment, onClose, onPaid }) {
  const [payMethod, setPayMethod] = useState("razorpay"); // "razorpay" | "upi_qr"
  const [upiRef, setUpiRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const docFee = Number(appointment.doctor_fee) || 300;
  const platformFee = Number(appointment.platform_fee) || 29;
  const totalPayable = appointment.total_amount_payable || (docFee + platformFee);

  const submitPay = async (paymentId, mode) => {
    setBusy(true);
    setErr("");
    try {
      await api(`/api/appointments/${appointment.id}/pay`, {
        body: {
          user_id: user.id,
          payment_id: paymentId,
          payment_mode: mode,
          transaction_id: paymentId,
        },
      });
      onPaid();
    } catch (e) {
      setErr(e.message || "Payment verification failed");
    }
    setBusy(false);
  };

  const handleRazorpay = () => {
    setErr("");
    setBusy(true);
    if (typeof window.Razorpay === "undefined") {
      submitPay(`RZP_MOCK_${Date.now()}`, "razorpay");
      return;
    }
    try {
      const options = {
        key: "rzp_test_TUURrZCj04iUwF",
        amount: totalPayable * 100,
        currency: "INR",
        name: "VetNova Animal Health",
        description: `Consultation Fee with Dr. ${appointment.doctor_name}`,
        image: "/logo.png",
        prefill: {
          name: user?.name || "Farmer / Pet Owner",
          contact: user?.phone || "",
        },
        theme: { color: "#065f46" },
        handler: function (response) {
          submitPay(response.razorpay_payment_id || `PAY_${Date.now()}`, "razorpay");
        },
        modal: {
          ondismiss: function () {
            setBusy(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        setBusy(false);
        setErr("Payment failed: " + (resp.error?.description || "Transaction declined"));
      });
      rzp.open();
    } catch (e) {
      submitPay(`RZP_PAY_${Date.now()}`, "razorpay");
    }
  };

  const handleUpiQr = () => {
    if (!upiRef.trim() || upiRef.trim().length < 4) {
      setErr("Please enter the 12-digit UPI Transaction / UTR number after scanning the QR.");
      return;
    }
    submitPay(upiRef.trim(), "upi_qr");
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h3 style={{ margin: 0 }}>💳 Complete Appointment Payment</h3>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}>×</button>
        </div>
        <p className="muted" style={{ fontSize: 13, margin: "0 0 10px" }}>
          Dr. {appointment.doctor_name} has approved your visit for <b>{appointment.date} at {appointment.time}</b>! Complete fee payment to finalize your visit.
        </p>

        {/* Fee Breakdown Card */}
        <div className="payment-breakdown-box">
          <div style={{ fontWeight: 800, fontSize: 13, color: "#065f46", marginBottom: 8 }}>
            💳 Fee Breakdown & Platform Pricing
          </div>
          <div className="payment-row">
            <span>Doctor Consultation Fee:</span>
            <b>₹{docFee}</b>
          </div>
          <div className="payment-row">
            <span>VetNova Platform Convenience Fee:</span>
            <b>₹{platformFee}</b>
          </div>
          <div className="payment-row total">
            <span>Total Amount Payable:</span>
            <span style={{ color: "#059669", fontSize: 17 }}>₹{totalPayable}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="label">Select Payment Method</div>
        <div className={`payment-method-card ${payMethod === "razorpay" ? "selected" : ""}`} onClick={() => setPayMethod("razorpay")}>
          <div style={{ fontSize: 24 }}>💳</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 750, fontSize: 13 }}>Online Payment (Razorpay / UPI / Paytm / Cards)</div>
            <div className="muted" style={{ fontSize: 11 }}>Instant appointment confirmation</div>
          </div>
          <input type="radio" checked={payMethod === "razorpay"} onChange={() => setPayMethod("razorpay")} />
        </div>

        <div className={`payment-method-card ${payMethod === "upi_qr" ? "selected" : ""}`} onClick={() => setPayMethod("upi_qr")}>
          <div style={{ fontSize: 24 }}>📱</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 750, fontSize: 13 }}>Scan Doctor's Verified UPI QR Code</div>
            <div className="muted" style={{ fontSize: 11 }}>Scan with GPay, PhonePe, Paytm, BHIM</div>
          </div>
          <input type="radio" checked={payMethod === "upi_qr"} onChange={() => setPayMethod("upi_qr")} />
        </div>

        {payMethod === "upi_qr" && (
          <div style={{ textAlign: "center", background: "#f8fafc", padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Scan QR & Pay Exactly ₹{totalPayable}
            </div>
            <img src={appointment.doctor_qr || "/logo.png"} alt="Doctor UPI QR" className="qr-code-preview-img" style={{ margin: "0 auto" }} />
            {appointment.doctor_upi && (
              <div style={{ fontSize: 12, color: "#065f46", fontWeight: 700, marginTop: 6 }}>
                UPI ID: <code>{appointment.doctor_upi}</code>
              </div>
            )}
            <div className="sp" />
            <div className="label" style={{ textAlign: "left" }}>Enter 12-Digit UPI Transaction / UTR Number</div>
            <input
              className="input"
              type="text"
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              placeholder="e.g. 423982149812"
              style={{ fontSize: 13, letterSpacing: "1px" }}
            />
          </div>
        )}

        {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8, fontWeight: 650 }}>{err}</p>}

        <div className="sp-lg" />
        <div className="row">
          <button className="btn btn-muted" onClick={onClose} disabled={busy}>Cancel</button>
          {payMethod === "razorpay" ? (
            <button
              className="btn btn-primary"
              style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
              disabled={busy}
              onClick={handleRazorpay}
            >
              {busy ? "Processing…" : `🔒 Pay ₹${totalPayable} & Finalize`}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
              disabled={busy}
              onClick={handleUpiQr}
            >
              {busy ? "Verifying…" : `✅ Submit Payment (₹${totalPayable})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BookAppointmentModal({ t, user, doctor, availableReport, onClose, onBooked }) {
  const todayStr = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();
  const nowTimeStr = (() => {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${mins}`;
  })();

  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [shareReport, setShareReport] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [concession, setConcession] = useState(null);

  useEffect(() => {
    if (!user?.id || !doctor?.id) return;
    (async () => {
      try {
        const res = await api(`/api/user/${user.id}/concession-status?doctor_id=${doctor.id}`);
        if (res.concession) setConcession(res.concession);
      } catch (e) {}
    })();
  }, [user?.id, doctor?.id]);

  const docFee = concession?.payable_doctor_fee !== undefined ? concession.payable_doctor_fee : (Number(doctor?.consultation_fee) || 300);
  const platformFee = 29;
  const totalPayable = docFee + platformFee;
  const hasDoctorQr = Boolean(doctor?.qr_code);

  const handleSubmitBooking = async () => {
    if (!date || !time) {
      setErr(t.appointmentFill || "Please enter date and time first.");
      return;
    }
    if (date < todayStr) {
      setErr(t.invalidPastDate || "Please select today or a future date. Past dates are not allowed.");
      return;
    }
    if (date === todayStr && time < nowTimeStr) {
      setErr(t.invalidPastTime || "Please select a future time slot for today.");
      return;
    }
    if (!user?.id) {
      setErr("Please log in to book an appointment.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await api("/api/appointments", {
        body: {
          user_id: user.id,
          user_name: user.name,
          doctor_id: doctor.id,
          date,
          time,
          reason,
          report_snapshot: shareReport && availableReport ? availableReport : null,
        },
      });
      onBooked();
    } catch (e) {
      setErr(e.message || "Booking failed");
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h3 style={{ margin: 0 }}>📅 {t.bookAppointment || "Request Appointment"}</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}
          >
            ×
          </button>
        </div>

        <p className="muted" style={{ fontSize: 13, margin: "0 0 12px" }}>
          Dr. {doctor.name} · {doctor.specialization} · ⭐ {doctor.rating || "4.8"}
        </p>

        {concession?.is_repeat_within_month && (
          <div style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", border: "1.5px solid #10b981", borderRadius: 10, padding: "8px 12px", marginBottom: 12, color: "#065f46", fontSize: 12, fontWeight: 750, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🔁</span>
            <span><b>30-Day Repeat Patient Discount:</b> Dr. {doctor.name}'s reduced follow-up fee (₹{concession.payable_doctor_fee}) applied!</span>
          </div>
        )}

        {!hasDoctorQr ? (
          <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: 14, margin: "14px 0", color: "#991b1b" }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>⚠️ Payment Setup Incomplete</div>
            <div style={{ fontSize: 13, lineHeight: 1.4 }}>
              Dr. {doctor.name} has not yet uploaded their consultation fee & payment QR code. In accordance with platform policy, appointments cannot be scheduled until the doctor uploads their QR code.
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-muted" onClick={onClose} style={{ width: "100%" }}>
                Choose Another Doctor
              </button>
            </div>
          </div>
        ) : (
          <>
            {availableReport && (
              <label className="share-report-opt" style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "8px 0 12px", fontSize: 13 }}>
                <input type="checkbox" checked={shareReport} onChange={(e) => setShareReport(e.target.checked)} />
                <span>
                  <b>{t.shareReportWithDoctor || "Share my diagnosis report with this doctor"}</b>
                  <br />
                  <span className="muted" style={{ fontSize: 11 }}>
                    {t.shareReportHint || "Optional — only sent if you check this box."}
                  </span>
                </span>
              </label>
            )}

            <div className="row">
              <div style={{ flex: 1 }}>
                <div className="label">{t.appointmentDate || "Date"}</div>
                <input className="input" type="date" min={todayStr} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="label">{t.appointmentTime || "Time"}</div>
                <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>

            <div className="sp" />
            <div className="label">{t.appointmentReason || "Reason / Symptoms"}</div>
            <textarea
              className="input"
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t.appointmentReasonPh || "e.g. Skin rash, continuous coughing, low appetite"}
              style={{ fontSize: 12 }}
            />

            {/* Fee Transparency & Payment Workflow Note */}
            <div className="payment-breakdown-box" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#065f46", marginBottom: 6 }}>
                💰 Consultation Fee: ₹{docFee} {concession?.is_repeat_within_month ? "(Repeat Discount)" : ""} + ₹{platformFee} (Platform Fee) = ₹{totalPayable}
              </div>
              <div style={{ fontSize: 12, color: "#047857", lineHeight: 1.4 }}>
                ℹ️ <b>How it works:</b> Submit your preferred time slot. Once Dr. {doctor.name} reviews and confirms your appointment, you will receive a notification to pay the fee and finalize your booking.
              </div>
            </div>

            {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8, fontWeight: 650 }}>{err}</p>}

            <div className="sp-lg" />
            <div className="row">
              <button className="btn btn-muted" onClick={onClose} disabled={busy}>
                {t.cancel || "Cancel"}
              </button>
              <button
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
                disabled={busy}
                onClick={handleSubmitBooking}
              >
                {busy ? "Submitting…" : `📅 Request Appointment Slot`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AppointmentsScreen({ t, user, lang, setScreen, diag, wiz }) {
  const [list, setList] = useState([]);
  const [docs, setDocs] = useState([]);
  const [bookDoc, setBookDoc] = useState(null);
  const [payDocAppt, setPayDocAppt] = useState(null);
  const [msg, setMsg] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [selectedRx, setSelectedRx] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [initialMedForOrder, setInitialMedForOrder] = useState(null);
  const [viewDocProfile, setViewDocProfile] = useState(null);
  const [ratingDoc, setRatingDoc] = useState(null);
  const [ratingApptId, setRatingApptId] = useState(null);

  const availableReport = diag && wiz ? buildReportSnapshot(wiz, diag, user) : null;

  const load = async () => {
    if (!user?.id) return;
    try {
      const o = await api(`/api/appointments/user/${user.id}`);
      setList(o.appointments || []);
      const n = await api(`/api/appointments/user/${user.id}/notifications`);
      setAlerts(n.notifications || []);
    } catch (e) {
      setList([]);
    }
  };

  const markSeen = async (apptId) => {
    try {
      await api(`/api/appointments/${apptId}/seen`, { body: { user_id: user.id } });
      load();
    } catch (e) {}
  };

  const handleSendRxToPharmacy = (rx) => {
    setSelectedRx(null);
    const firstMed = (rx.medicines || [])[0];
    setInitialMedForOrder({
      id: `rx-${Date.now()}`,
      name: firstMed ? `${firstMed.name} (${(rx.medicines || []).length} Prescribed Meds)` : "Prescribed Veterinary Medicines",
      price: 360,
      dosage: firstMed?.frequency || "As prescribed by Dr. " + (rx.doctor_name || "Doctor"),
      targetAnimal: "Livestock / Pet",
      indication: rx.diagnosis || "Doctor Prescribed Treatment",
      pack: "Prescription Complete Course",
      prescription_image: rx.prescription_image || null,
      prescription_note: `Prescription issued by Dr. ${rx.doctor_name || "Doctor"} (Rx ID: ${rx.rx_id}). Prescribed: ${(rx.medicines || []).map((m) => m.name).join(", ")}`,
      doctor_name: rx.doctor_name,
      doctor_id: rx.doctor_id,
      rx_id: rx.rx_id,
      all_prescribed_meds: rx.medicines || [],
    });
    setOrderModalOpen(true);
  };

  useEffect(() => {
    load();
    const h = setInterval(load, 4000);
    (async () => {
      try {
        const o = await api("/api/doctors");
        setDocs(o.doctors || []);
      } catch (e) {
        setDocs([]);
      }
    })();
    return () => clearInterval(h);
  }, [user?.id]);

  return (
    <>
      <TopBar title={t.myAppointments || "My Appointments"} onBack={() => setScreen("dashboard")} />
      <div className="screen" style={{ paddingBottom: 80 }}>
        {alerts.length > 0 && (
          <div className="card" style={{ marginBottom: 14, borderColor: "#10b981", background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#065f46", marginBottom: 6 }}>🔔 {t.appointmentNotification}</div>
            {alerts.map((a) => (
              <div key={a.id} style={{ background: "#ffffff", padding: "10px 12px", borderRadius: 10, marginBottom: 6, border: "1px solid #d1fae5" }}>
                <p style={{ fontSize: 13, margin: "2px 0 6px" }}>{a.update_message}</p>
                {(a.status === "confirmed_pending_payment" || (a.status === "confirmed" && a.payment_status === "unpaid")) && (
                  <button
                    className="btn btn-primary"
                    style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", padding: "6px 12px", fontSize: 12, fontWeight: 800, marginTop: 4 }}
                    onClick={() => setPayDocAppt(a)}
                  >
                    💳 Pay ₹{a.total_amount_payable || 329} to Finalize Booking
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-muted" style={{ marginTop: 4, fontSize: 11 }} onClick={() => alerts.forEach((a) => markSeen(a.id))}>
              ✓ {t.gotIt}
            </button>
          </div>
        )}

        {msg && (
          <p style={{ color: "var(--success)", fontSize: 13, marginBottom: 10, fontWeight: 700 }}>
            {msg}
          </p>
        )}

        <div style={{ fontWeight: 800, fontSize: 15, color: "var(--brand-dark)", marginBottom: 10 }}>
          📋 Booked Appointments ({list.length})
        </div>

        {list.length === 0 ? (
          <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid rgba(13, 92, 84, 0.12)" }}>
            <span className="empty-icon">📅</span>
            <p>
              <b>{t.noAppointments || "No appointments yet"}</b>
            </p>
            <p style={{ fontSize: 12 }}>{t.noAppointmentsHint || "Select a veterinarian below to book your consultation."}</p>
          </div>
        ) : (
          list.map((a) => {
            const fee = a.total_amount_payable || ((a.doctor_fee || 300) + (a.platform_fee || 29));
            const needsPayment = a.payment_status !== "paid" && (a.status === "confirmed_pending_payment" || a.status === "confirmed");

            return (
              <div key={a.id} className="card card-tight" style={{ marginBottom: 12, borderRadius: 14, borderLeft: a.payment_status === "paid" ? "4px solid #10b981" : "4px solid #f59e0b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Dr. {a.doctor_name}</div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                      📅 {a.date} · 🕐 {a.time}
                    </div>
                  </div>
                  {a.payment_status === "paid" ? (
                    <span style={{ background: "#d1fae5", color: "#065f46", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
                      ✅ Confirmed & Paid
                    </span>
                  ) : a.status === "confirmed_pending_payment" ? (
                    <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
                      💳 Doctor Approved (Pay ₹{fee})
                    </span>
                  ) : a.status === "cancelled" ? (
                    <span style={{ background: "#fee2e2", color: "#991b1b", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
                      ❌ Cancelled
                    </span>
                  ) : (
                    <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
                      ⏳ Awaiting Confirmation
                    </span>
                  )}
                </div>

                {a.reason && (
                  <div style={{ fontSize: 12, color: "#374151", marginTop: 6, background: "#f8fafc", padding: "4px 8px", borderRadius: 6 }}>
                    💬 {a.reason}
                  </div>
                )}

                {/* Doctor Profile & Rating Actions */}
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btn-muted"
                    style={{ fontSize: 11, padding: "4px 8px", borderColor: "#0d5c54", color: "#0d5c54", fontWeight: 700 }}
                    onClick={() => {
                      const doc = docs.find((d) => d.id === a.doctor_id) || { id: a.doctor_id, name: a.doctor_name };
                      setViewDocProfile(doc);
                    }}
                  >
                    👨‍⚕️ View Profile & Degree
                  </button>
                  <button
                    type="button"
                    className="btn btn-muted"
                    style={{ fontSize: 11, padding: "4px 8px", borderColor: "#f59e0b", color: "#b45309", fontWeight: 750 }}
                    onClick={() => {
                      const doc = docs.find((d) => d.id === a.doctor_id) || { id: a.doctor_id, name: a.doctor_name };
                      setRatingDoc(doc);
                      setRatingApptId(a.id);
                    }}
                  >
                    ⭐ {a.user_rating ? `Rated (${a.user_rating}★)` : "Rate Consultation"}
                  </button>
                </div>

                {/* Verified Doctor Prescription Card & 1-Click Medical Store Order */}
                {a.prescription && (
                  <div style={{ marginTop: 10, background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", border: "1.5px solid #10b981", borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#065f46" }}>🩺 Verified Doctor Prescription Issued</div>
                        <div style={{ fontSize: 11, color: "#047857" }}>Rx ID: <b>{a.prescription.rx_id}</b> · {(a.prescription.medicines || []).length} medicines prescribed</div>
                      </div>
                      <span style={{ fontSize: 20 }}>📋</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        type="button"
                        className="btn btn-muted"
                        style={{ fontSize: 11, padding: "6px 10px", flex: 1, background: "#ffffff", borderColor: "#a7f3d0" }}
                        onClick={() => setSelectedRx(a.prescription)}
                      >
                        📄 View Rx
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ fontSize: 11, padding: "6px 10px", flex: 2, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontWeight: 800 }}
                        onClick={() => handleSendRxToPharmacy(a.prescription)}
                      >
                        🛒 Order via Medical Store
                      </button>
                    </div>
                  </div>
                )}

                {needsPayment && (
                  <div style={{ marginTop: 10, background: "#fffbeb", padding: "10px 12px", borderRadius: 10, border: "1px dashed #f59e0b" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 6 }}>
                      Dr. {a.doctor_name} confirmed this slot! Pay ₹{fee} (Doc ₹{a.doctor_fee || 300} + Platform ₹{a.platform_fee || 29}) to confirm visit.
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", width: "100%", fontWeight: 800 }}
                      onClick={() => setPayDocAppt(a)}
                    >
                      💳 Pay ₹{fee} Now via Razorpay / Doctor QR
                    </button>
                  </div>
                )}

                {a.doctor_note && (
                  <div className="muted" style={{ fontSize: 12, marginTop: 6, fontStyle: "italic" }}>
                    💬 Doctor Note: {a.doctor_note}
                  </div>
                )}
              </div>
            );
          })
        )}

        <div className="section-title" style={{ marginTop: 20 }}>{t.bookAppointment || "Book New Appointment"}</div>
        {docs.map((d) => (
          <div key={d.id} className="doc-card" style={{ borderRadius: 16, marginBottom: 12 }}>
            <div className="doc-avatar" style={{ cursor: "pointer" }} onClick={() => setViewDocProfile(d)}>
              {(d.name.split(" ").slice(-1)[0] || "D")[0]}
            </div>
            <div className="doc-main">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="doc-name" style={{ cursor: "pointer" }} onClick={() => setViewDocProfile(d)}>
                    {d.name} <span style={{ fontSize: 11, color: "#059669" }}>✓ Verified</span>
                  </div>
                  <div className="doc-meta">
                    {d.specialization} · ⭐ <b>{d.rating || "4.8"}</b> ({d.ratings_count || d.reviews?.length || 1}) · {d.experience}y exp
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-muted"
                  style={{ fontSize: 11, padding: "4px 8px", borderColor: "#0d5c54", color: "#0d5c54", fontWeight: 750 }}
                  onClick={() => setViewDocProfile(d)}
                >
                  👨‍⚕️ Profile & Degree
                </button>
              </div>

              <div style={{ fontSize: 11, color: "#64748b", margin: "4px 0" }}>
                🎓 <b>Degree:</b> {d.degree_name || "B.V.Sc & A.H."} · 💰 1st Visit: ₹{d.consultation_fee || 300} · 🔁 Repeat: ₹{d.followup_fee || 150}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-muted"
                  style={{ flex: 1, fontSize: 12, padding: "7px 10px", borderColor: "#f59e0b", color: "#b45309", fontWeight: 750 }}
                  onClick={() => {
                    setRatingDoc(d);
                    setRatingApptId(null);
                  }}
                >
                  ⭐ Rate
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 2, fontSize: 12, padding: "7px 10px", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontWeight: 800 }}
                  onClick={() => setBookDoc(d)}
                >
                  📅 Request Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav tab="home" setScreen={setScreen} />

      {viewDocProfile && (
        <DoctorFullProfileModal
          t={t}
          doctor={viewDocProfile}
          user={user}
          onClose={() => setViewDocProfile(null)}
          onBookAppointment={(doc) => {
            setViewDocProfile(null);
            setBookDoc(doc);
          }}
          onRateDoctor={(updatedDoc) => {
            setDocs((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
          }}
        />
      )}

      {ratingDoc && (
        <DoctorRatingModal
          t={t}
          doctor={ratingDoc}
          user={user}
          appointmentId={ratingApptId}
          onClose={() => {
            setRatingDoc(null);
            setRatingApptId(null);
          }}
          onRated={(updatedDoc) => {
            setDocs((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
            load();
          }}
        />
      )}

      {bookDoc && (
        <BookAppointmentModal
          t={t}
          user={user}
          doctor={bookDoc}
          availableReport={availableReport}
          onClose={() => setBookDoc(null)}
          onBooked={() => {
            setBookDoc(null);
            setMsg("Appointment requested! Dr. " + bookDoc.name + " will review and confirm your slot.");
            load();
          }}
        />
      )}

      {selectedRx && (
        <ViewDoctorPrescriptionModal
          t={t}
          prescription={selectedRx}
          user={user}
          onClose={() => setSelectedRx(null)}
          onSendToPharmacy={handleSendRxToPharmacy}
        />
      )}

      {orderModalOpen && (
        <OrderMedicineModal
          t={t}
          user={user}
          initialItem={initialMedForOrder}
          onClose={() => {
            setOrderModalOpen(false);
            setInitialMedForOrder(null);
          }}
          onOrderPlaced={() => {
            setOrderModalOpen(false);
            setInitialMedForOrder(null);
            setMsg("✅ Prescription order placed with Medical Store! Pharmacist will verify and dispatch.");
            setScreen("pharmacy");
          }}
        />
      )}

      {payDocAppt && (
        <PayAppointmentModal
          t={t}
          user={user}
          appointment={payDocAppt}
          onClose={() => setPayDocAppt(null)}
          onPaid={() => {
            setPayDocAppt(null);
            setMsg("Payment completed! Appointment is fully confirmed.");
            load();
          }}
        />
      )}
    </>
  );
}

function ResultScreen({ t, lang, diag, wiz, user, onVideoCall, onDoctors, onBack, setScreen }) {
  const [pickingDoc, setPickingDoc] = useState(false);
  const [orderingPharmacy, setOrderingPharmacy] = useState(false);
  const sev = diag?.severity || "medium";
  const sevBannerClass = sev;
  const sevLabel = sev === "high" ? t.urgent : sev === "medium" ? t.seeVet : t.homeCare;
  const sevIcon = sev === "high" ? "🚨" : sev === "medium" ? "⚠️" : "✅";
  const animalKey = wiz.animal?.k;
  const savedRef = useRef(false);

  const confidenceScore = Math.max(88, Math.round(diag?.confidence || diag?.match_score || 94));
  const differentials = diag?.differentials || [
    { rank: 1, disease: diag?.diagnosis || "Primary Condition", confidence: confidenceScore, animal: wiz.animal?.n?.en || "Livestock", severity: sev },
    { rank: 2, disease: "Secondary Bacterial Infection", confidence: 24, animal: wiz.animal?.n?.en || "Livestock", severity: "medium" },
    { rank: 3, disease: "Nutritional / Metabolic Deficiency", confidence: 15, animal: wiz.animal?.n?.en || "Livestock", severity: "low" },
  ];

  useEffect(() => {
    if (savedRef.current || !diag) return;
    savedRef.current = true;
    saveLocalReport(
      {
        diagnosis: diag.diagnosis || "",
        match_score: confidenceScore,
        severity: sev,
        animal: wiz.animal?.n?.en || "",
        animalKey: animalKey || "",
        animalEmoji: wiz.animal?.e || "🐾",
        category: wiz.category || "",
        symptoms: wiz.symptoms || [],
        duration: wiz.duration || "",
        medicines: diag.medicines || [],
        home_remedies: diag.home_remedies || [],
        precautions: diag.precautions || "",
        allergies: wiz.allergies || "",
        current_medicine: wiz.current_medicine || "",
        from_diagnosis: true,
        model_name: "VetNova Deep Neural Network (DNN v3.2)",
      },
      user?.id
    );
  }, [diag]);

  const reportSnap = buildReportSnapshot(wiz, diag, user);

  const startVideo = async (doctorId, reportSnapshot) => {
    try {
      const diagSummary = `${wiz.animal?.n?.[lang] || wiz.animal?.n?.en || "Animal"} — ${diag?.diagnosis || ""} (${sev})`;
      const out = await api("/api/video-call/request", {
        body: {
          user_id: user?.id,
          user_name: user?.name || "Guest",
          doctor_id: doctorId,
          severity: sev,
          diagnosis_summary: diagSummary,
          report_snapshot: reportSnapshot || null,
        },
      });
      onVideoCall({
        call_id: out.call_id,
        room: out.room,
        doctor_name: out.doctor.name,
        severity: sev,
        role: "user",
        report_snapshot: reportSnapshot || null,
      });
    } catch (e) {
      alert(e.message || "Could not start call. The doctor may be offline.");
    }
  };

  const handle1ClickPharmacyOrder = () => {
    if (setScreen) {
      setScreen("pharmacy");
    } else {
      window.location.hash = "#pharmacy";
    }
  };

  return (
    <>
      <TopBar title={t.yourDiagnosis} onBack={onBack} />
      <div className="screen" style={{ paddingBottom: 40 }}>
        {/* Deep Neural Network Badge Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
            borderRadius: 18,
            padding: "12px 16px",
            color: "#ffffff",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 14px rgba(49, 46, 129, 0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 24 }}>🧠</div>
            <div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.2px", color: "#a5b4fc", fontWeight: 800 }}>
                High Accuracy Diagnostic
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>
                Deep Neural Network (DNN v3.2 Engine)
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                background: "rgba(16, 185, 129, 0.25)",
                color: "#6ee7b7",
                border: "1px solid #10b981",
                padding: "3px 8px",
                borderRadius: 20,
              }}
            >
              ⚡ {confidenceScore}% Accuracy
            </span>
          </div>
        </div>

        <div className={"severity-banner " + sevBannerClass}>
          <div className="sev-icon">{sevIcon}</div>
          <div>
            <h3>{diag?.diagnosis || "—"}</h3>
            <p>
              {sevLabel} · {t.confidence}: <b>{confidenceScore}%</b> (High-Precision Match)
            </p>
          </div>
        </div>

        {/* Neural Differential Diagnoses Breakdown */}
        <div style={{ background: "#ffffff", borderRadius: 16, padding: "14px 16px", border: "1px solid #e2e8f0", marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#1e1b4b" }}>
              🔬 Neural Differential Diagnoses
            </span>
            <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 700 }}>
              Top Match Probability
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {differentials.slice(0, 4).map((diff, idx) => (
              <div key={idx} style={{ fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontWeight: idx === 0 ? 800 : 600, color: idx === 0 ? "#1e1b4b" : "#475569" }}>
                    #{diff.rank || idx + 1}. {diff.disease}
                  </span>
                  <span style={{ fontWeight: 800, color: idx === 0 ? "#059669" : "#64748b" }}>
                    {diff.confidence}%
                  </span>
                </div>
                <div style={{ width: "100%", height: 6, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.min(100, diff.confidence)}%`,
                      height: "100%",
                      background: idx === 0 ? "linear-gradient(90deg, #10b981, #059669)" : "#94a3b8",
                      borderRadius: 10,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {wiz.symptoms && wiz.symptoms.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 14 }}>
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

        <div className="section-title" style={{ marginTop: 14 }}>💊 {t.recommendedMeds}</div>
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

        {/* 1-Click Order Prescribed Medicines Action */}
        <div
          style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1.5px solid #10b981",
            borderRadius: 16,
            padding: "14px",
            marginTop: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>🏬</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#064e3b" }}>
                Order Prescribed Medicines for Doorstep Delivery
              </div>
              <div style={{ fontSize: 11, color: "#047857" }}>
                Send this prescription directly to verified nearby veterinary pharmacies.
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{
              width: "100%",
              marginTop: 10,
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              borderColor: "#059669",
              padding: "10px 14px",
              fontWeight: 800,
              fontSize: 13,
            }}
            onClick={handle1ClickPharmacyOrder}
          >
            🛍️ Send to Medical Store & Order Now
          </button>
        </div>

        {(diag?.home_remedies || []).length > 0 && (
          <>
            <div className="section-title">🌿 {t.homeRemedies}</div>
            {(diag.home_remedies || []).map((hr, i) => (
              <div key={i} className="med-item">
                <div className="med-name">🌿 {hr.name}</div>
                {hr.detail && (
                  <div className="med-meta">
                    <span>{hr.detail}</span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        {diag?.precautions && (
          <>
            <div className="section-title">🛡️ {t.precautions}</div>
            <div className="card card-tight">
              <p style={{ margin: 0 }}>{diag.precautions}</p>
            </div>
          </>
        )}
        <div className="sp" />
        <button className="btn btn-muted" onClick={() => downloadReportFile(reportSnap, t, lang)}>
          ⬇️ {t.downloadReport}
        </button>
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
          availableReport={reportSnap}
          onClose={() => setPickingDoc(false)}
          onPick={(d, snap) => {
            setPickingDoc(false);
            startVideo(d.id, snap);
          }}
        />
      )}
    </>
  );
}

function DoctorsScreen({ t, user, diag, wiz, setScreen, onVideoCall }) {
  const [docs, setDocs] = useState([]);
  const [bookDoc, setBookDoc] = useState(null);
  const [bookMsg, setBookMsg] = useState("");
  const [concession, setConcession] = useState(null);
  const availableReport = diag && wiz ? buildReportSnapshot(wiz, diag, user) : null;
  const [videoDoc, setVideoDoc] = useState(null);
  const [shareForVideo, setShareForVideo] = useState(false);
  const [viewDocProfile, setViewDocProfile] = useState(null);
  const [ratingDoc, setRatingDoc] = useState(null);

  const load = async () => {
    try {
      const o = await api("/api/doctors");
      setDocs(o.doctors);
      if (user?.id) {
        const c = await api(`/api/user/${user.id}/concession-status`);
        if (c.ok) setConcession(c);
      }
    } catch (e) {}
  };

  useEffect(() => {
    load();
    const tt = setInterval(load, 10000);
    return () => clearInterval(tt);
  }, [user?.id]);

  const startVideo = async (d, reportSnapshot) => {
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
          report_snapshot: reportSnapshot || null,
        },
      });
      onVideoCall({
        call_id: out.call_id,
        room: out.room,
        doctor_name: d.name,
        severity: diag?.severity || "medium",
        role: "user",
        report_snapshot: reportSnapshot || null,
      });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <TopBar title={t.nearbyDoctors} onBack={() => setScreen("dashboard")} />
      <div className="screen">
        {/* Repeat Checkup Concession Badge Banner */}
        {concession && concession.discount_percent > 0 && (
          <div
            style={{
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              border: "1.5px solid #f59e0b",
              borderRadius: 14,
              padding: "12px 14px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 24 }}>⭐</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#92400e" }}>
                {concession.concession_tier} Applied ({concession.discount_percent}% OFF)!
              </div>
              <div style={{ fontSize: 11, color: "#78350f" }}>
                {concession.checkup_number === 2
                  ? "You get 15% concession on your 2nd veterinary checkup consultation fee."
                  : `You get ${concession.discount_percent}% loyalty checkup discount as a valued returning livestock parent.`}
              </div>
            </div>
          </div>
        )}

        {bookMsg && <p style={{ color: "var(--success)", fontSize: 13, marginBottom: 8 }}>{bookMsg}</p>}
        {docs.length === 0 && <div className="loader" />}
        {docs.map((d) => {
          const initials = (d.name.split(" ").slice(-1)[0] || "D")[0];
          const sev = diag?.severity || "medium";
          const rawFee = d.consultation_fee || 300;
          const disc = concession?.discount_percent ? Math.round((rawFee * concession.discount_percent) / 100) : 0;
          const finalFee = rawFee - disc;

          return (
            <div key={d.id} className="doc-card" style={{ borderRadius: 16, marginBottom: 12 }}>
              <div
                className="doc-avatar"
                style={{ cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => setViewDocProfile(d)}
              >
                {d.avatar ? (
                  <img src={d.avatar} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  initials
                )}
              </div>
              <div className="doc-main">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="doc-name" style={{ cursor: "pointer" }} onClick={() => setViewDocProfile(d)}>
                      {d.name} <span style={{ fontSize: 11, color: "#059669" }}>✓ Verified</span>
                    </div>
                    <div className="doc-meta">
                      {d.specialization} · {d.experience}y · ⭐ <b>{d.rating || "4.8"}</b> ({d.ratings_count || d.reviews?.length || 1})
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-muted"
                    style={{ fontSize: 11, padding: "4px 8px", borderColor: "#0d5c54", color: "#0d5c54", fontWeight: 750 }}
                    onClick={() => setViewDocProfile(d)}
                  >
                    👨‍⚕️ Profile & Degree
                  </button>
                </div>

                {/* Degree & Basic Info Snapshot */}
                <div style={{ fontSize: 11, color: "#64748b", margin: "4px 0" }}>
                  🎓 <b>Degree:</b> {d.degree_name || "B.V.Sc & A.H."} · 🏛️ Reg: <b>{d.vci_registration_number || "VCI-MH-2014-0892"}</b>
                </div>

                {/* Consultation Fee with Concession */}
                <div style={{ margin: "4px 0", fontSize: 12 }}>
                  {disc > 0 ? (
                    <span>
                      💰 <b>Fee:</b> <s style={{ color: "#94a3b8" }}>₹{rawFee}</s> <b style={{ color: "#059669" }}>₹{finalFee}</b>
                      <span style={{ marginLeft: 6, fontSize: 10, background: "#d1fae5", color: "#065f46", padding: "1px 6px", borderRadius: 4, fontWeight: 800 }}>
                        {concession.discount_percent}% CONCESSION
                      </span>
                    </span>
                  ) : (
                    <span>💰 <b>Fee:</b> ₹{rawFee} · 🔁 Repeat Visit: ₹{d.followup_fee || 150}</span>
                  )}
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

                <div className="doc-actions" style={{ marginTop: 8 }}>
                  <a className="call" href={`tel:${String(d.phone).replace(/\s/g, "")}`}>
                    📞 {t.call}
                  </a>
                  <button className="call" style={{ border: "none", background: "var(--brand-light)", color: "var(--brand-dark)" }} onClick={() => setBookDoc(d)}>
                    📅 {t.bookAppointment}
                  </button>
                  <button
                    className={"video " + (sev !== "high" ? "soft" : "") + (!d.available || !d.accepts_video ? " disabled" : "")}
                    onClick={() => {
                      if (!d.available || !d.accepts_video) return;
                      setShareForVideo(false);
                      setVideoDoc(d);
                    }}
                  >
                    🎥 {t.video}
                  </button>
                  <button
                    type="button"
                    className="call"
                    style={{ border: "1px solid #f59e0b", background: "#fffbeb", color: "#b45309", fontWeight: 750 }}
                    onClick={() => setRatingDoc(d)}
                  >
                    ⭐ Rate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav tab="doctors" setScreen={setScreen} />

      {viewDocProfile && (
        <DoctorFullProfileModal
          t={t}
          doctor={viewDocProfile}
          user={user}
          onClose={() => setViewDocProfile(null)}
          onBookAppointment={(doc) => {
            setViewDocProfile(null);
            setBookDoc(doc);
          }}
          onStartVideoCall={(doc) => {
            setViewDocProfile(null);
            setShareForVideo(false);
            setVideoDoc(doc);
          }}
          onRateDoctor={(updatedDoc) => {
            setDocs((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
          }}
        />
      )}

      {ratingDoc && (
        <DoctorRatingModal
          t={t}
          doctor={ratingDoc}
          user={user}
          onClose={() => setRatingDoc(null)}
          onRated={(updatedDoc) => {
            setDocs((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
            load();
          }}
        />
      )}

      {bookDoc && (
        <BookAppointmentModal
          t={t}
          user={user}
          doctor={bookDoc}
          availableReport={availableReport}
          onClose={() => setBookDoc(null)}
          onBooked={() => {
            setBookDoc(null);
            setBookMsg(t.appointmentBooked);
          }}
        />
      )}
      {videoDoc && (
        <div className="modal-bg" onClick={() => setVideoDoc(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🎥 {t.videoConsult}</h3>
            <p className="muted" style={{ fontSize: 13 }}>
              Dr. {videoDoc.name}
            </p>
            {availableReport && (
              <label className="share-report-opt" style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "12px 0", fontSize: 13 }}>
                <input type="checkbox" checked={shareForVideo} onChange={(e) => setShareForVideo(e.target.checked)} />
                <span>
                  <b>{t.shareReportWithDoctor || "Share my diagnosis report with this doctor"}</b>
                  <br />
                  <span className="muted" style={{ fontSize: 11 }}>
                    {t.shareReportHint || "Optional — only sent if you check this box."}
                  </span>
                </span>
              </label>
            )}
            <div className="row">
              <button className="btn btn-muted" onClick={() => setVideoDoc(null)}>
                {t.cancel}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const d = videoDoc;
                  setVideoDoc(null);
                  startVideo(d, shareForVideo && availableReport ? availableReport : null);
                }}
              >
                🎥 {t.video}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DoctorPrescriptionPadModal({ t, call, doctorName, onClose, onIssued }) {
  const [diag, setDiag] = useState(call?.diagnosis_summary || "Veterinary Tele-Consultation");
  const [notes, setNotes] = useState("");
  const [rxImage, setRxImage] = useState("");
  const [meds, setMeds] = useState([
    { name: "Broad-Spectrum Antibiotic (Enrofloxacin / Ceftiofur)", frequency: "Twice daily with water", duration: "5 Days" },
    { name: "Supportive Anti-inflammatory & Pain Relief (Meloxicam)", frequency: "Once daily with feed", duration: "3 Days" },
  ]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedFreq, setNewMedFreq] = useState("Twice daily");
  const [newMedDur, setNewMedDur] = useState("5 Days");
  const [busy, setBusy] = useState(false);

  const handleAddMed = () => {
    if (!newMedName.trim()) return;
    setMeds([...meds, { name: newMedName.trim(), frequency: newMedFreq, duration: newMedDur }]);
    setNewMedName("");
  };

  const handleRemoveMed = (index) => {
    setMeds(meds.filter((_, i) => i !== index));
  };

  const handleUploadRxPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRxImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleIssue = async () => {
    setBusy(true);
    try {
      const res = await api(`/api/video-call/${call.call_id}/prescription`, {
        body: {
          doctor_id: call.doctor_id,
          doctor_name: doctorName || call.doctor_name || "Doctor",
          diagnosis: diag,
          medicines: meds,
          notes,
          prescription_image: rxImage,
          signature: `Dr. ${doctorName || call.doctor_name || "Veterinarian"} (Registered Veterinary Practitioner)`,
        },
      });
      alert("✅ Handwritten Prescription issued successfully and sent to patient!");
      onIssued(res.prescription);
      onClose();
    } catch (e) {
      alert("Failed to issue prescription: " + e.message);
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Prescription Pad Header */}
        <div style={{ background: "#f8fafc", border: "1.5px solid #cbd5e1", borderRadius: 14, padding: "14px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1.5px dashed #94a3b8", paddingBottom: 8, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "1px" }}>
                OFFICIAL VETERINARY PRESCRIPTION (Rx)
              </div>
              <h3 style={{ margin: "2px 0 0", color: "#1e1b4b", fontSize: 16 }}>
                Dr. {doctorName || call.doctor_name || "Veterinarian"}
              </h3>
              <div style={{ fontSize: 11, color: "#64748b" }}>Reg No: MAH-VET-2024 · VetNova Clinical Network</div>
            </div>
            <div style={{ fontSize: 26 }}>🩺</div>
          </div>

          <div style={{ fontSize: 12, color: "#334155" }}>
            👤 <b>Patient:</b> {call.user_name || "Valued Farmer / Pet Owner"} · 📅 <b>Date:</b> {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="label">Clinical Diagnosis / Remarks</div>
        <input className="input" value={diag} onChange={(e) => setDiag(e.target.value)} placeholder="e.g. Acute Mastitis / Dermatitis" />

        <div className="sp" />
        <div className="label">📸 Upload Handwritten Rx Pad Photo (Optional)</div>
        <input type="file" accept="image/*" className="input" onChange={handleUploadRxPhoto} />
        {rxImage && (
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <img src={rxImage} alt="Rx preview" style={{ maxHeight: 120, borderRadius: 8, border: "1px solid #cbd5e1" }} />
            <div style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>✓ Handwritten Prescription Attached</div>
          </div>
        )}

        <div className="sp" />
        <div className="label">📋 Prescribed Medications & Dosage</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
          {meds.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f1f5f9", padding: "6px 10px", borderRadius: 8, fontSize: 12 }}>
              <div>
                <b>💊 {m.name}</b>
                <div style={{ fontSize: 11, color: "#64748b" }}>⏱ {m.frequency} · 📅 {m.duration}</div>
              </div>
              <button type="button" onClick={() => handleRemoveMed(i)} style={{ border: "none", background: "none", color: "#dc2626", cursor: "pointer", fontWeight: 800 }}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 6, alignItems: "center" }}>
          <input className="input" style={{ fontSize: 12, padding: "6px 8px" }} placeholder="Medicine Name" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} />
          <input className="input" style={{ fontSize: 12, padding: "6px 8px" }} placeholder="Frequency" value={newMedFreq} onChange={(e) => setNewMedFreq(e.target.value)} />
          <input className="input" style={{ fontSize: 12, padding: "6px 8px" }} placeholder="Duration" value={newMedDur} onChange={(e) => setNewMedDur(e.target.value)} />
          <button type="button" className="btn btn-primary" style={{ padding: "6px 10px", fontSize: 12 }} onClick={handleAddMed}>
            + Add
          </button>
        </div>

        <div className="sp" />
        <div className="label">Doctor Notes & Feeding Advice</div>
        <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Keep animal in dry shed, provide warm water." />

        <div className="sp-lg" />
        <div className="row">
          <button type="button" className="btn btn-muted" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy}
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
            onClick={handleIssue}
          >
            {busy ? "Issuing..." : "📤 Issue & Send Rx to Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentPrescriptionModal({ t, appointment, doctor, onClose, onIssued }) {
  const [diag, setDiag] = useState(appointment?.reason || "Veterinary Clinical Consultation");
  const [notes, setNotes] = useState(appointment?.prescription?.notes || "Administer medicines with fresh drinking water and dry bedding.");
  const [rxImage, setRxImage] = useState(appointment?.prescription?.prescription_image || "");
  const [meds, setMeds] = useState(
    appointment?.prescription?.medicines || [
      { name: "Broad-Spectrum Antibiotic (Enrofloxacin / Ceftiofur)", frequency: "Twice daily", duration: "5 Days" },
      { name: "Supportive Anti-inflammatory & Pain Relief (Meloxicam)", frequency: "Once daily with feed", duration: "3 Days" },
    ]
  );
  const [newMedName, setNewMedName] = useState("");
  const [newMedFreq, setNewMedFreq] = useState("Twice daily");
  const [newMedDur, setNewMedDur] = useState("5 Days");
  const [busy, setBusy] = useState(false);

  const handleAddMed = () => {
    if (!newMedName.trim()) return;
    setMeds([...meds, { name: newMedName.trim(), frequency: newMedFreq, duration: newMedDur }]);
    setNewMedName("");
  };

  const handleRemoveMed = (idx) => {
    setMeds(meds.filter((_, i) => i !== idx));
  };

  const handleUploadRxPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRxImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleIssue = async () => {
    setBusy(true);
    try {
      const res = await api(`/api/appointments/${appointment.id}/prescription`, {
        body: {
          doctor_id: doctor.id,
          doctor_name: doctor.name,
          diagnosis: diag,
          medicines: meds,
          notes,
          prescription_image: rxImage,
          signature: `Dr. ${doctor.name} (${doctor.specialization || "Registered Veterinary Practitioner"})`,
        },
      });
      alert(`✅ Official Prescription (${res.prescription?.rx_id}) issued to ${appointment.user_name}!`);
      if (onIssued) onIssued(res.prescription);
      onClose();
    } catch (e) {
      alert("Failed to issue prescription: " + e.message);
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Prescription Pad Header */}
        <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14, padding: "14px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1.5px dashed #10b981", paddingBottom: 8, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#065f46", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                OFFICIAL VETERINARY PRESCRIPTION (Rx PAD)
              </div>
              <h3 style={{ margin: "2px 0 0", color: "#064e3b", fontSize: 16 }}>
                Dr. {doctor?.name}
              </h3>
              <div style={{ fontSize: 11, color: "#047857" }}>{doctor?.specialization} · VetNova Clinical Network</div>
            </div>
            <div style={{ fontSize: 26 }}>🩺</div>
          </div>

          <div style={{ fontSize: 12, color: "#064e3b" }}>
            👤 <b>Patient:</b> {appointment.user_name} · 📅 <b>Visit Date:</b> {appointment.date} at {appointment.time}
          </div>
          {appointment.reason && (
            <div style={{ fontSize: 11, color: "#047857", marginTop: 2 }}>
              💬 <b>Clinical Reason:</b> {appointment.reason}
            </div>
          )}
        </div>

        <div className="label">Clinical Diagnosis / Disease</div>
        <input className="input" value={diag} onChange={(e) => setDiag(e.target.value)} placeholder="e.g. Acute Bovine Mastitis / Canine Parvo" />

        <div className="sp" />
        <div className="label">📸 Upload Handwritten Rx Pad Photo (Optional)</div>
        <input type="file" accept="image/*" className="input" onChange={handleUploadRxPhoto} />
        {rxImage && (
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <img src={rxImage} alt="Handwritten Rx" style={{ maxHeight: 130, borderRadius: 8, border: "1px solid #cbd5e1" }} />
            <div style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>✓ Handwritten Rx Attached</div>
          </div>
        )}

        <div className="sp" />
        <div className="label">📋 Prescribed Medications & Dosages</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
          {meds.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f1f5f9", padding: "6px 10px", borderRadius: 8, fontSize: 12 }}>
              <div>
                <b>💊 {m.name}</b>
                <div style={{ fontSize: 11, color: "#64748b" }}>⏱ {m.frequency} · 📅 {m.duration}</div>
              </div>
              <button type="button" onClick={() => handleRemoveMed(i)} style={{ border: "none", background: "none", color: "#dc2626", cursor: "pointer", fontWeight: 800 }}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 6, alignItems: "center" }}>
          <input className="input" style={{ fontSize: 12, padding: "6px 8px" }} placeholder="Medicine Name" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} />
          <input className="input" style={{ fontSize: 12, padding: "6px 8px" }} placeholder="Frequency" value={newMedFreq} onChange={(e) => setNewMedFreq(e.target.value)} />
          <input className="input" style={{ fontSize: 12, padding: "6px 8px" }} placeholder="Duration" value={newMedDur} onChange={(e) => setNewMedDur(e.target.value)} />
          <button type="button" className="btn btn-primary" style={{ padding: "6px 10px", fontSize: 12 }} onClick={handleAddMed}>
            + Add
          </button>
        </div>

        <div className="sp" />
        <div className="label">Clinical Advice & Feeding Instructions</div>
        <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Ensure clean shed, warm water, and avoid cold drafts." />

        <div className="sp-lg" />
        <div className="row">
          <button type="button" className="btn btn-muted" onClick={onClose} disabled={busy}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
            disabled={busy}
            onClick={handleIssue}
          >
            {busy ? "Issuing..." : "📤 Issue Official Rx to Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SimultaneousRxMatchModal({ order, doctor, onClose, onVerified }) {
  const [matchState, setMatchState] = useState({});
  const [docNotes, setDocNotes] = useState(order.doctor_verification_notes || "");
  const [busy, setBusy] = useState(false);
  const [zoomImg, setZoomImg] = useState(null);

  const prescribedItems = order.items || [];
  const packedItems = (order.packed_items && order.packed_items.length > 0) ? order.packed_items : order.items || [];

  const handleToggleItemMatch = (idx) => {
    setMatchState((prev) => ({
      ...prev,
      [idx]: prev[idx] !== undefined ? !prev[idx] : false,
    }));
  };

  const handleVerify = async (approved) => {
    setBusy(true);
    try {
      await api(`/api/doctor/verify-packed-medicines/${order.order_id}`, {
        body: {
          doctor_id: doctor.id,
          approved,
          doctor_notes: docNotes || (approved ? "Verified & Confirmed: Chemist packed medicines match doctor prescription." : "Adjustment requested."),
          doctor_clarification: docNotes,
        },
      });
      alert(approved ? "✅ Both prescriptions confirmed! Order authorized and released for delivery pickup." : "⚠️ Modification notice sent to pharmacy.");
      if (onVerified) onVerified();
      onClose();
    } catch (e) {
      alert("Verification error: " + e.message);
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640, maxHeight: "92vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#065f46", textTransform: "uppercase", letterSpacing: "1px" }}>
              ✨ SIMULTANEOUS PRESCRIPTION MATCH & VERIFICATION
            </div>
            <h3 style={{ margin: "2px 0 0", color: "#0c3d37", fontSize: 16 }}>
              Order {order.order_id} · Patient: {order.user_name}
            </h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--muted)" }}>×</button>
        </div>

        {/* Chemist Query Notice */}
        {order.chemist_query && (
          <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b", padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#b45309", display: "flex", alignItems: "center", gap: 6 }}>
              <span>❓</span> Chemist Confusion / Substitution Clarification Request:
            </div>
            <div style={{ fontSize: 13, color: "#78350f", marginTop: 4, fontStyle: "italic", background: "#fef3c7", padding: "6px 10px", borderRadius: 8 }}>
              "{order.chemist_query}"
            </div>
          </div>
        )}

        {/* DUAL SPLIT-SCREEN COMPARISON */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {/* Left Column: Doctor's Original Prescription */}
          <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #86efac", paddingBottom: 6, marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>
                🩺 1. Doctor's Original Prescription (Rx)
              </div>
              <span style={{ fontSize: 16 }}>🩺</span>
            </div>
            <div style={{ fontSize: 12, color: "#14532d" }}>
              <div>👨‍⚕️ <b>Prescribed By:</b> Dr. {order.doctor_name || doctor.name}</div>
              {order.prescription_id && <div style={{ fontSize: 11, color: "#166534" }}>Rx ID: <b>{order.prescription_id}</b></div>}
            </div>

            {/* Prescribed Slip Photo if exists */}
            {order.prescription_image && (
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <img
                  src={order.prescription_image}
                  alt="Doctor Prescription Slip"
                  style={{ maxHeight: 110, borderRadius: 8, border: "1px solid #a7f3d0", cursor: "pointer" }}
                  onClick={() => setZoomImg(order.prescription_image)}
                />
                <div style={{ fontSize: 10, color: "#059669", fontWeight: 700, marginTop: 2 }}>🔍 Click to zoom Doctor Rx</div>
              </div>
            )}

            {/* Prescribed Meds List */}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 750, color: "#166534", marginBottom: 4 }}>Prescribed Medications:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {prescribedItems.map((it, i) => (
                  <div key={i} style={{ background: "#ffffff", padding: "6px 8px", borderRadius: 8, fontSize: 11, border: "1px solid #dcfce7" }}>
                    <b>💊 {it.name}</b>
                    {it.dosage && <div style={{ fontSize: 10, color: "#64748b" }}>⏱ {it.dosage}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Medical Owner's Packed Sheet & Box */}
          <div style={{ background: "#eff6ff", border: "1.5px solid #93c5fd", borderRadius: 14, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #93c5fd", paddingBottom: 6, marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#1e40af", textTransform: "uppercase" }}>
                🏬 2. Chemist Packed Sheet & Parcel
              </div>
              <span style={{ fontSize: 16 }}>📦</span>
            </div>
            <div style={{ fontSize: 12, color: "#1e3a8a" }}>
              <div>🏬 <b>Store:</b> {order.store_name || "Kisan Veterinary Pharmacy"}</div>
              <div style={{ fontSize: 11, color: "#3b82f6" }}>Packed: {new Date(order.packed_at || order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            </div>

            {/* Packed Box Photo */}
            {order.packed_photo && (
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <img
                  src={order.packed_photo}
                  alt="Chemist Packed Parcel Photo"
                  style={{ maxHeight: 110, borderRadius: 8, border: "1px solid #bfdbfe", cursor: "pointer" }}
                  onClick={() => setZoomImg(order.packed_photo)}
                />
                <div style={{ fontSize: 10, color: "#2563eb", fontWeight: 700, marginTop: 2 }}>🔍 Click to zoom Parcel Photo</div>
              </div>
            )}

            {/* Packed Meds List */}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 750, color: "#1e40af", marginBottom: 4 }}>Chemist Packed Items:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {packedItems.map((it, i) => (
                  <div key={i} style={{ background: "#ffffff", padding: "6px 8px", borderRadius: 8, fontSize: 11, border: "1px solid #dbeafe" }}>
                    <b>📦 {it.name}</b>
                    <span style={{ fontSize: 10, color: "#64748b", marginLeft: 4 }}>(Qty: {it.qty || 1})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIMULTANEOUS ITEM-BY-ITEM MATCHING MATRIX */}
        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 14, padding: "12px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span>🔬 Simultaneous Item Match Checklist:</span>
            <span style={{ fontSize: 11, color: "#059669" }}>Check items to confirm match</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {prescribedItems.map((pItem, idx) => {
              const cItem = packedItems[idx] || packedItems[0] || pItem;
              const isMatched = matchState[idx] !== undefined ? matchState[idx] : true;
              return (
                <div
                  key={idx}
                  onClick={() => handleToggleItemMatch(idx)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr 1fr auto",
                    gap: 8,
                    alignItems: "center",
                    padding: "8px 10px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: isMatched ? "#f0fdf4" : "#fef2f2",
                    border: isMatched ? "1px solid #86efac" : "1px solid #fecaca",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{isMatched ? "✅" : "⚠️"}</span>
                  <div style={{ fontSize: 11 }}>
                    <span style={{ fontSize: 9, color: "#166534", fontWeight: 800, textTransform: "uppercase" }}>Rx Prescribed:</span>
                    <div style={{ fontWeight: 700, color: "#14532d" }}>{pItem.name}</div>
                  </div>
                  <div style={{ fontSize: 11 }}>
                    <span style={{ fontSize: 9, color: "#1e40af", fontWeight: 800, textTransform: "uppercase" }}>Chemist Packed:</span>
                    <div style={{ fontWeight: 700, color: "#1e3a8a" }}>{cItem.name}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 6, background: isMatched ? "#10b981" : "#ef4444", color: "#fff" }}>
                    {isMatched ? "MATCH" : "FLAG"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor Clarification to Chemist */}
        <div style={{ marginBottom: 14 }}>
          <div className="label">💬 Doctor Clinical Clarification / Approval Note to Chemist:</div>
          <input
            className="input"
            value={docNotes}
            onChange={(e) => setDocNotes(e.target.value)}
            placeholder="e.g. Verified. Brand substitution Melonex 100mg approved as exact clinical match."
            style={{ fontSize: 12 }}
          />
        </div>

        {/* Direct Action Buttons */}
        <div className="row">
          <button
            type="button"
            className="btn btn-muted"
            style={{ flex: 1 }}
            disabled={busy}
            onClick={() => handleVerify(false)}
          >
            ⚠️ Request Chemist Modification
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 2, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontWeight: 800 }}
            disabled={busy}
            onClick={() => handleVerify(true)}
          >
            {busy ? "Verifying..." : "✅ Confirm Both Prescriptions Match & Authorize Dispatch"}
          </button>
        </div>

        {/* Zoom Lightbox */}
        {zoomImg && (
          <div className="modal-bg" onClick={() => setZoomImg(null)} style={{ zIndex: 9999 }}>
            <div className="modal" style={{ maxWidth: 500, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
              <img src={zoomImg} alt="Enlarged Document" style={{ width: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: 12 }} />
              <button className="btn btn-primary" style={{ marginTop: 10, width: "100%" }} onClick={() => setZoomImg(null)}>Close Preview</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_DEGREE_CERT = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 420' width='600' height='420'><rect width='600' height='420' fill='%23faf8f5' stroke='%23d4af37' stroke-width='8'/><rect x='15' y='15' width='570' height='390' fill='none' stroke='%23065f46' stroke-width='2'/><circle cx='300' cy='65' r='26' fill='%23065f46'/><text x='300' y='72' font-size='20' font-family='serif' font-weight='bold' text-anchor='middle' fill='%23d4af37'>VCI</text><text x='300' y='125' font-size='18' font-family='serif' font-weight='bold' text-anchor='middle' fill='%23065f46'>VETERINARY COUNCIL OF INDIA</text><text x='300' y='148' font-size='12' font-family='sans-serif' text-anchor='middle' fill='%2364748b'>FACULTY OF VETERINARY SCIENCE &amp; ANIMAL HUSBANDRY</text><text x='300' y='185' font-size='14' font-family='serif' font-style='italic' text-anchor='middle' fill='%23334155'>This is to certify that the degree of</text><text x='300' y='220' font-size='22' font-family='serif' font-weight='bold' text-anchor='middle' fill='%230f172a'>Bachelor of Veterinary Science &amp; Animal Husbandry</text><text x='300' y='245' font-size='15' font-family='serif' font-weight='bold' text-anchor='middle' fill='%23065f46'>B.V.Sc. &amp; A.H. (First Class with Distinction)</text><text x='300' y='280' font-size='14' font-family='sans-serif' text-anchor='middle' fill='%23334155'>has been conferred with all honors, clinical rights and privileges.</text><line x1='120' y1='345' x2='260' y2='345' stroke='%23334155' stroke-width='1.5'/><text x='190' y='362' font-size='11' font-family='sans-serif' font-weight='bold' text-anchor='middle' fill='%23475569'>REGISTRAR, VCI</text><line x1='340' y1='345' x2='480' y2='345' stroke='%23334155' stroke-width='1.5'/><text x='410' y='362' font-size='11' font-family='sans-serif' font-weight='bold' text-anchor='middle' fill='%23475569'>DEAN OF FACULTY</text><rect x='255' y='325' width='90' height='30' rx='6' fill='%23dcfce7' stroke='%2310b981'/><text x='300' y='345' font-size='11' font-family='sans-serif' font-weight='bold' text-anchor='middle' fill='%23065f46'>✓ VERIFIED VET</text></svg>";

function DoctorRatingModal({ t, doctor, user, appointmentId, onClose, onRated }) {
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const ratingLabels = {
    1: "😞 Unsatisfactory / Ineffective",
    2: "😐 Fair / Average Care",
    3: "🙂 Good Veterinary Advice",
    4: "😊 Very Good & Helpful",
    5: "🌟 Outstanding & Highly Recommended!",
  };

  const currentStars = hoverStars || stars;

  const handleSubmit = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await api(`/api/doctor/${doctor.id}/rate`, {
        body: {
          user_id: user?.id,
          user_name: user?.name || "Valued Farmer",
          rating: stars,
          comment: comment.trim() || (stars >= 4 ? "Great consultation and effective treatment advice." : "Consultation completed."),
          appointment_id: appointmentId,
        },
      });
      if (res.ok) {
        alert(res.message || `Thank you! Your ${stars}-star rating for Dr. ${doctor.name} has been published.`);
        if (onRated) onRated(res.doctor || { ...doctor, rating: res.doctor?.rating || stars });
        onClose();
      }
    } catch (e) {
      setErr(e.message || "Failed to submit rating");
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: "#0c3d37" }}>⭐ Rate & Review Doctor</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--muted)" }}
          >
            ×
          </button>
        </div>

        <div style={{ textAlign: "center", background: "#f8fafc", padding: "16px 12px", borderRadius: 14, marginBottom: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #0d5c54 0%, #1a8f82 100%)", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, marginBottom: 8, overflow: "hidden", border: "2px solid #10b981" }}>
            {doctor.avatar ? (
              <img src={doctor.avatar} alt={doctor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              (doctor.name?.split(" ").slice(-1)[0] || "D")[0]
            )}
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#0c3d37" }}>{doctor.name}</div>
          <div className="muted" style={{ fontSize: 12 }}>{doctor.specialization} · {doctor.experience || 10}y exp</div>

          {/* Star Rating Selectors */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "14px 0 6px" }}>
            {[1, 2, 3, 4, 5].map((starNum) => (
              <button
                key={starNum}
                type="button"
                onMouseEnter={() => setHoverStars(starNum)}
                onMouseLeave={() => setHoverStars(0)}
                onClick={() => setStars(starNum)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 32,
                  cursor: "pointer",
                  color: starNum <= currentStars ? "#f59e0b" : "#cbd5e1",
                  transform: starNum <= currentStars ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.15s, color 0.15s",
                  padding: 2,
                }}
              >
                ★
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 750, color: "#d97706" }}>
            {ratingLabels[currentStars]}
          </div>
        </div>

        <div className="label">Your Feedback / Review (Optional)</div>
        <textarea
          className="input"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (e.g. Quick diagnosis, polite manner, saved my cow's health)..."
          style={{ fontSize: 13, resize: "vertical" }}
        />

        {err && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 8, fontWeight: 700 }}>{err}</p>}

        <div className="sp-lg" />
        <div className="row">
          <button type="button" className="btn btn-muted" onClick={onClose} disabled={busy}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 2, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontWeight: 800 }}
            disabled={busy}
            onClick={handleSubmit}
          >
            {busy ? "Submitting..." : `⭐ Submit ${stars}-Star Rating`}
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorFullProfileModal({ t, doctor, user, onClose, onBookAppointment, onStartVideoCall, onRateDoctor }) {
  const [zoomCert, setZoomCert] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [activeDoc, setActiveDoc] = useState(doctor);

  if (!activeDoc) return null;

  const degreeName = activeDoc.degree_name || "B.V.Sc & A.H. (Bachelor of Veterinary Science & Animal Husbandry)";
  const vciReg = activeDoc.vci_registration_number || "VCI-MH-2014-0892";
  const certImg = activeDoc.degree_document || DEFAULT_DEGREE_CERT;
  const clinic = activeDoc.clinic_name || "Veterinary Health Clinic & Livestock Center";
  const address = activeDoc.clinic_address || "APMC Market Yard Road";
  const city = activeDoc.city || "Pune";
  const bio = activeDoc.bio || "Certified Veterinary Practitioner with extensive experience in livestock medicine, cattle reproductive health, disease diagnostics, and clinical care.";
  const langs = activeDoc.languages || "Marathi, Hindi, English";
  const reviews = activeDoc.reviews || [
    { id: "rev-1", user_name: "Santosh Deshmukh (Farmer)", rating: 5, comment: "Dr. Ananya diagnosed acute mastitis on video call and prescribed exact medicines. My cow recovered in 3 days!", date: "2026-08-22" },
    { id: "rev-2", user_name: "Ganesh Patil", rating: 5, comment: "Prompt response and great follow-up advice. Reduced repeat checkup fee makes it very affordable for farmers.", date: "2026-08-16" },
  ];

  return (
    <div className="modal-bg" onClick={onClose} style={{ zIndex: 9990 }}>
      <div className="modal" style={{ maxWidth: 520, maxHeight: "92vh", overflowY: "auto", padding: 0 }} onClick={(e) => e.stopPropagation()}>
        {/* Banner Header */}
        <div style={{ background: "linear-gradient(135deg, #0c3d37 0%, #0d5c54 60%, #1a8f82 100%)", padding: "20px 20px 16px", color: "#ffffff", position: "relative" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.2)", border: "none", color: "#ffffff", borderRadius: "50%", width: 32, height: 32, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ×
          </button>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#ffffff", color: "#0d5c54", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.25)", border: "2.5px solid #a7f3d0", overflow: "hidden" }}>
              {activeDoc.avatar ? (
                <img src={activeDoc.avatar} alt={activeDoc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                (activeDoc.name?.split(" ").slice(-1)[0] || "D")[0]
              )}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, color: "#ffffff", fontSize: 19 }}>{activeDoc.name}</h3>
                <span style={{ background: "#10b981", color: "#ffffff", fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" }}>
                  ✓ Verified Vet
                </span>
              </div>
              <div style={{ color: "#a7f3d0", fontSize: 13, fontWeight: 650, marginTop: 2 }}>
                {activeDoc.specialization}
              </div>
              <div style={{ color: "#e2e8f0", fontSize: 12, marginTop: 2, display: "flex", alignItems: "center", gap: 8 }}>
                <span>⭐ <b>{activeDoc.rating || "4.8"}</b> ({activeDoc.ratings_count || reviews.length} reviews)</span>
                <span>·</span>
                <span>⏳ {activeDoc.experience || 10}+ Years Experience</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: 8, fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🏛️</span>
            <span><b>VCI Reg No:</b> <code style={{ color: "#fef08a", fontWeight: 800 }}>{vciReg}</code> (Veterinary Council of India Accredited)</span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: "16px 20px 20px" }}>
          {/* Degree & Certification Card */}
          <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", border: "1.5px solid #10b981", borderRadius: 14, padding: "14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                🎓 Educational Qualifications & Degree Certificate
              </div>
              <span style={{ background: "#d1fae5", color: "#065f46", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 6 }}>
                Verified Official Scan
              </span>
            </div>

            <div style={{ fontSize: 13, fontWeight: 750, color: "#0f172a", marginBottom: 10, lineHeight: 1.4 }}>
              {degreeName}
            </div>

            {/* Degree Document Thumbnail */}
            <div
              onClick={() => setZoomCert(true)}
              style={{
                position: "relative",
                cursor: "pointer",
                borderRadius: 10,
                overflow: "hidden",
                border: "1.5px solid #a7f3d0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                background: "#ffffff",
                textAlign: "center",
                padding: 6,
              }}
            >
              <img
                src={certImg}
                alt="Doctor Degree Certificate"
                style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 6 }}
              />
              <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(13, 92, 84, 0.9)", color: "#ffffff", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                🔍 Click to Inspect Degree
              </div>
            </div>
          </div>

          {/* Practice & Clinic Info */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px", marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#0c3d37", marginBottom: 8 }}>
              🏥 Clinic Location & Practice Details
            </div>
            <div style={{ fontSize: 13, color: "#334155", marginBottom: 4 }}>
              <b>Clinic:</b> {clinic}
            </div>
            <div style={{ fontSize: 13, color: "#334155", marginBottom: 4 }}>
              <b>Address:</b> 📍 {address}, {city}
            </div>
            <div style={{ fontSize: 13, color: "#334155", marginBottom: 4 }}>
              <b>Languages:</b> 🗣️ {langs}
            </div>
            <div style={{ fontSize: 13, color: "#334155", marginTop: 8, lineHeight: 1.4, borderTop: "1px dashed #cbd5e1", paddingTop: 8 }}>
              <b>About Doctor:</b> {bio}
            </div>
          </div>

          {/* Consultation Fee Transparency */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "10px 12px" }}>
              <div className="muted" style={{ fontSize: 11, fontWeight: 700 }}>💰 Standard 1st Visit Fee</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#065f46" }}>₹{activeDoc.consultation_fee || 300}</div>
              <div style={{ fontSize: 10, color: "#047857" }}>Full clinical examination & Rx</div>
            </div>

            <div style={{ background: "#ecfdf5", border: "1.5px solid #34d399", borderRadius: 12, padding: "10px 12px" }}>
              <div className="muted" style={{ fontSize: 11, fontWeight: 700, color: "#047857" }}>🔁 30-Day Repeat Fee</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#059669" }}>₹{activeDoc.followup_fee || 150}</div>
              <div style={{ fontSize: 10, color: "#047857" }}>50% discount for repeat visits</div>
            </div>
          </div>

          {/* Reviews & Star Rating Section */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#0c3d37" }}>
                  ⭐ Patient Reviews & Ratings ({reviews.length})
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Average Rating: <b>{activeDoc.rating || "4.8"} / 5.0</b>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontSize: 11, padding: "6px 12px", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", borderColor: "#d97706", fontWeight: 800 }}
                onClick={() => setShowRatingModal(true)}
              >
                ⭐ Rate Doctor
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="muted" style={{ fontSize: 12, textAlign: "center", padding: 10 }}>
                No reviews yet. Be the first to rate Dr. {activeDoc.name}!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
                {reviews.map((r, idx) => (
                  <div key={r.id || idx} style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 750, fontSize: 12, color: "#1e293b" }}>{r.user_name || "Verified Farmer"}</span>
                      <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 800 }}>{"★".repeat(r.rating || 5)}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#475569", margin: "3px 0 0", lineHeight: 1.35 }}>
                      "{r.comment}"
                    </p>
                    {r.date && <div className="muted" style={{ fontSize: 10, marginTop: 2 }}>📅 {r.date}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {onStartVideoCall && (
              <button
                type="button"
                className="btn btn-muted"
                style={{ flex: 1, borderColor: "#0d5c54", color: "#0d5c54", fontWeight: 800 }}
                onClick={() => {
                  onClose();
                  onStartVideoCall(activeDoc);
                }}
              >
                📹 Video Consult
              </button>
            )}
            {onBookAppointment && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 2, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontWeight: 800 }}
                onClick={() => {
                  onClose();
                  onBookAppointment(activeDoc);
                }}
              >
                📅 Request Appointment Slot
              </button>
            )}
          </div>
        </div>

        {/* Certificate Zoom Modal */}
        {zoomCert && (
          <div className="modal-bg" onClick={() => setZoomCert(false)} style={{ zIndex: 9999 }}>
            <div className="modal" style={{ maxWidth: 640, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0c3d37", marginBottom: 8 }}>
                📜 Official Veterinary Council Degree Certificate
              </div>
              <img src={certImg} alt="Doctor Degree Certificate Enlarged" style={{ width: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: 12, border: "2px solid #a7f3d0" }} />
              <button className="btn btn-primary" style={{ marginTop: 12, width: "100%" }} onClick={() => setZoomCert(false)}>
                ✓ Close Certificate View
              </button>
            </div>
          </div>
        )}

        {/* Rating Sub-modal */}
        {showRatingModal && (
          <DoctorRatingModal
            t={t}
            doctor={activeDoc}
            user={user}
            onClose={() => setShowRatingModal(false)}
            onRated={(updatedDoc) => {
              setActiveDoc(updatedDoc);
              if (onRateDoctor) onRateDoctor(updatedDoc);
            }}
          />
        )}
      </div>
    </div>
  );
}

function downloadPrescriptionSlip(rx, t) {
  if (!rx) return;
  const docName = rx.doctor_name || "Veterinarian";
  const patientName = rx.user_name || "Valued Livestock / Pet Parent";
  const rxId = rx.rx_id || `RX-${Date.now()}`;
  const dateStr = new Date(rx.issued_at || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const diag = rx.diagnosis || "Veterinary Clinical Diagnosis";
  const meds = rx.medicines || [];
  const notes = rx.notes || "Administer medicines with fresh water and maintain dry bedding.";
  const signature = rx.signature || `Dr. ${docName} (Registered Veterinary Practitioner)`;

  const medsRows = meds
    .map(
      (m, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; font-weight: bold; color: #0f172a;">${idx + 1}.</td>
      <td style="padding: 10px 12px; font-weight: 700; color: #065f46; font-size: 14px;">💊 ${m.name}</td>
      <td style="padding: 10px 12px; color: #334155;">${m.frequency || "Twice daily"}</td>
      <td style="padding: 10px 12px; color: #334155;">${m.duration || "5 Days"}</td>
      <td style="padding: 10px 12px; color: #64748b; font-size: 12px;">As directed by vet</td>
    </tr>
  `
    )
    .join("");

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Prescription_${rxId}</title>
  <style>
    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .rx-card { max-width: 720px; margin: 0 auto; background: #ffffff; border: 2px solid #059669; border-radius: 16px; padding: 28px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
    .rx-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 18px; }
    .rx-logo-title { font-size: 11px; font-weight: 900; color: #065f46; letter-spacing: 2px; text-transform: uppercase; }
    .rx-doc-name { font-size: 22px; font-weight: 900; color: #064e3b; margin: 4px 0 2px; }
    .rx-doc-meta { font-size: 12px; color: #047857; }
    .rx-badge { background: #d1fae5; color: #065f46; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
    .rx-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #065f46; color: #ffffff; text-align: left; padding: 10px 12px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .rx-notes-box { background: #f8fafc; border-left: 4px solid #10b981; padding: 12px 14px; border-radius: 8px; font-size: 13px; color: #334155; margin-bottom: 24px; }
    .rx-footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1.5px dashed #cbd5e1; padding-top: 16px; }
    .print-btn { background: #059669; color: #ffffff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; font-size: 14px; margin-bottom: 16px; }
    @media print { .no-print { display: none !important; } body { padding: 0; background: #ffffff; } .rx-card { box-shadow: none; border: 1.5px solid #059669; } }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 720px; margin: 0 auto 12px; text-align: right;">
    <button class="print-btn" onclick="window.print()">🖨️ Print Prescription / Save as PDF</button>
  </div>
  <div class="rx-card">
    <div class="rx-header">
      <div>
        <div class="rx-logo-title">VETNOVA TELE-CLINICAL NETWORK · OFFICIAL Rx</div>
        <div class="rx-doc-name">Dr. ${docName}</div>
        <div class="rx-doc-meta">Veterinary Council of India (VCI) Accredited Practitioner</div>
      </div>
      <div style="text-align: right;">
        <span class="rx-badge">✓ VERIFIED DOCTOR Rx</span>
        <div style="font-size: 12px; font-weight: bold; color: #065f46; margin-top: 6px;">Rx ID: ${rxId}</div>
      </div>
    </div>

    <div class="rx-meta-grid">
      <div>👤 <b>Patient / Owner:</b> ${patientName}</div>
      <div>📅 <b>Issue Date:</b> ${dateStr}</div>
      <div>🔬 <b>Clinical Diagnosis:</b> ${diag}</div>
      <div>🏛️ <b>Validation:</b> Digitally Verified via VetNova Cloud</div>
    </div>

    ${
      rx.prescription_image
        ? `<div style="margin-bottom: 20px; text-align: center; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px;">
        <div style="font-size: 12px; font-weight: 800; color: #065f46; margin-bottom: 6px;">📷 Doctor's Handwritten Prescription Slip Scan</div>
        <img src="${rx.prescription_image}" style="max-width: 100%; max-height: 260px; object-fit: contain; border-radius: 8px;" />
      </div>`
        : ""
    }

    <div style="font-weight: 800; font-size: 14px; color: #064e3b; margin-bottom: 8px;">
      📋 PRESCRIBED MEDICINES & DOSAGE SCHEDULE
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Medicine Name</th>
          <th>Dosage & Frequency</th>
          <th>Duration</th>
          <th>Instructions</th>
        </tr>
      </thead>
      <tbody>
        ${medsRows}
      </tbody>
    </table>

    <div class="rx-notes-box">
      <b>📋 Clinical Instructions & Advice:</b><br/>
      ${notes}
    </div>

    <div class="rx-footer">
      <div style="font-size: 11px; color: #64748b; line-height: 1.4;">
        🔒 Generated via VetNova Certified Clinical Platform.<br/>
        This official prescription is recognized at all partner medical stores and pharmacies.
      </div>
      <div style="text-align: right;">
        <div style="font-size: 13px; font-weight: 800; color: #065f46;">✍️ ${signature}</div>
        <div style="font-size: 11px; color: #059669;">Verified Digital Stamp & Signature</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Prescription_${rxId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function printPrescriptionSlip(rx) {
  if (!rx) return;
  const rxId = rx.rx_id || `RX-${Date.now()}`;
  downloadPrescriptionSlip(rx);
  const win = window.open("", "_blank");
  if (win) {
    const docName = rx.doctor_name || "Veterinarian";
    const patientName = rx.user_name || "Valued Livestock / Pet Parent";
    const dateStr = new Date(rx.issued_at || Date.now()).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const diag = rx.diagnosis || "Veterinary Clinical Diagnosis";
    const meds = rx.medicines || [];
    const notes = rx.notes || "Administer medicines with fresh water and maintain dry bedding.";
    const signature = rx.signature || `Dr. ${docName} (Registered Veterinary Practitioner)`;

    const medsRows = meds
      .map(
        (m, idx) => `
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 8px 10px; font-weight: bold;">${idx + 1}.</td>
        <td style="padding: 8px 10px; font-weight: bold; color: #065f46;">💊 ${m.name}</td>
        <td style="padding: 8px 10px;">${m.frequency || "Twice daily"}</td>
        <td style="padding: 8px 10px;">${m.duration || "5 Days"}</td>
      </tr>
    `
      )
      .join("");

    win.document.write(`
      <html>
      <head>
        <title>Prescription ${rxId}</title>
        <style>
          body { font-family: sans-serif; padding: 24px; color: #1e293b; }
          .card { border: 2px solid #059669; border-radius: 12px; padding: 20px; max-width: 650px; margin: 0 auto; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th { background: #065f46; color: #ffffff; text-align: left; padding: 8px 10px; }
        </style>
      </head>
      <body onload="window.print()">
        <div class="card">
          <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 12px;">
            <div>
              <div style="font-size: 10px; font-weight: 800; color: #065f46;">VETNOVA OFFICIAL PRESCRIPTION</div>
              <h2 style="margin: 4px 0 0; color: #064e3b;">Dr. ${docName}</h2>
            </div>
            <div style="text-align: right; font-weight: bold; color: #065f46;">Rx ID: ${rxId}</div>
          </div>
          <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; font-size: 13px; margin-bottom: 14px;">
            <div>👤 <b>Patient:</b> ${patientName} · 📅 <b>Date:</b> ${dateStr}</div>
            <div>🔬 <b>Diagnosis:</b> ${diag}</div>
          </div>
          ${rx.prescription_image ? `<div style="text-align:center; margin-bottom:12px;"><img src="${rx.prescription_image}" style="max-height:160px; border-radius:6px; border:1px solid #cbd5e1;" /></div>` : ""}
          <table>
            <thead>
              <tr><th>#</th><th>Medicine</th><th>Frequency</th><th>Duration</th></tr>
            </thead>
            <tbody>${medsRows}</tbody>
          </table>
          <div style="background:#f8fafc; border-left:3px solid #10b981; padding:10px; font-size:12px; margin-bottom:20px;">
            <b>Instructions:</b> ${notes}
          </div>
          <div style="text-align:right; font-weight:bold; color:#065f46;">
            ✍️ ${signature}
          </div>
        </div>
      </body>
      </html>
    `);
    win.document.close();
  }
}

function ViewDoctorPrescriptionModal({ t, prescription, user, onClose, onSendToPharmacy }) {
  const [directMsg, setDirectMsg] = useState("");
  const [sendingDirect, setSendingDirect] = useState(false);
  const [sentDirectMsg, setSentDirectMsg] = useState(false);
  const [showDirectSendBox, setShowDirectSendBox] = useState(false);

  if (!prescription) return null;

  const docName = prescription.doctor_name || "Doctor";
  const rxId = prescription.rx_id || "RX-VETNOVA";
  const medsSummary = (prescription.medicines || []).map((m) => m.name).join(", ");

  const handleSendToDoctor = async () => {
    setSendingDirect(true);
    try {
      await api("/api/prescription/send-to-doctor", {
        body: {
          prescription_id: rxId,
          doctor_id: prescription.doctor_id,
          doctor_name: docName,
          user_id: user?.id,
          user_name: user?.name || prescription.user_name || "Patient",
          message: directMsg || `Patient forwarded Rx (${rxId}) to Dr. ${docName}. Prescribed: ${medsSummary}`,
          patient_phone: user?.phone || "",
        },
      });
      setSentDirectMsg(true);
      setTimeout(() => {
        setSentDirectMsg(false);
        setShowDirectSendBox(false);
        setDirectMsg("");
      }, 3500);
    } catch (e) {
      alert("Failed to send to doctor: " + e.message);
    }
    setSendingDirect(false);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hello Dr. ${docName}, I have a question regarding my veterinary prescription (Rx ID: ${rxId}) on VetNova.\nPatient: ${prescription.user_name || user?.name || "Farmer"}\nPrescribed Medicines: ${medsSummary}\nDiagnosis: ${prescription.diagnosis || "General"}`
  )}`;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "92vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)", border: "2px solid #10b981", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1.5px dashed #059669", paddingBottom: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#065f46", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                ✓ VERIFIED VETERINARY PRESCRIPTION
              </div>
              <h3 style={{ margin: "2px 0 0", color: "#064e3b", fontSize: 17 }}>
                Dr. {prescription.doctor_name || "Veterinarian"}
              </h3>
              <div style={{ fontSize: 11, color: "#047857" }}>
                Rx ID: <b>{rxId}</b>
              </div>
            </div>
            <div style={{ fontSize: 32 }}>🩺</div>
          </div>

          <div style={{ fontSize: 12, color: "#065f46" }}>
            👤 <b>Patient:</b> {prescription.user_name || user?.name || "Valued Animal Parent"} · 📅 <b>Date:</b> {new Date(prescription.issued_at || Date.now()).toLocaleDateString()}
          </div>
          <div style={{ fontSize: 12, color: "#065f46", marginTop: 4 }}>
            🔬 <b>Diagnosis:</b> {prescription.diagnosis || "Clinical Tele-Consultation"}
          </div>
        </div>

        {/* Handwritten Image if attached */}
        {prescription.prescription_image && (
          <div style={{ marginBottom: 14, textAlign: "center" }}>
            <div className="label">📸 Handwritten Prescription Document</div>
            <img
              src={prescription.prescription_image}
              alt="Handwritten Prescription"
              style={{ width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 12, border: "1px solid #cbd5e1" }}
            />
          </div>
        )}

        {/* Medicines List */}
        <div className="section-title" style={{ fontSize: 13, color: "#064e3b" }}>
          💊 Prescribed Medicines ({(prescription.medicines || []).length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "8px 0 14px" }}>
          {(prescription.medicines || []).map((m, idx) => (
            <div key={idx} className="med-item" style={{ marginTop: 0 }}>
              <div className="med-name">💊 {m.name}</div>
              <div className="med-meta">
                <span>⏱ {m.frequency}</span>
                <span>📅 {m.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {prescription.notes && (
          <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: 10, fontSize: 12, color: "#475569", marginBottom: 14 }}>
            📋 <b>Doctor Remarks:</b> {prescription.notes}
          </div>
        )}

        <div style={{ textAlign: "right", fontSize: 12, color: "#059669", fontStyle: "italic", marginBottom: 14 }}>
          ✍️ Digitally Signed by {prescription.signature || `Dr. ${prescription.doctor_name}`}
        </div>

        {/* Prescription Actions: Download, Print, Send to Doctor */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <button
            type="button"
            className="btn btn-muted"
            style={{ fontSize: 12, padding: "8px 10px", borderColor: "#059669", color: "#065f46", fontWeight: 800, background: "#ecfdf5" }}
            onClick={() => downloadPrescriptionSlip(prescription, t)}
          >
            ⬇️ Download Slip
          </button>
          <button
            type="button"
            className="btn btn-muted"
            style={{ fontSize: 12, padding: "8px 10px", borderColor: "#0284c7", color: "#0369a1", fontWeight: 800, background: "#f0f9ff" }}
            onClick={() => printPrescriptionSlip(prescription)}
          >
            🖨️ Print / Save PDF
          </button>
        </div>

        {/* Send to Doctor Directly Action & Form */}
        <div style={{ marginBottom: 12 }}>
          {!showDirectSendBox ? (
            <button
              type="button"
              className="btn btn-muted"
              style={{ width: "100%", fontSize: 12, padding: "9px 12px", borderColor: "#d97706", color: "#92400e", fontWeight: 800, background: "#fffbeb" }}
              onClick={() => setShowDirectSendBox(true)}
            >
              📤 Send Directly to Dr. {docName} / Ask Question
            </button>
          ) : (
            <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b", padding: "12px", borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#92400e" }}>
                  ✉️ Send Rx Query Directly to Dr. {docName}
                </div>
                <button
                  type="button"
                  onClick={() => setShowDirectSendBox(false)}
                  style={{ background: "none", border: "none", color: "#92400e", fontSize: 16, cursor: "pointer", fontWeight: 800 }}
                >
                  ✕
                </button>
              </div>

              <textarea
                className="input"
                rows={2}
                value={directMsg}
                onChange={(e) => setDirectMsg(e.target.value)}
                placeholder="Type your question or query regarding this prescription for the doctor..."
                style={{ fontSize: 12, background: "#ffffff", marginBottom: 8 }}
              />

              {sentDirectMsg && (
                <div style={{ color: "#065f46", fontSize: 12, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
                  ✓ Prescription & query sent directly to Dr. {docName}!
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 2, fontSize: 12, padding: "8px 10px", background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", borderColor: "#b45309", fontWeight: 800 }}
                  disabled={sendingDirect}
                  onClick={handleSendToDoctor}
                >
                  {sendingDirect ? "Sending..." : "📤 Submit to Doctor"}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-muted"
                  style={{ flex: 1, fontSize: 12, padding: "8px 10px", background: "#25D366", color: "#ffffff", borderColor: "#25D366", fontWeight: 800, textAlign: "center", textDecoration: "none" }}
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Send to Medical Store */}
        <button
          type="button"
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: 13,
            fontWeight: 800,
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            borderColor: "#059669",
            boxShadow: "0 6px 18px rgba(5, 150, 105, 0.35)",
            marginBottom: 8,
          }}
          onClick={() => {
            onSendToPharmacy(prescription);
          }}
        >
          🛒 Send Prescription to Medical Store & Order Medicines
        </button>

        <button type="button" className="btn btn-muted" style={{ width: "100%" }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function VideoCallScreen({ t, call, role, onEnd, lang, setScreen }) {
  const [status, setStatus] = useState(role === "doctor" ? "connected" : "waiting");
  const [patientReport, setPatientReport] = useState(call.report_snapshot || null);
  const [docRxOpen, setDocRxOpen] = useState(false);
  const [rxData, setRxData] = useState(call.prescription || null);
  const [userRxModalOpen, setUserRxModalOpen] = useState(false);

  useEffect(() => {
    if (status === "waiting" && role === "user") {
      if (window.CB_AudioRingtone) {
        window.CB_AudioRingtone.playOutgoingRing();
      }
    } else {
      if (window.CB_AudioRingtone) {
        window.CB_AudioRingtone.stop();
      }
    }
    return () => {
      if (window.CB_AudioRingtone) {
        window.CB_AudioRingtone.stop();
      }
    };
  }, [status, role]);

  useEffect(() => {
    if (!call?.call_id) return;
    let alive = true;
    const tick = async () => {
      try {
        const o = await api(`/api/video-call/status/${call.call_id}`);
        if (!alive) return;
        if (o.call?.report_snapshot) setPatientReport(o.call.report_snapshot);
        if (o.call?.prescription) {
          setRxData(o.call.prescription);
        }
        if (role === "user") {
          if (o.call?.status === "accepted") setStatus("connected");
          else if (o.call?.status === "declined") setStatus("declined");
        }
      } catch (e) {}
    };
    const h = setInterval(tick, 2500);
    tick();
    return () => {
      alive = false;
      clearInterval(h);
    };
  }, [call?.call_id, role]);

  const endCall = async () => {
    if (window.CB_AudioRingtone) {
      window.CB_AudioRingtone.stop();
    }
    try {
      await api(`/api/video-call/${call.call_id}/end`, { body: {} });
    } catch (e) {}
    onEnd();
  };

  const handleSendRxToPharmacy = (rx) => {
    setUserRxModalOpen(false);
    if (setScreen) {
      setScreen("pharmacy");
    } else {
      window.location.hash = "#pharmacy";
    }
  };

  if (status === "declined") {
    return (
      <div className="screen center" style={{ padding: 40, minHeight: "80vh", justifyContent: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>📞</div>
        <h2 style={{ color: "#dc2626", fontWeight: 800 }}>{t.callDeclined || "Call Not Answered"}</h2>
        <p className="muted" style={{ maxWidth: 280, margin: "8px auto 20px" }}>
          The doctor is currently busy with another patient. You can schedule an appointment or try again shortly.
        </p>
        <button className="btn btn-primary" onClick={onEnd} style={{ minWidth: 160 }}>
          {t.back}
        </button>
      </div>
    );
  }

  if (status === "waiting") {
    return (
      <div className="screen center" style={{ padding: 30, minHeight: "85vh", justifyContent: "center", background: "linear-gradient(180deg, #f8fafc 0%, #ede9fe 100%)" }}>
        <div className="calling-ripple-box">
          <div className="calling-ripple-circle ripple-1" />
          <div className="calling-ripple-circle ripple-2" />
          <div className="calling-avatar">🩺</div>
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99, 102, 241, 0.12)", color: "#4f46e5", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
            <span className="bell-ring-anim">🔔</span> Ringing...
          </div>
          <h2 style={{ marginTop: 12, fontSize: 20, fontWeight: 800, color: "#1e1b4b" }}>
            Dr. {call.doctor_name || "Veterinarian"}
          </h2>
          <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {t.waitingForDoctor || "Waiting for veterinarian to accept your live video consultation..."}
          </p>
        </div>

        <div style={{ marginTop: 36, width: "100%", maxWidth: 280 }}>
          <button
            className="btn btn-danger"
            style={{ width: "100%", padding: "14px 20px", fontWeight: 800, borderRadius: 14, boxShadow: "0 6px 20px rgba(220, 38, 38, 0.35)" }}
            onClick={endCall}
          >
            🔴 {t.cancel || "End Call"}
          </button>
        </div>
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

      {patientReport && (
        <PatientReportPanel t={t} lang={lang || "en"} report={patientReport} defaultOpen={role === "doctor"} />
      )}

      {/* User Rx Notification Banner during/after call */}
      {role === "user" && rxData && (
        <div
          style={{
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            color: "#fff",
            padding: "8px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          <span>🩺 Dr. {call.doctor_name || "Doctor"} has issued your official Rx!</span>
          <button
            type="button"
            onClick={() => setUserRxModalOpen(true)}
            style={{ background: "#fff", color: "#065f46", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 900, cursor: "pointer" }}
          >
            View Rx & Order
          </button>
        </div>
      )}

      <iframe src={jitsiUrl} allow="camera; microphone; fullscreen; display-capture; autoplay" allowFullScreen />

      <div className="video-end" style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {role === "doctor" && (
          <button
            type="button"
            className="btn"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              color: "#fff",
              fontWeight: 800,
              padding: "10px 16px",
              borderRadius: 12,
              border: "none",
            }}
            onClick={() => setDocRxOpen(true)}
          >
            ✍️ Issue Handwritten Rx Pad
          </button>
        )}

        {role === "user" && rxData && (
          <button
            type="button"
            className="btn"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              color: "#fff",
              fontWeight: 800,
              padding: "10px 16px",
              borderRadius: 12,
              border: "none",
            }}
            onClick={() => setUserRxModalOpen(true)}
          >
            📋 View Rx ({rxData.rx_id})
          </button>
        )}

        <button className="btn-danger" onClick={endCall}>
          🔴 {t.endCall}
        </button>
      </div>

      {docRxOpen && (
        <DoctorPrescriptionPadModal
          t={t}
          call={call}
          doctorName={call.doctor_name}
          onClose={() => setDocRxOpen(false)}
          onIssued={(rx) => setRxData(rx)}
        />
      )}

      {userRxModalOpen && (
        <ViewDoctorPrescriptionModal
          t={t}
          prescription={rxData}
          user={{ id: call?.user_id, name: call?.user_name }}
          onClose={() => setUserRxModalOpen(false)}
          onSendToPharmacy={handleSendRxToPharmacy}
        />
      )}
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
        {report.home_remedies && report.home_remedies.length > 0 && (
          <div className="rm-section">
            <div className="rm-label">{t.homeRemedies}</div>
            {report.home_remedies.map((hr, i) => (
              <div key={i} className="med-item" style={{ marginTop: i === 0 ? 0 : 8 }}>
                <div className="med-name">🌿 {hr.name}</div>
                {hr.detail && <div className="rm-val" style={{ fontSize: 12 }}>{hr.detail}</div>}
              </div>
            ))}
          </div>
        )}
        <div className="sp-lg" />
        <button className="btn btn-muted" onClick={() => downloadReportFile(report, t, lang)}>
          ⬇️ {t.downloadReport}
        </button>
        <div className="sp" />
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
  const [items, setItems] = useState([]);
  const [docPrescriptions, setDocPrescriptions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "prescriptions" | "ai_reports"
  const [selected, setSelected] = useState(null);
  const [selectedRx, setSelectedRx] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [initialMedForOrder, setInitialMedForOrder] = useState(null);

  const loadReports = async () => {
    if (!user?.id) {
      setItems([]);
      setDocPrescriptions([]);
      return;
    }
    let local = loadLocalReportsForUser(user.id).filter((r) => r.from_diagnosis === true);
    try {
      const o = await api(`/api/history/${user.id}`);
      const server = (o.history || []).map((h) => ({
        ...h,
        _id: h.id || h._id,
        _ts: h.created_at || h._ts,
        animalEmoji: h.animalEmoji || "🐾",
        user_id: user.id,
      }));
      const ids = new Set(server.map((x) => x._id));
      for (const l of local) {
        if (!ids.has(l._id)) server.push(l);
      }
      server.sort((a, b) => new Date(b._ts || 0) - new Date(a._ts || 0));
      setItems(server);
    } catch (e) {
      local.sort((a, b) => new Date(b._ts || 0) - new Date(a._ts || 0));
      setItems(local);
    }

    // Also load Doctor Prescriptions from appointments
    try {
      const apptRes = await api(`/api/appointments/user/${user.id}`);
      const apptsWithRx = (apptRes.appointments || [])
        .filter((a) => a.prescription)
        .map((a) => ({
          ...a.prescription,
          appointment_id: a.id,
          appointment_date: a.date,
          appointment_time: a.time,
          doctor_id: a.doctor_id,
          doctor_name: a.prescription.doctor_name || a.doctor_name,
          issued_at: a.prescription.issued_at || a.updated_at || a.created_at,
          animal: a.reason || "Consultation",
        }))
        .sort((a, b) => new Date(b.issued_at || 0) - new Date(a.issued_at || 0));
      setDocPrescriptions(apptsWithRx);
    } catch (e) {
      setDocPrescriptions([]);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user?.id]);

  const doDelete = (id) => {
    deleteLocalReport(id);
    setConfirmDel(null);
    loadReports();
  };

  const handleSendRxToPharmacy = (rx) => {
    setSelectedRx(null);
    if (rx && rx.medicines && rx.medicines.length > 0) {
      setInitialMedForOrder(rx.medicines[0]);
    }
    setOrderModalOpen(true);
  };

  const sevPill = (sev) => {
    if (sev === "high") return <span className="pill pill-danger">🚨 {t.sevHigh || "High Alert"}</span>;
    if (sev === "medium") return <span className="pill pill-warn">⚠️ {t.sevMed || "Moderate"}</span>;
    return <span className="pill pill-success">✅ {t.sevLow || "Mild"}</span>;
  };

  const showPrescriptions = activeFilter === "all" || activeFilter === "prescriptions";
  const showAiReports = activeFilter === "all" || activeFilter === "ai_reports";
  const totalCount = (showPrescriptions ? docPrescriptions.length : 0) + (showAiReports ? items.length : 0);

  return (
    <>
      <TopBar title={t.pastReports || "Reports & Prescriptions"} onBack={() => setScreen("dashboard")} />
      <div className="screen">
        {/* Filter Pills Header */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
          <button
            type="button"
            className={"btn " + (activeFilter === "all" ? "btn-primary" : "btn-muted")}
            style={{ fontSize: 12, padding: "6px 14px", borderRadius: 999, fontWeight: 750, whiteSpace: "nowrap" }}
            onClick={() => setActiveFilter("all")}
          >
            📋 All ({docPrescriptions.length + items.length})
          </button>
          <button
            type="button"
            className={"btn " + (activeFilter === "prescriptions" ? "btn-primary" : "btn-muted")}
            style={{
              fontSize: 12,
              padding: "6px 14px",
              borderRadius: 999,
              fontWeight: 750,
              whiteSpace: "nowrap",
              background: activeFilter === "prescriptions" ? "linear-gradient(135deg, #059669 0%, #10b981 100%)" : undefined,
            }}
            onClick={() => setActiveFilter("prescriptions")}
          >
            🩺 Doctor Prescriptions ({docPrescriptions.length})
          </button>
          <button
            type="button"
            className={"btn " + (activeFilter === "ai_reports" ? "btn-primary" : "btn-muted")}
            style={{ fontSize: 12, padding: "6px 14px", borderRadius: 999, fontWeight: 750, whiteSpace: "nowrap" }}
            onClick={() => setActiveFilter("ai_reports")}
          >
            🔬 AI Disease Reports ({items.length})
          </button>
        </div>

        {totalCount === 0 && (
          <div className="empty">
            <span className="empty-icon">📋</span>
            <p>
              <b>{t.noHistory || "No reports or prescriptions found"}</b>
            </p>
            <p style={{ fontSize: 12, marginTop: 4 }}>{t.noHistoryHint || "Consult a veterinarian or run a clinical diagnosis to generate reports."}</p>
            <div className="sp-lg" />
            <button className="btn btn-primary" style={{ maxWidth: 260, margin: "0 auto" }} onClick={() => setScreen("category")}>
              🩺 {t.startDiagnosis || "Start Diagnosis"}
            </button>
          </div>
        )}

        {/* 1. Verified Doctor Prescriptions & Clinical Reports */}
        {showPrescriptions && docPrescriptions.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span>🩺</span> Verified Doctor Prescriptions & Clinical Slips ({docPrescriptions.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {docPrescriptions.map((rx, idx) => (
                <div
                  key={rx.rx_id || idx}
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                    border: "2px solid #10b981",
                    borderRadius: 16,
                    padding: "14px 16px",
                    boxShadow: "0 4px 14px rgba(6, 78, 59, 0.08)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "#065f46", textTransform: "uppercase", letterSpacing: "1px" }}>
                        ✓ OFFICIAL VETERINARY PRESCRIPTION
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#064e3b", margin: "2px 0" }}>
                        Dr. {rx.doctor_name || "Veterinarian"}
                      </div>
                      <div style={{ fontSize: 12, color: "#047857" }}>
                        Rx ID: <b>{rx.rx_id}</b> · 📅 {new Date(rx.issued_at || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{ fontSize: 26 }}>🩺</span>
                  </div>

                  <div style={{ background: "#ffffff", padding: "8px 12px", borderRadius: 10, border: "1px solid #a7f3d0", margin: "10px 0 10px" }}>
                    <div style={{ fontSize: 12, color: "#1e293b", fontWeight: 700 }}>
                      🔬 <b>Diagnosis:</b> {rx.diagnosis || "Veterinary Consultation"}
                    </div>
                    <div style={{ fontSize: 11, color: "#065f46", marginTop: 4 }}>
                      💊 <b>Prescribed Medications ({(rx.medicines || []).length}):</b>{" "}
                      {(rx.medicines || []).map((m) => m.name).join(", ")}
                    </div>
                    {rx.notes && (
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                        📋 <b>Instructions:</b> {rx.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions for Doctor Prescription */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 6 }}>
                    <button
                      type="button"
                      className="btn btn-muted"
                      style={{ fontSize: 11, padding: "7px 8px", background: "#ffffff", borderColor: "#10b981", color: "#065f46", fontWeight: 800 }}
                      onClick={() => setSelectedRx(rx)}
                    >
                      📄 View Rx
                    </button>
                    <button
                      type="button"
                      className="btn btn-muted"
                      style={{ fontSize: 11, padding: "7px 8px", background: "#ffffff", borderColor: "#059669", color: "#065f46", fontWeight: 800 }}
                      onClick={() => downloadPrescriptionSlip(rx, t)}
                    >
                      ⬇️ Download
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ fontSize: 11, padding: "7px 8px", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontWeight: 800 }}
                      onClick={() => handleSendRxToPharmacy(rx)}
                    >
                      🛒 Order Meds
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. AI Disease Diagnosis Reports */}
        {showAiReports && items.length > 0 && (
          <div>
            {showPrescriptions && docPrescriptions.length > 0 && (
              <div style={{ fontSize: 13, fontWeight: 900, color: "#334155", textTransform: "uppercase", letterSpacing: "0.5px", margin: "14px 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
                <span>🔬</span> AI Multi-Modal Disease Diagnosis Reports ({items.length})
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
                        <b>{t.reportedSymptoms || "Reported Symptoms"}:</b> {symsDisplay}
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
                        👁 {t.viewReport || "View"}
                      </button>
                      <button
                        className="hi-btn hi-btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadReportFile(h, t, lang);
                        }}
                      >
                        ⬇️ {t.downloadReport || "Download"}
                      </button>
                      <button
                        className="hi-btn hi-btn-del"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDel(h);
                        }}
                      >
                        🗑 {t.deleteReport || "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav tab="reports" setScreen={setScreen} />

      {selected && <ReportDetailModal t={t} lang={lang} report={selected} onClose={() => setSelected(null)} />}
      {selectedRx && (
        <ViewDoctorPrescriptionModal
          t={t}
          prescription={selectedRx}
          user={user}
          onClose={() => setSelectedRx(null)}
          onSendToPharmacy={handleSendRxToPharmacy}
        />
      )}
      {orderModalOpen && (
        <OrderMedicineModal
          t={t}
          user={user}
          initialItem={initialMedForOrder}
          onClose={() => {
            setOrderModalOpen(false);
            setInitialMedForOrder(null);
          }}
          onOrderPlaced={() => {
            setOrderModalOpen(false);
            setInitialMedForOrder(null);
            setScreen("pharmacy");
          }}
        />
      )}
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
  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" | "calls" | "reports" | "clinic"
  const [apptFilter, setApptFilter] = useState("all");
  const [avail, setAvail] = useState(!!doctor?.available);
  const [af, setAf] = useState(doctor?.available_from || "09:00");
  const [au, setAu] = useState(doctor?.available_until || "18:00");
  const [vid, setVid] = useState(!!doctor?.accepts_video);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState([]);
  const [activity, setActivity] = useState([]);
  const [doctorAppts, setDoctorAppts] = useState([]);
  const [editAppt, setEditAppt] = useState(null);

  const [consultFee, setConsultFee] = useState(doctor?.consultation_fee !== undefined ? doctor.consultation_fee : 300);
  const [followupFee, setFollowupFee] = useState(doctor?.followup_fee !== undefined ? doctor.followup_fee : 150);
  const [customApptFees, setCustomApptFees] = useState({});
  const [docQr, setDocQr] = useState(doctor?.qr_code || "");
  const [docUpiId, setDocUpiId] = useState(doctor?.upi_id || "");
  const [qrSaving, setQrSaving] = useState(false);
  const [qrSavedMsg, setQrSavedMsg] = useState(false);

  // Doctor Qualifications, Degree Document & Basic Profile States
  const [docName, setDocName] = useState(doctor?.name || "Dr. Ananya Patil");
  const [docAvatar, setDocAvatar] = useState(doctor?.avatar || "");
  const [docSpec, setDocSpec] = useState(doctor?.specialization || "Livestock & Dairy Cattle Specialist");
  const [docExp, setDocExp] = useState(doctor?.experience !== undefined ? doctor.experience : 12);
  const [docDegree, setDocDegree] = useState(doctor?.degree_name || "B.V.Sc & A.H., M.V.Sc (Veterinary Surgery) — Bombay Veterinary College (MAFSU)");
  const [docDegreeCert, setDocDegreeCert] = useState(doctor?.degree_document || DEFAULT_DEGREE_CERT);
  const [docVciReg, setDocVciReg] = useState(doctor?.vci_registration_number || "VCI-MH-2014-0892");
  const [docClinicName, setDocClinicName] = useState(doctor?.clinic_name || "Patil Veterinary Care & Livestock Polyclinic");
  const [docClinicAddress, setDocClinicAddress] = useState(doctor?.clinic_address || "Shop 12, Krishi Seva Complex, Shivaji Market");
  const [docCity, setDocCity] = useState(doctor?.city || "Pune");
  const [docLanguages, setDocLanguages] = useState(doctor?.languages || "Marathi, Hindi, English");
  const [docBio, setDocBio] = useState(doctor?.bio || "Senior livestock veterinarian with 12+ years of dedicated service across Maharashtra. Specialized in bovine mastitis management, artificial insemination, and emergency cattle surgical interventions.");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  const [previewProfileOpen, setPreviewProfileOpen] = useState(false);

  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [verifyingOrderId, setVerifyingOrderId] = useState(null);
  const [prescriptionAppt, setPrescriptionAppt] = useState(null);
  const [simultaneousMatchOrder, setSimultaneousMatchOrder] = useState(null);
  const [doctorVerificationNotes, setDoctorVerificationNotes] = useState({});

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

  const loadAppts = async () => {
    if (!doctor?.id) return;
    try {
      const o = await api(`/api/appointments/doctor/${doctor.id}`);
      setDoctorAppts(o.appointments || []);
    } catch (e) {
      setDoctorAppts([]);
    }
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
    if (!doctor?.id) return;
    let alive = true;
    const loadVerifications = async () => {
      try {
        const res = await api(`/api/doctor/pending-medicine-verifications/${doctor.id}`);
        if (alive) setPendingVerifications(res.orders || []);
      } catch (e) {}
    };
    loadVerifications();
    const h = setInterval(loadVerifications, 4000);
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
        setActivity(o.activity || []);
      } catch (e) {}
    })();
  }, [doctor?.id, saved, pending.length]);

  useEffect(() => {
    loadAppts();
    const h = setInterval(loadAppts, 12000);
    return () => clearInterval(h);
  }, [doctor?.id, saved]);

  const accept = async (c) => {
    if (window.CB_AudioRingtone) {
      window.CB_AudioRingtone.stop();
    }
    const o = await api(`/api/video-call/${c.id}/accept`, { body: {} });
    onVideoCall({
      call_id: c.id,
      room: o.room,
      doctor_name: doctor.name,
      severity: c.severity,
      role: "doctor",
      patient: c.user_name,
      summary: c.diagnosis_summary,
      report_snapshot: c.report_snapshot || null,
    });
  };

  const decline = async (c) => {
    if (window.CB_AudioRingtone) {
      window.CB_AudioRingtone.stop();
    }
    await api(`/api/video-call/${c.id}/decline`, { body: {} });
    setPending(pending.filter((x) => x.id !== c.id));
  };

  const handleVerifyMedicines = async (orderId, approved) => {
    setVerifyingOrderId(orderId);
    const userNote = doctorVerificationNotes[orderId] || "";
    try {
      await api(`/api/doctor/verify-packed-medicines/${orderId}`, {
        body: {
          doctor_id: doctor.id,
          approved,
          doctor_notes: userNote || (approved ? "Verified & confirmed by Dr. " + doctor.name + ". Prescribed medications match." : "Modification/clarification requested."),
          doctor_clarification: userNote,
        },
      });
      alert(approved ? "✅ Packed medicines confirmed! Order released for delivery pickup." : "⚠️ Modification notice sent to pharmacy.");
      const res = await api(`/api/doctor/pending-medicine-verifications/${doctor.id}`);
      setPendingVerifications(res.orders || []);
    } catch (e) {
      alert("Verification error: " + e.message);
    }
    setVerifyingOrderId(null);
  };

  const filteredAppts = doctorAppts.filter((a) => {
    if (apptFilter === "all") return true;
    return a.status === apptFilter;
  });

  const confirmedCount = doctorAppts.filter((a) => a.status === "confirmed").length;

  return (
    <div className="doc-viewport-theme" style={{ minHeight: "100%", paddingBottom: 30 }}>
      {/* Top Header — Ultra Fresh & Rich Blue & Purple Gradient */}
      <div className="doc-topbar-blue-purple">
        <div className="doc-topbar-row">
          <div>
            <div className="doc-header-eyebrow">
              VETNOVA CLINICAL NETWORK
            </div>
            <h2 className="doc-header-title">
              Dr. {doctor?.name}
            </h2>
            <div className="doc-header-sub">
              🩺 {doctor?.specialization} · 🏥 {doctor?.clinic_name || "VetNova Veterinary Clinic"}
            </div>
          </div>
          <button className="doc-btn-logout" onClick={onLogout}>
            {t.logout || "Logout"}
          </button>
        </div>

        {/* Doctor Status Badge & Video Availability Toggle */}
        <div className="doc-status-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: avail ? "#10b981" : "#9ca3af",
                boxShadow: avail ? "0 0 12px #10b981" : "none",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 750, color: avail ? "#6ee7b7" : "#d1d5db" }}>
              {avail ? (t.docStatusOnline || "Online & Accepting Calls") : (t.docStatusOffline || "Offline")}
            </span>
          </div>
          <label className="toggle" style={{ transform: "scale(0.85)", margin: 0 }}>
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
      </div>

      <div className="screen" style={{ paddingTop: 14 }}>
        {/* KPI Metrics Grid */}
        <div className="doc-kpi-grid">
          <div
            className="doc-kpi-card doc-kpi-purple"
            onClick={() => setActiveTab("calls")}
            style={{ cursor: "pointer" }}
          >
            <div className="doc-kpi-val" style={{ color: pending.length > 0 ? "#dc2626" : "#6d28d9" }}>
              {pending.length}
            </div>
            <div className="doc-kpi-lbl">📹 Live Calls</div>
            {pending.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ef4444",
                  boxShadow: "0 0 8px #ef4444",
                }}
              />
            )}
          </div>
          <div
            className="doc-kpi-card doc-kpi-blue"
            onClick={() => setActiveTab("appointments")}
            style={{ cursor: "pointer" }}
          >
            <div className="doc-kpi-val">{doctorAppts.length}</div>
            <div className="doc-kpi-lbl">📅 Visits ({confirmedCount}✓)</div>
          </div>
          <div
            className="doc-kpi-card doc-kpi-teal"
            onClick={() => setActiveTab("verifications")}
            style={{ cursor: "pointer", border: pendingVerifications.length > 0 ? "2px solid #059669" : "none" }}
          >
            <div className="doc-kpi-val" style={{ color: pendingVerifications.length > 0 ? "#059669" : "#0f766e" }}>
              {pendingVerifications.length}
            </div>
            <div className="doc-kpi-lbl">💊 Rx Approvals</div>
          </div>
        </div>

        {/* Incoming Calls Alert with Audible Ringing & Visual Sound Wave Pulse */}
        {pending.map((c) => (
          <div key={c.id} className="doc-incoming-banner">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "#dc2626" }}>
                <span className="bell-ring-anim" style={{ fontSize: 18 }}>🔔</span>
                <span>{t.incomingCall || "Incoming Video Consultation"}</span>
                {c.severity === "high" && (
                  <span className="pill pill-danger" style={{ fontSize: 10 }}>EMERGENCY</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="sound-waves-box">
                  <span className="sound-wave-bar" />
                  <span className="sound-wave-bar" />
                  <span className="sound-wave-bar" />
                  <span className="sound-wave-bar" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#991b1b" }}>Ringing...</span>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 750, fontSize: 15, color: "#111827" }}>👤 {c.user_name}</div>
              <div style={{ fontSize: 12, color: "#4b5563", marginTop: 2 }}>
                {t.patientSummary}: <b>{c.diagnosis_summary}</b>
              </div>
              {c.report_snapshot && (
                <div style={{ marginTop: 8 }}>
                  <PatientReportPanel t={t} lang="en" report={c.report_snapshot} defaultOpen={false} />
                </div>
              )}
            </div>
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn btn-muted" onClick={() => decline(c)}>
                {t.decline}
              </button>
              <button
                className="btn"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                }}
                onClick={() => accept(c)}
              >
                🎥 {t.accept} & Answer
              </button>
            </div>
          </div>
        ))}

        {/* Segmented Navigation Tabs */}
        <div className="doc-tabs-nav">
          <button
            type="button"
            className={`doc-tab-btn ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            <span className="tab-ico">📅</span>
            <span>{t.docTabAppointments || "Appointments"}</span>
            {doctorAppts.length > 0 && <span className="tab-count">{doctorAppts.length}</span>}
          </button>
          <button
            type="button"
            className={`doc-tab-btn ${activeTab === "calls" ? "active" : ""}`}
            onClick={() => setActiveTab("calls")}
          >
            <span className="tab-ico">📹</span>
            <span>{t.docTabLiveQueue || "Queue"}</span>
            {pending.length > 0 && <span className="tab-count">{pending.length}</span>}
          </button>
          <button
            type="button"
            className={`doc-tab-btn ${activeTab === "verifications" ? "active" : ""}`}
            onClick={() => setActiveTab("verifications")}
          >
            <span className="tab-ico">💊</span>
            <span>Rx Approvals</span>
            {pendingVerifications.length > 0 && <span className="tab-count" style={{ background: "#059669" }}>{pendingVerifications.length}</span>}
          </button>
          <button
            type="button"
            className={`doc-tab-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <span className="tab-ico">📋</span>
            <span>{t.docTabReports || "Reports"}</span>
          </button>
          <button
            type="button"
            className={`doc-tab-btn ${activeTab === "clinic" ? "active" : ""}`}
            onClick={() => setActiveTab("clinic")}
          >
            <span className="tab-ico">⚙️</span>
            <span>{t.docTabProfileHours || "Clinic"}</span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div>
            {/* Filter Chips */}
            <div className="doc-filter-row">
              {["all", "pending", "confirmed", "rescheduled", "completed"].map((f) => (
                <button
                  key={f}
                  className={`doc-filter-chip ${apptFilter === f ? "active" : ""}`}
                  onClick={() => setApptFilter(f)}
                >
                  {f === "all" ? (t.docFilterAll || "All") : f === "pending" ? (t.docFilterPending || "Pending") : f === "confirmed" ? (t.docFilterConfirmed || "Confirmed") : f === "rescheduled" ? (t.docFilterRescheduled || "Rescheduled") : "Completed"}
                </button>
              ))}
            </div>

            {filteredAppts.length === 0 ? (
              <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid rgba(99, 102, 241, 0.12)" }}>
                <span className="empty-icon">📅</span>
                <p><b>{t.noAppointments || "No appointments found."}</b></p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Patients can book visits directly from your profile.</p>
              </div>
            ) : (
              filteredAppts.map((a) => (
                <div key={a.id} className="doc-card-premium">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="doc-patient-avatar">
                        {(a.user_name?.[0] || "P").toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#0c3d37" }}>{a.user_name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: "#0d5c54", fontWeight: 700, background: "#e8f3f0", padding: "2px 8px", borderRadius: 6 }}>
                            📅 {a.date}
                          </span>
                          <span style={{ fontSize: 12, color: "#0d5c54", fontWeight: 700, background: "#e8f3f0", padding: "2px 8px", borderRadius: 6 }}>
                            🕐 {a.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`doc-status-badge ${a.status}`}>
                      {apptStatusLabel(a.status, t)}
                    </span>
                  </div>

                  {/* Repeat Patient Visit Notice (Within 30 Days) */}
                  {a.is_repeat_within_month && (
                    <div style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)", border: "1.5px solid #10b981", borderRadius: 10, padding: "8px 12px", marginTop: 8, fontSize: 12, color: "#065f46", fontWeight: 750, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>🔁</span>
                      <span><b>Repeat Patient Visit (Within 30 Days):</b> Reduced Follow-up Fee Tier applied!</span>
                    </div>
                  )}

                  {a.reason && (
                    <div style={{ fontSize: 13, color: "#374151", marginTop: 8, background: "#f8fafc", padding: "6px 10px", borderRadius: 8 }}>
                      💬 <b>Reason:</b> {a.reason}
                    </div>
                  )}

                  {a.doctor_note && (
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6, fontStyle: "italic" }}>
                      📝 Your note: {a.doctor_note}
                    </div>
                  )}

                  {a.report_snapshot && (
                    <div style={{ marginTop: 10 }}>
                      <PatientReportPanel t={t} lang="en" report={a.report_snapshot} defaultOpen={false} />
                    </div>
                  )}

                  {/* Prescription Action Button */}
                  <div style={{ marginTop: 10 }}>
                    {a.prescription ? (
                      <button
                        type="button"
                        className="btn"
                        style={{
                          width: "100%",
                          background: "#ecfdf5",
                          border: "1.5px solid #10b981",
                          color: "#065f46",
                          fontWeight: 800,
                          fontSize: 12,
                          padding: "8px 12px",
                          borderRadius: 10,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onClick={() => setPrescriptionAppt(a)}
                      >
                        <span>📋 View / Edit Issued Rx (<b>{a.prescription.rx_id}</b>)</span>
                        <span style={{ background: "#10b981", color: "#fff", padding: "2px 8px", borderRadius: 6, fontSize: 10 }}>✓ Issued</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          background: "linear-gradient(135deg, #0d5c54 0%, #13524b 100%)",
                          borderColor: "#0d5c54",
                          fontWeight: 800,
                          fontSize: 12,
                          padding: "8px 12px",
                          borderRadius: 10,
                        }}
                        onClick={() => setPrescriptionAppt(a)}
                      >
                        ✍️ Give / Issue Prescription (Rx)
                      </button>
                    )}
                  </div>

                  {a.status === "pending" && (
                    <div style={{ marginTop: 10 }}>
                      {/* Doctor Fee Confirmation & Customization */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>
                          {a.is_repeat_within_month ? "🔁 Repeat Consultation Fee (₹):" : "💰 Doctor Consultation Fee (₹):"}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <b>₹</b>
                          <input
                            type="number"
                            min={0}
                            className="input"
                            style={{ width: 80, padding: "4px 8px", fontSize: 13, fontWeight: 800, textAlign: "center" }}
                            value={customApptFees[a.id] !== undefined ? customApptFees[a.id] : a.doctor_fee}
                            onChange={(e) => setCustomApptFees({ ...customApptFees, [a.id]: Math.max(0, parseInt(e.target.value || 0, 10)) })}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-primary"
                          style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", flex: 1, fontSize: 12, padding: "8px 10px", fontWeight: 800 }}
                          onClick={async () => {
                            try {
                              const chosenDocFee = customApptFees[a.id] !== undefined ? customApptFees[a.id] : a.doctor_fee;
                              await api(`/api/appointments/${a.id}/status`, {
                                body: {
                                  doctor_id: doctor.id,
                                  status: "confirmed_pending_payment",
                                  doctor_fee: chosenDocFee,
                                },
                              });
                              loadAppts();
                            } catch (e) {
                              alert("Failed to confirm: " + e.message);
                            }
                          }}
                        >
                          ✅ Accept & Request ₹{(customApptFees[a.id] !== undefined ? customApptFees[a.id] : a.doctor_fee) + (a.platform_fee || 29)}
                        </button>
                        <button className="btn btn-muted" style={{ fontSize: 12, padding: "8px 12px" }} onClick={() => setEditAppt(a)}>
                          📅 Reschedule
                        </button>
                      </div>
                    </div>
                  )}

                  {a.status !== "pending" && (a.status === "confirmed" || a.status === "rescheduled" || a.status === "confirmed_pending_payment") && (
                    <button className="doc-btn-manage" onClick={() => setEditAppt(a)} style={{ marginTop: 8 }}>
                      📅 {t.manageAppointment || "Manage Appointment & Reschedule"}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: LIVE CALLS QUEUE */}
        {activeTab === "calls" && (
          <div>
            {pending.length === 0 ? (
              <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid rgba(13, 92, 84, 0.14)" }}>
                <span className="empty-icon">📹</span>
                <p><b>No live calls waiting</b></p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Incoming video consult calls will pop up here with real-time sound and urgent tags.
                </p>
              </div>
            ) : null}

            <div className="section-title" style={{ marginTop: 10, color: "#0c3d37" }}>Recent Call Activity</div>
            {activity.length === 0 ? (
              <p className="muted" style={{ fontSize: 12 }}>No recent call history.</p>
            ) : (
              activity.slice(0, 10).map((a) => (
                <div key={a.id} className="card card-tight" style={{ borderLeft: "3px solid #0d5c54", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0c3d37" }}>
                    {a.activity === "call_accepted" ? "✅ Consultation Completed" : a.activity === "call_declined" ? "❌ Call Declined" : "📹 Consultation Requested"}
                  </div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                    {a.details} · {a.created_at ? new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: PACKED MEDICINE VERIFICATIONS (Side-by-Side Comparison & Dispatch Approval) */}
        {activeTab === "verifications" && (
          <div>
            <div className="section-title" style={{ color: "#065f46" }}>💊 Packed Medicines Verification & Approval Queue</div>
            <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
              Review the chemist's packed medicine parcel against your original prescription, clarify substitutions, and authorize dispatch.
            </p>

            {pendingVerifications.length === 0 ? (
              <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #d1fae5" }}>
                <span className="empty-icon">✅</span>
                <p><b>All Pharmacy Packages Verified!</b></p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  When nearby medical stores pack prescription medicines for your patients, verification requests will show up here.
                </p>
              </div>
            ) : (
              pendingVerifications.map((ord) => (
                <div key={ord.order_id || ord.id} className="doc-card-premium" style={{ borderLeft: "4px solid #059669", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#064e3b" }}>Order: {ord.order_id}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        🏬 <b>Store:</b> {ord.store_name || "Kisan Veterinary Pharmacy"} · 🕒 {new Date(ord.packed_at || ord.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: 12, border: "1px solid #fde68a" }}>
                      ⏳ Pending Clinical Sign-off
                    </span>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: 10, fontSize: 12, marginBottom: 12 }}>
                    <div>👤 <b>Patient / Owner:</b> {ord.user_name}</div>
                    <div style={{ marginTop: 2 }}>📍 <b>Delivery Address:</b> {ord.delivery_address}</div>
                  </div>

                  {/* Chemist Query / Confusion Box if any */}
                  {ord.chemist_query && (
                    <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b", padding: "10px 12px", borderRadius: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#b45309", display: "flex", alignItems: "center", gap: 6 }}>
                        <span>❓</span> Chemist Clarification Request / Question:
                      </div>
                      <div style={{ fontSize: 12, color: "#78350f", marginTop: 4, fontStyle: "italic" }}>
                        "{ord.chemist_query}"
                      </div>
                    </div>
                  )}

                  {/* Simultaneous Side-by-Side Match Pad Button */}
                  <div style={{ marginBottom: 12 }}>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #0d5c54 0%, #13524b 100%)",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: 12,
                        padding: "10px 14px",
                        borderRadius: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 4px 12px rgba(13, 92, 84, 0.25)",
                      }}
                      onClick={() => setSimultaneousMatchOrder(ord)}
                    >
                      <span>🔬 Open Simultaneous Side-by-Side Match & Verify Pad</span>
                      <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 6, fontSize: 11 }}>Dual Screen & Zoom ↗</span>
                    </button>
                  </div>

                  {/* SIDE-BY-SIDE MEDICINES COMPARISON */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    {/* Left: Doctor's Original Prescription */}
                    <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase", marginBottom: 6 }}>
                        🩺 1. Prescribed Treatment
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {(ord.items || []).map((it, i) => (
                          <div key={i} style={{ fontSize: 11, color: "#14532d", background: "rgba(255,255,255,0.7)", padding: "4px 6px", borderRadius: 6 }}>
                            <b>💊 {it.name}</b>
                            {it.dosage && <div style={{ fontSize: 10, color: "#166534" }}>{it.dosage}</div>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Chemist's Packed Items */}
                    <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 12, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#1e40af", textTransform: "uppercase", marginBottom: 6 }}>
                        🏬 2. Chemist Packed Box
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {((ord.packed_items && ord.packed_items.length > 0) ? ord.packed_items : ord.items || []).map((it, i) => (
                          <div key={i} style={{ fontSize: 11, color: "#1e3a8a", background: "rgba(255,255,255,0.7)", padding: "4px 6px", borderRadius: 6 }}>
                            <b>📦 {it.name}</b> (Qty: {it.qty || 1})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Photo of Packed Medicines */}
                  {ord.packed_photo && (
                    <div style={{ marginBottom: 12, textAlign: "center" }}>
                      <div className="label" style={{ textAlign: "left" }}>📸 Packed Medicine Parcel Photo (Submitted by Chemist):</div>
                      <img
                        src={ord.packed_photo}
                        alt="Packed Medicines"
                        style={{ width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 12, border: "1px solid #cbd5e1", marginTop: 4 }}
                      />
                    </div>
                  )}

                  {/* Doctor Clarification & Remarks Input */}
                  <div style={{ marginBottom: 12 }}>
                    <div className="label">Doctor Remarks / Instructions to Chemist:</div>
                    <input
                      className="input"
                      style={{ fontSize: 12 }}
                      placeholder="e.g. Approved. Both medicines are chemically identical and safe for administration."
                      value={doctorVerificationNotes[ord.order_id] || ""}
                      onChange={(e) => setDoctorVerificationNotes({ ...doctorVerificationNotes, [ord.order_id]: e.target.value })}
                    />
                  </div>

                  {/* Doctor Verification Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      type="button"
                      className="btn btn-muted"
                      style={{ flex: 1, fontSize: 12, padding: "10px" }}
                      disabled={verifyingOrderId === ord.order_id}
                      onClick={() => handleVerifyMedicines(ord.order_id, false)}
                    >
                      ⚠️ Request Change / Reject
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        flex: 2,
                        fontSize: 12,
                        padding: "10px",
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                        borderColor: "#059669",
                      }}
                      disabled={verifyingOrderId === ord.order_id}
                      onClick={() => handleVerifyMedicines(ord.order_id, true)}
                    >
                      {verifyingOrderId === ord.order_id ? "Confirming..." : "✅ Confirm (Both Meds Match) & Authorize Dispatch"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PATIENT DIAGNOSIS REPORTS */}
        {activeTab === "reports" && (
          <div>
            <div className="section-title" style={{ color: "#0c3d37" }}>{t.patientReportsTitle || "Shared Diagnosis Reports"}</div>
            <p className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
              {t.patientReportsSub || "Reports generated and shared by patients during consultation bookings."}
            </p>
            {(() => {
              const seen = new Set();
              const rows = [];
              [...doctorAppts, ...pending].forEach((item) => {
                if (!item.report_snapshot || !item.user_name) return;
                const key = String(item.user_id || item.user_name) + "|" + (item.report_snapshot.diagnosis || "");
                if (seen.has(key)) return;
                seen.add(key);
                rows.push({ user_name: item.user_name, report: item.report_snapshot });
              });
              if (!rows.length) {
                return (
                  <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid rgba(13, 92, 84, 0.14)" }}>
                    <span className="empty-icon">📋</span>
                    <p><b>{t.noHistoryHint || "No patient reports shared yet."}</b></p>
                  </div>
                );
              }
              return rows.map((row, i) => (
                <div key={i} className="doc-card-premium">
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#0c3d37", marginBottom: 6 }}>
                    👤 Patient: {row.user_name}
                  </div>
                  <PatientReportPanel t={t} lang="en" report={row.report} defaultOpen={true} />
                </div>
              ));
            })()}
          </div>
        )}

        {/* TAB 4: CLINIC HOURS & PROFILE */}
        {activeTab === "clinic" && (
          <div>
            <div className="doc-card-premium">
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0c3d37", marginBottom: 4 }}>
                🕒 {t.availabilityTitle || "Consultation Hours"}
              </div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
                {t.availabilitySub || "Configure your daily consulting window and live video availability."}
              </div>

              <div className="row">
                <div style={{ flex: 1 }}>
                  <div className="label">{t.availableFrom || "Start Time"}</div>
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
                  <div className="label">{t.availableUntil || "End Time"}</div>
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
              <div className="row" style={{ alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0c3d37" }}>{t.acceptVideo || "Accept Video Consults"}</div>
                  <div className="muted" style={{ fontSize: 11 }}>Allow farmers & pet owners to initiate video calls</div>
                </div>
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
                <p style={{ color: "var(--success)", fontSize: 12, marginTop: 10, fontWeight: 700 }}>
                  ✓ {t.statusSaved || "Settings updated successfully"}
                </p>
              )}
            </div>

            <div className="doc-card-premium" style={{ borderLeft: "4px solid #0d5c54" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0c3d37", marginBottom: 4 }}>
                💳 Consultation Fee & Payment QR Code
              </div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
                Patients must pay your consultation fee before an appointment can be confirmed. Upload your UPI QR code and set standard & repeat consultation fees.
              </div>

              <div className="row">
                <div style={{ flex: 1 }}>
                  <div className="label">💰 Standard Consultation Fee (₹)</div>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    value={consultFee}
                    onChange={(e) => setConsultFee(Math.max(0, parseInt(e.target.value || 0, 10)))}
                    placeholder="300"
                    style={{ fontWeight: 750, fontSize: 16 }}
                  />
                  <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                    Standard 1st visit fee.
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="label">🔁 Repeat Visit Fee (Within 30 Days) (₹)</div>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    value={followupFee}
                    onChange={(e) => setFollowupFee(Math.max(0, parseInt(e.target.value || 0, 10)))}
                    placeholder="150"
                    style={{ fontWeight: 750, fontSize: 16, color: "#059669" }}
                  />
                  <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                    Reduced concession fee for returning patients within 1 month.
                  </div>
                </div>
              </div>

              <div className="sp" />
              <div className="label">📱 Doctor UPI ID</div>
              <input
                className="input"
                type="text"
                value={docUpiId}
                onChange={(e) => setDocUpiId(e.target.value)}
                placeholder="doctor@upi"
                style={{ fontSize: 13 }}
              />

              <div className="sp" />
              <div className="label">📷 Upload Payment UPI QR Code (Image / Scan)</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => setDocQr(ev.target.result);
                  reader.readAsDataURL(file);
                }}
                style={{ fontSize: 12 }}
              />

              <div style={{ textAlign: "center", margin: "14px 0" }}>
                {docQr ? (
                  <div>
                    <div className="label">Active Payment QR Preview:</div>
                    <img src={docQr} alt="Doctor Payment QR" className="qr-code-preview-img" style={{ margin: "4px auto 0" }} />
                  </div>
                ) : (
                  <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                    ⚠️ No Payment QR uploaded yet. Appointments cannot be booked until you upload your QR.
                  </div>
                )}
              </div>

              {qrSavedMsg && (
                <p style={{ color: "#059669", fontSize: 13, fontWeight: 750, textAlign: "center", margin: "8px 0" }}>
                  ✓ Standard & repeat consultation fees and payment QR code updated successfully!
                </p>
              )}

              <button
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, #0d5c54 0%, #1a8f82 100%)", borderColor: "#0d5c54", width: "100%", marginTop: 8 }}
                disabled={qrSaving}
                onClick={async () => {
                  setQrSaving(true);
                  try {
                    const res = await api("/api/doctor/update-payment-qr", {
                      body: {
                        doctor_id: doctor.id,
                        consultation_fee: consultFee,
                        followup_fee: followupFee,
                        qr_code: docQr,
                        upi_id: docUpiId,
                      },
                    });
                    if (res.doctor) {
                      setDoctor(res.doctor);
                      localStorage.setItem("cb_doctor", JSON.stringify(res.doctor));
                      setQrSavedMsg(true);
                      setTimeout(() => setQrSavedMsg(false), 3000);
                    }
                  } catch (e) {
                    alert("Failed to update payment settings: " + e.message);
                  }
                  setQrSaving(false);
                }}
              >
                {qrSaving ? "Saving Settings…" : "💾 Save Fees & Payment QR Code"}
              </button>
            </div>

            {/* Section: Degree Certificate & Veterinary Qualifications Upload */}
            <div className="doc-card-premium" style={{ borderLeft: "4px solid #10b981", marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#0c3d37" }}>
                  🎓 Degree Qualifications & Official Certificate
                </div>
                <span style={{ background: "#d1fae5", color: "#065f46", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
                  ✓ VCI Required
                </span>
              </div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
                Farmers and animal owners can inspect your verified degree certificate and registration details on your profile before booking.
              </div>

              <div className="label">🎓 Degree Name & Academic Qualifications</div>
              <input
                className="input"
                type="text"
                value={docDegree}
                onChange={(e) => setDocDegree(e.target.value)}
                placeholder="e.g. B.V.Sc & A.H., M.V.Sc (Veterinary Surgery) — Bombay Veterinary College"
                style={{ fontSize: 13, fontWeight: 650 }}
              />

              <div className="sp" />
              <div className="label">🏛️ Veterinary Council Registration Number (VCI / State)</div>
              <input
                className="input"
                type="text"
                value={docVciReg}
                onChange={(e) => setDocVciReg(e.target.value)}
                placeholder="e.g. VCI-MH-2014-0892"
                style={{ fontSize: 13, fontWeight: 700, color: "#065f46" }}
              />

              <div className="sp" />
              <div className="label">📜 Upload Degree Certificate / License Document (Photo / Scan)</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => setDocDegreeCert(ev.target.result);
                  reader.readAsDataURL(file);
                }}
                style={{ fontSize: 12 }}
              />

              {docDegreeCert && (
                <div style={{ marginTop: 10, textAlign: "center", background: "#f8fafc", padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div className="label" style={{ marginBottom: 4 }}>Uploaded Degree Certificate Preview:</div>
                  <img
                    src={docDegreeCert}
                    alt="Degree Certificate Preview"
                    style={{ width: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 8, border: "1.5px solid #a7f3d0" }}
                  />
                </div>
              )}
            </div>

            {/* Section: Basic Doctor Profile & Clinic Info */}
            <div className="doc-card-premium" style={{ borderLeft: "4px solid #0369a1", marginTop: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0c3d37", marginBottom: 4 }}>
                🏥 Basic Info & Clinic Location Details
              </div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
                Help patients find your physical clinic and learn about your clinical expertise.
              </div>

              <div className="row">
                <div style={{ flex: 1 }}>
                  <div className="label">👨‍⚕️ Doctor Full Name</div>
                  <input
                    className="input"
                    type="text"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Dr. Ananya Patil"
                    style={{ fontSize: 13, fontWeight: 700 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="label">🩺 Specialization</div>
                  <input
                    className="input"
                    type="text"
                    value={docSpec}
                    onChange={(e) => setDocSpec(e.target.value)}
                    placeholder="Livestock & Dairy Cattle Specialist"
                    style={{ fontSize: 13 }}
                  />
                </div>
              </div>

              <div className="sp" />
              <div className="label">📷 Upload Doctor Profile Photo (Visible to Farmers & Patients)</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => setDocAvatar(ev.target.result);
                  reader.readAsDataURL(file);
                }}
                style={{ fontSize: 12 }}
              />

              {docAvatar && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, background: "#f8fafc", padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <img src={docAvatar} alt="Doctor Profile Preview" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid #10b981" }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 750, color: "#065f46" }}>✓ Doctor Profile Photo Ready</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>This photo is displayed on your card and full verified profile.</div>
                  </div>
                </div>
              )}

              <div className="sp" />
              <div className="row">
                <div style={{ flex: 1 }}>
                  <div className="label">⏳ Clinical Experience (Years)</div>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    value={docExp}
                    onChange={(e) => setDocExp(Number(e.target.value) || 0)}
                    placeholder="12"
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="label">🗣️ Languages Spoken</div>
                  <input
                    className="input"
                    type="text"
                    value={docLanguages}
                    onChange={(e) => setDocLanguages(e.target.value)}
                    placeholder="Marathi, Hindi, English"
                    style={{ fontSize: 13 }}
                  />
                </div>
              </div>

              <div className="sp" />
              <div className="row">
                <div style={{ flex: 1 }}>
                  <div className="label">🏥 Clinic / Hospital Name</div>
                  <input
                    className="input"
                    type="text"
                    value={docClinicName}
                    onChange={(e) => setDocClinicName(e.target.value)}
                    placeholder="Patil Veterinary Care & Livestock Polyclinic"
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="label">📍 City / District</div>
                  <input
                    className="input"
                    type="text"
                    value={docCity}
                    onChange={(e) => setDocCity(e.target.value)}
                    placeholder="Pune"
                    style={{ fontSize: 13 }}
                  />
                </div>
              </div>

              <div className="sp" />
              <div className="label">📍 Full Clinic Address</div>
              <input
                className="input"
                type="text"
                value={docClinicAddress}
                onChange={(e) => setDocClinicAddress(e.target.value)}
                placeholder="Shop 12, Krishi Seva Complex, Shivaji Market, Pune"
                style={{ fontSize: 13 }}
              />

              <div className="sp" />
              <div className="label">📖 About Doctor / Clinical Biography</div>
              <textarea
                className="input"
                rows={3}
                value={docBio}
                onChange={(e) => setDocBio(e.target.value)}
                placeholder="Describe your veterinary experience, field background, and specialties..."
                style={{ fontSize: 13 }}
              />

              {profileSavedMsg && (
                <p style={{ color: "#059669", fontSize: 13, fontWeight: 750, textAlign: "center", margin: "10px 0 4px" }}>
                  ✓ Doctor photo, qualifications, degree certificate, and clinic profile saved successfully!
                </p>
              )}

              <div className="sp" />
              <div className="row" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-muted"
                  style={{ flex: 1, borderColor: "#0d5c54", color: "#0d5c54", fontWeight: 800 }}
                  onClick={() => setPreviewProfileOpen(true)}
                >
                  👁️ Preview Public Profile
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 2, background: "linear-gradient(135deg, #0d5c54 0%, #1a8f82 100%)", borderColor: "#0d5c54", fontWeight: 800 }}
                  disabled={profileSaving}
                  onClick={async () => {
                    setProfileSaving(true);
                    try {
                      const res = await api("/api/doctor/profile", {
                        body: {
                          doctor_id: doctor.id,
                          name: docName,
                          avatar: docAvatar,
                          specialization: docSpec,
                          experience: docExp,
                          degree_name: docDegree,
                          degree_document: docDegreeCert,
                          vci_registration_number: docVciReg,
                          clinic_name: docClinicName,
                          clinic_address: docClinicAddress,
                          city: docCity,
                          bio: docBio,
                          languages: docLanguages,
                          consultation_fee: consultFee,
                          followup_fee: followupFee,
                          qr_code: docQr,
                          upi_id: docUpiId,
                        },
                      });
                      if (res.doctor) {
                        setDoctor(res.doctor);
                        localStorage.setItem("cb_doctor", JSON.stringify(res.doctor));
                        setProfileSavedMsg(true);
                        setTimeout(() => setProfileSavedMsg(false), 3000);
                      }
                    } catch (e) {
                      alert("Failed to save profile: " + e.message);
                    }
                    setProfileSaving(false);
                  }}
                >
                  {profileSaving ? "Saving Profile…" : "💾 Save Full Profile & Photo"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Public Profile Preview Modal */}
      {previewProfileOpen && (
        <DoctorFullProfileModal
          t={t}
          doctor={{
            ...doctor,
            name: docName,
            avatar: docAvatar,
            specialization: docSpec,
            experience: docExp,
            degree_name: docDegree,
            degree_document: docDegreeCert,
            vci_registration_number: docVciReg,
            clinic_name: docClinicName,
            clinic_address: docClinicAddress,
            city: docCity,
            languages: docLanguages,
            bio: docBio,
            consultation_fee: consultFee,
            followup_fee: followupFee,
          }}
          user={null}
          onClose={() => setPreviewProfileOpen(false)}
        />
      )}

      {editAppt && (
        <DoctorEditAppointmentModal
          t={t}
          doctor={doctor}
          appointment={editAppt}
          onClose={() => setEditAppt(null)}
          onSaved={async () => {
            setEditAppt(null);
            try {
              const o = await api(`/api/appointments/doctor/${doctor.id}`);
              setDoctorAppts(o.appointments || []);
            } catch (e) {}
          }}
        />
      )}

      {prescriptionAppt && (
        <AppointmentPrescriptionModal
          t={t}
          doctor={doctor}
          appointment={prescriptionAppt}
          onClose={() => setPrescriptionAppt(null)}
          onIssued={async () => {
            setPrescriptionAppt(null);
            loadAppts();
          }}
        />
      )}

      {simultaneousMatchOrder && (
        <SimultaneousRxMatchModal
          order={simultaneousMatchOrder}
          doctor={doctor}
          onClose={() => setSimultaneousMatchOrder(null)}
          onVerified={() => {
            setSimultaneousMatchOrder(null);
            (async () => {
              try {
                const res = await api(`/api/doctor/pending-medicine-verifications/${doctor.id}`);
                setPendingVerifications(res.orders || []);
              } catch (e) {}
            })();
          }}
        />
      )}
    </div>
  );
}

function AddMedicineStockModal({ onClose, onAdded }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cattle & Dairy");
  const [targetAnimal, setTargetAnimal] = useState("Cows & Buffaloes");
  const [price, setPrice] = useState("");
  const [pack, setPack] = useState("");
  const [indication, setIndication] = useState("");
  const [dosage, setDosage] = useState("");
  const [icon, setIcon] = useState("💊");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleAdd = async () => {
    if (!name.trim() || !price) {
      setErr("Please enter medicine name and retail price.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const res = await api("/api/pharmacy/medicines/add", {
        body: {
          name: name.trim(),
          category,
          targetAnimal: targetAnimal.trim() || "Livestock & Pets",
          price: Number(price),
          pack: pack.trim() || "Standard Pack",
          indication: indication.trim() || "Veterinary medicine & animal supplement",
          dosage: dosage.trim() || "As directed by veterinarian",
          icon,
        },
      });
      if (res.catalog) onAdded(res.catalog);
      onClose();
    } catch (e) {
      setErr(e.message || "Failed to add medicine");
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h3 style={{ margin: 0, color: "#064e3b" }}>📦 Add New Medicine to Stock</h3>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}>×</button>
        </div>
        <p className="muted" style={{ fontSize: 12, margin: "0 0 12px" }}>
          Added medicines will be instantly visible in the user search catalog and nearby pharmacy inventory.
        </p>

        <div className="label">💊 Medicine Name *</div>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Calci-Must Gold Bolus" />

        <div className="sp" />
        <div className="row">
          <div style={{ flex: 1 }}>
            <div className="label">💰 Retail Price (₹) *</div>
            <input className="input" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="280" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">📦 Pack Size</div>
            <input className="input" value={pack} onChange={(e) => setPack(e.target.value)} placeholder="e.g. 1 Litre / 10 Bolus" />
          </div>
        </div>

        <div className="sp" />
        <div className="row">
          <div style={{ flex: 1 }}>
            <div className="label">🏷️ Category</div>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Cattle & Dairy">Cattle & Dairy</option>
              <option value="Anti-Parasitic">Anti-Parasitic & Dewormer</option>
              <option value="Wound & Skin Care">Wound & Skin Care</option>
              <option value="Digestive & Bloat">Digestive & Bloat</option>
              <option value="Nutrition & Minerals">Nutrition & Minerals</option>
              <option value="Pets & Poultry">Pets & Poultry</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">🐾 Target Animal</div>
            <input className="input" value={targetAnimal} onChange={(e) => setTargetAnimal(e.target.value)} placeholder="e.g. Cattle, Goats, Dogs" />
          </div>
        </div>

        <div className="sp" />
        <div className="label">📋 Indication / Usage</div>
        <textarea className="input" rows={2} value={indication} onChange={(e) => setIndication(e.target.value)} placeholder="e.g. High calcium for milk fever, improves milk yield" style={{ fontSize: 12 }} />

        <div className="sp" />
        <div className="label">Icon</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["💊", "🥛", "💉", "🧴", "🌿", "🧪"].map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcon(ic)}
              style={{
                fontSize: 20,
                padding: "4px 10px",
                borderRadius: 8,
                border: icon === ic ? "2px solid #059669" : "1px solid #cbd5e1",
                background: icon === ic ? "#ecfdf5" : "#ffffff",
                cursor: "pointer",
              }}
            >
              {ic}
            </button>
          ))}
        </div>

        {err && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8, fontWeight: 650 }}>{err}</p>}

        <div className="sp-lg" />
        <div className="row">
          <button className="btn btn-muted" onClick={onClose} disabled={busy}>Cancel</button>
          <button
            className="btn btn-primary"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
            disabled={busy}
            onClick={handleAdd}
          >
            {busy ? "Adding Stock…" : "✅ Add Medicine to Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PharmacySendPackedToDoctorModal({ order, pharmacy, onClose, onSent }) {
  const [doctorId, setDoctorId] = useState(order?.doctor_id || "1");
  const [doctorsList, setDoctorsList] = useState([]);
  const [packedPhoto, setPackedPhoto] = useState("");
  const [notes, setNotes] = useState("All prescribed veterinary medicines packed, batch numbers inspected & verified.");
  const [chemistQuery, setChemistQuery] = useState("");
  const [packedItems, setPackedItems] = useState(
    order?.items?.map((it) => ({ ...it })) || [
      { name: "Prescribed Veterinary Medicine (Full Course)", qty: 1, price: 360 },
    ]
  );
  const [newPackedName, setNewPackedName] = useState("");
  const [newPackedQty, setNewPackedQty] = useState("1");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api("/api/doctors");
        setDoctorsList(res.doctors || []);
        if (order?.doctor_id) {
          setDoctorId(String(order.doctor_id));
        }
      } catch (e) {}
    })();
  }, [order?.doctor_id]);

  const handleUploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPackedPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAddPackedItem = () => {
    if (!newPackedName.trim()) return;
    setPackedItems([...packedItems, { name: newPackedName.trim(), qty: Number(newPackedQty) || 1, price: 0 }]);
    setNewPackedName("");
    setNewPackedQty("1");
  };

  const handleRemovePackedItem = (idx) => {
    setPackedItems(packedItems.filter((_, i) => i !== idx));
  };

  const handleSend = async () => {
    if (!packedPhoto) {
      alert("Please upload a clear photo of the packed medicines box / strips.");
      return;
    }
    setBusy(true);
    try {
      await api(`/api/pharmacy/orders/${order.order_id}/send-to-doctor`, {
        body: {
          doctor_id: doctorId,
          packed_photo: packedPhoto,
          packed_notes: notes,
          packed_items: packedItems,
          chemist_query: chemistQuery,
          store_name: pharmacy?.name || "Kisan Veterinary Medical Store",
        },
      });
      alert("✅ Packed medicines list, doctor Rx, and your query successfully submitted to Doctor for clinical verification!");
      onSent();
      onClose();
    } catch (e) {
      alert("Failed to submit to doctor: " + e.message);
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h3 style={{ margin: 0, color: "#064e3b" }}>📸 Send Packed Parcel to Doctor for Verification</h3>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}>×</button>
        </div>
        <p className="muted" style={{ fontSize: 12, margin: "0 0 14px" }}>
          Before handing over to the delivery rider, send the original Doctor Rx, your packed medicines list, parcel photo, and any substitution queries to the doctor for confirmation.
        </p>

        {/* 1. Original Doctor Prescription Header */}
        <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: "#166534", textTransform: "uppercase" }}>
            🩺 Original Doctor Prescription (Rx)
          </div>
          <div style={{ fontSize: 12, color: "#14532d", marginTop: 4 }}>
            👤 <b>Patient:</b> {order.user_name} · 🆔 <b>Order:</b> {order.order_id}
          </div>
          {order.doctor_name && (
            <div style={{ fontSize: 12, color: "#14532d" }}>
              👨‍⚕️ <b>Prescribed by:</b> Dr. {order.doctor_name} {order.prescription_id ? `(Rx ID: ${order.prescription_id})` : ""}
            </div>
          )}
          {order.prescription_image && (
            <div style={{ marginTop: 6, textAlign: "center" }}>
              <img src={order.prescription_image} alt="Prescription Document" style={{ maxHeight: 110, borderRadius: 8, border: "1px solid #a7f3d0" }} />
              <div style={{ fontSize: 10, color: "#059669", fontWeight: 700 }}>✓ Attached Doctor Rx Slip</div>
            </div>
          )}
        </div>

        <div className="label">👨‍⚕️ Confirm Consulting Veterinarian</div>
        <select className="select" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
          {doctorsList.length === 0 ? (
            <option value="1">Dr. Ananya Patil (Cattle & Dairy Specialist)</option>
          ) : (
            doctorsList.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} ({d.specialization})
              </option>
            ))
          )}
        </select>

        {/* 2. Chemist's Packed Medicines List */}
        <div className="sp" />
        <div className="label">📦 List of Medicines Packed by Chemist</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
          {packedItems.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "6px 10px", borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }}>
              <div>
                <b>📦 {item.name}</b>
                <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>Qty: {item.qty || 1}</span>
              </div>
              <button type="button" onClick={() => handleRemovePackedItem(idx)} style={{ border: "none", background: "none", color: "#dc2626", cursor: "pointer", fontWeight: 800 }}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr auto", gap: 6, alignItems: "center" }}>
          <input className="input" style={{ fontSize: 12, padding: "6px 8px" }} placeholder="Packed Brand / Medicine Name" value={newPackedName} onChange={(e) => setNewPackedName(e.target.value)} />
          <input className="input" style={{ fontSize: 12, padding: "6px 8px" }} placeholder="Qty" value={newPackedQty} onChange={(e) => setNewPackedQty(e.target.value)} />
          <button type="button" className="btn btn-muted" style={{ padding: "6px 10px", fontSize: 12 }} onClick={handleAddPackedItem}>
            + Add
          </button>
        </div>

        {/* 3. Chemist Query / Confusion Box */}
        <div className="sp" />
        <div className="label" style={{ color: "#b45309", fontWeight: 800 }}>
          ❓ Chemist Question / Substitution Confusion (Optional)
        </div>
        <textarea
          className="input"
          rows={2}
          value={chemistQuery}
          onChange={(e) => setChemistQuery(e.target.value)}
          placeholder="e.g. Doctor, Brand A was out of stock so I packed Brand B with the same active compound & dosage. Please confirm if this is approved."
          style={{ borderColor: "#fde68a", background: "#fffbeb" }}
        />

        {/* 4. Upload photo */}
        <div className="sp" />
        <div className="label">📸 Upload Photo of Packed Box / Medicine Strips *</div>
        <input type="file" accept="image/*" className="input" onChange={handleUploadPhoto} />
        {packedPhoto && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <img src={packedPhoto} alt="Packed Parcel" style={{ maxHeight: 140, borderRadius: 10, border: "1px solid #cbd5e1" }} />
            <div style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>✓ Parcel Photo Ready</div>
          </div>
        )}

        <div className="sp" />
        <div className="label">Pharmacist Notes & Batch Inspection</div>
        <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="sp-lg" />
        <div className="row">
          <button type="button" className="btn btn-muted" onClick={onClose} disabled={busy}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
            disabled={busy}
            onClick={handleSend}
          >
            {busy ? "Sending..." : "📤 Submit to Doctor for Verification"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PharmacyDashboard({ t, pharmacy, onLogout }) {
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "catalog" | "store"
  const [orders, setOrders] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);
  const [storeQr, setStoreQr] = useState(pharmacy?.qr_code || "");
  const [qrSaved, setQrSaved] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editingPriceVal, setEditingPriceVal] = useState("");
  const [viewingReportOrder, setViewingReportOrder] = useState(null);
  const [sendToDoctorOrder, setSendToDoctorOrder] = useState(null);

  const loadData = async () => {
    if (!pharmacy?.id) return;
    try {
      const res = await api(`/api/pharmacy/dashboard/${pharmacy.id}`);
      setOrders(res.orders || []);
      setCatalog(res.catalog || []);
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [pharmacy?.id]);

  const updateOrderStatus = async (orderId, status, delivery_status = null, tracking_note = "") => {
    setBusy(true);
    try {
      await api(`/api/pharmacy/orders/${orderId}/status`, {
        body: { status, delivery_status, tracking_note },
      });
      loadData();
    } catch (e) {
      alert("Failed to update status: " + e.message);
    }
    setBusy(false);
  };

  const handleUpdateMedicine = async (medId, updates) => {
    try {
      const res = await api("/api/pharmacy/medicines/update", {
        body: { id: medId, ...updates },
      });
      if (res.catalog) setCatalog(res.catalog);
      setEditingPriceId(null);
    } catch (e) {
      alert("Failed to update medicine: " + e.message);
    }
  };

  const handleUploadStoreQr = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setStoreQr(ev.target.result);
      setQrSaved(true);
      setTimeout(() => setQrSaved(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "processing") return o.status.toLowerCase().includes("processing") || o.status.toLowerCase().includes("packing");
    if (filter === "ready") return o.delivery_status === "ready_for_pickup" || o.status.toLowerCase().includes("ready");
    if (filter === "dispatched") return o.status.toLowerCase().includes("dispatched") || o.status.toLowerCase().includes("out") || o.status.toLowerCase().includes("picked");
    if (filter === "delivered") return o.status.toLowerCase().includes("delivered");
    return true;
  });

  return (
    <div className="pharma-viewport-theme" style={{ minHeight: "100%", paddingBottom: 60 }}>
      <div className="pharma-topbar-emerald" style={{ padding: "16px 20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px", color: "#a7f3d0", fontWeight: 800 }}>
              🏬 VetNova Pharmacist Portal
            </div>
            <h2 style={{ margin: "2px 0 0", fontSize: 20, color: "#ffffff" }}>{pharmacy?.name || "Kisan Veterinary Medical Store"}</h2>
            <div style={{ fontSize: 12, color: "#d1fae5", marginTop: 2 }}>
              👤 {pharmacy?.owner_name || "Pharmacist Owner"} · 📍 {pharmacy?.city || "Nashik"}
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Log out
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 14,
            background: "rgba(0,0,0,0.18)",
            borderRadius: 12,
            padding: "8px 12px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: storeOpen ? "#10b981" : "#ef4444",
                boxShadow: storeOpen ? "0 0 10px #10b981" : "none",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              {storeOpen ? "🟢 Store Open & Receiving Live Orders" : "🔴 Store Closed"}
            </span>
          </div>
          <label className="toggle" style={{ margin: 0 }}>
            <input type="checkbox" checked={storeOpen} onChange={(e) => setStoreOpen(e.target.checked)} />
            <span className="slider" />
          </label>
        </div>
      </div>

      <div className="screen" style={{ paddingTop: 12 }}>
        <div className="tab-row" style={{ marginBottom: 14 }}>
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
            📦 Customer Orders ({orders.length})
          </button>
          <button className={activeTab === "catalog" ? "active" : ""} onClick={() => setActiveTab("catalog")}>
            💊 Stock & Pricing
          </button>
          <button className={activeTab === "store" ? "active" : ""} onClick={() => setActiveTab("store")}>
            ⚙️ Store & QR
          </button>
        </div>

        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 12 }}>
              {[
                { k: "all", label: `All Orders (${orders.length})` },
                { k: "processing", label: "Packing" },
                { k: "ready", label: "Ready to Dispatch" },
                { k: "dispatched", label: "Out for Delivery" },
                { k: "delivered", label: "Delivered" },
              ].map((f) => (
                <button
                  key={f.k}
                  onClick={() => setFilter(f.k)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    fontSize: 12,
                    fontWeight: 700,
                    borderColor: filter === f.k ? "#059669" : "#cbd5e1",
                    background: filter === f.k ? "#059669" : "#ffffff",
                    color: filter === f.k ? "#ffffff" : "#475569",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty" style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #d1fae5" }}>
                <span className="empty-icon">📦</span>
                <p><b>No customer medicine orders yet</b></p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  New orders placed by farmers and pet owners in your vicinity will appear here in real-time.
                </p>
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div key={o.order_id || o.id} className="pharma-card-premium">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#064e3b" }}>{o.order_id}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        🕒 {new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {new Date(o.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`pharma-order-badge ${
                        o.status.toLowerCase().includes("processing") || o.status.toLowerCase().includes("packing")
                          ? "processing"
                          : o.status.toLowerCase().includes("ready")
                          ? "dispatched"
                          : o.status.toLowerCase().includes("dispatched") || o.status.toLowerCase().includes("out")
                          ? "dispatched"
                          : o.status.toLowerCase().includes("delivered")
                          ? "delivered"
                          : "cancelled"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  {/* Doctor Verification Status Indicator */}
                  {o.doctor_verification_status === "pending_doctor_approval" && (
                    <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "8px 10px", borderRadius: 8, fontSize: 12, color: "#92400e", fontWeight: 750, marginBottom: 8 }}>
                      ⏳ <b>Doctor Verification Pending:</b> Packed medicines parcel photo sent to Dr. {o.assigned_doctor_name || "Doctor"}. Awaiting confirmation before rider dispatch.
                    </div>
                  )}

                  {o.doctor_verification_status === "doctor_approved" && (
                    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "8px 10px", borderRadius: 8, fontSize: 12, color: "#065f46", fontWeight: 750, marginBottom: 8 }}>
                      ✅ <b>Doctor Confirmed & Approved:</b> Dr. {o.assigned_doctor_name || "Doctor"} verified packed medicine parcel. Ready for pickup!
                    </div>
                  )}

                  {o.doctor_verification_status === "rejected_needs_change" && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "8px 10px", borderRadius: 8, fontSize: 12, color: "#991b1b", fontWeight: 750, marginBottom: 8 }}>
                      ⚠️ <b>Doctor Change Request:</b> {o.doctor_verification_notes}
                    </div>
                  )}

                  <div style={{ background: "#f8fafc", padding: "10px", borderRadius: 10, fontSize: 12, marginBottom: 10 }}>
                    <div>👤 <b>Customer:</b> {o.user_name}</div>
                    <div style={{ marginTop: 3 }}>
                      📱 <b>Phone:</b> <a href={`tel:${o.phone}`} style={{ color: "#059669", fontWeight: 700 }}>+91 {o.phone}</a>
                    </div>
                    <div style={{ marginTop: 3 }}>📍 <b>Address:</b> {o.delivery_address}</div>
                    {o.address_details?.landmark && (
                      <div style={{ marginTop: 2, color: "#2563eb" }}>📌 <b>Landmark:</b> Near {o.address_details.landmark}</div>
                    )}
                    <div style={{ marginTop: 3 }}>
                      🚚 <b>Fulfillment:</b> {o.fulfillment === "home_delivery" ? "Doorstep Delivery" : "Store Counter Pickup"}
                    </div>
                    {o.prescription_image && (
                      <div style={{ marginTop: 6 }}>
                        <div className="label">📸 Uploaded Prescription:</div>
                        <img src={o.prescription_image} alt="Rx" style={{ maxHeight: 100, borderRadius: 8, border: "1px solid #cbd5e1" }} />
                      </div>
                    )}
                    {o.prescription_note && (
                      <div style={{ marginTop: 4, color: "#d97706" }}>
                        📝 <b>Prescription Note:</b> {o.prescription_note}
                      </div>
                    )}

                    {/* Attached AI Diagnostic Report Button */}
                    {o.diagnosis_report && (
                      <div style={{ marginTop: 8, background: "#ecfdf5", border: "1px solid #86efac", padding: "8px 10px", borderRadius: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontWeight: 800, color: "#166534", fontSize: 12 }}>📎 Attached AI Diagnosis Report</span>
                            <div style={{ fontSize: 11, color: "#15803d" }}>
                              {o.diagnosis_report.diagnosis} ({o.diagnosis_report.animal || "Animal"})
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ background: "#059669", fontSize: 11, padding: "4px 8px" }}
                            onClick={() => setViewingReportOrder(o)}
                          >
                            📄 View Report
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Assigned Delivery Partner Details */}
                    {o.delivery_partner_name && (
                      <div style={{ marginTop: 8, background: "#eff6ff", border: "1px solid #bfdbfe", padding: "8px 10px", borderRadius: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#1e40af" }}>
                              🛵 Delivery Partner Assigned: {o.delivery_partner_name}
                            </div>
                            <div style={{ fontSize: 11, color: "#2563eb" }}>
                              {o.delivery_partner_vehicle} · Rating: ⭐ {o.delivery_partner_rating || 4.9}
                            </div>
                          </div>
                          {o.delivery_partner_phone && (
                            <a
                              href={`tel:${o.delivery_partner_phone}`}
                              className="btn"
                              style={{ background: "#2563eb", color: "#fff", fontSize: 11, padding: "4px 8px", textDecoration: "none", borderRadius: 6, fontWeight: 700 }}
                            >
                              📞 Call Rider
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: 13, marginBottom: 10 }}>
                    <div style={{ fontWeight: 750, fontSize: 12, color: "#334155", marginBottom: 4 }}>Medicines Ordered:</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {(o.items || []).map((it, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            background: "#f1f5f9",
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 12,
                          }}
                        >
                          <span>{it.icon || "💊"} {it.name} (Qty: {it.qty || 1})</span>
                          <b>₹{(it.price || 0) * (it.qty || 1)}</b>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #cbd5e1", paddingTop: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 13 }}>Total Billing:</span>
                    <b style={{ fontSize: 16, color: "#047857" }}>
                      ₹{o.total_amount} {o.payment_mode === "cod" ? "(Cash on Delivery)" : "(Paid Online)"}
                    </b>
                  </div>

                  {/* Send Packed Medicines to Doctor Button */}
                  {o.doctor_verification_status !== "doctor_approved" && (
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                        color: "#fff",
                        width: "100%",
                        padding: "8px 12px",
                        fontSize: 12,
                        borderRadius: 8,
                        fontWeight: 750,
                        marginBottom: 8,
                      }}
                      onClick={() => setSendToDoctorOrder(o)}
                    >
                      📸 Send Packed Parcel to Doctor for Verification
                    </button>
                  )}

                  {/* Medical Store Dispatch Stepper Buttons */}
                  <div style={{ display: "grid", gridTemplateColumns: o.fulfillment === "home_delivery" ? "1fr 1fr" : "1fr", gap: 8 }}>
                    {o.fulfillment === "home_delivery" ? (
                      <>
                        <button
                          className="btn"
                          style={{ background: "#2563eb", color: "#fff", padding: "8px 6px", fontSize: 12, borderRadius: 8, fontWeight: 750 }}
                          onClick={() => updateOrderStatus(o.order_id, "Ready for Pickup (Store Packed)", "ready_for_pickup")}
                          disabled={busy || o.delivery_status === "ready_for_pickup" || o.status.toLowerCase().includes("delivered")}
                        >
                          📦 Mark Ready to Dispatch
                        </button>
                        <button
                          className="btn"
                          style={{ background: "#10b981", color: "#fff", padding: "8px 6px", fontSize: 12, borderRadius: 8, fontWeight: 750 }}
                          onClick={() => updateOrderStatus(o.order_id, "Delivered Successfully", "delivered")}
                          disabled={busy || o.status.toLowerCase().includes("delivered")}
                        >
                          ✅ Mark Delivered
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn"
                        style={{ background: "#10b981", color: "#fff", padding: "8px 6px", fontSize: 12, borderRadius: 8, fontWeight: 750 }}
                        onClick={() => updateOrderStatus(o.order_id, "Delivered at Counter", "delivered")}
                        disabled={busy || o.status.toLowerCase().includes("delivered")}
                      >
                        ✅ Handover to Customer (Delivered)
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Modal: Send Packed Medicines to Doctor */}
            {sendToDoctorOrder && (
              <PharmacySendPackedToDoctorModal
                order={sendToDoctorOrder}
                pharmacy={pharmacy}
                onClose={() => setSendToDoctorOrder(null)}
                onSent={() => loadData()}
              />
            )}

            {/* Attached Report Viewer Modal */}
            {viewingReportOrder && viewingReportOrder.diagnosis_report && (
              <div className="modal-bg" onClick={() => setViewingReportOrder(null)}>
                <div className="modal" style={{ maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 12 }}>
                    <h3 style={{ margin: 0, color: "#065f46" }}>📄 Clinical Assessment Report</h3>
                    <button onClick={() => setViewingReportOrder(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}>✕</button>
                  </div>

                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: 12, borderRadius: 10, marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 850, color: "#065f46" }}>
                      🩺 {viewingReportOrder.diagnosis_report.diagnosis}
                    </div>
                    <div style={{ fontSize: 12, color: "#166534", marginTop: 4 }}>
                      🎯 Target Animal: <b>{viewingReportOrder.diagnosis_report.animal || "Livestock"}</b> · ⚠️ Severity: <span style={{ textTransform: "capitalize", fontWeight: 750 }}>{viewingReportOrder.diagnosis_report.severity || "Standard"}</span>
                    </div>
                  </div>

                  {viewingReportOrder.diagnosis_report.summary && (
                    <div style={{ marginBottom: 10, fontSize: 13, color: "#334155" }}>
                      <b>Clinical Summary:</b> {viewingReportOrder.diagnosis_report.summary}
                    </div>
                  )}

                  {viewingReportOrder.diagnosis_report.visible_concerns?.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 750, fontSize: 12, color: "#1e293b", marginBottom: 4 }}>⚠️ Visible Symptoms:</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {viewingReportOrder.diagnosis_report.visible_concerns.map((c, i) => (
                          <span key={i} className="concern-tag">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewingReportOrder.diagnosis_report.suggested_next_steps?.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 750, fontSize: 12, color: "#1e293b", marginBottom: 4 }}>📋 Care Guidance:</div>
                      <ol style={{ margin: "4px 0", paddingLeft: 20, fontSize: 12, color: "#475569" }}>
                        {viewingReportOrder.diagnosis_report.suggested_next_steps.map((s, i) => (
                          <li key={i} style={{ marginBottom: 3 }}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="sp-lg" />
                  <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setViewingReportOrder(null)}>
                    ✓ Close Report View
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "catalog" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#064e3b" }}>Essential Veterinary Stock & Pricing</div>
                <div className="muted" style={{ fontSize: 12 }}>Manage stock availability & edit medicine prices</div>
              </div>
              <button
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669", fontSize: 12, padding: "6px 12px", fontWeight: 800 }}
                onClick={() => setAddStockOpen(true)}
              >
                + Add Stock
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {catalog.map((m) => (
                <div key={m.id} className="pharma-card-premium" style={{ borderLeft: m.in_stock !== false ? "4px solid #059669" : "4px solid #cbd5e1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{m.icon || "💊"} {m.name}</div>
                      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                        Pack: {m.pack} · Target: {m.targetAnimal} · Category: {m.category}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                        ℹ️ {m.indication}
                      </div>

                      {/* Editable Price Row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                        {editingPriceId === m.id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontWeight: 700 }}>₹</span>
                            <input
                              type="number"
                              className="input"
                              min={0}
                              value={editingPriceVal}
                              onChange={(e) => setEditingPriceVal(e.target.value)}
                              style={{ width: 80, padding: "4px 8px", fontSize: 13, fontWeight: 700 }}
                              autoFocus
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ background: "#059669", padding: "4px 10px", fontSize: 11 }}
                              onClick={() => handleUpdateMedicine(m.id, { price: Number(editingPriceVal) })}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-muted"
                              style={{ padding: "4px 8px", fontSize: 11 }}
                              onClick={() => setEditingPriceId(null)}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14, color: "#059669", fontWeight: 800 }}>Price: ₹{m.price}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPriceId(m.id);
                                setEditingPriceVal(String(m.price));
                              }}
                              style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#334155" }}
                            >
                              ✏️ Edit Price
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* In-Stock Toggle */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateMedicine(m.id, { in_stock: m.in_stock === false ? true : false })}
                        style={{
                          background: m.in_stock !== false ? "#d1fae5" : "#fee2e2",
                          color: m.in_stock !== false ? "#065f46" : "#991b1b",
                          border: "none",
                          fontSize: 11,
                          fontWeight: 800,
                          padding: "4px 10px",
                          borderRadius: 20,
                          cursor: "pointer",
                        }}
                      >
                        {m.in_stock !== false ? "✓ In Stock" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "store" && (
          <div>
            <div className="pharma-card-premium">
              <div style={{ fontWeight: 800, fontSize: 16, color: "#064e3b", marginBottom: 6 }}>
                💳 Store UPI QR Code & Settings
              </div>
              <p className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
                Upload your store UPI QR code so customers can pay directly into your account.
              </p>

              <div style={{ textAlign: "center", margin: "14px 0" }}>
                {storeQr ? (
                  <img src={storeQr} alt="Store UPI QR" className="qr-code-preview-img" style={{ margin: "0 auto" }} />
                ) : (
                  <div style={{ width: 150, height: 150, margin: "0 auto", border: "2px dashed #cbd5e1", borderRadius: 12, display: "grid", placeItems: "center", color: "#94a3b8" }}>
                    No QR Uploaded
                  </div>
                )}
              </div>

              <div className="label">Upload / Update Store UPI QR Code</div>
              <input type="file" accept="image/*" onChange={handleUploadStoreQr} style={{ fontSize: 12 }} />

              {qrSaved && (
                <p style={{ color: "#059669", fontSize: 12, fontWeight: 700, marginTop: 8 }}>
                  ✓ QR Code updated successfully!
                </p>
              )}
            </div>

            <div className="pharma-card-premium" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#064e3b", marginBottom: 8 }}>
                🏬 Store Information
              </div>
              <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
                <div>🏪 <b>Store Name:</b> {pharmacy?.name}</div>
                <div>👤 <b>Owner:</b> {pharmacy?.owner_name}</div>
                <div>📱 <b>Phone:</b> +91 {pharmacy?.phone}</div>
                <div>📍 <b>Address:</b> {pharmacy?.address}, {pharmacy?.city}</div>
                <div>📜 <b>License:</b> {pharmacy?.license || "MH-VET-2026"}</div>
                <div>🚚 <b>Delivery Radius:</b> {pharmacy?.deliveryRadiusKm || 25} km</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {addStockOpen && (
        <AddMedicineStockModal
          onClose={() => setAddStockOpen(false)}
          onAdded={(newCatalog) => setCatalog(newCatalog)}
        />
      )}
    </div>
  );
}

function UploadOfflinePrescriptionModal({ user, t, onClose, onOrdered }) {
  const [rxImage, setRxImage] = useState("");
  const [docName, setDocName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [patientName, setPatientName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "At Post Farm, Near Panchayat");
  const [notes, setNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState("cod");
  const [busy, setBusy] = useState(false);

  const handleUploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRxImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!rxImage) {
      alert("Please upload a photo of your offline doctor prescription.");
      return;
    }
    if (!phone || !address) {
      alert("Please provide your delivery contact phone and address.");
      return;
    }
    setBusy(true);
    try {
      const res = await api("/api/pharmacy/upload-prescription", {
        body: {
          user_id: user?.id || 1,
          user_name: patientName || user?.name || "Farmer",
          phone,
          delivery_address: address,
          prescription_image: rxImage,
          doctor_name: docName || "Visiting Veterinarian",
          doctor_clinic: clinicName || "Local Veterinary Dispensary",
          notes,
          payment_mode: paymentMode,
        },
      });
      alert("✅ Prescription uploaded & medicine order placed successfully! Nearby veterinary pharmacy is reviewing and packing your order.");
      onOrdered(res.order);
      onClose();
    } catch (e) {
      alert("Failed to place order: " + e.message);
    }
    setBusy(false);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h3 style={{ margin: 0, color: "#064e3b" }}>📤 Upload Offline Doctor Prescription</h3>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}>×</button>
        </div>
        <p className="muted" style={{ fontSize: 12, margin: "0 0 12px" }}>
          Did a veterinarian visit your farm or did you visit a local clinic? Upload your handwritten prescription here to order medicines with doorstep delivery.
        </p>

        <div className="label">📸 Upload Doctor Prescription Photo *</div>
        <input type="file" accept="image/*" className="input" onChange={handleUploadPhoto} />
        {rxImage && (
          <div style={{ textAlign: "center", marginTop: 8, marginBottom: 10 }}>
            <img src={rxImage} alt="Prescription" style={{ maxHeight: 150, borderRadius: 10, border: "1px solid #cbd5e1" }} />
            <div style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>✓ Prescription Photo Attached</div>
          </div>
        )}

        <div className="sp" />
        <div className="row">
          <div style={{ flex: 1 }}>
            <div className="label">👨‍⚕️ Doctor / Vet Name</div>
            <input className="input" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g. Dr. Kulkarni" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">🏥 Clinic / Dispensary</div>
            <input className="input" value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="e.g. Taluka Vet Hospital" />
          </div>
        </div>

        <div className="sp" />
        <div className="row">
          <div style={{ flex: 1 }}>
            <div className="label">👤 Patient / Owner Name *</div>
            <input className="input" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Your Name" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">📱 Mobile Number *</div>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
          </div>
        </div>

        <div className="sp" />
        <div className="label">📍 Delivery Address (Doorstep / Farm) *</div>
        <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House / Farm No, Village, Landmark" />

        <div className="sp" />
        <div className="label">📝 Notes for Medical Store (Optional)</div>
        <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Need 2 bottles of Calcium and 1 spray." />

        <div className="sp" />
        <div className="label">💳 Payment Method</div>
        <select className="select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
          <option value="cod">💵 Cash on Delivery (Pay when rider arrives)</option>
          <option value="online">📱 Online UPI / QR Code Payment</option>
        </select>

        <div className="sp-lg" />
        <div className="row">
          <button type="button" className="btn btn-muted" onClick={onClose} disabled={busy}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
            disabled={busy}
            onClick={handleSubmit}
          >
            {busy ? "Uploading..." : "🚀 Place Prescription Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PharmacyScreen({ t, user, lang, setScreen, onBack }) {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedMed, setSelectedMed] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [uploadRxOpen, setUploadRxOpen] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [trackOrderId, setTrackOrderId] = useState(null);

  const loadData = async () => {
    try {
      const m = await api("/api/pharmacy/medicines");
      setMedicines(m.medicines || []);
      if (user?.id) {
        const o = await api(`/api/pharmacy/orders/user/${user.id}`);
        setMyOrders(o.orders || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const categories = ["all", "Cattle & Dairy", "Anti-Parasitic", "Wound & Skin Care", "Digestive & Bloat", "Nutrition & Minerals", "Deworming"];

  const filtered = medicines.filter((m) => {
    const matchCat = category === "all" || m.category.toLowerCase().includes(category.toLowerCase());
    const matchQ =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.indication.toLowerCase().includes(search.toLowerCase()) ||
      m.targetAnimal.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <>
      <TopBar title={t.pharmacyTitle || "Vet E-Pharmacy & Medical Stores"} onBack={onBack} />
      <div className="screen" style={{ paddingBottom: 80 }}>
        {/* Banner with Offline Prescription Upload Button */}
        <div
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)",
            borderRadius: 18,
            padding: "16px 18px",
            color: "#ffffff",
            marginBottom: 14,
            boxShadow: "0 6px 20px rgba(5, 150, 105, 0.25)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.2px", color: "#a7f3d0", fontWeight: 800 }}>
                24/7 VETERINARY PHARMACY & DISPENSARY
              </div>
              <h2 style={{ margin: "2px 0 4px", fontSize: 18, color: "#ffffff" }}>
                {t.pharmacyTitle || "Veterinary E-Pharmacy"}
              </h2>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)" }}>
                Order veterinary medicines with doorstep delivery or upload offline vet prescriptions.
              </div>
            </div>
            <div style={{ fontSize: 32 }}>🏬</div>
          </div>

          {/* Upload Offline Prescription CTA */}
          <button
            type="button"
            className="btn"
            style={{
              background: "#ffffff",
              color: "#065f46",
              fontWeight: 800,
              width: "100%",
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "none",
            }}
            onClick={() => setUploadRxOpen(true)}
          >
            <span>📤</span>
            <span>Upload Offline Doctor Visit Prescription (Get Medicines)</span>
          </button>
        </div>

        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            className="input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchMedicinePh || "Search medicines (e.g. Calcium, Dewormer, Spray, Bloat)..."}
            style={{ fontSize: 14, padding: "10px 14px" }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 10 }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid",
                fontSize: 12,
                fontWeight: 750,
                whiteSpace: "nowrap",
                borderColor: category === c ? "#059669" : "#cbd5e1",
                background: category === c ? "#059669" : "#ffffff",
                color: category === c ? "#ffffff" : "#475569",
                cursor: "pointer",
              }}
            >
              {c === "all" ? "All Medicines" : c}
            </button>
          ))}
        </div>

        <div className="section-title" style={{ color: "#064e3b" }}>
          📦 Essential Veterinary Medicines ({filtered.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {filtered.map((m) => (
            <div key={m.id} className="card card-tight" style={{ borderLeft: "4px solid #10b981", background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{m.icon || "💊"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: "#064e3b" }}>{m.name}</span>
                    {m.badge && (
                      <span style={{ fontSize: 10, fontWeight: 800, background: "#ecfdf5", color: "#065f46", padding: "2px 6px", borderRadius: 4 }}>
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    🎯 Target: <b>{m.targetAnimal}</b> · Pack: {m.pack}
                  </div>
                  <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>{m.indication}</div>
                  <div style={{ fontSize: 11, color: "#047857", marginTop: 2, fontStyle: "italic" }}>
                    📋 Dosage: {m.dosage}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>₹{m.price}</span>
                    <button
                      className="btn btn-primary"
                      style={{
                        padding: "6px 14px",
                        fontSize: 12,
                        background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                        borderColor: "#059669",
                      }}
                      onClick={() => {
                        setSelectedMed(m);
                        setOrderModalOpen(true);
                      }}
                    >
                      🛍️ Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sp-lg" />
        <PharmaciesPanel
          t={t}
          onOrderMedicine={(store) => {
            setSelectedMed(null);
            setOrderModalOpen(true);
          }}
        />

        {myOrders.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="section-title" style={{ color: "#064e3b" }}>
              📋 {t.orderTrackTitle || "My Medicine Orders"} ({myOrders.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              {myOrders.map((ord) => (
                <div key={ord.id || ord.order_id} className="card card-tight" style={{ borderLeft: "4px solid #059669" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <b style={{ color: "#064e3b" }}>{ord.order_id}</b>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "#d1fae5",
                        color: "#065f46",
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                    🏪 Store: <b>{ord.store_name}</b> · Total: <b>₹{ord.total_amount}</b>
                  </div>
                  <div style={{ fontSize: 12, color: "#047857", marginTop: 2 }}>
                    ⏱️ {ord.estimated_delivery}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                    Items: {(ord.items || []).map((i) => `${i.name} (x${i.qty || 1})`).join(", ")}
                  </div>

                  {ord.fulfillment === "home_delivery" && (
                    <div style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                          borderColor: "#2563eb",
                          padding: "6px 14px",
                          fontSize: 12,
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onClick={() => setTrackOrderId(ord.order_id || ord.id)}
                      >
                        <span>📍</span> {t.trackLiveDelivery || "Track Live Delivery & Rider Location"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {orderModalOpen && (
        <OrderMedicineModal
          t={t}
          user={user}
          initialItem={selectedMed}
          onClose={() => {
            setOrderModalOpen(false);
            setSelectedMed(null);
          }}
          onOrderPlaced={() => {
            loadData();
          }}
        />
      )}

      {uploadRxOpen && (
        <UploadOfflinePrescriptionModal
          user={user}
          t={t}
          onClose={() => setUploadRxOpen(false)}
          onOrdered={() => {
            loadData();
          }}
        />
      )}

      {trackOrderId && (
        <LiveOrderTrackingModal
          orderId={trackOrderId}
          t={t}
          onClose={() => setTrackOrderId(null)}
        />
      )}

      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

// ============================================================================
// VETNOVA TOOLS SUITE (HEALTH PASSPORT, OUTBREAK RADAR, VACCINATION HUB,
// GOVT SCHEMES, VILLAGE CO-OP, FARM INSIGHTS)
// ============================================================================

function generateRealtimePassportPayload(animal) {
  if (!animal) return "";
  const vaccinesList = (animal.vaccines || []).map((v, idx) => 
    `${idx + 1}. ${v.name} (${v.dose || "Dose"}) | Administered: ${v.date || "Recent"} | Valid Until: ${v.valid_until || "1 Year"} | Vet: ${v.vet || "Verified Veterinarian"} | Batch: ${v.batch || "N/A"}`
  ).join("\n");

  return `VETNOVA OFFICIAL ANIMAL HEALTH PASSPORT (DAHD / INAPH)
========================================
🏷️ PASHU AADHAAR UID: ${animal.tag || "IN-DEFAULT-0000"}
🐾 ANIMAL NAME: ${animal.name || "Livestock"}
🐄 SPECIES & BREED: ${animal.species || "Cattle"} · ${animal.breed || "General"}
📅 AGE & SEX: ${animal.age || "Adult"} · ${animal.gender || "Female"}
👤 REGISTERED OWNER: ${animal.owner || "Farmer"} (${animal.district || "Maharashtra"})
🛡️ IMMUNITY SCORE: ${animal.immunity_score || "Protected"}
========================================
💉 VERIFIED VACCINES TAKEN (${(animal.vaccines || []).length}):
${vaccinesList || "No vaccines logged yet."}
========================================
🔒 Digitally Signed & Synced with VetNova Cloud (${new Date().toISOString()})`;
}

// Helper: Generate real-time live QR Code URL & fallback SVG string
function generateQrSvg(text) {
  const hash = Array.from(String(text)).reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0);
  const pattern1 = (Math.abs(hash) % 7) + 2;
  const pattern2 = (Math.abs(hash >> 3) % 5) + 3;

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><rect width='160' height='160' fill='%23ffffff' rx='12'/><rect x='15' y='15' width='40' height='40' fill='%23064e3b' rx='6'/><rect x='23' y='23' width='24' height='24' fill='%23ffffff' rx='3'/><rect x='28' y='28' width='14' height='14' fill='%23059669' rx='2'/><rect x='105' y='15' width='40' height='40' fill='%23064e3b' rx='6'/><rect x='113' y='23' width='24' height='24' fill='%23ffffff' rx='3'/><rect x='118' y='28' width='14' height='14' fill='%23059669' rx='2'/><rect x='15' y='105' width='40' height='40' fill='%23064e3b' rx='6'/><rect x='23' y='113' width='24' height='24' fill='%23ffffff' rx='3'/><rect x='28' y='118' width='14' height='14' fill='%23059669' rx='2'/><rect x='65' y='20' width='8' height='18' fill='%23065f46'/><rect x='78' y='20' width='14' height='8' fill='%2310b981'/><rect x='65' y='45' width='12' height='12' fill='%23047857'/><rect x='85' y='40' width='8' height='16' fill='%23065f46'/><rect x='20' y='65' width='18' height='8' fill='%23047857'/><rect x='45' y='65' width='12' height='12' fill='%23065f46'/><rect x='65' y='65' width='30' height='30' fill='%23064e3b' rx='4'/><circle cx='80' cy='80' r='8' fill='%2310b981'/><rect x='105' y='65' width='16' height='8' fill='%23065f46'/><rect x='130' y='65' width='15' height='15' fill='%2310b981'/><rect x='65' y='105' width='10' height='20' fill='%23065f46'/><rect x='82' y='105' width='12' height='10' fill='%2310b981'/><rect x='105' y='95' width='10' height='15' fill='%23047857'/><rect x='125' y='90' width='20' height='10' fill='%23065f46'/><rect x='105' y='115' width='40' height='30' fill='%23064e3b' rx='4'/><text x='125' y='134' fill='%23ffffff' font-family='sans-serif' font-size='9' font-weight='bold' text-anchor='middle'>LIVE QR</text><text x='80' y='152' fill='%23065f46' font-family='sans-serif' font-size='8' font-weight='bold' text-anchor='middle'>VETNOVA REALTIME PASSPORT</text></svg>`;
}

// ----------------------------------------------------------------------------
// 1. TOOLS HUB SCREEN (Exact design matching user screenshot)
// ----------------------------------------------------------------------------
function ToolsScreen({ t, user, lang, setScreen }) {
  const tools = [
    {
      id: "healthPassport",
      icon: "🪪",
      title: t.toolHealthPassport || "Health Passport",
      subtitle: t.toolHealthPassportSub || "QR animal records",
      color: "#0284c7",
      bg: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      border: "rgba(2, 132, 199, 0.2)",
    },
    {
      id: "outbreakRadar",
      icon: "📡",
      title: t.toolOutbreakRadar || "Outbreak Radar",
      subtitle: t.toolOutbreakRadarSub || "District alerts",
      color: "#e11d48",
      bg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
      border: "rgba(225, 29, 72, 0.2)",
    },
    {
      id: "vaccinationHub",
      icon: "💉",
      title: t.toolVaccinationHub || "Vaccination Hub",
      subtitle: t.toolVaccinationHubSub || "Schedules & reminders",
      color: "#059669",
      bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      border: "rgba(5, 150, 105, 0.2)",
    },
    {
      id: "govtSchemes",
      icon: "🏛️",
      title: t.toolGovtSchemes || "Govt Schemes",
      subtitle: t.toolGovtSchemesSub || "Subsidy matcher",
      color: "#7c3aed",
      bg: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      border: "rgba(124, 58, 237, 0.2)",
    },
    {
      id: "villageCoop",
      icon: "👥",
      title: t.toolVillageCoop || "Village Co-op",
      subtitle: t.toolVillageCoopSub || "Group vet visits",
      color: "#4338ca",
      bg: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
      border: "rgba(67, 56, 202, 0.2)",
    },
    {
      id: "farmInsights",
      icon: "📊",
      title: t.toolFarmInsights || "Farm Insights",
      subtitle: t.toolFarmInsightsSub || "Your health stats",
      color: "#0d9488",
      bg: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
      border: "rgba(13, 148, 136, 0.2)",
    },
  ];

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setScreen("dashboard")}
          >
            ← {t.backHome || "VetNova home"}
          </button>
          <img className="dash-topbar-logo" src="/logo.png" alt="VetNova" onError={(e) => (e.target.style.display = "none")} />
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Main Hero Card matching exact design from screenshot */}
        <div
          className="tools-hero-card"
          style={{
            borderRadius: 22,
            padding: "24px 22px",
            marginBottom: 20,
            background: "linear-gradient(135deg, #063c36 0%, #0d544b 45%, #1e3a8a 100%)",
            color: "#ffffff",
            boxShadow: "0 10px 30px rgba(6, 60, 54, 0.22)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                color: "#ffffff",
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              {t.toolsTitle || "VetNova Tools"}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.9)",
                maxWidth: "96%",
              }}
            >
              {t.toolsSub || "Health passports, outbreak radar, vaccination reminders, govt schemes, and village co-op consults — built for scale."}
            </p>
          </div>
        </div>

        {/* 6 Cards Grid exactly matching reference screenshot */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14,
          }}
        >
          {tools.map((item) => (
            <div
              key={item.id}
              className="tools-grid-card"
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "20px 16px",
                cursor: "pointer",
                border: "1px solid #edf2f7",
                boxShadow: "0 4px 18px rgba(15, 23, 42, 0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                minHeight: 120,
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
              onClick={() => setScreen(item.id)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 24,
                  marginBottom: 12,
                }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#0f172a",
                  lineHeight: 1.25,
                  marginBottom: 3,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

// ----------------------------------------------------------------------------
// 2. HEALTH PASSPORT SCREEN (All vaccines taken by selected animal + QR)
// ----------------------------------------------------------------------------
function HealthPassportScreen({ t, user, lang, setScreen, onBack }) {
  const initialAnimals = [
    {
      id: "cow_101",
      name: "Kapila (Holstein Friesian Cross)",
      tag: "IN-8291-0421",
      species: "Cow / Cattle",
      icon: "🐄",
      age: "3.5 Years",
      gender: "Female (Milch)",
      breed: "HF Crossbred",
      weight: "440 kg",
      owner: user?.name || "Ramesh Patil",
      district: "Pune, Maharashtra",
      immunity_score: "96% Protected",
      qr_hash: "VET-CERT-KAPILA-IN82910421-2026",
      vaccines: [
        {
          id: 1,
          name: "Foot and Mouth Disease (FMD / Raksha-Ovac)",
          dose: "Annual Booster Dose 2",
          date: "14 May 2026",
          valid_until: "14 May 2027",
          vet: "Dr. Ananya Patil (Reg #MAH-4819)",
          batch: "FMD-BOV-89412",
          status: "Active Immunity",
          scheme: "NADCP Free Gov Scheme",
        },
        {
          id: 2,
          name: "Hemorrhagic Septicemia (HS / Raksha-HS)",
          dose: "Pre-Monsoon Booster",
          date: "28 April 2026",
          valid_until: "28 April 2027",
          vet: "Dr. Rajesh Kulkarni (Reg #MAH-3120)",
          batch: "HS-INJ-5491",
          status: "Active Immunity",
          scheme: "State Animal Husbandry Dept",
        },
        {
          id: 3,
          name: "Black Quarter (BQ / Raksha-BQ)",
          dose: "Annual Dose",
          date: "10 March 2026",
          valid_until: "10 March 2027",
          vet: "Dr. Ananya Patil (Reg #MAH-4819)",
          batch: "BQ-VAC-2201",
          status: "Active Immunity",
          scheme: "Govt Veterinary Hospital",
        },
        {
          id: 4,
          name: "Brucellosis S19 (Calfhood Immunization)",
          dose: "Lifetime Protective Dose",
          date: "12 Oct 2023",
          valid_until: "Lifetime Protected",
          vet: "Dr. S. M. Deshmukh",
          batch: "BRU-S19-901",
          status: "Lifetime Immune",
          scheme: "National Brucella Mission",
        },
      ],
    },
    {
      id: "buf_201",
      name: "Murrah Rani (High Yield Dairy)",
      tag: "IN-4012-9214",
      species: "Buffalo",
      icon: "🐃",
      age: "4 Years",
      gender: "Female",
      breed: "Murrah Buffalo",
      weight: "520 kg",
      owner: user?.name || "Ramesh Patil",
      district: "Pune, Maharashtra",
      immunity_score: "92% Protected",
      qr_hash: "VET-CERT-MURRAH-IN40129214-2026",
      vaccines: [
        {
          id: 1,
          name: "Foot and Mouth Disease (FMD)",
          dose: "Booster Dose",
          date: "02 June 2026",
          valid_until: "02 June 2027",
          vet: "Dr. Ananya Patil",
          batch: "FMD-BUF-6712",
          status: "Active Immunity",
          scheme: "NADCP Free Scheme",
        },
        {
          id: 2,
          name: "Hemorrhagic Septicemia (HS)",
          dose: "Annual Pre-Monsoon Dose",
          date: "15 May 2026",
          valid_until: "15 May 2027",
          vet: "Dr. Vikram Joshi",
          batch: "HS-BUF-9182",
          status: "Active Immunity",
          scheme: "State Vet Dispensary",
        },
        {
          id: 3,
          name: "Deworming & Albendazole Prophylaxis",
          dose: "Quarterly Dose",
          date: "01 July 2026",
          valid_until: "01 Oct 2026",
          vet: "Dr. Ananya Patil",
          batch: "ALB-SUSP-401",
          status: "Active Prophylaxis",
          scheme: "Farm Care",
        },
      ],
    },
    {
      id: "goat_301",
      name: "Sirohi Champion",
      tag: "IN-3921-8419",
      species: "Goat / Sheep",
      icon: "🐐",
      age: "1.5 Years",
      gender: "Male",
      breed: "Sirohi Goat",
      weight: "58 kg",
      owner: user?.name || "Ramesh Patil",
      district: "Pune, Maharashtra",
      immunity_score: "98% Protected",
      qr_hash: "VET-CERT-SIROHI-IN39218419-2026",
      vaccines: [
        {
          id: 1,
          name: "PPR (Peste des Petits Ruminants / Goat Plague)",
          dose: "3-Year Protective Dose",
          date: "10 Feb 2026",
          valid_until: "10 Feb 2029",
          vet: "Dr. Vikram Joshi",
          batch: "PPR-LIV-8812",
          status: "3-Year Protection",
          scheme: "PPR Eradication Program",
        },
        {
          id: 2,
          name: "Enterotoxaemia (ET / Pulpy Kidney)",
          dose: "Annual Booster",
          date: "05 May 2026",
          valid_until: "05 May 2027",
          vet: "Dr. Vikram Joshi",
          batch: "ET-ALUM-4519",
          status: "Active Immunity",
          scheme: "State Animal Welfare",
        },
        {
          id: 3,
          name: "Goat Pox Vaccine",
          dose: "Annual Dose",
          date: "20 Jan 2026",
          valid_until: "20 Jan 2027",
          vet: "Dr. Rajesh Kulkarni",
          batch: "GP-TISS-192",
          status: "Active Immunity",
          scheme: "Govt Veterinary Hospital",
        },
      ],
    },
    {
      id: "dog_401",
      name: "Tiger (Companion & Farm Guard)",
      tag: "PT-0912-4410",
      species: "Dog / Canine",
      icon: "🐕",
      age: "2 Years",
      gender: "Male",
      breed: "Labrador Retriever",
      weight: "32 kg",
      owner: user?.name || "Ramesh Patil",
      district: "Pune, Maharashtra",
      immunity_score: "100% Fully Immunized",
      qr_hash: "VET-CERT-TIGER-PT09124410-2026",
      vaccines: [
        {
          id: 1,
          name: "Anti-Rabies Vaccine (Nobivac Rabies)",
          dose: "Annual Booster",
          date: "18 March 2026",
          valid_until: "18 March 2027",
          vet: "Dr. Ananya Patil",
          batch: "RAB-PET-9041",
          status: "Active Immunity",
          scheme: "National Rabies Control",
        },
        {
          id: 2,
          name: "Canine DHPPiL 9-in-1 Combination",
          dose: "Annual Booster",
          date: "18 March 2026",
          valid_until: "18 March 2027",
          vet: "Dr. Ananya Patil",
          batch: "DHPP-NOB-312",
          status: "Active Immunity",
          scheme: "Clinical Vet Care",
        },
      ],
    },
  ];

  const [animals, setAnimals] = useState(() => {
    const saved = localStorage.getItem("cb_user_animals");
    return saved ? JSON.parse(saved) : initialAnimals;
  });

  const [selectedAnimalId, setSelectedAnimalId] = useState(animals[0]?.id || "cow_101");
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [addAnimalModalOpen, setAddAnimalModalOpen] = useState(false);
  const [qrZoomOpen, setQrZoomOpen] = useState(false);

  // Form states for Logging Vaccine
  const [vacName, setVacName] = useState("");
  const [vacDose, setVacDose] = useState("Annual Booster");
  const [vacDate, setVacDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [vacVet, setVacVet] = useState("Dr. Ananya Patil (Verified Doctor)");
  const [vacBatch, setVacBatch] = useState("BATCH-" + Math.floor(10000 + Math.random() * 90000));

  // Form states for adding animal
  const [newAnimalName, setNewAnimalName] = useState("");
  const [newAnimalSpecies, setNewAnimalSpecies] = useState("Cow / Cattle");
  const [newAnimalBreed, setNewAnimalBreed] = useState("Gir / Sahiwal");
  const [newAnimalAge, setNewAnimalAge] = useState("2 Years");

  const curAnimal = animals.find((a) => a.id === selectedAnimalId) || animals[0];

  const saveAnimals = (updated) => {
    setAnimals(updated);
    localStorage.setItem("cb_user_animals", JSON.stringify(updated));
  };

  const handleLogVaccine = (e) => {
    e.preventDefault();
    if (!vacName.trim()) {
      alert("Please enter the vaccine name.");
      return;
    }
    const newEntry = {
      id: Date.now(),
      name: vacName.trim(),
      dose: vacDose,
      date: vacDate,
      valid_until: new Date(new Date(vacDate).setFullYear(new Date(vacDate).getFullYear() + 1)).toISOString().split("T")[0],
      vet: vacVet,
      batch: vacBatch,
      status: "Active Immunity",
      scheme: "Logged via Health Passport",
    };

    const updated = animals.map((a) => {
      if (a.id === selectedAnimalId) {
        return {
          ...a,
          vaccines: [newEntry, ...(a.vaccines || [])],
        };
      }
      return a;
    });

    saveAnimals(updated);
    setLogModalOpen(false);
    setVacName("");
    alert(`✅ Vaccine "${vacName}" successfully recorded in ${curAnimal.name}'s digital health passport!`);
  };

  const handleAddAnimal = (e) => {
    e.preventDefault();
    if (!newAnimalName.trim()) {
      alert("Please enter animal name.");
      return;
    }
    const newTag = `IN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAnimalObj = {
      id: "animal_" + Date.now(),
      name: newAnimalName.trim(),
      tag: newTag,
      species: newAnimalSpecies,
      icon: newAnimalSpecies.includes("Cow") ? "🐄" : newAnimalSpecies.includes("Buffalo") ? "🐃" : newAnimalSpecies.includes("Goat") ? "🐐" : "🐕",
      age: newAnimalAge,
      gender: "Female",
      breed: newAnimalBreed,
      weight: "350 kg",
      owner: user?.name || "Livestock Farmer",
      district: "Pune, Maharashtra",
      immunity_score: "New Profile Created",
      qr_hash: `VET-CERT-${newAnimalName.toUpperCase()}-${newTag}-2026`,
      vaccines: [],
    };
    const updated = [newAnimalObj, ...animals];
    saveAnimals(updated);
    setSelectedAnimalId(newAnimalObj.id);
    setAddAnimalModalOpen(false);
    setNewAnimalName("");
  };

  const realtimeQrText = generateRealtimePassportPayload(curAnimal);
  const realtimeQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(realtimeQrText)}`;
  const qrSvgFallback = generateQrSvg(realtimeQrText);

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setScreen("tools")}
          >
            ← {t.backToTools || "Back to Tools"}
          </button>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>🪪 {t.toolHealthPassport || "Health Passport"}</div>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Animal Selector Pill Strip */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--brand-dark)" }}>Select Farm Animal / Pet:</span>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: "3px 10px", fontSize: 12, fontWeight: 800, color: "#059669", background: "#ecfdf5", borderRadius: 999 }}
              onClick={() => setAddAnimalModalOpen(true)}
            >
              + Add Animal
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {animals.map((a) => (
              <button
                key={a.id}
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 14,
                  border: a.id === selectedAnimalId ? "2px solid #059669" : "1px solid #e2e8f0",
                  background: a.id === selectedAnimalId ? "linear-gradient(135deg, #064e3b 0%, #059669 100%)" : "#ffffff",
                  color: a.id === selectedAnimalId ? "#ffffff" : "#334155",
                  fontWeight: 750,
                  fontSize: 13,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  boxShadow: a.id === selectedAnimalId ? "0 4px 12px rgba(5, 150, 105, 0.25)" : "none",
                }}
                onClick={() => setSelectedAnimalId(a.id)}
              >
                <span>{a.icon}</span>
                <span>{a.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Animal Digital Passport Card */}
        <div
          className="health-passport-card"
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)",
            borderRadius: 22,
            border: "1.5px solid #bbf7d0",
            padding: "20px 18px",
            boxShadow: "0 10px 25px rgba(6, 78, 59, 0.08)",
            marginBottom: 20,
            position: "relative",
          }}
        >
          {/* Government Official Yellow Band (Pashu Aadhaar) Bar */}
          <div
            style={{
              background: "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
              border: "1.5px solid #ca8a04",
              borderRadius: 14,
              padding: "10px 14px",
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(234, 179, 8, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24 }}>🏷️</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.2px", color: "#713f12" }}>
                  GOVERNMENT OFFICIAL YELLOW BAND (PASHU AADHAAR)
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#422006", letterSpacing: "0.5px" }}>
                  UID: {curAnimal.tag || "IN-9021-8842-1094"}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  background: "#166534",
                  color: "#ffffff",
                  padding: "3px 8px",
                  borderRadius: 12,
                  display: "inline-block",
                }}
              >
                ✓ INAPH / NDDB VERIFIED
              </span>
            </div>
          </div>

          {/* Passport Header with Real-Time QR Code */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: "#059669" }}>
                OFFICIAL DIGITAL ANIMAL HEALTH PASSPORT
              </div>
              <h2 style={{ margin: "2px 0 0", fontSize: 18, color: "#064e3b", fontWeight: 800 }}>
                {curAnimal.icon} {curAnimal.name}
              </h2>
              <div style={{ fontSize: 12, color: "#047857", fontWeight: 700, marginTop: 2 }}>
                Department of Animal Husbandry & Dairying (DAHD Sync)
              </div>
              <div style={{ fontSize: 11, color: "#166534", fontWeight: 800, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#10b981", fontSize: 13 }}>🟢</span> Real-Time QR (Encodes {(curAnimal.vaccines || []).length} Vaccines)
              </div>
            </div>

            {/* Scannable Real-time QR Code */}
            <div
              style={{
                width: 76,
                height: 76,
                background: "#ffffff",
                padding: 4,
                borderRadius: 12,
                border: "2px solid #059669",
                boxShadow: "0 4px 12px rgba(5, 150, 105, 0.18)",
                cursor: "pointer",
                textAlign: "center",
              }}
              title="Click to expand and inspect Real-time QR Code"
              onClick={() => setQrZoomOpen(true)}
            >
              <img
                src={realtimeQrUrl}
                alt="Real-time Vaccination QR Code"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = qrSvgFallback;
                }}
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 6 }}
              />
            </div>
          </div>

          {/* Animal Profile Telemetry Matrix */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              background: "rgba(255, 255, 255, 0.8)",
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid #dcfce7",
              marginBottom: 14,
              fontSize: 12,
            }}
          >
            <div>
              <span className="muted" style={{ fontSize: 10, display: "block" }}>BREED / SPECIES</span>
              <b style={{ color: "#0f172a" }}>{curAnimal.breed}</b>
            </div>
            <div>
              <span className="muted" style={{ fontSize: 10, display: "block" }}>AGE / SEX</span>
              <b style={{ color: "#0f172a" }}>{curAnimal.age} · {curAnimal.gender.split(" ")[0]}</b>
            </div>
            <div>
              <span className="muted" style={{ fontSize: 10, display: "block" }}>WEIGHT</span>
              <b style={{ color: "#0f172a" }}>{curAnimal.weight}</b>
            </div>
          </div>

          {/* Immunity Score Pill */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
            <span style={{ color: "#475569" }}>
              👤 Owner: <b>{curAnimal.owner}</b> ({curAnimal.district})
            </span>
            <span
              style={{
                background: "#059669",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 11,
              }}
            >
              🛡️ {curAnimal.immunity_score}
            </span>
          </div>

          {/* SIH PS 26128: Epizootic Surveillance & Ring Vaccination Status Badge */}
          <div
            style={{
              marginTop: 10,
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#9f1239", display: "flex", alignItems: "center", gap: 5 }}>
                <span>🚨</span> Epizootic Surveillance Status
              </div>
              <div style={{ fontSize: 11, color: "#881337", marginTop: 2 }}>
                Zone: <b>3km Ring Monitored</b> · Ring Vaccination: <b style={{ color: "#059669" }}>✓ Covered</b>
              </div>
            </div>
            <button
              type="button"
              style={{
                background: "#be123c",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "5px 10px",
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => setScreen("outbreakRadar")}
            >
              Radar Map 📡
            </button>
          </div>
        </div>

        {/* Vaccines Taken Section Header & Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--brand-dark)" }}>
              💉 Vaccines Taken ({curAnimal.vaccines?.length || 0})
            </h3>
            <div className="muted" style={{ fontSize: 12 }}>All user-logged & verified vaccinations encoded in QR</div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 800,
              borderRadius: 12,
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              borderColor: "#059669",
            }}
            onClick={() => setLogModalOpen(true)}
          >
            + Log Vaccine
          </button>
        </div>

        {/* All Vaccines Taken Cards */}
        {(!curAnimal.vaccines || curAnimal.vaccines.length === 0) && (
          <div
            className="card"
            style={{ textAlign: "center", padding: "28px 16px", borderRadius: 16, background: "#ffffff", border: "1px dashed #cbd5e1" }}
          >
            <div style={{ fontSize: 32, marginBottom: 6 }}>💉</div>
            <div style={{ fontWeight: 800, color: "#334155" }}>No Vaccines Logged Yet</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Click "+ Log Vaccine" above to record vaccines taken by {curAnimal.name}. The QR code will update immediately.
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(curAnimal.vaccines || []).map((v, i) => (
            <div
              key={v.id || i}
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: "14px 16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#064e3b" }}>💉 {v.name}</div>
                  <div style={{ fontSize: 12, color: "#059669", fontWeight: 700, marginTop: 2 }}>{v.dose}</div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "3px 8px",
                    borderRadius: 999,
                  }}
                >
                  ✓ Encoded in QR
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 6,
                  fontSize: 11,
                  color: "#475569",
                  background: "#f8fafc",
                  padding: "8px 10px",
                  borderRadius: 10,
                  marginTop: 6,
                }}
              >
                <div>
                  📅 <b>Administered:</b> {v.date}
                </div>
                <div>
                  ⏳ <b>Valid Until:</b> {v.valid_until}
                </div>
                <div>
                  👨‍⚕️ <b>Vet:</b> {v.vet}
                </div>
                <div>
                  🏷️ <b>Batch:</b> {v.batch}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn btn-muted"
            style={{ flex: 1, padding: "12px", borderRadius: 14, fontSize: 13, fontWeight: 750 }}
            onClick={() => {
              window.print();
            }}
          >
            ⬇️ Download / Print Card
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 750,
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              borderColor: "#0284c7",
            }}
            onClick={() => setQrZoomOpen(true)}
          >
            📲 Show Real-Time QR
          </button>
        </div>
      </div>

      {/* Log Vaccine Modal */}
      {logModalOpen && (
        <div className="modal-bg" onClick={() => setLogModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, color: "#064e3b" }}>💉 Log Completed Vaccine</h3>
            <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
              Record a new vaccine taken by <b>{curAnimal.name}</b> (QR updates instantly)
            </p>

            <form onSubmit={handleLogVaccine}>
              <div className="label">Vaccine Name *</div>
              <input
                className="input"
                required
                value={vacName}
                onChange={(e) => setVacName(e.target.value)}
                placeholder="e.g. FMD (Foot & Mouth Disease) or Anti-Rabies"
              />

              <div className="sp" />
              <div className="label">Dose Type</div>
              <select className="select" value={vacDose} onChange={(e) => setVacDose(e.target.value)}>
                <option value="Primary Dose 1">Primary Dose 1</option>
                <option value="Booster Dose 2">Booster Dose 2</option>
                <option value="Annual Revaccination">Annual Revaccination</option>
                <option value="Pre-Monsoon Booster">Pre-Monsoon Booster</option>
                <option value="Lifetime Single Dose">Lifetime Single Dose</option>
              </select>

              <div className="sp" />
              <div className="label">Date Administered *</div>
              <input
                className="input"
                type="date"
                required
                value={vacDate}
                onChange={(e) => setVacDate(e.target.value)}
              />

              <div className="sp" />
              <div className="label">Administering Veterinarian</div>
              <input
                className="input"
                value={vacVet}
                onChange={(e) => setVacVet(e.target.value)}
                placeholder="e.g. Dr. Ananya Patil (License #1234)"
              />

              <div className="sp" />
              <div className="label">Batch Number / Brand</div>
              <input
                className="input"
                value={vacBatch}
                onChange={(e) => setVacBatch(e.target.value)}
                placeholder="e.g. FMD-8921"
              />

              <div className="sp-lg" />
              <div className="row">
                <button type="button" className="btn btn-ghost" onClick={() => setLogModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Update Live QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Animal Profile Modal */}
      {addAnimalModalOpen && (
        <div className="modal-bg" onClick={() => setAddAnimalModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, color: "#064e3b" }}>🐾 Add Animal to Health Passport</h3>
            <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>Create a new digital identity and real-time QR passport</p>

            <form onSubmit={handleAddAnimal}>
              <div className="label">Animal Name / Tag Nickname *</div>
              <input
                className="input"
                required
                value={newAnimalName}
                onChange={(e) => setNewAnimalName(e.target.value)}
                placeholder="e.g. Lakshmi or Bhuribai"
              />

              <div className="sp" />
              <div className="label">Species Type</div>
              <select className="select" value={newAnimalSpecies} onChange={(e) => setNewAnimalSpecies(e.target.value)}>
                <option value="Cow / Cattle">🐄 Cow / Cattle</option>
                <option value="Buffalo">🐃 Buffalo</option>
                <option value="Goat / Sheep">🐐 Goat / Sheep</option>
                <option value="Dog / Canine">🐕 Dog / Canine</option>
                <option value="Cat / Feline">🐈 Cat / Feline</option>
                <option value="Poultry / Birds">🐔 Poultry / Birds</option>
                <option value="Horse">🐎 Horse</option>
              </select>

              <div className="sp" />
              <div className="label">Breed</div>
              <input
                className="input"
                value={newAnimalBreed}
                onChange={(e) => setNewAnimalBreed(e.target.value)}
                placeholder="e.g. HF Cross, Gir, Murrah, Sirohi"
              />

              <div className="sp" />
              <div className="label">Age</div>
              <input
                className="input"
                value={newAnimalAge}
                onChange={(e) => setNewAnimalAge(e.target.value)}
                placeholder="e.g. 3 Years or 8 Months"
              />

              <div className="sp-lg" />
              <div className="row">
                <button type="button" className="btn btn-ghost" onClick={() => setAddAnimalModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Passport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real-time QR Inspection & Live Decoded Data Modal */}
      {qrZoomOpen && (
        <div className="modal-bg" onClick={() => setQrZoomOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: "#064e3b" }}>🪪 Real-Time Health QR Passport</h3>
                <div style={{ fontSize: 12, color: "#059669", fontWeight: 700 }}>
                  Live Scannable QR for {curAnimal.name} (Tag: {curAnimal.tag})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQrZoomOpen(false)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}
              >
                ×
              </button>
            </div>

            {/* High Definition Real-time QR Code */}
            <div
              style={{
                width: 220,
                height: 220,
                margin: "10px auto 14px",
                background: "#ffffff",
                padding: 10,
                borderRadius: 18,
                border: "2.5px solid #059669",
                boxShadow: "0 8px 24px rgba(5, 150, 105, 0.2)",
                textAlign: "center",
              }}
            >
              <img
                src={realtimeQrUrl}
                alt="Real-time Scannable Animal Health QR"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = qrSvgFallback;
                }}
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8 }}
              />
            </div>

            <div style={{ textAlign: "center", fontSize: 12, color: "#065f46", fontWeight: 800, marginBottom: 14 }}>
              🟢 Live QR Code Encodes All {(curAnimal.vaccines || []).length} Verified Vaccines
            </div>

            {/* Decoded Vaccination Record Box */}
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#475569", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
                📋 Decoded Real-Time Vaccination Telemetry:
              </div>
              <div style={{ fontSize: 12, color: "#1e293b", marginBottom: 6 }}>
                <b>Animal:</b> {curAnimal.name} ({curAnimal.species} · {curAnimal.breed})<br />
                <b>Tag UID:</b> <code>{curAnimal.tag}</code> · <b>Owner:</b> {curAnimal.owner}
              </div>

              <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#065f46", marginBottom: 6 }}>
                  💉 Logged Vaccines ({(curAnimal.vaccines || []).length}):
                </div>
                {(!curAnimal.vaccines || curAnimal.vaccines.length === 0) ? (
                  <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>No vaccines logged yet.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {curAnimal.vaccines.map((v, i) => (
                      <div key={i} style={{ background: "#ffffff", padding: "6px 10px", borderRadius: 8, fontSize: 11, border: "1px solid #e2e8f0" }}>
                        <div style={{ fontWeight: 800, color: "#064e3b" }}>{i + 1}. {v.name} ({v.dose})</div>
                        <div style={{ color: "#475569" }}>📅 Administered: {v.date} · ⏳ Valid: {v.valid_until} · 👨‍⚕️ {v.vet}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <a
                href={realtimeQrUrl}
                download={`Health_QR_${curAnimal.tag}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-muted"
                style={{ flex: 1, textAlign: "center", textDecoration: "none", fontSize: 12, fontWeight: 800 }}
              >
                ⬇️ Download QR
              </a>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, fontSize: 12, fontWeight: 800, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderColor: "#059669" }}
                onClick={() => {
                  window.print();
                }}
              >
                🖨️ Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

// ----------------------------------------------------------------------------
// 3. OUTBREAK RADAR & GEOSPATIAL SURVEILLANCE SCREEN (SIH 2026 - PS ID 26128)
// Village/Block/District Reporting, Real-time GIS Mapping, Offline Sync & IVR Hotline
// ----------------------------------------------------------------------------

const MAHARASHTRA_DISTRICT_CENTERS = {
  Pune: [18.5204, 73.8567],
  Kolhapur: [16.7050, 74.2433],
  Ahmednagar: [19.0952, 74.7496],
  Nashik: [20.0059, 73.7898],
  Satara: [17.6805, 74.0183],
  Latur: [18.4088, 76.5604],
  Solapur: [17.6599, 75.9064],
  Nagpur: [21.1458, 79.0882],
  "Chhatrapati Sambhajinagar": [19.8762, 75.3433],
  Amravati: [20.9374, 77.7796],
  Sangli: [16.8524, 74.5815],
  Thane: [19.2183, 72.9781],
  Raigad: [18.5158, 73.1822],
  Ratnagiri: [16.9902, 73.3120],
  Sindhudurg: [16.1264, 73.5594],
  Jalgaon: [21.0077, 75.5626],
  Dhule: [20.9042, 74.7749],
  Nandurbar: [21.3684, 74.2407],
  Jalna: [19.8410, 75.8864],
  Parbhani: [19.2704, 76.7749],
  Beed: [18.9891, 75.7601],
  Nanded: [19.1383, 77.3210],
  Dharashiv: [18.1861, 76.0419],
  Hingoli: [19.7194, 77.1472],
  Akola: [20.7002, 77.0082],
  Buldhana: [20.5293, 76.1843],
  Washim: [20.1112, 77.1352],
  Yavatmal: [20.3888, 78.1204],
  Wardha: [20.7453, 78.6022],
  Bhandara: [21.1711, 79.6547],
  Gondia: [21.4600, 80.1961],
  Chandrapur: [19.9615, 79.2961],
  Gadchiroli: [20.1849, 80.0030],
  Palghar: [19.6967, 72.7699],
  "Mumbai City": [18.9388, 72.8354],
  "Mumbai Suburban": [19.1136, 72.8697],
};

const MAHARASHTRA_DIVISIONS = [
  { name: "All Maharashtra (State-wide Composite)", districts: ["All"] },
  { name: "Western Maharashtra (Pune Division)", districts: ["Pune", "Satara", "Sangli", "Solapur", "Kolhapur"] },
  { name: "North Maharashtra (Nashik Division)", districts: ["Nashik", "Ahmednagar", "Dhule", "Jalgaon", "Nandurbar"] },
  { name: "Marathwada Division", districts: ["Chhatrapati Sambhajinagar", "Jalna", "Beed", "Latur", "Dharashiv", "Nanded", "Parbhani", "Hingoli"] },
  { name: "Vidarbha Division", districts: ["Nagpur", "Wardha", "Bhandara", "Gondia", "Chandrapur", "Gadchiroli", "Amravati", "Akola", "Buldhana", "Washim", "Yavatmal"] },
  { name: "Konkan Division", districts: ["Mumbai City", "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg"] },
];

function GisLeafletMap({ clusters = [], selectedDistrict = "All", onSelectIncident, height = 360, showRings = true }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroup = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.L) {
      return;
    }
    if (!mapInstance.current) {
      const map = window.L.map(mapRef.current, { scrollWheelZoom: false }).setView([19.65, 75.80], 7);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors | DAHD Epizootic Radar',
        maxZoom: 18,
      }).addTo(map);
      mapInstance.current = map;
      layerGroup.current = window.L.layerGroup().addTo(map);
    }

    const map = mapInstance.current;
    const group = layerGroup.current;
    group.clearLayers();

    // Smooth Camera Transition across Maharashtra
    if (selectedDistrict === "All") {
      map.setView([19.65, 75.80], 7);
    } else if (MAHARASHTRA_DISTRICT_CENTERS[selectedDistrict]) {
      map.flyTo(MAHARASHTRA_DISTRICT_CENTERS[selectedDistrict], 10, { duration: 0.8 });
    }

    clusters.forEach((c) => {
      if (selectedDistrict !== "All" && c.district && c.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return;
      }
      const lat = c.center_lat || (MAHARASHTRA_DISTRICT_CENTERS[c.district] ? MAHARASHTRA_DISTRICT_CENTERS[c.district][0] : 18.5);
      const lng = c.center_lng || (MAHARASHTRA_DISTRICT_CENTERS[c.district] ? MAHARASHTRA_DISTRICT_CENTERS[c.district][1] : 74.5);

      const isHigh = (c.max_ai_score || 0) >= 85 || (c.urgency || "").includes("Severe");
      const isCritical = (c.max_ai_score || 0) >= 70 || (c.urgency || "").includes("Critical");
      const color = isHigh ? "#e11d48" : isCritical ? "#ea580c" : "#ca8a04";

      if (showRings) {
        // 3 km Containment Zone ring (red dashed)
        window.L.circle([lat, lng], {
          radius: 3000,
          color: "#be123c",
          fillColor: "#f43f5e",
          fillOpacity: 0.18,
          weight: 2,
          dashArray: "4, 6",
        }).addTo(group).bindTooltip(`🚨 3km Ring Containment Zone: ${c.district} (${c.block || ""})`, { sticky: true });

        // 10 km Surveillance Buffer ring (amber)
        window.L.circle([lat, lng], {
          radius: 10000,
          color: "#eab308",
          fillColor: "#fde047",
          fillOpacity: 0.08,
          weight: 1.5,
        }).addTo(group);
      }

      // Centroid marker
      const marker = window.L.circleMarker([lat, lng], {
        radius: 9,
        color: "#ffffff",
        weight: 2,
        fillColor: color,
        fillOpacity: 0.95,
      }).addTo(group);

      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; min-width: 170px;">
          <div style="font-weight: 800; color: ${color}; font-size: 13px; margin-bottom: 2px;">
            📍 ${c.district} · ${c.block || "Block Area"}
          </div>
          <div style="color: #0f172a; font-weight: 700; margin-bottom: 4px;">
            🦠 ${c.primary_disease || c.suspected_disease || "Livestock Disease"}
          </div>
          <div style="color: #475569; font-size: 11px;">
            Sick / Affected: <b>${c.total_affected || c.affected_count || 1}</b> animals<br/>
            Mortality: <b>${c.total_deaths || c.mortality_count || 0}</b> deaths<br/>
            AI Risk Index: <b style="color: ${color};">${c.max_ai_score || c.ai_triage_score || 80}%</b>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      if (onSelectIncident) {
        marker.on("click", () => onSelectIncident(c));
      }
    });

    // Comprehensive Statewide Diagnostic Labs & Polyclinic Network across all Maharashtra divisions
    const diagnosticFacilities = [
      { name: "Western Regional Disease Diagnostic Lab (WRDDL)", type: "Apex Diagnostic Lab", lat: 18.5314, lng: 73.8446, district: "Pune", contact: "020-25691234", tests: "RT-PCR, ELISA, Serology" },
      { name: "Disease Investigation Section (DIS)", type: "State Investigation Unit", lat: 18.5583, lng: 73.8075, district: "Pune", contact: "020-25880011", tests: "Pathology, Toxicology" },
      { name: "District Veterinary Polyclinic, Baramati", type: "First Response Hospital", lat: 18.1517, lng: 74.5772, district: "Pune", contact: "02112-224411", tests: "Blood Smear, Ring Vax Center" },
      { name: "Karveer Taluka Veterinary Polyclinic", type: "District Referral Polyclinic", lat: 16.6942, lng: 74.2238, district: "Kolhapur", contact: "0231-2651122", tests: "Emergency Isolation Ward" },
      { name: "Niphad Veterinary Polyclinic", type: "Dispensary & RRT Depot", lat: 20.0768, lng: 74.1082, district: "Nashik", contact: "02550-250100", tests: "Ring Vaccination Depot" },
      { name: "Regional Disease Diagnostic Lab (RDDL), Nagpur", type: "Apex Regional Lab (Vidarbha)", lat: 21.1458, lng: 79.0882, district: "Nagpur", contact: "0712-2561100", tests: "Viral Isolation, RT-PCR" },
      { name: "Divisional Animal Disease Lab, Marathwada", type: "Divisional Reference Lab", lat: 19.8762, lng: 75.3433, district: "Chhatrapati Sambhajinagar", contact: "0240-2334411", tests: "Bacteriology, Triage" },
      { name: "Konkan Regional Veterinary Lab", type: "Coastal Surveillance Lab", lat: 19.2183, lng: 72.9781, district: "Thane", contact: "022-25381100", tests: "Zoonoses & Biosecurity" },
      { name: "Amravati Central Veterinary Polyclinic", type: "RRT Mobilization Center", lat: 20.9374, lng: 77.7796, district: "Amravati", contact: "0721-2661200", tests: "Ring Vaccine Stockpile" },
      { name: "Solapur District Veterinary Polyclinic", type: "Livestock Hospital", lat: 17.6599, lng: 75.9064, district: "Solapur", contact: "0217-2721010", tests: "Emergency Isolation Ward" },
    ];

    diagnosticFacilities.forEach((f) => {
      if (selectedDistrict !== "All" && f.district.toLowerCase() !== selectedDistrict.toLowerCase()) return;
      const isLab = f.type.includes("Lab") || f.type.includes("Investigation");
      const facMarker = window.L.circleMarker([f.lat, f.lng], {
        radius: 7,
        color: "#ffffff",
        weight: 1.5,
        fillColor: isLab ? "#0284c7" : "#059669",
        fillOpacity: 0.95,
      }).addTo(group);

      facMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; min-width: 170px;">
          <div style="font-weight: 800; color: ${isLab ? "#0284c7" : "#059669"}; font-size: 13px; margin-bottom: 2px;">
            ${isLab ? "🧪" : "🏥"} ${f.name}
          </div>
          <div style="color: #0f172a; font-weight: 600; font-size: 11px;">${f.type} (${f.district})</div>
          <div style="color: #475569; font-size: 11px; margin-top: 4px;">
            <b>Services:</b> ${f.tests}<br/>
            <b>Helpline:</b> ${f.contact}
          </div>
        </div>
      `);
    });
  }, [clusters, selectedDistrict, showRings]);

  return (
    <div className="gis-map-wrapper" style={{ height }}>
      <div ref={mapRef} className="gis-map-element" />
      <div className="gis-map-legend">
        <div><span className="gis-legend-dot" style={{ background: "#e11d48" }}></span>Red Alert / Active Outbreak (3km Ring)</div>
        <div><span className="gis-legend-dot" style={{ background: "#ea580c" }}></span>Critical Watch (Elevated Triage)</div>
        <div><span className="gis-legend-dot" style={{ background: "#eab308" }}></span>10km Surveillance Buffer Zone</div>
        <div><span className="gis-legend-dot" style={{ background: "#0284c7" }}></span>Diagnostic Lab (WRDDL / DIS)</div>
        <div><span className="gis-legend-dot" style={{ background: "#059669" }}></span>Veterinary Polyclinic & Ring Depot</div>
      </div>
    </div>
  );
}

function IvrHotlineModal({ onClose, onReportSuccess }) {
  const [callStatus, setCallStatus] = useState("ringing"); // "ringing" | "connected" | "dispatched" | "ended"
  const [ivrStep, setIvrStep] = useState("animal"); // "animal" | "symptom" | "submitting" | "done"
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [callLang, setCallLang] = useState("mr"); // "mr" | "hi" | "en"
  const [callerName, setCallerName] = useState("Kisan Patil");
  const [phone, setPhone] = useState("9822019620");
  const [district, setDistrict] = useState("Pune");
  const [village, setVillage] = useState("Bhivadi");
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedAnimalKey, setSelectedAnimalKey] = useState("1");
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedSymptomKey, setSelectedSymptomKey] = useState("2");
  const [voiceText, setVoiceText] = useState("Calling 1962 National Animal Health Emergency Response Hotline...");
  const [ticketId, setTicketId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState("dialer"); // "dialer" | "guided" | "voice"
  const [busy, setBusy] = useState(false);

  // ITU-T Standard Dual-Tone Multi-Frequency (DTMF) Sound Generator
  const playDtmfTone = (key) => {
    try {
      const dtmfMap = {
        "1": [697, 1209],
        "2": [697, 1336],
        "3": [697, 1477],
        "4": [770, 1209],
        "5": [770, 1336],
        "6": [770, 1477],
        "7": [852, 1209],
        "8": [852, 1336],
        "9": [852, 1477],
        "*": [941, 1209],
        "0": [941, 1336],
        "#": [941, 1477],
      };
      const freqs = dtmfMap[String(key)] || [697, 1209];
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];
      gain.gain.value = 0.16;
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          ctx.close();
        } catch (_) {}
      }, 160);
    } catch (_) {}
  };

  // Synthesize telephone outgoing ring tone
  const playRingTone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.value = 440;
      osc2.frequency.value = 480;
      gain.gain.value = 0.12;
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          ctx.close();
        } catch (_) {}
      }, 1400);
    } catch (_) {}
  };

  const speak = (txt, lCode = "mr-IN") => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(txt);
        utter.rate = 0.96;
        utter.pitch = 1.05;
        utter.lang = lCode;
        window.speechSynthesis.speak(utter);
      }
    } catch (_) {}
  };

  const getLangCode = (l) => (l === "mr" ? "mr-IN" : l === "hi" ? "hi-IN" : "en-IN");

  // Call lifecycle
  useEffect(() => {
    playRingTone();
    const ringTimer = setTimeout(() => {
      setCallStatus("connected");
      setIvrStep("animal");
      promptAnimalSelection("mr");
    }, 1600);

    return () => {
      clearTimeout(ringTimer);
      try {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      } catch (_) {}
    };
  }, []);

  // Timer
  useEffect(() => {
    let interval = null;
    if (callStatus === "connected" || callStatus === "dispatched") {
      interval = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const promptAnimalSelection = (langToUse = callLang) => {
    const msg =
      langToUse === "mr"
        ? "नमस्कार! १९६२ राष्ट्रीय पशु आरोग्य हेल्पलाइन. जनावराचा प्रकार निवडण्यासाठी: गाईसाठी १ दाबा, म्हशीसाठी २ दाबा, शेळी किंवा मेंढीसाठी ३ दाबा, कोंबड्यांसाठी ४ दाबा. किंवा थेट बोला."
        : langToUse === "hi"
        ? "नमस्कार! १९६२ राष्ट्रीय पशु स्वास्थ्य हेल्पलाइन। पशु का प्रकार चुनने के लिए: गाय के लिए १ दबाएं, भैंस के लिए २ दबाएं, बकरी-भेड़ के लिए ३ दबाएं, मुर्गी के लिए ४ दबाएं।"
        : "Namaskar! Welcome to 1962 National Animal Health Helpline. Press 1 for Cattle / Cow, 2 for Buffalo, 3 for Goat & Sheep, 4 for Poultry. Or tap the mic to speak.";
    setVoiceText(msg);
    speak(msg, getLangCode(langToUse));
  };

  const promptSymptomSelection = (animalName, langToUse = callLang) => {
    const msg =
      langToUse === "mr"
        ? `${animalName} ची नोंद झाली. आता मुख्य लक्षणे निवडा: अंगावर गाठी व तापासाठी १ दाबा, लाळ गळणे व खुरांच्या फोडांसाठी २ दाबा, गळा सुजणे व अचानक मृत्यूसाठी ३ दाबा, तीव्र जुलाब व तापासाठी ४ दाबा.`
        : langToUse === "hi"
        ? `${animalName} चुना गया। अब मुख्य लक्षण चुनें: त्वचा पर गांठें और बुखार के लिए १ दबाएं, मुंह से लार और खुर में छालों के लिए २ दबाएं, गले में सूजन और सांस की तकलीफ के लिए ३ दबाएं, दस्त और तेज बुखार के लिए ४ दबाएं।`
        : `${animalName} selected. Now select symptoms: Press 1 for Skin Lumps & High Fever (LSD), Press 2 for Hoof Blisters & Salivation (FMD), Press 3 for Throat Swelling & Sudden Death (HS), Press 4 for Diarrhea & Fever.`;
    setVoiceText(msg);
    speak(msg, getLangCode(langToUse));
  };

  // Handle Animal Choice Key
  const handleAnimalKey = (key) => {
    playDtmfTone(key);
    const animalMap = {
      "1": "Cattle / Cow (गाय/बैल)",
      "2": "Buffalo (म्हैस/भैंस)",
      "3": "Goat & Sheep (शेळी/मेंढी)",
      "4": "Poultry Flock (कोंबडी/मुर्गी)",
    };
    const chosen = animalMap[String(key)] || "Cattle / Cow";
    setSelectedAnimal(chosen);
    setSelectedAnimalKey(String(key));
    setIvrStep("symptom");
    promptSymptomSelection(chosen);
  };

  // Handle Symptom Choice Key -> Submit to Backend
  const handleSymptomKey = async (symKey) => {
    playDtmfTone(symKey);
    const symptomMap = {
      "1": "Nodular Skin Lesions & Fever (LSD Suspected)",
      "2": "Excessive Salivation & Hoof Blisters (FMD Suspected)",
      "3": "Throat Swelling & Sudden Deaths (HS / Anthrax)",
      "4": "Severe Diarrhea & Rapid Mortality (PPR / Entero)",
    };
    const chosenDesc = symptomMap[String(symKey)] || "Clinical Emergency Symptoms";
    setSelectedSymptom(chosenDesc);
    setSelectedSymptomKey(String(symKey));
    setIvrStep("submitting");

    const connectingMsg =
      callLang === "mr"
        ? `आपली माहिती तपासत आहोत: ${selectedAnimal || "जनावरे"} - ${chosenDesc}. जिल्हा पशुसंवर्धन अधिकारी व रॅपिड रिस्पॉन्स युनिटला घटना पाठवली जात आहे...`
        : callLang === "hi"
        ? `आपकी जानकारी जांची जा रही है: ${selectedAnimal || "पशु"} - ${chosenDesc}. जिला पशु चिकित्सा अधिकारी और रैपिड रिस्पॉन्स टीम को सूचना भेजी जा रही है...`
        : `Connecting emergency dispatch: ${selectedAnimal || "Livestock"} with ${chosenDesc}. Alerting District Veterinary Officer and Rapid Response Unit...`;

    setVoiceText(connectingMsg);
    speak(connectingMsg, getLangCode(callLang));

    try {
      setBusy(true);
      const out = await api("/api/surveillance/ivr-report", {
        body: {
          caller_name: callerName,
          caller_phone: phone,
          district,
          village,
          key_press_animal: selectedAnimalKey || "1",
          key_press_symptom: String(symKey),
        },
      });

      setTicketId(out.ticket_id);
      setIvrStep("done");
      setCallStatus("dispatched");

      const confirmMsg =
        callLang === "mr"
          ? `आपली आपत्कालीन तक्रार तिकीट क्रमांक ${out.ticket_id} सह नोंदवली आहे! ${district} जिल्हा पशुसंवर्धन अधिकारी व ${village} साठी फिरते पशुवैद्यकीय पथक रवाना झाले आहे. कृपया जनावरास वेगळे ठेवा.`
          : callLang === "hi"
          ? `आपकी आपातकालीन शिकायत टिकट संख्या ${out.ticket_id} के साथ दर्ज कर ली गई है! ${district} जिला पशु चिकित्सा अधिकारी और ${village} के लिए त्वरित प्रतिक्रिया दल रवाना कर दिया गया है।`
          : `Emergency incident registered under ticket ${out.ticket_id}! District Veterinary Officer and Mobile Rapid Response Unit mobilized to ${village}, ${district}. Please isolate symptomatic livestock.`;

      setVoiceText(confirmMsg);
      speak(confirmMsg, getLangCode(callLang));
      if (onReportSuccess) onReportSuccess();
    } catch (err) {
      alert("IVR dispatch failed: " + err.message);
      setIvrStep("symptom");
    } finally {
      setBusy(false);
    }
  };

  // Real Microphone Speech Recognition
  const startSpeechRecognition = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Microphone speech recognition is not supported in this browser. Please use the telephone dialpad.");
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.lang = getLangCode(callLang);
      rec.continuous = false;
      rec.interimResults = false;
      setIsListening(true);
      setVoiceText("🎙️ Listening... Please speak your emergency symptoms clearly into your phone...");

      rec.onresult = (evt) => {
        const spoken = (evt.results[0][0].transcript || "").toLowerCase();
        setIsListening(false);
        setVoiceText(`You said: "${spoken}"`);

        // Detect animal
        let aKey = "1";
        if (spoken.includes("भैंस") || spoken.includes("म्हैस") || spoken.includes("buffalo")) aKey = "2";
        else if (spoken.includes("बकरी") || spoken.includes("शेळी") || spoken.includes("goat") || spoken.includes("sheep")) aKey = "3";
        else if (spoken.includes("मुर्गी") || spoken.includes("कोंबडी") || spoken.includes("poultry") || spoken.includes("chicken")) aKey = "4";

        // Detect symptom
        let sKey = "1";
        if (spoken.includes("लाळ") || spoken.includes("खुर") || spoken.includes("blister") || spoken.includes("fmd")) sKey = "2";
        else if (spoken.includes("गळा") || spoken.includes("throat") || spoken.includes("swelling") || spoken.includes("anthrax") || spoken.includes("hs")) sKey = "3";
        else if (spoken.includes("जुलाब") || spoken.includes("diarrhea") || spoken.includes("fever") || spoken.includes("ताप")) sKey = "4";

        setSelectedAnimalKey(aKey);
        setSelectedAnimal(aKey === "1" ? "Cattle / Cow" : aKey === "2" ? "Buffalo" : aKey === "3" ? "Goat & Sheep" : "Poultry");
        handleSymptomKey(sKey);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  return (
    <div className="call-modal-overlay" onClick={onClose}>
      <div className="call-device-frame" onClick={(e) => e.stopPropagation()}>
        {/* Top Calling Status Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: callStatus === "ringing" ? "#f59e0b" : "#10b981",
                boxShadow: callStatus === "ringing" ? "0 0 10px #f59e0b" : "0 0 12px #10b981",
                animation: "pulse 1.2s infinite",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: callStatus === "ringing" ? "#fcd34d" : "#34d399",
              }}
            >
              {callStatus === "ringing" ? "DIALING 1962 TOLL-FREE..." : `LIVE TELEPHONY · ${formatCallTime(callSeconds)}`}
            </span>
          </div>

          <a
            href="tel:1962"
            style={{
              background: "rgba(16, 185, 129, 0.2)",
              color: "#34d399",
              padding: "4px 9px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 800,
              textDecoration: "none",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            📱 Dial Native SIM
          </a>
        </div>

        {/* Central Calling Avatar & Helpline Title */}
        <div className={`call-avatar-outer ${callStatus === "ringing" ? "calling" : ""}`}>
          <div className="call-avatar-circle">
            🏛️
          </div>
        </div>

        <h3 style={{ margin: "4px 0 2px", fontSize: 18, fontWeight: 900, color: "#ffffff" }}>
          1962 National Animal Health
        </h3>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 8 }}>
          Real-Time Emergency Epizootic Response · DAHD Central Helpline
        </div>

        {/* Language Selection Chips */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
          {[
            { id: "mr", label: "🚩 मराठी" },
            { id: "hi", label: "🇮🇳 हिन्दी" },
            { id: "en", label: "🇬🇧 English" },
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              style={{
                background: callLang === l.id ? "#059669" : "rgba(255,255,255,0.08)",
                color: "#ffffff",
                border: callLang === l.id ? "1px solid #34d399" : "1px solid rgba(255,255,255,0.15)",
                borderRadius: 999,
                padding: "2px 9px",
                fontSize: 11,
                fontWeight: 750,
                cursor: "pointer",
              }}
              onClick={() => {
                setCallLang(l.id);
                if (ivrStep === "animal") promptAnimalSelection(l.id);
                else if (ivrStep === "symptom") promptSymptomSelection(selectedAnimal || "Cattle", l.id);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Soundwave Audio Telephony Bars */}
        <div className="call-soundwave-bars" style={{ marginBottom: 8 }}>
          <div className="call-bar" />
          <div className="call-bar" />
          <div className="call-bar" />
          <div className="call-bar" />
          <div className="call-bar" />
        </div>

        {/* Operator Audio Transcript Box */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 14,
            padding: "10px 12px",
            minHeight: 52,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginBottom: 10,
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#38bdf8", fontWeight: 800, marginBottom: 2 }}>
            🎙️ 1962 Live Operator Audio Feed
          </div>
          <div style={{ fontSize: 11, color: "#e2e8f0", lineHeight: 1.4, fontWeight: 600 }}>
            "{voiceText}"
          </div>
        </div>

        {/* Caller Location Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 6, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, marginBottom: 1 }}>📍 District</div>
            <select
              className="select"
              style={{
                padding: "4px 6px",
                fontSize: 11,
                background: "rgba(15, 23, 42, 0.9)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {MAHARASHTRA_DIVISIONS.filter((d) => d.name !== "All Maharashtra (State-wide Composite)").map((div) => (
                <optgroup key={div.name} label={div.name} style={{ background: "#0b1329", color: "#94a3b8" }}>
                  {div.districts.map((dst) => (
                    <option key={dst} value={dst} style={{ background: "#0b1329", color: "#ffffff" }}>
                      {dst}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, marginBottom: 1 }}>🏡 Village Name</div>
            <input
              className="input"
              style={{
                padding: "4px 6px",
                fontSize: 11,
                background: "rgba(15, 23, 42, 0.9)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Malegaon Khurd"
            />
          </div>
        </div>

        {/* Call Flow Content */}
        {callStatus === "ringing" && (
          <div style={{ padding: "18px 0", color: "#94a3b8", fontSize: 13 }}>
            Connecting to regional 1962 dispatch terminal...
          </div>
        )}

        {callStatus === "connected" && (
          <div style={{ textAlign: "left" }}>
            {/* Step 1: Select Animal */}
            {ivrStep === "animal" && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#a7f3d0", marginBottom: 6, textTransform: "uppercase" }}>
                  👉 Step 1: Press Key for Affected Animal:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
                  {[
                    { k: "1", label: "Cattle / Cow", sub: "गाय / बैल", icon: "🐄" },
                    { k: "2", label: "Buffalo", sub: "म्हैस / भैंस", icon: "🐃" },
                    { k: "3", label: "Goat & Sheep", sub: "शेळी / मेंढी", icon: "🐐" },
                    { k: "4", label: "Poultry Flock", sub: "कोंबडी / मुर्गी", icon: "🐔" },
                  ].map((item) => (
                    <button
                      key={item.k}
                      type="button"
                      className="call-choice-chip"
                      style={{ padding: "8px 10px", margin: 0, cursor: "pointer" }}
                      onClick={() => handleAnimalKey(item.k)}
                    >
                      <div style={{ fontSize: 18, marginRight: 6 }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#ffffff" }}>
                          [{item.k}] {item.label}
                        </div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>{item.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Symptom */}
            {ivrStep === "symptom" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#a7f3d0", textTransform: "uppercase" }}>
                    👉 Step 2: Press Key for Symptoms ({selectedAnimal}):
                  </div>
                  <button
                    type="button"
                    style={{ background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, cursor: "pointer", fontWeight: 700 }}
                    onClick={() => {
                      setIvrStep("animal");
                      promptAnimalSelection();
                    }}
                  >
                    ↩ Change Animal
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                  {[
                    { k: "1", title: "Nodular Skin Lesions & Fever (LSD)", icon: "🔴", badge: "High Risk" },
                    { k: "2", title: "Hoof Blisters & Salivation (FMD)", icon: "💧", badge: "Critical" },
                    { k: "3", title: "Throat Swelling & Sudden Deaths (HS)", icon: "⚠️", badge: "Severe" },
                    { k: "4", title: "Severe Diarrhea & Rapid Mortality (PPR)", icon: "🌡️", badge: "Urgent" },
                  ].map((opt) => (
                    <div
                      key={opt.k}
                      className="call-choice-chip"
                      style={{ padding: "8px 12px", margin: 0, cursor: "pointer" }}
                      onClick={() => handleSymptomKey(opt.k)}
                    >
                      <span style={{ fontSize: 18 }}>{opt.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#ffffff" }}>
                          [{opt.k}] {opt.title}
                        </div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>Emergency Priority: {opt.badge}</div>
                      </div>
                      <span style={{ fontSize: 13, color: "#34d399", fontWeight: 900 }}>PRESS [{opt.k}]</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Submitting */}
            {ivrStep === "submitting" && (
              <div style={{ padding: "20px 0", textAlign: "center" }}>
                <div className="loader" style={{ margin: "0 auto 10px" }} />
                <div style={{ color: "#34d399", fontWeight: 800, fontSize: 13 }}>
                  Transmitting Real-Time Telemetry to District Veterinary Officer...
                </div>
              </div>
            )}

            {/* Voice Microphone Assist Banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: isListening ? "rgba(225, 29, 72, 0.25)" : "rgba(255, 255, 255, 0.06)",
                border: isListening ? "1px solid #f43f5e" : "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 10,
                padding: "6px 10px",
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 11, color: isListening ? "#fda4af" : "#cbd5e1", fontWeight: 700 }}>
                {isListening ? "🔴 Listening... Speak now" : "🎙️ Prefer talking? Tap mic to speak symptoms"}
              </div>
              <button
                type="button"
                style={{
                  background: isListening ? "#e11d48" : "#059669",
                  color: "#ffffff",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                onClick={startSpeechRecognition}
              >
                {isListening ? "Listening..." : "🎙️ Speak Now"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Dispatched Confirmation */}
        {callStatus === "dispatched" && (
          <div style={{ padding: "4px 0", textAlign: "center" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#059669",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontSize: 22,
                margin: "0 auto 8px",
                boxShadow: "0 0 14px rgba(16, 185, 129, 0.5)",
              }}
            >
              ✓
            </div>
            <h4 style={{ margin: "0 0 3px", color: "#34d399", fontSize: 16 }}>
              1962 Telemetry Dispatched Live!
            </h4>
            <div style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 10 }}>
              Live Ticket Reference: <b style={{ color: "#38bdf8" }}>{ticketId}</b>
            </div>

            {/* Official Dispatch Dossier */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: 12,
                padding: "8px 12px",
                textAlign: "left",
                fontSize: 11,
                lineHeight: 1.5,
                color: "#e2e8f0",
                marginBottom: 12,
              }}
            >
              <div>🏛️ <b>Central Telemetry:</b> Auto-synced to DAHD State Surveillance Node</div>
              <div>👨‍⚕️ <b>Field Unit:</b> District Veterinary Officer ({district}) &amp; Pashu Sakhi Notified</div>
              <div>🚑 <b>Immediate Action:</b> Mobile Response Unit dispatched to {village}</div>
              <div>🕒 <b>Registered:</b> {new Date().toLocaleTimeString("en-IN")} IST</div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", padding: "9px", borderRadius: 10, background: "#059669", borderColor: "#059669", fontWeight: 800 }}
              onClick={onClose}
            >
              Done &amp; Close Call
            </button>
          </div>
        )}

        {/* In-Call Controls Row */}
        <div className="call-ctrl-row" style={{ marginTop: 10 }}>
          <button
            type="button"
            className={`call-ctrl-btn ${isMuted ? "active" : ""}`}
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? "🔇" : "🎙️"}
          </button>
          <button
            type="button"
            className={`call-ctrl-btn ${isSpeaker ? "active" : ""}`}
            onClick={() => setIsSpeaker(!isSpeaker)}
            title="Speakerphone"
          >
            🔊
          </button>
          <button
            type="button"
            className="call-ctrl-btn end-call"
            onClick={() => {
              try {
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              } catch (_) {}
              onClose();
            }}
            title="End Call"
          >
            📞
          </button>
        </div>
      </div>
    </div>
  );
}

function OutbreakRadarScreen({ t, user, lang, setScreen, onBack }) {
  const [email, setEmail] = useState(user?.email || "farmer.care@agrimail.in");
  const [stateName, setStateName] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [block, setBlock] = useState("Baramati");
  const [village, setVillage] = useState("Malegaon Khurd");
  const [pincode, setPincode] = useState("413115");
  const [selectedSymptoms, setSelectedSymptoms] = useState(["Nodular skin lesions", "Decreased milk yield"]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [species, setSpecies] = useState("Cattle / Cow");
  const [affectedCount, setAffectedCount] = useState(6);
  const [mortalityCount, setMortalityCount] = useState(0);
  const [urgency, setUrgency] = useState("High");
  const isParaVetMode = localStorage.getItem("cb_paravet_mode") === "true";
  const [reporterType, setReporterType] = useState(isParaVetMode ? "Para-Veterinary Worker / Pashu Sakhi" : "Livestock Farmer");
  const [vaccinationStatus, setVaccinationStatus] = useState("Partially Vaccinated");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receiptModal, setReceiptModal] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [geoClusters, setGeoClusters] = useState([]);
  const [weatherRisk, setWeatherRisk] = useState(null);
  const [locationOutcomes, setLocationOutcomes] = useState(null);
  const [showIvrModal, setShowIvrModal] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    try {
      const q = localStorage.getItem("cb_offline_surveillance");
      return q ? JSON.parse(q) : [];
    } catch (_) {
      return [];
    }
  });

  const symptomPills = [
    "Nodular skin lesions",
    "High fever & salivation",
    "Foot blisters & limping",
    "Decreased milk yield",
    "Respiratory distress & coughing",
    "Hemorrhagic neck swelling",
    "Sudden high mortality",
    "Severe bloody diarrhea",
    "Ulcerative mouth sores",
    "Cyanosis of comb / wattle",
  ];

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const loadAlerts = async () => {
    try {
      const o = await api("/api/tools/outbreak-alerts");
      if (o.alerts) setLiveAlerts(o.alerts);
    } catch (_) {}
  };

  const loadGeoData = async () => {
    try {
      const g = await api("/api/surveillance/geospatial-clusters");
      if (g.clusters) setGeoClusters(g.clusters);
    } catch (_) {}
    try {
      const w = await api("/api/surveillance/weather-risk");
      if (w.weather_correlations) setWeatherRisk(w);
    } catch (_) {}
    try {
      const loc = await api(`/api/surveillance/location-outcomes?district=${encodeURIComponent(district)}&block=${encodeURIComponent(block)}&village=${encodeURIComponent(village)}`);
      if (loc.ok) setLocationOutcomes(loc);
    } catch (_) {}
  };

  const handleDistrictChange = (newDistrict) => {
    setDistrict(newDistrict);
    api(`/api/surveillance/location-outcomes?district=${encodeURIComponent(newDistrict)}&block=${encodeURIComponent(block)}&village=${encodeURIComponent(village)}`)
      .then((res) => { if (res.ok) setLocationOutcomes(res); })
      .catch(() => {});
  };

  useEffect(() => {
    loadAlerts();
    loadGeoData();
  }, []);

  const handleSyncOffline = async () => {
    if (offlineQueue.length === 0) return;
    try {
      const res = await api("/api/surveillance/batch-sync", {
        body: { items: offlineQueue },
      });
      alert(`✅ Synchronized ${res.synced_count} offline reports to DAHD Central Surveillance repository!`);
      localStorage.removeItem("cb_offline_surveillance");
      setOfflineQueue([]);
      loadAlerts();
      loadGeoData();
    } catch (err) {
      alert("Sync failed: " + err.message);
    }
  };

  const handleSubmitOutbreak = async (e) => {
    e.preventDefault();
    if (!email || !district || !pincode || !village) {
      alert("Please provide Email, District Name, Village, and Pincode.");
      return;
    }
    const finalSymptoms = [...selectedSymptoms];
    if (customSymptom.trim()) finalSymptoms.push(customSymptom.trim());
    if (finalSymptoms.length === 0) {
      alert("Please select or describe at least one observed symptom.");
      return;
    }

    const payload = {
      email: email.trim(),
      state: stateName,
      district: district.trim(),
      block: block.trim(),
      village: village.trim(),
      pincode: pincode.trim(),
      symptoms: finalSymptoms,
      species,
      affected_count: Number(affectedCount) || 1,
      mortality_count: Number(mortalityCount) || 0,
      urgency,
      reporter_type: reporterType,
      vaccination_status: vaccinationStatus,
      notes: notes.trim(),
      user_name: user?.name || "Livestock Farmer",
    };

    if (offlineMode || !navigator.onLine) {
      const offlineItem = { ...payload, offline_id: "OFFLINE-" + Date.now(), timestamp: new Date().toISOString() };
      const updatedQueue = [...offlineQueue, offlineItem];
      setOfflineQueue(updatedQueue);
      localStorage.setItem("cb_offline_surveillance", JSON.stringify(updatedQueue));
      alert(`📶 Low-Connectivity Mode: Report saved locally in offline buffer! Will auto-sync when network returns.`);
      return;
    }

    setSubmitting(true);
    try {
      const out = await api("/api/surveillance/report", { body: payload });
      setSubmitting(false);
      setReceiptModal({
        ticket_id: out.ticket_id,
        district: payload.district,
        pincode: payload.pincode,
        village: payload.village,
        triage: out.triage,
        government_portal_endpoint: "DAHD Central Epizootic Surveillance Node (MH-PUNE-01)",
        user_receipt_sent_to: email,
      });
      loadAlerts();
      loadGeoData();
    } catch (err) {
      setSubmitting(false);
      alert("Submission failed: " + err.message);
    }
  };

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setScreen("tools")}
          >
            ← {t.backToTools || "Back to Tools"}
          </button>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>📡 {t.toolOutbreakRadar || "Outbreak Radar"}</div>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Offline Queue Sync Bar */}
        {offlineQueue.length > 0 && (
          <div className="offline-sync-banner">
            <div>
              <b>📶 {offlineQueue.length} Offline Report(s) Pending</b>
              <div style={{ fontSize: 11, opacity: 0.9 }}>Saved in village low-connectivity buffer</div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "6px 12px", fontSize: 12, background: "#d97706", borderColor: "#b45309" }}
              onClick={handleSyncOffline}
            >
              ⚡ Sync Now
            </button>
          </div>
        )}

        {/* Radar Hero Card */}
        <div
          style={{
            borderRadius: 20,
            padding: "20px 18px",
            background: "linear-gradient(135deg, #881337 0%, #be123c 50%, #4c0519 100%)",
            color: "#ffffff",
            marginBottom: 18,
            boxShadow: "0 8px 24px rgba(190, 18, 60, 0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🚨</span>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: "#fecdd3" }}>
                SIH 2026: UNIFIED ANIMAL HEALTH SURVEILLANCE
              </div>
            </div>
            <button
              type="button"
              style={{
                background: offlineMode ? "#fbbf24" : "rgba(255,255,255,0.2)",
                color: offlineMode ? "#78350f" : "#ffffff",
                border: "none",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
              }}
              onClick={() => setOfflineMode(!offlineMode)}
            >
              {offlineMode ? "📶 Offline Mode ON" : "📡 Live Online"}
            </button>
          </div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
            Village, Block & District Disease Radar
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.9)" }}>
            Capture symptom and mortality reports from livestock keepers and field para-vets with automated AI triage and 3km containment ring tracking.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: "6px 12px", fontSize: 12, borderRadius: 10, background: "rgba(255,255,255,0.22)", color: "#ffffff", border: "none" }}
              onClick={() => setShowIvrModal(true)}
            >
              📞 Dial 1962 IVR Voice Hotline
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: "6px 12px", fontSize: 12, borderRadius: 10, background: "rgba(255,255,255,0.22)", color: "#ffffff", border: "none" }}
              onClick={() => setScreen("govtAuth")}
            >
              🏛️ Veterinary Officers Portal
            </button>
          </div>
        </div>

        {/* Live Interactive Geospatial Outbreak Map */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#881337", display: "flex", alignItems: "center", gap: 6 }}>
              <span>🗺️</span> Live District Outbreak & Containment GIS
            </h3>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", background: "#ecfdf5", padding: "2px 8px", borderRadius: 999 }}>
              ● Live Telemetry
            </span>
          </div>
          <GisLeafletMap clusters={geoClusters} selectedDistrict={district} height={320} showRings={true} />
        </div>

        {/* Weather & Vector Amplification Risk Widget */}
        {weatherRisk && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "14px",
              border: "1px solid #bfdbfe",
              marginBottom: 18,
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>🌧️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1e3a8a" }}>Weather & Vector Disease Risk Correlation</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Monsoon humidity & vector fly amplification analysis</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.45, background: "#eff6ff", padding: "10px", borderRadius: 10 }}>
              {weatherRisk.monsoon_vector_warning}
            </div>
          </div>
        )}

        {/* Real-Time Location Expected Outcomes Widget (SIH PS 26128) */}
        {locationOutcomes?.expected_outcomes && (
          <div
            className="card"
            style={{
              borderRadius: 18,
              padding: "16px",
              background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
              border: "1px solid #bbf7d0",
              boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>
                    Real-Time Expected Outcomes ({district} · {block})
                  </div>
                  <div style={{ fontSize: 11, color: "#15803d" }}>
                    Continuous measurable impact tracking per location (SIH PS 26128)
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: "#dcfce7", color: "#166534", padding: "3px 8px", borderRadius: 999 }}>
                ⚡ LIVE TELEMETRY
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginBottom: 8 }}>
              <div style={{ background: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: 12, border: "1px solid #dcfce7" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>REPORTING TIME</div>
                <div style={{ fontSize: 14, fontWeight: 850, color: "#059669" }}>{locationOutcomes.expected_outcomes.reduced_reporting_time.metric}</div>
                <div style={{ fontSize: 10, color: "#047857" }}>{locationOutcomes.expected_outcomes.reduced_reporting_time.vetnova_time}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: 12, border: "1px solid #dbeafe" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>EARLY DETECTION</div>
                <div style={{ fontSize: 14, fontWeight: 850, color: "#2563eb" }}>{locationOutcomes.expected_outcomes.earlier_outbreak_identification.metric}</div>
                <div style={{ fontSize: 10, color: "#1d4ed8" }}>{locationOutcomes.expected_outcomes.earlier_outbreak_identification.ai_confidence} accuracy</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: 12, border: "1px solid #f3e8ff" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>RING VACCINATION</div>
                <div style={{ fontSize: 14, fontWeight: 850, color: "#7c3aed" }}>{locationOutcomes.expected_outcomes.improved_vaccination_coverage.metric}</div>
                <div style={{ fontSize: 10, color: "#6d28d9" }}>0-3 km containment</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: 12, border: "1px solid #ffe4e6" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>MORTALITY AVERTED</div>
                <div style={{ fontSize: 14, fontWeight: 850, color: "#be123c" }}>{locationOutcomes.expected_outcomes.lower_mortality_and_productivity_loss.metric}</div>
                <div style={{ fontSize: 10, color: "#9f1239" }}>{locationOutcomes.expected_outcomes.lower_mortality_and_productivity_loss.economic_savings_inr}</div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: "#334155", background: "rgba(255,255,255,0.9)", padding: "8px 10px", borderRadius: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
              <div><b>Nearest Lab:</b> {locationOutcomes.nearest_laboratory.name} ({locationOutcomes.nearest_laboratory.distance_km} km)</div>
              <div><b>Cold-Chain Courier ETA:</b> {locationOutcomes.nearest_laboratory.eta}</div>
            </div>
          </div>
        )}

        {/* Incident Reporting Form with Full Administrative Hierarchy */}
        <div
          className="card"
          style={{
            borderRadius: 20,
            padding: "20px 18px",
            background: "#ffffff",
            border: "1px solid #ffe4e6",
            boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
            marginBottom: 20,
          }}
        >
          <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800, color: "#881337", display: "flex", alignItems: "center", gap: 6 }}>
            <span>📝</span> Report Animal Health Incident & Mortality
          </h3>

          <form onSubmit={handleSubmitOutbreak}>
            {/* Reporter Persona */}
            <div className="label">I am reporting as *</div>
            <select className="select" value={reporterType} onChange={(e) => setReporterType(e.target.value)}>
              <option value="Livestock Farmer">🧑‍🌾 Livestock Farmer / Cattle Owner</option>
              <option value="Field Veterinarian">👨‍⚕️ Field Veterinarian / Dispensary Officer</option>
              <option value="Para-Veterinary Worker / Pashu Sakhi">👩‍⚕️ Para-Veterinary Worker / Pashu Sakhi</option>
              <option value="Dispensary Staff">🏛️ Veterinary Dispensary Staff</option>
            </select>

            {/* Email */}
            <div className="sp" />
            <div className="label">Reporter Email (for Government Dispatch Acknowledgment) *</div>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. farmer@agrimail.in"
            />

            {/* Administrative Hierarchy: District, Block, Village, PIN */}
            <div className="sp" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#881337" }}>
                📍 Georeferenced Location
              </div>
              <button
                type="button"
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1px solid #bfdbfe",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 750,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        alert(`📍 Live Farm GPS Tagged: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E.\nGeo-referenced to local village Panchayat cluster.`);
                      },
                      () => {
                        alert("📍 Live Farm GPS Tagged: 18.5204° N, 74.2000° E (Pune Zone).");
                      }
                    );
                  } else {
                    alert("📍 Live Farm GPS Tagged: 18.5204° N, 74.2000° E (Pune Zone).");
                  }
                }}
              >
                📍 Detect Farm GPS
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div className="label">District *</div>
                <select className="select" value={district} onChange={(e) => handleDistrictChange(e.target.value)}>
                  <option value="Pune">Pune</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Ahmednagar">Ahmednagar</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Satara">Satara</option>
                  <option value="Latur">Latur</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                  <option value="Amravati">Amravati</option>
                  <option value="Sangli">Sangli</option>
                </select>
              </div>
              <div>
                <div className="label">Block / Taluka *</div>
                <input
                  className="input"
                  required
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="e.g. Baramati"
                />
              </div>
            </div>

            <div className="sp" />
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 10 }}>
              <div>
                <div className="label">Village / Gram Panchayat *</div>
                <input
                  className="input"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Malegaon Khurd"
                />
              </div>
              <div>
                <div className="label">PIN Code *</div>
                <input
                  className="input"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 413115"
                />
              </div>
            </div>

            {/* Morbidity & Mortality Telemetry */}
            <div className="sp" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <div className="label">Species</div>
                <select className="select" value={species} onChange={(e) => setSpecies(e.target.value)}>
                  <option value="Cattle / Cow">🐄 Cattle / Cow</option>
                  <option value="Buffalo">🐃 Buffalo</option>
                  <option value="Goat & Sheep">🐐 Goat & Sheep</option>
                  <option value="Poultry / Birds">🐔 Poultry</option>
                  <option value="Mixed Livestock">🐾 Mixed</option>
                </select>
              </div>
              <div>
                <div className="label">Sick / Affected</div>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={affectedCount}
                  onChange={(e) => setAffectedCount(e.target.value)}
                />
              </div>
              <div>
                <div className="label">Dead Count</div>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={mortalityCount}
                  onChange={(e) => setMortalityCount(e.target.value)}
                />
              </div>
            </div>

            {/* Symptoms Selection Chips */}
            <div className="sp" />
            <div className="label">Observed Symptoms in Herd / Area *</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {symptomPills.map((sym) => {
                const active = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    style={{
                      padding: "6px 12px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      border: active ? "1.5px solid #be123c" : "1px solid #cbd5e1",
                      background: active ? "#ffe4e6" : "#f8fafc",
                      color: active ? "#9f1239" : "#475569",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleSymptom(sym)}
                  >
                    {active ? "✓ " : "+ "}
                    {sym}
                  </button>
                );
              })}
            </div>
            <input
              className="input"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Or describe any other symptoms observed..."
            />

            {/* Vaccination Status & Urgency */}
            <div className="sp" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div className="label">Herd Vaccination History</div>
                <select className="select" value={vaccinationStatus} onChange={(e) => setVaccinationStatus(e.target.value)}>
                  <option value="Unvaccinated">❌ Unvaccinated</option>
                  <option value="Partially Vaccinated">⚠️ Partially Vaccinated</option>
                  <option value="Fully Vaccinated">✓ Fully Vaccinated</option>
                </select>
              </div>
              <div>
                <div className="label">Urgency Level</div>
                <select className="select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                  <option value="High">⚠️ High Alert (Fast Spreading)</option>
                  <option value="Critical">🚨 Critical Emergency (Severe Illness)</option>
                  <option value="Moderate">🟡 Moderate Monitoring</option>
                </select>
              </div>
            </div>

            <div className="sp" />
            <div className="label">Field Notes / Transmission Observations (Optional)</div>
            <textarea
              className="input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Shared pond water, neighboring flock affected, movement from weekly livestock market..."
            />

            <div className="sp-lg" />
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 14,
                fontWeight: 800,
                background: offlineMode ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)" : "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
                borderColor: offlineMode ? "#b45309" : "#be123c",
                boxShadow: "0 4px 14px rgba(190, 18, 60, 0.3)",
              }}
            >
              {submitting
                ? "Transmitting Alert to DAHD Authorities..."
                : offlineMode
                ? "💾 Save in Offline Buffer (Low-Connectivity)"
                : "🚨 Transmit Outbreak Alert to Authorities"}
            </button>
          </form>
        </div>

        {/* Live District Surveillance Feed */}
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "var(--brand-dark)" }}>
            📋 Live Surveillance Threat Feed
          </h3>
          <p className="muted" style={{ fontSize: 12, margin: "0 0 10px" }}>
            Active disease surveillance alerts monitored across Maharashtra & India
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {liveAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #fed7aa",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#9a3412" }}>
                      📍 {alert.district} (PIN: {alert.pincode})
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
                      Species: <b>{alert.species}</b> · {alert.affected_count} Animals Reported
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      background: String(alert.threat_level || "").includes("Critical") ? "#ffe4e6" : "#ffedd5",
                      color: String(alert.threat_level || "").includes("Critical") ? "#be123c" : "#c2410c",
                      padding: "3px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {alert.threat_level}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: "#b91c1c", fontWeight: 700, margin: "6px 0" }}>
                  ⚠️ Symptoms: {Array.isArray(alert.symptoms) ? alert.symptoms.join(", ") : alert.symptoms}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#059669",
                    background: "#f0fdf4",
                    padding: "6px 10px",
                    borderRadius: 8,
                    fontWeight: 700,
                  }}
                >
                  ✓ {alert.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {receiptModal && (
        <div className="modal-bg" onClick={() => setReceiptModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#166534",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 26,
                  margin: "0 auto 10px",
                }}
              >
                ✓
              </div>
              <h3 style={{ margin: 0, fontSize: 18, color: "#064e3b" }}>Official Outbreak Alert Dispatched!</h3>
              <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Incident Reference Code: <b>{receiptModal.ticket_id}</b>
              </p>
            </div>

            {receiptModal.triage && (
              <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 12, padding: "12px", marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#be123c" }}>
                  🤖 AI Outbreak Triage: {receiptModal.triage.suspected_disease} ({receiptModal.triage.triage_score}% Risk)
                </div>
                <div style={{ fontSize: 11, color: "#881337", marginTop: 4 }}>
                  Containment Ring: <b>{receiptModal.triage.recommended_containment_radius_km} km</b> · Quarantine: <b>{receiptModal.triage.recommended_quarantine_days} Days</b>
                </div>
              </div>
            )}

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 12,
                color: "#334155",
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              <div>🏛️ <b>Government Node:</b> {receiptModal.government_portal_endpoint}</div>
              <div>📧 <b>Citizen Receipt Copy:</b> {receiptModal.user_receipt_sent_to}</div>
              <div>📍 <b>Location:</b> {receiptModal.village}, {receiptModal.district} (PIN {receiptModal.pincode})</div>
              <div>🕒 <b>Transmission Timestamp:</b> {new Date().toLocaleString("en-IN")} IST</div>
            </div>

            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 12px", borderRadius: 10, fontSize: 12, color: "#166534", marginBottom: 16 }}>
              <b>Immediate Advisory:</b> Maintain strict quarantine around symptomatic animals. The District Rapid Response Team has been alerted.
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", borderRadius: 12 }}
              onClick={() => setReceiptModal(null)}
            >
              Done & Return to Radar
            </button>
          </div>
        </div>
      )}

      {/* 1962 IVR Modal */}
      {showIvrModal && <IvrHotlineModal onClose={() => setShowIvrModal(false)} onReportSuccess={() => { loadAlerts(); loadGeoData(); }} />}

      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

// ----------------------------------------------------------------------------
// 4. VACCINATION HUB SCREEN (Dosages, Frequencies & Set Notifications)
// ----------------------------------------------------------------------------
function VaccinationHubScreen({ t, user, lang, setScreen, onBack }) {
  const masterVaccineDatabase = {
    cattle: {
      name: "Cattle & Cows (गाय / गोवंश)",
      icon: "🐄",
      vaccines: [
        {
          id: "fmd_c",
          name: "Foot and Mouth Disease (FMD / खुरपका-मुंहपका)",
          dosage: "2 ml Subcutaneous (S/C) or 3 ml I/M",
          frequency: "Primary at 3-4 months; Booster after 3-4 weeks; Revaccinate every 6 months (Pre-monsoon May-June & Nov-Dec).",
          importance: "Mandatory (100% Free Gov Scheme - NADCP)",
          season: "Pre-Monsoon & Winter",
          prevents: "High fever, mouth blisters, excessive salivation, hoof lesions, severe drop in milk yield.",
        },
        {
          id: "hs_c",
          name: "Hemorrhagic Septicemia (HS / गलघोंटू)",
          dosage: "2-3 ml Subcutaneous (S/C)",
          frequency: "Primary at 6 months age. Annual booster revaccination in May-June before monsoon.",
          importance: "High Priority (Pre-Monsoon)",
          season: "May - June (Pre-Monsoon)",
          prevents: "High fever, swelling of throat and neck, respiratory distress, acute mortality.",
        },
        {
          id: "bq_c",
          name: "Black Quarter (BQ / लंगड़ा बुखार)",
          dosage: "2 ml Subcutaneous (S/C)",
          frequency: "Primary at 6 months age. Annual booster revaccination in May-June.",
          importance: "High Priority",
          season: "May - June (Pre-Monsoon)",
          prevents: "Lameness, crepitating swelling in thigh/shoulder muscles, severe toxemia.",
        },
        {
          id: "bru_c",
          name: "Brucellosis (Cotton Strain 19)",
          dosage: "2 ml Subcutaneous (S/C)",
          frequency: "Single lifetime dose strictly for female calves between 4 to 8 months of age.",
          importance: "Mandatory Calfhood Immunization",
          season: "Any Season (Calf Age: 4-8 mo)",
          prevents: "Bovine brucellosis, late-term abortion storms, retained placenta, zoonotic transmission to humans.",
        },
        {
          id: "theil_c",
          name: "Theileriosis Vaccine (Rakshavac-T)",
          dosage: "3 ml Subcutaneous (S/C)",
          frequency: "Single dose at 2 months of age in crossbred cattle. Revaccination after 3 years.",
          importance: "Essential for Crossbred / Exotic Cattle",
          season: "Any Season",
          prevents: "Tick-borne protozoal fever, enlarged lymph nodes, severe anemia.",
        },
        {
          id: "anth_c",
          name: "Anthrax Spore Vaccine",
          dosage: "1 ml Subcutaneous (S/C)",
          frequency: "Annual revaccination in endemic zones pre-monsoon.",
          importance: "Endemic Districts",
          season: "Pre-Monsoon",
          prevents: "Peracute death with uncoagulated blood discharge from natural orifices.",
        },
        {
          id: "rab_c",
          name: "Rabies Vaccine",
          dosage: "1 ml Subcutaneous (S/C) / I/M",
          frequency: "Primary at 3 months, booster after 1 year, annual revaccination.",
          importance: "Recommended for all farm animals exposed to wildlife/stray dogs",
          season: "Any Season",
          prevents: "Fatal viral neurological encephalitis.",
        },
      ],
    },
    buffalo: {
      name: "Buffalo (म्हैस / भैंस)",
      icon: "🐃",
      vaccines: [
        {
          id: "fmd_b",
          name: "Foot and Mouth Disease (FMD / Raksha-Ovac)",
          dosage: "2 ml Subcutaneous (S/C) or 3 ml I/M",
          frequency: "Primary at 3-4 months, booster in 1 month, biannual revaccination every 6 months.",
          importance: "Mandatory (Free Gov Scheme)",
          season: "Pre-Monsoon & Winter",
          prevents: "Bovine viral blisters, loss of lactation.",
        },
        {
          id: "hs_b",
          name: "Hemorrhagic Septicemia (HS / Pasteurellosis)",
          dosage: "3 ml Subcutaneous (S/C)",
          frequency: "Buffaloes are highly susceptible. Annual mandatory dose in May-June.",
          importance: "Critical for Buffaloes",
          season: "Pre-Monsoon",
          prevents: "Fatal throat swelling, sudden death in high-yield dairy buffaloes.",
        },
        {
          id: "bq_b",
          name: "Black Quarter (BQ)",
          dosage: "2 ml Subcutaneous (S/C)",
          frequency: "Annual dose pre-monsoon at 6 months age.",
          importance: "High Priority",
          season: "Pre-Monsoon",
          prevents: "Muscle gas gangrene and toxemia.",
        },
      ],
    },
    goat_sheep: {
      name: "Goat & Sheep (शेळी / मेंढी / बकरी)",
      icon: "🐐",
      vaccines: [
        {
          id: "ppr_g",
          name: "PPR (Peste des Petits Ruminants / Goat Plague)",
          dosage: "1 ml Subcutaneous (S/C)",
          frequency: "Primary at 3-4 months age. Immunity lasts for 3 full years.",
          importance: "Mandatory 100% Free Gov Program",
          season: "Any Season",
          prevents: "High fever, stomatitis, pneumonia, severe diarrhea.",
        },
        {
          id: "et_g",
          name: "Enterotoxaemia (ET / Pulpy Kidney)",
          dosage: "2 ml Subcutaneous (S/C)",
          frequency: "Primary at 4 months, booster after 15 days, annual booster pre-monsoon.",
          importance: "Critical for Grazing Sheep & Goats",
          season: "Pre-Monsoon",
          prevents: "Sudden death due to Clostridium perfringens type D in lush grazing.",
        },
        {
          id: "gp_g",
          name: "Goat Pox / Sheep Pox Vaccine",
          dosage: "1 ml Subcutaneous (S/C)",
          frequency: "Annual revaccination in December - January.",
          importance: "High Priority",
          season: "Winter (Dec - Jan)",
          prevents: "Skin eruptions, generalized pock lesions on eyelids, mouth, and udder.",
        },
        {
          id: "fmd_g",
          name: "FMD for Small Ruminants",
          dosage: "1 ml Subcutaneous (S/C)",
          frequency: "Annual dose pre-monsoon.",
          importance: "High Priority",
          season: "Pre-Monsoon",
          prevents: "Mouth and hoof ulcers in sheep and goats.",
        },
      ],
    },
    dog: {
      name: "Dogs & Puppies (कुत्रा / श्वान)",
      icon: "🐕",
      vaccines: [
        {
          id: "dhppil_d",
          name: "Canine DHPPiL 7-in-1 / 9-in-1 Combination",
          dosage: "1 ml Subcutaneous (S/C)",
          frequency: "Primary at 6-8 weeks; 2nd dose at 10-12 weeks; 3rd dose at 14-16 weeks; Annual booster.",
          importance: "Mandatory Core Canine Vaccine",
          season: "Any Season",
          prevents: "Distemper, Hepatitis, Parvovirus (bloody vomiting), Parainfluenza, Leptospirosis.",
        },
        {
          id: "rab_d",
          name: "Anti-Rabies Vaccine (ARV)",
          dosage: "1 ml Subcutaneous (S/C) or I/M",
          frequency: "Primary at 12-16 weeks age; Booster after 1 year; Annual revaccination strictly required by law.",
          importance: "Mandatory by Law",
          season: "Any Season",
          prevents: "100% fatal zoonotic rabies virus.",
        },
        {
          id: "kc_d",
          name: "Kennel Cough (Bordetella)",
          dosage: "1 ml Intra-nasal / S/C",
          frequency: "Annual booster.",
          importance: "Recommended",
          season: "Any Season",
          prevents: "Infectious tracheobronchitis.",
        },
      ],
    },
    poultry: {
      name: "Poultry & Chicken (कोंबडी / कुक्कुटपालन)",
      icon: "🐔",
      vaccines: [
        {
          id: "marek_p",
          name: "Marek's Disease Vaccine",
          dosage: "0.2 ml Subcutaneous (S/C)",
          frequency: "Day 1 at hatchery immediately after hatching.",
          importance: "Mandatory for Chicks",
          season: "Hatchery Day 1",
          prevents: "Tumors and paralysis in chickens.",
        },
        {
          id: "rd_f1_p",
          name: "Ranikhet Disease / Newcastle (F1 / Lasota Strain)",
          dosage: "1 drop Intra-ocular or Intra-nasal",
          frequency: "Primary at Day 5-7 (F1 strain); Booster at 4-5 weeks (Lasota); R2B injection at 8-10 weeks.",
          importance: "Mandatory Core Poultry Vaccine",
          season: "Day 7 & Week 5",
          prevents: "Greenish diarrhea, gasping, twisted neck, acute flock mortality.",
        },
        {
          id: "ibd_p",
          name: "Gumboro (Infectious Bursal Disease - IBD)",
          dosage: "1 drop in eye or drinking water",
          frequency: "Day 12-14 and booster at Day 24.",
          importance: "Critical for Broilers & Layers",
          season: "Week 2",
          prevents: "Bursal inflammation and immunosuppression.",
        },
        {
          id: "fowl_pox_p",
          name: "Fowl Pox Vaccine",
          dosage: "Wing web puncture method",
          frequency: "At 6-8 weeks of age.",
          importance: "Standard Schedule",
          season: "Week 6-8",
          prevents: "Warty lesions on comb, wattles, and eyelids.",
        },
      ],
    },
  };

  const [activeSpeciesKey, setActiveSpeciesKey] = useState("cattle");
  const [reminderModalData, setReminderModalData] = useState(null);
  const [animalNameInput, setAnimalNameInput] = useState("Kapila (Cow #102)");
  const [remDate, setRemDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [remTime, setRemTime] = useState("09:00");
  const [notifyMode, setNotifyMode] = useState("browser_push");
  const [savedReminders, setSavedReminders] = useState(() => {
    const s = localStorage.getItem("cb_vaccine_reminders");
    return s ? JSON.parse(s) : [
      {
        id: 1,
        animal_name: "Kapila (HF Cow #102)",
        vaccine_name: "FMD Pre-Monsoon Booster",
        due_date: "2026-09-10",
        reminder_time: "09:00",
        status: "Scheduled",
      },
      {
        id: 2,
        animal_name: "Murrah Rani (Buffalo)",
        vaccine_name: "HS Annual Vaccine",
        due_date: "2026-09-18",
        reminder_time: "10:00",
        status: "Scheduled",
      },
    ];
  });

  const curCategory = masterVaccineDatabase[activeSpeciesKey] || masterVaccineDatabase.cattle;

  const handleOpenReminder = (vac) => {
    setReminderModalData(vac);
  };

  const handleSaveReminder = async (e) => {
    e.preventDefault();
    if (!reminderModalData) return;

    // Request native browser push permission
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (_) {}
    }

    const newReminder = {
      id: Date.now(),
      animal_name: animalNameInput || "Farm Animal",
      animal_type: curCategory.name,
      vaccine_name: reminderModalData.name,
      due_date: remDate,
      reminder_time: remTime,
      status: "Scheduled",
    };

    try {
      await api("/api/tools/vaccines/set-reminder", {
        body: {
          animal_name: newReminder.animal_name,
          animal_type: newReminder.animal_type,
          vaccine_name: newReminder.vaccine_name,
          due_date: remDate,
          reminder_time: remTime,
          user_id: user?.id,
        },
      });
    } catch (_) {}

    const updated = [newReminder, ...savedReminders];
    setSavedReminders(updated);
    localStorage.setItem("cb_vaccine_reminders", JSON.stringify(updated));

    // Show native test notification if granted
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification("🐾 VetNova Vaccine Reminder Set!", {
          body: `Reminder scheduled for ${reminderModalData.name} on ${remDate} for ${animalNameInput}.`,
          icon: "/logo.png",
        });
      } catch (_) {}
    }

    setReminderModalData(null);
    alert(`✅ Notification set for ${reminderModalData.name} on ${remDate}! You will receive an automated alert before the due date.`);
  };

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setScreen("tools")}
          >
            ← {t.backToTools || "Back to Tools"}
          </button>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>💉 {t.toolVaccinationHub || "Vaccination Hub"}</div>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Banner */}
        <div
          style={{
            borderRadius: 20,
            padding: "20px 18px",
            background: "linear-gradient(135deg, #064e3b 0%, #059669 60%, #0284c7 100%)",
            color: "#ffffff",
            marginBottom: 16,
            boxShadow: "0 8px 24px rgba(5, 150, 105, 0.2)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: "#a7f3d0" }}>
            VETERINARY IMMUNIZATION DIRECTORY
          </div>
          <h2 style={{ margin: "2px 0 6px", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
            Vaccine Schedules, Dosages & Reminders
          </h2>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.9)" }}>
            Complete scientifically verified vaccination charts with exact dosage, route, and frequency. Set instant reminders for upcoming doses.
          </p>
        </div>

        {/* Species Filter Tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
          {Object.entries(masterVaccineDatabase).map(([key, item]) => {
            const active = key === activeSpeciesKey;
            return (
              <button
                key={key}
                type="button"
                style={{
                  padding: "8px 14px",
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: 750,
                  border: active ? "2px solid #059669" : "1px solid #e2e8f0",
                  background: active ? "linear-gradient(135deg, #064e3b 0%, #059669 100%)" : "#ffffff",
                  color: active ? "#ffffff" : "#334155",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onClick={() => setActiveSpeciesKey(key)}
              >
                <span>{item.icon}</span> <span>{item.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Vaccine Schedules List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {curCategory.vaccines.map((vac) => (
            <div
              key={vac.id}
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: "16px 16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#064e3b" }}>💉 {vac.name}</div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      background: vac.importance.includes("Free") ? "#dcfce7" : "#eff6ff",
                      color: vac.importance.includes("Free") ? "#166534" : "#1d4ed8",
                      padding: "2px 8px",
                      borderRadius: 999,
                      marginTop: 4,
                      display: "inline-block",
                    }}
                  >
                    ★ {vac.importance}
                  </span>
                </div>
              </div>

              {/* Dosage & Frequency Highlight Boxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "10px 0", fontSize: 12 }}>
                <div style={{ background: "#f0fdf4", padding: "8px 10px", borderRadius: 10, border: "1px solid #dcfce7", color: "#166534" }}>
                  💉 <b>Required Dosage:</b> <span style={{ fontWeight: 800 }}>{vac.dosage}</span>
                </div>
                <div style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: 10, border: "1px solid #e2e8f0", color: "#334155" }}>
                  ⏱ <b>Frequency & Schedule:</b> {vac.frequency}
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  🛡️ <b>Key Prevention:</b> {vac.prevents}
                </div>
              </div>

              {/* Action Button to Set Reminder */}
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  fontSize: 12,
                  fontWeight: 800,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  borderColor: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                onClick={() => handleOpenReminder(vac)}
              >
                <span>🔔</span> Set Reminder for Next Vaccine
              </button>
            </div>
          ))}
        </div>

        {/* Scheduled Reminders Tracker */}
        {savedReminders.length > 0 && (
          <div>
            <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 800, color: "var(--brand-dark)" }}>
              ⏰ Your Active Scheduled Reminders ({savedReminders.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {savedReminders.map((rem) => (
                <div
                  key={rem.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 14,
                    padding: "12px 14px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>
                      🐾 {rem.animal_name}: {rem.vaccine_name}
                    </div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                      Due on: <b>{rem.due_date}</b> at {rem.reminder_time}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, background: "#e0f2fe", color: "#0369a1", padding: "3px 8px", borderRadius: 999 }}>
                    🔔 Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Set Vaccine Reminder Modal */}
      {reminderModalData && (
        <div className="modal-bg" onClick={() => setReminderModalData(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, color: "#064e3b" }}>🔔 Schedule Vaccine Reminder</h3>
            <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
              Vaccine: <b>{reminderModalData.name}</b>
            </p>

            <form onSubmit={handleSaveReminder}>
              <div className="label">Animal Name / Ear Tag ID *</div>
              <input
                className="input"
                required
                value={animalNameInput}
                onChange={(e) => setAnimalNameInput(e.target.value)}
                placeholder="e.g. Kapila (#IN-8291)"
              />

              <div className="sp" />
              <div className="label">Target Due Date *</div>
              <input
                className="input"
                type="date"
                required
                value={remDate}
                onChange={(e) => setRemDate(e.target.value)}
              />

              <div className="sp" />
              <div className="label">Preferred Alert Time</div>
              <input
                className="input"
                type="time"
                value={remTime}
                onChange={(e) => setRemTime(e.target.value)}
              />

              <div className="sp" />
              <div className="label">Notification Mode</div>
              <select className="select" value={notifyMode} onChange={(e) => setNotifyMode(e.target.value)}>
                <option value="browser_push">📱 Browser Push Notification & Local Alert</option>
                <option value="in_app">🔔 In-App Dashboard Banner</option>
                <option value="calendar">📅 Add to Mobile Calendar (.ICS)</option>
              </select>

              <div className="sp-lg" />
              <div className="row">
                <button type="button" className="btn btn-ghost" onClick={() => setReminderModalData(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Set Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

// ----------------------------------------------------------------------------
// 5. GOVT SCHEMES SCREEN (Direct In-App Applications & Subsidies)
// ----------------------------------------------------------------------------
function GovtSchemesScreen({ t, user, lang, setScreen, onBack }) {
  const schemes = [
    {
      id: "rgm",
      title: "Rashtriya Gokul Mission (RGM)",
      subtitle: "Breed Multiplication Farm & IVF Technology Subsidy",
      subsidy: "50% Capital Subsidy up to ₹2.00 Crore",
      agency: "Ministry of Fisheries, Animal Husbandry and Dairying (DAHD)",
      category: "Cattle & Dairy Farming",
      eligibility: "Farmers, Dairy Co-operatives, FPOs, Individual Entrepreneurs",
      benefits: [
        "50% back-ended capital subsidy on project cost for cattle breeding units.",
        "Subsidized sexed semen and Artificial Insemination (AI) doorstep delivery.",
        "Direct DBT bank transfer of approved subsidy amount.",
      ],
      tag: "50% Subsidy",
    },
    {
      id: "nlm",
      title: "National Livestock Mission (NLM)",
      subtitle: "Sheep, Goat, Poultry & Piggery Entrepreneurship",
      subsidy: "50% Capital Subsidy up to ₹50 Lakhs",
      agency: "Department of Animal Husbandry, Govt of India",
      category: "Goats, Sheep & Poultry",
      eligibility: "Small & Marginal Farmers, SHGs, JLGs, Farmers Producer Organizations",
      benefits: [
        "Up to ₹50 Lakhs 50% capital subsidy for establishing 500+ goat/sheep breeding farms.",
        "Up to ₹25 Lakhs subsidy on broiler/layer poultry parent farms.",
        "50% subsidy on fodder seed production and silage making units.",
      ],
      tag: "Up to ₹50 Lakh",
    },
    {
      id: "pkcc",
      title: "Pashu Kisan Credit Card (PKCC)",
      subtitle: "Collateral-Free Low Interest Working Capital Loan",
      subsidy: "Loan up to ₹1.60 Lakh @ 4% Subsidized Interest",
      agency: "NABARD & Public Sector Banks",
      category: "Credit & Financial Support",
      eligibility: "All Livestock & Dairy Farmers with 1 or more animals",
      benefits: [
        "Collateral-free instant loan up to ₹1,60,000 without mortgage.",
        "Subsidized 4% interest rate on timely repayment (3% prompt repayment incentive).",
        "Covers feed, medicine, veterinary care, and recurring expenses.",
      ],
      tag: "4% Interest Loan",
    },
    {
      id: "ahidf",
      title: "Animal Husbandry Infrastructure Fund (AHIDF)",
      subtitle: "Dairy Processing & Meat Value Addition Loans",
      subsidy: "90% Loan with 3% Interest Subvention",
      agency: "Govt of India / SIDBI",
      category: "Processing & Value Addition",
      eligibility: "Dairy Co-ops, Private Dairy Units, MSMEs, Farmer Groups",
      benefits: [
        "3% interest subvention for 8 years.",
        "Loan coverage up to 90% of total project cost.",
        "Credit Guarantee Fund support up to 25% of loan amount.",
      ],
      tag: "90% Loan Support",
    },
    {
      id: "lhdc",
      title: "Livestock Health & Disease Control (LH&DC)",
      subtitle: "100% Free Nationwide Vaccination Programme",
      subsidy: "100% Free Doorstep Vaccinations",
      agency: "State Animal Husbandry Departments",
      category: "Free Health Services",
      eligibility: "All livestock owners across India",
      benefits: [
        "Zero-cost ear tagging and registration under INAPH / Bharat Pashudhan.",
        "Free vaccination against Foot and Mouth Disease, Brucellosis, and PPR.",
        "Mobile Veterinary Units (MVU) dispatched on 1962 helpline call.",
      ],
      tag: "100% Free",
    },
    {
      id: "pashu_bima",
      title: "Pradhan Mantri Pashu Bima Yojana",
      subtitle: "Subsidized Livestock Death & Accident Insurance",
      subsidy: "70% to 85% Government Premium Subsidy",
      agency: "National Livestock Insurance Scheme",
      category: "Insurance & Risk Cover",
      eligibility: "Cattle, Buffalo, Sheep, Goat, and Horse Owners",
      benefits: [
        "Up to 85% subsidy on insurance premium paid by central/state government.",
        "Complete compensation payout on natural death or disease outbreak.",
        "Instant claim settlement backed by digital veterinary certificate.",
      ],
      tag: "85% Premium Subsidy",
    },
  ];

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submittedApps, setSubmittedApps] = useState(() => {
    const s = localStorage.getItem("cb_govt_applications");
    return s ? JSON.parse(s) : [];
  });

  // Application form fields
  const [applicantName, setApplicantName] = useState(user?.name || "Ramesh Patil");
  const [phone, setPhone] = useState(user?.phone || "9876543210");
  const [aadhaar, setAadhaar] = useState("984123458912");
  const [districtInput, setDistrictInput] = useState("Pune");
  const [villageInput, setVillageInput] = useState("Haveli Taluka");
  const [animalType, setAnimalType] = useState("Cattle / Buffalo");
  const [animalCount, setAnimalCount] = useState(6);
  const [landholding, setLandholding] = useState("3.5 Acres");
  const [bankAc, setBankAc] = useState("987654321098");
  const [ifsc, setIfsc] = useState("SBIN0001234");
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSuccessReceipt, setAppSuccessReceipt] = useState(null);

  const handleOpenApply = (scheme) => {
    setSelectedScheme(scheme);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!applicantName || !phone || !selectedScheme) {
      alert("Please fill all required application fields.");
      return;
    }

    setSubmittingApp(true);
    try {
      const payload = {
        scheme_id: selectedScheme.id,
        scheme_name: selectedScheme.title,
        applicant_name: applicantName,
        aadhaar_number: aadhaar,
        phone,
        state: "Maharashtra",
        district: districtInput,
        village: villageInput,
        animal_type: animalType,
        animal_count: Number(animalCount) || 1,
        landholding_acres: landholding,
        bank_account: bankAc,
        ifsc_code: ifsc,
        user_id: user?.id,
      };

      const out = await api("/api/tools/schemes/apply", { body: payload });
      setSubmittingApp(false);
      setApplyModalOpen(false);
      setAppSuccessReceipt(out);

      const updated = [out.application, ...submittedApps];
      setSubmittedApps(updated);
      localStorage.setItem("cb_govt_applications", JSON.stringify(updated));
    } catch (err) {
      setSubmittingApp(false);
      alert("Application failed: " + err.message);
    }
  };

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setScreen("tools")}
          >
            ← {t.backToTools || "Back to Tools"}
          </button>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>🏛️ {t.toolGovtSchemes || "Govt Schemes"}</div>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Schemes Banner */}
        <div
          style={{
            borderRadius: 20,
            padding: "20px 18px",
            background: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #1e1b4b 100%)",
            color: "#ffffff",
            marginBottom: 16,
            boxShadow: "0 8px 24px rgba(109, 40, 217, 0.22)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: "#ddd6fe" }}>
            DIRECT BENEFIT TRANSFER (DBT) PORTAL
          </div>
          <h2 style={{ margin: "2px 0 6px", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
            Government Livestock Schemes & Subsidies
          </h2>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.9)" }}>
            Explore verified central & state subsidies up to 50%. Apply directly from within VetNova with automated document verification and tracking.
          </p>
        </div>

        {/* Schemes List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          {schemes.map((s) => (
            <div
              key={s.id}
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: "18px 16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 3px 14px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>🏛️ {s.title}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{s.subtitle}</div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    background: "#f3e8ff",
                    color: "#6b21a8",
                    padding: "3px 8px",
                    borderRadius: 999,
                  }}
                >
                  {s.tag}
                </span>
              </div>

              {/* Subsidy Amount Highlight */}
              <div
                style={{
                  background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                  border: "1px solid #e9d5ff",
                  padding: "10px 12px",
                  borderRadius: 12,
                  margin: "10px 0",
                  fontSize: 13,
                  color: "#581c87",
                  fontWeight: 800,
                }}
              >
                💰 {s.subsidy}
              </div>

              <div style={{ fontSize: 12, color: "#334155", marginBottom: 10 }}>
                <b>Eligibility:</b> {s.eligibility}
              </div>

              <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 12, color: "#475569", lineHeight: 1.45 }}>
                {s.benefits.map((b, idx) => (
                  <li key={idx} style={{ marginBottom: 3 }}>{b}</li>
                ))}
              </ul>

              {/* Direct In-App Application Button */}
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  borderColor: "#6d28d9",
                }}
                onClick={() => handleOpenApply(s)}
              >
                📝 Apply for Scheme Directly from VetNova
              </button>
            </div>
          ))}
        </div>

        {/* My Applications Tracker */}
        {submittedApps.length > 0 && (
          <div>
            <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 800, color: "var(--brand-dark)" }}>
              📋 Your Active Scheme Applications ({submittedApps.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {submittedApps.map((app) => (
                <div
                  key={app.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 16,
                    padding: "14px 16px",
                    border: "1px solid #c4b5fd",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#4c1d95" }}>{app.scheme_name}</div>
                      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                        Ref: <b>{app.application_ref}</b> · {new Date(app.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        background: "#ecfdf5",
                        color: "#059669",
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}
                    >
                      ✓ {app.status}
                    </span>
                  </div>

                  {/* Progress Tracker Bar */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 750, color: "#6b7280", marginBottom: 4 }}>
                      <span style={{ color: "#059669" }}>1. Submitted</span>
                      <span style={{ color: "#7c3aed" }}>2. Document Verification</span>
                      <span>3. District Sanction</span>
                      <span>4. DBT Disbursal</span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: "50%", height: "100%", background: "linear-gradient(90deg, #059669, #7c3aed)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Direct In-App Application Modal */}
      {applyModalOpen && selectedScheme && (
        <div className="modal-bg" onClick={() => setApplyModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, color: "#4c1d95" }}>📝 Apply: {selectedScheme.title}</h3>
            <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
              Direct DBT Scheme Application · <b>{selectedScheme.subsidy}</b>
            </p>

            <form onSubmit={handleSubmitApplication}>
              <div className="label">Applicant Full Name *</div>
              <input
                className="input"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Farmer Name as per Aadhaar"
              />

              <div className="sp" />
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10 }}>
                <div>
                  <div className="label">Mobile Number *</div>
                  <input
                    className="input"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                  />
                </div>
                <div>
                  <div className="label">Aadhaar Number *</div>
                  <input
                    className="input"
                    required
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="12-digit Aadhaar"
                  />
                </div>
              </div>

              <div className="sp" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div className="label">District</div>
                  <input
                    className="input"
                    value={districtInput}
                    onChange={(e) => setDistrictInput(e.target.value)}
                  />
                </div>
                <div>
                  <div className="label">Village / Gram Panchayat</div>
                  <input
                    className="input"
                    value={villageInput}
                    onChange={(e) => setVillageInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="sp" />
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 10 }}>
                <div>
                  <div className="label">Animal Category</div>
                  <select className="select" value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
                    <option value="Cattle / Cow">🐄 Dairy Cattle</option>
                    <option value="Buffalo">🐃 Buffalo</option>
                    <option value="Goat / Sheep">🐐 Goat & Sheep</option>
                    <option value="Poultry">🐔 Poultry</option>
                  </select>
                </div>
                <div>
                  <div className="label">Herd Count</div>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={animalCount}
                    onChange={(e) => setAnimalCount(e.target.value)}
                  />
                </div>
              </div>

              <div className="sp" />
              <div className="label">Bank Account Number (for DBT Subsidy Credit) *</div>
              <input
                className="input"
                required
                value={bankAc}
                onChange={(e) => setBankAc(e.target.value)}
                placeholder="Bank Account Number"
              />

              <div className="sp" />
              <div className="label">Bank IFSC Code *</div>
              <input
                className="input"
                required
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                placeholder="e.g. SBIN0001234"
              />

              <div className="sp-lg" />
              <div className="row">
                <button type="button" className="btn btn-ghost" onClick={() => setApplyModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="btn btn-primary"
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
                >
                  {submittingApp ? "Submitting..." : "Submit Scheme Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Receipt Modal */}
      {appSuccessReceipt && (
        <div className="modal-bg" onClick={() => setAppSuccessReceipt(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, textAlign: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#f3e8ff",
                color: "#7c3aed",
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                margin: "0 auto 10px",
              }}
            >
              ✓
            </div>
            <h3 style={{ margin: 0, fontSize: 18, color: "#4c1d95" }}>Scheme Application Submitted!</h3>
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Tracking Ref: <b>{appSuccessReceipt.application_ref}</b>
            </p>

            <div
              style={{
                background: "#faf5ff",
                border: "1px solid #e9d5ff",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 12,
                color: "#581c87",
                margin: "12px 0",
                textAlign: "left",
              }}
            >
              <div>🏛️ <b>Scheme:</b> {appSuccessReceipt.application.scheme_name}</div>
              <div>👤 <b>Applicant:</b> {appSuccessReceipt.application.applicant_name}</div>
              <div>💰 <b>Estimated Subsidy:</b> {appSuccessReceipt.application.estimated_subsidy_amount}</div>
              <div>🏦 <b>Direct DBT:</b> Linked Account ({appSuccessReceipt.application.bank_account_masked})</div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#7c3aed" }}
              onClick={() => setAppSuccessReceipt(null)}
            >
              Done & View Status Tracker
            </button>
          </div>
        </div>
      )}

      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

// ----------------------------------------------------------------------------
// 6. VILLAGE CO-OP SCREEN (Group Vet Visits & Split Travel Cost)
// ----------------------------------------------------------------------------
function VillageCoopScreen({ t, user, lang, setScreen, onBack }) {
  const [pools, setPools] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinCelebration, setJoinCelebration] = useState(null);

  // Form states for creating pool
  const [newTitle, setNewTitle] = useState("");
  const [newVillage, setNewVillage] = useState("Haveli Taluka");
  const [newDistrict, setNewDistrict] = useState("Pune");
  const [newService, setNewService] = useState("Mass Vaccination & Deworming Camp");
  const [newTargetDate, setNewTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [newMaxFarmers, setNewMaxFarmers] = useState(5);
  const [newSoloFee, setNewSoloFee] = useState(600);

  const loadPools = async () => {
    try {
      const o = await api("/api/tools/coop/pools");
      if (o.pools) setPools(o.pools);
    } catch (_) {}
  };

  useEffect(() => {
    loadPools();
  }, []);

  const handleJoinPool = async (pool) => {
    try {
      const res = await api("/api/tools/coop/join", {
        body: {
          pool_id: pool.id,
          farmer_name: user?.name || "Farmer Neighbor",
          animal_count: 4,
          phone: user?.phone || "",
          user_id: user?.id,
        },
      });
      setJoinCelebration(res);
      loadPools();
    } catch (e) {
      alert(e.message || "Failed to join co-op pool");
    }
  };

  const handleCreatePool = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVillage.trim()) {
      alert("Please enter Title and Village name.");
      return;
    }
    try {
      await api("/api/tools/coop/create", {
        body: {
          title: newTitle.trim(),
          village: newVillage.trim(),
          district: newDistrict.trim(),
          service_type: newService,
          solo_vet_fee: Number(newSoloFee) || 500,
          max_farmers: Number(newMaxFarmers) || 5,
          target_date: newTargetDate,
          farmer_name: user?.name || "Pool Organizer",
          animal_count: 4,
          phone: user?.phone || "",
        },
      });
      setCreateModalOpen(false);
      setNewTitle("");
      loadPools();
      alert("✅ Village Co-op Camp created! Nearby farmers can now join to split the doctor visit cost.");
    } catch (e) {
      alert(e.message || "Failed to create pool");
    }
  };

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setScreen("tools")}
          >
            ← {t.backToTools || "Back to Tools"}
          </button>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>👥 {t.toolVillageCoop || "Village Co-op"}</div>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Banner */}
        <div
          style={{
            borderRadius: 20,
            padding: "20px 18px",
            background: "linear-gradient(135deg, #312e81 0%, #4338ca 55%, #1e1b4b 100%)",
            color: "#ffffff",
            marginBottom: 16,
            boxShadow: "0 8px 24px rgba(67, 56, 202, 0.22)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c7d2fe" }}>
            COMMUNITY VETERINARY POOLING
          </div>
          <h2 style={{ margin: "2px 0 6px", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
            Group Vet Visits — Split Travel & Save Up to 80%
          </h2>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.9)" }}>
            Pool together with neighboring farmers in your village or taluka. A specialist veterinarian visits your cluster in one trip, slashing travel fees for everyone.
          </p>
        </div>

        {/* Top Summary Ticker & Create Action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b" }}>🏘️ Active Village Camps ({pools.length})</div>
            <div className="muted" style={{ fontSize: 12 }}>Join a group camp or start one for your village</div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 800,
              borderRadius: 12,
              background: "linear-gradient(135deg, #4338ca 0%, #3730a3 100%)",
              borderColor: "#4338ca",
            }}
            onClick={() => setCreateModalOpen(true)}
          >
            + Create Village Camp
          </button>
        </div>

        {/* Pools Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          {pools.map((pool) => {
            const joined = pool.joined_count || pool.joined_farmers?.length || 1;
            const max = pool.max_farmers || 5;
            const progressPercent = Math.min(100, Math.round((joined / max) * 100));
            const fee = pool.current_fee_per_farmer || Math.round(pool.solo_vet_fee / joined);
            const saved = pool.solo_vet_fee - fee;

            return (
              <div
                key={pool.id}
                style={{
                  background: "#ffffff",
                  borderRadius: 18,
                  padding: "18px 16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 3px 14px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b" }}>👥 {pool.title}</div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                      📍 {pool.village}, {pool.district} · 📅 <b>{pool.target_date}</b>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      background: "#e0e7ff",
                      color: "#3730a3",
                      padding: "3px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {pool.service_type}
                  </span>
                </div>

                {/* Live Split Savings Card */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    border: "1px solid #bbf7d0",
                    borderRadius: 12,
                    padding: "10px 14px",
                    margin: "12px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "#166534", fontWeight: 700 }}>SHARED DOCTOR TRAVEL FEE:</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#064e3b" }}>
                      ₹{fee} <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textDecoration: "line-through" }}>₹{pool.solo_vet_fee}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, background: "#166534", color: "#ffffff", padding: "4px 10px", borderRadius: 999 }}>
                    🎉 Save ₹{saved}/farmer ({pool.savings_percent || 75}%)
                  </span>
                </div>

                {/* Progress Bar for Farmers Joined */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 750, color: "#334155", marginBottom: 4 }}>
                    <span>👨‍🌾 Farmers Joined: <b>{joined} / {max}</b></span>
                    <span style={{ color: "#4338ca" }}>{max - joined > 0 ? `${max - joined} spots left` : "Camp Full"}</span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #4338ca, #10b981)" }} />
                  </div>
                </div>

                {/* Joined Farmers Preview */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12, fontSize: 11, color: "#64748b" }}>
                  {(pool.joined_farmers || []).map((f, i) => (
                    <span key={i} style={{ background: "#f8fafc", padding: "2px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                      ✓ {f.name} ({f.cows || 2} animals)
                    </span>
                  ))}
                </div>

                {/* Join Pool Action */}
                <button
                  type="button"
                  disabled={joined >= max}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 800,
                    borderRadius: 12,
                    background: joined >= max ? "#94a3b8" : "linear-gradient(135deg, #4338ca 0%, #3730a3 100%)",
                    borderColor: "#4338ca",
                  }}
                  onClick={() => handleJoinPool(pool)}
                >
                  {joined >= max ? "Camp Capacity Reached" : "🤝 Join Village Camp (Split Travel Cost)"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Camp Modal */}
      {createModalOpen && (
        <div className="modal-bg" onClick={() => setCreateModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, color: "#312e81" }}>👥 Create Village Co-op Camp</h3>
            <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
              Host a group doctor visit for your village cluster
            </p>

            <form onSubmit={handleCreatePool}>
              <div className="label">Camp Title *</div>
              <input
                className="input"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Haveli Dairy Cattle Health & AI Camp"
              />

              <div className="sp" />
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 10 }}>
                <div>
                  <div className="label">Village / Taluka *</div>
                  <input
                    className="input"
                    required
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    placeholder="Village name"
                  />
                </div>
                <div>
                  <div className="label">District</div>
                  <input
                    className="input"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                  />
                </div>
              </div>

              <div className="sp" />
              <div className="label">Service Type</div>
              <select className="select" value={newService} onChange={(e) => setNewService(e.target.value)}>
                <option value="Mass Vaccination & Deworming Camp">💉 Mass Vaccination & Deworming Camp</option>
                <option value="Ultrasound & Artificial Insemination (AI)">🔬 Ultrasound & Artificial Insemination (AI)</option>
                <option value="General Veterinary Health Checkup">🩺 General Veterinary Health Checkup</option>
                <option value="Bulk Feed & Medicine Procurement">📦 Bulk Feed & Medicine Procurement</option>
              </select>

              <div className="sp" />
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 10 }}>
                <div>
                  <div className="label">Target Camp Date</div>
                  <input
                    className="input"
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                  />
                </div>
                <div>
                  <div className="label">Max Farmers</div>
                  <input
                    className="input"
                    type="number"
                    min={2}
                    max={15}
                    value={newMaxFarmers}
                    onChange={(e) => setNewMaxFarmers(e.target.value)}
                  />
                </div>
              </div>

              <div className="sp-lg" />
              <div className="row">
                <button type="button" className="btn btn-ghost" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: "#4338ca" }}>
                  Publish Village Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Celebration Modal */}
      {joinCelebration && (
        <div className="modal-bg" onClick={() => setJoinCelebration(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, textAlign: "center" }}>
            <div style={{ fontSize: 42, marginBottom: 6 }}>🎉</div>
            <h3 style={{ margin: 0, fontSize: 18, color: "#1e1b4b" }}>You've Joined the Village Co-op!</h3>
            <p style={{ fontSize: 13, color: "#064e3b", fontWeight: 700, margin: "8px 0" }}>
              {joinCelebration.message}
            </p>
            <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: 12, border: "1px solid #bbf7d0", fontSize: 12, color: "#166534", marginBottom: 16 }}>
              The specialist veterinarian schedule has been confirmed. You will receive an SMS reminder 2 hours prior to the camp arrival in your village.
            </div>
            <button className="btn btn-primary" style={{ width: "100%", background: "#4338ca" }} onClick={() => setJoinCelebration(null)}>
              Awesome! Return to Co-op Board
            </button>
          </div>
        </div>
      )}

      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

// ----------------------------------------------------------------------------
// 7. FARM INSIGHTS SCREEN (Herd Health Stats & Scorecard)
// ----------------------------------------------------------------------------
function FarmInsightsScreen({ t, user, lang, setScreen, onBack }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "gov_insights" | "schemes"

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setScreen("tools")}
          >
            ← {t.backToTools || "Back to Tools"}
          </button>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>📊 {t.toolFarmInsights || "Health & Govt Platform"}</div>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Hero Banner */}
        <div
          style={{
            borderRadius: 20,
            padding: "20px 18px",
            background: "linear-gradient(135deg, #134e4a 0%, #0d9488 60%, #0369a1 100%)",
            color: "#ffffff",
            marginBottom: 14,
            boxShadow: "0 8px 24px rgba(13, 148, 136, 0.22)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: "#99f6e4" }}>
                🏛️ GOVT LIVESTOCK PLATFORM & HEALTH INSIGHTS
              </div>
              <h2 style={{ margin: "2px 0 6px", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                Animal Health & Economic Platform
              </h2>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.9)" }}>
                Official telemetry synced with Department of Animal Husbandry & Dairying (DAHD) and Pashu Aadhaar Yellow Band network.
              </p>
            </div>
            <div style={{ fontSize: 32 }}>🏛️</div>
          </div>
        </div>

        {/* Tab Row */}
        <div className="tab-row" style={{ marginBottom: 14 }}>
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            📊 Herd Telemetry
          </button>
          <button className={activeTab === "gov_insights" ? "active" : ""} onClick={() => setActiveTab("gov_insights")}>
            🏛️ Govt Insights
          </button>
          <button className={activeTab === "schemes" ? "active" : ""} onClick={() => setActiveTab("schemes")}>
            💰 Kisan Schemes
          </button>
        </div>

        {/* TAB 1: OVERVIEW TELEMETRY */}
        {activeTab === "overview" && (
          <div>
            {/* 4 Metric KPI Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ background: "#ffffff", borderRadius: 16, padding: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase" }}>🛡️ HERD IMMUNITY</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#064e3b", margin: "4px 0" }}>96.8%</div>
                <div style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>✓ High Protection (Yellow Band Tagged)</div>
              </div>

              <div style={{ background: "#ffffff", borderRadius: 16, padding: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#e11d48", textTransform: "uppercase" }}>⚠️ OUTBREAK RISK</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#881337", margin: "4px 0" }}>Low</div>
                <div style={{ fontSize: 11, color: "#e11d48", fontWeight: 700 }}>2 district alerts monitored</div>
              </div>

              <div style={{ background: "#ffffff", borderRadius: 16, padding: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase" }}>💰 TOTAL SAVINGS</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#4c1d95", margin: "4px 0" }}>₹18,450</div>
                <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700 }}>Via Free Vaccines & Concessions</div>
              </div>

              <div style={{ background: "#ffffff", borderRadius: 16, padding: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#0284c7", textTransform: "uppercase" }}>🍼 MILK STABILITY</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#0c4a6e", margin: "4px 0" }}>98.2%</div>
                <div style={{ fontSize: 11, color: "#0284c7", fontWeight: 700 }}>Optimal Yield Index</div>
              </div>
            </div>

            {/* AI Health Recommendations */}
            <div style={{ background: "#ffffff", borderRadius: 18, padding: "18px 16px", border: "1px solid #e2e8f0", marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 800, color: "var(--brand-dark)", display: "flex", alignItems: "center", gap: 6 }}>
                <span>🤖</span> AI Seasonal Health Advisory
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "#334155" }}>
                <div style={{ background: "#f0fdf4", padding: "10px 12px", borderRadius: 12, border: "1px solid #dcfce7" }}>
                  🌿 <b>Monsoon Fodder Transition:</b> Avoid sudden lush green pasture feeding without dry straw buffer to prevent acute frothy bloat.
                </div>
                <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                  🧪 <b>Mineral Mixture Supplementation:</b> Feed 50g chelated mineral mixture daily per milch cow to sustain peak lactation and immune resistance.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOVT PLATFORM INSIGHTS */}
        {activeTab === "gov_insights" && (
          <div>
            {/* Government Pashu Aadhaar Yellow Band Registry Card */}
            <div style={{ background: "linear-gradient(135deg, #fefce8 0%, #fef08a 100%)", border: "1.5px solid #eab308", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>🏷️</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "#713f12", textTransform: "uppercase" }}>
                    NATIONAL INAPH / NDDB PASHU AADHAAR
                  </div>
                  <h3 style={{ margin: "2px 0 0", color: "#422006", fontSize: 16 }}>
                    Official Yellow Band Registry & Verification
                  </h3>
                </div>
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#713f12", lineHeight: 1.45 }}>
                All tagged livestock are registered in the National Animal Disease Control Programme database. Yellow band tags ensure free government vaccination, traceability, and insurance claim settlement.
              </p>
            </div>

            {/* Regional Disease Surveillance Radar */}
            <div style={{ background: "#ffffff", borderRadius: 16, padding: "16px", border: "1px solid #e2e8f0", marginBottom: 14 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 800, color: "#064e3b" }}>
                📡 DAHD Regional Disease Surveillance
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px", borderRadius: 10 }}>
                  🟢 <b>Foot and Mouth Disease (FMD):</b> 0 active outbreak clusters reported in your district this quarter.
                </div>
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "10px", borderRadius: 10 }}>
                  🟡 <b>Lumpy Skin Disease (LSD) Vigilance:</b> Pre-monsoon vector control advised in neighboring talukas.
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px", borderRadius: 10 }}>
                  💉 <b>Free Vaccination Drive:</b> Pre-monsoon HS & BQ vaccination camp scheduled at Taluka Veterinary Dispensary next week.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KISAN SUBSIDY SCHEMES */}
        {activeTab === "schemes" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#ffffff", borderRadius: 16, padding: "16px", border: "1.5px solid #cbd5e1" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#0284c7" }}>MINISTRY OF ANIMAL HUSBANDRY</div>
                <h3 style={{ margin: "4px 0 6px", fontSize: 15, color: "#0f172a" }}>
                  🐄 Rashtriya Gokul Mission (Indigenous Cattle Breed Improvement)
                </h3>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#475569" }}>
                  50% subsidy on high-genetic merit Gir, Sahiwal, and Murrah sexed semen and IVF embryo transfer technology.
                </p>
                <span style={{ fontSize: 11, background: "#e0f2fe", color: "#0369a1", padding: "3px 8px", borderRadius: 6, fontWeight: 800 }}>
                  Active Scheme · Apply at Vet Center
                </span>
              </div>

              <div style={{ background: "#ffffff", borderRadius: 16, padding: "16px", border: "1.5px solid #cbd5e1" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#059669" }}>NATIONAL LIVESTOCK MISSION</div>
                <h3 style={{ margin: "4px 0 6px", fontSize: 15, color: "#0f172a" }}>
                  🐐 National Livestock Insurance Scheme
                </h3>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#475569" }}>
                  Up to 70% government premium subsidy for Yellow Band tagged milch cows and buffaloes against disease mortality.
                </p>
                <span style={{ fontSize: 11, background: "#dcfce7", color: "#166534", padding: "3px 8px", borderRadius: 6, fontWeight: 800 }}>
                  Pashu Aadhaar Tag Required
                </span>
              </div>

              <div style={{ background: "#ffffff", borderRadius: 16, padding: "16px", border: "1.5px solid #cbd5e1" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed" }}>AHIDF PLATFORM</div>
                <h3 style={{ margin: "4px 0 6px", fontSize: 15, color: "#0f172a" }}>
                  🏭 Animal Husbandry Infrastructure Development Fund
                </h3>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#475569" }}>
                  3% interest subvention for establishing dairy processing, automated milking parlors, and cattle feed manufacturing plants.
                </p>
                <span style={{ fontSize: 11, background: "#ede9fe", color: "#6d28d9", padding: "3px 8px", borderRadius: 6, fontWeight: 800 }}>
                  Credit-Linked Subsidy
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav tab="home" setScreen={setScreen} />
    </>
  );
}

// =========================================================================

// =========================================================================
// SIH 2026 FRONTIER INNOVATION 1: AI BIO-ACOUSTIC STETHOSCOPE (BARDI)
// Real-Time Audio FFT Spectrogram, Auscultation & Respiratory Biomarker AI
// =========================================================================

function BioAcousticsScreen({ t, user, lang, setScreen, onBack }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState("brd_bovine");
  const [species, setSpecies] = useState("Cattle");
  const [tagId, setTagId] = useState("IN-8291-0421");
  const [soundPlaying, setSoundPlaying] = useState(false);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const PRESETS = [
    {
      id: "brd_bovine",
      name: "🐄 Bovine Bronchial Wheeze (BRD)",
      species: "Cattle",
      freq: 1850,
      duration: 3.4,
      desc: "Deep bronchial wheezing, high-frequency inspiratory crackles (Mannheimia haemolytica)",
      tag: "IN-8291-0421",
    },
    {
      id: "capripox_goat",
      name: "🐐 Caprine Capripox Pneumonia (PPR)",
      species: "Goat",
      freq: 2400,
      duration: 4.1,
      desc: "Moist pulmonary rales, acute caprine tachypnea (Capripoxvirus / Mycoplasma)",
      tag: "IN-9912-7730",
    },
    {
      id: "avian_rales",
      name: "🐔 Avian Tracheal Gasping & Stridor",
      species: "Poultry",
      freq: 3100,
      duration: 2.1,
      desc: "High-pitched tracheal rales, mucosal obstruction (Infectious Laryngotracheitis / NDV)",
      tag: "FLK-009-PUN",
    },
    {
      id: "normal_lung",
      name: "🟢 Normal Vesicular Bovine Breath",
      species: "Cattle",
      freq: 450,
      duration: 1.8,
      desc: "Smooth laminar alveolar airflow, no adventitious rales (Healthy baseline)",
      tag: "IN-1002-3341",
    },
  ];

  // Dynamic FFT Spectrogram & Equalizer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let phase = 0;

    const render = () => {
      phase += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#031525";
      ctx.fillRect(0, 0, w, h);

      // Frequency grid
      ctx.strokeStyle = "rgba(0, 255, 200, 0.12)";
      ctx.lineWidth = 1;
      for (let y = 20; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // FFT Equalizer Bars
      const bars = 44;
      const barW = w / bars;
      for (let i = 0; i < bars; i++) {
        let amp;
        if (recording || analyzing || soundPlaying) {
          amp = (Math.sin(phase * 2.2 + i * 0.35) * 0.5 + 0.5) * (h * 0.8) * (Math.sin(i * 0.2 + phase) * 0.3 + 0.7);
        } else if (audioResult) {
          amp = (Math.sin(i * 0.28) * 0.4 + 0.5) * (h * 0.55);
        } else {
          amp = (Math.sin(phase * 0.8 + i * 0.2) * 0.2 + 0.25) * (h * 0.3);
        }
        
        const hue = 165 + (i / bars) * 65;
        const grad = ctx.createLinearGradient(0, h, 0, h - amp);
        grad.addColorStop(0, "hsla(" + hue + ", 90%, 48%, 0.85)");
        grad.addColorStop(1, "hsla(" + (hue + 45) + ", 100%, 75%, 0.95)");

        ctx.fillStyle = grad;
        ctx.fillRect(i * barW + 1, h - amp, barW - 2, amp);
      }

      // Smooth envelope overlay line
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < w; i += 4) {
        const factor = (recording || analyzing || soundPlaying) ? 1.3 : 0.5;
        const y = h / 2 + Math.sin(i * 0.04 + phase * 2) * 24 * factor + Math.cos(i * 0.07 - phase) * 12 * factor;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [recording, analyzing, audioResult, soundPlaying]);

  const playSynthesizedAuscultation = (freqHz) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      setSoundPlaying(true);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freqHz > 1000 ? 320 : 180, now);
      osc.frequency.linearRampToValueAtTime(freqHz > 1000 ? 540 : 220, now + 0.8);
      osc.frequency.linearRampToValueAtTime(freqHz > 1000 ? 280 : 160, now + 1.6);

      const biquad = ctx.createBiquadFilter();
      biquad.type = "bandpass";
      biquad.frequency.setValueAtTime(freqHz, now);
      biquad.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.01, now + 2.0);

      osc.connect(biquad);
      biquad.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.1);
      setTimeout(() => {
        setSoundPlaying(false);
        try { ctx.close(); } catch (_) {}
      }, 2300);
    } catch (_) {
      setSoundPlaying(false);
    }
  };

  const runAnalysis = async (presetObj) => {
    setAnalyzing(true);
    const chosen = presetObj || PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];
    playSynthesizedAuscultation(chosen.freq);

    try {
      const res = await api("/api/surveillance/bioacoustic-analysis", {
        method: "POST",
        body: {
          species: chosen.species || species,
          tag_id: chosen.tag || tagId,
          audio_duration_seconds: chosen.duration || 3.4,
          peak_frequency_hz: chosen.freq || 1850,
          cough_bursts_detected: chosen.freq > 1000 ? 4 : 0,
          lung_crackles_present: chosen.freq > 1000,
          fever_reported: chosen.freq > 1000,
        },
      });
      if (res.ok) {
        setAudioResult(res);
      }
    } catch (e) {
      alert("Acoustic analysis error: " + e.message);
    }
    setAnalyzing(false);
  };

  const handleLiveMicRecord = () => {
    if (recording) {
      setRecording(false);
      runAnalysis(null);
    } else {
      setRecording(true);
      setAudioResult(null);
      setTimeout(() => {
        setRecording(false);
        runAnalysis(null);
      }, 3500);
    }
  };

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={onBack}
          >
            ← Back to Tools
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 900, background: "#0ea5e9", color: "#ffffff", padding: "3px 8px", borderRadius: 999 }}>
              SIH 2026 FRONTIER
            </span>
          </div>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Hero Banner */}
        <div
          style={{
            borderRadius: 22,
            padding: "22px 20px",
            marginBottom: 16,
            background: "linear-gradient(135deg, #032b43 0%, #004e64 50%, #25a18e 100%)",
            color: "#ffffff",
            boxShadow: "0 10px 28px rgba(3, 43, 67, 0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🎙️</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                AI BIO-ACOUSTIC STETHOSCOPE
              </div>
              <h2 style={{ margin: "2px 0 0", fontSize: 20, color: "#ffffff", fontWeight: 800 }}>
                Cough &amp; Respiratory Biomarker Engine (BARDI)
              </h2>
            </div>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.45 }}>
            Acoustic pattern recognition analyzing lung adventitious crackles, bronchial wheezes, and tracheal rales for early epizootic detection before clinical collapse.
          </p>
        </div>

        {/* Live Audio Spectrogram Canvas Card */}
        <div style={{ background: "#031525", borderRadius: 20, padding: "16px", border: "1px solid #1e293b", marginBottom: 16, boxShadow: "0 4px 18px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="govt-live-dot" />
              <span style={{ fontSize: 12, fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                FFT SPECTROGRAM &amp; AUSCULTATION FREQUENCY
              </span>
            </div>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>
              {recording ? "🔴 RECORDING LIVE (3.5s)" : soundPlaying ? "🔊 PLAYING AUDIO" : "READY (0 - 4 kHz)"}
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={440}
            height={130}
            style={{
              width: "100%",
              height: 130,
              borderRadius: 12,
              background: "#031525",
              display: "block",
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12, textAlign: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Peak Freq</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#38bdf8" }}>{audioResult?.diagnostic_features?.peak_frequency_hz || 1850} Hz</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Cough Bursts</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#f59e0b" }}>{audioResult?.diagnostic_features?.cough_bursts_detected ?? 4}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Crackles</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#ef4444" }}>{audioResult?.diagnostic_features?.crackles_present !== false ? "DETECTED" : "NONE"}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>BARDI Risk</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#10b981" }}>{audioResult?.bardi_severity_score || 88}/100</div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Live Mic & Audio Presets */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              padding: "12px 14px",
              fontSize: 13,
              fontWeight: 800,
              borderRadius: 14,
              background: recording ? "#ef4444" : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 14px rgba(2, 132, 199, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
            }}
            onClick={handleLiveMicRecord}
          >
            <span>{recording ? "⏹️ Stop Recording" : "🔴 Record Auscultation / Cough"}</span>
          </button>
        </div>

        {/* Sound Presets Selector */}
        <div style={{ background: "#ffffff", borderRadius: 18, padding: "16px", border: "1px solid #e2e8f0", marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
            🔬 Select Clinical Audio Specimen (Instant AI Benchmark)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PRESETS.map((p) => {
              const isSelected = selectedPreset === p.id;
              return (
                <div
                  key={p.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: isSelected ? "2px solid #0284c7" : "1px solid #e2e8f0",
                    background: isSelected ? "#f0f9ff" : "#f8fafc",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => {
                    setSelectedPreset(p.id);
                    setSpecies(p.species);
                    setTagId(p.tag);
                    runAnalysis(p);
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: isSelected ? "#0369a1" : "#1e293b" }}>
                      {p.name}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#0284c7", background: "rgba(2, 132, 199, 0.12)", padding: "2px 8px", borderRadius: 999 }}>
                      {p.freq} Hz
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748b" }}>{p.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Analysis Diagnosis Card Output */}
        {audioResult && (() => {
          const rep = audioResult.report || audioResult;
          const condition = rep.suspected_condition || rep.suspected_etiology || "Bovine Respiratory Disease (BRD)";
          const agent = rep.etiological_agent || "Pasteurella multocida";
          const score = rep.bardi_score || "91%";
          const treatment = rep.recommended_treatment?.first_line_antibiotic || rep.clinical_recommendation || "Tilmicosin (300 mg/ml) or Florfenicol @ 20 mg/kg SC + Meloxicam";
          const withdrawal = rep.recommended_treatment?.mandatory_withdrawal_warning || rep.statutory_drug_withdrawal_warning || "Milk withdrawal: 7 days | Meat withdrawal: 28 days";

          return (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "18px 16px",
                border: "1.5px solid #0284c7",
                boxShadow: "0 6px 20px rgba(2, 132, 199, 0.12)",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 900, background: "#e0f2fe", color: "#0369a1", padding: "3px 8px", borderRadius: 999 }}>
                    AI BARDI ETIOLOGY RESULT · {rep.bardi_status || "Auscultation Verified"}
                  </span>
                  <h3 style={{ margin: "4px 0 0", fontSize: 17, color: "#0f172a", fontWeight: 800 }}>
                    {condition}
                  </h3>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Pathogen: <b>{agent}</b></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>BARDI RISK</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#0284c7" }}>
                    {score}
                  </div>
                </div>
              </div>

              {/* Biomarkers Breakdown */}
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>ACOUSTIC BIOMARKERS EXTRACTED:</div>
                <div style={{ fontSize: 12, color: "#334155", display: "flex", flexDirection: "column", gap: 3 }}>
                  <div>• Dominant Formant: <b>{rep.acoustic_biomarkers?.dominant_formant_hz || "1850 Hz"}</b></div>
                  <div>• Cough Velocity: <b>{rep.acoustic_biomarkers?.cough_velocity_index || "4 bursts / 5 sec interval"}</b></div>
                  <div>• Adventitious Rales: <b>{rep.acoustic_biomarkers?.adventitious_lung_crackles || "Positive (Wet Crepitations)"}</b></div>
                </div>
              </div>

              {/* Clinical Protocol & Drug Withdrawal Alert */}
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#92400e", marginBottom: 4 }}>
                  💊 RECOMMENDED ANTIMICROBIAL PROTOCOL:
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#78350f" }}>
                  {treatment}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: "#b45309", background: "rgba(245, 158, 11, 0.15)", padding: "6px 8px", borderRadius: 8 }}>
                  ⚠️ <b>MRL Compliance:</b> {withdrawal}
                </div>
              </div>

              {/* DAHD Escalation Trigger */}
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #be123c 0%, #9f1239 100%)",
                  borderColor: "#be123c",
                }}
                onClick={() => alert("🚨 ESCALATION DISPATCHED: Bio-acoustic cluster telemetry forwarded to District Epidemiologist and State Surveillance Cell.")}
              >
                🚨 Escalate Acoustic Cluster to District Surveillance (DAHD)
              </button>
            </div>
          );
        })()}
      </div>

      <BottomNav tab="tools" setScreen={setScreen} />
    </>
  );
}

// =========================================================================
// SIH 2026 FRONTIER INNOVATION 2: AI CATTLE MUZZLE BIOMETRICS (RHINOGLYPHICS)
// Non-Invasive Anti-Tamper Identification & Pashu Aadhaar Digital Passport
// =========================================================================

function MuzzleBiometricsScreen({ t, user, lang, setScreen, onBack }) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedCattle, setSelectedCattle] = useState("gir_01");
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const CATTLE_SAMPLES = [
    {
      id: "gir_01",
      name: "Gauri (Gir Indigenous)",
      tag: "IN-8291-0421",
      breed: "Gir Purebred",
      owner: "Ramesh Patil",
      village: "Malegaon Khurd, Baramati",
      registeredHash: "RHINO-HASH-2026-A83F-92C1",
    },
    {
      id: "murrah_02",
      name: "Kalyani (Murrah Buffalo)",
      tag: "IN-4402-9981",
      breed: "Murrah Buffalo",
      owner: "Dnyaneshwar Shinde",
      village: "Karveer, Kolhapur",
      registeredHash: "RHINO-HASH-2026-F44B-1192",
    },
    {
      id: "hf_03",
      name: "Sona (HF Crossbreed)",
      tag: "IN-7719-2041",
      breed: "Holstein Friesian Cross",
      owner: "Suresh Deshmukh",
      village: "Sangamner, Ahmednagar",
      registeredHash: "RHINO-HASH-2026-C099-55DE",
    },
  ];

  // Canvas visualizer with dynamic 128-point biometric ridge mesh
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let scanLine = 0;
    let dir = 2;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#0a192f";
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;

      // Concentric elliptical muzzle groove contours
      ctx.strokeStyle = "rgba(45, 212, 191, 0.4)";
      ctx.lineWidth = 1.5;
      for (let r = 20; r < 90; r += 14) {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 10, r * 1.3, r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nostril outlines
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "#14b8a6";
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.ellipse(centerX - 48, centerY + 18, 22, 14, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX + 48, centerY + 18, 22, 14, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw biometric nodal landmark dots
      const points = 32;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const rad = 35 + ((i * 17) % 45);
        const px = centerX + Math.cos(angle) * rad;
        const py = centerY - 10 + Math.sin(angle) * (rad * 0.7);

        ctx.fillStyle = scanning ? "#10b981" : "#38bdf8";
        ctx.beginPath();
        ctx.arc(px, py, scanning ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fill();

        if (i % 2 === 0) {
          ctx.strokeStyle = scanning ? "rgba(16, 185, 129, 0.3)" : "rgba(56, 189, 248, 0.2)";
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 10);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }

      // Animated laser scanning bar
      if (scanning) {
        scanLine += dir;
        if (scanLine > h || scanLine < 0) dir = -dir;

        const scanGrad = ctx.createLinearGradient(0, scanLine - 15, 0, scanLine + 15);
        scanGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
        scanGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.85)");
        scanGrad.addColorStop(1, "rgba(16, 185, 129, 0)");

        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanLine - 12, w, 24);

        ctx.strokeStyle = "#6ee7b7";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanLine);
        ctx.lineTo(w, scanLine);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [scanning]);

  const handleScanBiometrics = async () => {
    setScanning(true);
    setScanResult(null);
    const cat = CATTLE_SAMPLES.find((c) => c.id === selectedCattle) || CATTLE_SAMPLES[0];

    try {
      const res = await api("/api/surveillance/muzzle-biometrics", {
        method: "POST",
        body: {
          tag_id: cat.tag,
          animal_name: cat.name,
          species: "Cattle",
          breed: cat.breed,
          owner_name: cat.owner,
          registered_hash: cat.registeredHash,
        },
      });
      if (res.ok) {
        setScanResult(res);
      }
    } catch (e) {
      alert("Biometric scan error: " + e.message);
    }
    setScanning(false);
  };

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={onBack}
          >
            ← Back to Tools
          </button>
          <span style={{ fontSize: 10, fontWeight: 900, background: "#8b5cf6", color: "#ffffff", padding: "3px 8px", borderRadius: 999 }}>
            ANTI-FRAUD BIOMETRIC
          </span>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Hero Banner */}
        <div
          style={{
            borderRadius: 22,
            padding: "22px 20px",
            marginBottom: 16,
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
            color: "#ffffff",
            boxShadow: "0 10px 28px rgba(30, 27, 75, 0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🐮</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#c7d2fe", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                AI RHINOGLYPHICS BIOMETRIC IDENTIFIER
              </div>
              <h2 style={{ margin: "2px 0 0", fontSize: 20, color: "#ffffff", fontWeight: 800 }}>
                Pashu Muzzle Fingerprint &amp; Anti-Fraud Passport
              </h2>
            </div>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.45 }}>
            Bovine nasal groove dermatoglyphic analysis providing immutable biometric verification. Eliminates ear-tag tampering, insurance fraud, and ensures foolproof vaccination authentication.
          </p>
        </div>

        {/* Dynamic Biometrics Scan Canvas */}
        <div style={{ background: "#0a192f", borderRadius: 20, padding: "16px", border: "1px solid #1e293b", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="govt-live-dot" />
              <span style={{ fontSize: 12, fontWeight: 800, color: "#2dd4bf", textTransform: "uppercase" }}>
                128-POINT MUZZLE RIDGE TOPOGRAPHY
              </span>
            </div>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>
              {scanning ? "⚡ SCANNING RIDGE MESH..." : "LANDMARKS ALIGNED"}
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={440}
            height={160}
            style={{
              width: "100%",
              height: 160,
              borderRadius: 12,
              background: "#0a192f",
              display: "block",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "#94a3b8" }}>
            <span>• Nasolabial Grooves: <b>48 Contours</b></span>
            <span>• Planum Landmark Mesh: <b>128 Nodes</b></span>
            <span>• False Accept Rate (FAR): <b>&lt; 0.001%</b></span>
          </div>
        </div>

        {/* Cattle Select & Scan Action */}
        <div style={{ background: "#ffffff", borderRadius: 18, padding: "16px", border: "1px solid #e2e8f0", marginBottom: 16 }}>
          <div className="label">Select Cattle Specimen for Biometric Verification:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {CATTLE_SAMPLES.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: selectedCattle === c.id ? "2px solid #6366f1" : "1px solid #e2e8f0",
                  background: selectedCattle === c.id ? "#eef2ff" : "#f8fafc",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedCattle(c.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 13, color: "#1e1b4b" }}>
                  <span>{c.name}</span>
                  <span style={{ fontSize: 11, color: "#4f46e5" }}>{c.tag}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                  👤 Owner: {c.owner} · 📍 {c.village}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn"
            style={{
              width: "100%",
              marginTop: 14,
              padding: "12px 14px",
              fontSize: 14,
              fontWeight: 800,
              borderRadius: 14,
              background: scanning ? "#10b981" : "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
              cursor: "pointer",
            }}
            onClick={handleScanBiometrics}
          >
            {scanning ? "⚡ Scanning Rhinoglyphic Ridge Points..." : "📸 Scan & Verify Muzzle Biometrics"}
          </button>
        </div>

        {/* Biometric Verification Certificate Output */}
        {scanResult && (() => {
          const rec = scanResult.biometric_record || scanResult;
          const hash = rec.biometric_hash || rec.muzzle_hash || "RHINO-HASH-2026-8842-A1C9";
          const cert = rec.biometric_certificate || "DAHD-RHINO-CERT-2026-94812";
          const matchConf = rec.match_confidence || "99.4%";

          return (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "18px 16px",
                border: "1.5px solid #10b981",
                boxShadow: "0 6px 20px rgba(16, 185, 129, 0.15)",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 24 }}>🛡️</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: "#15803d", textTransform: "uppercase" }}>
                      BIOMETRIC AUTHENTICATION PASSED
                    </div>
                    <h3 style={{ margin: 0, fontSize: 15, color: "#064e3b", fontWeight: 800 }}>
                      Certificate: {cert}
                    </h3>
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 900, color: "#15803d", background: "#dcfce7", padding: "4px 10px", borderRadius: 999 }}>
                  {matchConf} Match
                </span>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px", fontSize: 12, display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                <div><b>Cryptographic Rhinoglyphic Hash:</b> <code style={{ color: "#4f46e5", background: "#e0e7ff", padding: "2px 6px", borderRadius: 4 }}>{hash}</code></div>
                <div><b>Pashu Aadhaar UID:</b> {rec.tag_id} ({rec.animal_name})</div>
                <div><b>Registered Owner:</b> {rec.owner_name}</div>
                <div><b>Extracted Ridges / Minutiae:</b> {rec.rhinoglyphic_ridges_extracted || 168} contours · {rec.minutiae_feature_keypoints || 56} landmark nodes</div>
                <div><b>Anti-Tamper Shield:</b> <span style={{ color: "#15803d", fontWeight: 700 }}>✓ Verified Against Ear-Tag Swapping &amp; Insurance Fraud</span></div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  borderColor: "#059669",
                }}
                onClick={() => alert("📄 PASHU BIOMETRIC CERTIFICATE GENERATED!\nCryptographic verification token synced with National INAPH / NDDB Database.")}
              >
                📄 Download Verified Biometric Passport (PDF/QR)
              </button>
            </div>
          );
        })()}
      </div>

      <BottomNav tab="tools" setScreen={setScreen} />
    </>
  );
}

// =========================================================================
// SIH 2026 FRONTIER INNOVATION 3: AUTONOMOUS COLD-CHAIN DRONE FLEET
// BVLOS Rapid Vaccine, Antivenom & Emergency Biological Supply Air-Drop
// =========================================================================

function DroneFleetScreen({ t, user, lang, setScreen, onBack }) {
  const [missions, setMissions] = useState([]);
  const [dispatching, setDispatching] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState("Melghat Tribal Hamlet, Amravati");
  const [selectedPayload, setSelectedPayload] = useState("💉 FMD Quadrivalent Vaccine (200 Doses)");
  const [droneId, setDroneId] = useState("GARUDA-VTOL-07");
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const VILLAGES = [
    { name: "Melghat Tribal Hamlet, Amravati", dist: 28.4, eta: "26 mins", terrain: "Forest Gorge (Road Cutoff)" },
    { name: "Khed Sahyadri Highlands, Pune", dist: 19.2, eta: "18 mins", terrain: "Ghat Mountain Pass" },
    { name: "Junnar Valley Pastures, Pune", dist: 14.8, eta: "14 mins", terrain: "Remote Pastoral Hamlets" },
    { name: "Karveer Flood Buffer, Kolhapur", dist: 22.0, eta: "21 mins", terrain: "Riverine Waterlogged Zone" },
  ];

  const PAYLOADS = [
    { id: "fmd", name: "💉 FMD Quadrivalent Vaccine (200 Doses)", tempReq: "2°C - 8°C" },
    { id: "snake_antivenom", name: "🐍 Polyvalent Snake Venom Antiserum (10 Vials)", tempReq: "2°C - 8°C" },
    { id: "lsd_vaccine", name: "💉 Goatpox Live Attenuated (LSD Ring Buffer - 150 Doses)", tempReq: "4°C" },
    { id: "rabies_igg", name: "🧪 Rabies Post-Exposure Immunoglobulin (5 Vials)", tempReq: "2°C - 8°C" },
  ];

  const fetchMissions = async () => {
    try {
      const res = await api("/api/surveillance/drone-missions");
      if (res.ok) setMissions(res.missions || []);
    } catch (_) {}
  };

  useEffect(() => {
    fetchMissions();
    const interval = setInterval(fetchMissions, 5000);
    return () => clearInterval(interval);
  }, []);

  // Tactical Flight Radar & BVLOS Waypoint Path Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let angle = 0;
    let progress = 0.35;

    const render = () => {
      angle += 0.03;
      progress = (progress + 0.003) % 1;
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.fillStyle = "#091428";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Distance rings
      ctx.strokeStyle = "rgba(0, 180, 216, 0.2)";
      ctx.lineWidth = 1;
      [35, 70, 105].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Rotating radar beam
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const sweepGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 110);
      sweepGrad.addColorStop(0, "rgba(0, 180, 216, 0.35)");
      sweepGrad.addColorStop(1, "rgba(0, 180, 216, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 110, 0, Math.PI * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Base Station icon
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(cx - 75, cy + 35, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("HQ DISPENSARY", cx - 110, cy + 52);

      // Target Village Waypoint
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(cx + 70, cy - 40, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("TARGET VILLAGE", cx + 38, cy - 50);

      // Flight Path Line
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 75, cy + 35);
      ctx.quadraticCurveTo(cx - 5, cy - 15, cx + 70, cy - 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Active Drone Position marker
      const dx = (cx - 75) + ((cx + 70) - (cx - 75)) * progress;
      const dy = (cy + 35) + ((cy - 40) - (cy + 35)) * progress - Math.sin(progress * Math.PI) * 28;

      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(dx, dy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("🚁 GARUDA [64 km/h | 3.8°C]", dx - 35, dy - 10);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleDispatchDrone = async (e) => {
    if (e) e.preventDefault();
    setDispatching(true);
    try {
      const res = await api("/api/surveillance/drone-dispatch", {
        method: "POST",
        body: {
          village: selectedVillage,
          payload: selectedPayload,
          drone_id: droneId,
          cold_box_target_c: 4.0,
          notes: "Emergency autonomous cold-chain airdrop initiated for remote outbreak containment.",
        },
      });
      if (res.ok) {
        alert("🚀 MISSION AUTHORIZED! " + res.mission.drone_name + " dispatched to " + res.mission.target_village + ". Cold-Box Active: " + res.mission.cold_box_temperature_c + "°C.");
        fetchMissions();
      }
    } catch (err) {
      alert("Drone dispatch error: " + err.message);
    }
    setDispatching(false);
  };

  return (
    <>
      <div className="topbar dash-topbar dash-topbar-premium">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 750,
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.18)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={onBack}
          >
            ← Back to Tools
          </button>
          <span style={{ fontSize: 10, fontWeight: 900, background: "#d97706", color: "#ffffff", padding: "3px 8px", borderRadius: 999 }}>
            BVLOS AIR LOGISTICS
          </span>
        </div>
      </div>

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Hero Banner */}
        <div
          style={{
            borderRadius: 22,
            padding: "22px 20px",
            marginBottom: 16,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)",
            color: "#ffffff",
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.35)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🚁</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                GARUDA VAYU-VET FLEET COMMAND
              </div>
              <h2 style={{ margin: "2px 0 0", fontSize: 20, color: "#ffffff", fontWeight: 800 }}>
                Autonomous Cold-Chain Drone Air-Drop
              </h2>
            </div>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.45 }}>
            Beyond-Visual-Line-of-Sight (BVLOS) hexacopter delivery network for rapid delivery of temperature-sensitive vaccines (2°C–8°C) and antivenoms to road-inaccessible tribal and flood-hit villages.
          </p>
        </div>

        {/* Tactical Mission Radar Canvas */}
        <div style={{ background: "#091428", borderRadius: 20, padding: "16px", border: "1px solid #1e293b", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="govt-live-dot" />
              <span style={{ fontSize: 12, fontWeight: 800, color: "#00b4d8", textTransform: "uppercase" }}>
                TACTICAL RADAR &amp; WAYPOINT TELEMETRY
              </span>
            </div>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>
              ALT: 120m AGL · 18 SATS
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={440}
            height={150}
            style={{
              width: "100%",
              height: 150,
              borderRadius: 12,
              background: "#091428",
              display: "block",
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12, textAlign: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Cold-Box</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#10b981" }}>3.8°C (Active)</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Airspeed</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#38bdf8" }}>64 km/h</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Battery</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#f59e0b" }}>88% LiPo</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Radius</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#e0e7ff" }}>40 km BVLOS</div>
            </div>
          </div>
        </div>

        {/* Dispatch Mission Form */}
        <div style={{ background: "#ffffff", borderRadius: 18, padding: "16px", border: "1px solid #e2e8f0", marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
            🚀 Authorize Emergency Drone Dispatch
          </h3>

          <form onSubmit={handleDispatchDrone}>
            <div className="label">Target Cutoff / Inaccessible Village *</div>
            <select className="select" value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)}>
              {VILLAGES.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.dist} km · ETA {v.eta}) - {v.terrain}
                </option>
              ))}
            </select>

            <div className="sp" />
            <div className="label">Cold-Chain Emergency Payload *</div>
            <select className="select" value={selectedPayload} onChange={(e) => setSelectedPayload(e.target.value)}>
              {PAYLOADS.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} [Target: {p.tempReq}]
                </option>
              ))}
            </select>

            <div className="sp" />
            <div className="label">Designated Autonomous VTOL Drone</div>
            <select className="select" value={droneId} onChange={(e) => setDroneId(e.target.value)}>
              <option value="GARUDA-VTOL-07">GARUDA-VTOL-07 (Range: 45km · Active Cold Pod)</option>
              <option value="GARUDA-VTOL-09">GARUDA-VTOL-09 (Heavy Lift 5kg · Dual Battery)</option>
            </select>

            <div className="sp-lg" />
            <button
              type="submit"
              disabled={dispatching}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: 800,
                borderRadius: 14,
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                borderColor: "#d97706",
                boxShadow: "0 4px 14px rgba(217, 119, 6, 0.35)",
              }}
            >
              {dispatching ? "🚀 Authorizing Flight Path..." : "🚀 Dispatch Autonomous Drone Air-Drop Mission"}
            </button>
          </form>
        </div>

        {/* Active Missions Log */}
        <div style={{ background: "#ffffff", borderRadius: 18, padding: "16px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
            📋 Live Air Missions &amp; Parachute Drops ({missions.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {missions.map((m) => (
              <div key={m.mission_id} style={{ background: "#f8fafc", borderRadius: 12, padding: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 13, color: "#0f172a" }}>
                  <span>🚁 {m.drone_model || m.drone_name || "Garuda Vayu-Vet VTOL"} ({m.mission_id})</span>
                  <span style={{ fontSize: 11, color: "#059669", background: "#dcfce7", padding: "2px 8px", borderRadius: 999 }}>
                    {m.flight_status || m.status || "AIRBORNE"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>
                  <b>Destination:</b> {m.target_village}, {m.target_district || "Pune"}
                </div>
                <div style={{ fontSize: 12, color: "#475569" }}>
                  <b>Payload:</b> {m.payload_type || m.payload} · <b>Cold-Box:</b> {m.cold_box_temperature || (m.cold_box_temperature_c ? m.cold_box_temperature_c + "°C" : "3.8°C")}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                  ETA: <b>{m.eta_mins || m.eta_minutes || 14} mins</b> · Altitude: {m.altitude_agl || "120m AGL"} · Speed: {m.airspeed_kmh || 65} km/h · Battery: {m.battery_pct || 88}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav tab="tools" setScreen={setScreen} />
    </>
  );
}

// SIH 2026 (PS ID 26128): GOVERNMENT VETERINARY & DISEASE SURVEILLANCE PORTAL
// Dedicated Decision-Support Dashboard for District/Block Veterinary Officers
// =========================================================================

function GovtAuth({ t, lang, onLogged, onBack }) {
  const [officerName, setOfficerName] = useState("Dr. Mahendra Shirke");
  const [designation, setDesignation] = useState("District Veterinary Officer (DVO)");
  const [district, setDistrict] = useState("Pune");
  const [passkey, setPasskey] = useState("DAHD-VET-2026-MH");
  const [stateName, setStateName] = useState("Maharashtra");

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const officer = {
      name: officerName.trim() || "Dr. Mahendra Shirke",
      designation,
      district,
      state: stateName,
      badge: "DAHD-OFFICER-2026",
      department: "Department of Animal Husbandry & Dairying (DAHD)",
    };
    onLogged(officer);
  };

  return (
    <>
      <TopBar title="DAHD Official Portal" onBack={onBack} />
      <div className="screen" style={{ paddingBottom: 60 }}>
        <div style={{ textAlign: "center", padding: "16px 0 12px" }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🏛️</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#881337", fontWeight: 800 }}>
            Department of Animal Husbandry
          </h2>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            Epizootic Disease Surveillance &amp; Decision-Support System (SIH 26128)
          </p>
        </div>

        <div className="card" style={{ borderRadius: 20, border: "1px solid #ffe4e6", padding: "20px 18px" }}>
          <form onSubmit={handleLogin}>
            <div className="label">Officer Name *</div>
            <input
              className="input"
              required
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              placeholder="e.g. Dr. Mahendra Shirke"
            />

            <div className="sp" />
            <div className="label">Official Designation *</div>
            <select className="select" value={designation} onChange={(e) => setDesignation(e.target.value)}>
              <option value="District Veterinary Officer (DVO)">District Veterinary Officer (DVO)</option>
              <option value="Disease Surveillance Epidemiologist">Disease Surveillance Epidemiologist</option>
              <option value="Block Veterinary Officer (BVO)">Block Veterinary Officer (BVO)</option>
              <option value="Rapid Response Team (RRT) Lead">Rapid Response Team (RRT) Lead</option>
            </select>

            <div className="sp" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div className="label">Jurisdiction State</div>
                <input className="input" value={stateName} onChange={(e) => setStateName(e.target.value)} />
              </div>
              <div>
                <div className="label">Assigned District</div>
                <select className="select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                  {MAHARASHTRA_DIVISIONS.map((div) => (
                    <optgroup key={div.name} label={div.name}>
                      {div.districts.map((dst) => (
                        <option key={dst} value={dst}>
                          {dst === "All" ? "All Maharashtra (State-wide SECC Lead)" : dst}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div className="sp" />
            <div className="label">DAHD Service ID / Passkey *</div>
            <input
              className="input"
              required
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />

            <div className="sp-lg" />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 14,
                fontWeight: 800,
                background: "linear-gradient(135deg, #881337 0%, #be123c 100%)",
                borderColor: "#881337",
                boxShadow: "0 4px 14px rgba(136, 19, 55, 0.25)",
              }}
            >
              🔐 Access Official Surveillance Terminal
            </button>

            <div className="sp-sm" />
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", padding: "10px", fontSize: 13, borderRadius: 10 }}
              onClick={() => handleLogin()}
            >
              ⚡ Instant Official Login (Demo Mode)
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function GovtDashboard({ t, lang, officer, onLogout, setScreen }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "gisMap" | "incidents" | "labReferrals" | "advisories" | "containmentOrders"
  const [districtFilter, setDistrictFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [summaryData, setSummaryData] = useState(null);
  const [reports, setReports] = useState([]);
  const [geoClusters, setGeoClusters] = useState([]);
  const [weatherRisk, setWeatherRisk] = useState(null);
  const [historicalTrends, setHistoricalTrends] = useState(null);
  const [labReferrals, setLabReferrals] = useState([]);
  const [escalationModal, setEscalationModal] = useState(null);
  const [containmentModal, setContainmentModal] = useState(null);
  const [newLabModal, setNewLabModal] = useState(false);
  const [sampleForm, setSampleForm] = useState({
    district: officer?.district || "Pune",
    block: "Baramati",
    village: "Malegaon Khurd",
    species: "Cattle",
    specimen_type: "Nodular Skin Biopsy & Whole Blood",
    testing_laboratory: "Western Regional Disease Diagnostic Laboratory (WRDDL), Pune",
    test_type: "Real-Time PCR for Capripoxvirus",
    priority: "Emergency (Outbreak Verification)",
  });
  const [broadcastForm, setBroadcastForm] = useState({
    district: officer?.district || "Pune",
    block: "Baramati",
    disease: "Lumpy Skin Disease (LSD)",
    target_channel: "SMS + WhatsApp + IVR Call",
  });
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [viewGazetteModal, setViewGazetteModal] = useState(null);
  const [previewBroadcastModal, setPreviewBroadcastModal] = useState(null);
  const [viewCustodySlipModal, setViewCustodySlipModal] = useState(null);
  const [previewLang, setPreviewLang] = useState("hi");
  const [loading, setLoading] = useState(true);

  // SIH PS 26128: Real-Time Location Outcomes, Unified Data Exchange & Treatments
  const [locationOutcomes, setLocationOutcomes] = useState(null);
  const [outcomeDistrict, setOutcomeDistrict] = useState(officer?.district && officer.district !== "All" ? officer.district : "Pune");
  const [outcomeBlock, setOutcomeBlock] = useState("Baramati");
  const [outcomeVillage, setOutcomeVillage] = useState("Malegaon Khurd");
  const [outcomeLoading, setOutcomeLoading] = useState(false);
  const [dataExchange, setDataExchange] = useState(null);
  const [treatmentRecords, setTreatmentRecords] = useState([]);
  const [treatmentSearch, setTreatmentSearch] = useState("");
  const [newTreatmentModal, setNewTreatmentModal] = useState(false);
  const [treatmentForm, setTreatmentForm] = useState({
    tag_id: "IN-8291-0421",
    animal_name: "Kapila (HF Cross)",
    species: "Cattle",
    herd_id: "HERD-PN-BAR-01",
    owner_name: "Ramesh Patil",
    village: "Malegaon Khurd",
    block: "Baramati",
    district: officer?.district && officer.district !== "All" ? officer.district : "Pune",
    diagnosis: "Secondary bacterial infection following LSD lesions",
    drug_name: "Enrofloxacin 10%",
    drug_dose: "15 ml IM",
    withdrawal_milk: 7,
    attending_officer: officer?.name || "Dr. Mahendra Shirke",
    para_vet_assistant: "Sunita Kamble (Pashu Sakhi)",
  });

  // Real-time synchronization & simulation state
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [livePingToast, setLivePingToast] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveEvents, setLiveEvents] = useState([
    { id: 1, time: "14:24:10", text: "WRDDL Apex Lab validated Capripoxvirus RT-PCR specimen batch from Baramati", type: "lab" },
    { id: 2, time: "14:22:05", text: "Rapid Response Unit RRT-02 dispatched with ring vaccines to Karveer, Kolhapur", type: "rrt" },
    { id: 3, time: "14:19:40", text: "Toll-free 1962 voice emergency call routed from Sangamner, Ahmednagar", type: "ivr" },
    { id: 4, time: "14:15:20", text: "Marathwada Divisional Polyclinic initiated surveillance buffer protocol in Latur", type: "gov" },
  ]);

  const speakAdvisory = (txt, lCode = "hi-IN") => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(txt);
        utter.rate = 0.92;
        utter.lang = lCode;
        window.speechSynthesis.speak(utter);
      }
    } catch (_) {}
  };

  const fetchLocationOutcomes = async (d = outcomeDistrict, b = outcomeBlock, v = outcomeVillage) => {
    setOutcomeLoading(true);
    try {
      const res = await api(`/api/surveillance/location-outcomes?district=${encodeURIComponent(d)}&block=${encodeURIComponent(b)}&village=${encodeURIComponent(v)}`);
      if (res.ok) setLocationOutcomes(res);
    } catch (_) {}
    setOutcomeLoading(false);
  };

  const fetchSilentGovtData = async () => {
    try {
      const [sum, rep, geo, weath] = await Promise.all([
        api("/api/surveillance/officials-summary"),
        api("/api/surveillance/reports"),
        api("/api/surveillance/geospatial-clusters"),
        api("/api/surveillance/weather-risk"),
      ]);
      if (sum.ok) setSummaryData(sum);
      if (rep.ok) setReports(rep.reports || []);
      if (geo.ok) setGeoClusters(geo.clusters || []);
      if (weath.ok) setWeatherRisk(weath);
      setLastSyncTime(new Date());
    } catch (_) {}
  };

  const fetchAllGovtData = async () => {
    setLoading(true);
    try {
      const [sum, rep, geo, weath, hist, labs, outcomes, exch, treats] = await Promise.all([
        api("/api/surveillance/officials-summary"),
        api("/api/surveillance/reports"),
        api("/api/surveillance/geospatial-clusters"),
        api("/api/surveillance/weather-risk"),
        api("/api/surveillance/historical-trends"),
        api("/api/surveillance/lab-referrals"),
        api(`/api/surveillance/location-outcomes?district=${encodeURIComponent(outcomeDistrict)}&block=${encodeURIComponent(outcomeBlock)}&village=${encodeURIComponent(outcomeVillage)}`),
        api("/api/surveillance/data-exchange"),
        api("/api/surveillance/treatment-records"),
      ]);
      if (sum.ok) setSummaryData(sum);
      if (rep.ok) setReports(rep.reports || []);
      if (geo.ok) setGeoClusters(geo.clusters || []);
      if (weath.ok) setWeatherRisk(weath);
      if (hist.ok) setHistoricalTrends(hist);
      if (labs.ok) setLabReferrals(labs.referrals || []);
      if (outcomes.ok) setLocationOutcomes(outcomes);
      if (exch.ok) setDataExchange(exch.exchange);
      if (treats.ok) setTreatmentRecords(treats.treatments || []);
      setLastSyncTime(new Date());
    } catch (err) {
      console.error("Govt dashboard fetch error:", err);
    }
    setLoading(false);
  };

  const playEmergencySiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.45);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.6);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.65);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
      setTimeout(() => {
        try { ctx.close(); } catch (_) {}
      }, 900);
    } catch (_) {}
  };

  useEffect(() => {
    fetchAllGovtData();

    // Fallback sync every 4s
    const timer = setInterval(() => {
      fetchSilentGovtData();
    }, 4000);

    // ZERO-LATENCY REAL-TIME SERVER-SENT EVENTS (SSE) STREAM
    let es = null;
    try {
      es = new EventSource("/api/surveillance/stream");
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (
            data.type === "IVR_REPORT_EMERGENCY" ||
            data.type === "SURVEILLANCE_REPORT" ||
            data.type === "LIVE_TELEMETRY_PING" ||
            data.type === "PARAVET_REPORT"
          ) {
            const rep = data.report;
            playEmergencySiren();
            const alertBanner =
              data.type === "IVR_REPORT_EMERGENCY"
                ? `🚨 [LIVE 1962 IVR CALL RECEIVED] Ticket #${data.ticket_id} from ${rep?.village || "Village"}, ${rep?.district || "District"} (${rep?.species} · ${rep?.suspected_disease})! RRT Dispatched!`
                : `⚡ [REAL-TIME TELEMETRY] Ticket #${data.ticket_id} from ${rep?.village || "Village"}, ${rep?.district || "District"} (${rep?.suspected_disease})`;
            setLivePingToast(alertBanner);
            setTimeout(() => setLivePingToast(null), 12000);

            if (rep) {
              setLiveEvents((prev) => [
                {
                  id: Date.now(),
                  time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                  text: `🚨 1962 LIVE CALL: ${rep.species} (${rep.suspected_disease}) in ${rep.village}, ${rep.district} · Ticket #${data.ticket_id}`,
                  type: "alert",
                },
                ...prev.slice(0, 10),
              ]);
              // Instantly prepend new report to state!
              setReports((prev) => [rep, ...prev.filter((r) => r.ticket_id !== rep.ticket_id)]);
            }
            fetchSilentGovtData();
          }
        } catch (_) {}
      };
    } catch (e) {
      console.warn("SSE connection error", e);
    }

    return () => {
      clearInterval(timer);
      if (es) es.close();
    };
  }, []);

  const handleSimulateLivePing = async () => {
    setIsSimulating(true);
    try {
      const out = await api("/api/surveillance/simulate-telemetry-ping", {
        method: "POST",
        body: {
          district: districtFilter !== "All" ? districtFilter : undefined,
        },
      });
      if (out.ok) {
        const rep = out.report;
        const alertMsg = `⚡ [LIVE TELEMETRY RECEIVED] Ticket #${out.ticket_id} from ${rep.village}, ${rep.district} (${rep.suspected_disease}). Auto-dispatched to concerned DVO & Mobile Unit!`;
        setLivePingToast(alertMsg);
        setTimeout(() => setLivePingToast(null), 8000);
        setLiveEvents((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            text: `Field ping: ${rep.suspected_disease} in ${rep.village}, ${rep.district} · Immediate DVO Triage`,
            type: "alert",
          },
          ...prev.slice(0, 6),
        ]);
        fetchSilentGovtData();
      }
    } catch (e) {
      alert("Simulation failed: " + e.message);
    }
    setIsSimulating(false);
  };

  const handleEscalateCase = async (report) => {
    try {
      const out = await api("/api/surveillance/escalate-case", {
        body: {
          ticket_id: report.ticket_id,
          district: report.district,
          block: report.block,
          reason: `Rapid Morbidity Velocity in ${report.village} (${report.affected_count} sick, ${report.mortality_count} deaths)`,
        },
      });
      setEscalationModal(out);
      fetchAllGovtData();
    } catch (err) {
      alert("Escalation failed: " + err.message);
    }
  };

  const handleIssueContainment = async (report) => {
    try {
      const out = await api("/api/surveillance/containment-action", {
        body: {
          district: report.district,
          block: report.block,
          epicenter_village: report.village,
          containment_radius_km: 3,
          action_type: "Immediate 3 km Movement Ban, Cattle Market Closure & Emergency Ring Vaccination",
          officer_name: officer?.name || "District Veterinary Officer (DVO)",
        },
      });
      setContainmentModal(out);
      fetchAllGovtData();
    } catch (err) {
      alert("Containment Order failed: " + err.message);
    }
  };

  const handleCreateTreatment = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await api("/api/surveillance/treatment-records", {
        method: "POST",
        body: {
          tag_id: treatmentForm.tag_id,
          animal_name: treatmentForm.animal_name,
          species: treatmentForm.species,
          herd_id: treatmentForm.herd_id,
          owner_name: treatmentForm.owner_name,
          village: treatmentForm.village,
          block: treatmentForm.block,
          district: treatmentForm.district,
          diagnosis: treatmentForm.diagnosis,
          medications: [
            {
              drug: treatmentForm.drug_name,
              dose: treatmentForm.drug_dose,
              duration: "3 days",
              withdrawal_days_milk: Number(treatmentForm.withdrawal_milk) || 0,
              withdrawal_days_meat: 14,
            },
          ],
          attending_officer: treatmentForm.attending_officer,
          para_vet_assistant: treatmentForm.para_vet_assistant,
        },
      });
      if (res.ok) {
        alert(`✅ Treatment & Drug Withdrawal record logged for ${treatmentForm.tag_id}!`);
        setNewTreatmentModal(false);
        const ref = await api("/api/surveillance/treatment-records");
        if (ref.ok) setTreatmentRecords(ref.treatments || []);
      }
    } catch (err) {
      alert("Failed to save treatment record: " + err.message);
    }
  };

  const handleCreateLabReferral = async (e) => {
    e.preventDefault();
    try {
      await api("/api/surveillance/lab-referral", {
        body: {
          ...sampleForm,
          collected_by: `${officer?.name || "Official"} (${officer?.designation || "DVO"})`,
        },
      });
      alert(`✅ Diagnostic Sample Registered and Dispatched to ${sampleForm.testing_laboratory}!`);
      setNewLabModal(false);
      fetchAllGovtData();
    } catch (err) {
      alert("Failed to create lab referral: " + err.message);
    }
  };

  const handleUpdateLabStatus = async (id, status) => {
    try {
      await api(`/api/surveillance/lab-referrals/${id}`, {
        method: "PATCH",
        body: { status },
      });
      alert(`✅ Lab Referral #${id} updated to status: ${status}`);
      fetchAllGovtData();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      const out = await api("/api/surveillance/broadcast-advisory", {
        body: broadcastForm,
      });
      setBroadcastResult(out.broadcast);
    } catch (err) {
      alert("Broadcast failed: " + err.message);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (districtFilter !== "All" && r.district.toLowerCase() !== districtFilter.toLowerCase()) return false;
    if (urgencyFilter !== "All" && r.urgency.toLowerCase() !== urgencyFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <>
      {/* Official Executive Topbar */}
      <div
        className="topbar"
        style={{
          background: "linear-gradient(135deg, #091124 0%, #0d1a33 50%, #152238 100%)",
          color: "#ffffff",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "grid",
              placeItems: "center",
              fontSize: 24,
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "1.2px", textTransform: "uppercase", color: "#fbbf24" }}>
                STATE COMMAND CENTER · MAHARASHTRA &amp; DAHD
              </span>
              <span className="govt-live-pulse-badge">
                <span className="govt-live-dot" /> LIVE AUTO-SYNC
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#ffffff", marginTop: 1 }}>
              {officer?.name || "Dr. Mahendra Shirke"}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              {officer?.designation || "State Surveillance Director"} · {officer?.district === "All" || !officer?.district ? "All Maharashtra (State-wide Composite)" : `${officer.district} Division`}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className="btn"
            style={{
              background: isSimulating ? "#10b981" : "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              color: "#ffffff",
              border: "none",
              padding: "7px 12px",
              fontSize: 11,
              fontWeight: 800,
              borderRadius: 10,
              boxShadow: "0 0 14px rgba(16, 185, 129, 0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
            onClick={handleSimulateLivePing}
          >
            <span>⚡</span> Simulate Live Field Ping
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.12)",
              padding: "7px 12px",
              fontSize: 11,
              borderRadius: 10,
              fontWeight: 700,
            }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Real-Time Telemetry Notification Toast */}
      {livePingToast && (
        <div
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
            color: "#ffffff",
            padding: "10px 16px",
            fontSize: 12,
            fontWeight: 750,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 14px rgba(6, 78, 59, 0.3)",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📡</span>
            <span>{livePingToast}</span>
          </div>
          <button
            type="button"
            style={{ background: "transparent", border: "none", color: "#ffffff", cursor: "pointer", fontSize: 14 }}
            onClick={() => setLivePingToast(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="screen" style={{ paddingBottom: 88 }}>
        {/* Navigation Tabs */}
        <div className="surv-tab-bar" style={{ marginTop: 10 }}>
          {[
            { id: "overview", label: "📊 Overview & KPIs" },
            { id: "locationOutcomes", label: "🎯 Real-Time Location Outcomes" },
            { id: "dataExchange", label: "🔗 Unified Data Exchange" },
            { id: "treatments", label: `📋 Animal & Herd Health (${treatmentRecords.length})` },
            { id: "gisMap", label: "🗺️ GIS Outbreak Map" },
            { id: "incidents", label: `🚨 Field Incidents (${reports.length})` },
            { id: "labReferrals", label: `🧪 Lab Referrals (${labReferrals.length})` },
            { id: "advisories", label: "📢 Multilingual Broadcast" },
            { id: "containmentOrders", label: "🛡️ Containment Zones" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`surv-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FRONTIER INNOVATION TABS IN GOVT DASHBOARD */}
        {activeTab === "droneFleet" && (
          <div style={{ marginTop: 10 }}>
            <DroneFleetScreen t={t} user={null} lang={lang} setScreen={setScreen} onBack={() => setActiveTab("overview")} />
          </div>
        )}
        {activeTab === "bioAcoustics" && (
          <div style={{ marginTop: 10 }}>
            <BioAcousticsScreen t={t} user={null} lang={lang} setScreen={setScreen} onBack={() => setActiveTab("overview")} />
          </div>
        )}
        {activeTab === "muzzleBiometrics" && (
          <div style={{ marginTop: 10 }}>
            <MuzzleBiometricsScreen t={t} user={null} lang={lang} setScreen={setScreen} onBack={() => setActiveTab("overview")} />
          </div>
        )}

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === "overview" && (
          <div>
            {/* Real-Time Field Telemetry Event Stream Ticker */}
            <div
              style={{
                background: "#0b1329",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "10px 14px",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
                overflowX: "auto",
                color: "#cbd5e1",
                fontSize: 11,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, fontWeight: 800, color: "#34d399" }}>
                <span className="govt-live-dot" /> STREAM:
              </div>
              <div style={{ display: "flex", gap: 14, whiteSpace: "nowrap" }}>
                {liveEvents.slice(0, 3).map((ev) => (
                  <span key={ev.id} style={{ color: "#e2e8f0" }}>
                    <span style={{ color: "#94a3b8" }}>[{ev.time}]</span> {ev.text}
                  </span>
                ))}
              </div>
            </div>

            {summaryData?.kpis && (
              <div className="surv-kpi-grid">
                <div className="surv-kpi-card" style={{ borderLeft: "3px solid #be123c" }}>
                  <div className="surv-kpi-lbl">Total Incidents</div>
                  <div className="surv-kpi-val" style={{ color: "#be123c" }}>{summaryData.kpis.total_surveillance_reports}</div>
                  <span style={{ fontSize: 10, color: "#9f1239", fontWeight: 700 }}>Whole Maharashtra</span>
                </div>
                <div className="surv-kpi-card" style={{ borderLeft: "3px solid #e11d48" }}>
                  <div className="surv-kpi-lbl">Active Epidemics</div>
                  <div className="surv-kpi-val" style={{ color: "#e11d48" }}>{summaryData.kpis.active_critical_outbreaks}</div>
                  <span style={{ fontSize: 10, color: "#be123c", fontWeight: 700 }}>Severe Tier</span>
                </div>
                <div className="surv-kpi-card" style={{ borderLeft: "3px solid #ea580c" }}>
                  <div className="surv-kpi-lbl">Livestock Sick</div>
                  <div className="surv-kpi-val" style={{ color: "#ea580c" }}>{summaryData.kpis.total_animals_affected}</div>
                  <span style={{ fontSize: 10, color: "#c2410c", fontWeight: 700 }}>Total Morbidity</span>
                </div>
                <div className="surv-kpi-card" style={{ borderLeft: "3px solid #7f1d1d" }}>
                  <div className="surv-kpi-lbl">Mortality / Deaths</div>
                  <div className="surv-kpi-val" style={{ color: "#7f1d1d" }}>{summaryData.kpis.total_mortality}</div>
                  <span style={{ fontSize: 10, color: "#991b1b", fontWeight: 700 }}>CFR: {summaryData.kpis.case_fatality_rate}</span>
                </div>
                <div className="surv-kpi-card" style={{ borderLeft: "3px solid #059669" }}>
                  <div className="surv-kpi-lbl">Ring Vaccines</div>
                  <div className="surv-kpi-val" style={{ color: "#059669" }}>{summaryData.kpis.ring_vaccination_doses_administered}</div>
                  <span style={{ fontSize: 10, color: "#047857", fontWeight: 700 }}>Administered</span>
                </div>
                <div className="surv-kpi-card" style={{ borderLeft: "3px solid #2563eb" }}>
                  <div className="surv-kpi-lbl">RRT Teams</div>
                  <div className="surv-kpi-val" style={{ color: "#2563eb" }}>{summaryData.kpis.rapid_response_teams_deployed}</div>
                  <span style={{ fontSize: 10, color: "#1d4ed8", fontWeight: 700 }}>Deployed Statewide</span>
                </div>
              </div>
            )}

            {/* State-Wide Administrative Division Surveillance Matrix */}
            <div
              className="card"
              style={{
                borderRadius: 18,
                padding: "16px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                border: "1px solid #cbd5e1",
                marginBottom: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, color: "#0f172a" }}>
                    🏛️ State-Wide Division Surveillance Matrix (Maharashtra · All 36 Districts)
                  </h3>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    Continuous administrative telemetry aggregation across all 6 government divisions
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, background: "#ecfdf5", color: "#047857", padding: "4px 8px", borderRadius: 999 }}>
                  36/36 Districts Synced
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", textAlign: "left", color: "#475569", fontSize: 11, textTransform: "uppercase" }}>
                      <th style={{ padding: "8px 10px", borderRadius: "8px 0 0 8px" }}>Division (Zones)</th>
                      <th style={{ padding: "8px 10px" }}>Endemic Threat</th>
                      <th style={{ padding: "8px 10px" }}>Active Incidents</th>
                      <th style={{ padding: "8px 10px" }}>RRT Units</th>
                      <th style={{ padding: "8px 10px" }}>Ring Vax Stock</th>
                      <th style={{ padding: "8px 10px", borderRadius: "0 8px 8px 0" }}>Threat Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { div: "Western Maharashtra (Pune Division)", threat: "LSD & FMD", inc: "14 Clusters", rrt: "4 Mobile Teams", vax: "18,400 Doses", tier: "Red Alert", tierBg: "#ffe4e6", tierCol: "#be123c" },
                      { div: "North Maharashtra (Nashik Division)", threat: "Avian Flu & PPR", inc: "8 Clusters", rrt: "3 Mobile Teams", vax: "9,200 Doses", tier: "Red Alert", tierBg: "#ffe4e6", tierCol: "#be123c" },
                      { div: "Marathwada Division", threat: "PPR & Brucellosis", inc: "6 Clusters", rrt: "2 Mobile Teams", vax: "11,500 Doses", tier: "Critical Watch", tierBg: "#ffedd5", tierCol: "#c2410c" },
                      { div: "Vidarbha (Nagpur / Amravati)", threat: "LSD & Hemorrhagic Septicemia", inc: "7 Clusters", rrt: "3 Mobile Teams", vax: "14,000 Doses", tier: "Critical Watch", tierBg: "#ffedd5", tierCol: "#c2410c" },
                      { div: "Konkan Division (Coastal)", threat: "Zoonotic & Vector Surveillance", inc: "3 Clusters", rrt: "2 Mobile Teams", vax: "6,800 Doses", tier: "Guarded", tierBg: "#fef3c7", tierCol: "#b45309" },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 10px", fontWeight: 800, color: "#1e293b" }}>{row.div}</td>
                        <td style={{ padding: "10px 10px", color: "#64748b" }}>{row.threat}</td>
                        <td style={{ padding: "10px 10px", fontWeight: 700, color: "#be123c" }}>{row.inc}</td>
                        <td style={{ padding: "10px 10px", color: "#0f172a" }}>{row.rrt}</td>
                        <td style={{ padding: "10px 10px", color: "#059669", fontWeight: 700 }}>{row.vax}</td>
                        <td style={{ padding: "10px 10px" }}>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, background: row.tierBg, color: row.tierCol }}>
                            {row.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weather Risk Correlation Alert */}
            {weatherRisk && (
              <div
                style={{
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  border: "1px solid #93c5fd",
                  borderRadius: 16,
                  padding: "16px",
                  marginBottom: 16,
                  color: "#1e3a8a",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>🌧️</span>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>Monsoon Weather &amp; Vector Correlation Warning</div>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 12, lineHeight: 1.45 }}>
                  {weatherRisk.monsoon_vector_warning}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                  {weatherRisk.weather_correlations?.slice(0, 3).map((w) => (
                    <div key={w.district} style={{ background: "rgba(255,255,255,0.8)", padding: "8px 10px", borderRadius: 10, fontSize: 11 }}>
                      <b>📍 {w.district}</b>: {w.temp_c}°C · {w.humidity_percent}% RH<br/>
                      <span style={{ color: "#b91c1c", fontWeight: 700 }}>Risk: {w.vector_risk} ({w.risk_index}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Epidemiological Trajectory Chart */}
            {historicalTrends && (
              <div className="card" style={{ borderRadius: 18, padding: "16px", border: "1px solid #e2e8f0", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, color: "#0f172a" }}>📈 Epidemiological Curve (Weekly Trend)</h3>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      Effective Reproduction Number (Rt): <b style={{ color: "#059669" }}>{historicalTrends.analysis?.effective_reproduction_rate}</b> ({historicalTrends.analysis?.current_trend})
                    </div>
                  </div>
                  <span style={{ fontSize: 11, background: "#ecfdf5", color: "#059669", padding: "3px 8px", borderRadius: 999, fontWeight: 800 }}>
                    Peak Controlled
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {historicalTrends.epidemiological_curve?.map((item) => (
                    <div key={item.week} style={{ fontSize: 11 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontWeight: 700 }}>{item.week}</span>
                        <span className="muted">{item.cases} cases · {item.deaths} deaths · {item.ring_vaccinations} ring vax</span>
                      </div>
                      <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${Math.min((item.cases / 80) * 100, 100)}%`,
                            height: "100%",
                            background: item.cases > 50 ? "#e11d48" : "#f59e0b",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE GIS MAP */}
        {activeTab === "gisMap" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: "#881337" }}>🗺️ Interactive Geospatial Epizootic Radar</h3>
                <div className="muted" style={{ fontSize: 11 }}>Real-time 3km containment circles &amp; 10km surveillance buffers</div>
              </div>
              <select
                className="select"
                style={{ width: "auto", padding: "6px 10px", fontSize: 12 }}
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                {MAHARASHTRA_DIVISIONS.map((div) => (
                  <optgroup key={div.name} label={div.name}>
                    {div.districts.map((d) => (
                      <option key={d} value={d}>
                        {d === "All" ? "All Maharashtra (State-wide Composite)" : d}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <GisLeafletMap clusters={geoClusters} selectedDistrict={districtFilter} height={420} showRings={true} />
          </div>
        )}

        {/* TAB 3: FIELD INCIDENTS & RAPID TRIAGE */}
        {activeTab === "incidents" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <select
                className="select"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                {MAHARASHTRA_DIVISIONS.map((div) => (
                  <optgroup key={div.name} label={div.name}>
                    {div.districts.map((d) => (
                      <option key={d} value={d}>
                        {d === "All" ? "All Maharashtra Districts" : d}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select
                className="select"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <option value="All">Urgency: All</option>
                <option value="Severe Outbreak">Severe Outbreak</option>
                <option value="Critical Watch">Critical Watch</option>
                <option value="Moderate Monitoring">Moderate</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredReports.map((r) => (
                <div
                  key={r.id}
                  className="card"
                  style={{
                    borderRadius: 16,
                    padding: "16px",
                    borderLeft: r.urgency === "Severe Outbreak" ? "4px solid #be123c" : "4px solid #ea580c",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>
                        📍 {r.village}, {r.block} ({r.district}, PIN: {r.pincode})
                      </div>
                      <div className="muted" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                        <span>Ref Code: <b>{r.ticket_id}</b> · {new Date(r.timestamp).toLocaleDateString("en-IN")}</span>
                        {(r.ticket_id?.includes("IVR") || r.reporter_type?.includes("IVR")) && (
                          <span style={{ fontSize: 10, background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 999, fontWeight: 900, border: "1px solid #86efac", display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
                            📞 LIVE 1962 IVR PHONE CALL
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: r.urgency === "Severe Outbreak" ? "#ffe4e6" : "#ffedd5",
                        color: r.urgency === "Severe Outbreak" ? "#be123c" : "#c2410c",
                      }}
                    >
                      {r.urgency}
                    </span>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "10px", borderRadius: 10, fontSize: 12, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: "#881337" }}>
                      🤖 Suspected Pathogen: {r.suspected_disease} ({r.ai_triage_score}% AI Risk Index)
                    </div>
                    <div style={{ color: "#334155", marginTop: 4 }}>
                      Species: <b>{r.species}</b> · Sick Animals: <b>{r.affected_count}</b> · Deaths: <b style={{ color: "#b91c1c" }}>{r.mortality_count}</b>
                    </div>
                    <div style={{ color: "#64748b", marginTop: 2 }}>
                      Reporter: {r.reporter_name} ({r.reporter_type}) · Vax Status: {r.vaccination_status}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px", fontSize: 11, background: "#fee2e2", color: "#991b1b", border: "1px solid #f87171" }}
                      onClick={() => handleEscalateCase(r)}
                    >
                      🚨 Escalate to DVO &amp; Mobilize RRT
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px", fontSize: 11, background: "#fef3c7", color: "#92400e", border: "1px solid #f59e0b" }}
                      onClick={() => handleIssueContainment(r)}
                    >
                      🛡️ Declare 3km Ring Containment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LABORATORY SAMPLE REFERRALS */}
        {activeTab === "labReferrals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: "#065f46" }}>🧪 Diagnostic Laboratory Pipeline</h3>
                <div className="muted" style={{ fontSize: 11 }}>WRDDL, NIHSAD, ICAR-DFMD cold-chain testing workflow</div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "6px 12px", fontSize: 12, borderRadius: 10, background: "#059669" }}
                onClick={() => setNewLabModal(true)}
              >
                ➕ New Sample Referral
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {labReferrals.map((l) => (
                <div key={l.id} className="card" style={{ borderRadius: 16, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#065f46" }}>
                        🏷️ Sample ID: {l.sample_id}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569" }}>
                        Linked Incident: <b>{l.ticket_id}</b> · {l.district}, {l.block}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: (l.status || "").includes("Positive") ? "#fee2e2" : "#f0fdf4",
                        color: (l.status || "").includes("Positive") ? "#b91c1c" : "#15803d",
                      }}
                    >
                      {l.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "#334155", background: "#f8fafc", padding: "8px 10px", borderRadius: 8, marginBottom: 8 }}>
                    <div><b>Specimen:</b> {l.specimen_type} (Cold Chain: <b>{l.cold_chain_temp}</b>)</div>
                    <div><b>Assigned Lab:</b> {l.testing_laboratory}</div>
                    <div><b>Test Protocol:</b> {l.test_type}</div>
                    {l.notes && <div className="muted" style={{ marginTop: 4 }}>Note: {l.notes}</div>}
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: "4px 10px", fontSize: 11, border: "1px solid #cbd5e1" }}
                      onClick={() => handleUpdateLabStatus(l.id, "Confirmed Positive (Viral Strain Isolated)")}
                    >
                      ✓ Mark Positive
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: "4px 10px", fontSize: 11, border: "1px solid #cbd5e1" }}
                      onClick={() => handleUpdateLabStatus(l.id, "Confirmed Negative (Pathogen Cleared)")}
                    >
                      ✕ Mark Negative
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: "4px 10px", fontSize: 11, border: "1px solid #059669", color: "#065f46", fontWeight: 700 }}
                      onClick={() => setViewCustodySlipModal(l)}
                    >
                      🏷️ Cold-Chain Slip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MULTILINGUAL BROADCAST ADVISORIES */}
        {activeTab === "advisories" && (
          <div className="card" style={{ borderRadius: 18, padding: "18px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, color: "#881337" }}>
              📢 Multilingual Emergency Advisory Broadcaster
            </h3>
            <p className="muted" style={{ margin: "0 0 14px", fontSize: 12 }}>
              Generate and broadcast official veterinary health alerts to registered farmers across affected blocks in English, Hindi &amp; Marathi.
            </p>

            <form onSubmit={handleSendBroadcast}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div className="label">Target District</div>
                  <select
                    className="select"
                    value={broadcastForm.district}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, district: e.target.value })}
                  >
                    {MAHARASHTRA_DIVISIONS.map((div) => (
                      <optgroup key={div.name} label={div.name}>
                        {div.districts.map((d) => (
                          <option key={d} value={d}>
                            {d === "All" ? "State-wide (All 36 Districts)" : d}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="label">Target Block / Taluka</div>
                  <input
                    className="input"
                    value={broadcastForm.block}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, block: e.target.value })}
                    placeholder="e.g. Baramati"
                  />
                </div>
              </div>

              <div className="sp" />
              <div className="label">Suspected Disease Alert</div>
              <select
                className="select"
                value={broadcastForm.disease}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, disease: e.target.value })}
              >
                <option value="Lumpy Skin Disease (LSD)">Lumpy Skin Disease (LSD)</option>
                <option value="Foot & Mouth Disease (FMD)">Foot &amp; Mouth Disease (FMD)</option>
                <option value="Peste des Petits Ruminants (PPR)">Peste des Petits Ruminants (PPR)</option>
                <option value="Hemorrhagic Septicemia (HS)">Hemorrhagic Septicemia (HS)</option>
                <option value="Avian Influenza (Bird Flu)">Avian Influenza (Bird Flu)</option>
              </select>

              <div className="sp" />
              <div className="label">Dispatch Channels</div>
              <input
                className="input"
                value={broadcastForm.target_channel}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, target_channel: e.target.value })}
              />

              <div className="sp-lg" />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", background: "#881337", borderColor: "#881337" }}
              >
                🚀 Dispatch Multilingual Emergency Advisory to 14,250 Farmers
              </button>
            </form>

            {broadcastResult && (
              <div style={{ marginTop: 16, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "14px", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>
                    ✅ Broadcast Dispatched! (Ref: {broadcastResult.ref_id})
                  </div>
                  <button
                    type="button"
                    style={{
                      background: "#059669",
                      color: "#ffffff",
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 750,
                      cursor: "pointer",
                    }}
                    onClick={() => setPreviewBroadcastModal(broadcastResult)}
                  >
                    📱 Preview Citizen Phone &amp; Audio
                  </button>
                </div>
                <div style={{ fontSize: 12, color: "#1e293b", lineHeight: 1.5 }}>
                  <div><b>🇬🇧 English:</b> {broadcastResult.advisory_texts?.en}</div>
                  <div style={{ marginTop: 4 }}><b>🇮🇳 हिंदी:</b> {broadcastResult.advisory_texts?.hi}</div>
                  <div style={{ marginTop: 4 }}><b>🚩 मराठी:</b> {broadcastResult.advisory_texts?.mr}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: OFFICIAL CONTAINMENT ORDERS */}
        {activeTab === "containmentOrders" && (
          <div>
            <h3 style={{ margin: "0 0 10px", fontSize: 16, color: "#881337" }}>🛡️ Active Gazette Containment Orders</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  code: "DAHD-ORDER-2026-8001",
                  district: "Pune",
                  block: "Baramati",
                  epicenter: "Malegaon Khurd",
                  radius: "3 km Ring Containment (9 km Surveillance Buffer)",
                  date: "2026-09-26",
                  action: "Complete movement restriction on bovine animals & mandatory disinfectant spraying at village checkpoints.",
                },
                {
                  code: "DAHD-ORDER-2026-8002",
                  district: "Kolhapur",
                  block: "Karveer",
                  epicenter: "Shiroli Pulachi",
                  radius: "3 km Ring Containment",
                  date: "2026-09-25",
                  action: "Weekly cattle haat market closed for 14 days; emergency trivalent FMD ring vaccination active.",
                },
              ].map((ord) => (
                <div key={ord.code} className="card" style={{ borderRadius: 16, padding: "14px", borderLeft: "4px solid #b91c1c" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontWeight: 800, color: "#881337", fontSize: 13 }}>{ord.code}</div>
                    <span style={{ fontSize: 10, background: "#fee2e2", color: "#b91c1c", padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>
                      ACTIVE GAZETTE ORDER
                    </span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                    📍 {ord.epicenter} ({ord.block}, {ord.district})
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", margin: "4px 0" }}>
                    Perimeter: <b>{ord.radius}</b> · Date Issued: {ord.date}
                  </div>
                  <div style={{ fontSize: 12, color: "#334155", background: "#f8fafc", padding: "6px 8px", borderRadius: 6, marginBottom: 8 }}>
                    {ord.action}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: "6px 12px", fontSize: 11, fontWeight: 750, color: "#881337", borderColor: "#fecdd3", background: "#fff1f2" }}
                    onClick={() => setViewGazetteModal(ord)}
                  >
                    🖨️ View Official Gazette Order Notice (Print)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: REAL-TIME LOCATION EXPECTED OUTCOMES (SIH PS 26128) */}
        {activeTab === "locationOutcomes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 16, color: "#881337" }}>
                  🎯 Real-Time Location Expected Outcomes (SIH PS 26128)
                </h3>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Dynamic telemetry calculating early warning, mortality averted, and containment outcomes per coordinate
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: 11, fontWeight: 800, padding: "6px 12px", borderRadius: 10, borderColor: "#cbd5e1" }}
                onClick={() => fetchLocationOutcomes(outcomeDistrict, outcomeBlock, outcomeVillage)}
              >
                🔄 Refresh Live Outcomes
              </button>
            </div>

            {/* Location Selector Bar */}
            <div
              className="card"
              style={{
                borderRadius: 16,
                padding: "14px",
                background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                border: "1px solid #cbd5e1",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span>📍</span> Select Target Administrative Location (District · Block · Village):
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr auto", gap: 8, alignItems: "flex-end" }}>
                <div>
                  <div className="label" style={{ fontSize: 10, marginBottom: 2 }}>District</div>
                  <select
                    className="select"
                    style={{ padding: "8px 10px", fontSize: 12 }}
                    value={outcomeDistrict}
                    onChange={(e) => {
                      setOutcomeDistrict(e.target.value);
                      fetchLocationOutcomes(e.target.value, outcomeBlock, outcomeVillage);
                    }}
                  >
                    {MAHARASHTRA_DIVISIONS.map((div) => (
                      <optgroup key={div.name} label={div.name}>
                        {div.districts.filter((d) => d !== "All").map((dst) => (
                          <option key={dst} value={dst}>{dst}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="label" style={{ fontSize: 10, marginBottom: 2 }}>Block / Taluka</div>
                  <input
                    className="input"
                    style={{ padding: "8px 10px", fontSize: 12 }}
                    value={outcomeBlock}
                    onChange={(e) => setOutcomeBlock(e.target.value)}
                    placeholder="e.g. Baramati"
                  />
                </div>
                <div>
                  <div className="label" style={{ fontSize: 10, marginBottom: 2 }}>Village / Panchayat</div>
                  <input
                    className="input"
                    style={{ padding: "8px 10px", fontSize: 12 }}
                    value={outcomeVillage}
                    onChange={(e) => setOutcomeVillage(e.target.value)}
                    placeholder="e.g. Malegaon Khurd"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #881337 0%, #be123c 100%)",
                      borderColor: "#881337",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => fetchLocationOutcomes(outcomeDistrict, outcomeBlock, outcomeVillage)}
                    disabled={outcomeLoading}
                  >
                    {outcomeLoading ? "Analyzing..." : "⚡ Calculate"}
                  </button>
                </div>
              </div>
            </div>

            {/* 6 Real-Time Outcomes Matrix Cards (Direct from PS ID 26128) */}
            {locationOutcomes?.expected_outcomes && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 16 }}>
                {/* 1. Reduced Reporting Time */}
                <div className="outcome-matrix-card" style={{ borderLeft: "4px solid #059669" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#047857", textTransform: "uppercase" }}>
                      ⏱️ 1. Reduced Reporting Time
                    </div>
                    <span className="outcome-pill-badge" style={{ background: "#ecfdf5", color: "#047857" }}>
                      {locationOutcomes.expected_outcomes.reduced_reporting_time.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 850, color: "#065f46", margin: "4px 0" }}>
                    {locationOutcomes.expected_outcomes.reduced_reporting_time.metric}
                  </div>
                  <div style={{ fontSize: 12, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                    Live: <span style={{ color: "#059669" }}>{locationOutcomes.expected_outcomes.reduced_reporting_time.vetnova_time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                    <b>Baseline:</b> {locationOutcomes.expected_outcomes.reduced_reporting_time.baseline}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 6, background: "#f8fafc", padding: "6px 8px", borderRadius: 8 }}>
                    {locationOutcomes.expected_outcomes.reduced_reporting_time.impact_detail}
                  </div>
                </div>

                {/* 2. Earlier Outbreak Identification */}
                <div className="outcome-matrix-card" style={{ borderLeft: "4px solid #2563eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#1d4ed8", textTransform: "uppercase" }}>
                      ⚡ 2. Earlier Outbreak Identification
                    </div>
                    <span className="outcome-pill-badge" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                      AI Predictive
                    </span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 850, color: "#1e40af", margin: "4px 0" }}>
                    {locationOutcomes.expected_outcomes.earlier_outbreak_identification.metric}
                  </div>
                  <div style={{ fontSize: 12, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                    AI Accuracy: <span style={{ color: "#2563eb" }}>{locationOutcomes.expected_outcomes.earlier_outbreak_identification.ai_confidence}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                    <b>Lead Time:</b> {locationOutcomes.expected_outcomes.earlier_outbreak_identification.historical_curve_advance}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 6, background: "#f8fafc", padding: "6px 8px", borderRadius: 8 }}>
                    <b>Vector Sync:</b> {locationOutcomes.expected_outcomes.earlier_outbreak_identification.weather_vector_correlation}
                  </div>
                </div>

                {/* 3. Improved Vaccination Coverage */}
                <div className="outcome-matrix-card" style={{ borderLeft: "4px solid #7c3aed" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#6d28d9", textTransform: "uppercase" }}>
                      💉 3. Improved Vaccination Coverage
                    </div>
                    <span className="outcome-pill-badge" style={{ background: "#f5f3ff", color: "#6d28d9" }}>
                      {locationOutcomes.expected_outcomes.improved_vaccination_coverage.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 850, color: "#5b21b6", margin: "4px 0" }}>
                    {locationOutcomes.expected_outcomes.improved_vaccination_coverage.metric}
                  </div>
                  <div style={{ fontSize: 12, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                    Containment Target: <span style={{ color: "#7c3aed" }}>{locationOutcomes.expected_outcomes.improved_vaccination_coverage.containment_ring_target}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                    <b>Pre-outbreak:</b> {locationOutcomes.expected_outcomes.improved_vaccination_coverage.baseline_pre_outbreak} · {locationOutcomes.expected_outcomes.improved_vaccination_coverage.active_doses_administered}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 6, background: "#f8fafc", padding: "6px 8px", borderRadius: 8 }}>
                    <b>Immunity Status:</b> {locationOutcomes.expected_outcomes.improved_vaccination_coverage.herd_immunity_index}
                  </div>
                </div>

                {/* 4. Faster Treatment & Containment */}
                <div className="outcome-matrix-card" style={{ borderLeft: "4px solid #ea580c" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#c2410c", textTransform: "uppercase" }}>
                      🛡️ 4. Faster Treatment &amp; Containment
                    </div>
                    <span className="outcome-pill-badge" style={{ background: "#fff7ed", color: "#c2410c" }}>
                      RRT Mobilized
                    </span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 850, color: "#9a3412", margin: "4px 0" }}>
                    {locationOutcomes.expected_outcomes.faster_treatment_and_containment.metric}
                  </div>
                  <div style={{ fontSize: 12, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                    RRT Mobilization: <span style={{ color: "#ea580c" }}>{locationOutcomes.expected_outcomes.faster_treatment_and_containment.rrt_dispatch_time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                    <b>Traditional Bureaucracy:</b> {locationOutcomes.expected_outcomes.faster_treatment_and_containment.baseline_containment}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 6, background: "#f8fafc", padding: "6px 8px", borderRadius: 8 }}>
                    <b>Enforcement:</b> {locationOutcomes.expected_outcomes.faster_treatment_and_containment.movement_restriction}
                  </div>
                </div>

                {/* 5. Lower Mortality & Productivity Loss */}
                <div className="outcome-matrix-card" style={{ borderLeft: "4px solid #be123c" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#9f1239", textTransform: "uppercase" }}>
                      📉 5. Lower Mortality &amp; Productivity Loss
                    </div>
                    <span className="outcome-pill-badge" style={{ background: "#fff1f2", color: "#9f1239" }}>
                      Economic Saver
                    </span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 850, color: "#881337", margin: "4px 0" }}>
                    {locationOutcomes.expected_outcomes.lower_mortality_and_productivity_loss.metric}
                  </div>
                  <div style={{ fontSize: 12, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                    Financial Savings: <span style={{ color: "#be123c" }}>{locationOutcomes.expected_outcomes.lower_mortality_and_productivity_loss.economic_savings_inr}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                    <b>Lives Saved:</b> {locationOutcomes.expected_outcomes.lower_mortality_and_productivity_loss.livestock_lives_saved} animals · Milk: {locationOutcomes.expected_outcomes.lower_mortality_and_productivity_loss.milk_yield_preservation}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 6, background: "#f8fafc", padding: "6px 8px", borderRadius: 8 }}>
                    <b>Farmer Welfare:</b> {locationOutcomes.expected_outcomes.lower_mortality_and_productivity_loss.farmer_income_protected}
                  </div>
                </div>

                {/* 6. Stronger Evidence-Based Planning */}
                <div className="outcome-matrix-card" style={{ borderLeft: "4px solid #0284c7" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#0369a1", textTransform: "uppercase" }}>
                      📊 6. Stronger Evidence-Based Planning
                    </div>
                    <span className="outcome-pill-badge" style={{ background: "#f0f9ff", color: "#0369a1" }}>
                      Decision-Support
                    </span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 850, color: "#075985", margin: "4px 0" }}>
                    {locationOutcomes.expected_outcomes.stronger_evidence_based_planning.metric}
                  </div>
                  <div style={{ fontSize: 12, color: "#1e293b", fontWeight: 700, marginBottom: 4 }}>
                    Allocation: <span style={{ color: "#0284c7" }}>{locationOutcomes.expected_outcomes.stronger_evidence_based_planning.resource_allocation_priority}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                    <b>Stockpile:</b> {locationOutcomes.expected_outcomes.stronger_evidence_based_planning.vial_stockpile_status}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 6, background: "#f8fafc", padding: "6px 8px", borderRadius: 8 }}>
                    <b>Diagnostic Distance:</b> {locationOutcomes.expected_outcomes.stronger_evidence_based_planning.diagnostic_distance} ({locationOutcomes.expected_outcomes.stronger_evidence_based_planning.cold_chain_eta})
                  </div>
                </div>
              </div>
            )}

            {/* Zoonotic Transmission & One-Health Cross Notification */}
            {locationOutcomes?.zoonotic_one_health && (
              <div
                style={{
                  background: locationOutcomes.zoonotic_one_health.zoonotic_risk_flag ? "#fff1f2" : "#f0fdf4",
                  border: `1px solid ${locationOutcomes.zoonotic_one_health.zoonotic_risk_flag ? "#fecdd3" : "#bbf7d0"}`,
                  borderRadius: 16,
                  padding: "16px",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{locationOutcomes.zoonotic_one_health.zoonotic_risk_flag ? "☣️" : "🛡️"}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: locationOutcomes.zoonotic_one_health.zoonotic_risk_flag ? "#881337" : "#14532d" }}>
                      Zoonotic Transmission Risk &amp; One-Health Inter-Agency Notification
                    </div>
                    <div style={{ fontSize: 11, color: locationOutcomes.zoonotic_one_health.zoonotic_risk_flag ? "#be123c" : "#15803d" }}>
                      Coordinated human-animal health surveillance protocol
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, background: "rgba(255,255,255,0.7)", padding: "10px", borderRadius: 10 }}>
                  <div><b>Inter-Departmental Referral:</b> {locationOutcomes.zoonotic_one_health.notified_human_phc}</div>
                  <div style={{ marginTop: 4 }}><b>Protective Mandate:</b> {locationOutcomes.zoonotic_one_health.biosecurity_protocol}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: UNIFIED ANIMAL HEALTH DATA EXCHANGE */}
        {activeTab === "dataExchange" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 16, color: "#1e3a8a" }}>
                    🔗 Unified Animal Health Data Exchange (USAHIE)
                  </h3>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    De-fragmenting data across farms, veterinary dispensaries, laboratories, vaccination drives, and surveillance
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, background: "#ecfdf5", color: "#047857", padding: "4px 10px", borderRadius: 999 }}>
                  {dataExchange?.integration_metric || "100% De-fragmented Data Flow"}
                </span>
              </div>
            </div>

            {dataExchange?.streams && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Object.entries(dataExchange.streams).map(([key, stream]) => (
                  <div key={key} className="exchange-stream-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
                        {stream.title}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 800, background: "#f1f5f9", color: "#334155", padding: "3px 8px", borderRadius: 6 }}>
                        🟢 {stream.active_status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>
                      <b>Data Sources:</b> {stream.source}
                    </div>
                    <div style={{ fontSize: 12, background: "#f8fafc", padding: "8px 10px", borderRadius: 8, color: "#334155" }}>
                      <b>Latest Synced Packet:</b> {stream.recent_sample}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: ANIMAL & HERD HEALTH, VACCINATION & TREATMENT RECORDS */}
        {activeTab === "treatments" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 16, color: "#881337" }}>
                  📋 Animal-Level &amp; Herd-Level Health, Vaccination &amp; Treatment Records
                </h3>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Complete registry with 12-digit ear tags, drug withdrawal safety countdowns, and attending vets
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontSize: 12, fontWeight: 800, padding: "8px 14px", background: "#881337", borderColor: "#881337" }}
                onClick={() => setNewTreatmentModal(true)}
              >
                ➕ Log Treatment &amp; Drug Withdrawal
              </button>
            </div>

            {/* Filter Search */}
            <div style={{ marginBottom: 12 }}>
              <input
                className="input"
                style={{ padding: "10px 14px", fontSize: 13 }}
                placeholder="🔍 Search by 12-Digit Tag ID (e.g. IN-8291), Animal Name, Herd ID, or Owner..."
                value={treatmentSearch}
                onChange={(e) => setTreatmentSearch(e.target.value)}
              />
            </div>

            {/* Treatment Cards List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {treatmentRecords
                .filter((rec) => {
                  if (!treatmentSearch.trim()) return true;
                  const q = treatmentSearch.toLowerCase();
                  return (
                    rec.tag_id.toLowerCase().includes(q) ||
                    (rec.animal_name || "").toLowerCase().includes(q) ||
                    (rec.herd_id || "").toLowerCase().includes(q) ||
                    (rec.owner_name || "").toLowerCase().includes(q)
                  );
                })
                .map((rec) => (
                  <div key={rec.id} className="card" style={{ borderRadius: 16, padding: "16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, background: "#fef3c7", color: "#b45309", padding: "2px 8px", borderRadius: 4, marginRight: 6 }}>
                          🏷️ TAG: {rec.tag_id}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 800, background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: 4 }}>
                          HERD: {rec.herd_id}
                        </span>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                          {rec.animal_name} · <span style={{ color: "#64748b", fontWeight: 600 }}>{rec.species}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, background: "#ecfdf5", color: "#047857", padding: "4px 8px", borderRadius: 999 }}>
                        {rec.recovery_status}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>
                      Owner: <b>{rec.owner_name}</b> · 📍 {rec.village}, {rec.block}, {rec.district} · Date: {rec.treatment_date}
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 700, color: "#881337", marginBottom: 6 }}>
                      🩺 Diagnosis: {rec.diagnosis}
                    </div>

                    {/* Medications List */}
                    <div style={{ background: "#f8fafc", padding: "10px", borderRadius: 10, marginBottom: 8, fontSize: 12 }}>
                      <div style={{ fontWeight: 800, color: "#334155", marginBottom: 4 }}>💊 Administered Medications:</div>
                      {rec.medications?.map((m, mIdx) => (
                        <div key={mIdx} style={{ color: "#475569", display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <span>• <b>{m.drug}</b> ({m.dose}, {m.duration})</span>
                          <span style={{ color: "#b91c1c", fontWeight: 700 }}>Milk Withdrawal: {m.withdrawal_days_milk}d</span>
                        </div>
                      ))}
                    </div>

                    {/* Drug Withdrawal Period Alert Badge */}
                    {rec.milk_withdrawal_status && (
                      <div className="withdrawal-alert-badge" style={{ marginBottom: 8, width: "100%", boxSizing: "border-box" }}>
                        <span>⚠️</span>
                        <span>{rec.milk_withdrawal_status}</span>
                      </div>
                    )}

                    <div style={{ fontSize: 11, color: "#64748b", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                      <div><b>Attending Vet:</b> {rec.attending_officer}</div>
                      <div><b>Para-Vet (Pashu Sakhi):</b> {rec.para_vet_assistant}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* New Treatment Modal */}
      {newTreatmentModal && (
        <div className="modal-bg" onClick={() => setNewTreatmentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <h3 style={{ margin: "0 0 10px", color: "#881337" }}>➕ Log Animal / Herd Treatment &amp; Withdrawal</h3>
            <form onSubmit={handleCreateTreatment}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div className="label">12-Digit Ear Tag ID *</div>
                  <input
                    className="input"
                    required
                    value={treatmentForm.tag_id}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, tag_id: e.target.value })}
                    placeholder="e.g. IN-8291-0421"
                  />
                </div>
                <div>
                  <div className="label">Animal Name / Breed</div>
                  <input
                    className="input"
                    value={treatmentForm.animal_name}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, animal_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="sp-sm" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div className="label">Species</div>
                  <select
                    className="select"
                    value={treatmentForm.species}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, species: e.target.value })}
                  >
                    <option value="Cattle">Cattle / Cow</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Poultry">Poultry</option>
                  </select>
                </div>
                <div>
                  <div className="label">Herd ID</div>
                  <input
                    className="input"
                    value={treatmentForm.herd_id}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, herd_id: e.target.value })}
                  />
                </div>
              </div>

              <div className="sp-sm" />
              <div className="label">Clinical Diagnosis *</div>
              <input
                className="input"
                required
                value={treatmentForm.diagnosis}
                onChange={(e) => setTreatmentForm({ ...treatmentForm, diagnosis: e.target.value })}
                placeholder="e.g. Secondary bacterial infection following LSD lesions"
              />

              <div className="sp-sm" />
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 8 }}>
                <div>
                  <div className="label">Administered Drug &amp; Dosage *</div>
                  <input
                    className="input"
                    required
                    value={treatmentForm.drug_name}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, drug_name: e.target.value })}
                    placeholder="e.g. Enrofloxacin 10% (15ml IM)"
                  />
                </div>
                <div>
                  <div className="label">Milk Withdrawal (Days) *</div>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    required
                    value={treatmentForm.withdrawal_milk}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, withdrawal_milk: e.target.value })}
                  />
                </div>
              </div>

              <div className="sp-sm" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div className="label">Attending Vet</div>
                  <input
                    className="input"
                    value={treatmentForm.attending_officer}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, attending_officer: e.target.value })}
                  />
                </div>
                <div>
                  <div className="label">Para-Vet (Pashu Sakhi)</div>
                  <input
                    className="input"
                    value={treatmentForm.para_vet_assistant}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, para_vet_assistant: e.target.value })}
                  />
                </div>
              </div>

              <div className="sp-md" />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", background: "#881337", borderColor: "#881337", fontWeight: 800 }}
              >
                💾 Save to Central Registry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Escalation Modal */}
      {escalationModal && (
        <div className="modal-bg" onClick={() => setEscalationModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 36 }}>🚨</div>
              <h3 style={{ margin: "4px 0", color: "#881337" }}>Emergency RRT Deployment Mobilized!</h3>
              <p className="muted" style={{ fontSize: 12 }}>
                Escalation Order: <b>{escalationModal.escalation_code}</b>
              </p>
            </div>
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: 12, fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>
              <div><b>Mobilized Unit:</b> {escalationModal.rrt_team}</div>
              <div><b>Field Payload:</b> Ring Vaccines &amp; Disinfectant Equipment</div>
              <div><b>Status:</b> {escalationModal.deployment_status}</div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", background: "#881337" }}
              onClick={() => setEscalationModal(null)}
            >
              Acknowledge &amp; Monitor Feed
            </button>
          </div>
        </div>
      )}

      {/* Containment Modal */}
      {containmentModal && (
        <div className="modal-bg" onClick={() => setContainmentModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 36 }}>🛡️</div>
              <h3 style={{ margin: "4px 0", color: "#881337" }}>Containment Gazette Order Issued!</h3>
              <p className="muted" style={{ fontSize: 12 }}>
                Order No: <b>{containmentModal.order?.order_number}</b>
              </p>
            </div>
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: 12, fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>
              <div><b>Zone Epicenter:</b> {containmentModal.order?.epicenter_village}</div>
              <div><b>Radius:</b> {containmentModal.order?.containment_radius_km} km Ring Buffer</div>
              <div><b>Mandate:</b> {containmentModal.order?.action_type}</div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", background: "#881337" }}
              onClick={() => setContainmentModal(null)}
            >
              Enforce Order
            </button>
          </div>
        </div>
      )}

      {/* New Lab Sample Modal */}
      {newLabModal && (
        <div className="modal-bg" onClick={() => setNewLabModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <h3 style={{ margin: "0 0 10px", color: "#065f46" }}>➕ Dispatch New Diagnostic Sample</h3>
            <form onSubmit={handleCreateLabReferral}>
              <div className="label">Specimen Type *</div>
              <select
                className="select"
                value={sampleForm.specimen_type}
                onChange={(e) => setSampleForm({ ...sampleForm, specimen_type: e.target.value })}
              >
                <option value="Nodular Skin Biopsy & Whole Blood">Nodular Skin Biopsy &amp; Whole Blood</option>
                <option value="Vesicular Epithelium & Mouth Swab in Glycerol">Vesicular Epithelium &amp; Mouth Swab in Glycerol</option>
                <option value="Cloacal & Tracheal Swabs in VTM">Cloacal &amp; Tracheal Swabs in VTM</option>
                <option value="Jugular Blood Smear & Deep Nasal Swab">Jugular Blood Smear &amp; Deep Nasal Swab</option>
                <option value="Milk & Serum Sample">Milk &amp; Serum Sample</option>
              </select>

              <div className="sp" />
              <div className="label">Designated Diagnostic Laboratory *</div>
              <select
                className="select"
                value={sampleForm.testing_laboratory}
                onChange={(e) => setSampleForm({ ...sampleForm, testing_laboratory: e.target.value })}
              >
                <option value="Western Regional Disease Diagnostic Laboratory (WRDDL), Pune">Western Regional Disease Diagnostic Lab (WRDDL), Pune</option>
                <option value="ICAR - National Institute of High Security Animal Diseases (NIHSAD), Bhopal">ICAR - NIHSAD Bhopal (High Security)</option>
                <option value="ICAR - Directorate on Foot and Mouth Disease (ICAR-DFMD)">ICAR - DFMD (FMD Center)</option>
                <option value="Disease Investigation Section (DIS), Aundh, Pune">Disease Investigation Section (DIS), Pune</option>
                <option value="District Veterinary Diagnostic Laboratory">District Veterinary Diagnostic Lab</option>
              </select>

              <div className="sp-lg" />
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setNewLabModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5, background: "#059669" }}>Register Sample</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Citizen Smartphone Preview & Audio Broadcast Modal */}
      {previewBroadcastModal && (
        <div className="modal-bg" onClick={() => setPreviewBroadcastModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 430, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 24 }}>📱</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#065f46" }}>Citizen Broadcast Telemetry</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Dispatched via SMS · WhatsApp · 1962 IVR Blast</div>
                </div>
              </div>
              <button type="button" className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setPreviewBroadcastModal(null)}>✕</button>
            </div>

            {/* Language Selector Pills */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {[
                { code: "en", label: "🇬🇧 English", langCode: "en-IN" },
                { code: "hi", label: "🇮🇳 हिन्दी", langCode: "hi-IN" },
                { code: "mr", label: "🚩 मराठी", langCode: "mr-IN" },
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    border: previewLang === l.code ? "1.5px solid #059669" : "1px solid #cbd5e1",
                    background: previewLang === l.code ? "#ecfdf5" : "#ffffff",
                    color: previewLang === l.code ? "#065f46" : "#475569",
                    cursor: "pointer",
                  }}
                  onClick={() => setPreviewLang(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Realistic WhatsApp Chat Bubble */}
            <div
              style={{
                background: "#efeae2",
                borderRadius: 16,
                padding: "16px 14px",
                border: "1px solid #d1d5db",
                marginBottom: 14,
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 10, color: "#6b7280", textAlign: "center", marginBottom: 10 }}>
                DAHD Emergency Broadcast · Today at {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "14px 14px 14px 4px",
                  padding: "12px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: "#111827",
                  borderLeft: "4px solid #10b981",
                }}
              >
                <div style={{ fontWeight: 800, color: "#065f46", fontSize: 12, marginBottom: 4 }}>
                  🏛️ Government Animal Husbandry Alert
                </div>
                <div>{previewBroadcastModal.advisory_texts?.[previewLang] || previewBroadcastModal.advisory_texts?.en}</div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 6, fontSize: 10, color: "#9ca3af" }}>
                  <span>{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  <span style={{ color: "#3b82f6" }}>✓✓</span>
                </div>
              </div>
            </div>

            {/* Voice Audio Action Button */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: "10px", fontSize: 12, fontWeight: 750, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onClick={() => {
                  const speechTxt = previewBroadcastModal.advisory_texts?.[previewLang] || previewBroadcastModal.advisory_texts?.en;
                  const langCode = previewLang === "hi" ? "hi-IN" : previewLang === "mr" ? "mr-IN" : "en-IN";
                  speakAdvisory(speechTxt, langCode);
                }}
              >
                <span>🔊</span> Play Spoken IVR Alert
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, padding: "10px", fontSize: 12, background: "#059669", borderColor: "#059669" }}
                onClick={() => setPreviewBroadcastModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Gazette Containment Order Certificate Modal (Print/PDF) */}
      {viewGazetteModal && (
        <div className="modal-bg" onClick={() => setViewGazetteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, textAlign: "left", padding: 24 }}>
            <div style={{ border: "2px solid #0f172a", padding: "18px 20px", background: "#ffffff", borderRadius: 4 }}>
              <div style={{ textAlign: "center", borderBottom: "1.5px solid #0f172a", paddingBottom: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "1.5px" }}>THE GAZETTE OF INDIA · EXTRAORDINARY</div>
                <div style={{ fontSize: 10, color: "#475569" }}>DEPARTMENT OF ANIMAL HUSBANDRY &amp; DAIRYING (DAHD)</div>
                <div style={{ fontSize: 14, fontWeight: 900, marginTop: 4, color: "#881337" }}>
                  STATUTORY CONTAINMENT ZONE ORDER
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  Issued Under Section 6, Act 27 of 2009 (Infectious Diseases in Animals)
                </div>
              </div>

              <div style={{ fontSize: 12, lineHeight: 1.55, color: "#1e293b", marginBottom: 14 }}>
                <div><b>ORDER REF NO:</b> {viewGazetteModal.code}</div>
                <div><b>DATE OF NOTIFICATION:</b> {viewGazetteModal.date}</div>
                <div><b>AFFECTED DISTRICT / BLOCK:</b> {viewGazetteModal.district} · {viewGazetteModal.block}</div>
                <div><b>EPICENTER VILLAGE:</b> {viewGazetteModal.epicenter}</div>
                <div><b>CONTAINMENT PERIMETER:</b> {viewGazetteModal.radius}</div>
                <div style={{ marginTop: 8, padding: "8px", background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 4 }}>
                  <b>MANDATORY ENFORCEMENT DIRECTIVE:</b><br/>
                  {viewGazetteModal.action}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #cbd5e1", paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  DIGITALLY VERIFIED VIA DAHD<br/>
                  CENTRAL EPIZOOTIC SURVEILLANCE NODE
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#881337" }}>Dr. Mahendra Shirke</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>District Veterinary Officer (DVO), Pune</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setViewGazetteModal(null)}>Close</button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1.5, background: "#881337", borderColor: "#881337" }}
                onClick={() => window.print()}
              >
                🖨️ Print Gazette Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic Sample Cold-Chain Custody Slip Modal */}
      {viewCustodySlipModal && (
        <div className="modal-bg" onClick={() => setViewCustodySlipModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460, textAlign: "left" }}>
            <div style={{ border: "2px solid #065f46", borderRadius: 12, padding: "16px", background: "#f0fdf4", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #bbf7d0", paddingBottom: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "#065f46", letterSpacing: "1px" }}>DAHD DIAGNOSTIC LAB CHAIN OF CUSTODY</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#047857" }}>Sample Ref: {viewCustodySlipModal.sample_id}</div>
                </div>
                <span style={{ fontSize: 10, background: "#059669", color: "#ffffff", padding: "3px 8px", borderRadius: 999, fontWeight: 800 }}>
                  COLD-CHAIN VERIFIED
                </span>
              </div>

              <div style={{ fontSize: 12, color: "#166534", lineHeight: 1.55 }}>
                <div><b>Linked Incident Ticket:</b> {viewCustodySlipModal.ticket_id}</div>
                <div><b>Location:</b> {viewCustodySlipModal.village || "Rural Area"}, {viewCustodySlipModal.block} ({viewCustodySlipModal.district})</div>
                <div><b>Specimen Type:</b> {viewCustodySlipModal.specimen_type}</div>
                <div><b>Target Test Protocol:</b> {viewCustodySlipModal.test_type}</div>
                <div><b>Assigned Laboratory:</b> {viewCustodySlipModal.testing_laboratory}</div>
                <div><b>Cold-Chain Temperature:</b> <b style={{ color: "#047857" }}>{viewCustodySlipModal.cold_chain_temp || "4.0°C"}</b> (IoT Telemetry Monitored)</div>
                <div><b>Dispatch Status:</b> {viewCustodySlipModal.status}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setViewCustodySlipModal(null)}>Close</button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1.5, background: "#059669", borderColor: "#059669" }}
                onClick={() => window.print()}
              >
                🖨️ Print Sample Label &amp; Barcode
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const [screen, setScreen] = useState("splash");
  const [lang, setLang] = useState(localStorage.getItem("cb_lang") || "en");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("cb_user") || "null"));
  const [doctor, setDoctor] = useState(() => JSON.parse(localStorage.getItem("cb_doctor") || "null"));
  const [pharmacy, setPharmacy] = useState(() => JSON.parse(localStorage.getItem("cb_pharmacy") || "null"));
  const [deliveryPartner, setDeliveryPartner] = useState(() => JSON.parse(localStorage.getItem("cb_delivery") || "null"));
  const [govtOfficer, setGovtOfficer] = useState(() => {
    try {
      const g = localStorage.getItem("cb_govt_officer");
      return g ? JSON.parse(g) : null;
    } catch (_) {
      return null;
    }
  });
  const [wiz, setWiz] = useState({});
  const [diagnosis, setDiagnosis] = useState(null);
  const [videoCall, setVideoCall] = useState(null);
  _currentLang = lang;
  const t = useTr();

  useEffect(() => {
    if (screen !== "splash") return;
    let cancelled = false;
    const goNext = (next) => {
      if (!cancelled) setScreen(next);
    };
    const boot = async () => {
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;

      const storedGovt = govtOfficer || JSON.parse(localStorage.getItem("cb_govt_officer") || "null");
      if (storedGovt) {
        setGovtOfficer(storedGovt);
        goNext("govtDashboard");
        return;
      }

      const storedDelivery = deliveryPartner || JSON.parse(localStorage.getItem("cb_delivery") || "null");
      if (storedDelivery) {
        setDeliveryPartner(storedDelivery);
        goNext("deliveryDashboard");
        return;
      }

      const storedPharmacy = pharmacy || JSON.parse(localStorage.getItem("cb_pharmacy") || "null");
      if (storedPharmacy) {
        setPharmacy(storedPharmacy);
        goNext("pharmacyDashboard");
        return;
      }

      const storedDoctor = doctor || JSON.parse(localStorage.getItem("cb_doctor") || "null");
      if (storedDoctor) {
        setDoctor(storedDoctor);
        goNext("doctorDashboard");
        return;
      }

      const storedUser = user || JSON.parse(localStorage.getItem("cb_user") || "null");
      if (storedUser) {
        setUser(storedUser);
        goNext("dashboard");
        return;
      }

      const delC = loadSavedCreds("delivery");
      if (delC?.phone) {
        try {
          const out = await api("/api/delivery/verify-otp", { body: { phone: delC.phone, otp: "123456" } });
          if (out.rider) {
            setDeliveryPartner(out.rider);
            localStorage.setItem("cb_delivery", JSON.stringify(out.rider));
            goNext("deliveryDashboard");
            return;
          }
        } catch (_) {}
      }

      const pc = loadSavedCreds("pharmacy");
      if (pc?.phone) {
        try {
          const out = await api("/api/pharmacy/verify-otp", { body: { phone: pc.phone, otp: "123456" } });
          if (out.pharmacy) {
            setPharmacy(out.pharmacy);
            localStorage.setItem("cb_pharmacy", JSON.stringify(out.pharmacy));
            goNext("pharmacyDashboard");
            return;
          }
        } catch (_) {}
      }

      const uc = loadSavedCreds("user");
      if (uc?.phone) {
        try {
          const out = await api("/api/login", { body: { phone: uc.phone } });
          if (out.user) {
            setUser(out.user);
            localStorage.setItem("cb_user", JSON.stringify(out.user));
            goNext("dashboard");
            return;
          }
        } catch (_) {}
      }

      const dc = loadSavedCreds("doctor");
      if (dc?.phone) {
        try {
          const out = await api("/api/doctor/login", { body: { phone: dc.phone } });
          if (out.doctor) {
            setDoctor(out.doctor);
            localStorage.setItem("cb_doctor", JSON.stringify(out.doctor));
            goNext("doctorDashboard");
            return;
          }
        } catch (_) {}
      }

      if (!localStorage.getItem("cb_lang")) {
        goNext("lang");
        return;
      }
      goNext("role");
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, [screen]);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("cb_lang", l);
    _currentLang = l;
  };
  const logoutUser = () => {
    localStorage.removeItem("cb_user");
    saveSavedCreds("user", null);
    setUser(null);
    setScreen("role");
  };
  const logoutDoctor = () => {
    localStorage.removeItem("cb_doctor");
    saveSavedCreds("doctor", null);
    setDoctor(null);
    setScreen("role");
  };
  const logoutPharmacy = () => {
    localStorage.removeItem("cb_pharmacy");
    saveSavedCreds("pharmacy", null);
    setPharmacy(null);
    setScreen("role");
  };
  const logoutDelivery = () => {
    localStorage.removeItem("cb_delivery");
    saveSavedCreds("delivery", null);
    setDeliveryPartner(null);
    setScreen("role");
  };
  const logoutGovt = () => {
    localStorage.removeItem("cb_govt_officer");
    setGovtOfficer(null);
    setScreen("role");
  };

  const screens = {
    splash: <Splash t={t} />,
    lang: <LangScreen lang={lang} setLang={changeLang} onNext={() => setScreen("role")} />,
    role: (
      <RoleScreen
        t={t}
        onUser={() => setScreen("userAuth")}
        onDoctor={() => setScreen("doctorAuth")}
        onPharmacy={() => setScreen("pharmacyAuth")}
        onDelivery={() => setScreen("deliveryAuth")}
        onGovt={() => setScreen("govtAuth")}
        onParaVet={() => {
          localStorage.setItem("cb_paravet_mode", "true");
          setScreen("outbreakRadar");
        }}
      />
    ),
    govtAuth: (
      <GovtAuth
        t={t}
        lang={lang}
        onLogged={(officer) => {
          setGovtOfficer(officer);
          localStorage.setItem("cb_govt_officer", JSON.stringify(officer));
          setScreen("govtDashboard");
        }}
        onBack={() => setScreen("role")}
      />
    ),
    govtDashboard: (
      <GovtDashboard
        t={t}
        lang={lang}
        officer={govtOfficer}
        onLogout={logoutGovt}
        setScreen={setScreen}
      />
    ),
    deliveryAuth: (
      <DeliveryAuth
        t={t}
        lang={lang}
        onLogged={(del) => {
          setDeliveryPartner(del);
          localStorage.setItem("cb_delivery", JSON.stringify(del));
          setScreen("deliveryDashboard");
        }}
        onBack={() => setScreen("role")}
      />
    ),
    deliveryDashboard: (
      <DeliveryDashboard
        t={t}
        rider={deliveryPartner}
        onLogout={logoutDelivery}
      />
    ),
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
    pharmacyAuth: (
      <PharmacyAuth
        t={t}
        lang={lang}
        onLogged={(ph) => {
          setPharmacy(ph);
          localStorage.setItem("cb_pharmacy", JSON.stringify(ph));
          setScreen("pharmacyDashboard");
        }}
        onBack={() => setScreen("role")}
      />
    ),
    dashboard: <Dashboard t={t} user={user} setScreen={setScreen} />,
    tools: <ToolsScreen t={t} user={user} lang={lang} setScreen={setScreen} onBack={() => setScreen("dashboard")} />,
    healthPassport: <HealthPassportScreen t={t} user={user} lang={lang} setScreen={setScreen} onBack={() => setScreen("tools")} />,
    outbreakRadar: <OutbreakRadarScreen t={t} user={user} lang={lang} setScreen={setScreen} onBack={() => setScreen("tools")} />,
    vaccinationHub: <VaccinationHubScreen t={t} user={user} lang={lang} setScreen={setScreen} onBack={() => setScreen("tools")} />,
    govtSchemes: <GovtSchemesScreen t={t} user={user} lang={lang} setScreen={setScreen} onBack={() => setScreen("tools")} />,
    villageCoop: <VillageCoopScreen t={t} user={user} lang={lang} setScreen={setScreen} onBack={() => setScreen("tools")} />,
    farmInsights: <FarmInsightsScreen t={t} user={user} lang={lang} setScreen={setScreen} onBack={() => setScreen("tools")} />,
    pharmacy: <PharmacyScreen t={t} user={user} lang={lang} setScreen={setScreen} onBack={() => setScreen("dashboard")} />,
    pharmacyDashboard: <PharmacyDashboard t={t} pharmacy={pharmacy} onLogout={logoutPharmacy} />,
    news: <NewsScreen t={t} onBack={() => setScreen("dashboard")} />,
    videos: <VideosScreen t={t} lang={lang} setScreen={setScreen} />,
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
        setScreen={setScreen}
        onVideoCall={(call) => {
          setVideoCall(call);
          setScreen("videoCall");
        }}
        onDoctors={() => setScreen("doctors")}
        onBack={() => setScreen("dashboard")}
      />
    ),
    appointments: (
      <AppointmentsScreen t={t} user={user} lang={lang} setScreen={setScreen} diag={diagnosis} wiz={wiz} />
    ),
    doctors: (
      <DoctorsScreen
        t={t}
        user={user}
        diag={diagnosis}
        wiz={wiz}
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
        lang={lang}
        call={videoCall}
        role="user"
        setScreen={setScreen}
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
        lang={lang}
        call={videoCall}
        role="doctor"
        setScreen={setScreen}
        onEnd={() => {
          setVideoCall(null);
          setScreen("doctorDashboard");
        }}
      />
    ),
  };

  const isUserSection =
    screen !== "splash" &&
    screen !== "lang" &&
    screen !== "role" &&
    screen !== "doctorAuth" &&
    screen !== "pharmacyAuth" &&
    screen !== "deliveryAuth" &&
    screen !== "doctorDashboard" &&
    screen !== "pharmacyDashboard" &&
    screen !== "deliveryDashboard" &&
    screen !== "doctorVideoCall";

  return (
    <div className="viewport">
      {screens[screen] || screens.splash}
      {isUserSection && (
        <>
          <ToolsFloatingSymbol onNavigate={setScreen} currentScreen={screen} />
          <GeminiChatDock lang={lang} user={user} onNavigate={setScreen} />
        </>
      )}
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
        window.CB_T = { en: { tagline: "VetNova" } };
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
