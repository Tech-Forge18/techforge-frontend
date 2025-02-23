"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

interface Task {
  id: number
  title: string
  description: string
  duedate: string
  status: string
  assignedto: string
  priority: string
  comment: string
  progress: number
}

interface TeamMember {
  id: number
  name: string
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
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { hasPermission } = useAuth()

  // Fetch tasks and team members from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/")
        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/teams/") // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch team members")
        }
        const data = await response.json()
        setTeamMembers(data)
      } catch (error) {
        console.error("Error fetching team members:", error)
      }
    }

    fetchTasks()
    fetchTeamMembers()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare the task data to match the Django model
    const taskData = {
      title: newTask.title,
      description: newTask.description,
      duedate: newTask.dueDate,
      status: newTask.status,
      assignedto: newTask.assignedTo, // Ensure this matches the ID of the assigned member
      priority: newTask.priority,
      comment: "No comment", // Default comment as per the model
    }

    try {
      // Send a POST request to the Django API
      const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      // Handle successful response
      const result = await response.json()
      console.log("Task created successfully:", result)

      // Reset the form and close the dialog
      setIsAddTaskOpen(false)
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: "",
        status: "Pending",
      })

      // Refresh the task list
      const fetchResponse = await fetch("http://127.0.0.1:8000/api/tasks/")
      if (fetchResponse.ok) {
        const updatedTasks = await fetchResponse.json()
        setTasks(updatedTasks)
      }
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const addForm = (
    <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
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
                  <SelectItem key={member.id} value={member.id.toString()}>
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
  )

  return (
    <PageLayout
      title="Tasks"
      addButtonLabel="Add Task"
      isOpen={isAddTaskOpen}
      onOpenChange={setIsAddTaskOpen}
      addForm={addForm}
    >
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
                    <TableCell className="text-cool-800 dark:text-cool-200">
                      {teamMembers.find((member) => member.id === parseInt(task.assignedto))?.name || "Unassigned"}
                    </TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{task.duedate}</TableCell>
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
    </PageLayout>
  )
}