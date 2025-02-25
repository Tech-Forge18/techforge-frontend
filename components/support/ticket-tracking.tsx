"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Keeping ShadCN card
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import Chip from "@mui/material/Chip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog" // For edit modal
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SupportTicket {
  id: number
  title: string
  category: string
  priority: string
  description: string
  contactinfo: number
  file?: string // URL to the file if it exists
}

export function TicketTracking() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [editTicket, setEditTicket] = useState<SupportTicket | null>(null)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/supports/")
      if (!response.ok) throw new Error("Failed to fetch tickets")
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/supports/${id}/`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete ticket")
      setTickets(tickets.filter((ticket) => ticket.id !== id))
    } catch (error) {
      console.error("Error deleting ticket:", error)
    }
  }

  const handleEdit = (ticket: SupportTicket) => {
    setEditTicket(ticket)
    setEditFile(null) // Reset file for new upload
    setIsDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTicket) return

    const formData = new FormData()
    formData.append("title", editTicket.title)
    formData.append("category", editTicket.category)
    formData.append("priority", editTicket.priority)
    formData.append("description", editTicket.description)
    formData.append("contactinfo", editTicket.contactinfo.toString())
    if (editFile) formData.append("file", editFile)

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/supports/${editTicket.id}/`, {
        method: "PUT", // Use PUT for full update; PATCH could work for partial updates
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to update ticket")
      const updatedTicket = await response.json()
      setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
      setIsDialogOpen(false)
      setEditTicket(null)
    } catch (error) {
      console.error("Error updating ticket:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Status</CardTitle>
      </CardHeader>
      <CardContent>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="ticket tracking table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.priority}
                      color={
                        ticket.priority === "High" || ticket.priority === "urgent"
                          ? "error"
                          : ticket.priority === "Medium"
                          ? "warning"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>{ticket.description.substring(0, 50)}...</TableCell>
                  <TableCell>{ticket.contactinfo}</TableCell>
                  <TableCell>
                    {ticket.file ? (
                      <a href={ticket.file} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    ) : (
                      "No File"
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(ticket)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(ticket.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        {editTicket && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Ticket</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editTicket.title}
                    onChange={(e) => setEditTicket({ ...editTicket, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editTicket.category}
                    onValueChange={(value) => setEditTicket({ ...editTicket, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Inquiry</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={editTicket.priority}
                    onValueChange={(value) => setEditTicket({ ...editTicket, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editTicket.description}
                    onChange={(e) => setEditTicket({ ...editTicket, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactinfo">Contact Info</Label>
                  <Input
                    id="contactinfo"
                    type="number"
                    value={editTicket.contactinfo}
                    onChange={(e) => setEditTicket({ ...editTicket, contactinfo: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="file">Update File</Label>
                  <Input id="file" type="file" onChange={(e) => setEditFile(e.target.files?.[0] || null)} />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}