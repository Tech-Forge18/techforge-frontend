"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Briefcase, Calendar, Users, Plus, Pencil, Trash2, Search, MoreHorizontal } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Skeleton from "@mui/material/Skeleton"

// Define Project Type
interface Project {
  id: number
  name: string
  client: string
  status: string
  deadline: string
  teamsize: number
  description: string
}

const API_URL = "http://127.0.0.1:8000/api/projects/"

export default function ProjectsPage() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)
  const [newProject, setNewProject] = useState<Project>({
    id: 0,
    name: "",
    client: "",
    status: "Planning",
    deadline: "",
    teamsize: 0,
    description: "",
  })
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { y: -5, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } },
  }

  // Fetch Projects on Mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_URL)
        setProjects(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast({ title: "Error", description: "Failed to load projects", variant: "destructive" })
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Handle Input Changes for New Project
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject((prev) => ({
      ...prev,
      [name]: name === "teamsize" ? Number(value) : value,
    }))
  }

  // Handle Adding a Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(API_URL, newProject)
      setProjects([...projects, response.data])
      setNewProject({ id: 0, name: "", client: "", status: "Planning", deadline: "", teamsize: 0, description: "" })
      setIsAddProjectOpen(false)
      toast({ title: "Success", description: "Project added successfully" })
    } catch (error) {
      console.error("Error adding project:", error)
      toast({ title: "Error", description: "Failed to add project", variant: "destructive" })
    }
  }

  // Handle Deleting a Project
  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      await axios.delete(`${API_URL}${id}/`)
      setProjects(projects.filter((project) => project.id !== id))
      toast({ title: "Success", description: "Project deleted successfully" })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" })
    }
  }

  // Handle Editing a Project
  const handleEditClick = (project: Project) => {
    setEditProject(project)
    setIsEditProjectOpen(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editProject) {
      const { name, value } = e.target
      setEditProject({
        ...editProject,
        [name]: name === "teamsize" ? Number(value) : value,
      })
    }
  }

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProject) return
    try {
      const response = await axios.put(`${API_URL}${editProject.id}/`, editProject)
      setProjects(projects.map((project) => (project.id === editProject.id ? response.data : project)))
      setIsEditProjectOpen(false)
      setEditProject(null)
      toast({ title: "Success", description: "Project updated successfully" })
    } catch (error) {
      console.error("Error updating project:", error)
      toast({ title: "Error", description: "Failed to update project", variant: "destructive" })
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100"
          >
            Projects
          </motion.h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
              <DialogTrigger asChild>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white transition-colors">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-teal-600 dark:text-teal-400">Add New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProject} className="space-y-4 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Project Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProject.name}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-gray-700 dark:text-gray-300">Client</Label>
                    <Input
                      id="client"
                      name="client"
                      value={newProject.client}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
                    <Select
                      name="status"
                      value={newProject.status}
                      onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                    >
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-gray-700 dark:text-gray-300">Deadline</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={newProject.deadline}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamsize" className="text-gray-700 dark:text-gray-300">Team Size</Label>
                    <Input
                      id="teamsize"
                      name="teamsize"
                      type="number"
                      value={newProject.teamsize}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newProject.description}
                      onChange={handleInputChange}
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddProjectOpen(false)}
                      className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white">
                      Submit
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-md rounded-lg overflow-hidden">
                  <CardHeader className="bg-gray-100 dark:bg-gray-800 p-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {project.name}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(project)}
                            className="text-teal-600 dark:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                        <span>{project.client}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                        <span>{project.deadline}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                        <span>{project.teamsize}</span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : project.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Project Dialog */}
        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-teal-600 dark:text-teal-400">Edit Project</DialogTitle>
            </DialogHeader>
            {editProject && (
              <form onSubmit={handleUpdateProject} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editProject.name}
                    onChange={handleEditInputChange}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-gray-700 dark:text-gray-300">Client</Label>
                  <Input
                    id="client"
                    name="client"
                    value={editProject.client}
                    onChange={handleEditInputChange}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
                  <Select
                    name="status"
                    value={editProject.status}
                    onValueChange={(value) => setEditProject({ ...editProject, status: value })}
                  >
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-gray-700 dark:text-gray-300">Deadline</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={editProject.deadline}
                    onChange={handleEditInputChange}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamsize" className="text-gray-700 dark:text-gray-300">Team Size</Label>
                  <Input
                    id="teamsize"
                    name="teamsize"
                    type="number"
                    value={editProject.teamsize}
                    onChange={handleEditInputChange}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editProject.description}
                    onChange={handleEditInputChange}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditProjectOpen(false)}
                    className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white">
                    Update
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