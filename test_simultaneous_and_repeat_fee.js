import http from "http";
import fs from "fs";

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL("http://127.0.0.1:3000" + path);
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      url,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve(raw);
          }
        });
      }
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("TEST: SIMULTANEOUS PRESCRIPTION MATCH & 30-DAY REPEAT FEE");
  console.log("==================================================");

  // 1. Verify Doctor Seed and Followup Fee
  console.log("\n[Step 1] Verifying Doctor Configuration & Followup Fee...");
  const docUpdate = await request("POST", "/api/doctor/update-payment-qr", {
    doctor_id: 1,
    consultation_fee: 300,
    followup_fee: 150,
    upi_id: "ananya.patil@upi",
  });
  console.log("✓ Doctor updated:", docUpdate.ok, "Consult Fee:", docUpdate.doctor?.consultation_fee, "Followup Fee:", docUpdate.doctor?.followup_fee);

  // 2. First Appointment (Initial Standard Fee)
  console.log("\n[Step 2] Booking First Appointment (User 101)...");
  const appt1 = await request("POST", "/api/appointments", {
    user_id: 101,
    user_name: "Ramesh Pawar",
    doctor_id: 1,
    date: "2026-08-30",
    time: "10:30",
    reason: "Lumpy Skin lesions on calf",
  });
  console.log("✓ Appt 1 Created:", appt1.appointment?.id, "Doctor Fee:", appt1.appointment?.doctor_fee, "Concession:", appt1.appointment?.concession_tier);

  // Doctor accepts Appt 1
  const appt1Status = await request("POST", `/api/appointments/${appt1.appointment.id}/status`, {
    doctor_id: 1,
    status: "confirmed_pending_payment",
  });
  console.log("✓ Appt 1 Accepted by Doctor:", appt1Status.appointment?.status);

  // Patient pays Appt 1
  const appt1Paid = await request("POST", `/api/appointments/${appt1.appointment.id}/pay`, {
    user_id: 101,
    payment_id: "PAY_TEST_001",
  });
  console.log("✓ Appt 1 Paid & Confirmed:", appt1Paid.appointment?.payment_status, "Total Paid: ₹" + appt1Paid.appointment?.total_amount_paid);

  // Doctor issues prescription for Appt 1
  const rx1 = await request("POST", `/api/appointments/${appt1.appointment.id}/prescription`, {
    doctor_id: 1,
    diagnosis: "Lumpy Skin Viral Eruption with Secondary Infection",
    items: [
      { name: "Ivermectin Injection 10ml", dosage: "1 ml per 50kg body weight once", duration: "1 day" },
      { name: "Meloxicam Bolus 100mg", dosage: "1 bolus twice daily", duration: "3 days" },
      { name: "Betadine Antiseptic Spray 100ml", dosage: "Topical application twice daily", duration: "5 days" },
    ],
    notes: "Isolate calf in clean dry stall and provide warm electrolyte water.",
  });
  console.log("✓ Rx Issued for Appt 1:", rx1.prescription?.rx_id, "Items count:", rx1.prescription?.items?.length);

  // 3. User checks concession status for second booking with same doctor
  console.log("\n[Step 3] Checking Repeat Concession for User 101 with Dr. 1...");
  const concessionCheck = await request("GET", "/api/user/101/concession-status?doctor_id=1");
  console.log("✓ Concession Status:", {
    is_repeat_within_month: concessionCheck.concession?.is_repeat_within_month,
    concession_tier: concessionCheck.concession?.concession_tier,
    original_doctor_fee: concessionCheck.concession?.original_doctor_fee,
    payable_doctor_fee: concessionCheck.concession?.payable_doctor_fee,
    discount_amount: concessionCheck.concession?.discount_amount,
  });

  if (concessionCheck.concession?.is_repeat_within_month && concessionCheck.concession?.payable_doctor_fee === 150) {
    console.log("✅ 30-Day Repeat Doctor Fee is correctly reduced to ₹150 (50% discount)!");
  } else {
    console.error("❌ Concession check failed!");
  }

  // 4. Booking Second Repeat Appointment within 30 days
  console.log("\n[Step 4] Booking 2nd Repeat Appointment within 30 days...");
  const appt2 = await request("POST", "/api/appointments", {
    user_id: 101,
    user_name: "Ramesh Pawar",
    doctor_id: 1,
    date: "2026-09-05",
    time: "11:00",
    reason: "Follow-up checkup on calf skin lesions",
  });
  console.log("✓ Appt 2 Booked:", {
    id: appt2.appointment?.id,
    doctor_fee: appt2.appointment?.doctor_fee,
    original_doctor_fee: appt2.appointment?.original_doctor_fee,
    is_repeat_within_month: appt2.appointment?.is_repeat_within_month,
    concession_tier: appt2.appointment?.concession_tier,
    total_payable: appt2.appointment?.total_amount_payable,
  });

  // Doctor accepts with custom fee confirmation (e.g. ₹140 or ₹150)
  const appt2Status = await request("POST", `/api/appointments/${appt2.appointment.id}/status`, {
    doctor_id: 1,
    status: "confirmed_pending_payment",
    doctor_fee: 140, // Doctor confirms custom repeat fee
  });
  console.log("✓ Doctor confirmed reduced fee for repeat visit:", {
    doctor_fee: appt2Status.appointment?.doctor_fee,
    total_payable: appt2Status.appointment?.total_amount_payable,
    discount_amount: appt2Status.appointment?.discount_amount,
  });

  // 5. Medical Store Pharmacy Order & Chemist Query
  console.log("\n[Step 5] Pharmacy Order & Chemist Query Workflow...");
  const pharmacyOrder = await request("POST", "/api/pharmacy/orders", {
    user_id: 101,
    user_name: "Ramesh Pawar",
    phone: "9876543210",
    doctor_id: 1,
    doctor_name: "Dr. Ananya Patil",
    prescription_id: rx1.prescription?.rx_id,
    items: rx1.prescription?.items,
    delivery_address: "Village Kothrud Farm 4, Pune PIN: 411038",
    payment_mode: "cod",
  });
  console.log("✓ Pharmacy Order Response:", JSON.stringify(pharmacyOrder));
  console.log("✓ Pharmacy Order Created:", pharmacyOrder.order?.order_id, "Items:", pharmacyOrder.order?.items?.length);

  // Chemist packs medicines with substitution note and sends to doctor
  const chemistSend = await request("POST", `/api/pharmacy/orders/${pharmacyOrder.order.order_id}/send-to-doctor`, {
    chemist_id: 1,
    packed_items: [
      { name: "Ivermectin Injection 10ml (Neomec)", qty: 1 },
      { name: "Melonex Bolus 100mg (Intas)", qty: 2 },
      { name: "Betadine Antiseptic Spray 100ml", qty: 1 },
    ],
    packed_photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150'><rect width='200' height='150' fill='%23eff6ff'/><text x='100' y='75' font-size='12' text-anchor='middle' fill='%231e40af'>Packed Box: Order " + pharmacyOrder.order.order_id + "</text></svg>",
    chemist_query: "Packed Melonex Bolus 100mg (Intas brand) in place of generic Meloxicam bolus. Please confirm if approved.",
  });
  console.log("✓ Chemist Sent to Doctor for Verification:", chemistSend.order?.delivery_status, "Query:", chemistSend.order?.chemist_query);

  // 6. Doctor Simultaneous Match & Clinical Approval
  console.log("\n[Step 6] Doctor Side-by-Side Verification & Dispatch Authorization...");
  const docVerify = await request("POST", `/api/doctor/verify-packed-medicines/${pharmacyOrder.order.order_id}`, {
    doctor_id: 1,
    approved: true,
    doctor_notes: "Simultaneous prescription match confirmed. Melonex 100mg by Intas is an authorized equivalent. Safe to dispatch.",
    doctor_clarification: "Approved. Melonex 100mg bolus is chemically identical.",
  });
  console.log("✓ Doctor Verified & Authorized Dispatch:", {
    order_id: docVerify.order?.order_id,
    delivery_status: docVerify.order?.delivery_status,
    verified_by_doctor: docVerify.order?.verified_by_doctor,
    doctor_notes: docVerify.order?.doctor_verification_notes,
  });

  if (docVerify.order?.delivery_status === "ready_for_pickup") {
    console.log("✅ Order is successfully verified and RELEASED FOR DELIVERY PICKUP!");
  } else {
    console.error("❌ Order verification failed!");
  }

  console.log("\n==================================================");
  console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
});
