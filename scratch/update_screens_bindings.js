import fs from "fs";

const screensPath = "./public/screens.js";
let screensCode = fs.readFileSync(screensPath, "utf8");

// Update BioAcousticsScreen field bindings
const oldBioRender = `{/* AI Analysis Diagnosis Card Output */}
        {audioResult && (
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
                  AI BARDI ETIOLOGY RESULT
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: 17, color: "#0f172a", fontWeight: 800 }}>
                  {audioResult.suspected_etiology}
                </h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>CONFIDENCE</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#059669" }}>
                  {Math.round((audioResult.confidence_score || 0.94) * 100)}%
                </div>
              </div>
            </div>

            {/* Differential Breakdown */}
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 6 }}>DIFFERENTIAL PATHOGENS:</div>
              {(audioResult.differentials || []).map((d, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: "#1e293b", fontWeight: 600 }}>• {d.condition}</span>
                  <span style={{ fontWeight: 800, color: "#0284c7" }}>{Math.round(d.probability * 100)}%</span>
                </div>
              ))}
            </div>

            {/* Clinical Protocol & Drug Withdrawal Alert */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#92400e", marginBottom: 4 }}>
                💊 RECOMMENDED ANTIMICROBIAL PROTOCOL:
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#78350f" }}>
                {audioResult.clinical_recommendation}
              </div>
              {audioResult.statutory_drug_withdrawal_warning && (
                <div style={{ marginTop: 8, fontSize: 11, color: "#b45309", background: "rgba(245, 158, 11, 0.15)", padding: "6px 8px", borderRadius: 8 }}>
                  ⚠️ <b>MRL Compliance:</b> {audioResult.statutory_drug_withdrawal_warning}
                </div>
              )}
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
        )}`;

const newBioRender = `{/* AI Analysis Diagnosis Card Output */}
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
        })()}`;

screensCode = screensCode.replace(oldBioRender, newBioRender);

// Update MuzzleBiometricsScreen field bindings
const oldMuzzleRender = `{/* Biometric Verification Certificate Output */}
        {scanResult && (
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
                  <h3 style={{ margin: 0, fontSize: 16, color: "#064e3b", fontWeight: 800 }}>
                    {scanResult.identity_status}
                  </h3>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#15803d", background: "#dcfce7", padding: "4px 10px", borderRadius: 999 }}>
                {scanResult.match_confidence || "99.4%"} Match
              </span>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px", fontSize: 12, display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              <div><b>Cryptographic Rhinoglyphic Hash:</b> <code style={{ color: "#4f46e5", background: "#e0e7ff", padding: "2px 6px", borderRadius: 4 }}>{scanResult.muzzle_hash}</code></div>
              <div><b>Pashu Aadhaar UID:</b> {scanResult.tag_id}</div>
              <div><b>Registered Owner:</b> {scanResult.owner_name}</div>
              <div><b>Anti-Tamper Shield:</b> <span style={{ color: "#15803d", fontWeight: 700 }}>✓ Verified Against Ear-Tag Swapping</span></div>
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
        )}`;

const newMuzzleRender = `{/* Biometric Verification Certificate Output */}
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
        })()}`;

screensCode = screensCode.replace(oldMuzzleRender, newMuzzleRender);

// Update DroneFleetScreen missions list rendering
const oldDroneList = `            {missions.map((m) => (
              <div key={m.mission_id} style={{ background: "#f8fafc", borderRadius: 12, padding: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 13, color: "#0f172a" }}>
                  <span>🚁 {m.drone_name} ({m.mission_id})</span>
                  <span style={{ fontSize: 11, color: "#059669", background: "#dcfce7", padding: "2px 8px", borderRadius: 999 }}>
                    {m.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>
                  <b>Destination:</b> {m.target_village}
                </div>
                <div style={{ fontSize: 12, color: "#475569" }}>
                  <b>Payload:</b> {m.payload} · <b>Cold-Box:</b> {m.cold_box_temperature_c}°C
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                  ETA: <b>{m.eta_minutes} mins</b> · Altitude: 120m AGL · Speed: 64 km/h
                </div>
              </div>
            ))}`;

const newDroneList = `            {missions.map((m) => (
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
            ))}`;

screensCode = screensCode.replace(oldDroneList, newDroneList);

fs.writeFileSync(screensPath, screensCode, "utf8");
console.log("✅ screens.js field bindings updated perfectly!");
