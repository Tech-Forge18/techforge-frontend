"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Calendar,
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Skeleton from "@mui/material/Skeleton";

// Define Project Type
interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  deadline: string;
  teamsize: number;
  description: string;
}

const API_URL = "https://techforge-backend.onrender.com/api";

export default function ProjectsPage() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isValidationErrorOpen, setIsValidationErrorOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    id: 0,
    name: "",
    client: "",
    status: "Planning",
    deadline: "",
    teamsize: 0,
    description: "",
  });
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { y: -10, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
  };

  // Fetch Projects on Mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_URL);
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({ title: "Error", description: "Failed to load projects", variant: "destructive" });
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter and Paginate Projects
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Validation function for project data with null checks
  const validateProjectData = (project: Project): boolean => {
    const isValid =
      project.name?.trim() !== "" &&
      project.client?.trim() !== "" &&
      project.status?.trim() !== "" && // Added null check with optional chaining
      project.deadline?.trim() !== "" &&
      project.teamsize >= 0 &&
      project.description?.trim() !== "";
    console.log("Validation result:", isValid, "Project data:", project);
    return isValid;
  };

  // Handle Input Changes for New Project
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: name === "teamsize" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  // Handle Adding a Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new project:", newProject);
    if (!validateProjectData(newProject)) {
      setIsValidationErrorOpen(true);
      return;
    }
    try {
      const response = await axios.post(API_URL, newProject, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("API response:", response.data);
      setProjects([...projects, response.data]);
      setNewProject({ id: 0, name: "", client: "", status: "Planning", deadline: "", teamsize: 0, description: "" });
      setIsAddProjectOpen(false);
      setSuccessMessage("Project added successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Project added successfully" });
    } catch (error) {
      console.error("Error adding project:", error);
      toast({ title: "Error", description: "Failed to add project", variant: "destructive" });
    }
  };

  // Handle Deleting a Project
  const handleOpenDeleteConfirm = (id: number) => {
    setProjectToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await axios.delete(`${API_URL}${projectToDelete}/`);
      setProjects(projects.filter((project) => project.id !== projectToDelete));
      setIsDeleteConfirmOpen(false);
      setProjectToDelete(null);
      setSuccessMessage("Project deleted successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    }
  };

  // Handle Editing a Project
  const handleEditClick = (project: Project) => {
    // Ensure all fields are defined when setting editProject
    setEditProject({
      ...project,
      status: project.status || "Planning", // Default to "Planning" if status is undefined
    });
    setIsEditProjectOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editProject) {
      const { name, value } = e.target;
      setEditProject({
        ...editProject,
        [name]: name === "teamsize" ? (value === "" ? 0 : Number(value)) : value,
      });
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting updated project:", editProject);
    if (!editProject || !validateProjectData(editProject)) {
      setIsValidationErrorOpen(true);
      return;
    }
    try {
      const response = await axios.put(`${API_URL}${editProject.id}/`, editProject, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("API response:", response.data);
      setProjects(projects.map((project) => (project.id === editProject.id ? response.data : project)));
      setIsEditProjectOpen(false);
      setEditProject(null);
      setSuccessMessage("Data is updated successfully"); // Specific message for update
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Project updated successfully" });
    } catch (error) {
      console.error("Error updating project:", error);
      toast({ title: "Error", description: "Failed to update project", variant: "destructive" });
    }
  };

  // Handle Viewing Project Details
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsViewDetailsOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-300"
          >
            Projects
          </motion.h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-indigo-600 dark:text-indigo-400">Add New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProject} className="space-y-4 p-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Project Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProject.name}
                      onChange={handleInputChange}
                      className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
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
                      className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
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
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full">
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
                      className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamsize" className="text-gray-700 dark:text-gray-300">Team Size</Label>
                    <Input
                      id="teamsize"
                      name="teamsize"
                      type="number"
                      value={newProject.teamsize === 0 ? "" : newProject.teamsize}
                      onChange={handleInputChange}
                      className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                      placeholder="Enter team size"
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
                      className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddProjectOpen(false)}
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

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg bg-indigo-100 dark:bg-indigo-800" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onClick={() => handleViewDetails(project)}
                  className="cursor-pointer"
                >
                  <Card className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-xl shadow-lg overflow-hidden transform transition-transform">
                    <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 p-4 relative">
                      <CardTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                        {project.name}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 rounded-md shadow-md">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(project);
                            }}
                            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteConfirm(project.id);
                            }}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                          <span>{project.client}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                          <span>{project.deadline}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                          <span>{project.teamsize}</span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.status === "Completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : project.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
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
            {/* Pagination Controls */}
            {!isLoading && filteredProjects.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6 bg-indigo-50 dark:bg-indigo-900 p-4 rounded-md shadow-md">
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
          </>
        )}

        {/* View Project Details Dialog */}
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Project Details</DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <div className="p-4 space-y-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Project Name</Label>
                  <p className="text-gray-800 dark:text-gray-200">{selectedProject.name}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Client</Label>
                  <p className="text-gray-800 dark:text-gray-200">{selectedProject.client}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Status</Label>
                  <p
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedProject.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : selectedProject.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
                    }`}
                  >
                    {selectedProject.status}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Deadline</Label>
                  <p className="text-gray-800 dark:text-gray-200">{selectedProject.deadline}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Team Size</Label>
                  <p className="text-gray-800 dark:text-gray-200">{selectedProject.teamsize}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Description</Label>
                  <p className="text-gray-800 dark:text-gray-200">{selectedProject.description}</p>
                </div>
              </div>
            )}
            <DialogFooter className="p-4">
              <Button
                variant="outline"
                onClick={() => setIsViewDetailsOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Edit Project</DialogTitle>
            </DialogHeader>
            {editProject && (
              <form onSubmit={handleUpdateProject} className="space-y-4 p-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editProject.name}
                    onChange={handleEditInputChange}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
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
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
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
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full">
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
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamsize" className="text-gray-700 dark:text-gray-300">Team Size</Label>
                  <Input
                    id="teamsize"
                    name="teamsize"
                    type="number"
                    value={editProject.teamsize === 0 ? "" : editProject.teamsize}
                    onChange={handleEditInputChange}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                    placeholder="Enter team size"
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
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditProjectOpen(false)}
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Update
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
                Are you sure you want to delete this project? This action cannot be undone.
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
                onClick={handleDeleteProject}
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