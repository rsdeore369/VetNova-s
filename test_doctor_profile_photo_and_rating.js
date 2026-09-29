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
  console.log("🧪 TESTING DOCTOR PROFILE, PHOTO UPLOAD & RATINGS");
  console.log("==================================================");

  // 1. Fetch doctors list
  const docsRes = await request("/api/doctors");
  if (docsRes.status !== 200 || !docsRes.data.doctors || docsRes.data.doctors.length === 0) {
    throw new Error("Failed to fetch doctors: " + JSON.stringify(docsRes.data));
  }
  console.log(`✅ 1. Successfully fetched ${docsRes.data.doctors.length} seeded veterinarians.`);
  
  const doc1 = docsRes.data.doctors[0];
  console.log(`   Doctor 1: ${doc1.name}`);
  console.log(`   - Avatar/Photo present: ${Boolean(doc1.avatar)}`);
  console.log(`   - Degree Qualifications: ${doc1.degree_name}`);
  console.log(`   - VCI Registration: ${doc1.vci_registration_number}`);
  console.log(`   - Degree Certificate Document: ${Boolean(doc1.degree_document)}`);
  console.log(`   - Clinic Name: ${doc1.clinic_name}`);
  console.log(`   - 1st Visit Fee: ₹${doc1.consultation_fee}, Repeat Visit Fee: ₹${doc1.followup_fee}`);
  console.log(`   - Rating: ⭐ ${doc1.rating} (${doc1.ratings_count} reviews)`);

  if (!doc1.avatar || !doc1.degree_document || !doc1.vci_registration_number) {
    throw new Error("Doctor seed missing avatar, degree or VCI reg number!");
  }

  // 2. Fetch specific doctor profile
  const profileRes = await request(`/api/doctor/${doc1.id}`);
  if (profileRes.status !== 200 || !profileRes.data.doctor) {
    throw new Error("Failed to fetch single doctor profile: " + JSON.stringify(profileRes.data));
  }
  console.log(`✅ 2. GET /api/doctor/${doc1.id} returned complete profile & ${profileRes.data.doctor.reviews?.length || 0} reviews.`);

  // 3. Update doctor profile with custom photo and degree details
  const updateRes = await request("/api/doctor/profile", {
    method: "POST",
    body: {
      doctor_id: doc1.id,
      name: "Dr. Ananya Patil (M.V.Sc)",
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='40' fill='%2310b981'/></svg>",
      degree_name: "B.V.Sc & A.H., M.V.Sc (Veterinary Surgery & Radiology) — MAFSU Mumbai",
      degree_document: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><text>Custom Degree Scan</text></svg>",
      vci_registration_number: "VCI-MH-2014-9999",
      clinic_name: "Patil Advanced Veterinary Multispeciality Clinic",
      clinic_address: "Shop 12, Krishi Seva Complex, Shivaji Market, Pune",
      city: "Pune",
      bio: "Senior livestock veterinarian with 12+ years of surgical and reproductive expertise.",
      consultation_fee: 350,
      followup_fee: 175,
    },
  });

  if (updateRes.status !== 200 || !updateRes.data.doctor) {
    throw new Error("Failed to update doctor profile: " + JSON.stringify(updateRes.data));
  }
  const updatedDoc = updateRes.data.doctor;
  console.log(`✅ 3. POST /api/doctor/profile updated doctor info successfully:`);
  console.log(`   - Name: ${updatedDoc.name}`);
  console.log(`   - Avatar updated: ${Boolean(updatedDoc.avatar)}`);
  console.log(`   - VCI Reg: ${updatedDoc.vci_registration_number}`);
  console.log(`   - Consultation Fee: ₹${updatedDoc.consultation_fee}, Repeat Fee: ₹${updatedDoc.followup_fee}`);

  // 4. Submit a user rating & review
  const initialReviewsCount = updatedDoc.reviews ? updatedDoc.reviews.length : 0;
  const rateRes = await request(`/api/doctor/${doc1.id}/rate`, {
    method: "POST",
    body: {
      user_id: 1,
      user_name: "Ramesh Pawar (Dairy Farmer)",
      rating: 5,
      comment: "Excellent doctor! Prompt video consultation and genuine medicine prescription. Saved my cattle.",
      appointment_id: 101,
    },
  });

  if (rateRes.status !== 200 || !rateRes.data.doctor) {
    throw new Error("Failed to submit rating: " + JSON.stringify(rateRes.data));
  }
  const ratedDoc = rateRes.data.doctor;
  console.log(`✅ 4. POST /api/doctor/${doc1.id}/rate successfully submitted 5-star rating.`);
  console.log(`   - New Rating: ⭐ ${ratedDoc.rating}`);
  console.log(`   - Total Ratings Count: ${ratedDoc.ratings_count}`);
  console.log(`   - Latest Review Comment: "${ratedDoc.reviews[0].comment}"`);

  if (ratedDoc.reviews.length !== initialReviewsCount + 1) {
    throw new Error("Review count was not incremented properly!");
  }

  console.log("==================================================");
  console.log("🎉 ALL DOCTOR PROFILE, PHOTO, DEGREE & RATING TESTS PASSED!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
