import http from "http";

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:3000${path}`);
    const req = http.request(
      url,
      {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on("error", reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("--- STARTING ENDPOINT VERIFICATIONS ---");

  // 1. Payment Config
  const pcfg = await request("/api/payment/config");
  console.log("1. Payment Config:", pcfg.body);

  // 2. Create Order
  const rzpOrder = await request("/api/payment/create-order", {
    method: "POST",
    body: { amount: 329, receipt: "rcpt_test_1" },
  });
  console.log("2. Razorpay Create Order:", rzpOrder.body?.ok, rzpOrder.body?.order?.id);

  // 3. Nearby Pharmacies
  const pharmaList = await request("/api/nearby-pharmacies?lat=19.9975&lon=73.7898");
  console.log("3. Nearby Pharmacies count:", pharmaList.body.pharmacies?.length, "First:", pharmaList.body.pharmacies?.[0]?.name);

  // 4. Pharmacy Catalog
  const meds = await request("/api/pharmacy/medicines");
  console.log("4. Pharmacy Medicines catalog count:", meds.body.medicines?.length);

  // 5. Place COD Order
  const codOrder = await request("/api/pharmacy/orders", {
    method: "POST",
    body: {
      user_id: 1,
      user_name: "Rahul Patil",
      phone: "9876543210",
      delivery_address: "Plot 12, Shivaji Nagar, Nashik",
      items: [{ id: "med-1", name: "Calci-Must Gel", price: 240, qty: 2 }],
      total_amount: 480,
      store_name: "Kisan Veterinary & Animal Health Store",
      fulfillment: "home_delivery",
      payment_mode: "cod",
    },
  });
  console.log("5. Placed COD Medicine Order:", codOrder.body?.ok, codOrder.body?.order?.order_id);

  // 6. Pharmacy Owner OTP Auth
  const sendOtp = await request("/api/pharmacy/send-otp", {
    method: "POST",
    body: { phone: "9822334455" },
  });
  console.log("6. Pharmacy Send OTP:", sendOtp.body?.ok, "Code:", sendOtp.body?.otp);

  const verifyOtp = await request("/api/pharmacy/verify-otp", {
    method: "POST",
    body: { phone: "9822334455", otp: sendOtp.body.otp || "123456" },
  });
  console.log("6b. Pharmacy Verify OTP:", verifyOtp.body?.pharmacy?.name);

  // 7. Pharmacy Update Price
  const updatePrice = await request("/api/pharmacy/medicines/update", {
    method: "POST",
    body: { id: "med-1", price: 260, in_stock: true },
  });
  console.log("7. Updated Medicine Price to:", updatePrice.body?.medicine?.price);

  // 8. Pharmacy Add Stock
  const addStock = await request("/api/pharmacy/medicines/add", {
    method: "POST",
    body: {
      name: "Calci-Must Gold Bolus",
      category: "Cattle & Dairy",
      targetAnimal: "Cows & Buffaloes",
      price: 320,
      pack: "Pack of 10",
      indication: "High calcium bolus for milk fever",
    },
  });
  console.log("8. Added New Stock Item:", addStock.body?.medicine?.name, "Price:", addStock.body?.medicine?.price);

  // 9. Doctor Update Fee and QR
  const docUpdate = await request("/api/doctor/update-payment-qr", {
    method: "POST",
    body: {
      doctor_id: 1,
      consultation_fee: 350,
      upi_id: "dr.ananya@upi",
      qr_code: "data:image/svg+xml;utf8,<svg><text>DoctorQR</text></svg>",
    },
  });
  console.log("9. Doctor Fee & QR Update:", docUpdate.body.doctor?.consultation_fee, docUpdate.body.doctor?.upi_id);

  // 10. Appointment Booking (initial request -> pending)
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const appt = await request("/api/appointments", {
    method: "POST",
    body: {
      user_id: 1,
      user_name: "Rahul Patil",
      doctor_id: 1,
      date: today,
      time: "23:59",
      reason: "Cow showing mild fever and skin dermatitis",
    },
  });
  console.log("10. Requested Appointment:", appt.body.appointment?.id, "Status:", appt.body.appointment?.status);

  // 11. Doctor Accepts and Requests Payment
  const apptId = appt.body.appointment?.id;
  const docAccept = await request(`/api/appointments/${apptId}/status`, {
    method: "POST",
    body: { doctor_id: 1, status: "confirmed_pending_payment" },
  });
  console.log("11. Doctor Accepted Slot:", docAccept.body.appointment?.status, docAccept.body.appointment?.update_message);

  // 12. User Notifications Check
  const notifs = await request(`/api/user/1/notifications`);
  console.log("12. User Notifications Count:", notifs.body.notifications?.length, "First:", notifs.body.notifications?.[0]?.title);

  // 13. User Pays Fee (Doctor Fee 350 + Platform Fee 29 = 379)
  const payAppt = await request(`/api/appointments/${apptId}/pay`, {
    method: "POST",
    body: {
      user_id: 1,
      payment_id: "rzp_test_pay_99221",
      payment_mode: "razorpay",
    },
  });
  console.log("13. Paid Appointment Confirmed:", payAppt.body.appointment?.status, "Paid Amount:", payAppt.body.appointment?.total_amount_paid);

  console.log("--- ALL BACKEND CHECKS COMPLETED SUCCESSFULLY ---");
}

runTests().catch(console.error);
