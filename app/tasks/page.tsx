"use client"

import type React from "react"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash2, Eye, MessageSquare, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth/auth-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"

// Dummy data
const tasks = [
  {
    id: 1,
    title: "Implement user authentication",
    description: "Set up JWT-based authentication for the new API",
    assignedTo: "John Doe",
    dueDate: "2024-03-15",
    priority: "High",
    status: "In Progress",
    progress: 60,
    comments: [
      { id: 1, user: "Jane Smith", text: "I've started on the backend part", timestamp: "2024-03-10T10:30:00Z" },
      { id: 2, user: "John Doe", text: "Frontend integration is next", timestamp: "2024-03-11T14:45:00Z" },
    ],
  },
  {
    id: 2,
    title: "Design landing page",
    description: "Create a responsive design for the new product landing page",
    assignedTo: "Jane Smith",
    dueDate: "2024-03-20",
    priority: "Medium",
    status: "Pending",
    progress: 0,
    comments: [],
  },
  // Add more dummy data as needed
]

const teamMembers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
  // Add more team members
]

const TaskDetail = ({
  task,
  onClose,
  onUpdate,
}: { task: (typeof tasks)[0]; onClose: () => void; onUpdate: (updatedTask: (typeof tasks)[0]) => void }) => {
  //Implementation for TaskDetail component
  return <div>Task Detail: {task.title}</div>
}

export default function TasksPage() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "",
    status: "Pending",
  })
  const [selectedTask, setSelectedTask] = useState(null)
  const { hasPermission } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the new task to your backend
    console.log("New task:", newTask)
    setIsAddTaskOpen(false)
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "",
      status: "Pending",
    })
  }

  return (
    <PageLayout title="Tasks" addButtonLabel="Add Task" isOpen={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Manage and track your organization's tasks here.</CardDescription>
        </CardHeader>
        <CardContent>
          <TableContainer component={Paper} className="bg-white dark:bg-cool-800">
            <Table aria-label="tasks table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Title</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Assigned To</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Due Date</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Priority</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Status</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Progress</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="text-cool-800 dark:text-cool-200">{task.title}</TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{task.assignedTo}</TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{task.dueDate}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Progress value={task.progress} className="w-[60px]" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" title="View Task" onClick={() => setSelectedTask(task)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {hasPermission("edit_task") && (
                          <Button variant="ghost" size="icon" title="Edit Task">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {hasPermission("delete_task") && (
                          <Button variant="ghost" size="icon" title="Delete Task">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" title="View Comments">
                          <MessageSquare className="h-4 w-4" />
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
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogTrigger asChild>
          <Button className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add New Task</DialogTitle>
            <DialogDescription className="text-cool-600 dark:text-cool-400">
              Create a new task for your team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-cool-700 dark:text-cool-300">
                Task Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                value={newTask.title}
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
                placeholder="Enter task description"
                value={newTask.description}
                onChange={handleInputChange}
                className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="text-cool-700 dark:text-cool-300">
                Assigned To
              </Label>
              <Select
                name="assignedTo"
                value={newTask.assignedTo}
                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              >
                <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                  <SelectValue placeholder="Select team member" />
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
              <Label htmlFor="dueDate" className="text-cool-700 dark:text-cool-300">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-cool-700 dark:text-cool-300">
                Priority
              </Label>
              <Select
                name="priority"
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
                Add Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

