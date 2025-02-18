"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Dummy data for announcements
const initialAnnouncements = [
  {
    id: 1,
    title: "Company Picnic",
    content: "Join us for the annual company picnic this Saturday!",
    date: "2024-03-20",
  },
  {
    id: 2,
    title: "New Project Kickoff",
    content: "We're starting a new project with XYZ Corp. More details to follow.",
    date: "2024-03-18",
  },
  {
    id: 3,
    title: "Office Closure",
    content: "The office will be closed on Monday for a national holiday.",
    date: "2024-03-15",
  },
]

export function AnnouncementsFeed() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement = {
        id: announcements.length + 1,
        ...newAnnouncement,
        date: new Date().toISOString().split("T")[0],
      }
      setAnnouncements([announcement, ...announcements])
      setNewAnnouncement({ title: "", content: "" })
      setIsDialogOpen(false)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Announcements & News Feed</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Announcement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAnnouncement} className="space-y-4">
              <div>
                <Input
                  placeholder="Announcement Title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Announcement Content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Post Announcement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{announcement.content}</p>
                  <p className="text-xs text-gray-500">Posted on: {announcement.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

