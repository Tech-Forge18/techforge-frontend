"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"

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
const apiBaseUrl = "http://127.0.0.1:8000/api/members/" // Replace with actual API URL

export default function MembersPage() {
  const { t } = useTranslation()
  const [members, setMembers] = useState<Member[]>([])
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)  // State to manage the edit dialog
  const [searchTerm, setSearchTerm] = useState("")
  const [newMember, setNewMember] = useState<Member>({
    id: 0,
    name: "",
    email: "",
    role: "",
    department: "",
    status: "active", // Default status
  })

  const [editMember, setEditMember] = useState<Member | null>(null)  // State to manage the member being edited

  // Fetch members data on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(apiBaseUrl)
        setMembers(response.data)
      } catch (error) {
        console.error("Error fetching members:", error)
      }
    }
    fetchMembers()
  }, [])

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle adding a new member
  const handleAddMember = async (event: React.FormEvent) => {
    event.preventDefault() // Prevent the default form submission
    try {
      const response = await axios.post(apiBaseUrl, newMember, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setMembers([...members, response.data])
      setIsAddMemberOpen(false)
      setNewMember({ id: 0, name: "", email: "", role: "", department: "", status: "active" }) // Reset form
    } catch (error) {
      console.error("Error adding member:", error)
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
    if (!editMember) return // Prevent submission if no member is selected
    try {
      const response = await axios.put(`${apiBaseUrl}${editMember.id}/`, editMember, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setMembers(members.map((member) => (member.id === editMember.id ? response.data : member)))
      setIsEditMemberOpen(false)
      setEditMember(null) // Reset edit member state
    } catch (error) {
      console.error("Error updating member:", error)
    }
  }

  // Handle deleting a member
  const handleDeleteMember = async (id: number) => {
    try {
      await axios.delete(`${apiBaseUrl}${id}/`)
      setMembers(members.filter((member) => member.id !== id))
    } catch (error) {
      console.error("Error deleting member:", error)
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-cool-800 dark:text-cool-100">{t("members")}</h1>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add New Member</DialogTitle>
                <DialogDescription className="text-cool-600 dark:text-cool-400">
                  Add a new member to your organization.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMember}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-cool-700 dark:text-cool-300">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-cool-700 dark:text-cool-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role" className="text-cool-700 dark:text-cool-300">
                      Role
                    </Label>
                    <Input
                      id="role"
                      placeholder="Enter role"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department" className="text-cool-700 dark:text-cool-300">
                      Department
                    </Label>
                    <Select
                      value={newMember.department}
                      onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                    >
                      <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
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
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddMemberOpen(false)}
                    className="border-cool-200 dark:border-cool-600 text-cool-700 dark:text-cool-300"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
                    Submit
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-cool-400 dark:text-cool-500" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
          />
        </div>

        <Card className="bg-white dark:bg-cool-800 border-cool-200 dark:border-cool-700">
          <CardHeader>
            <CardTitle className="text-cool-800 dark:text-cool-100">All Members</CardTitle>
            <CardDescription className="text-cool-600 dark:text-cool-400">
              Manage your organization members here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.name}</TableCell>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.role}</TableCell>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.department}</TableCell>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.email}</TableCell>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          onClick={() => handleEditMember(member)}  // Open edit dialog
                          className="text-cool-600 dark:text-cool-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => handleDeleteMember(member.id)}  // Delete member
                          className="text-cool-600 dark:text-cool-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateMember}>
            {editMember && (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editMember.name}
                      onChange={(e) =>
                        setEditMember({ ...editMember, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editMember.email}
                      onChange={(e) =>
                        setEditMember({ ...editMember, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={editMember.role}
                      onChange={(e) =>
                        setEditMember({ ...editMember, role: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={editMember.department}
                      onValueChange={(value) =>
                        setEditMember({ ...editMember, department: value })
                      }
                    >
                      <SelectTrigger>
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
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMemberOpen(false)}
                    className="border-cool-200 dark:border-cool-600 text-cool-700 dark:text-cool-300"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}