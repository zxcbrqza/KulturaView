const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const { initDatabase } = require("./config/database")

const app = express()

// Trust proxy for Railway and other platforms
app.set("trust proxy", 1)

// CORS configuration for dev and prod
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      "http://localhost:3000", // Local development
      "http://localhost:3001", // Alternative local port
      process.env.FRONTEND_URL, // Production frontend URL
    ].filter(Boolean) // Remove undefined values

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log(`CORS blocked origin: ${origin}`)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Serve static files (uploads)
const uploadsPath = process.env.NODE_ENV === "production" ? "/tmp/uploads" : path.join(__dirname, "../uploads")
app.use("/uploads", express.static(uploadsPath))

// Serve React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public")))
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API Routes
app.get("/api", (req, res) => {
  res.json({
    message: "KulturaView API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  })
})

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/services", require("./routes/services.routes"))
app.use("/api/appointments", require("./routes/appointments.routes"))
app.use("/api/image", require("./routes/image.routes"))
app.use("/api/reviews", require("./routes/reviews.routes"))

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
  })
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large" })
  }

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy violation" })
  }

  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
  })
})

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" })
})

// Initialize database on startup
initDatabase()

module.exports = app
