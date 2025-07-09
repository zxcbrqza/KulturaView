const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kulturaview",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Add this if needed by Railway
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Database connected successfully (${process.env.NODE_ENV || "development"})`);
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("💡 Make sure your Railway MySQL plugin credentials are correct");
  }
};

// Initialize database tables
const initDatabase = async () => {
  try {
    console.log("🔧 Initializing database tables...")

    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role ENUM('client', 'admin', 'staff') DEFAULT 'client',
        status ENUM('active', 'disabled', 'banned') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Services table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        duration INT NOT NULL,
        category VARCHAR(100),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Appointments table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service_id INT NOT NULL,
        appointment_date DATETIME NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `)

    // Image processing records
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS image_processes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        original_image VARCHAR(255) NOT NULL,
        processed_image VARCHAR(255),
        procedure_type VARCHAR(100) NOT NULL,
        enhancement_level INT DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // Reviews table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `)

    console.log("✅ Database tables initialized successfully")

    // Seed initial data only in development or if no users exist
    const [users] = await pool.execute("SELECT COUNT(*) as count FROM users")
    if (users[0].count === 0) {
      const { seedDatabase } = require("./seedData")
      await seedDatabase()
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error)
  }
}

// Test connection on startup
testConnection()

module.exports = { pool, initDatabase }
