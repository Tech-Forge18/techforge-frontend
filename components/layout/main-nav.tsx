"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type IconColorKey =
  | "dashboard"
  | "members"
  | "projects"
  | "courses"
  | "profile"
  | "vacancies"
  | "inbox"
  | "analytics"
  | "tasks"
  | "teams"
  | "communication"
  | "training"
  | "expenses"
  | "clients"
  | "knowledge"
  | "calendar"
  | "support"
  | "documents"
  | "time-tracking";

const iconColors: Record<IconColorKey, string> = {
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
  "time-tracking": "text-blue-400",
};

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "view_dashboard" },
  { href: "/members", label: "Members", icon: Users, permission: "view_members" },
  { href: "/projects", label: "Projects", icon: Briefcase, permission: "view_projects" },
  { href: "/courses", label: "Courses", icon: GraduationCap, permission: "view_courses" },
  { href: "/profile", label: "Profile", icon: UserCircle, permission: "view_profile" },
  { href: "/vacancies", label: "Vacancies", icon: FileText, permission: "view_vacancies" },
  { href: "/inbox", label: "Inbox", icon: Inbox, permission: "view_inbox" },
  { href: "/analytics", label: "Analytics", icon: BarChart, permission: "view_analytics" },
  { href: "/tasks", label: "Tasks", icon: ClipboardList, permission: "view_tasks" },
  { href: "/teams", label: "Teams", icon: UsersRound, permission: "view_teams" },
  { href: "/communication", label: "Communication", icon: MessagesSquare, permission: "view_communication" },
  { href: "/training", label: "Training", icon: BookOpenCheck, permission: "view_training" },
  { href: "/expenses", label: "Expenses", icon: DollarSign, permission: "view_expenses" },
  { href: "/clients", label: "Clients", icon: Building2, permission: "view_clients" },
  { href: "/knowledge", label: "Knowledge Base", icon: BookMarked, permission: "view_knowledge" },
  { href: "/calendar", label: "Calendar", icon: Calendar, permission: "view_calendar" },
  { href: "/documents", label: "Documents", icon: FileIcon, permission: "view_documents" },
  { href: "/support", label: "Support", icon: LifeBuoy, permission: "view_support" },
  { href: "/time-tracking", label: "Time Tracking", icon: Clock, permission: "view_time_tracking" },
];

interface MainNavProps {
  hasPermission: (permission: string) => boolean;
  onItemClick?: () => void;
}

export function MainNav({ hasPermission, onItemClick }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="p-2 space-y-1">
      {routes.map((route) =>
        hasPermission(route.permission) ? (
          <Button
            key={route.href}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 py-2 px-3 text-sm font-medium transition-all duration-200",
              pathname === route.href
                ? "bg-indigo-200 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-200 shadow-sm"
                : "text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 hover:text-indigo-800 dark:hover:text-indigo-400"
            )}
            asChild
            onClick={() => onItemClick?.()}
          >
            <Link href={route.href}>
              <route.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  iconColors[route.href.slice(1) as IconColorKey],
                  pathname === route.href && "text-indigo-600 dark:text-indigo-400"
                )}
              />
              <span className="truncate">{route.label}</span>
            </Link>
          </Button>
        ) : null
      )}
    </nav>
  );
}