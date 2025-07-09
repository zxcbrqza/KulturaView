"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType, RegisterData } from "../types"
import api from "../utils/api"
import toast from "react-hot-toast"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      const { token: newToken, user: userData } = response.data

      setToken(newToken)
      setUser(userData)
      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(userData))

      toast.success("Login successful!")
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed"
      toast.error(message)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post("/auth/register", userData)
      const { token: newToken, user: newUser } = response.data

      setToken(newToken)
      setUser(newUser)
      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))

      toast.success("Registration successful!")
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed"
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged out successfully")
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
