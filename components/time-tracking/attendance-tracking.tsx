"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface TimeLog {
  id: number
  date: string
  start_time: string
  end_time: string
  break_time: number
  task_description: string
}

export function AttendanceTracking() {
  const [attendanceData, setAttendanceData] = useState<TimeLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/timelogs/`, {
        headers: {
          'Accept': 'application/json',
        },
      })
      const data: TimeLog[] = response.data
      setAttendanceData(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error('Error fetching attendance:', error)
      let errorMessage = "Failed to load attendance data"
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Failed to fetch attendance: ${error.response.status} - ${JSON.stringify(error.response.data)}`
        } else if (error.request) {
          errorMessage = "No response from server. Check if the backend is running."
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [apiUrl])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this time log?")) return

    setIsDeleting(id)
    try {
      const response = await axios.delete(`${apiUrl}/timelogs/${id}/`, {
        headers: {
          'Accept': 'application/json',
        },
      })

      if (response.status !== 204) {
        throw new Error('Failed to delete time log')
      }

      toast({
        title: "Success",
        description: "Time log deleted successfully",
      })
      await fetchAttendance()
    } catch (error) {
      console.error('Error deleting time log:', error)
      toast({
        title: "Error",
        description: "Failed to delete time log",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  const calculateHoursWorked = (start: string, end: string, breakTime: number): string => {
    const startTime = new Date(`2000-01-01T${start}`)
    const endTime = new Date(`2000-01-01T${end}`)
    const diffMs = endTime.getTime() - startTime.getTime()
    const totalMinutes = diffMs / 60000 - breakTime
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }

  if (isLoading && attendanceData.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Break (min)</TableHead>
              <TableHead>Hours Worked</TableHead>
              <TableHead>Task Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              attendanceData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.start_time}</TableCell>
                  <TableCell>{entry.end_time}</TableCell>
                  <TableCell>{entry.break_time}</TableCell>
                  <TableCell>{calculateHoursWorked(entry.start_time, entry.end_time, entry.break_time)}</TableCell>
                  <TableCell className="max-w-xs truncate" title={entry.task_description}>
                    {entry.task_description}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      disabled={isDeleting === entry.id}
                    >
                      {isDeleting === entry.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}