"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Pencil, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast"; // Assuming you have this for notifications
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SupportTicket {
  id: number;
  title: string;
  category: string;
  priority: string;
  description: string;
  contactinfo: number;
  file?: string; // URL to the file if it exists
}

export function TicketTracking() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [editTicket, setEditTicket] = useState<SupportTicket | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // For delete confirmation
  const [ticketToDelete, setTicketToDelete] = useState<number | null>(null); // Track ticket to delete
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/supports/");
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      });
    }
  };

  // Filter tickets for search and pagination
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setTicketToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!ticketToDelete) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/supports/${ticketToDelete}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete ticket");
      setTickets(tickets.filter((ticket) => ticket.id !== ticketToDelete));
      setIsDeleteConfirmOpen(false);
      setTicketToDelete(null);
      toast({ title: "Success", description: "Ticket deleted successfully" });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({ title: "Error", description: "Failed to delete ticket", variant: "destructive" });
    }
  };

  const handleEdit = (ticket: SupportTicket) => {
    setEditTicket(ticket);
    setEditFile(null); // Reset file for new upload
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTicket) return;

    const formData = new FormData();
    formData.append("title", editTicket.title);
    formData.append("category", editTicket.category);
    formData.append("priority", editTicket.priority);
    formData.append("description", editTicket.description);
    formData.append("contactinfo", editTicket.contactinfo.toString());
    if (editFile) formData.append("file", editFile);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/supports/${editTicket.id}/`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update ticket");
      const updatedTicket = await response.json();
      setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
      setIsEditDialogOpen(false);
      setEditTicket(null);
      setEditFile(null);
      toast({ title: "Success", description: "Ticket updated successfully" });
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({ title: "Error", description: "Failed to update ticket", variant: "destructive" });
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto font-sans"
    >
      <Card className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900 p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
            Ticket Status
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <Dialog open={false} onOpenChange={() => {}}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Ticket
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <TableContainer
            component={Paper}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto"
          >
            <Table stickyHeader aria-label="ticket tracking table">
              <TableHead>
                <TableRow className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">
                  <TableCell className="px-4 py-3 font-semibold">ID</TableCell>
                  <TableCell className="px-4 py-3 font-semibold">Title</TableCell>
                  <TableCell className="px-4 py-3 font-semibold">Category</TableCell>
                  <TableCell className="px-4 py-3 font-semibold">Priority</TableCell>
                  <TableCell className="px-4 py-3 font-semibold">Description</TableCell>
                  <TableCell className="px-4 py-3 font-semibold">Contact Info</TableCell>
                  <TableCell className="px-4 py-3 font-semibold">File</TableCell>
                  <TableCell className="px-4 py-3 font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="border-t border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800/50 transition-colors"
                  >
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {ticket.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {ticket.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {ticket.category}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Chip
                        label={ticket.priority}
                        size="small"
                        className={`${
                          ticket.priority === "High" || ticket.priority === "Urgent"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : ticket.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {ticket.description.substring(0, 50)}...
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {ticket.contactinfo}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {ticket.file ? (
                        <a
                          href={ticket.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                        >
                          View File
                        </a>
                      ) : (
                        "No File"
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(ticket)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDeleteConfirm(ticket.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 dark:bg-indigo-900 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 font-semibold"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 font-semibold"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                Edit Ticket
              </DialogTitle>
            </DialogHeader>
            {editTicket && (
              <form onSubmit={handleEditSubmit} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold">Title</Label>
                  <Input
                    id="title"
                    value={editTicket.title}
                    onChange={(e) => setEditTicket({ ...editTicket, title: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 font-semibold">Category</Label>
                  <Select
                    value={editTicket.category}
                    onValueChange={(value) => setEditTicket({ ...editTicket, category: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Inquiry</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300 font-semibold">Priority</Label>
                  <Select
                    value={editTicket.priority}
                    onValueChange={(value) => setEditTicket({ ...editTicket, priority: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
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
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    value={editTicket.description}
                    onChange={(e) => setEditTicket({ ...editTicket, description: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 min-h-[120px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactinfo" className="text-gray-700 dark:text-gray-300 font-semibold">Contact Info</Label>
                  <Input
                    id="contactinfo"
                    type="number"
                    value={editTicket.contactinfo}
                    onChange={(e) => setEditTicket({ ...editTicket, contactinfo: Number(e.target.value) })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-gray-700 dark:text-gray-300 font-semibold">Update File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <DialogFooter className="flex justify-end gap-2 pt-4">
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
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-red-600 dark:text-red-400">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Are you sure you want to delete this ticket? This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="flex justify-end gap-2 p-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </motion.div>
  );
}