"use client"

import React, { useState, useEffect } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Eye, Link, Plus } from "lucide-react"
import { ClientDetail } from "@/components/client-detail"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import axios from "axios"

const apiBaseUrl = "http://127.0.0.1:8000/api/clients/"
const projectsApiUrl = "http://127.0.0.1:8000/api/projects/"

interface Client {
  id: number
  name: string
  project: string
  email: string
  contactinfo: string
  status: string
}

interface Project {
  id: number
  name: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [newClient, setNewClient] = useState({
    name: "",
    project: "",
    email:"",
    contactinfo: "",
    status: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchClients()
    fetchProjects()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await axios.get(apiBaseUrl)
      setClients(response.data)
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await axios.get(projectsApiUrl)
      setProjects(response.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewClient((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(apiBaseUrl, newClient)
      setClients([...clients, response.data])
      setIsAddClientOpen(false)
      setNewClient({
        name: "",
        project: "",
        email: "",
        contactinfo: "",
        status: "",
      })
    } catch (error) {
      console.error("Error adding client:", error)
    }
  }

  const handleDeleteClient = async (id: number) => {
    try {
      await axios.delete(`${apiBaseUrl}${id}/`)
      setClients(clients.filter((client) => client.id !== id))
    } catch (error) {
      console.error("Error deleting client:", error)
    }
  }

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      const response = await axios.put(`${apiBaseUrl}${updatedClient.id}/`, updatedClient)
      setClients(clients.map((client) => (client.id === updatedClient.id ? response.data : client)))
      setSelectedClient(null)
    } catch (error) {
      console.error("Error updating client:", error)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <PageLayout
      title="Client Management"
      addButtonLabel="Add Client"
      isOpen={isAddClientOpen}
      onOpenChange={setIsAddClientOpen}
      addForm={
        <DialogContent className="sm:max-w-[425px] w-full">
          <DialogHeader>
            <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add New Client</DialogTitle>
            <DialogDescription className="text-cool-600 dark:text-cool-400">
              Add a new client to your organization.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-cool-700 dark:text-cool-300">
                Client Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project" className="text-cool-700 dark:text-cool-300">
                Project
              </Label>
              <Select
                name="project"
                value={newClient.project}
                onValueChange={(value) => setNewClient({ ...newClient, project: value })}
              >
                <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.name}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cool-700 dark:text-cool-300">
                Email
              </Label>
              <Textarea
                id="email"
                name="email"
                value={newClient.email}
                onChange={handleInputChange}
                className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactinfo" className="text-cool-700 dark:text-cool-300">
                Contact Info
              </Label>
              <Textarea
                id="contactinfo"
                name="contactinfo"
                value={newClient.contactinfo}
                onChange={handleInputChange}
                className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600"
                required
              />
            </div>
           
            <div className="space-y-2">
              <Label htmlFor="status" className="text-cool-700 dark:text-cool-300">
                Status
              </Label>
              <Select
                name="status"
                value={newClient.status}
                onValueChange={(value) => setNewClient({ ...newClient, status: value })}
              >
                <SelectTrigger className="bg-cool-50 dark:bg-cool-700 border-cool-200 dark:border-cool-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddClientOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-vibrant-500 hover:bg-vibrant-600 text-white w-full sm:w-auto">
                Add Client
              </Button>
            </div>
          </form>
        </DialogContent>
      }
    >
      <div className="mb-4">
        <Input placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>Manage your organization's clients and their projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <TableContainer component={Paper} className="bg-white dark:bg-cool-800">
            <Table aria-label="clients table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Client Name</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Project</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Contact Info</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Email</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Status</TableCell>
                  <TableCell className="font-semibold text-cool-700 dark:text-cool-300">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="text-cool-800 dark:text-cool-200">{client.name}</TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{client.project}</TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{client.contactinfo}</TableCell>
                    <TableCell className="text-cool-800 dark:text-cool-200">{client.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          client.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : client.status === "On Hold"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedClient(client)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedClient(client)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 className="h-4 w-4" />
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
      {selectedClient && (
        <ClientDetail
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdate={handleUpdateClient}
          projects={projects.map((project) => project.name)}
        />
      )}
    </PageLayout>
  )
}