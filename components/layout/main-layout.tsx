"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, Search, Sun, Moon, LogOut, X } from "lucide-react"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { useAuth } from "@/components/auth/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, logout, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!user) {
    return null // Or you could redirect to login here
  }

  return (
    <div className="flex flex-col min-h-screen bg-cool-50 dark:bg-cool-900 text-cool-900 dark:text-cool-50">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-cool-200 dark:border-cool-700 px-4 py-2 bg-white dark:bg-cool-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-semibold text-vibrant-600 dark:text-vibrant-400 hidden sm:block">IT Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-cool-400 dark:text-cool-500" />
            <Input
              placeholder="Search..."
              className="pl-8 w-full bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {mounted && theme === "light" ? (
              <Moon className="h-5 w-5 text-cool-600" />
            ) : (
              <Sun className="h-5 w-5 text-cool-400" />
            )}
          </Button>
          <NotificationCenter />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <img src="/placeholder.svg?height=32&width=32" alt="Avatar" className="rounded-full h-8 w-8" />
                <span className="text-cool-700 dark:text-cool-300 hidden sm:inline">{user?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hasPermission("view_profile") && (
                <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
              )}
              {hasPermission("view_settings") && (
                <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col border-r border-cool-200 dark:border-cool-700 bg-white dark:bg-cool-800 p-4 lg:p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-vibrant-600 dark:text-vibrant-400">IT Dashboard</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <MainNav hasPermission={hasPermission} onItemClick={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t border-cool-200 dark:border-cool-700 p-4 lg:p-6 text-center text-sm text-cool-600 dark:text-cool-400 bg-white dark:bg-cool-800">
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:text-vibrant-600 dark:hover:text-vibrant-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-vibrant-600 dark:hover:text-vibrant-400 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-vibrant-600 dark:hover:text-vibrant-400 transition-colors">
            Contact Us
          </a>
        </div>
        <p className="mt-2">© 2024 IT Company. All rights reserved.</p>
      </footer>
    </div>
  )
}

