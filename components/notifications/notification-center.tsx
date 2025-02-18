"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "task", message: "New task assigned: Update website content", read: false },
    { id: 2, type: "message", message: "New message from John Doe", read: false },
    { id: 3, type: "system", message: "System maintenance scheduled for tonight", read: true },
    { id: 4, type: "approval", message: "Your leave request has been approved", read: true },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleReadNotification = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">{unreadCount}</Badge>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="flex items-start py-2 px-4 cursor-pointer"
            onClick={() => handleReadNotification(notification.id)}
          >
            <div className={`flex-1 ${notification.read ? "text-muted-foreground" : "font-semibold"}`}>
              <p>{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
              </p>
            </div>
            {!notification.read && (
              <Badge variant="secondary" className="ml-2 mt-1">
                New
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
        {notifications.length === 0 && <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

