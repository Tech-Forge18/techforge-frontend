import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TaskDetailProps {
  task: any // Replace with your Task type
  onClose: () => void
  onUpdate: (updatedTask: any) => void // Replace with your Task type
}

export function TaskDetail({ task, onClose, onUpdate }: TaskDetailProps) {
  const [editMode, setEditMode] = useState(false)
  const [editedTask, setEditedTask] = useState(
    task || {
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "",
      status: "",
      progress: 0,
      comments: [],
    },
  )
  const [newComment, setNewComment] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = () => {
    onUpdate(editedTask)
    setEditMode(false)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedTask = {
        ...editedTask,
        comments: [
          ...editedTask.comments,
          { id: Date.now(), user: "Current User", text: newComment, timestamp: new Date().toISOString() },
        ],
      }
      setEditedTask(updatedTask)
      onUpdate(updatedTask)
      setNewComment("")
    }
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
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
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={editedTask.title} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input id="assignedTo" name="assignedTo" value={editedTask.assignedTo} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" value={editedTask.dueDate} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                name="priority"
                onValueChange={(value) => handleInputChange({ target: { name: "priority", value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editedTask.priority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                onValueChange={(value) => handleInputChange({ target: { name: "status", value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editedTask.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="progress">Progress</Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                min="0"
                max="100"
                value={editedTask.progress}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{task?.title || "Untitled Task"}</h2>
            <p>{task?.description || "No description provided."}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Assigned To:</strong> {task?.assignedTo || "Unassigned"}
              </div>
              <div>
                <strong>Due Date:</strong> {task?.dueDate || "No due date set"}
              </div>
              <div>
                <strong>Priority:</strong> {task?.priority || "Not set"}
              </div>
              <div>
                <strong>Status:</strong> {task?.status || "Not started"}
              </div>
            </div>
            <div>
              <strong>Progress:</strong>
              <Progress value={task?.progress ?? 0} className="mt-2" />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setEditMode(true)}>Edit Task</Button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          <div className="space-y-4">
            {(task?.comments || []).map((comment: any) => (
              <div key={comment.id} className="bg-muted p-4 rounded-md">
                <p>{comment.text}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  By {comment.user} on {new Date(comment.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleAddComment} className="mt-2">
              Add Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

