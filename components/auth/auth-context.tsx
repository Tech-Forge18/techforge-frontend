"use client"

import type React from "react"

import { createContext, useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  username: string
  role: "admin" | "member"
  permissions: string[]
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string) => {
    // Simulating API call
    if (username === "admin" && password === "admin") {
      const user = {
        username: "admin",
        role: "admin" as const,
        permissions: ["all"],
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } else if (username === "member" && password === "member") {
      const user = {
        username: "member",
        role: "member" as const,
        permissions: [
          "view_dashboard",
          "view_tasks",
          "view_calendar",
          "view_documents",
          "view_courses",
          "view_training",
          "view_support",
          "add_document",
        ],
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    if (user.role === "admin") return true
    return user.permissions.includes(permission)
  }

  return <AuthContext.Provider value={{ user, login, logout, hasPermission }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

