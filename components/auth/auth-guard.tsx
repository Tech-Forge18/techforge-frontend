"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user && pathname !== "/login") {
      router.push("/login")
    } else if (user && pathname === "/login") {
      router.push("/dashboard")
    }
  }, [user, router, pathname])

  if (!user && pathname !== "/login") {
    return null
  }

  return <>{children}</>
}

