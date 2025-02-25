import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Task {
  id: number;
  title: string;
  description: string;
  assignedto: string;
  duedate: string;
  priority: string;
  status: string;
}

interface TaskDetailProps {
  taskId: number;
  onClose: () => void;
}

export function TaskDetail({ taskId, onClose }: TaskDetailProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const BASE_URL = "http://127.0.0.1:8000/api/tasks/";

  // Fetch Task Details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${BASE_URL}${taskId}/`);
        if (!response.ok) throw new Error("Failed to fetch task");
        const data = await response.json();
        setTask(data);
        setEditedTask(data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [taskId, BASE_URL]);

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Update Task
  const handleUpdate = async () => {
    if (!editedTask) return;
    try {
      const response = await fetch(`${BASE_URL}${taskId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTask),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const updatedTask = await response.json();
      setTask(updatedTask);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete Task
  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}${taskId}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!task) return null; // Prevent rendering errors

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Task" : "Task Details"}</DialogTitle>
        </DialogHeader>

        {editMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-4"
          >
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={editedTask?.title || ""} onChange={handleInputChange} />

            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={editedTask?.description || ""} onChange={handleInputChange} />

            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input id="assignedTo" name="assignedTo" value={editedTask?.assignedto || ""} onChange={handleInputChange} />

            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" name="dueDate" type="date" value={editedTask?.duedate || ""} onChange={handleInputChange} />

            <Label htmlFor="priority">Priority</Label>
            <Select
              name="priority"
              value={editedTask?.priority || ""}
              onValueChange={(value) => setEditedTask((prev) => (prev ? { ...prev, priority: value } : null))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Priority">{editedTask?.priority || "Select"}</SelectValue>
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
              value={editedTask?.status || ""}
              onValueChange={(value) => setEditedTask((prev) => (prev ? { ...prev, status: value } : null))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status">{editedTask?.status || "Select"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

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
              <div>
                <strong>Assigned To:</strong> {task.assignedto}
              </div>
              <div>
                <strong>Due Date:</strong> {task.duedate}
              </div>
              <div>
                <strong>Priority:</strong> {task.priority}
              </div>
              <div>
                <strong>Status:</strong> {task.status}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={() => setEditMode(true)}>Edit Task</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


