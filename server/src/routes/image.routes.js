const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs").promises
const { pool } = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Configure multer for image uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Get uploads directory based on environment
const getUploadsDir = () => {
  return process.env.NODE_ENV === "production" ? "/tmp/uploads" : path.join(__dirname, "../../uploads")
}

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadsDir = getUploadsDir()
  try {
    await fs.access(uploadsDir)
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true })
    console.log(`📁 Created uploads directory: ${uploadsDir}`)
  }
}

// Initialize uploads directory on module load
ensureUploadsDir()

// Process image for beauty visualization
router.post("/process", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" })
    }

    const { procedureType, enhancementLevel = 50 } = req.body

    if (!procedureType) {
      return res.status(400).json({ error: "Procedure type is required" })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalFilename = `original_${timestamp}_${req.user.id}.jpg`
    const processedFilename = `processed_${timestamp}_${req.user.id}.jpg`

    const uploadsDir = getUploadsDir()
    const originalPath = path.join(uploadsDir, originalFilename)
    const processedPath = path.join(uploadsDir, processedFilename)

    // Save original image
    await sharp(req.file.buffer).jpeg({ quality: 90 }).toFile(originalPath)

    // Simple image processing simulation
    let processedImage = sharp(req.file.buffer)

    const enhancementFactor = Number.parseInt(enhancementLevel) / 100

    switch (procedureType) {
      case "lip_fillers":
        processedImage = processedImage
          .modulate({
            saturation: 1 + enhancementFactor * 0.3,
            brightness: 1 + enhancementFactor * 0.1,
          })
          .sharpen()
        break
      case "eye_brightening":
        processedImage = processedImage
          .modulate({
            brightness: 1 + enhancementFactor * 0.2,
            saturation: 1 + enhancementFactor * 0.1,
          })
          .sharpen()
        break
      case "skin_smoothing":
        processedImage = processedImage
          .blur(enhancementFactor * 0.5)
          .modulate({ brightness: 1 + enhancementFactor * 0.05 })
        break
      default:
        processedImage = processedImage.sharpen()
    }

    // Add watermark
    const watermarkSvg = `
      <svg width="200" height="50">
        <rect width="200" height="50" fill="rgba(255,255,255,0.8)" rx="5"/>
        <text x="100" y="30" font-family="Arial" font-size="14" font-weight="bold" fill="#568203" text-anchor="middle">
          KulturaView Preview
        </text>
      </svg>
    `

    await processedImage
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          gravity: "southeast",
        },
      ])
      .jpeg({ quality: 90 })
      .toFile(processedPath)

    // Save to database
    const [result] = await pool.execute(
      "INSERT INTO image_processes (user_id, original_image, processed_image, procedure_type, enhancement_level) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, originalFilename, processedFilename, procedureType, enhancementLevel],
    )

    res.json({
      message: "Image processed successfully",
      processId: result.insertId,
      originalImage: `/api/image/file/${originalFilename}`,
      processedImage: `/api/image/file/${processedFilename}`,
    })
  } catch (error) {
    console.error("Image processing error:", error)
    res.status(500).json({ error: "Image processing failed" })
  }
})

// Serve image files
router.get("/file/:filename", async (req, res) => {
  try {
    const filename = req.params.filename
    const uploadsDir = getUploadsDir()
    const filePath = path.join(uploadsDir, filename)

    // Check if file exists
    await fs.access(filePath)

    res.sendFile(path.resolve(filePath))
  } catch (error) {
    res.status(404).json({ error: "Image not found" })
  }
})

// Get user's image processing history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const [processes] = await pool.execute("SELECT * FROM image_processes WHERE user_id = ? ORDER BY created_at DESC", [
      req.user.id,
    ])

    const processesWithUrls = processes.map((process) => ({
      ...process,
      originalImage: `/api/image/file/${process.original_image}`,
      processedImage: process.processed_image ? `/api/image/file/${process.processed_image}` : null,
    }))

    res.json(processesWithUrls)
  } catch (error) {
    console.error("Get image history error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
