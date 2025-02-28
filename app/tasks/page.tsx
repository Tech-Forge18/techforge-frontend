"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { TaskDetail } from "@/components/task-detail";

interface Task {
  id: number;
  title: string;
  description: string;
  duedate: string;
  status: string;
  assignedto: string;
  priority: string;
}

interface TeamMember {
  id: number;
  name: string;
}

export default function TasksPage() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedto: "",
    duedate: "",
    priority: "",
    status: "Pending",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/teams/");
        if (!response.ok) throw new Error("Failed to fetch team members");
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTasks();
    fetchTeamMembers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = { ...newTask };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to create task");
      const result = await response.json();
      setIsAddTaskOpen(false);
      setNewTask({
        title: "",
        description: "",
        assignedto: "",
        duedate: "",
        priority: "",
        status: "Pending",
      });
      const fetchResponse = await fetch("http://127.0.0.1:8000/api/tasks/");
      if (fetchResponse.ok) setTasks(await fetchResponse.json());
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const addForm = (
    <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
      <DialogContent className="sm:max-w-lg w-[90vw] rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Add New Task
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Create a new task with all necessary details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-200 font-medium">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={handleInputChange}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-200 font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Task details..."
              value={newTask.description}
              onChange={handleInputChange}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-indigo-500 min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedto" className="text-gray-700 dark:text-gray-200 font-medium">
              Assigned To
            </Label>
            <Select
              name="assignedto"
              value={newTask.assignedto}
              onValueChange={(value) => setNewTask({ ...newTask, assignedto: value })}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duedate" className="text-gray-700 dark:text-gray-200 font-medium">
              Due Date
            </Label>
            <Input
              id="duedate"
              name="duedate"
              type="date"
              value={newTask.duedate}
              onChange={handleInputChange}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-gray-700 dark:text-gray-200 font-medium">
              Priority
            </Label>
            <Select
              name="priority"
              value={newTask.priority}
              onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-200 font-medium">
              Status
            </Label>
            <Select
              name="status"
              value={newTask.status}
              onValueChange={(value) => setNewTask({ ...newTask, status: value })}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddTaskOpen(false)}
              className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md"
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <PageLayout
      title="Tasks Dashboard"
      addButtonLabel="New Task"
      isOpen={isAddTaskOpen}
      onOpenChange={setIsAddTaskOpen}
      addForm={addForm}
    >
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Tasks
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Track and manage your team's tasks efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableContainer
            component={Paper}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto"
          >
            <Table aria-label="tasks table" stickyHeader>
              <TableHead>
                <TableRow>
                  {["Title", "Assigned To", "Due Date", "Priority", "Status", "Actions"].map(
                    (header) => (
                      <TableCell
                        key={header}
                        className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-semibold py-3 px-4 whitespace-nowrap"
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <TableCell className="text-gray-800 dark:text-gray-200 py-3 px-4">
                      {task.title}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 py-3 px-4">
                      {task.assignedto}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200 py-3 px-4">
                      {new Date(task.duedate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300"
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View Task"
                        onClick={() => setSelectedTask(task)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {selectedTask && (
        <TaskDetail taskId={selectedTask.id} onClose={() => setSelectedTask(null)} />
      )}
    </PageLayout>
  );
}