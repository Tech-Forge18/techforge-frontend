"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ExpenseOverview } from "@/components/expenses/expense-overview"
import { ExpenseCategories } from "@/components/expenses/expense-categories"
import { RecentTransactions } from "@/components/expenses/recent-transactions"
import { AddExpenseButton } from "@/components/expenses/add-expense-button"
import { ExpenseSearch } from "@/components/expenses/expense-search"
import { ExpenseExport } from "@/components/expenses/expense-export"
import { ExpenseAlerts } from "@/components/expenses/expense-alerts"
import { BudgetTracker } from "@/components/expenses/budget-tracker"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Office Rent",
      date: "2024-03-01",
      amount: 2000,
      category: "Operations",
      vendor: "ABC Properties",
      status: "paid",
    },
    {
      id: 2,
      title: "Marketing Campaign",
      date: "2024-03-05",
      amount: 1500,
      category: "Marketing",
      vendor: "XYZ Advertising",
      status: "pending",
    },
    {
      id: 3,
      title: "Employee Salaries",
      date: "2024-03-15",
      amount: 15000,
      category: "Salaries",
      vendor: "Internal",
      status: "paid",
    },
    {
      id: 4,
      title: "Office Supplies",
      date: "2024-03-20",
      amount: 500,
      category: "Office Supplies",
      vendor: "Staples",
      status: "paid",
    },
    {
      id: 5,
      title: "Software Licenses",
      date: "2024-03-25",
      amount: 1000,
      category: "Software/Tools",
      vendor: "Microsoft",
      status: "pending",
    },
  ])

  const [categories] = useState([
    { name: "Salaries", color: "bg-blue-500" },
    { name: "Utilities", color: "bg-green-500" },
    { name: "Marketing", color: "bg-yellow-500" },
    { name: "Office Supplies", color: "bg-purple-500" },
    { name: "Travel & Transport", color: "bg-pink-500" },
    { name: "Software/Tools", color: "bg-indigo-500" },
    { name: "Operations", color: "bg-red-500" },
  ])

  const [budgets] = useState([
    { category: "Salaries", budget: 20000, current: 15000 },
    { category: "Utilities", budget: 2000, current: 1800 },
    { category: "Marketing", budget: 5000, current: 1500 },
    { category: "Office Supplies", budget: 1000, current: 500 },
    { category: "Travel & Transport", budget: 3000, current: 2500 },
    { category: "Software/Tools", budget: 2000, current: 1000 },
    { category: "Operations", budget: 5000, current: 2000 },
  ])

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, { id: expenses.length + 1, ...newExpense }])
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Expenses Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpenseOverview expenses={expenses} />
          <ExpenseCategories categories={categories} />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <ExpenseSearch />
          <div className="flex gap-4">
            <AddExpenseButton onAddExpense={handleAddExpense} categories={categories} />
            <ExpenseExport expenses={expenses} />
          </div>
        </div>
        <RecentTransactions expenses={expenses} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpenseAlerts budgets={budgets} />
          <BudgetTracker budgets={budgets} />
        </div>
      </div>
    </MainLayout>
  )
}

