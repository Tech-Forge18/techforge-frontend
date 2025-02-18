"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
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

// Dummy data
const members = [
  {
    id: 1,
    name: "John Doe",
    role: "Full Stack Developer",
    department: "Engineering",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "UI Designer",
    department: "Design",
    email: "jane@example.com",
    status: "Active",
  },
  // Add more dummy data as needed
]

export default function MembersPage() {
  const { t } = useTranslation()
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-cool-700 dark:text-cool-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
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
                    className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department" className="text-cool-700 dark:text-cool-300">
                    Department
                  </Label>
                  <Select>
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
                <Button className="bg-vibrant-500 hover:bg-vibrant-600 text-white">Add Member</Button>
              </div>
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
            <TableContainer component={Paper} className="bg-white dark:bg-cool-800">
              <Table aria-label="members table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Name</TableCell>
                    <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Role</TableCell>
                    <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Department</TableCell>
                    <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Email</TableCell>
                    <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Status</TableCell>
                    <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.name}</TableCell>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.role}</TableCell>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.department}</TableCell>
                      <TableCell className="text-cool-800 dark:text-cool-200">{member.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                          {member.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-cool-600 hover:text-cool-800 dark:text-cool-400 dark:hover:text-cool-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-cool-600 hover:text-cool-800 dark:text-cool-400 dark:hover:text-cool-200"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-cool-600 hover:text-cool-800 dark:text-cool-400 dark:hover:text-cool-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

