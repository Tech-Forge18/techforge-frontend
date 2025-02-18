"use client"

import { useState } from "react"
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

const dummyProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    client: "ABC Corp",
    status: "In Progress",
    deadline: "2024-06-30",
    teamSize: 5,
    description: "Developing a full-featured e-commerce platform with inventory management",
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "XYZ Inc",
    status: "Planning",
    deadline: "2024-08-15",
    teamSize: 3,
    description: "Creating a cross-platform mobile app for task management",
  },
  {
    id: 3,
    name: "Data Analytics Dashboard",
    client: "123 Analytics",
    status: "Completed",
    deadline: "2024-05-01",
    teamSize: 4,
    description: "Building a real-time data analytics dashboard for business insights",
  },
  {
    id: 4,
    name: "Website Redesign",
    client: "Design Co",
    status: "In Progress",
    deadline: "2024-07-20",
    teamSize: 2,
    description: "Redesigning and modernizing the company's main website",
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(dummyProjects)
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    status: "",
    deadline: "",
    teamSize: 0,
    description: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddProject = (e) => {
    e.preventDefault()
    setProjects([...projects, { id: projects.length + 1, ...newProject }])
    setIsAddProjectOpen(false)
    setNewProject({
      name: "",
      client: "",
      status: "",
      deadline: "",
      teamSize: 0,
      description: "",
    })
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cool-700 dark:text-cool-300">
                    Project Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-cool-700 dark:text-cool-300">
                    Client
                  </Label>
                  <Input
                    id="client"
                    name="client"
                    value={newProject.client}
                    onChange={handleInputChange}
                    className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-cool-700 dark:text-cool-300">
                    Status
                  </Label>
                  <Select
                    name="status"
                    value={newProject.status}
                    onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                  >
                    <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
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
                  <Label htmlFor="deadline" className="text-cool-700 dark:text-cool-300">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={newProject.deadline}
                    onChange={handleInputChange}
                    className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize" className="text-cool-700 dark:text-cool-300">
                    Team Size
                  </Label>
                  <Input
                    id="teamSize"
                    name="teamSize"
                    type="number"
                    value={newProject.teamSize}
                    onChange={handleInputChange}
                    className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-cool-700 dark:text-cool-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddProjectOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white w-full sm:w-auto">
                    Add Project
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-4">
          <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
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
                    <span>Team Size: {project.teamSize}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.status}
                  </span>
                  <Button>View Details</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

