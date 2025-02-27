"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EyeIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface LeaveRequest {
  id: number
  type: string
  start_date: string
  end_date: string
  status: string
  created_at: string
}

export function LeaveManagement() {
  const [leaveRequest, setLeaveRequest] = useState({
    type: "",
    startDate: "",
    endDate: "",
  })
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

  const fetchLeaveRequests = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/leave-requests/`)
      setLeaveRequests(response.data)
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      toast({
        title: "Error",
        description: "Failed to load leave requests",
        variant: "destructive",
      })
    }
  }, [apiUrl])

  useEffect(() => {
    fetchLeaveRequests()
  }, [fetchLeaveRequests])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLeaveRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        type: leaveRequest.type,
        start_date: leaveRequest.startDate,
        end_date: leaveRequest.endDate,
      }
      await axios.post(`${apiUrl}/leave-requests/`, payload)
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      })
      setLeaveRequest({ type: "", startDate: "", endDate: "" })
      fetchLeaveRequests()
    } catch (error) {
      console.error('Error submitting leave request:', error)
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (status: string) => {
    if (!selectedRequest) return
    try {
      await axios.patch(`${apiUrl}/leave-requests/${selectedRequest.id}/`, { status })
      toast({
        title: "Success",
        description: "Status updated successfully",
      })
      setSelectedRequest(null)
      fetchLeaveRequests()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="type">Leave Type</Label>
            <Select
              name="type"
              value={leaveRequest.type}
              onValueChange={(value) => setLeaveRequest((prev) => ({ ...prev, type: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={leaveRequest.startDate}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={leaveRequest.endDate}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Leave Request"}
          </Button>
        </form>

        <h3 className="text-lg font-semibold mb-2">Leave Requests</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No leave requests found</TableCell>
              </TableRow>
            ) : (
              leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.start_date}</TableCell>
                  <TableCell>{request.end_date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      request.status === "approved" ? "default" :    // Green-like
                      request.status === "denied" ? "destructive" :   // Red
                      "outline"                                       // Neutral for pending
                    }>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Leave Request Details</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="space-y-4">
                            <div>
                              <Label>Type:</Label> {selectedRequest.type}
                            </div>
                            <div>
                              <Label>Start Date:</Label> {selectedRequest.start_date}
                            </div>
                            <div>
                              <Label>End Date:</Label> {selectedRequest.end_date}
                            </div>
                            <div>
                              <Label>Current Status:</Label> {selectedRequest.status}
                            </div>
                            <div>
                              <Label>Update Status:</Label>
                              <Select
                                onValueChange={(value) => handleStatusUpdate(value)}
                                defaultValue={selectedRequest.status}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="denied">Denied</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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