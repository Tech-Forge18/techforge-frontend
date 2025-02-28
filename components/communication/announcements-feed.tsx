"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Pencil, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

export function AnnouncementsFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  // Fetch announcements from the backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/announcements/");
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast({
          title: "Error",
          description: "Failed to load announcements",
          variant: "destructive",
        });
      }
    };

    fetchAnnouncements();
  }, []);

  // Add a new announcement
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
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
      });

      if (!response.ok) {
        throw new Error("Failed to add announcement");
      }

      const data = await response.json();
      setAnnouncements([data, ...announcements]);
      setNewAnnouncement({ title: "", content: "" });
      setIsAddDialogOpen(false);
      toast({ title: "Success", description: "Announcement added successfully" });
    } catch (error) {
      console.error("Error adding announcement:", error);
      toast({ title: "Error", description: "Failed to add announcement", variant: "destructive" });
    }
  };

  // Edit an announcement
  const handleEditAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editingAnnouncement.title.trim() || !editingAnnouncement.content.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/announcements/${editingAnnouncement.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingAnnouncement),
      });

      if (!response.ok) {
        throw new Error("Failed to update announcement");
      }

      const data = await response.json();
      setAnnouncements(
        announcements.map((announcement) =>
          announcement.id === editingAnnouncement.id ? data : announcement
        )
      );
      setIsEditDialogOpen(false);
      setEditingAnnouncement(null);
      toast({ title: "Success", description: "Announcement updated successfully" });
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast({ title: "Error", description: "Failed to update announcement", variant: "destructive" });
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteConfirm = (id: number) => {
    setAnnouncementToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Delete an announcement
  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/announcements/${announcementToDelete}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementToDelete));
      setIsDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
      toast({ title: "Success", description: "Announcement deleted successfully" });
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" });
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="h-[600px] flex flex-col bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900 p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
            Announcements & News Feed
          </CardTitle>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Announcement
          </Button>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="relative"
                >
                  <Card className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="p-4 bg-indigo-50 dark:bg-indigo-900/30">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">
                          {announcement.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingAnnouncement(announcement);
                              setIsEditDialogOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                          >
                            <Pencil className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDeleteConfirm(announcement.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
                        {announcement.content}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Posted on: {new Date(announcement.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Announcement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Add New Announcement
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAnnouncement} className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Announcement Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-700 dark:text-gray-300 font-semibold">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Announcement Content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 min-h-[120px]"
                required
              />
            </div>
            <div className="flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-900 p-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 font-semibold"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Post Announcement
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Edit Announcement
            </DialogTitle>
          </DialogHeader>
          {editingAnnouncement && (
            <form onSubmit={handleEditAnnouncement} className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Announcement Title"
                  value={editingAnnouncement.title}
                  onChange={(e) =>
                    setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })
                  }
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300 font-semibold">
                  Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Announcement Content"
                  value={editingAnnouncement.content}
                  onChange={(e) =>
                    setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })
                  }
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 min-h-[120px]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-900 p-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 font-semibold"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this announcement? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-2 p-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAnnouncement}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}