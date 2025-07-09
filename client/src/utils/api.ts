import axios from "axios"

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Production: Use environment variable
  if (process.env.NODE_ENV === "production") {
    return process.env.REACT_APP_API_URL || "/api"
  }

  // Development: Use local server
  return process.env.REACT_APP_API_URL || "http://localhost:5000/api"
}

const API_BASE_URL = getApiBaseUrl()

console.log(`🔗 API Base URL: ${API_BASE_URL}`)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }

    // Log network errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.data || error.message)
    }

    return Promise.reject(error)
  },
)

export default api
