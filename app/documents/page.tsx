"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { DocumentUpload } from "@/components/documents/document-upload"
import { DocumentSearch } from "@/components/documents/document-search"
import { DocumentCategories } from "@/components/documents/document-categories"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Eye, Download, Trash2 } from "lucide-react"

// Assuming hasPermission function is defined elsewhere, e.g., in a auth context
const hasPermission = (permission) => {
  // Replace with your actual permission check logic
  return true // For testing purposes, always return true
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Q1 Financial Report.pdf", category: "Reports", uploadDate: "2024-03-15", size: "2.5 MB" },
    { id: 2, name: "Employee Handbook.docx", category: "HR", uploadDate: "2024-02-28", size: "1.8 MB" },
    { id: 3, name: "Project Proposal.pptx", category: "Projects", uploadDate: "2024-03-10", size: "5.2 MB" },
    { id: 4, name: "Client Contract.pdf", category: "Legal", uploadDate: "2024-03-05", size: "3.1 MB" },
    { id: 5, name: "Marketing Strategy.pdf", category: "Marketing", uploadDate: "2024-03-20", size: "4.7 MB" },
  ])

  const [categories] = useState(["Reports", "HR", "Projects", "Legal", "Marketing", "Finance", "IT"])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpload = (newDocument) => {
    setDocuments([...documents, { id: documents.length + 1, ...newDocument }])
  }

  const handleDelete = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Document Storage and Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <DocumentSearch onSearch={setSearchTerm} />
            {hasPermission("view_documents") ? (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <TableContainer component={Paper} className="bg-white dark:bg-cool-800">
                    <Table aria-label="documents table" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Name</TableCell>
                          <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Category</TableCell>
                          <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Upload Date</TableCell>
                          <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Size</TableCell>
                          <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="text-cool-800 dark:text-cool-200">{doc.name}</TableCell>
                            <TableCell className="text-cool-800 dark:text-cool-200">{doc.category}</TableCell>
                            <TableCell className="text-cool-800 dark:text-cool-200">{doc.uploadDate}</TableCell>
                            <TableCell className="text-cool-800 dark:text-cool-200">{doc.size}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>You don't have permission to view documents.</p>
                </CardContent>
              </Card>
            )}
          </div>
          <div>
            <DocumentUpload onUpload={handleUpload} categories={categories} />
            <DocumentCategories categories={categories} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

