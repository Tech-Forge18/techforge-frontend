import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ExpenseCategories({ categories }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

