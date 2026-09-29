import fs from "fs";

const screensPath = "./public/screens.js";
let screensCode = fs.readFileSync(screensPath, "utf8");

// 1. Add new tabs to GovtDashboard
const oldGovtTabs = `            { id: "containmentOrders", label: "🛡️ Containment Zones" },
          ].map((tab) => (`;

const newGovtTabs = `            { id: "containmentOrders", label: "🛡️ Containment Zones" },
            { id: "droneFleet", label: "🚁 Drone Fleet Air-Drop" },
            { id: "bioAcoustics", label: "🎙️ AI Acoustic Lab (BARDI)" },
            { id: "muzzleBiometrics", label: "🐮 Muzzle Biometrics (Anti-Fraud)" },
          ].map((tab) => (`;

screensCode = screensCode.replace(oldGovtTabs, newGovtTabs);

// 2. Add tab bodies for droneFleet, bioAcoustics, and muzzleBiometrics
const oldOverviewTabMarker = `{/* TAB 1: OVERVIEW & KPIS */}`;
const newTabBodies = `{/* FRONTIER INNOVATION TABS IN GOVT DASHBOARD */}
        {activeTab === "droneFleet" && (
          <div style={{ marginTop: 10 }}>
            <DroneFleetScreen t={t} user={null} lang={lang} setScreen={setScreen} onBack={() => setActiveTab("overview")} />
          </div>
        )}
        {activeTab === "bioAcoustics" && (
          <div style={{ marginTop: 10 }}>
            <BioAcousticsScreen t={t} user={null} lang={lang} setScreen={setScreen} onBack={() => setActiveTab("overview")} />
          </div>
        )}
        {activeTab === "muzzleBiometrics" && (
          <div style={{ marginTop: 10 }}>
            <MuzzleBiometricsScreen t={t} user={null} lang={lang} setScreen={setScreen} onBack={() => setActiveTab("overview")} />
          </div>
        )}

        {/* TAB 1: OVERVIEW & KPIS */}`;

screensCode = screensCode.replace(oldOverviewTabMarker, newTabBodies);

fs.writeFileSync(screensPath, screensCode, "utf8");
console.log("✅ GovtDashboard updated with innovation tabs!");
