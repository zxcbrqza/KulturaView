const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const { pool } = require("../config/database")
const { JWT_SECRET, authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().optional(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

// Register
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { email, password, firstName, lastName, phone } = value

    // Check if user exists
    const [existingUsers] = await pool.execute("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [result] = await pool.execute(
      "INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)",
      [email, hashedPassword, firstName, lastName, phone || null],
    )

    // Generate token
    const token = jwt.sign({ userId: result.insertId }, JWT_SECRET, { expiresIn: "24h" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.insertId,
        email,
        firstName,
        lastName,
        role: "client",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { email, password } = value

    // Find user
    const [users] = await pool.execute(
      "SELECT id, email, password, first_name, last_name, role, status FROM users WHERE email = ?",
      [email],
    )

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = users[0]

    if (user.status !== "active") {
      return res.status(403).json({ error: "Account is disabled" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute("SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = ?", [
      req.user.id,
    ])

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    const user = users[0]
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
