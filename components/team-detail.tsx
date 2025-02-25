import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserMinus, Edit } from "lucide-react";

// Define the props for the TeamDetail component
interface TeamDetailProps {
  team: { id: number; name: string; leader: string; teammembers: string[]; project: string };
  onClose: () => void;
  onUpdate: (updatedTeam: { id: number; name: string; leader: string; teammembers: string[]; project: string }) => void;
  allMembers: string[];
  allProjects: string[];
}

export function TeamDetail({ team, onClose, onUpdate, allMembers, allProjects }: TeamDetailProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedTeam, setEditedTeam] = useState(team);

  // Handle input changes for text fields and select fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTeam((prev) => ({ ...prev, [name]: value }));
  };

  // Update the team when the form is submitted
  const handleUpdate = () => {
    if (!editedTeam.name || !editedTeam.leader || editedTeam.teammembers.length === 0 || !editedTeam.project) {
      alert("Please ensure the team has a valid name, leader, at least one member, and a project.");
      return;
    }
    onUpdate(editedTeam);
    setEditMode(false);
  };

  // Add a new member to the team
  const handleAddMember = (member: string) => {
    if (!editedTeam.teammembers.includes(member)) {
      setEditedTeam((prev) => ({
        ...prev,
        teammembers: [...prev.teammembers, member],
      }));
    }
  };

  // Remove a member from the team
  const handleRemoveMember = (member: string) => {
    setEditedTeam((prev) => ({
      ...prev,
      teammembers: prev.teammembers.filter((m) => m !== member),
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Team" : "Team Details"}</DialogTitle>
        </DialogHeader>
        {/* Edit Mode */}
        {editMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-4"
          >
            {/* Team Name */}
            <div>
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                name="name"
                value={editedTeam.name}
                onChange={handleInputChange}
                placeholder="Enter team name"
              />
            </div>

            {/* Team Leader */}
            <div>
              <Label htmlFor="leader">Team Leader</Label>
              <Select
                name="leader"
                value={editedTeam.leader}
                onValueChange={(value) => handleInputChange({ target: { name: "leader", value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editedTeam.leader || "Select leader"} />
                </SelectTrigger>
                <SelectContent>
                  {allMembers.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team Members */}
            <div>
              <Label>Team Members</Label>
              <ul className="mt-2 space-y-2">
                {editedTeam.teammembers.map((member) => (
                  <li key={member} className="flex items-center justify-between">
                    <span>{member}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add Member */}
            <div>
              <Label>Add Member</Label>
              <Select onValueChange={(value) => handleAddMember(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member to add" />
                </SelectTrigger>
                <SelectContent>
                  {allMembers
                    .filter((member) => !editedTeam.teammembers.includes(member))
                    .map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project */}
            <div>
              <Label>Project</Label>
              <Select
                name="project"
                value={editedTeam.project}
                onValueChange={(value) => handleInputChange({ target: { name: "project", value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editedTeam.project || "Select project"} />
                </SelectTrigger>
                <SelectContent>
                  {allProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Save Changes */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          // View Mode
          <div className="space-y-4">
            <div>
              <strong>Team Name:</strong> {team.name}
            </div>
            <div>
              <strong>Team Leader:</strong> {team.leader}
            </div>
            <div>
              <strong>Team Members:</strong>
              <ul className="mt-2 list-disc list-inside">
                {team.teammembers.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Project:</strong> {team.project}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Team
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}