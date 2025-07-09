const app = require("./app")

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 KulturaView Server running on http://localhost:${PORT}`)
  console.log(`📊 Database: ${process.env.DB_NAME || "kulturaview"}`)
})
