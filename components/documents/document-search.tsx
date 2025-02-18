"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function DocumentSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCategory, setSearchCategory] = useState("all")

  useEffect(() => {
    onSearch(searchTerm)
  }, [searchTerm, onSearch])

  return (
    <div className="flex space-x-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={searchCategory} onValueChange={setSearchCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="reports">Reports</SelectItem>
          <SelectItem value="hr">HR</SelectItem>
          <SelectItem value="projects">Projects</SelectItem>
          <SelectItem value="legal">Legal</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

