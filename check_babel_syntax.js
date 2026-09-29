import fs from "fs";
import * as babel from "@babel/core";

console.log("==========================================");
console.log("BABEL SYNTAX VALIDATION FOR REACT JSX FILES");
console.log("==========================================");

try {
  const screensCode = fs.readFileSync("./public/screens.js", "utf8");
  console.log(`Reading public/screens.js (${screensCode.length} bytes)...`);
  babel.transformSync(screensCode, {
    presets: [["@babel/preset-react", { runtime: "classic" }]],
  });
  console.log("✅ public/screens.js compiled successfully with 0 syntax errors!");
} catch (e) {
  console.error("❌ Syntax error in public/screens.js:", e.message);
  process.exit(1);
}

try {
  const appCode = fs.readFileSync("./public/app.js", "utf8");
  console.log(`Reading public/app.js (${appCode.length} bytes)...`);
  babel.transformSync(appCode, {
    presets: [["@babel/preset-react", { runtime: "classic" }]],
  });
  console.log("✅ public/app.js compiled successfully with 0 syntax errors!");
} catch (e) {
  console.error("❌ Syntax error in public/app.js:", e.message);
  process.exit(1);
}

console.log("🎉 ALL REACT JSX FILES VALIDATED CLEANLY!");
