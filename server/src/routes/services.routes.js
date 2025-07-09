const express = require("express")
const Joi = require("joi")
const { pool } = require("../config/database")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

const serviceSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().positive().required(),
  duration: Joi.number().positive().required(),
  category: Joi.string().optional(),
})

// Get all services
router.get("/", async (req, res) => {
  try {
    const [services] = await pool.execute('SELECT * FROM services WHERE status = "active" ORDER BY category, name')
    res.json(services)
  } catch (error) {
    console.error("Get services error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get service by ID
router.get("/:id", async (req, res) => {
  try {
    const [services] = await pool.execute('SELECT * FROM services WHERE id = ? AND status = "active"', [req.params.id])

    if (services.length === 0) {
      return res.status(404).json({ error: "Service not found" })
    }

    res.json(services[0])
  } catch (error) {
    console.error("Get service error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create service (Admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { name, description, price, duration, category } = value

    const [result] = await pool.execute(
      "INSERT INTO services (name, description, price, duration, category) VALUES (?, ?, ?, ?, ?)",
      [name, description || null, price, duration, category || null],
    )

    res.status(201).json({
      message: "Service created successfully",
      serviceId: result.insertId,
    })
  } catch (error) {
    console.error("Create service error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update service (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { name, description, price, duration, category } = value

    const [result] = await pool.execute(
      "UPDATE services SET name = ?, description = ?, price = ?, duration = ?, category = ? WHERE id = ?",
      [name, description || null, price, duration, category || null, req.params.id],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Service not found" })
    }

    res.json({ message: "Service updated successfully" })
  } catch (error) {
    console.error("Update service error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Delete service (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute('UPDATE services SET status = "inactive" WHERE id = ?', [req.params.id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Service not found" })
    }

    res.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Delete service error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
