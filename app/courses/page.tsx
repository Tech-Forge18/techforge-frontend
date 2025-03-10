"use client";

import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Users,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import Skeleton from "@mui/material/Skeleton";

// Define Course Type
interface Course {
  id: number;
  name: string;
  instructor: string;
  duration: string; // Ensure this remains a string
  level: string;
  enrolledstudents: number;
  description: string;
}

const apiBaseUrl = "http://127.0.0.1:8000/api/courses/";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isViewCourseOpen, setIsViewCourseOpen] = useState(false);
  const [isValidationErrorOpen, setIsValidationErrorOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newCourse, setNewCourse] = useState<Course>({
    id: 0,
    name: "",
    instructor: "",
    duration: "",
    level: "",
    enrolledstudents: 0,
    description: "",
  });
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { hasPermission } = useAuth();

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { y: -10, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
  };

  // Fetch Courses on Mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(apiBaseUrl);
        setCourses(response.data);
        console.log("Fetched courses:", response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Validation function for course data with type coercion for duration
  const validateCourseData = (course: Course): boolean => {
    const durationAsString = String(course.duration); // Convert duration to string
    const isValid =
      course.name?.trim() !== "" &&
      course.instructor?.trim() !== "" &&
      durationAsString.trim() !== "" &&
      course.level?.trim() !== "" &&
      course.enrolledstudents >= 0 &&
      course.description?.trim() !== "";
    console.log("Validation result:", isValid, "Course data:", course);
    return isValid;
  };

  // Handle Input Changes for New Course
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: name === "enrolledstudents" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  // Handle Adding a Course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new course:", newCourse);
    if (!validateCourseData(newCourse)) {
      setIsValidationErrorOpen(true);
      return;
    }
    try {
      const response = await axios.post(apiBaseUrl, newCourse, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("API response:", response.data);
      setCourses([...courses, response.data]);
      setNewCourse({ id: 0, name: "", instructor: "", duration: "", level: "", enrolledstudents: 0, description: "" });
      setIsAddCourseOpen(false);
      setSuccessMessage("Course added successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Course added successfully" });
    } catch (error) {
      console.error("Error adding course:", error);
      toast({ title: "Error", description: "Failed to add course", variant: "destructive" });
    }
  };

  // Handle Deleting a Course
  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${apiBaseUrl}${id}/`);
      setCourses(courses.filter((course) => course.id !== id));
      setSuccessMessage("Course deleted successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({ title: "Error", description: "Failed to delete course", variant: "destructive" });
    }
  };

  // Handle Editing a Course
  const handleEditClick = (course: Course) => {
    setEditCourse({
      ...course,
      level: course.level || "Beginner", // Default to "Beginner" if level is undefined
      duration: String(course.duration), // Ensure duration is a string
    });
    setIsEditCourseOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editCourse) {
      const { name, value } = e.target;
      setEditCourse({
        ...editCourse,
        [name]: name === "enrolledstudents" ? (value === "" ? 0 : Number(value)) : value,
      });
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting updated course:", editCourse);
    if (!editCourse || !validateCourseData(editCourse)) {
      setIsValidationErrorOpen(true);
      return;
    }
    try {
      const response = await axios.put(`${apiBaseUrl}${editCourse.id}/`, editCourse, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("API response:", response.data);
      setCourses(courses.map((course) => (course.id === editCourse.id ? response.data : course)));
      setIsEditCourseOpen(false);
      setEditCourse(null);
      setSuccessMessage("Data is updated successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Course updated successfully" });
    } catch (error) {
      console.error("Error updating course:", error);
      toast({ title: "Error", description: "Failed to update course", variant: "destructive" });
    }
  };

  // Handle Viewing Course Details
  const handleViewClick = (course: Course) => {
    setViewCourse(course);
    setIsViewCourseOpen(true);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-300"
          >
            Courses
          </motion.h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            {hasPermission("add_course") && (
              <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                  <DialogHeader>
                    <DialogTitle className="text-indigo-600 dark:text-indigo-400">Add New Course</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCourse} className="space-y-4 p-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Course Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newCourse.name}
                        onChange={handleInputChange}
                        className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructor" className="text-gray-700 dark:text-gray-300">Instructor</Label>
                      <Input
                        id="instructor"
                        name="instructor"
                        value={newCourse.instructor}
                        onChange={handleInputChange}
                        className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-gray-700 dark:text-gray-300">Duration</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={newCourse.duration}
                        onChange={handleInputChange}
                        className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-gray-700 dark:text-gray-300">Level</Label>
                      <Select
                        name="level"
                        value={newCourse.level}
                        onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                      >
                        <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full">
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
                      <Label htmlFor="enrolledstudents" className="text-gray-700 dark:text-gray-300">Enrolled Students</Label>
                      <Input
                        id="enrolledstudents"
                        name="enrolledstudents"
                        type="number"
                        value={newCourse.enrolledstudents === 0 ? "" : newCourse.enrolledstudents}
                        onChange={handleInputChange}
                        className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newCourse.description}
                        onChange={handleInputChange}
                        className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddCourseOpen(false)}
                        className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Submit
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} animation="wave" variant="rectangular" sx={{ height: 256, width: '100%', borderRadius: '8px' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-xl shadow-lg overflow-hidden transform transition-all">
                  <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 p-4">
                    <CardTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 line-clamp-1">
                      {course.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{course.description}</p>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                        <span className="truncate">{course.instructor}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                        <span>{course.duration} months</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                        <span>{course.enrolledstudents} students</span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.level === "Advanced"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : course.level === "Intermediate"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
                          }`}
                        >
                          {course.level}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex flex-col sm:flex-row justify-between items-center gap-2 bg-indigo-50 dark:bg-indigo-900/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(course)}
                      className="w-full sm:w-auto text-indigo-600 border-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-800"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {hasPermission("edit_course") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(course)}
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {hasPermission("delete_course") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Course Dialog */}
        <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Edit Course</DialogTitle>
            </DialogHeader>
            {editCourse && (
              <form onSubmit={handleUpdateCourse} className="space-y-4 p-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Course Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editCourse.name}
                    onChange={handleEditInputChange}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor" className="text-gray-700 dark:text-gray-300">Instructor</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={editCourse.instructor}
                    onChange={handleEditInputChange}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-700 dark:text-gray-300">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={editCourse.duration}
                    onChange={handleEditInputChange}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-gray-700 dark:text-gray-300">Level</Label>
                  <Select
                    name="level"
                    value={editCourse.level}
                    onValueChange={(value) => setEditCourse({ ...editCourse, level: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full">
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
                  <Label htmlFor="enrolledstudents" className="text-gray-700 dark:text-gray-300">Enrolled Students</Label>
                  <Input
                    id="enrolledstudents"
                    name="enrolledstudents"
                    type="number"
                    value={editCourse.enrolledstudents === 0 ? "" : editCourse.enrolledstudents}
                    onChange={handleEditInputChange}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editCourse.description}
                    onChange={handleEditInputChange}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditCourseOpen(false)}
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Update
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* View Course Details Dialog */}
        <Dialog open={isViewCourseOpen} onOpenChange={setIsViewCourseOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Course Details</DialogTitle>
            </DialogHeader>
            {viewCourse && (
              <div className="p-4 space-y-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Course Name</Label>
                  <p className="text-gray-800 dark:text-gray-200">{viewCourse.name}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Instructor</Label>
                  <p className="text-gray-800 dark:text-gray-200">{viewCourse.instructor}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Duration</Label>
                  <p className="text-gray-800 dark:text-gray-200">{viewCourse.duration}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Level</Label>
                  <p className="text-gray-800 dark:text-gray-200">{viewCourse.level}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Enrolled Students</Label>
                  <p className="text-gray-800 dark:text-gray-200">{viewCourse.enrolledstudents}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">Description</Label>
                  <p className="text-gray-800 dark:text-gray-200">{viewCourse.description}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewCourseOpen(false)}
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Validation Error Dialog */}
        <Dialog open={isValidationErrorOpen} onOpenChange={setIsValidationErrorOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-red-600 dark:text-red-400">Form Error</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">
                All fields are required. Please fill in all the inputs before submitting.
              </p>
            </div>
            <DialogFooter className="flex justify-end p-4">
              <Button
                variant="outline"
                onClick={() => setIsValidationErrorOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Popup Dialog */}
        <Dialog open={isSuccessPopupOpen} onOpenChange={setIsSuccessPopupOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Success</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">{successMessage}</p>
            </div>
            <DialogFooter className="flex justify-end p-4">
              <Button
                variant="outline"
                onClick={() => setIsSuccessPopupOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}