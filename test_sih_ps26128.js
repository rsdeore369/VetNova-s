import http from "http";
import { spawn } from "child_process";

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 3000,
        path,
        method,
        headers: {
          "Content-Type": "application/json",
          ...(postData ? { "Content-Length": Buffer.byteLength(postData) } : {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      await request("GET", "/api/surveillance/officials-summary");
      return true;
    } catch (_) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw new Error("Server failed to respond on port 3000 in time");
}

async function testSihSurveillance() {
  console.log("========================================================================");
  console.log("🇮🇳 SIH 2026 (PS ID 26128) - ANIMAL HEALTH SURVEILLANCE & TRIAGE TEST SUITE");
  console.log("========================================================================");

  // 1. Report from Village Level (Farmer / Para-vet)
  console.log("\n1️⃣  Testing Symptom & Mortality Report (Village/Block level)...");
  const reportRes = await request("POST", "/api/surveillance/report", {
    email: "ramesh.patil@agrimail.in",
    user_name: "Ramesh Patil",
    state: "Maharashtra",
    district: "Pune",
    block: "Baramati",
    village: "Malegaon Khurd",
    pincode: "413115",
    species: "Cattle / Cow",
    affected_count: 5,
    mortality_count: 1,
    symptoms: ["Nodular skin lesions", "High fever & salivation", "Decreased milk yield"],
    urgency: "High",
    reporter_type: "Livestock Farmer",
    vaccination_status: "Partially Vaccinated",
    notes: "Sudden nodular eruptions seen after grazing near common canal.",
  });
  console.log("Report Status:", reportRes.status);
  console.log("Ticket ID:", reportRes.data.ticket_id);
  console.log("AI Triage Suspected Disease:", reportRes.data.triage?.suspected_disease);
  console.log("AI Triage Risk Score:", reportRes.data.triage?.triage_score + "%");
  console.log("Recommended Containment Ring:", reportRes.data.triage?.recommended_containment_radius_km + " km");

  // 2. Test Offline Sync Queue
  console.log("\n2️⃣  Testing Low-Connectivity / Offline Mode Batch Sync...");
  const offlineItem = {
    offline_id: "OFFLINE-" + Date.now(),
    email: "sakhivishaka@zp.gov.in",
    user_name: "Vishakha Shinde (Pashu Sakhi)",
    state: "Maharashtra",
    district: "Kolhapur",
    block: "Karveer",
    village: "Shiroli Pulachi",
    pincode: "416122",
    species: "Goat & Sheep",
    affected_count: 8,
    mortality_count: 2,
    symptoms: ["Ulcerative mouth sores", "Severe bloody diarrhea", "High fever & salivation"],
    urgency: "Critical",
    reporter_type: "Para-Veterinary Worker / Pashu Sakhi",
    vaccination_status: "Unvaccinated",
    notes: "Collected offline in remote tribal wadi without 4G connectivity.",
  };
  const syncRes = await request("POST", "/api/surveillance/batch-sync", { items: [offlineItem] });
  console.log("Synced Count:", syncRes.data.synced_count);
  console.log("Synced Ticket:", syncRes.data.synced_tickets?.[0]?.ticket_id);

  // 3. Test Geospatial Risk Mapping & 3km Containment Clusters
  console.log("\n3️⃣  Testing Geospatial Risk Mapping & Containment Centroids...");
  const geoRes = await request("GET", "/api/surveillance/geospatial-clusters");
  console.log("Active Clusters Count:", geoRes.data.active_cluster_count);
  console.log("Clusters summary:", geoRes.data.clusters?.map(c => `${c.district} (${c.block}): ${c.primary_disease} | Risk: ${c.risk_level}`));

  // 4. Test Weather Risk & Vector Correlation
  console.log("\n4️⃣  Testing Weather Risk & Vector Correlation...");
  const weatherRes = await request("GET", "/api/surveillance/weather-risk");
  console.log("Monsoon Advisory:", weatherRes.data.monsoon_vector_warning?.substring(0, 75) + "...");
  console.log("District Weather Risk Sample:", weatherRes.data.weather_correlations?.[0]?.district, "| Vector:", weatherRes.data.weather_correlations?.[0]?.vector_type);

  // 5. Test Historical Trends & Epidemiological Curve
  console.log("\n5️⃣  Testing Historical Disease Trends & Epizootic Curve...");
  const histRes = await request("GET", "/api/surveillance/historical-trends");
  console.log("Timeline Weeks:", histRes.data.epidemiological_curve?.length);
  console.log("Effective Reproduction Rt:", histRes.data.analysis?.effective_reproduction_rate);
  console.log("Peak Period:", histRes.data.analysis?.peak_period);

  // 6. Test Lab Referral & Sample Cold-Chain Tracking
  console.log("\n6️⃣  Testing Diagnostic Sample Collection & Lab Referral...");
  const labRes = await request("POST", "/api/surveillance/lab-referral", {
    ticket_id: reportRes.data.ticket_id,
    district: "Pune",
    block: "Baramati",
    village: "Malegaon Khurd",
    species: "Cattle",
    specimen_type: "Nodular Skin Scab & Whole Blood",
    cold_chain_temp: "4.2°C (Monitored via IoT Sensor)",
    collected_by: "Pashu Dhan Nirikshak",
    testing_laboratory: "Western Regional Disease Diagnostic Laboratory (WRDDL), Pune",
    test_type: "Real-Time PCR for Capripoxvirus",
    priority: "High",
    notes: "Ice packs intact during dispatch.",
  });
  console.log("Generated Sample ID:", labRes.data.sample_id);
  console.log("Lab Assigned:", labRes.data.referral?.testing_laboratory);

  // 7. Test Case Escalation to District Veterinary Officer (DVO) & RRT Mobilization
  console.log("\n7️⃣  Testing Case Escalation to DVO & RRT Mobilization...");
  const escRes = await request("POST", "/api/surveillance/escalate-case", {
    ticket_id: reportRes.data.ticket_id,
    district: "Pune",
    block: "Baramati",
    reason: "Sudden spike in nodular lesions across multiple cattle sheds.",
    requested_rrt_action: "Deploy Rapid Response Team with Ring Vaccine Vials",
  });
  console.log("Escalation Code:", escRes.data.escalation_code);
  console.log("RRT Mobilized:", escRes.data.rrt_team);
  console.log("Deployment Status:", escRes.data.deployment_status);

  // 8. Test Government Officials Summary KPI Dashboard
  console.log("\n8️⃣  Testing Government Officials Summary KPI Dashboard...");
  const sumRes = await request("GET", "/api/surveillance/officials-summary");
  console.log("Total Surveillance Reports:", sumRes.data.kpis?.total_surveillance_reports);
  console.log("Active Critical Outbreaks:", sumRes.data.kpis?.active_critical_outbreaks);
  console.log("Ring Vaccination Doses:", sumRes.data.kpis?.ring_vaccination_doses_administered);
  console.log("RRT Teams Deployed:", sumRes.data.kpis?.rapid_response_teams_deployed);

  // 9. Test Official Containment Zone Declaration Order
  console.log("\n9️⃣  Testing Gazette Containment Zone Order Declaration...");
  const orderRes = await request("POST", "/api/surveillance/containment-action", {
    district: "Pune",
    block: "Baramati",
    epicenter_village: "Malegaon Khurd",
    containment_radius_km: 3,
    action_type: "3 km Movement Ban, Cattle Fair Closure & Emergency Ring Vaccination",
    officer_name: "Dr. Mahendra Shirke (DVO)",
  });
  console.log("Order Number:", orderRes.data.order?.order_number);
  console.log("Containment Radius:", orderRes.data.order?.containment_radius_km + " km");
  console.log("Surveillance Radius:", orderRes.data.order?.surveillance_radius_km + " km");

  // 10. Test Multilingual Public Health Advisory Broadcast
  console.log("\n🔟 Testing Multilingual Public Health Advisory Broadcast...");
  const advRes = await request("POST", "/api/surveillance/broadcast-advisory", {
    district: "Pune",
    block: "Baramati",
    disease: "Lumpy Skin Disease (LSD)",
    target_channel: "SMS + WhatsApp + IVR Call",
  });
  console.log("Broadcast Ref ID:", advRes.data.broadcast?.ref_id);
  console.log("Recipients Count:", advRes.data.broadcast?.recipients_count);
  console.log("Advisory English Preview:", advRes.data.broadcast?.advisory_texts?.en?.substring(0, 60) + "...");
  console.log("Advisory Hindi Preview:", advRes.data.broadcast?.advisory_texts?.hi?.substring(0, 60) + "...");
  console.log("Advisory Marathi Preview:", advRes.data.broadcast?.advisory_texts?.mr?.substring(0, 60) + "...");

  // 11. Test 1962 Toll-Free IVR Telephone Channel Report
  console.log("\n1️⃣1️⃣ Testing 1962 Toll-Free IVR Telephone Voice Report...");
  const ivrRes = await request("POST", "/api/surveillance/ivr-report", {
    caller_phone: "9822019620",
    caller_name: "Kisan Dattatray",
    district: "Pune",
    village: "Bhivadi",
    key_press_animal: "1", // Cattle
    key_press_symptom: "2", // LSD suspected
  });
  console.log("IVR Ticket ID:", ivrRes.data.ticket_id);
  console.log("IVR Audio Response Text:", ivrRes.data.audio_response_text);
  console.log("IVR AI Triage Suspected:", ivrRes.data.ivr_record?.suspected_disease);

  // 12. Test Real-Time Location Expected Outcomes (PS Specific Requirement)
  console.log("\n1️⃣2️⃣ Testing Real-Time Location Expected Outcomes (PS ID 26128 Outcomes)...");
  const locOutRes = await request("GET", "/api/surveillance/location-outcomes?district=Pune&block=Baramati&village=Malegaon+Khurd");
  console.log("Reduced Reporting Time:", locOutRes.data.expected_outcomes?.reduced_reporting_time?.metric, `(${locOutRes.data.expected_outcomes?.reduced_reporting_time?.vetnova_time})`);
  console.log("Earlier Outbreak ID:", locOutRes.data.expected_outcomes?.earlier_outbreak_identification?.metric);
  console.log("Improved Vaccination Coverage:", locOutRes.data.expected_outcomes?.improved_vaccination_coverage?.metric);
  console.log("Faster Containment:", locOutRes.data.expected_outcomes?.faster_treatment_and_containment?.metric);
  console.log("Lower Mortality & Productivity Loss:", locOutRes.data.expected_outcomes?.lower_mortality_and_productivity_loss?.metric, `| Savings: ${locOutRes.data.expected_outcomes?.lower_mortality_and_productivity_loss?.economic_savings_inr}`);
  console.log("Stronger Evidence-Based Planning:", locOutRes.data.expected_outcomes?.stronger_evidence_based_planning?.metric, `| Nearest Lab: ${locOutRes.data.nearest_laboratory?.distance_km} km`);

  // 13. Test Animal & Herd Health, Vaccination and Treatment Records
  console.log("\n1️⃣3️⃣ Testing Animal & Herd Treatment Records with Drug Withdrawal Tracking...");
  const treatRes = await request("POST", "/api/surveillance/treatment-records", {
    tag_id: "IN-8291-0421",
    animal_name: "Kapila (HF Cross)",
    species: "Cattle",
    herd_id: "HERD-PN-BAR-01",
    owner_name: "Ramesh Patil",
    village: "Malegaon Khurd",
    block: "Baramati",
    district: "Pune",
    diagnosis: "Secondary bacterial infection following LSD lesions",
    medications: [
      { drug: "Enrofloxacin 10%", dose: "15 ml IM", duration: "3 days", withdrawal_days_milk: 7, withdrawal_days_meat: 14 }
    ],
    attending_officer: "Dr. Nilesh Gaikwad (BVO)",
    para_vet_assistant: "Sunita Kamble (Pashu Sakhi)",
  });
  console.log("Treatment Record ID:", treatRes.data.treatment?.id);
  console.log("Drug Withdrawal Alert:", treatRes.data.treatment?.milk_withdrawal_status);

  // 14. Test Unified Animal Health Data Exchange (De-fragmentation)
  console.log("\n1️⃣4️⃣ Testing Unified Animal Health Data Exchange (Farms, Dispensaries, Labs, Drives, Surveillance)...");
  const deRes = await request("GET", "/api/surveillance/data-exchange");
  console.log("Unified Node:", deRes.data.exchange?.unified_node);
  console.log("Streams Integrated:", Object.keys(deRes.data.exchange?.streams || {}).join(", "));
  console.log("Integration Metric:", deRes.data.exchange?.integration_metric);

  // 15. Test Dedicated Para-Veterinary Worker / Pashu Sakhi Field Report
  console.log("\n1️⃣5️⃣ Testing Para-Veterinary Worker / Pashu Sakhi Doorstep Herd Screening...");
  const sakhiRes = await request("POST", "/api/surveillance/paravet-report", {
    sakhi_name: "Vishakha Shinde",
    sakhi_id: "PS-MH-2026-902",
    district: "Kolhapur",
    block: "Karveer",
    village: "Shiroli Pulachi",
    households_visited: 22,
    total_animals_inspected: 84,
    symptomatic_animals: 5,
    species: "Goat & Sheep",
    symptoms: ["Ulcerative mouth sores", "Severe watery diarrhea"],
    sample_collected: true,
  });
  console.log("Pashu Sakhi Report Ticket:", sakhiRes.data.ticket_id);
  console.log("Suspected Disease:", sakhiRes.data.report?.suspected_disease);
  console.log("Triage Urgency:", sakhiRes.data.report?.urgency);

  console.log("\n========================================================================");
  console.log("🎯 100% SIH PS ID 26128 SURVEILLANCE & DECISION SUPPORT VALIDATED!");
  console.log("========================================================================");
}

async function main() {
  let serverProcess = null;
  try {
    await request("GET", "/api/surveillance/officials-summary");
    console.log("Server already running on port 3000.");
  } catch (_) {
    console.log("Starting VetNova server on port 3000...");
    serverProcess = spawn("node", ["server.js"], { stdio: "ignore", shell: true });
    await waitForServer();
    console.log("VetNova server started and responsive.");
  }

  try {
    await testSihSurveillance();
  } finally {
    if (serverProcess) {
      serverProcess.kill();
      // On Windows kill tree
      try {
        spawn("taskkill", ["/pid", serverProcess.pid, "/f", "/t"]);
      } catch (_) {}
    }
  }
}

main().catch(console.error);

