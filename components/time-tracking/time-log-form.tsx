"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TimeLogForm() {
  const [timeLog, setTimeLog] = useState({
    date: "",
    startTime: "",
    endTime: "",
    breakTime: "",
    taskDescription: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTimeLog((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the time log to your backend
    console.log("Submitted time log:", timeLog)
    // Reset form after submission
    setTimeLog({
      date: "",
      startTime: "",
      endTime: "",
      breakTime: "",
      taskDescription: "",
    })
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
            <Input id="date" name="date" type="date" value={timeLog.date} onChange={handleInputChange} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={timeLog.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={timeLog.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="breakTime">Break Time (minutes)</Label>
            <Input
              id="breakTime"
              name="breakTime"
              type="number"
              value={timeLog.breakTime}
              onChange={handleInputChange}
              placeholder="Enter break time in minutes"
            />
          </div>
          <div>
            <Label htmlFor="taskDescription">Task Description</Label>
            <Textarea
              id="taskDescription"
              name="taskDescription"
              value={timeLog.taskDescription}
              onChange={handleInputChange}
              placeholder="Describe the tasks you worked on"
            />
          </div>
          <Button type="submit">Log Time</Button>
        </form>
      </CardContent>
    </Card>
  )
}

