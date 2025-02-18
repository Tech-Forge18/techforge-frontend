"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const dummyLeaveRequests = [
  { id: 1, type: "Vacation", startDate: "2024-04-01", endDate: "2024-04-05", status: "Pending" },
  { id: 2, type: "Sick Leave", startDate: "2024-03-20", endDate: "2024-03-21", status: "Approved" },
]

export function LeaveManagement() {
  const [leaveRequest, setLeaveRequest] = useState({
    type: "",
    startDate: "",
    endDate: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLeaveRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the leave request to your backend
    console.log("Submitted leave request:", leaveRequest)
    // Reset form after submission
    setLeaveRequest({
      type: "",
      startDate: "",
      endDate: "",
    })
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
            <Select name="type" onValueChange={(value) => setLeaveRequest((prev) => ({ ...prev, type: value }))}>
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
              />
            </div>
          </div>
          <Button type="submit">Submit Leave Request</Button>
        </form>

        <h3 className="text-lg font-semibold mb-2">Leave Requests</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyLeaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.startDate}</TableCell>
                <TableCell>{request.endDate}</TableCell>
                <TableCell>
                  <Badge variant={request.status === "Approved" ? "success" : "warning"}>{request.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

