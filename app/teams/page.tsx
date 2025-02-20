"use client"

import type React from "react"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Eye, Plus } from "lucide-react"
import { TeamDetail } from "@/components/team-detail"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"

// Dummy data
const teams = [
  {
    id: 1,
    name: "Frontend Development",
    leader: "John Doe",
    members: ["John Doe", "Jane Smith", "Alice Johnson"],
    projects: ["E-commerce Platform", "Company Website Redesign"],
  },
  {
    id: 2,
    name: "Backend Development",
    leader: "Bob Wilson",
    members: ["Bob Wilson", "Charlie Brown", "David Lee"],
    projects: ["API Development", "Database Optimization"],
  },
  // Add more dummy data as needed
]

const allMembers = [
  "John Doe",
  "Jane Smith",
  "Alice Johnson",
  "Bob Wilson",
  "Charlie Brown",
  "David Lee",
  // Add more members as needed
]

export default function TeamsPage() {
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [newTeam, setNewTeam] = useState({
    name: "",
    leader: "",
    members: [],
  })
  const [searchTerm, setSearchTerm] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTeam((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the new team to your backend
    console.log("New team:", newTeam)
    setIsAddTeamOpen(false)
    setNewTeam({
      name: "",
      leader: "",
      members: [],
    })
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leader.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <PageLayout title="Teams" addButtonLabel="Add Team" isOpen={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
      <div className="mb-4">
        <Input placeholder="Search teams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Teams</CardTitle>
          <CardDescription>Manage your organization's teams here.</CardDescription>
        </CardHeader>
        <CardContent>
          <TableContainer component={Paper} className="bg-white dark:bg-cool-800">
            <Table aria-label="teams table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Team Name</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Team Leader</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Members</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Projects</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="text-cool-800 dark:text-cool-200">{team.name}</TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{team.leader}</TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{team.members.length}</TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{team.projects.length}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTeam(team)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
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
      {selectedTeam && (
        <TeamDetail
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onUpdate={(updatedTeam) => {
            // Here you would typically update the team in your backend
            console.log("Updated team:", updatedTeam)
            setSelectedTeam(null)
          }}
          allMembers={allMembers}
        />
      )}
      <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
        <DialogTrigger asChild>
          
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] w-full">
          <DialogHeader>
            <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add New Team</DialogTitle>
            <DialogDescription className="text-cool-600 dark:text-cool-400">
              Create a new team for your organization.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-cool-700 dark:text-cool-300">
                Team Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newTeam.name}
                onChange={handleInputChange}
                className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leader" className="text-cool-700 dark:text-cool-300">
                Team Leader
              </Label>
              <Select
                name="leader"
                value={newTeam.leader}
                onValueChange={(value) => setNewTeam({ ...newTeam, leader: value })}
              >
                <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                  <SelectValue placeholder="Select team leader" />
                </SelectTrigger>
                <SelectContent>
                  {allMembers.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-cool-700 dark:text-cool-300">Team Members</Label>
              <Select
                name="members"
                value={newTeam.members}
                onValueChange={(value) => setNewTeam({ ...newTeam, members: [...newTeam.members, value] })}
              >
                <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                  <SelectValue placeholder="Select team members" />
                </SelectTrigger>
                <SelectContent>
                  {allMembers
                    .filter((member) => !newTeam.members.includes(member))
                    .map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="mt-2">
                {newTeam.members.map((member) => (
                  <span
                    key={member}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                  >
                    {member}
                    <button
                      type="button"
                      className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setNewTeam({ ...newTeam, members: newTeam.members.filter((m) => m !== member) })}
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddTeamOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white w-full sm:w-auto">
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

