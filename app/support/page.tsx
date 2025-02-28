import { MainLayout } from "@/components/layout/main-layout"
import { TicketSubmissionForm } from "@/components/support/ticket-submission-form"
import { TicketTracking } from "@/components/support/ticket-tracking"
import { TicketHistory } from "@/components/support/ticket-history"

export default function SupportPage() {

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-indigo-700 dark:text-indigo-700 font-bold"> Support</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TicketSubmissionForm />
          <TicketTracking />
          <TicketHistory />
        </div>
      </div>
    </MainLayout>
  )
}

