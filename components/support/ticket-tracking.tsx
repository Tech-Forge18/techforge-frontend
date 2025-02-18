import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dummyTickets = [
  { id: "T-001", title: "Login Issue", status: "Open", priority: "High", lastUpdated: "2024-03-15 10:30 AM" },
  {
    id: "T-002",
    title: "Billing Question",
    status: "In Progress",
    priority: "Medium",
    lastUpdated: "2024-03-14 2:45 PM",
  },
  { id: "T-003", title: "Feature Request", status: "Resolved", priority: "Low", lastUpdated: "2024-03-13 11:20 AM" },
]

export function TicketTracking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.status === "Open" ? "default" : ticket.status === "In Progress" ? "secondary" : "success"
                    }
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.priority === "High" ? "destructive" : ticket.priority === "Medium" ? "warning" : "default"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

