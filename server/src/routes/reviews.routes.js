const express = require("express")
const Joi = require("joi")
const { pool } = require("../config/database")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

const reviewSchema = Joi.object({
  serviceId: Joi.number().positive().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional(),
})

// Get all reviews for a service
router.get("/service/:serviceId", async (req, res) => {
  try {
    const [reviews] = await pool.execute(
      `
      SELECT r.*, u.first_name, u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.service_id = ?
      ORDER BY r.created_at DESC
    `,
      [req.params.serviceId],
    )

    res.json(reviews)
  } catch (error) {
    console.error("Get reviews error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get all reviews (Admin only)
router.get("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT r.*, u.first_name, u.last_name, u.email, s.name as service_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      ORDER BY r.created_at DESC
    `)

    res.json(reviews)
  } catch (error) {
    console.error("Get all reviews error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create review
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { error, value } = reviewSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { serviceId, rating, comment } = value

    // Check if service exists
    const [services] = await pool.execute('SELECT id FROM services WHERE id = ? AND status = "active"', [serviceId])

    if (services.length === 0) {
      return res.status(404).json({ error: "Service not found" })
    }

    // Check if user already reviewed this service
    const [existingReviews] = await pool.execute("SELECT id FROM reviews WHERE user_id = ? AND service_id = ?", [
      req.user.id,
      serviceId,
    ])

    if (existingReviews.length > 0) {
      return res.status(400).json({ error: "You have already reviewed this service" })
    }

    const [result] = await pool.execute(
      "INSERT INTO reviews (user_id, service_id, rating, comment) VALUES (?, ?, ?, ?)",
      [req.user.id, serviceId, rating, comment || null],
    )

    res.status(201).json({
      message: "Review submitted successfully",
      reviewId: result.insertId,
    })
  } catch (error) {
    console.error("Create review error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get user's reviews
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const [reviews] = await pool.execute(
      `
      SELECT r.*, s.name as service_name
      FROM reviews r
      JOIN services s ON r.service_id = s.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `,
      [req.user.id],
    )

    res.json(reviews)
  } catch (error) {
    console.error("Get user reviews error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
