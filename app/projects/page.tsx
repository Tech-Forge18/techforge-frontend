"use client"
import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Briefcase, Calendar, Users, Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'

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

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL)
      setProjects(response.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject((prev) => ({
      ...prev,
      [name]: name === "teamsize" ? Number(value) : value,
    }))
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(API_URL, newProject)
      setProjects([...projects, response.data])
      setNewProject({
        id: 0,
        name: "",
        client: "",
        status: "Planning",
        deadline: "",
        teamsize: 0,
        description: "",
      })
      setIsAddProjectOpen(false)
    } catch (error) {
      console.error("Error adding project:", error)
    }
  }

  const handleDeleteProject = async (id: number) => {
    try {
      await axios.delete(`${API_URL}${id}/`)
      setProjects(projects.filter((project) => project.id !== id))
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const response = await axios.put(`${API_URL}${updatedProject.id}/`, updatedProject)
      setProjects(projects.map((project) => (project.id === updatedProject.id ? response.data : project)))
      setIsEditProjectOpen(false)
      setEditProject(null) // Clear editProject state after successful update
    } catch (error) {
      console.error("Error updating project:", error)
    }
  }

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

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
          <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
            <DialogTrigger asChild>
              <Button className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-full">
              <DialogHeader>
                <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add New Project</DialogTitle>
                <DialogDescription className="text-cool-600 dark:text-cool-400">
                  Create a new project for your organization.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProject} className="space-y-4">
                {/* Form fields */}
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent className="sm:max-w-[425px] w-full">
            <DialogHeader>
              <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Edit Project</DialogTitle>
              <DialogDescription className="text-cool-600 dark:text-cool-400">
                Edit the details of your project.
              </DialogDescription>
            </DialogHeader>
            {editProject && (
              <form onSubmit={() => handleUpdateProject(editProject)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editProject.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    name="client"
                    value={editProject.client}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={editProject.status}
                    onValueChange={(value) => setEditProject({ ...editProject, status: value })}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={editProject.deadline}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamsize">Team Size</Label>
                  <Input
                    id="teamsize"
                    name="teamsize"
                    type="number"
                    value={editProject.teamsize}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editProject.description}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditProjectOpen(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white w-full sm:w-auto">
                    Update
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Deadline: {project.deadline}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Team Size: {project.teamsize}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleEditClick(project)}
                    className="w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteProject(project.id)}
                    className="w-full sm:w-auto"
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
