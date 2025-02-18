"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const dummyTeamData = [
  { id: 1, name: "John Doe", department: "Engineering", hoursWorked: 160, overtime: 10, leaveHours: 8 },
  { id: 2, name: "Jane Smith", department: "Design", hoursWorked: 152, overtime: 5, leaveHours: 16 },
  { id: 3, name: "Bob Johnson", department: "Marketing", hoursWorked: 168, overtime: 8, leaveHours: 0 },
]

export function TeamTimeSummary() {
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  const filteredTeamData =
    selectedDepartment === "All"
      ? dummyTeamData
      : dummyTeamData.filter((employee) => employee.department === selectedDepartment)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Time Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Hours Worked</TableHead>
              <TableHead>Overtime</TableHead>
              <TableHead>Leave Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeamData.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.hoursWorked}</TableCell>
                <TableCell>{employee.overtime}</TableCell>
                <TableCell>{employee.leaveHours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

