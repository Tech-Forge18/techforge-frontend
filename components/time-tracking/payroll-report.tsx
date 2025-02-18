import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const dummyPayrollData = [
  { id: 1, employee: "John Doe", regularHours: 160, overtimeHours: 10, leave: 8, totalPay: 4500 },
  { id: 2, employee: "Jane Smith", regularHours: 152, overtimeHours: 5, leave: 16, totalPay: 4200 },
]

export function PayrollReport() {
  const handleDownload = () => {
    // Here you would typically generate and download the payroll report
    console.log("Downloading payroll report...")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Regular Hours</TableHead>
              <TableHead>Overtime Hours</TableHead>
              <TableHead>Leave Hours</TableHead>
              <TableHead>Total Pay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyPayrollData.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.employee}</TableCell>
                <TableCell>{entry.regularHours}</TableCell>
                <TableCell>{entry.overtimeHours}</TableCell>
                <TableCell>{entry.leave}</TableCell>
                <TableCell>${entry.totalPay.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button onClick={handleDownload}>Download Payroll Summary</Button>
        </div>
      </CardContent>
    </Card>
  )
}

