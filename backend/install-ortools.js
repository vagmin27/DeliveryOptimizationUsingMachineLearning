#!/usr/bin/env node

/**
 * Google OR-Tools Installation Helper
 * This script helps install Google OR-Tools
 */

import { execSync } from "child_process";

console.log("🚀 Google OR-Tools Installation Helper");
console.log("=====================================\n");

console.log("📦 Installing Google OR-Tools...");
console.log("This may take several minutes...\n");

try {
  // Check platform
  const isWindows = process.platform === "win32";

  if (isWindows) {
    console.log("🔧 Windows detected - installing OR-Tools...");

    execSync(
      "npm install @google/ortools --save-optional",
      {
        stdio: "inherit",
      }
    );
  } else {
    console.log(
      "🐧 Linux/Mac detected - installing dependencies..."
    );

    try {
      if (process.platform === "linux") {
        console.log("📋 Installing Linux dependencies...");

        execSync(
          "sudo apt-get update && sudo apt-get install -y build-essential cmake",
          {
            stdio: "inherit",
          }
        );
      } else if (
        process.platform === "darwin"
      ) {
        console.log("🍎 Installing macOS dependencies...");

        execSync("brew install cmake", {
          stdio: "inherit",
        });
      }
    } catch (error) {
      console.log(
        "⚠️ System dependency installation failed."
      );

      console.log(
        "Continuing with OR-Tools installation..."
      );
    }

    // Install OR-Tools
    console.log(
      "📦 Installing Google OR-Tools..."
    );

    execSync(
      "npm install @google/ortools --save-optional",
      {
        stdio: "inherit",
      }
    );
  }

  console.log(
    "\n✅ Google OR-Tools installation completed!"
  );

  console.log(
    "🎯 Your optimization system can now use OR-Tools."
  );

  console.log(
    "\n🔄 Restart backend after installation:"
  );

  console.log("npm run server\n");

} catch (error) {
  console.log(
    "\n❌ Google OR-Tools installation failed."
  );

  console.log(
    "📝 Your application will continue using fallback optimization algorithms."
  );

  console.log(
    "\n💡 Try again later using:"
  );

  console.log(
    "node install-ortools.js\n"
  );

  console.log(
    "📖 Manual Installation:"
  );

  console.log(
    "https://developers.google.com/optimization/install\n"
  );
}