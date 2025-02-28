"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { ClientDetail } from "@/components/client-detail";

const apiBaseUrl = "http://127.0.0.1:8000/api/clients/";
const projectsApiUrl = "http://127.0.0.1:8000/api/projects/";

interface Client {
  id: number;
  name: string;
  project: string;
  email: string;
  contactinfo: string;
  status: string;
}

interface Project {
  id: number;
  name: string;
}

// Define a type for new client without id
type NewClient = Omit<Client, "id">;

export default function ClientsPage() {
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isValidationErrorOpen, setIsValidationErrorOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newClient, setNewClient] = useState<NewClient>({
    name: "",
    project: "",
    email: "",
    contactinfo: "",
    status: "",
  });
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [originalEditClient, setOriginalEditClient] = useState<Client | null>(null); // Track original client data
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, projectsResponse] = await Promise.all([
          axios.get<Client[]>(apiBaseUrl),
          axios.get<Project[]>(projectsApiUrl),
        ]);
        setClients(clientsResponse.data);
        setProjects(projectsResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load clients or projects",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const validateClientData = (client: NewClient | Client): boolean => {
    return (
      client.name.trim() !== "" &&
      client.project.trim() !== "" &&
      client.email.trim() !== "" &&
      client.contactinfo.trim() !== "" &&
      client.status.trim() !== ""
    );
  };

  // Check if there are changes between original and edited client
  const hasChanges = (original: Client, edited: Client): boolean => {
    return (
      original.name !== edited.name ||
      original.project !== edited.project ||
      original.email !== edited.email ||
      original.contactinfo !== edited.contactinfo ||
      original.status !== edited.status
    );
  };

  const handleAddClient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateClientData(newClient)) {
      setIsValidationErrorOpen(true);
      return;
    }
    try {
      const response = await axios.post<Client>(apiBaseUrl, newClient);
      setClients([...clients, response.data]);
      setIsAddClientOpen(false);
      setNewClient({
        name: "",
        project: "",
        email: "",
        contactinfo: "",
        status: "",
      });
      setSuccessMessage("Client added successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Client added successfully" });
    } catch (error) {
      console.error("Error adding client:", error);
      toast({ title: "Error", description: "Failed to add client", variant: "destructive" });
    }
  };

  const handleEditClient = (client: Client) => {
    setEditClient(client);
    setOriginalEditClient({ ...client }); // Store original client data for comparison
    setIsEditClientOpen(true);
  };

  const handleUpdateClient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editClient || !validateClientData(editClient)) {
      setIsValidationErrorOpen(true);
      return;
    }

    // Check if there are any changes before updating
    if (originalEditClient && !hasChanges(originalEditClient, editClient)) {
      setIsEditClientOpen(false); // No changes, just close the dialog
      setEditClient(null);
      setOriginalEditClient(null);
      return; // Exit without showing success or making API call
    }

    try {
      const response = await axios.put(`${apiBaseUrl}${editClient.id}/`, editClient);
      setClients(clients.map((c) => (c.id === editClient.id ? response.data : c)));
      setIsEditClientOpen(false);
      setEditClient(null);
      setOriginalEditClient(null);
      setSuccessMessage("Client updated successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Client updated successfully" });
    } catch (error) {
      console.error("Error updating client:", error);
      toast({ title: "Error", description: "Failed to update client", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditClientOpen(false);
    setEditClient(null);
    setOriginalEditClient(null); // Reset original client data
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setClientToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    try {
      await axios.delete(`${apiBaseUrl}${clientToDelete}/`);
      setClients(clients.filter((client) => client.id !== clientToDelete));
      setIsDeleteConfirmOpen(false);
      setClientToDelete(null);
      setSuccessMessage("Client deleted successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Client deleted successfully" });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({ title: "Error", description: "Failed to delete client", variant: "destructive" });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-300"
          >
            {t("Clients")}
          </motion.h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <Button
              onClick={() => setIsAddClientOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Clients Table */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full">
          <Card className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900">
              <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">All Clients</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg bg-indigo-100 dark:bg-indigo-800" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Project</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Contact Info</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedClients.map((client) => (
                        <tr
                          key={client.id}
                          className="border-t border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{client.name}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{client.project}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{client.email}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{client.contactinfo}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                client.status === "Active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : client.status === "On Hold"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {client.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedClient(client)}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClient(client)}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteConfirm(client.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!isLoading && (
                <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 dark:bg-indigo-900">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-indigo-700 dark:text-indigo-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Client Dialog */}
        <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Add New Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Client Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter client name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project" className="text-gray-700 dark:text-gray-300">Project</Label>
                <Select
                  value={newClient.project}
                  onValueChange={(value) => setNewClient({ ...newClient, project: value })}
                >
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
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
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactinfo" className="text-gray-700 dark:text-gray-300">Contact Info</Label>
                <Textarea
                  id="contactinfo"
                  name="contactinfo"
                  placeholder="Enter contact info"
                  value={newClient.contactinfo}
                  onChange={(e) => setNewClient({ ...newClient, contactinfo: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
                <Select
                  value={newClient.status}
                  onValueChange={(value) => setNewClient({ ...newClient, status: value })}
                >
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-900 p-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddClientOpen(false)}
                  className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Add Client
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Edit Client</DialogTitle>
            </DialogHeader>
            {editClient && (
              <form onSubmit={handleUpdateClient} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Client Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter client name"
                    value={editClient.name}
                    onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project" className="text-gray-700 dark:text-gray-300">Project</Label>
                  <Select
                    value={editClient.project}
                    onValueChange={(value) => setEditClient({ ...editClient, project: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
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
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    value={editClient.email}
                    onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactinfo" className="text-gray-700 dark:text-gray-300">Contact Info</Label>
                  <Textarea
                    id="contactinfo"
                    name="contactinfo"
                    placeholder="Enter contact info"
                    value={editClient.contactinfo}
                    onChange={(e) => setEditClient({ ...editClient, contactinfo: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
                  <Select
                    value={editClient.status}
                    onValueChange={(value) => setEditClient({ ...editClient, status: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-900 p-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit} // Use new cancel handler
                    className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-red-600 dark:text-red-400">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this client? This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="flex justify-end gap-2 p-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteClient}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Validation Error Dialog */}
        <Dialog open={isValidationErrorOpen} onOpenChange={setIsValidationErrorOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-red-600 dark:text-red-400">Form Error</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">
                All fields are required. Please fill in all the inputs before submitting.
              </p>
            </div>
            <DialogFooter className="flex justify-end p-4">
              <Button
                variant="outline"
                onClick={() => setIsValidationErrorOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Popup Dialog */}
        <Dialog open={isSuccessPopupOpen} onOpenChange={setIsSuccessPopupOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-green-600 dark:text-green-400">Success</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">{successMessage}</p>
            </div>
            <DialogFooter className="flex justify-end p-4">
              <Button
                variant="outline"
                onClick={() => setIsSuccessPopupOpen(false)}
                className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Client Detail Dialog */}
        {selectedClient && (
          <ClientDetail
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onUpdate={handleUpdateClient}
            projects={projects.map((project) => project.name)}
          />
        )}
      </div>
    </MainLayout>
  );
}