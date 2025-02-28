"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Sun, Moon, LogOut, X } from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { useAuth } from "@/components/auth/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-screen transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 border-r border-indigo-200 dark:border-indigo-800 shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b border-indigo-200 dark:border-indigo-800">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
               Tech Forge 
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-400"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-600 scrollbar-track-indigo-100 dark:scrollbar-track-indigo-800">
            <MainNav hasPermission={hasPermission} onItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-indigo-200 dark:border-indigo-800 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-400"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400 dark:text-indigo-500" />
              <Input
                placeholder="Search dashboard..."
                className="pl-10 bg-indigo-50 dark:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500 rounded-lg shadow-sm"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-400"
            >
              {mounted && theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <NotificationCenter />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-400"
                >
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="Avatar"
                    className="rounded-full h-8 w-8 border-2 border-indigo-200 dark:border-indigo-700"
                  />
                  <span className="hidden sm:inline font-medium">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 shadow-lg rounded-lg"
              >
                <DropdownMenuLabel className="text-indigo-900 dark:text-indigo-100">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-indigo-200 dark:bg-indigo-700" />
                {hasPermission("view_profile") && (
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-800 dark:hover:text-indigo-400"
                  >
                    Profile
                  </DropdownMenuItem>
                )}
                {hasPermission("view_settings") && (
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-800 dark:hover:text-indigo-400"
                  >
                    Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-indigo-200 dark:bg-indigo-700" />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-full mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-indigo-200 dark:border-indigo-800 py-4 text-center text-sm bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
          <p className="mt-2 text-indigo-600 dark:text-indigo-300">© 2025 Tech Forge. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}