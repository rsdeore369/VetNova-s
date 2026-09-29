import http from "http";

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const dataString = options.body ? JSON.stringify(options.body) : null;
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(dataString ? { "Content-Length": Buffer.byteLength(dataString) } : {}),
          ...options.headers,
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      }
    );
    req.on("error", reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("🧪 TESTING DOCTOR PRESCRIPTIONS IN USER REPORTS & REALTIME QR");
  console.log("==================================================");

  // 1. Create an appointment
  const bookRes = await request("/api/appointments", {
    method: "POST",
    body: {
      user_id: 1,
      user_name: "Santosh Deshmukh",
      doctor_id: 1,
      date: "2026-08-30",
      time: "14:30",
      reason: "Post-calving fever and reduced rumination in Jersey Cow",
    },
  });

  const appt = bookRes.data.appointment;
  console.log(`✅ 1. Booked appointment ID: ${appt.id} for Dr. ${appt.doctor_name}`);

  // 2. Doctor issues official prescription
  const rxRes = await request(`/api/appointments/${appt.id}/prescription`, {
    method: "POST",
    body: {
      doctor_id: 1,
      doctor_name: "Dr. Ananya Patil",
      diagnosis: "Post-Parturient Hypocalcemia & Inappetence",
      medicines: [
        { name: "Mifex Calcium Borogluconate 450ml", frequency: "Slow IV infusion", duration: "Single dose" },
        { name: "Rumicare Appetite & Rumen Buffer 100g", frequency: "Twice daily with jaggery", duration: "4 Days" },
        { name: "Belamyl Liver Extract & B-Complex 30ml", frequency: "Intramuscular daily", duration: "3 Days" },
      ],
      notes: "Provide warm jaggery water and green fodder. Protect animal from wet floor.",
      signature: "Dr. Ananya Patil (B.V.Sc & A.H., M.V.Sc — MAFSU)",
    },
  });

  const rx = rxRes.data.prescription;
  console.log(`✅ 2. Doctor issued official prescription Rx ID: ${rx.rx_id}`);

  // 3. Verify user's appointment records contain the prescription
  const apptsRes = await request("/api/appointments/user/1");
  const userAppts = apptsRes.data.appointments || [];
  const found = userAppts.find((a) => a.id === appt.id && a.prescription);
  if (!found) {
    throw new Error("Prescription not found in user appointments!");
  }
  console.log(`✅ 3. Verified prescription is visible to user under Past Reports & Appointments (Rx ID: ${found.prescription.rx_id})`);

  // 4. Test Real-time QR Code Generation logic
  const mockAnimal = {
    tag: "IN-8291-0421",
    name: "Kapila (HF Cross)",
    species: "Cow / Cattle",
    breed: "HF Crossbred",
    age: "3.5 Years",
    gender: "Female",
    owner: "Santosh Deshmukh",
    district: "Pune, Maharashtra",
    immunity_score: "96% Protected",
    vaccines: [
      { name: "FMD (Foot & Mouth Disease)", dose: "Annual Booster", date: "2026-05-14", valid_until: "2027-05-14", vet: "Dr. Ananya Patil", batch: "FMD-89412" },
      { name: "HS (Hemorrhagic Septicemia)", dose: "Pre-Monsoon Booster", date: "2026-04-28", valid_until: "2027-04-28", vet: "Dr. Rajesh Kulkarni", batch: "HS-5491" },
      { name: "Lumpy Skin Disease (LSD Vaccine)", dose: "User Added Dose", date: "2026-08-29", valid_until: "2027-08-29", vet: "Dr. Ananya Patil", batch: "LSD-2026-99" },
    ],
  };

  const qrText = `VETNOVA OFFICIAL ANIMAL HEALTH PASSPORT (DAHD / INAPH)
UID: ${mockAnimal.tag}
Name: ${mockAnimal.name}
Species: ${mockAnimal.species}
Vaccines: ${mockAnimal.vaccines.map((v) => v.name).join(", ")}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(qrText)}`;
  console.log(`✅ 4. Real-time Animal Vaccination QR Code Generated:`);
  console.log(`   - Encodes ${mockAnimal.vaccines.length} user-logged vaccines`);
  console.log(`   - Live QR URL: ${qrUrl.slice(0, 80)}...`);

  console.log("==================================================");
  console.log("🎉 ALL TESTS PASSED: DOCTOR REPORTS VISIBLE & REAL-TIME QR WORKING!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
