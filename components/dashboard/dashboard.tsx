"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Grid, LayoutGrid, Plus } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Widget components
const StatisticsWidget = () => (
  <Card className="bg-white dark:bg-cool-800 border-cool-200 dark:border-cool-700">
    <CardHeader>
      <CardTitle className="text-vibrant-600 dark:text-vibrant-400">Statistics</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-cool-700 dark:text-cool-300">Statistics content goes here</p>
    </CardContent>
  </Card>
)

const TasksWidget = () => {
  const { hasPermission } = useAuth()
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project proposal", status: "In Progress" },
    { id: 2, title: "Review code changes", status: "Pending" },
  ])

  const [newTask, setNewTask] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: tasks.length + 1, title: newTask, status: "Pending" }])
      setNewTask("")
      setIsDialogOpen(false)
    }
  }

  return (
    <Card className="bg-white dark:bg-cool-800 border-cool-200 dark:border-cool-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-vibrant-600 dark:text-vibrant-400">Recent Tasks</CardTitle>
        {hasPermission("add_task") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task">Task Title</Label>
                  <Input
                    id="task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center">
              <span className="text-cool-700 dark:text-cool-300">{task.title}</span>
              <span className="text-sm text-cool-500 dark:text-cool-400">{task.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

const CalendarWidget = () => (
  <Card className="bg-white dark:bg-cool-800 border-cool-200 dark:border-cool-700">
    <CardHeader>
      <CardTitle className="text-vibrant-600 dark:text-vibrant-400">Calendar</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-cool-700 dark:text-cool-300">Calendar content goes here</p>
    </CardContent>
  </Card>
)

const DocumentsWidget = () => {
  const { hasPermission } = useAuth()
  const [documents, setDocuments] = useState([
    { id: 1, name: "Project Plan.pdf" },
    { id: 2, name: "Meeting Notes.docx" },
  ])

  const [newDocument, setNewDocument] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddDocument = () => {
    if (newDocument.trim()) {
      setDocuments([...documents, { id: documents.length + 1, name: newDocument }])
      setNewDocument("")
      setIsDialogOpen(false)
    }
  }

  return (
    <Card className="bg-white dark:bg-cool-800 border-cool-200 dark:border-cool-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-vibrant-600 dark:text-vibrant-400">Recent Documents</CardTitle>
        {hasPermission("add_document") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="document">Document Name</Label>
                  <Input
                    id="document"
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    placeholder="Enter document name"
                  />
                </div>
                <Button onClick={handleAddDocument}>Add Document</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="text-cool-700 dark:text-cool-300">
              {doc.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

const widgetComponents = {
  statistics: StatisticsWidget,
  tasks: TasksWidget,
  calendar: CalendarWidget,
  documents: DocumentsWidget,
}

export function Dashboard() {
  const [widgets, setWidgets] = useState([])
  const [layout, setLayout] = useState("grid")
  const [isLoading, setIsLoading] = useState(true)
  const { user, hasPermission } = useAuth()

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Set initial widgets based on user permissions
      const initialWidgets = [
        { id: "widget-1", type: "statistics" },
        { id: "widget-2", type: "tasks" },
        { id: "widget-3", type: "calendar" },
        { id: "widget-4", type: "documents" },
      ].filter((widget) => hasPermission(`view_${widget.type}`))
      setWidgets(initialWidgets)
    }, 2000)

    return () => clearTimeout(timer)
  }, [hasPermission])

  const onDragEnd = (result) => {
    if (!result.destination) return

    const newWidgets = Array.from(widgets)
    const [reorderedItem] = newWidgets.splice(result.source.index, 1)
    newWidgets.splice(result.destination.index, 0, reorderedItem)

    setWidgets(newWidgets)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white dark:bg-cool-800 border-cool-200 dark:border-cool-700">
            <CardHeader>
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[100px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Select value={layout} onValueChange={setLayout}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">
              <div className="flex items-center">
                <Grid className="mr-2 h-4 w-4" />
                Grid Layout
              </div>
            </SelectItem>
            <SelectItem value="columns">
              <div className="flex items-center">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Column Layout
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard" direction={layout === "columns" ? "horizontal" : "vertical"}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid gap-4 ${
                layout === "columns" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative"
                    >
                      {widgetComponents[widget.type]()}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

