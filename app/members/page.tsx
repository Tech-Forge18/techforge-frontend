"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

// Define a type for the member object
interface Member {
  id: number
  name: string
  role: string
  email: string
  department: string
  status: string
}

// API base URL
const apiBaseUrl = "http://127.0.0.1:8000/api/members/"

export default function MembersPage() {
  const { t } = useTranslation()
  const [members, setMembers] = useState<Member[]>([])
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMember, setNewMember] = useState<Member>({
    id: 0,
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
  })
  const [editMember, setEditMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  }

  // Fetch members data on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(apiBaseUrl)
        setMembers(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching members:", error)
        toast({
          title: "Error",
          description: "Failed to load members",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle adding a new member
  const handleAddMember = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await axios.post(apiBaseUrl, newMember, {
        headers: { "Content-Type": "application/json" },
      })
      setMembers([...members, response.data])
      setIsAddMemberOpen(false)
      setNewMember({ id: 0, name: "", email: "", role: "", department: "", status: "Active" })
      toast({ title: "Success", description: "Member added successfully" })
    } catch (error) {
      console.error("Error adding member:", error)
      toast({ title: "Error", description: "Failed to add member", variant: "destructive" })
    }
  }

  // Handle opening the edit form with selected member details
  const handleEditMember = (member: Member) => {
    setEditMember(member)
    setIsEditMemberOpen(true)
  }

  // Handle updating a member
  const handleUpdateMember = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editMember) return
    try {
      const response = await axios.put(`${apiBaseUrl}${editMember.id}/`, editMember, {
        headers: { "Content-Type": "application/json" },
      })
      setMembers(members.map((m) => (m.id === editMember.id ? response.data : m)))
      setIsEditMemberOpen(false)
      setEditMember(null)
      toast({ title: "Success", description: "Member updated successfully" })
    } catch (error) {
      console.error("Error updating member:", error)
      toast({ title: "Error", description: "Failed to update member", variant: "destructive" })
    }
  }

  // Handle deleting a member
  const handleDeleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return
    try {
      await axios.delete(`${apiBaseUrl}${id}/`)
      setMembers(members.filter((member) => member.id !== id))
      toast({ title: "Success", description: "Member deleted successfully" })
    } catch (error) {
      console.error("Error deleting member:", error)
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" })
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100"
          >
            {t("members")}
          </motion.h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white transition-colors">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-teal-600 dark:text-teal-400">Add New Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMember} className="space-y-4 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
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
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
                    <Input
                      id="role"
                      placeholder="Enter role"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">Department</Label>
                    <Select
                      value={newMember.department}
                      onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                    >
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500">
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
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddMemberOpen(false)}
                      className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
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
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">All Members</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                      <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Role</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Department</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <TableCell className="text-gray-800 dark:text-gray-200">{member.name}</TableCell>
                        <TableCell className="text-gray-800 dark:text-gray-200">{member.role}</TableCell>
                        <TableCell className="text-gray-800 dark:text-gray-200">{member.department}</TableCell>
                        <TableCell className="text-gray-800 dark:text-gray-200">{member.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {member.status}
                          </span>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMember(member)}
                            className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Member Dialog */}
        <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-teal-600 dark:text-teal-400">Edit Member</DialogTitle>
            </DialogHeader>
            {editMember && (
              <form onSubmit={handleUpdateMember} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
                  <Input
                    id="name"
                    value={editMember.name}
                    onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    value={editMember.email}
                    onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
                  <Input
                    id="role"
                    value={editMember.role}
                    onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">Department</Label>
                  <Select
                    value={editMember.department}
                    onValueChange={(value) => setEditMember({ ...editMember, department: value })}
                  >
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500">
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
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMemberOpen(false)}
                    className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}