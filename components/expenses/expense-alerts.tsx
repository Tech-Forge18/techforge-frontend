import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, AlertCircle } from "lucide-react"

export function ExpenseAlerts({ budgets }) {
  const alerts = budgets.filter((budget) => budget.current > budget.budget * 0.9)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="flex items-center gap-2">
                {alert.current > alert.budget ? (
                  <AlertCircle className="text-red-500" />
                ) : (
                  <AlertTriangle className="text-yellow-500" />
                )}
                <span>
                  {alert.category}: ${alert.current.toLocaleString()} / ${alert.budget.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No alerts at this time.</p>
        )}
      </CardContent>
    </Card>
  )
}

