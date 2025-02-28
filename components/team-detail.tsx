import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserMinus } from "lucide-react";

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
      <DialogContent className="sm:max-w-md w-[90vw] rounded-xl bg-white dark:bg-gray-900 shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            Team Details
          </DialogTitle>
        </DialogHeader>
        {/* View Mode */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Team Name:</strong>
            <span className="text-gray-800 dark:text-gray-200 mt-1">{team.name}</span>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Team Leader:</strong>
            <span className="text-gray-800 dark:text-gray-200 mt-1">{team.leader}</span>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Team Members:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {team.teammembers.map((member, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Project:</strong>
            <span className="text-gray-800 dark:text-gray-200 mt-1">{team.project}</span>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}