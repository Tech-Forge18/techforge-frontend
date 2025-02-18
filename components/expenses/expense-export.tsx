import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function ExpenseExport({ expenses }) {
  const handleExportCSV = () => {
    const headers = ["Date", "Vendor", "Category", "Amount", "Status"]
    const csvContent = [
      headers.join(","),
      ...expenses.map((expense) =>
        [expense.date, expense.vendor, expense.category, expense.amount, expense.status].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "expenses.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Button onClick={handleExportCSV}>
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  )
}

