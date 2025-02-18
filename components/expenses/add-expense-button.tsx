"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export function AddExpenseButton({ onAddExpense, categories }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({
    title: "",
    date: "",
    amount: "",
    category: "",
    vendor: "",
    status: "pending",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddExpense({
      ...newExpense,
      amount: Number.parseFloat(newExpense.amount),
    })
    setIsOpen(false)
    setNewExpense({
      title: "",
      date: "",
      amount: "",
      category: "",
      vendor: "",
      status: "pending",
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewExpense({ ...newExpense, [name]: value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Expense Title</Label>
            <Input id="title" name="title" value={newExpense.title} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={newExpense.date} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={newExpense.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="vendor">Vendor Name</Label>
            <Input id="vendor" name="vendor" value={newExpense.vendor} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="receipt">Upload Receipt (Optional)</Label>
            <Input id="receipt" type="file" />
          </div>
          <Button type="submit">Add Expense</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

