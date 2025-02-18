"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TicketSubmissionForm() {
  const [ticket, setTicket] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
    contactInfo: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTicket((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the ticket to your backend
    console.log("Submitted ticket:", ticket)
    // Reset form after submission
    setTicket({
      title: "",
      category: "",
      priority: "",
      description: "",
      contactInfo: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Ticket Title</Label>
            <Input
              id="title"
              name="title"
              value={ticket.title}
              onChange={handleInputChange}
              placeholder="Enter a brief summary of the issue"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" onValueChange={(value) => setTicket((prev) => ({ ...prev, category: value }))}>
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
            <Label htmlFor="priority">Priority Level</Label>
            <Select name="priority" onValueChange={(value) => setTicket((prev) => ({ ...prev, priority: value }))}>
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
              name="description"
              value={ticket.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of the issue"
              required
            />
          </div>
          <div>
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Input
              id="contactInfo"
              name="contactInfo"
              value={ticket.contactInfo}
              onChange={handleInputChange}
              placeholder="Enter your email or phone number"
              required
            />
          </div>
          <div>
            <Label htmlFor="attachments">Attach Files</Label>
            <Input id="attachments" type="file" multiple />
          </div>
          <Button type="submit">Submit Ticket</Button>
        </form>
      </CardContent>
    </Card>
  )
}

