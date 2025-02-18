"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { BookOpen, Users, Calendar, Clock, Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const dummyTrainings = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the basics of React and build your first application",
    instructor: "John Doe",
    duration: "4 weeks",
    participants: 25,
    startDate: "2024-04-01",
  },
  {
    id: 2,
    title: "Advanced JavaScript Techniques",
    description: "Master advanced JavaScript concepts and improve your coding skills",
    instructor: "Jane Smith",
    duration: "6 weeks",
    participants: 20,
    startDate: "2024-05-15",
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    description: "Explore the fundamentals of user interface and user experience design",
    instructor: "Alice Johnson",
    duration: "3 weeks",
    participants: 30,
    startDate: "2024-06-01",
  },
  {
    id: 4,
    title: "Agile Project Management",
    description: "Learn how to effectively manage projects using Agile methodologies",
    instructor: "Bob Wilson",
    duration: "5 weeks",
    participants: 15,
    startDate: "2024-07-10",
  },
]

export default function TrainingPage() {
  const [trainings, setTrainings] = useState(dummyTrainings)
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false)
  const [newTraining, setNewTraining] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    participants: 0,
    startDate: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTraining((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTraining = (e) => {
    e.preventDefault()
    setTrainings([...trainings, { id: trainings.length + 1, ...newTraining }])
    setIsAddTrainingOpen(false)
    setNewTraining({
      title: "",
      description: "",
      instructor: "",
      duration: "",
      participants: 0,
      startDate: "",
    })
  }

  const hasPermission = (permission) => {
    // Replace with your actual permission check logic
    return true
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Training & Development</h1>
          {hasPermission("add_training") && (
            <Dialog open={isAddTrainingOpen} onOpenChange={setIsAddTrainingOpen}>
              <DialogTrigger asChild>
                <Button className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Training
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-full">
                <DialogHeader>
                  <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add New Training</DialogTitle>
                  <DialogDescription className="text-cool-600 dark:text-cool-400">
                    Create a new training session for your team.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTraining} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-cool-700 dark:text-cool-300">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={newTraining.title}
                      onChange={handleInputChange}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-cool-700 dark:text-cool-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newTraining.description}
                      onChange={handleInputChange}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor" className="text-cool-700 dark:text-cool-300">
                      Instructor
                    </Label>
                    <Input
                      id="instructor"
                      name="instructor"
                      value={newTraining.instructor}
                      onChange={handleInputChange}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-cool-700 dark:text-cool-300">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={newTraining.duration}
                      onChange={handleInputChange}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participants" className="text-cool-700 dark:text-cool-300">
                      Participants
                    </Label>
                    <Input
                      id="participants"
                      name="participants"
                      type="number"
                      value={newTraining.participants}
                      onChange={handleInputChange}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-cool-700 dark:text-cool-300">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newTraining.startDate}
                      onChange={handleInputChange}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddTrainingOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white w-full sm:w-auto">
                      Add Training
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainings.map((training) => (
            <Card key={training.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{training.title}</CardTitle>
                <CardDescription>{training.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{training.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{training.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{training.participants} participants</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Starts {training.startDate}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

