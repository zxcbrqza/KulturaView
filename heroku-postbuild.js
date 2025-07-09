const { execSync } = require("child_process")
const path = require("path")

console.log("🚀 Starting Heroku post-build process...")

try {
  // Build client
  console.log("📦 Building client...")
  execSync("cd client && npm ci && npm run build", {
    stdio: "inherit",
    cwd: __dirname,
  })

  // Copy client build to server public directory
  console.log("📁 Copying client build files...")
  execSync("cp -r client/build server/public", {
    stdio: "inherit",
    cwd: __dirname,
  })

  console.log("✅ Heroku post-build completed successfully!")
} catch (error) {
  console.error("❌ Heroku post-build failed:", error)
  process.exit(1)
}
