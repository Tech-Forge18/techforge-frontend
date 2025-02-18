"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function ExpenseOverview({ expenses }) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const chartData = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find((item) => item.category === expense.category)
    if (existingCategory) {
      existingCategory.amount += expense.amount
    } else {
      acc.push({ category: expense.category, amount: expense.amount })
    }
    return acc
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">Total: ${totalExpenses.toLocaleString()}</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

