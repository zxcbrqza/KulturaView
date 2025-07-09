const express = require("express")
const Joi = require("joi")
const { pool } = require("../config/database")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

const appointmentSchema = Joi.object({
  serviceId: Joi.number().positive().required(),
  appointmentDate: Joi.date().iso().required(),
  notes: Joi.string().optional(),
})

// Get user appointments
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const [appointments] = await pool.execute(
      `
      SELECT a.*, s.name as service_name, s.price, s.duration
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC
    `,
      [req.user.id],
    )

    res.json(appointments)
  } catch (error) {
    console.error("Get appointments error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get all appointments (Admin only)
router.get("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [appointments] = await pool.execute(`
      SELECT a.*, s.name as service_name, s.price, s.duration,
             u.first_name, u.last_name, u.email, u.phone
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN users u ON a.user_id = u.id
      ORDER BY a.appointment_date DESC
    `)

    res.json(appointments)
  } catch (error) {
    console.error("Get all appointments error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create appointment
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { serviceId, appointmentDate, notes } = value

    // Check if service exists
    const [services] = await pool.execute('SELECT id FROM services WHERE id = ? AND status = "active"', [serviceId])

    if (services.length === 0) {
      return res.status(404).json({ error: "Service not found" })
    }

    // Check for conflicts (simplified - you might want more complex logic)
    const [conflicts] = await pool.execute(
      'SELECT id FROM appointments WHERE appointment_date = ? AND status IN ("pending", "confirmed")',
      [appointmentDate],
    )

    if (conflicts.length > 0) {
      return res.status(400).json({ error: "Time slot not available" })
    }

    const [result] = await pool.execute(
      "INSERT INTO appointments (user_id, service_id, appointment_date, notes) VALUES (?, ?, ?, ?)",
      [req.user.id, serviceId, appointmentDate, notes || null],
    )

    res.status(201).json({
      message: "Appointment booked successfully",
      appointmentId: result.insertId,
    })
  } catch (error) {
    console.error("Create appointment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update appointment status (Admin only)
router.put("/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const [result] = await pool.execute("UPDATE appointments SET status = ? WHERE id = ?", [status, req.params.id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" })
    }

    res.json({ message: "Appointment status updated successfully" })
  } catch (error) {
    console.error("Update appointment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Cancel appointment
router.put("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute('UPDATE appointments SET status = "cancelled" WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id,
    ])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" })
    }

    res.json({ message: "Appointment cancelled successfully" })
  } catch (error) {
    console.error("Cancel appointment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
