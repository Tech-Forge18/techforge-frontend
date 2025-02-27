"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface TimeLog {
  date: string
  start_time: string
  end_time: string
  break_time: string
  task_description: string
}

export function TimeLogForm({ onTimeLogAdded }: { onTimeLogAdded: () => void }) {
  const [timeLog, setTimeLog] = useState<TimeLog>({
    date: "",
    start_time: "",
    end_time: "",
    break_time: "",
    task_description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTimeLog((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    if (!timeLog.date || !timeLog.start_time || !timeLog.end_time) {
      toast({
        title: "Error",
        description: "Date, Start Time, and End Time are required",
        variant: "destructive",
      })
      return false
    }

    const start = new Date(`2000-01-01T${timeLog.start_time}`)
    const end = new Date(`2000-01-01T${timeLog.end_time}`)
    if (end <= start) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const payload = {
        date: timeLog.date,
        start_time: timeLog.start_time,
        end_time: timeLog.end_time,
        break_time: timeLog.break_time || "0", // Ensure break_time is always a number/string
        task_description: timeLog.task_description || "", // Ensure non-null
      }

      const response = await axios.post('http://127.0.0.1:8000/api/timelogs/', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      // Axios automatically parses the JSON response
      console.log('Time log created:', response.data)

      toast({
        title: "Success",
        description: "Time log submitted successfully",
      })

      onTimeLogAdded()
      setTimeLog({
        date: "",
        start_time: "",
        end_time: "",
        break_time: "",
        task_description: "",
      })
    } catch (error) {
      console.error('Error submitting time log:', error)
      
      let errorMessage = "An unexpected error occurred"
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status other than 2xx
          errorMessage = `Failed to submit time log: ${error.response.status} - ${JSON.stringify(error.response.data)}`
        } else if (error.request) {
          // Request made but no response received
          errorMessage = "No response from server. Check if the backend is running."
        } else {
          // Error setting up the request
          errorMessage = error.message
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Time</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={timeLog.date}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                name="start_time"
                type="time"
                value={timeLog.start_time}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                name="end_time"
                type="time"
                value={timeLog.end_time}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="break_time">Break Time (minutes)</Label>
            <Input
              id="break_time"
              name="break_time"
              type="number"
              min="0"
              value={timeLog.break_time}
              onChange={handleInputChange}
              placeholder="Enter break time in minutes"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="task_description">Task Description</Label>
            <Textarea
              id="task_description"
              name="task_description"
              value={timeLog.task_description}
              onChange={handleInputChange}
              placeholder="Describe the tasks you worked on"
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Log Time"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}