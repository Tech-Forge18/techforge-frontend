"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { MainLayout } from "@/components/layout/main-layout"
import { Dashboard } from "@/components/dashboard/dashboard"
import { useAuth } from "@/components/auth/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-cool-800 dark:text-cool-100">{t("dashboard")} Overview</h1>
        {user?.role === "member" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              As a member, you have limited access to certain features. Contact an admin for more information.
            </AlertDescription>
          </Alert>
        )}
        <Dashboard />
      </div>
    </MainLayout>
  )
}

