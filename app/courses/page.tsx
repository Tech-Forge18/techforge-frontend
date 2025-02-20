"use client"

import React, { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { BookOpen, Users, Clock, Plus, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"

interface Course {
  id: number
  name: string
  instructor: string
  duration: string
  level: string
  enrolledStudents: number
  description: string
}
const apiBaseUrl = "http://127.0.0.1:8000/api/courses/"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false)
  const [newCourse, setNewCourse] = useState<Course>({
    id: 0,
    name: "",
    instructor: "",
    duration: "",
    level: "",
    enrolledStudents: 0,
    description: "",
  })
  const [editCourse, setEditCourse] = useState<Course | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const { hasPermission } = useAuth()
  
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await axios.get(apiBaseUrl)
      setCourses(response.data)
    } catch (error) {
      console.error("Error fetching courses:", error)
  }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCourse((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(apiBaseUrl, newCourse)
      setCourses([...courses, response.data])
      setIsAddCourseOpen(false)
      setNewCourse({
        id: 0,
        name: "",
        instructor: "",
        duration: "",
        level: "",
        enrolledStudents: 0,
        description: "",
      })
    } catch (error) {
      console.error("Error adding course:", error)
    }
  }

  const handleDeleteCourse = async (id: number) => {
    try {
      await axios.delete(`${apiBaseUrl}${id}/`)
      setCourses(courses.filter((course) => course.id !== id))
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }


  const handleUpdateCourse = async (updatedCourse: Course) => {
    try {
      const response = await axios.put(`${apiBaseUrl}${updatedCourse.id}/`, updatedCourse)
      setCourses(courses.map((course) => (course.id === updatedCourse.id ? response.data : course)))
      setIsEditCourseOpen(false)
      setEditCourse(null) // Clear editCourse state after successful update
    } catch (error) {
      console.error("Error updating course:", error)
    }
  }

  const handleEditClick = (course: Course) => {
    setEditCourse(course)
    setIsEditCourseOpen(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editCourse) {
      const { name, value } = e.target
      setEditCourse({ ...editCourse, [name]: value })
    }
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Courses</h1>
          {hasPermission("add_course") && (
            <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-full">
                <DialogHeader>
                  <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add New Course</DialogTitle>
                  <DialogDescription className="text-cool-600 dark:text-cool-400">
                    Create a new course for your organization.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-cool-700 dark:text-cool-300">
                      Course Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newCourse.name}
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
                      value={newCourse.instructor}
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
                      value={newCourse.duration}
                      onChange={handleInputChange}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-cool-700 dark:text-cool-300">
                      Level
                    </Label>
                    <Select
                      name="level"
                      value={newCourse.level}
                      onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                    >
                      <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrolledStudents" className="text-cool-700 dark:text-cool-300">
                      Enrolled Students
                    </Label>
                    <Input
                      id="enrolledStudents"
                      name="enrolledStudents"
                      type="number"
                      value={newCourse.enrolledStudents}
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
                      value={newCourse.description}
                      onChange={handleInputChange}
                      className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddCourseOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white w-full sm:w-auto">
                      Submit
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="mb-4">
          <Input placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Edit Dilog */}
        <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
          <DialogContent className="sm:max-w-[425px] w-full">
                 <DialogHeader>
                  <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Edit Course</DialogTitle>
                  <DialogDescription className="text-cool-600 dark:text-cool-400">
                    Edit the detail of your course.
                  </DialogDescription>
                </DialogHeader>
                {editCourse &&(
                   <form onSubmit={() => handleUpdateCourse(editCourse)} className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="name" className="text-cool-700 dark:text-cool-300">
                       Course Name
                     </Label>
                     <Input
                       id="name"
                       name="name"
                       value={editCourse.name}
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
                       value={editCourse.instructor}
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
                       value={editCourse.duration}
                       onChange={handleInputChange}
                       className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="level" className="text-cool-700 dark:text-cool-300">
                       Level
                     </Label>
                     <Select
                       name="level"
                       value={editCourse.level}
                       onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                     >
                       <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                         <SelectValue placeholder="Select level" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Beginner">Beginner</SelectItem>
                         <SelectItem value="Intermediate">Intermediate</SelectItem>
                         <SelectItem value="Advanced">Advanced</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="enrolledStudents" className="text-cool-700 dark:text-cool-300">
                       Enrolled Students
                     </Label>
                     <Input
                       id="enrolledStudents"
                       name="enrolledStudents"
                       type="number"
                       value={editCourse.enrolledStudents}
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
                       value={editCourse.description}
                       onChange={handleInputChange}
                       className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                       required
                     />
                   </div>
                   <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => setIsAddCourseOpen(false)}
                       className="w-full sm:w-auto"
                     >
                       Cancel
                     </Button>
                     <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white w-full sm:w-auto">
                       Submit
                     </Button>
                   </div>
                 </form>
                 )}
          </DialogContent>
        </Dialog>
              

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{course.enrolledStudents} students</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button className="w-full">View Details</Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(course)}
                    className="text-cool-600 hover:text-vibrant-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-cool-600 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}