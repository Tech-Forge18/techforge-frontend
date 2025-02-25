"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Trash } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/components/auth/auth-context"
import { Textarea } from "@/components/ui/textarea"

interface Event {
  id: number
  title: string
  startdate: Date
  enddate: Date
  time: string | null
  category: string
  description: string
}

interface EventCategory {
  id: string
  label: string
  color: string
}

// Adjusted categories to match database
const eventCategories: EventCategory[] = [
  { id: "meeting", label: "Meetings", color: "bg-blue-500" },
  { id: "deadline", label: "Deadlines", color: "bg-red-500" },
  { id: "reminder", label: "Reminders", color: "bg-yellow-500" },
]

export function Calendar() {
  const [view, setView] = useState<string>("month")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    startdate: new Date(),
    enddate: new Date(),
    time: null,
    category: "",
    description: "",
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>(eventCategories.map((cat) => cat.id))
  const [events, setEvents] = useState<Event[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const { hasPermission } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/events/")
      const data: Event[] = await response.json()
      // Convert string dates to Date objects for UI
      const formattedData = data.map(event => ({
        ...event,
        startdate: new Date(event.startdate),
        enddate: new Date(event.enddate),
      }))
      setEvents(formattedData)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const handlePrevious = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() - 1)
      }
      return newDate
    })
  }

  const handleNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() + 1)
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + 7)
      } else {
        newDate.setDate(newDate.getDate() + 1)
      }
      return newDate
    })
  }

  const formatDateToString = (date: Date) => {
    return date.toISOString().split("T")[0] // Returns YYYY-MM-DD
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("") // Reset error message
    try {
      const eventToSend = {
        ...newEvent,
        startdate: formatDateToString(newEvent.startdate),
        enddate: formatDateToString(newEvent.enddate),
        time: newEvent.time || null, // Send null if time is empty
      }
      const response = await fetch("http://127.0.0.1:8000/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventToSend),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
      const data: Event = await response.json()
      setEvents([...events, { ...data, startdate: new Date(data.startdate), enddate: new Date(data.enddate) }])
      setNewEvent({
        id: 0,
        title: "",
        startdate: new Date(),
        enddate: new Date(),
        time: null,
        category: "",
        description: "",
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding event:", error)
      setErrorMessage(`Failed to add event: ${(error as Error).message}`)
    }
  }

  const handleDeleteEvent = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {  // Ensure trailing slash matches backend
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add authentication headers if required by your backend (e.g., Authorization: Bearer <token>)
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status} ${response.statusText}`);
      }
  
      // Only update UI if the delete was successful (e.g., 204 No Content)
      setEvents(events.filter((event) => event.id !== id));
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      // Optionally, revert UI or show an error message to the user
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const filteredEvents = events.filter((event) => selectedCategories.includes(event.category))

  const renderCalendarContent = () => {
    if (view === "month") {
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const startingDayOfWeek = firstDayOfMonth.getDay()
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

      return (
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center font-semibold bg-white dark:bg-gray-800">
              {day}
            </div>
          ))}
          {Array.from({ length: 42 }, (_, i) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - startingDayOfWeek + 1)
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const events = filteredEvents.filter((event) => event.startdate.toDateString() === date.toDateString())
            return (
              <div
                key={i}
                className={`p-2 bg-white dark:bg-gray-800 ${isCurrentMonth ? "" : "text-gray-400 dark:text-gray-600"}`}
              >
                <div className="font-semibold">{date.getDate()}</div>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 mb-1 rounded cursor-pointer ${
                      eventCategories.find((cat) => cat.id === event.category)?.color || "bg-gray-500"
                    } text-white`}
                    onClick={() => handleEventClick(event)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )
    } else if (view === "week") {
      // Implement week view
    } else {
      // Implement day view
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="w-full lg:w-64 p-4 border-b lg:border-r lg:border-b-0">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        {eventCategories.map((category) => (
          <div key={category.id} className="flex items-center mb-2">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryToggle(category.id)}
            />
            <label htmlFor={category.id} className="ml-2 text-sm font-medium">
              {category.label}
            </label>
            <div className={`w-4 h-4 rounded-full ml-auto ${category.color}`}></div>
          </div>
        ))}
      </div>
      <div className="flex-1 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold mx-4">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <DatePicker date={currentDate} setDate={setCurrentDate} />
            {hasPermission("add_event") && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-full">
                  <DialogHeader>
                    <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add New Event</DialogTitle>
                    <DialogDescription className="text-cool-600 dark:text-cool-400">
                      Create a new event for your calendar.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-cool-700 dark:text-cool-300">
                        Event Title
                      </Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start" className="text-cool-700 dark:text-cool-300">
                        Start Date and Time
                      </Label>
                      <Input
                        id="start"
                        type="datetime-local"
                        value={newEvent.startdate.toISOString().slice(0, 16)}
                        onChange={(e) => setNewEvent({ ...newEvent, startdate: new Date(e.target.value) })}
                        className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end" className="text-cool-700 dark:text-cool-300">
                        End Date and Time
                      </Label>
                      <Input
                        id="end"
                        type="datetime-local"
                        value={newEvent.enddate.toISOString().slice(0, 16)}
                        onChange={(e) => setNewEvent({ ...newEvent, enddate: new Date(e.target.value) })}
                        className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-cool-700 dark:text-cool-300">
                        Time (optional)
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value || null })}
                        className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-cool-700 dark:text-cool-300">
                        Category
                      </Label>
                      <Select
                        value={newEvent.category}
                        onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                      >
                        <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-cool-700 dark:text-cool-300">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white w-full sm:w-auto">
                        Add Event
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <div className="border rounded-lg overflow-x-auto">{renderCalendarContent()}</div>
      </div>
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                <strong>Start:</strong> {selectedEvent.startdate.toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {selectedEvent.enddate.toLocaleString()}
              </p>
              <p>
                <strong>Time:</strong> {selectedEvent.time || "N/A"}
              </p>
              <p>
                <strong>Category:</strong> {eventCategories.find((cat) => cat.id === selectedEvent.category)?.label}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
              {hasPermission("delete_event") && (
                <Button variant="destructive" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}