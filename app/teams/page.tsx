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
import { TeamDetail } from "@/components/team-detail";

interface Team {
  id: number;
  name: string;
  leader: string;
  teammembers: string[];
  project: string;
}

interface Project {
  id: number;
  name: string;
}

interface Member {
  id: number;
  name: string;
}

const teamsApiBaseUrl = "http://127.0.0.1:8000/api/teams/";
const membersApiBaseUrl = "http://127.0.0.1:8000/api/members/";
const projectsApiBaseUrl = "http://127.0.0.1:8000/api/projects/";

export default function TeamsPage() {
  const { t } = useTranslation();
  const [teams, setTeams] = useState<Team[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isValidationErrorOpen, setIsValidationErrorOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTeam, setNewTeam] = useState<Team>({
    id: 0,
    name: "",
    leader: "",
    teammembers: [],
    project: "",
  });
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [originalEditTeam, setOriginalEditTeam] = useState<Team | null>(null); // Track original team data
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
        const [teamsResponse, membersResponse, projectsResponse] = await Promise.all([
          axios.get<Team[]>(teamsApiBaseUrl),
          axios.get<Member[]>(membersApiBaseUrl),
          axios.get<Project[]>(projectsApiBaseUrl),
        ]);
        setTeams(teamsResponse.data);
        setAllMembers(membersResponse.data);
        setAllProjects(projectsResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load teams, members, or projects",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.teammembers.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase())) ||
      team.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const validateTeamData = (team: Team): boolean => {
    return (
      team.name.trim() !== "" &&
      team.leader.trim() !== "" &&
      team.teammembers.length > 0 &&
      team.project.trim() !== ""
    );
  };

  // Check if there are changes between original and edited team
  const hasChanges = (original: Team, edited: Team): boolean => {
    return (
      original.name !== edited.name ||
      original.leader !== edited.leader ||
      original.teammembers.join(",") !== edited.teammembers.join(",") ||
      original.project !== edited.project
    );
  };

  const handleAddTeam = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateTeamData(newTeam)) {
      setIsValidationErrorOpen(true);
      return;
    }
    try {
      const response = await axios.post<Team>(teamsApiBaseUrl, newTeam, {
        headers: { "Content-Type": "application/json" },
      });
      setTeams([...teams, response.data]);
      setIsAddTeamOpen(false);
      setNewTeam({ id: 0, name: "", leader: "", teammembers: [], project: "" });
      setSuccessMessage("Team added successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Team added successfully" });
    } catch (error) {
      console.error("Error adding team:", error);
      toast({ title: "Error", description: "Failed to add team", variant: "destructive" });
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditTeam(team);
    setOriginalEditTeam({ ...team }); // Store original team data for comparison
    setIsEditTeamOpen(true);
  };

  const handleUpdateTeam = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editTeam || !validateTeamData(editTeam)) {
      setIsValidationErrorOpen(true);
      return;
    }

    // Check if there are any changes before updating
    if (originalEditTeam && !hasChanges(originalEditTeam, editTeam)) {
      setIsEditTeamOpen(false); // No changes, just close the dialog
      setEditTeam(null);
      setOriginalEditTeam(null);
      return; // Exit without showing success or making API call
    }

    try {
      const response = await axios.put(`${teamsApiBaseUrl}${editTeam.id}/`, editTeam, {
        headers: { "Content-Type": "application/json" },
      });
      setTeams(teams.map((t) => (t.id === editTeam.id ? response.data : t)));
      setIsEditTeamOpen(false);
      setEditTeam(null);
      setOriginalEditTeam(null);
      setSuccessMessage("Team updated successfully");
      setIsSuccessPopupOpen(true); // Only trigger on successful update
      toast({ title: "Success", description: "Team updated successfully" });
    } catch (error) {
      console.error("Error updating team:", error);
      toast({ title: "Error", description: "Failed to update team", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditTeamOpen(false);
    setEditTeam(null);
    setOriginalEditTeam(null); // Reset original team data
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setTeamToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;
    try {
      await axios.delete(`${teamsApiBaseUrl}${teamToDelete}/`);
      setTeams(teams.filter((team) => team.id !== teamToDelete));
      setIsDeleteConfirmOpen(false);
      setTeamToDelete(null);
      setSuccessMessage("Team deleted successfully");
      setIsSuccessPopupOpen(true);
      toast({ title: "Success", description: "Team deleted successfully" });
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({ title: "Error", description: "Failed to delete team", variant: "destructive" });
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
            {t("Teams")}
          </motion.h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <Button
              onClick={() => setIsAddTeamOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </div>
        </div>

        {/* Teams Table */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full">
          <Card className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900">
              <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">All Teams</CardTitle>
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
                        <th className="px-4 py-3 font-semibold">Leader</th>
                        <th className="px-4 py-3 font-semibold">Members</th>
                        <th className="px-4 py-3 font-semibold">Project</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTeams.map((team) => (
                        <tr
                          key={team.id}
                          className="border-t border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{team.name}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{team.leader}</td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                            {team.teammembers.length}
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{team.project}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTeam(team)}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTeam(team)}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteConfirm(team.id)}
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

        {/* Add Team Dialog */}
        <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Add New Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTeam} className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Team Name</Label>
                <Input
                  id="name"
                  placeholder="Enter team name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leader" className="text-gray-700 dark:text-gray-300">Team Leader</Label>
                <Input
                  id="leader"
                  placeholder="Enter leader name"
                  value={newTeam.leader}
                  onChange={(e) => setNewTeam({ ...newTeam, leader: e.target.value })}
                  className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teammembers" className="text-gray-700 dark:text-gray-300">Team Members</Label>
                <Select
                  onValueChange={(value) =>
                    setNewTeam({ ...newTeam, teammembers: [...newTeam.teammembers, value] })
                  }
                >
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                    <SelectValue placeholder="Add members" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMembers
                      .filter((m) => !newTeam.teammembers.includes(m.name))
                      .map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTeam.teammembers.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {member}
                      <button
                        type="button"
                        onClick={() =>
                          setNewTeam({
                            ...newTeam,
                            teammembers: newTeam.teammembers.filter((m) => m !== member),
                          })
                        }
                        className="ml-2 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project" className="text-gray-700 dark:text-gray-300">Project</Label>
                <Select
                  value={newTeam.project}
                  onValueChange={(value) => setNewTeam({ ...newTeam, project: value })}
                >
                  <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {allProjects.map((project) => (
                      <SelectItem key={project.id} value={project.name}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-900 p-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddTeamOpen(false)}
                  className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Team Dialog */}
        <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
          <DialogContent className="max-w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-indigo-600 dark:text-indigo-400">Edit Team</DialogTitle>
            </DialogHeader>
            {editTeam && (
              <form onSubmit={handleUpdateTeam} className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Team Name</Label>
                  <Input
                    id="name"
                    value={editTeam.name}
                    onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leader" className="text-gray-700 dark:text-gray-300">Team Leader</Label>
                  <Input
                    id="leader"
                    value={editTeam.leader}
                    onChange={(e) => setEditTeam({ ...editTeam, leader: e.target.value })}
                    className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teammembers" className="text-gray-700 dark:text-gray-300">Team Members</Label>
                  <Select
                    onValueChange={(value) =>
                      setEditTeam({ ...editTeam, teammembers: [...editTeam.teammembers, value] })
                    }
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Add members" />
                    </SelectTrigger>
                    <SelectContent>
                      {allMembers
                        .filter((m) => !editTeam.teammembers.includes(m.name))
                        .map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editTeam.teammembers.map((member) => (
                      <span
                        key={member}
                        className="inline-flex items-center px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() =>
                            setEditTeam({
                              ...editTeam,
                              teammembers: editTeam.teammembers.filter((m) => m !== member),
                            })
                          }
                          className="ml-2 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project" className="text-gray-700 dark:text-gray-300">Project</Label>
                  <Select
                    value={editTeam.project}
                    onValueChange={(value) => setEditTeam({ ...editTeam, project: value })}
                  >
                    <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {allProjects.map((project) => (
                        <SelectItem key={project.id} value={project.name}>
                          {project.name}
                        </SelectItem>
                      ))}
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
                Are you sure you want to delete this team? This action cannot be undone.
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
                onClick={handleDeleteTeam}
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

        {/* Team Detail Dialog */}
        {selectedTeam && (
          <TeamDetail
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
            onUpdate={(updatedTeam) =>
              setTeams(teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)))
            }
            allMembers={allMembers.map((m) => m.name)}
            allProjects={allProjects.map((p) => p.name)}
          />
        )}
      </div>
    </MainLayout>
  );
}