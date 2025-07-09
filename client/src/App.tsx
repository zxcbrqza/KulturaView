import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Layout/Header"
import Footer from "./components/Layout/Footer"
import Home from "./pages/Home"
import Services from "./pages/Services"
import VirtualTryOn from "./pages/VirtualTryOn"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/virtual-try-on" element={<VirtualTryOn />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#568203",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
