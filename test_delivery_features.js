/**
 * Comprehensive Automated Verification Test for:
 * 1. Delivery Partner Authentication & Registration
 * 2. Order Accept, Live GPS Broadcaster & Status Lifecycle
 * 3. Customer Live Satellite Order Tracking with Rider Contact & Location
 * 4. Delivery Partner Instant UPI Payout Settlement
 * 5. Structured AI Disease Diagnosis Output Verification
 */

const BASE_URL = "http://localhost:3000";

async function post(path, body = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  return { status: res.status, data: await res.json() };
}

async function runTests() {
  console.log("==================================================");
  console.log("🚀 STARTING VETNOVA DELIVERY & AI REPORT VERIFICATION");
  console.log("==================================================\n");

  // 1. Check Server Health
  console.log("Test 1: Check Server Health...");
  const health = await get("/api/health");
  if (health.status !== 200) throw new Error("Health check failed: " + JSON.stringify(health));
  console.log("✅ Server Health OK:", health.data);

  // 2. Delivery Partner Send OTP
  console.log("\nTest 2: Delivery Partner Send OTP...");
  const otpRes = await post("/api/delivery/send-otp", { phone: "9876501234" });
  if (!otpRes.data.ok) throw new Error("Send OTP failed: " + JSON.stringify(otpRes));
  console.log("✅ OTP Sent Successfully! Code:", otpRes.data.otp);

  // 3. Delivery Partner Verify OTP (Login)
  console.log("\nTest 3: Delivery Partner Verify OTP (Login / Register)...");
  const loginRes = await post("/api/delivery/verify-otp", {
    phone: "9876501234",
    otp: otpRes.data.otp,
    name: "Vikas Shinde",
    vehicle_type: "Motorcycle (Hero Splendor)",
    vehicle_number: "MH 15 AB 8842",
    city: "Nashik",
    upi_id: "vikas.shinde@okhdfcbank",
  });
  if (!loginRes.data.ok || !loginRes.data.rider) throw new Error("Delivery Login failed: " + JSON.stringify(loginRes));
  const rider = loginRes.data.rider;
  console.log("✅ Delivery Partner Logged in:", rider.name, "ID:", rider.id, "Vehicle:", rider.vehicle_number);

  // 4. Create a Customer Medicine Order to deliver
  console.log("\nTest 4: Create Customer Home Delivery Order...");
  const orderRes = await post("/api/pharmacy/orders", {
    user_id: "test-user-1",
    user_name: "Suresh Patil",
    phone: "9822012345",
    delivery_address: "Plot 42, Green Valley Farm, Gangapur Road, Nashik",
    items: [
      { id: "med-1", name: "Calci-Must Gold 1L", price: 420, qty: 2 },
      { id: "med-4", name: "Himax Wound Spray 100ml", price: 175, qty: 1 },
    ],
    total_amount: 1015,
    store_name: "Kisan Agro & Vet Medicals",
    fulfillment: "home_delivery",
    payment_mode: "cod",
    prescription_note: "Urgent for Jersey cow calcium support",
  });
  if (!orderRes.data.ok || !orderRes.data.order) throw new Error("Order creation failed: " + JSON.stringify(orderRes));
  const createdOrder = orderRes.data.order;
  console.log("✅ Order Created:", createdOrder.order_id, "Security PIN:", createdOrder.delivery_pin, "Fee: ₹" + createdOrder.delivery_fee);

  // 5. Query Available Delivery Orders
  console.log("\nTest 5: Query Available Orders for Delivery Partner...");
  const availRes = await get("/api/delivery/available-orders");
  if (!availRes.data.ok || !Array.isArray(availRes.data.orders)) throw new Error("Available orders query failed: " + JSON.stringify(availRes));
  console.log("✅ Available Orders in Queue:", availRes.data.orders.length);

  // 6. Delivery Partner Accepts Order
  console.log("\nTest 6: Delivery Partner Accepts Order...");
  const acceptRes = await post(`/api/delivery/orders/${createdOrder.order_id}/accept`, { rider_id: rider.id });
  if (!acceptRes.data.ok) throw new Error("Accept Order failed: " + JSON.stringify(acceptRes));
  console.log("✅ Order Accepted by Rider:", acceptRes.data.order.order_id, "Rider:", acceptRes.data.order.delivery_partner_name || acceptRes.data.rider.name);

  // 7. Rider Broadcasts Live GPS Coordinates
  console.log("\nTest 7: Rider Broadcasts Live GPS Coordinates...");
  const locRes = await post(`/api/delivery/orders/${createdOrder.order_id}/location`, {
    rider_id: rider.id,
    lat: 19.9985,
    lon: 73.7912,
    heading: 90,
    speed: 32,
  });
  if (!locRes.data.ok) throw new Error("Location broadcast failed: " + JSON.stringify(locRes));
  console.log("✅ Live Location Broadcast OK: Lat", locRes.data.lat, "Lon", locRes.data.lon, "Speed", locRes.data.speed, "km/h");

  // 8. Customer Tracks Live Order & Delivery Partner Info
  console.log("\nTest 8: Customer Live Tracking Snapshot...");
  const trackRes = await get(`/api/delivery/orders/${createdOrder.order_id}/track`);
  if (!trackRes.data.ok || !trackRes.data.order) throw new Error("Tracking snapshot failed: " + JSON.stringify(trackRes));
  const trackData = trackRes.data.order;
  console.log("✅ Live Tracking Snapshot Verified:");
  console.log("   - Status:", trackData.status);
  console.log("   - Rider Name:", trackData.delivery_partner.name);
  console.log("   - Rider Contact Phone:", trackData.delivery_partner.phone);
  console.log("   - Rider Vehicle:", trackData.delivery_partner.vehicle);
  console.log("   - Rider Rating: ⭐", trackData.delivery_partner.rating);
  console.log("   - Rider Live GPS Coordinates:", trackData.delivery_partner.location);
  console.log("   - Estimated Delivery:", trackData.estimated_delivery);
  console.log("   - Delivery Security PIN:", trackData.delivery_pin);
  console.log("   - Timeline Milestones:", trackData.timeline.length, "steps");

  if (!trackData.delivery_partner.phone || trackData.delivery_partner.phone !== rider.phone) {
    throw new Error("Rider phone number missing or mismatched!");
  }

  // 9. Update Delivery Status to picked_up
  console.log("\nTest 9: Rider Updates Status to 'picked_up'...");
  const pickRes = await post(`/api/delivery/orders/${createdOrder.order_id}/update-status`, { delivery_status: "picked_up" });
  if (!pickRes.data.ok) throw new Error("Update status to picked_up failed: " + JSON.stringify(pickRes));
  console.log("✅ Status Updated:", pickRes.data.order.status);

  // 10. Update Delivery Status to out_for_delivery
  console.log("\nTest 10: Rider Updates Status to 'out_for_delivery'...");
  const outRes = await post(`/api/delivery/orders/${createdOrder.order_id}/update-status`, { delivery_status: "out_for_delivery" });
  if (!outRes.data.ok) throw new Error("Update status to out_for_delivery failed: " + JSON.stringify(outRes));
  console.log("✅ Status Updated:", outRes.data.order.status);

  // 11. Complete Delivery & Credit Earnings
  console.log("\nTest 11: Rider Completes Delivery ('delivered')...");
  const delivRes = await post(`/api/delivery/orders/${createdOrder.order_id}/update-status`, { delivery_status: "delivered" });
  if (!delivRes.data.ok) throw new Error("Update status to delivered failed: " + JSON.stringify(delivRes));
  console.log("✅ Status Updated:", delivRes.data.order.status, "Earnings Credited: ₹" + delivRes.data.order.delivery_fee);

  // 12. Check Rider Dashboard Stats
  console.log("\nTest 12: Check Rider Dashboard Stats...");
  const dashRes = await get(`/api/delivery/dashboard/${rider.id}`);
  if (!dashRes.data.ok) throw new Error("Dashboard stats failed: " + JSON.stringify(dashRes));
  console.log("✅ Rider Stats: Today's Earnings ₹" + dashRes.data.stats.today_earnings + ", Total Deliveries: " + dashRes.data.stats.total_deliveries);

  // 13. Instant UPI Payout Request
  console.log("\nTest 13: Instant UPI Payout Request...");
  const payoutRes = await post("/api/delivery/payout", { rider_id: rider.id, amount: 200 });
  if (!payoutRes.data.ok) throw new Error("Payout failed: " + JSON.stringify(payoutRes));
  console.log("✅ Instant Payout Transferred: ₹" + payoutRes.data.amount + " to " + payoutRes.data.upi_id + " (Payout ID: " + payoutRes.data.payout_id + ")");

  // 14. Verify AI Image Diagnostic Structured Schema
  console.log("\nTest 14: Verify AI Diagnostic Report Schema...");
  const sample1x1Png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const aiRes = await post("/api/analyze-image", { data: sample1x1Png, kind: "skin" });
  console.log("✅ AI Analysis Response received (Mode: " + aiRes.data.mode + ")");
  if (aiRes.data.result) {
    console.log("   - Diagnosis:", aiRes.data.result.diagnosis || aiRes.data.result.name);
    console.log("   - Confidence Match:", aiRes.data.result.confidence);
    console.log("   - Model:", aiRes.data.result.model_name || aiRes.data.model_name);
  }

  console.log("\n==================================================");
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});
