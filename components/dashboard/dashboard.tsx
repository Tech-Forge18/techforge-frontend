"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/auth/auth-context"
import { Users, Briefcase, Folder, Book, Users as TeamIcon, HelpCircle, Megaphone, Calendar, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface TotalsData {
  totalMembers: number
  totalClients: number
  totalProjects: number
  totalCourses: number
  totalTeams: number
  totalVacancies: number
}

interface Announcement {
  id: number
  title: string
  content: string
  date: string
}

interface LeaveRequest {
  id: number
  type: string
  start_date: string
  end_date: string
  status: string
}

interface Event {
  id: number
  title: string
  startdate: string
  enddate: string
  time: string
  category: string
  description: string
}

// Totals Card Component
const TotalsCard = ({
  title,
  total,
  icon,
}: {
  title: string
  total: number
  icon: React.ReactNode
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
  }

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="w-full">
      <Card className="bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600 dark:from-teal-700 dark:via-cyan-800 dark:to-blue-800 border-none shadow-md overflow-hidden">
        <CardContent className="p-4 flex flex-col items-center text-center text-white">
          <div className="mb-3">{icon}</div>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">{title}</h3>
          <motion.div variants={numberVariants} className="text-3xl font-extrabold">
            {total}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Announcements Feed Component with Dialog
const AnnouncementsFeed = ({ announcements }: { announcements: Announcement[] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="w-full cursor-pointer">
          <Card className="bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 dark:from-purple-700 dark:via-indigo-800 dark:to-blue-800 border-none shadow-md overflow-hidden">
            <CardContent className="p-4 text-white">
              <div className="flex items-center mb-3">
                <Megaphone className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-semibold uppercase tracking-wide">Announcements</h3>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="text-sm">
                    <p className="font-medium">{announcement.title}</p>
                    <p className="text-xs text-gray-200">{announcement.date}</p>
                    <p className="text-xs line-clamp-2">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-white">Announcements</DialogTitle>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto space-y-4 p-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium">{announcement.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</p>
              <p>{announcement.content}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Leave Requests Overview Component with Dialog
const LeaveRequestsOverview = ({ leaveRequests }: { leaveRequests: LeaveRequest[] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="w-full cursor-pointer">
          <Card className="bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 dark:from-orange-700 dark:via-red-800 dark:to-pink-800 border-none shadow-md overflow-hidden">
            <CardContent className="p-4 text-white">
              <div className="flex items-center mb-3">
                <Calendar className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-semibold uppercase tracking-wide">Leave Requests</h3>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-3">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="text-sm">
                    <p className="font-medium">{request.type}</p>
                    <p className="text-xs text-gray-200">
                      {request.start_date} - {request.end_date}
                    </p>
                    <p className={`text-xs ${request.status === "Approved" ? "text-green-200" : request.status === "Denied" ? "text-red-200" : "text-yellow-200"}`}>
                      {request.status}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-white">Leave Requests</DialogTitle>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto space-y-4 p-4">
          {leaveRequests.map((request) => (
            <div key={request.id} className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium">{request.type}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {request.start_date} - {request.end_date}
              </p>
              <p className={`text-xs ${request.status === "Approved" ? "text-green-600" : request.status === "Denied" ? "text-red-600" : "text-yellow-600"}`}>
                {request.status}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Calendar Events Component
const CalendarEvents = ({ events }: { events: Event[] }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="w-full">
      <Card className="bg-gradient-to-br from-green-500 via-lime-600 to-emerald-600 dark:from-green-700 dark:via-lime-800 dark:to-emerald-800 border-none shadow-md overflow-hidden">
        <CardContent className="p-4 text-white">
          <div className="flex items-center mb-3">
            <Clock className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold uppercase tracking-wide">Upcoming Events</h3>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-3">
            {events.map((event) => (
              <div key={event.id} className="text-sm">
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-gray-200">
                  {event.startdate} - {event.enddate} {event.time ? `at ${event.time}` : ""}
                </p>
                <p className="text-xs line-clamp-2">{event.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Dashboard() {
  const [totals, setTotals] = useState<TotalsData | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { hasPermission } = useAuth()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [totalsRes, announcementsRes, leaveRequestsRes, eventsRes] = await Promise.all([
          axios.get<TotalsData>(`${apiUrl}/dashboard/totals/`),
          axios.get<Announcement[]>(`${apiUrl}/announcements/`),
          axios.get<LeaveRequest[]>(`${apiUrl}/leave-requests/`),
          axios.get<Event[]>(`${apiUrl}/events/`),
        ])
        setTotals(totalsRes.data)
        setAnnouncements(announcementsRes.data.slice(0, 5)) // Limit to 5
        setLeaveRequests(leaveRequestsRes.data.slice(0, 5)) // Limit to 5
        setEvents(eventsRes.data.slice(0, 5)) // Limit to 5
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchDashboardData()
    }, 1000)

    return () => clearTimeout(timer)
  }, [apiUrl])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    )
  }

  if (!totals) {
    return <div className="text-center text-gray-500">No data available</div>
  }

  const totalCards = [
    { title: "Total Members", total: totals.totalMembers, icon: <Users className="h-6 w-6" />, permission: "view_members" },
    { title: "Total Clients", total: totals.totalClients, icon: <Briefcase className="h-6 w-6" />, permission: "view_clients" },
    { title: "Total Projects", total: totals.totalProjects, icon: <Folder className="h-6 w-6" />, permission: "view_projects" },
    { title: "Total Courses", total: totals.totalCourses, icon: <Book className="h-6 w-6" />, permission: "view_courses" },
    { title: "Total Teams", total: totals.totalTeams, icon: <TeamIcon className="h-6 w-6" />, permission: "view_teams" },
    { title: "Total Vacancies", total: totals.totalVacancies, icon: <HelpCircle className="h-6 w-6" />, permission: "view_vacancies" },
  ].filter((card) => hasPermission(card.permission))

  return (
    <div className="space-y-6 p-4">
      {/* Totals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {totalCards.map((card) => (
          <TotalsCard key={card.title} title={card.title} total={card.total} icon={card.icon} />
        ))}
      </div>

      {/* Additional Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnnouncementsFeed announcements={announcements} />
        <LeaveRequestsOverview leaveRequests={leaveRequests} />
        <CalendarEvents events={events} />
      </div>
    </div>
  )
}