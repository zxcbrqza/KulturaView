const http = require("http")

const options = {
  host: "localhost",
  port: process.env.PORT || 5000,
  timeout: 2000,
  path: "/health",
}

const request = http.request(options, (res) => {
  console.log(`Health check STATUS: ${res.statusCode}`)
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})

request.on("error", (err) => {
  console.log("Health check ERROR:", err.message)
  process.exit(1)
})

request.end()
