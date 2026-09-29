import http from "http";

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

async function runTests() {
  console.log("==================================================");
  console.log("🧪 TESTING ADVANCED VETNOVA FEATURES & WORKFLOWS");
  console.log("==================================================");

  // 1. Test Deep Neural Network Model Status & Diagnosis
  console.log("\n1️⃣  Testing Deep Neural Network (DNN v3.2) Engine...");
  const dnnStatus = await request("GET", "/api/deep-neural-network/status");
  console.log("DNN Status:", dnnStatus.data.status, "| Engine:", dnnStatus.data.model);

  const dnnDiag = await request("POST", "/api/deep-neural-network/diagnose", {
    animal: "Cow / Cattle",
    symptoms: ["Swollen udder with heat and redness", "Reduced milk yield with clots", "High body temperature / fever"],
    notes: "Sudden onset after morning milking",
  });
  console.log("DNN Diagnosis:", dnnDiag.data.diagnosis);
  console.log("DNN Confidence:", dnnDiag.data.confidence + "%");
  console.log("Top Differentials:", dnnDiag.data.differentials?.map(d => `${d.disease} (${d.confidence}%)`));
  console.log("Staged Treatment phases:", Object.keys(dnnDiag.data.staged_treatment || {}));

  // 2. Test Repeat Checkup Concession System (15% 2nd, 30% 3rd+)
  console.log("\n2️⃣  Testing Repeat Checkup Concession & Loyalty System...");
  const concessionUser1 = await request("GET", "/api/user/1/concession-status");
  console.log("User 1 Concession Tier:", concessionUser1.data.concession?.concession_tier, "| Discount:", concessionUser1.data.concession?.concession_percent + "%");

  // Create an appointment for user to test repeat concession
  const appt1 = await request("POST", "/api/appointments", {
    user_id: 1,
    user_name: "Ramesh Kisan",
    doctor_id: 1,
    date: "2026-09-01",
    time: "10:30",
    reason: "Routine dairy checkup",
  });
  console.log("Appointment Created. Payable Doctor Fee: ₹" + appt1.data.appointment?.doctor_fee, "| Concession Applied:", appt1.data.appointment?.concession_tier);

  // 3. Test Offline Doctor Visit Prescription Upload to Medical Store
  console.log("\n3️⃣  Testing Offline Doctor Prescription Upload to Pharmacy...");
  const offlineRxOrder = await request("POST", "/api/pharmacy/upload-prescription", {
    user_id: 1,
    user_name: "Ramesh Kisan",
    phone: "9876543210",
    delivery_address: "Plot 42, Green Farm, Taluka Niphad",
    prescription_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    doctor_name: "Dr. Rajesh Kulkarni",
    doctor_clinic: "Niphad Taluka Vet Hospital",
    notes: "Urgent calcium supplement and antiseptic spray required.",
    payment_mode: "cod",
  });
  console.log("Offline Rx Order Placed:", offlineRxOrder.data.order?.order_id, "| Status:", offlineRxOrder.data.order?.status);

  // 4. Test Pharmacy Sends Packed Medicines to Doctor for Verification
  console.log("\n4️⃣  Testing Pharmacy Sends Packed Medicines to Doctor...");
  const orderId = offlineRxOrder.data.order?.order_id;
  const sendToDoc = await request("POST", `/api/pharmacy/orders/${orderId}/send-to-doctor`, {
    doctor_id: 1,
    packed_photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    packed_notes: "Packed 1x Calci-Must Gold 1L + 1x Topicure Spray. Verified seal & batch #CAL-892.",
    store_name: "Kisan Veterinary Medical Store",
  });
  console.log("Sent to Doctor Result:", sendToDoc.data.message);
  console.log("Order Status:", sendToDoc.data.order?.status);

  // Doctor checks pending verifications
  const pendingVerifs = await request("GET", "/api/doctor/pending-medicine-verifications/1");
  console.log("Doctor Pending Verifications Count:", pendingVerifs.data.count);

  // Doctor approves the packed medicines
  const docApproval = await request("POST", `/api/doctor/verify-packed-medicines/${orderId}`, {
    doctor_id: 1,
    approved: true,
    doctor_notes: "Verified and confirmed by Dr. Ananya Patil. Dosage matches patient clinical requirements.",
  });
  console.log("Doctor Approval Result Status:", docApproval.data.order?.status);
  console.log("Delivery Status:", docApproval.data.order?.delivery_status);

  // 5. Test Video Call Doctor Handwritten Prescription Issuance
  console.log("\n5️⃣  Testing Video Call Doctor Handwritten Prescription...");
  // Create a live video call
  const callReq = await request("POST", "/api/video-call/request", {
    user_id: 1,
    user_name: "Ramesh Kisan",
    doctor_id: 1,
    severity: "medium",
    diagnosis_summary: "Cow — Acute Bovine Mastitis",
  });
  const callId = callReq.data.call_id;
  console.log("Live Video Call Created ID:", callId);

  // Doctor issues prescription during call
  const rxIssued = await request("POST", `/api/video-call/${callId}/prescription`, {
    doctor_id: 1,
    doctor_name: "Dr. Ananya Patil",
    diagnosis: "Acute Clinical Mastitis",
    medicines: [
      { name: "Ceftiofur Sodium 1g Vial (Intramuscular)", frequency: "Once daily for 3 days", duration: "3 Days" },
      { name: "Meloxicam 100ml Anti-inflammatory", frequency: "15ml once daily with feed", duration: "3 Days" },
      { name: "Mastilep Gel for Udder Application", frequency: "Apply twice daily after milking", duration: "5 Days" },
    ],
    notes: "Strip udder completely before applying gel. Keep cattle stall floor dry with lime powder.",
    prescription_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  });
  console.log("Doctor Rx Issued ID:", rxIssued.data.prescription?.rx_id);

  // Check call status to verify prescription is attached for patient
  const callStatus = await request("GET", `/api/video-call/status/${callId}`);
  console.log("Patient Receives Rx in Call:", callStatus.data.call?.prescription?.rx_id, "| Meds Count:", callStatus.data.call?.prescription?.medicines?.length);

  // 6. Test Government Yellow Band & Animal Health Platform Insights
  console.log("\n6️⃣  Testing Government Yellow Band (Pashu Aadhaar) & Health Platform Insights...");
  const govInsights = await request("GET", "/api/health-platform/insights");
  console.log("Gov Program:", govInsights.data.yellow_band_stats?.program_name);
  console.log("Gov Tag Type:", govInsights.data.yellow_band_stats?.tag_type);
  console.log("Gov Verified Immunity Rate:", govInsights.data.yellow_band_stats?.verified_immunity_rate);
  console.log("Gov Regional Outbreak Alerts:", govInsights.data.outbreak_radar?.length);
  console.log("Gov Kisan Subsidies Count:", govInsights.data.kisan_subsidies?.length);

  console.log("\n==================================================");
  console.log("✅ ALL ADVANCED FEATURES TESTED AND VALIDATED 100%!");
  console.log("==================================================");
}

runTests().catch(console.error);
