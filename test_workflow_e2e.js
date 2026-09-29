// test_workflow_e2e.js - End to End Workflow Verification for VetNova
const baseUrl = "http://localhost:3000";

async function post(endpoint, data) {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, data: json };
}

async function get(endpoint) {
  const res = await fetch(`${baseUrl}${endpoint}`);
  const json = await res.json().catch(() => ({}));
  return { status: res.status, data: json };
}

async function runE2ETests() {
  console.log("==================================================");
  console.log("🚀 STARTING VETNOVA COMPLETE E2E WORKFLOW TEST");
  console.log("==================================================");

  // 1. Health check
  console.log("\n[Step 1] Verifying System Health...");
  const health = await get("/api/health");
  if (!health.data.ok) throw new Error("Server not healthy: " + JSON.stringify(health));
  console.log("✅ Server Health OK!");

  // 2. User creates an Order with Attached AI Diagnosis & Detailed Address
  console.log("\n[Step 2] User Places Medicine Order with Attached AI Diagnosis & Full Address...");
  const orderPayload = {
    user_id: 101,
    user_name: "Santosh Patil (Dairy Farmer)",
    phone: "9822001122",
    fulfillment: "home_delivery",
    address_details: {
      street: "Gat No. 45, Patil Dairy Farm, Gangapur Road",
      landmark: "Near Hanuman Mandir & Water Tank",
      city: "Nashik",
      pincode: "422005",
      phone: "9822001122",
    },
    diagnosis_report: {
      diagnosis: "Strangles (Streptococcus equi in Equines)",
      animal: "Horse / Cattle",
      severity: "high",
      summary: "Swollen submandibular lymph nodes with purulent discharge observed.",
      visible_concerns: ["Purulent nasal discharge", "Lymph node swelling", "Pyrexia"],
      suggested_next_steps: ["Isolate animal immediately", "Administer prescribed antibiotic therapy", "Maintain clean drinking water"],
      medicines: [
        { name: "Procaine Penicillin G Injection", dose: "20,000 IU/kg IM daily" },
        { name: "Meloxicam Anti-inflammatory Bolus", dose: "0.5 mg/kg once daily" }
      ],
      date: new Date().toISOString()
    },
    items: [
      { id: "med-1", name: "Calci-Must Gel 300g", price: 240, qty: 2 },
      { id: "med-3", name: "Lorexane Antiseptic Maggot Spray 100ml", price: 160, qty: 1 }
    ],
    total_amount: 640,
    store_name: "Kisan Veterinary & Animal Health Store",
    payment_mode: "cod",
    prescription_note: "Urgent delivery needed for high-yield dairy cow"
  };

  const createOrderRes = await post("/api/pharmacy/orders", orderPayload);
  if (!createOrderRes.data.ok) throw new Error("Order creation failed: " + JSON.stringify(createOrderRes));
  const order = createOrderRes.data.order;
  console.log("✅ Order Created Successfully:", order.order_id);
  console.log("   - Customer Address:", order.delivery_address);
  console.log("   - Attached Diagnosis:", order.diagnosis_report.diagnosis);
  console.log("   - Security Handover PIN:", order.delivery_pin);
  console.log("   - Initial Delivery Status:", order.delivery_status);

  // 3. Medical Store Dashboard Check & Report Review
  console.log("\n[Step 3] Medical Store Reviews Order & Attached Clinical Report...");
  const storeDash = await get("/api/pharmacy/dashboard/1");
  const foundInStore = (storeDash.data.orders || []).find(o => o.order_id === order.order_id);
  if (!foundInStore) throw new Error("Order not found in store dashboard!");
  if (!foundInStore.diagnosis_report || !foundInStore.diagnosis_report.diagnosis) {
    throw new Error("Diagnosis report missing in store order!");
  }
  console.log("✅ Medical Store received order and verified attached clinical report:", foundInStore.diagnosis_report.diagnosis);

  // 4. Medical Store Marks "Ready to Dispatch"
  console.log("\n[Step 4] Medical Store Packs Medicines and Marks 'Ready to Dispatch'...");
  const dispatchRes = await post(`/api/pharmacy/orders/${order.order_id}/status`, {
    status: "Ready for Pickup (Store Packed)",
    delivery_status: "ready_for_pickup"
  });
  if (!dispatchRes.data.ok) throw new Error("Dispatch update failed: " + JSON.stringify(dispatchRes));
  console.log("✅ Order marked Ready to Dispatch! Status:", dispatchRes.data.order.status);

  // 5. Delivery Partner 1 logs in
  console.log("\n[Step 5] Delivery Partner 1 (Vikas Shinde) Logs in...");
  const otpRes = await post("/api/delivery/send-otp", { phone: "9876501234" });
  const authRes = await post("/api/delivery/verify-otp", { phone: "9876501234", otp: otpRes.data.otp || "123456" });
  const rider1 = authRes.data.rider;
  console.log("✅ Delivery Partner 1 Active:", rider1.name, "(Vehicle: " + rider1.vehicle_number + ")");

  // 6. Delivery Partner 1 queries Available Pickups
  console.log("\n[Step 6] Delivery Partner 1 queries available nearby orders...");
  const availRes = await get("/api/delivery/available-orders");
  const foundInQueue = (availRes.data.orders || []).find(o => o.order_id === order.order_id);
  if (!foundInQueue) throw new Error("Ready-to-dispatch order not found in delivery queue!");
  console.log("✅ Available Orders in Queue:", availRes.data.orders.length, "| Target Order:", foundInQueue.order_id);

  // 7. Delivery Partner 1 Accepts the Order
  console.log("\n[Step 7] Delivery Partner 1 Accepts Order...");
  const acceptRes1 = await post(`/api/delivery/orders/${order.order_id}/accept`, { rider_id: rider1.id });
  if (!acceptRes1.data.ok) throw new Error("Rider 1 accept failed: " + JSON.stringify(acceptRes1));
  console.log("✅ Order Assigned to Rider 1:", acceptRes1.data.order.delivery_partner_name, "Phone:", acceptRes1.data.order.delivery_partner_phone);

  // 8. Delivery Partner 2 tries to accept the SAME order (Should be rejected / 409 conflict)
  console.log("\n[Step 8] Delivery Partner 2 (Sachin Gaikwad) attempts to accept the same order...");
  const acceptRes2 = await post(`/api/delivery/orders/${order.order_id}/accept`, { rider_id: 2 });
  if (acceptRes2.status === 409 || !acceptRes2.data.ok) {
    console.log("✅ Race condition successfully blocked! Response:", acceptRes2.data.error);
  } else {
    throw new Error("Order was incorrectly accepted by a second delivery partner!");
  }

  // 9. Delivery Partner 1 Broadcasts Live GPS Movement
  console.log("\n[Step 9] Delivery Partner 1 broadcasts live GPS movement coordinates...");
  const gpsRes = await post(`/api/delivery/orders/${order.order_id}/location`, {
    rider_id: rider1.id,
    lat: 19.9995,
    lon: 73.7925,
    heading: 90,
    speed: 34
  });
  if (!gpsRes.data.ok) throw new Error("GPS broadcast failed: " + JSON.stringify(gpsRes));
  console.log("✅ Live GPS Broadcast OK:", gpsRes.data);

  // 10. User / Farmer Opens Live Tracking Screen
  console.log("\n[Step 10] User checks Live Customer Satellite Tracking Screen...");
  const trackRes = await get(`/api/delivery/orders/${order.order_id}/track`);
  if (!trackRes.data.ok || !trackRes.data.order) throw new Error("Tracking snapshot failed: " + JSON.stringify(trackRes));
  const tracked = trackRes.data.order;
  console.log("✅ User Tracking Screen Verified:");
  console.log("   - Delivery Partner Name:", tracked.delivery_partner?.name);
  console.log("   - Delivery Partner Phone:", tracked.delivery_partner?.phone);
  console.log("   - Delivery Partner Vehicle:", tracked.delivery_partner?.vehicle);
  console.log("   - Rider Live GPS Coordinates:", tracked.delivery_partner?.location);
  console.log("   - Customer Security Handover PIN:", tracked.delivery_pin);
  console.log("   - Tracking Timeline Steps Count:", (tracked.timeline || []).length);

  // 11. Delivery Partner 1 advances delivery stepper
  console.log("\n[Step 11] Stepper: Rider 1 picks up parcel at store (picked_up)...");
  const step1 = await post(`/api/delivery/orders/${order.order_id}/update-status`, { delivery_status: "picked_up" });
  console.log("✅ Status updated to:", step1.data.order.status);

  console.log("\n[Step 12] Stepper: Rider 1 is out for doorstep delivery (out_for_delivery)...");
  const step2 = await post(`/api/delivery/orders/${order.order_id}/update-status`, { delivery_status: "out_for_delivery" });
  console.log("✅ Status updated to:", step2.data.order.status);

  console.log("\n[Step 13] Stepper: Rider 1 handovers medicines to customer (delivered)...");
  const step3 = await post(`/api/delivery/orders/${order.order_id}/update-status`, { delivery_status: "delivered" });
  console.log("✅ Status updated to:", step3.data.order.status);

  // 12. Instant UPI Payout
  console.log("\n[Step 14] Rider 1 requests Instant UPI Payout...");
  const payoutRes = await post("/api/delivery/payout", { rider_id: rider1.id, amount: 65 });
  if (!payoutRes.data.ok) throw new Error("Payout failed: " + JSON.stringify(payoutRes));
  console.log("✅ Instant Payout Transferred: ₹" + payoutRes.data.amount + " to " + payoutRes.data.upi_id + " (ID: " + payoutRes.data.payout_id + ")");

  console.log("\n==================================================");
  console.log("🎉 ALL E2E WORKFLOW TESTS PASSED PERFECTLY!");
  console.log("==================================================");
}

runE2ETests().catch((err) => {
  console.error("❌ E2E Test Failed:", err);
  process.exit(1);
});
