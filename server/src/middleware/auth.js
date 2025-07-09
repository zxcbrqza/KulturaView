const jwt = require("jsonwebtoken")
const { pool } = require("../config/database")

const JWT_SECRET = process.env.JWT_SECRET || "kulturaview-secret-key"

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const [users] = await pool.execute("SELECT id, email, role, status FROM users WHERE id = ?", [decoded.userId])

    if (users.length === 0 || users[0].status !== "active") {
      return res.status(403).json({ error: "User not found or inactive" })
    }

    req.user = users[0]
    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" })
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

module.exports = { authenticateToken, requireAdmin, JWT_SECRET }
