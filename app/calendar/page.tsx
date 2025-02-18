import { MainLayout } from "@/components/layout/main-layout"
import { Calendar } from "@/components/calendar/calendar"

export default function CalendarPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Calendar />
      </div>
    </MainLayout>
  )
}

