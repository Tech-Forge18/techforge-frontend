"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

// Define a type for the member object
interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
  department: string;
  status: string;
}

// API base URL
const apiBaseUrl = "https://techforge-backend.onrender.com/api/members";

export default function MembersPage() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isValidationErrorOpen, setIsValidationErrorOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false); // Added for success popup
  const [successMessage, setSuccessMessage] = useState(""); // Added to customize success message
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMember, setNewMember] = useState<Member>({
    id: 0,
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
  });
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [originalEditMember, setOriginalEditMember] = useState<Member | null>(null); // To track original data for comparison
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  // Fetch members data on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(apiBaseUrl);
        setMembers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast({
          title: "Error",
          description: "Failed to load members",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Filter and paginate members
  const filteredMembers = members.filter((member) =>
    (member.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (member.role || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (member.department || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (member.email || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Validation function for member data
  const validateMemberData = (member: Member): boolean => {
    return (
      member.name.trim() !== "" &&
      member.email.trim() !== "" &&
      member.role.trim() !== "" &&
      member.department.trim() !== "" &&
      member.status.trim() !== ""
    );
  };

  // Check if there are changes between original and edited member
  const hasChanges = (original: Member, edited: Member): boolean => {
    return (
      original.name !== edited.name ||
      original.email !== edited.email ||
      original.role !== edited.role ||
      original.department !== edited.department ||
      original.status !== edited.status
    );
  };

  // CRUD handlers
  const handleAddMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateMemberData(newMember)) {
      setIsValidationErrorOpen(true);
      return;
    }
    try {
      const response = await axios.post(apiBaseUrl, newMember, {
        headers: { "Content-Type": "application/json" },
      });
      setMembers([...members, response.data]);
      setIsAddMemberOpen(false);
      setNewMember({ id: 0, name: "", email: "", role: "", department: "", status: "Active" });
      setSuccessMessage("Member added successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Member added successfully" });
    } catch (error) {
      console.error("Error adding member:", error);
      toast({ title: "Error", description: "Failed to add member", variant: "destructive" });
    }
  };

  const handleEditMember = (member: Member) => {
    setEditMember(member);
    setOriginalEditMember({ ...member }); // Store original data for comparison
    setIsEditMemberOpen(true);
  };

  const handleUpdateMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editMember || !validateMemberData(editMember)) {
      setIsValidationErrorOpen(true);
      return;
    }

    // Check if there are any changes before updating
    if (originalEditMember && !hasChanges(originalEditMember, editMember)) {
      setIsEditMemberOpen(false); // No changes, just close the dialog
      setEditMember(null);
      setOriginalEditMember(null);
      return; // Exit without showing success or making API call
    }

    try {
      const response = await axios.put(`${apiBaseUrl}${editMember.id}/`, editMember, {
        headers: { "Content-Type": "application/json" },
      });
      setMembers(members.map((m) => (m.id === editMember.id ? response.data : m)));
      setIsEditMemberOpen(false);
      setEditMember(null);
      setOriginalEditMember(null);
      setSuccessMessage("Member updated successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Member updated successfully" });
    } catch (error) {
      console.error("Error updating member:", error);
      toast({ title: "Error", description: "Failed to update member", variant: "destructive" });
    }
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setMemberToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      await axios.delete(`${apiBaseUrl}${memberToDelete}/`);
      setMembers(members.filter((member) => member.id !== memberToDelete));
      setIsDeleteConfirmOpen(false);
      setMemberToDelete(null);
      setSuccessMessage("Member deleted successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Member deleted successfully" });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMemberOpen(false);
    setEditMember(null);
    setOriginalEditMember(null); // Reset original data
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-300"
          >
            {t("Members")}
          </motion.h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-indigo-600 dark:text-indigo-400">Add New Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMember} className="space-y-4 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
                    <Input
                      id="role"
                      placeholder="Enter role"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">Department</Label>
                    <Select
                      value={newMember.department}
                      onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                    >
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
                    <Select
                      value={newMember.status}
                      onValueChange={(value) => setNewMember({ ...newMember, status: value })}
                    >
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddMemberOpen(false)}
                      className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      Submit
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Members Table */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full">
          <Card className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900">
              <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">All Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg bg-indigo-100 dark:bg-indigo-800" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Role</th>
                        <th className="px-4 py-3 font-semibold">Department</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="border-t border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{member.name}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{member.role}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{member.department}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{member.email}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                member.status === "Active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMember(member)}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteConfirm(member.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Pagination */}
              {!isLoading && (
                <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 dark:bg-indigo-900">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-indigo-700 dark:text-indigo-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Member Dialog */}
        <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Edit Member</DialogTitle>
            </DialogHeader>
            {editMember && (
              <form onSubmit={handleUpdateMember} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
                  <Input
                    id="name"
                    value={editMember.name}
                    onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    value={editMember.email}
                    onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
                  <Input
                    id="role"
                    value={editMember.role}
                    onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">Department</Label>
                  <Select
                    value={editMember.department}
                    onValueChange={(value) => setEditMember({ ...editMember, department: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
                  <Select
                    value={editMember.status}
                    onValueChange={(value) => setEditMember({ ...editMember, status: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit} // Use new cancel handler
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-red-600 dark:text-red-400">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this member? This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="flex justify-end gap-2 p-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteMember}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Validation Error Dialog */}
        <Dialog open={isValidationErrorOpen} onOpenChange={setIsValidationErrorOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-red-600 dark:text-red-400">Form Error</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">
                All fields are required. Please fill in all the inputs before submitting.
              </p>
            </div>
            <DialogFooter className="flex justify-end p-4">
              <Button
                variant="outline"
                onClick={() => setIsValidationErrorOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Popup Dialog */}
        <Dialog open={isSuccessPopupOpen} onOpenChange={setIsSuccessPopupOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-green-600 dark:text-green-400">Success</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">{successMessage}</p>
            </div>
            <DialogFooter className="flex justify-end p-4">
              <Button
                variant="outline"
                onClick={() => setIsSuccessPopupOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}