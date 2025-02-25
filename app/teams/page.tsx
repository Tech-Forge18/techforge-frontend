"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash } from "lucide-react";
import { TeamDetail } from "@/components/team-detail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// Define interfaces
interface Team {
  id: number;
  name: string;
  leader: string;
  teammembers: string[]; // Array of member names (strings)
  project: string; // Single project name (string)
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
    teammembers: [] as string[], // Array of member names (strings)
    project: "", // Single project name (string)
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]); // Array of member objects
  const [allProjects, setAllProjects] = useState<Project[]>([]); // Array of project objects

  // Fetch teams, members, and projects from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsResponse = await axios.get<Team[]>("http://127.0.0.1:8000/api/teams/");
        setTeams(teamsResponse.data);

        const membersResponse = await axios.get<Member[]>("http://127.0.0.1:8000/api/members/");
        setAllMembers(membersResponse.data);

        const projectsResponse = await axios.get<Project[]>("http://127.0.0.1:8000/api/projects/");
        setAllProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare the payload
      const payload = {
        name: newTeam.name,
        leader: newTeam.leader,
        teammembers: newTeam.teammembers, // Array of member names
        project: newTeam.project, // Single project name
      };

      // Debug: Log the payload
      console.log("Payload being sent to the backend:", payload);

      // Send the POST request
      const response = await axios.post<Team>("http://127.0.0.1:8000/api/teams/", payload);

      // Update the teams state with the new team
      setTeams([...teams, response.data]);

      // Close the form and reset the newTeam state
      setIsAddTeamOpen(false);
      setNewTeam({
        id: Date.now(),
        name: "",
        leader: "",
        teammembers: [],
        project: "",
      });

      alert("Team created successfully!");
    } catch (error) {
      console.error("Error creating team:", error);

      // Type guard to check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        console.error("Backend error response:", error.response?.data);
        alert(`Failed to create team: ${JSON.stringify(error.response?.data)}`);
      } else {
        console.error("An unexpected error occurred:", error);
        alert("Failed to create team. Please check the data and try again.");
      }
    }
  };

  // Filter teams based on search term
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle team update
  const handleUpdateTeam = (updatedTeam: Team) => {
    setTeams(teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team)));
    setSelectedTeam(null);
  };

  // Handle team deletion
  const handleDeleteTeam = async (teamId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/teams/${teamId}/`);
      setTeams(teams.filter((team) => team.id !== teamId));
      alert("Team deleted successfully!");
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team. Please try again.");
    }
  };

  return (
    <PageLayout
      title="All Teams"
      addButtonLabel="Add New Team"
      isOpen={isAddTeamOpen}
      onOpenChange={setIsAddTeamOpen}
      addForm={
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Create a new team</CardTitle>
              <CardDescription>Fill in the details to create a new team.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* Team Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newTeam.name}
                    onChange={handleInputChange}
                    placeholder="Enter team name"
                  />
                </div>

                {/* Team Leader */}
                <div className="grid gap-2">
                  <Label htmlFor="leader">Team Leader</Label>
                  <Input
                    id="leader"
                    name="leader"
                    value={newTeam.leader}
                    onChange={handleInputChange}
                    placeholder="Enter team leader name"
                  />
                </div>

                {/* Team Members */}
                <div className="grid gap-2">
                  <Label htmlFor="teammembers">Team Members</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTeam({ ...newTeam, teammembers: [...newTeam.teammembers, value] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team members" />
                    </SelectTrigger>
                    <SelectContent>
                      {allMembers
                        .filter((member) => !newTeam.teammembers.includes(member.name))
                        .map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {newTeam.teammembers.map((member) => (
                      <Button
                        key={member}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewTeam({
                            ...newTeam,
                            teammembers: newTeam.teammembers.filter((m) => m !== member),
                          })
                        }
                      >
                        {member} <span className="ml-2">×</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="grid gap-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    onValueChange={(value) => setNewTeam({ ...newTeam, project: value })}
                  >
                    <SelectTrigger>
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
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="secondary" onClick={() => setIsAddTeamOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      }
    >
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Teams Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell>Team Leader</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.leader}</TableCell>
                <TableCell>{team.teammembers.join(", ")}</TableCell>
                <TableCell>{team.project}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTeam(team)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTeam(team)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Team Details Dialog */}
      {selectedTeam && (
  <TeamDetail
    team={selectedTeam}
    onClose={() => setSelectedTeam(null)}
    onUpdate={handleUpdateTeam}
    allMembers={allMembers.map((member) => member.name)} // Pass member names
    allProjects={allProjects.map((project) => project.name)} // Pass project names
  />
)}
    </PageLayout>
  );
}