import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Task {
  id: number
  title: string
  description: string
  assignedTo: string
  dueDate: string
  priority: string
  status: string
  progress: number
  comments: { id: number; user: string; text: string; timestamp: string }[]
}

interface TaskDetailProps {
  taskId: number
  onClose: () => void
}

export function TaskDetail({ taskId, onClose }: TaskDetailProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [newComment, setNewComment] = useState("")

  const BASE_URL = "http://127.0.0.1:8000/api/tasks/"

  // Fetch Task Details
  useEffect(() => {
    fetch(`${BASE_URL}${taskId}/`)
      .then((res) => res.json())
      .then((data) => {
        setTask(data)
        setEditedTask(data)
      })
      .catch((err) => console.error("Error fetching task:", err))
  }, [taskId])

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTask((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  // Update Task
  const handleUpdate = () => {
    if (!editedTask) return
    fetch(`${BASE_URL}${taskId}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedTask),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTask(updatedTask)
        setEditMode(false)
      })
      .catch((err) => console.error("Error updating task:", err))
  }

  // Delete Task
  const handleDelete = () => {
    fetch(`${BASE_URL}${taskId}/`, { method: "DELETE" })
      .then(() => {
        onClose() // Close dialog after delete
      })
      .catch((err) => console.error("Error deleting task:", err))
  }

  // Add Comment
  const handleAddComment = () => {
    if (!newComment.trim() || !task) return

    const comment = {
      user: "Current User",
      text: newComment,
      timestamp: new Date().toISOString(),
    }

    fetch(`${BASE_URL}${taskId}/add-comment/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTask(updatedTask)
        setNewComment("")
      })
      .catch((err) => console.error("Error adding comment:", err))
  }

  if (!task) return null

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Task" : "Task Details"}</DialogTitle>
        </DialogHeader>

        {editMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdate()
            }}
            className="space-y-4"
          >
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={editedTask?.title || ""} onChange={handleInputChange} />

            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={editedTask?.description || ""} onChange={handleInputChange} />

            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input id="assignedTo" name="assignedTo" value={editedTask?.assignedTo || ""} onChange={handleInputChange} />

            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" name="dueDate" type="date" value={editedTask?.dueDate || ""} onChange={handleInputChange} />

            <Label htmlFor="priority">Priority</Label>
            <Select
              name="priority"
              onValueChange={(value) => setEditedTask((prev) => (prev ? { ...prev, priority: value } : null))}
            >
              <SelectTrigger>
                <SelectValue placeholder={editedTask?.priority || "Select"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              onValueChange={(value) => setEditedTask((prev) => (prev ? { ...prev, status: value } : null))}
            >
              <SelectTrigger>
                <SelectValue placeholder={editedTask?.status || "Select"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="progress">Progress</Label>
            <Input id="progress" name="progress" type="number" min="0" max="100" value={editedTask?.progress || 0} onChange={handleInputChange} />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Assigned To:</strong> {task.assignedTo}</div>
              <div><strong>Due Date:</strong> {task.dueDate}</div>
              <div><strong>Priority:</strong> {task.priority}</div>
              <div><strong>Status:</strong> {task.status}</div>
            </div>
            <Progress value={task.progress} className="mt-2" />

            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              <Button onClick={() => setEditMode(true)}>Edit Task</Button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          <div className="space-y-4">
            {task.comments.map((comment) => (
              <div key={comment.id} className="bg-muted p-4 rounded-md">
                <p>{comment.text}</p>
                <p className="text-sm text-muted-foreground mt-2">By {comment.user} on {new Date(comment.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <Textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <Button onClick={handleAddComment} className="mt-2">Add Comment</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

