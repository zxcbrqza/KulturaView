const bcrypt = require("bcryptjs")
const { pool } = require("./database")

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database with initial data...")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    await pool.execute(
      `INSERT IGNORE INTO users (email, password, first_name, last_name, role) 
       VALUES (?, ?, ?, ?, ?)`,
      ["admin@kulturaview.com", adminPassword, "Admin", "User", "admin"],
    )

    // Create demo client user
    const clientPassword = await bcrypt.hash("client123", 10)
    await pool.execute(
      `INSERT IGNORE INTO users (email, password, first_name, last_name, phone, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ["client@kulturaview.com", clientPassword, "Demo", "Client", "+359 888 123 456", "client"],
    )

    // Create default services
    const services = [
      {
        name: "Lip Enhancement",
        description:
          "Professional lip filler treatment for fuller, more defined lips. Our expert aestheticians use premium hyaluronic acid fillers for natural-looking results.",
        price: 150.0,
        duration: 60,
        category: "Facial Treatments",
      },
      {
        name: "Eye Brightening",
        description:
          "Advanced eye treatment to reduce dark circles, puffiness, and fine lines. Includes under-eye filler and brightening serum application.",
        price: 120.0,
        duration: 45,
        category: "Facial Treatments",
      },
      {
        name: "Skin Smoothing Facial",
        description:
          "Deep cleansing facial with microdermabrasion and hydrating mask. Perfect for achieving smoother, more radiant skin.",
        price: 100.0,
        duration: 90,
        category: "Facial Treatments",
      },
      {
        name: "Botox Treatment",
        description:
          "Professional botox injections to reduce wrinkles and fine lines. Administered by certified medical professionals.",
        price: 200.0,
        duration: 30,
        category: "Anti-Aging",
      },
      {
        name: "Chemical Peel",
        description:
          "Professional chemical peel treatment to improve skin texture, reduce acne scars, and promote cell renewal.",
        price: 80.0,
        duration: 60,
        category: "Skin Treatments",
      },
      {
        name: "Dermal Fillers",
        description:
          "Premium dermal filler treatments for cheeks, jawline, and other facial areas. Restore volume and enhance facial contours.",
        price: 180.0,
        duration: 45,
        category: "Anti-Aging",
      },
      {
        name: "Hydrafacial",
        description:
          "Advanced hydrafacial treatment combining cleansing, exfoliation, extraction, and hydration in one session.",
        price: 130.0,
        duration: 60,
        category: "Skin Treatments",
      },
      {
        name: "Eyebrow Shaping",
        description:
          "Professional eyebrow shaping and tinting service. Includes consultation to find the perfect brow shape for your face.",
        price: 40.0,
        duration: 30,
        category: "Beauty Services",
      },
    ]

    for (const service of services) {
      await pool.execute(
        `INSERT IGNORE INTO services (name, description, price, duration, category) 
         VALUES (?, ?, ?, ?, ?)`,
        [service.name, service.description, service.price, service.duration, service.category],
      )
    }

    console.log("✅ Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  }
}

module.exports = { seedDatabase }
