import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dummyAttendance = [
  { date: "2024-03-15", clockIn: "09:00 AM", clockOut: "05:30 PM", hoursWorked: 8.5 },
  { date: "2024-03-14", clockIn: "08:45 AM", clockOut: "05:15 PM", hoursWorked: 8.5 },
  { date: "2024-03-13", clockIn: "09:15 AM", clockOut: "06:00 PM", hoursWorked: 8.75 },
]

export function AttendanceTracking() {
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
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Hours Worked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyAttendance.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.clockIn}</TableCell>
                <TableCell>{entry.clockOut}</TableCell>
                <TableCell>{entry.hoursWorked}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

