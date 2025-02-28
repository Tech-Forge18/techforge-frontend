"use client"
import React, { useState, useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Dummy data for initial chat messages
const initialMessages = [
  { id: 1, sender: "John Doe", content: "Hey team, how's the project coming along?", timestamp: "10:30 AM" },
  {
    id: 2,
    sender: "Jane Smith",
    content: "We're making good progress. The frontend is almost complete.",
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    sender: "Bob Johnson",
    content: "Great! I'm working on the backend and should be done by tomorrow.",
    timestamp: "10:35 AM",
  },
]

export function InternalChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")


  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Internal Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`} />
                  <AvatarFallback>{message.sender[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{message.sender}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={(e) => e.preventDefault()} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}