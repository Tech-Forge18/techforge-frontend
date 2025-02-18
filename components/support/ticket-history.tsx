"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const dummyTicketHistory = [
  {
    id: "T-001",
    title: "Login Issue",
    status: "Resolved",
    priority: "High",
    resolutionTime: "2 days",
    comments: [
      {
        author: "Support Agent",
        content: "We've reset your password. Please try logging in again.",
        timestamp: "2024-03-15 11:30 AM",
      },
      { author: "User", content: "Thank you, I can log in now.", timestamp: "2024-03-15 12:00 PM" },
    ],
  },
  {
    id: "T-002",
    title: "Billing Question",
    status: "Closed",
    priority: "Medium",
    resolutionTime: "1 day",
    comments: [
      {
        author: "Support Agent",
        content: "Your next billing cycle starts on April 1st. Is there anything else I can help you with?",
        timestamp: "2024-03-14 3:45 PM",
      },
      { author: "User", content: "No, that's all. Thank you!", timestamp: "2024-03-14 4:00 PM" },
    ],
  },
]

export function TicketHistory() {
  const [selectedTicket, setSelectedTicket] = useState(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Resolution Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyTicketHistory.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Badge variant={ticket.status === "Resolved" ? "success" : "default"}>{ticket.status}</Badge>
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
                <TableCell>{ticket.resolutionTime}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ticket Details - {selectedTicket?.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Title</h3>
                          <p>{selectedTicket?.title}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Status</h3>
                          <Badge variant={selectedTicket?.status === "Resolved" ? "success" : "default"}>
                            {selectedTicket?.status}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold">Priority</h3>
                          <Badge
                            variant={
                              selectedTicket?.priority === "High"
                                ? "destructive"
                                : selectedTicket?.priority === "Medium"
                                  ? "warning"
                                  : "default"
                            }
                          >
                            {selectedTicket?.priority}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold">Resolution Time</h3>
                          <p>{selectedTicket?.resolutionTime}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Comments</h3>
                          <div className="space-y-2">
                            {selectedTicket?.comments.map((comment, index) => (
                              <div key={index} className="border p-2 rounded">
                                <p className="font-semibold">{comment.author}</p>
                                <p>{comment.content}</p>
                                <p className="text-sm text-gray-500">{comment.timestamp}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

