"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash } from "lucide-react";
import { TeamDetail } from "@/components/team-detail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

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

export default function TeamsPage() {
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState({
    id: Date.now(),
    name: "",
    leader: "",
    teammembers: [] as string[],
    project: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, membersResponse, projectsResponse] = await Promise.all([
          axios.get<Team[]>("http://127.0.0.1:8000/api/teams/"),
          axios.get<Member[]>("http://127.0.0.1:8000/api/members/"),
          axios.get<Project[]>("http://127.0.0.1:8000/api/projects/"),
        ]);
        setTeams(teamsResponse.data);
        setAllMembers(membersResponse.data);
        setAllProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...newTeam };
      const response = await axios.post<Team>("http://127.0.0.1:8000/api/teams/", payload);
      setTeams([...teams, response.data]);
      setIsAddTeamOpen(false);
      setNewTeam({ id: Date.now(), name: "", leader: "", teammembers: [], project: "" });
      alert("Team created successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Failed to create team: ${JSON.stringify(error.response?.data)}`);
      } else {
        alert("Failed to create team. Please try again.");
      }
      console.error("Error creating team:", error);
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateTeam = (updatedTeam: Team) => {
    setTeams(teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team)));
    setSelectedTeam(null);
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/teams/${teamId}/`);
      setTeams(teams.filter((team) => team.id !== teamId));
      alert("Team deleted successfully!");
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team.");
    }
  };

  const addForm = (
    <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
      <DialogContent className="sm:max-w-lg w-[90vw] rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Team
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">Team Name</Label>
            <Input
              id="name"
              name="name"
              value={newTeam.name}
              onChange={handleInputChange}
              placeholder="Enter team name"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leader" className="text-gray-700 dark:text-gray-200 font-medium">Team Leader</Label>
            <Input
              id="leader"
              name="leader"
              value={newTeam.leader}
              onChange={handleInputChange}
              placeholder="Enter leader name"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teammembers" className="text-gray-700 dark:text-gray-200 font-medium">Team Members</Label>
            <Select
              onValueChange={(value) =>
                setNewTeam({ ...newTeam, teammembers: [...newTeam.teammembers, value] })
              }
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Add members" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
            <Label htmlFor="project" className="text-gray-700 dark:text-gray-200 font-medium">Project</Label>
            <Select onValueChange={(value) => setNewTeam({ ...newTeam, project: value })}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {allProjects.map((project) => (
                  <SelectItem key={project.id} value={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddTeamOpen(false)}
              className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md"
            >
              Create Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <PageLayout
      title="Teams Dashboard"
      addButtonLabel="New Team"
      isOpen={isAddTeamOpen}
      onOpenChange={setIsAddTeamOpen}
      addForm={addForm}
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="max-w-md">
          <Input
            placeholder="Search teams or leaders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-indigo-500 rounded-lg"
          />
        </div>

        {/* Teams Table */}
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              All Teams
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Manage your organization’s teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableContainer
              component={Paper}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto"
            >
              <Table aria-label="teams table" stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Team Name", "Leader", "Members", "Project", "Actions"].map((header) => (
                      <TableCell
                        key={header}
                        className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-semibold py-3 px-4 whitespace-nowrap"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeams.map((team) => (
                    <TableRow
                      key={team.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <TableCell className="text-gray-800 dark:text-gray-200 py-3 px-4">
                        {team.name}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200 py-3 px-4">
                        {team.leader}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200 py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {team.teammembers.map((member) => (
                            <span
                              key={member}
                              className="inline-flex items-center px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                            >
                              {member}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200 py-3 px-4">
                        {team.project}
                      </TableCell>
                      <TableCell className="py-3 px-4 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedTeam(team)}
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedTeam(team)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>

      {selectedTeam && (
        <TeamDetail
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onUpdate={handleUpdateTeam}
          allMembers={allMembers.map((member) => member.name)}
          allProjects={allProjects.map((project) => project.name)}
        />
      )}
    </PageLayout>
  );
}