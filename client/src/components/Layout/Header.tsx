"use client"

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { LogOut, Menu, X } from "lucide-react"

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-avocado-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KulturaView</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-avocado-600 transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-avocado-600 transition-colors">
              Services
            </Link>
            <Link to="/virtual-try-on" className="text-gray-700 hover:text-avocado-600 transition-colors">
              Virtual Try-On
            </Link>
            {user && (
              <>
                <Link to="/appointments" className="text-gray-700 hover:text-avocado-600 transition-colors">
                  My Appointments
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-avocado-600 transition-colors">
                  Profile
                </Link>
              </>
            )}
            <Link to="/help" className="text-gray-700 hover:text-avocado-600 transition-colors">
              Help
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Hello, {user.firstName}</span>
                {user.role === "admin" && (
                  <Link to="/admin" className="btn-secondary text-sm">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-avocado-600 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-avocado-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-avocado-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-avocado-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-avocado-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/virtual-try-on"
                className="text-gray-700 hover:text-avocado-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Virtual Try-On
              </Link>
              {user && (
                <>
                  <Link
                    to="/appointments"
                    className="text-gray-700 hover:text-avocado-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Appointments
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-avocado-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
              <Link
                to="/help"
                className="text-gray-700 hover:text-avocado-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>

              {user ? (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700 mb-2">Hello, {user.firstName}</p>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block mb-2 text-avocado-600 hover:text-avocado-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-1 text-gray-700 hover:text-avocado-600"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-avocado-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link to="/register" className="block btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
