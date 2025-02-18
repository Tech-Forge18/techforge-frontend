import { MainLayout } from "@/components/layout/main-layout"
import { TicketSubmissionForm } from "@/components/support/ticket-submission-form"
import { TicketTracking } from "@/components/support/ticket-tracking"
import { TicketHistory } from "@/components/support/ticket-history"
import { useAuth } from "@/components/auth/auth-context"

export default function SupportPage() {
  const { hasPermission } = useAuth()

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Customer Support</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TicketSubmissionForm />
          {hasPermission("view_ticket_tracking") && <TicketTracking />}
        </div>
        {hasPermission("view_ticket_history") && <TicketHistory />}
      </div>
    </MainLayout>
  )
}

