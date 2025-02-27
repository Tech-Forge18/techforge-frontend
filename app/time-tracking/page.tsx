"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { TimeLogForm } from "@/components/time-tracking/time-log-form"
import { AttendanceTracking } from "@/components/time-tracking/attendance-tracking"
import { LeaveManagement } from "@/components/time-tracking/leave-management"
import { PayrollReport } from "@/components/time-tracking/payroll-report"
import { TeamTimeSummary } from "@/components/time-tracking/team-time-summary"

export default function TimeTrackingPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTimeLogAdded = () => {
    setRefreshKey((prev) => prev + 1) // Increment to force AttendanceTracking to refetch
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Employee Time Tracking</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TimeLogForm onTimeLogAdded={handleTimeLogAdded} />
          <AttendanceTracking key={refreshKey} />
        </div>
        <LeaveManagement />
        <PayrollReport />
        <TeamTimeSummary />
      </div>
    </MainLayout>
  )
}