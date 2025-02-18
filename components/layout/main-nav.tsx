"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  Calendar,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Users,
  Briefcase,
  GraduationCap,
  UserCircle,
  FileText,
  ClipboardList,
  UsersRound,
  MessagesSquare,
  BookOpenCheck,
  DollarSign,
  Building2,
  BookMarked,
  FileIcon,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const iconColors = {
  dashboard: "text-blue-500",
  members: "text-green-500",
  projects: "text-purple-500",
  courses: "text-yellow-500",
  profile: "text-pink-500",
  vacancies: "text-orange-500",
  inbox: "text-indigo-500",
  analytics: "text-red-500",
  tasks: "text-cyan-500",
  teams: "text-teal-500",
  communication: "text-violet-500",
  training: "text-amber-500",
  expenses: "text-lime-500",
  clients: "text-emerald-500",
  knowledge: "text-fuchsia-500",
  calendar: "text-rose-500",
  support: "text-sky-500",
  documents: "text-gray-500",
  timeTracking: "text-blue-400",
}

const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: "view_dashboard",
  },
  {
    href: "/members",
    label: "Members",
    icon: Users,
    permission: "view_members",
  },
  {
    href: "/projects",
    label: "Projects",
    icon: Briefcase,
    permission: "view_projects",
  },
  {
    href: "/courses",
    label: "Courses",
    icon: GraduationCap,
    permission: "view_courses",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserCircle,
    permission: "view_profile",
  },
  {
    href: "/vacancies",
    label: "Vacancies",
    icon: FileText,
    permission: "view_vacancies",
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: Inbox,
    permission: "view_inbox",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart,
    permission: "view_analytics",
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: ClipboardList,
    permission: "view_tasks",
  },
  {
    href: "/teams",
    label: "Teams",
    icon: UsersRound,
    permission: "view_teams",
  },
  {
    href: "/communication",
    label: "Communication",
    icon: MessagesSquare,
    permission: "view_communication",
  },
  {
    href: "/training",
    label: "Training",
    icon: BookOpenCheck,
    permission: "view_training",
  },
  {
    href: "/expenses",
    label: "Expenses",
    icon: DollarSign,
    permission: "view_expenses",
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Building2,
    permission: "view_clients",
  },
  {
    href: "/knowledge",
    label: "Knowledge Base",
    icon: BookMarked,
    permission: "view_knowledge",
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: Calendar,
    permission: "view_calendar",
  },
  {
    href: "/documents",
    label: "Documents",
    icon: FileIcon,
    permission: "view_documents",
  },
  {
    href: "/support",
    label: "Support",
    icon: LifeBuoy,
    permission: "view_support",
  },
  {
    href: "/time-tracking",
    label: "Time Tracking",
    icon: Clock,
    permission: "view_time_tracking",
  },
]

export function MainNav({ hasPermission, onItemClick }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {routes.map(
        (route) =>
          hasPermission(route.permission) && (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-2 text-sm", pathname === route.href && "bg-secondary")}
              asChild
              onClick={() => {
                if (typeof onItemClick === "function") {
                  onItemClick()
                }
              }}
            >
              <Link href={route.href}>
                <route.icon className={cn("h-4 w-4", iconColors[route.href.slice(1)])} />
                <span className="hidden lg:inline">{route.label}</span>
              </Link>
            </Button>
          ),
      )}
    </nav>
  )
}

