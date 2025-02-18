import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function BudgetTracker({ budgets }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{budget.category}</span>
                <span>
                  ${budget.current.toLocaleString()} / ${budget.budget.toLocaleString()}
                </span>
              </div>
              <Progress value={(budget.current / budget.budget) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

