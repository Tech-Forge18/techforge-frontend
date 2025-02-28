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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { TaskDetail } from "@/components/task-detail";

interface Task {
  id: number;
  title: string;
  description: string;
  assignedto: string;
  duedate: string;
  priority: string;
  status: string;
}

interface TeamMember {
  id: number;
  name: string;
}

const tasksApiBaseUrl = "http://127.0.0.1:8000/api/tasks/";
const membersApiBaseUrl = "http://127.0.0.1:8000/api/teams/";

export default function TasksPage() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isValidationErrorOpen, setIsValidationErrorOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    assignedto: "",
    duedate: "",
    priority: "",
    status: "Pending",
  });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [originalEditTask, setOriginalEditTask] = useState<Task | null>(null); // Track original task data
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(tasksApiBaseUrl);
        setTasks(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(membersApiBaseUrl);
        setTeamMembers(response.data);
      } catch (error) {
        console.error("Error fetching team members:", error);
        toast({
          title: "Error",
          description: "Failed to load team members",
          variant: "destructive",
        });
      }
    };

    fetchTasks();
    fetchTeamMembers();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const validateTaskData = (task: Task): boolean => {
    return (
      task.title.trim() !== "" &&
      task.description.trim() !== "" &&
      task.assignedto.trim() !== "" &&
      task.duedate.trim() !== "" &&
      task.priority.trim() !== "" &&
      task.status.trim() !== ""
    );
  };

  // Check if there are changes between original and edited task
  const hasChanges = (original: Task, edited: Task): boolean => {
    return (
      original.title !== edited.title ||
      original.description !== edited.description ||
      original.assignedto !== edited.assignedto ||
      original.duedate !== edited.duedate ||
      original.priority !== edited.priority ||
      original.status !== edited.status
    );
  };

  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateTaskData(newTask)) {
      setIsValidationErrorOpen(true);
      return;
    }
    try {
      const response = await axios.post(tasksApiBaseUrl, newTask, {
        headers: { "Content-Type": "application/json" },
      });
      setTasks([...tasks, response.data]);
      setIsAddTaskOpen(false);
      setNewTask({
        id: 0,
        title: "",
        description: "",
        assignedto: "",
        duedate: "",
        priority: "",
        status: "Pending",
      });
      setSuccessMessage("Task added successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Task added successfully" });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({ title: "Error", description: "Failed to add task", variant: "destructive" });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setOriginalEditTask({ ...task }); // Store original task data for comparison
    setIsEditTaskOpen(true);
  };

  const handleUpdateTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editTask || !validateTaskData(editTask)) {
      setIsValidationErrorOpen(true);
      return;
    }

    // Check if there are any changes before updating
    if (originalEditTask && !hasChanges(originalEditTask, editTask)) {
      setIsEditTaskOpen(false); // No changes, just close the dialog
      setEditTask(null);
      setOriginalEditTask(null);
      return; // Exit without showing success or making API call
    }

    try {
      const response = await axios.put(`${tasksApiBaseUrl}${editTask.id}/`, editTask, {
        headers: { "Content-Type": "application/json" },
      });
      setTasks(tasks.map((t) => (t.id === editTask.id ? response.data : t)));
      setIsEditTaskOpen(false);
      setEditTask(null);
      setOriginalEditTask(null);
      setSuccessMessage("Task updated successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Task updated successfully" });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditTaskOpen(false);
    setEditTask(null);
    setOriginalEditTask(null); // Reset original task data
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setTaskToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await axios.delete(`${tasksApiBaseUrl}${taskToDelete}/`);
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      setIsDeleteConfirmOpen(false);
      setTaskToDelete(null);
      setSuccessMessage("Task deleted successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({ title: "Error", description: "Failed to delete task", variant: "destructive" });
    }
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
            {t("Tasks")}
          </motion.h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <Button
              onClick={() => setIsAddTaskOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Tasks Table */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full">
          <Card className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900">
              <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">All Tasks</CardTitle>
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
                        <th className="px-4 py-3 font-semibold">Title</th>
                        <th className="px-4 py-3 font-semibold">Assigned To</th>
                        <th className="px-4 py-3 font-semibold">Due Date</th>
                        <th className="px-4 py-3 font-semibold">Priority</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="border-t border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{task.title}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{task.assignedto}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                            {new Date(task.duedate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === "High"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : task.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === "Completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : task.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTask(task)}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task)}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteConfirm(task.id)}
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

        {/* Add Task Dialog */}
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedto" className="text-gray-700 dark:text-gray-300 font-semibold">Assigned To</Label>
                <Select
                  value={newTask.assignedto}
                  onValueChange={(value) => setNewTask({ ...newTask, assignedto: value })}
                >
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duedate" className="text-gray-700 dark:text-gray-300 font-semibold">Due Date</Label>
                <Input
                  id="duedate"
                  type="date"
                  value={newTask.duedate}
                  onChange={(e) => setNewTask({ ...newTask, duedate: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300 font-semibold">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 font-semibold">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-900 p-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddTaskOpen(false)}
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

        {/* Edit Task Dialog */}
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Edit Task</DialogTitle>
            </DialogHeader>
            {editTask && (
              <form onSubmit={handleUpdateTask} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold">Title</Label>
                  <Input
                    id="title"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    value={editTask.description}
                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedto" className="text-gray-700 dark:text-gray-300 font-semibold">Assigned To</Label>
                  <Select
                    value={editTask.assignedto}
                    onValueChange={(value) => setEditTask({ ...editTask, assignedto: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duedate" className="text-gray-700 dark:text-gray-300 font-semibold">Due Date</Label>
                  <Input
                    id="duedate"
                    type="date"
                    value={editTask.duedate}
                    onChange={(e) => setEditTask({ ...editTask, duedate: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300 font-semibold">Priority</Label>
                  <Select
                    value={editTask.priority}
                    onValueChange={(value) => setEditTask({ ...editTask, priority: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 font-semibold">Status</Label>
                  <Select
                    value={editTask.status}
                    onValueChange={(value) => setEditTask({ ...editTask, status: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-900 p-2">
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
                Are you sure you want to delete this task? This action cannot be undone.
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
                onClick={handleDeleteTask}
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

        {/* Task Detail Dialog */}
        {selectedTask && (
          <TaskDetail taskId={selectedTask.id} onClose={() => setSelectedTask(null)} />
        )}
      </div>
    </MainLayout>
  );
}