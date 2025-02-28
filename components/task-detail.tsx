"use client";

import { useState, useEffect } from "react";
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
  const BASE_URL = "http://127.0.0.1:8000/api/tasks/";

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${BASE_URL}${taskId}/`);
        if (!response.ok) throw new Error("Failed to fetch task");
        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [taskId]);

  if (!task) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[90vw] max-h-[90vh] rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 shadow-xl p-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-blue-800 dark:text-indigo-200">
            Task Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 truncate">
            {task.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {task.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 dark:text-gray-200">
            <div>
              <strong>Assigned To:</strong> {task.assignedto}
            </div>
            <div>
              <strong>Due Date:</strong> {new Date(task.duedate).toLocaleDateString()}
            </div>
            <div>
              <strong>Priority:</strong> {task.priority}
            </div>
            <div>
              <strong>Status:</strong> {task.status}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

