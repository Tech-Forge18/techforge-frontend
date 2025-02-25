"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Pencil } from "lucide-react"

interface Announcement {
  id: number
  title: string
  content: string
  date: string
}

export function AnnouncementsFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)

  // Fetch announcements from the backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/announcements/")
        if (!response.ok) {
          throw new Error("Failed to fetch announcements")
        }
        const data = await response.json()
        setAnnouncements(data)
      } catch (error) {
        console.error("Error fetching announcements:", error)
      }
    }

    fetchAnnouncements()
  }, [])

  // Add a new announcement
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newAnnouncement.title && newAnnouncement.content) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/announcements/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newAnnouncement,
            date: new Date().toISOString().split("T")[0],
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add announcement")
        }

        const data = await response.json()
        setAnnouncements([data, ...announcements])
        setNewAnnouncement({ title: "", content: "" })
        setIsDialogOpen(false)
      } catch (error) {
        console.error("Error adding announcement:", error)
      }
    }
  }

  // Delete an announcement
  const handleDeleteAnnouncement = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/announcements/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete announcement")
      }

      setAnnouncements(announcements.filter((announcement) => announcement.id !== id))
    } catch (error) {
      console.error("Error deleting announcement:", error)
    }
  }

  // Edit an announcement
  const handleEditAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAnnouncement && editingAnnouncement.title && editingAnnouncement.content) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/announcements/${editingAnnouncement.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingAnnouncement),
        })

        if (!response.ok) {
          throw new Error("Failed to update announcement")
        }

        const data = await response.json()
        setAnnouncements(
          announcements.map((announcement) =>
            announcement.id === editingAnnouncement.id ? data : announcement
          )
        )
        setEditingAnnouncement(null)
      } catch (error) {
        console.error("Error updating announcement:", error)
      }
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
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingAnnouncement(announcement)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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

      {/* Edit Announcement Dialog */}
      <Dialog open={!!editingAnnouncement} onOpenChange={() => setEditingAnnouncement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          {editingAnnouncement && (
            <form onSubmit={handleEditAnnouncement} className="space-y-4">
              <div>
                <Input
                  placeholder="Announcement Title"
                  value={editingAnnouncement.title}
                  onChange={(e) =>
                    setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Announcement Content"
                  value={editingAnnouncement.content}
                  onChange={(e) =>
                    setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
