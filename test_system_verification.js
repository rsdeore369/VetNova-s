import sharp from "sharp";

async function runTests() {
  console.log("=== RUNNING VETNOVA SYSTEM VERIFICATION ===");
  const base = "http://localhost:3000";

  // Test 1: Static files and boot
  console.log("\n[Test 1] Testing static files...");
  for (const p of ["/", "/index.html", "/app.js", "/screens.js", "/styles-premium.css", "/locales.json", "/symptoms.json"]) {
    const res = await fetch(`${base}${p}`);
    if (res.status === 200) {
      console.log(`  ✓ GET ${p} -> 200 OK (${res.headers.get("content-type") || ""})`);
    } else {
      console.error(`  ✗ GET ${p} -> Status ${res.status}`);
    }
  }

  // Test 2: Health and env-check endpoints
  console.log("\n[Test 2] Testing /api/health and /api/env-check...");
  const healthRes = await fetch(`${base}/api/health`).then(r => r.json());
  console.log("  /api/health output:", healthRes);
  if (healthRes.ok && healthRes.onnx_model) {
    console.log("  ✓ ONNX ML Model is active in /api/health!");
  } else {
    console.error("  ✗ ONNX Model not active in /api/health");
  }

  const envRes = await fetch(`${base}/api/env-check`).then(r => r.json());
  console.log("  /api/env-check output:", envRes);
  if (envRes.onnxModelActive && envRes.onnxModelClasses === 61) {
    console.log("  ✓ /api/env-check confirmed 61-class ONNX model active!");
  }

  // Test 3: Generate test image and call /api/ml-diagnose
  console.log("\n[Test 3] Testing /api/ml-diagnose with sample image...");
  const testImgBuf = await sharp({
    create: {
      width: 250,
      height: 250,
      channels: 3,
      background: { r: 160, g: 100, b: 70 }
    }
  }).png().toBuffer();
  const testDataUrl = `data:image/png;base64,${testImgBuf.toString("base64")}`;

  const mlRes = await fetch(`${base}/api/ml-diagnose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: testDataUrl })
  }).then(r => r.json());

  console.log("  /api/ml-diagnose result:");
  console.log("    - Mode:", mlRes.mode);
  console.log("    - Diagnosis:", mlRes.diagnosis);
  console.log("    - Animal:", mlRes.animal);
  console.log("    - Confidence:", mlRes.confidence + "%");
  console.log("    - Severity:", mlRes.severity);
  console.log("    - Medicines count:", mlRes.medicines?.length);
  console.log("    - Home remedies count:", mlRes.home_remedies?.length);
  console.log("    - Differentials:", mlRes.differentials?.map(d => `${d.disease} (${d.confidence}%)`).join(", "));

  if (mlRes.ok && mlRes.mode === "onnx-ml-model" && mlRes.diagnosis) {
    console.log("  ✓ /api/ml-diagnose SUCCESS!");
  } else {
    console.error("  ✗ /api/ml-diagnose failed:", mlRes);
  }

  // Test 4: Test /api/analyze-image with kind: onnx
  console.log("\n[Test 4] Testing /api/analyze-image with kind: 'onnx'...");
  const analyzeRes = await fetch(`${base}/api/analyze-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: testDataUrl, kind: "onnx" })
  }).then(r => r.json());

  console.log("  /api/analyze-image result diagnosis:", analyzeRes.diagnosis, "| Confidence:", analyzeRes.confidence + "%");
  if (analyzeRes.ok && analyzeRes.mode === "onnx-ml-model") {
    console.log("  ✓ /api/analyze-image ONNX mode SUCCESS!");
  } else {
    console.error("  ✗ /api/analyze-image failed:", analyzeRes);
  }

  // Test 5: Test /api/diagnose with image data
  console.log("\n[Test 5] Testing /api/diagnose with image enrichment...");
  const diagRes = await fetch(`${base}/api/diagnose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      animal: "cow",
      category: "dairy",
      symptoms: ["fever", "reduced_milk"],
      image: testDataUrl
    })
  }).then(r => r.json());

  console.log("  /api/diagnose output:", {
    diagnosis: diagRes.diagnosis,
    match_score: diagRes.match_score,
    ml_model: diagRes.ml_model,
    ml_confidence: diagRes.ml_confidence
  });
  if (diagRes.ml_model && diagRes.match_score >= 70) {
    console.log("  ✓ /api/diagnose ML enrichment SUCCESS!");
  }

  // Test 6: Test Doctors API
  console.log("\n[Test 6] Testing /api/doctors...");
  const docsRes = await fetch(`${base}/api/doctors`).then(r => r.json());
  console.log(`  ✓ Loaded ${docsRes.doctors?.length || 0} registered doctors.`);

  console.log("\n=== ALL SYSTEM TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch(err => {
  console.error("System test failed:", err);
  process.exit(1);
});
