"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Plus } from "lucide-react"

export function DocumentUpload({ onUpload, categories }) {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = () => {
    if (file && category) {
      const newDocument = {
        name: file.name,
        category: category,
        uploadDate: new Date().toISOString().split("T")[0],
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      }
      onUpload(newDocument)
      setFile(null)
      setCategory("")
      setIsDialogOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-vibrant-600 dark:text-vibrant-400">Upload Document</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-vibrant-500 hover:bg-vibrant-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Upload New Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-cool-700 dark:text-cool-300">
                  Select File
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-cool-700 dark:text-cool-300">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleUpload}
                disabled={!file || !category}
                className="w-full bg-vibrant-500 hover:bg-vibrant-600 text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

