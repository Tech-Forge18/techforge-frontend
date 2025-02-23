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
  project: string[]; // Array of project names (strings)
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
    members: [] as string[], // Array of member names (strings)
    project: [] as string[], // Array of project names (strings)
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

    // Debug: Log the newTeam state before sending
    console.log("Data being sent to the backend:", newTeam);

    try {
      // Map names to IDs
      const teammember_ids = newTeam.members.map((memberName) =>
        allMembers.find((member) => member.name === memberName)?.id
      );
      const project_id = allProjects.find((project) => project.name === newTeam.project[0])?.id;

      // Prepare the payload
      const payload = {
        name: newTeam.name,
        leader: newTeam.leader, // Send leader name
        teammember_ids, // Send member IDs
        project_id, // Send project ID
      };

      // Debug: Log the payload
      console.log("Payload being sent to the backend:", payload);

      // Send the POST request
      const response = await axios.post<Team>("http://127.0.0.1:8000/api/teams/", payload);

      // Debug: Log the response from the backend
      console.log("Response from the backend:", response.data);

      // Update the teams state with the new team
      setTeams([...teams, response.data]);

      // Close the form and reset the newTeam state
      setIsAddTeamOpen(false);
      setNewTeam({
        id: Date.now(),
        name: "",
        leader: "",
        members: [],
        project: [],
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
                  <Label htmlFor="members">Team Members</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTeam({ ...newTeam, members: [...newTeam.members, value] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team members" />
                    </SelectTrigger>
                    <SelectContent>
                      {allMembers
                        .filter((member) => !newTeam.members.includes(member.name))
                        .map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {newTeam.members.map((member) => (
                      <Button
                        key={member}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewTeam({
                            ...newTeam,
                            members: newTeam.members.filter((m) => m !== member),
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
                  <Label htmlFor="projects">Projects</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTeam({ ...newTeam, project: [...newTeam.project, value] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select projects" />
                    </SelectTrigger>
                    <SelectContent>
                      {allProjects
                        .filter((project) => !newTeam.project.includes(project.name))
                        .map((project) => (
                          <SelectItem key={project.id} value={project.name}>
                            {project.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {newTeam.project.map((project) => (
                      <Button
                        key={project}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNewTeam({
                            ...newTeam,
                            project: newTeam.project.filter((p) => p !== project),
                          })
                        }
                      >
                        {project} <span className="ml-2">×</span>
                      </Button>
                    ))}
                  </div>
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
              <TableCell>Projects</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.leader}</TableCell>
                <TableCell>
                  {team.teammembers}
               </TableCell>
              <TableCell>
                {team.project}
                </TableCell>

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
        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Team Details</DialogTitle>
            </DialogHeader>
            <TeamDetail
              team={selectedTeam}
              onUpdate={handleUpdateTeam}
              onClose={() => setSelectedTeam(null)}
              allMembers={allMembers.map((member) => member.name)} // Pass only member names
            />
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
}