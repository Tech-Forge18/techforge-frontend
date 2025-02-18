"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash2, Eye } from "lucide-react"

// Dummy data
const vacancies = [
  {
    id: 1,
    title: "Senior React Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "New York",
    type: "Contract",
  },
  // Add more dummy data as needed
]

export default function VacanciesPage() {
  const [isAddVacancyOpen, setIsAddVacancyOpen] = useState(false)

  const addVacancyForm = (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Job Title</Label>
        <Input id="title" placeholder="Enter job title" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="department">Department</Label>
        <Input id="department" placeholder="Enter department" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="Enter location" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Job Type</Label>
        <Input id="type" placeholder="Enter job type" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea id="description" placeholder="Enter job description" />
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button variant="outline" onClick={() => setIsAddVacancyOpen(false)}>
          Cancel
        </Button>
        <Button>Add Vacancy</Button>
      </div>
    </div>
  )

  return (
    <PageLayout title="Vacancies" addButtonLabel="Add Vacancy" addForm={addVacancyForm}>
      <Card>
        <CardHeader>
          <CardTitle>All Vacancies</CardTitle>
          <CardDescription>Manage your organization's job openings here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((vacancy) => (
                  <tr key={vacancy.id} className="border-b">
                    <td className="py-3 px-4">{vacancy.title}</td>
                    <td className="py-3 px-4">{vacancy.department}</td>
                    <td className="py-3 px-4">{vacancy.location}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700">
                        {vacancy.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}

