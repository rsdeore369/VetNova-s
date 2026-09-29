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
  console.log("🧪 TESTING PRESCRIPTION VIEW, DOWNLOAD & DIRECT SEND");
  console.log("==================================================");

  // 1. Create an appointment
  const bookRes = await request("/api/appointments", {
    method: "POST",
    body: {
      user_id: 1,
      user_name: "Santosh Deshmukh",
      doctor_id: 1,
      date: "2026-08-30",
      time: "11:00",
      reason: "Bovine mastitis symptoms and swelling in udder",
    },
  });

  if (bookRes.status !== 200 || !bookRes.data.appointment) {
    throw new Error("Failed to create appointment: " + JSON.stringify(bookRes.data));
  }
  const appt = bookRes.data.appointment;
  console.log(`✅ 1. Booked appointment ID: ${appt.id} for Dr. ${appt.doctor_name}`);

  // 2. Doctor issues prescription
  const rxRes = await request(`/api/appointments/${appt.id}/prescription`, {
    method: "POST",
    body: {
      doctor_id: 1,
      doctor_name: "Dr. Ananya Patil",
      diagnosis: "Acute Clinical Bovine Mastitis",
      medicines: [
        { name: "Ceftiofur Sodium Injection 1g", frequency: "Once daily intramammary", duration: "3 Days" },
        { name: "Meloxicam Anti-inflammatory 100ml", frequency: "Twice daily with feed", duration: "5 Days" },
        { name: "Vitamin H & Selenium Udder Tonic", frequency: "10ml daily", duration: "10 Days" },
      ],
      notes: "Clean teat orifices with antiseptic solution before infusion. Ensure dry bedding.",
      signature: "Dr. Ananya Patil (B.V.Sc & A.H., M.V.Sc — MAFSU)",
    },
  });

  if (rxRes.status !== 200 || !rxRes.data.prescription) {
    throw new Error("Failed to issue prescription: " + JSON.stringify(rxRes.data));
  }
  const rx = rxRes.data.prescription;
  console.log(`✅ 2. Doctor issued official prescription: Rx ID ${rx.rx_id}`);
  console.log(`   - Diagnosis: ${rx.diagnosis}`);
  console.log(`   - Prescribed Medicines: ${(rx.medicines || []).map((m) => m.name).join(", ")}`);
  console.log(`   - Signature: ${rx.signature}`);

  // 3. User views prescription in appointments
  const userApptsRes = await request("/api/appointments/user/1");
  const foundAppt = (userApptsRes.data.appointments || []).find((a) => a.id === appt.id);
  if (!foundAppt || !foundAppt.prescription) {
    throw new Error("Prescription not found on user appointment fetch!");
  }
  console.log(`✅ 3. Patient successfully retrieved prescription for display & download (Rx ID: ${foundAppt.prescription.rx_id})`);

  // 4. User sends prescription & inquiry directly to doctor
  const sendRes = await request("/api/prescription/send-to-doctor", {
    method: "POST",
    body: {
      prescription_id: rx.rx_id,
      doctor_id: 1,
      doctor_name: "Dr. Ananya Patil",
      user_id: 1,
      user_name: "Santosh Deshmukh",
      patient_phone: "9876543210",
      message: "Dr. Ananya, should I administer the Vitamin H tonic in the morning or evening feed? Please advise.",
    },
  });

  if (sendRes.status !== 200 || !sendRes.data.ok) {
    throw new Error("Failed to send prescription inquiry directly to doctor: " + JSON.stringify(sendRes.data));
  }
  console.log(`✅ 4. Patient sent prescription inquiry directly to Dr. Ananya Patil:`);
  console.log(`   - Query ID: ${sendRes.data.query.id}`);
  console.log(`   - Message: "${sendRes.data.query.message}"`);
  console.log(`   - Status: ${sendRes.data.query.status}`);
  console.log(`   - Doctor WhatsApp / Mobile: +91 ${sendRes.data.doctor_phone}`);

  console.log("==================================================");
  console.log("🎉 ALL PRESCRIPTION VIEW, DOWNLOAD & DIRECT SEND TESTS PASSED!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
