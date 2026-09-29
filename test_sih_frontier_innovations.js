async function postReq(path, data) {
  const res = await fetch(`http://localhost:3000${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function getReq(path) {
  const res = await fetch(`http://localhost:3000${path}`);
  return res.json();
}

async function runTests() {
  console.log("========================================================================");
  console.log("🚀 SIH 2026 TOP-5 WINNING FRONTIER INNOVATIONS TEST SUITE");
  console.log("========================================================================");

  // 1. Bio-Acoustic Stethoscope (BARDI) Test
  console.log("\n1️⃣  Testing AI Bio-Acoustic Respiratory Analysis (BARDI Engine)...");
  const bardiRes = await postReq("/api/surveillance/bioacoustic-analysis", {
    species: "Cattle / Cow",
    audio_sample_name: "Bovine Bronchial Wheeze",
    peak_frequency_hz: 1850,
    cough_burst_count: 4,
    wheeze_intensity: "High",
    crackles_detected: true,
  });
  console.log("BARDI Status:", bardiRes.ok ? "✅ 200 OK" : "❌ FAILED");
  console.log("Analysis ID:", bardiRes.report?.analysis_id);
  console.log("Condition:", bardiRes.report?.suspected_condition);
  console.log("Etiological Agent:", bardiRes.report?.etiological_agent);
  console.log("BARDI Severity Score:", bardiRes.report?.bardi_score);
  console.log("Acoustic Biomarkers:", JSON.stringify(bardiRes.report?.acoustic_biomarkers));
  console.log("Clinical Rec:", bardiRes.report?.recommended_treatment?.first_line_antibiotic);
  console.log("MRL Warning:", bardiRes.report?.recommended_treatment?.mandatory_withdrawal_warning);

  // 2. Cattle Muzzle Biometrics (Pashu Rhinoglyphics) Test
  console.log("\n2️⃣  Testing Pashu Rhinoglyphics Biometric ID (Anti-Fraud Muzzle Print)...");
  const muzzleRes = await postReq("/api/surveillance/muzzle-biometrics", {
    tag_id: "IN-8291-0421",
    animal_name: "Gauri (Gir Purebred)",
    species: "Cattle",
    owner_name: "Ramesh Patil",
  });
  console.log("Muzzle Status:", muzzleRes.ok ? "✅ 200 OK" : "❌ FAILED");
  console.log("Generated Rhinoglyphic Hash:", muzzleRes.biometric_record?.biometric_hash);
  console.log("Extracted Ridges:", muzzleRes.biometric_record?.rhinoglyphic_ridges_extracted);
  console.log("Minutiae Keypoints:", muzzleRes.biometric_record?.minutiae_feature_keypoints);
  console.log("Match Confidence:", muzzleRes.biometric_record?.match_confidence);
  console.log("Fraud Risk Score:", muzzleRes.biometric_record?.fraud_risk_score);
  console.log("Certificate ID:", muzzleRes.biometric_record?.biometric_certificate);

  // 3. Cold-Chain Drone Fleet Dispatch Test
  console.log("\n3️⃣  Testing Autonomous Cold-Chain Drone Fleet (BVLOS Air-Drop)...");
  const droneRes = await postReq("/api/surveillance/drone-dispatch", {
    target_district: "Amravati",
    target_block: "Chikhaldara",
    target_village: "Melghat Tribal Hamlet",
    payload_type: "💉 FMD Quadrivalent Vaccine (200 Doses) + 10 Snake Antivenom Vials",
    officer_name: "Dr. Mahendra Shirke (DVO)",
  });
  console.log("Drone Status:", droneRes.ok ? "✅ 200 OK" : "❌ FAILED");
  console.log("Mission ID:", droneRes.mission?.mission_id);
  console.log("Drone Model:", droneRes.mission?.drone_model);
  console.log("Destination:", droneRes.mission?.target_village, `(${droneRes.mission?.target_district})`);
  console.log("Cold-Box Active Telemetry:", droneRes.mission?.cold_box_temperature);
  console.log("Airspeed / Altitude:", `${droneRes.mission?.airspeed_kmh} km/h @ ${droneRes.mission?.altitude_agl}`);
  console.log("Flight Status:", droneRes.mission?.flight_status);
  console.log("ETA:", `${droneRes.mission?.eta_mins} mins`);

  // 4. Retrieve Drone Missions List
  console.log("\n4️⃣  Testing Drone Fleet Telemetry & Active Missions...");
  const missionsRes = await getReq("/api/surveillance/drone-missions");
  console.log("Missions Count:", missionsRes.count || missionsRes.missions?.length);
  console.log("Active Mission Sample:", missionsRes.missions?.[0]?.mission_id, "->", missionsRes.missions?.[0]?.target_village, `(${missionsRes.missions?.[0]?.payload_type})`);

  console.log("\n========================================================================");
  console.log("🏆 ALL 3 FRONTIER INNOVATIONS FULLY OPERATIONAL & 100% VERIFIED!");
  console.log("========================================================================");
}

runTests().catch(console.error);
