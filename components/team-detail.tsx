import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserMinus } from "lucide-react"

interface TeamDetailProps {
  team: { name: string; leader: string; members: string[]; projects: string[] }
  onClose: () => void
  onUpdate: (updatedTeam: { name: string; leader: string; members: string[]; projects: string[] }) => void
  allMembers: string[]
}

export function TeamDetail({ team, onClose, onUpdate, allMembers }: TeamDetailProps) {
  const [editMode, setEditMode] = useState(false)
  const [editedTeam, setEditedTeam] = useState(team)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedTeam((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = () => {
    onUpdate(editedTeam)
    setEditMode(false)
  }

  const handleAddMember = (member: string) => {
    if (!editedTeam.members.includes(member)) {
      setEditedTeam((prev) => ({
        ...prev,
        members: [...prev.members, member],
      }))
    }
  }

  const handleRemoveMember = (member: string) => {
    setEditedTeam((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== member),
    }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Team" : "Team Details"}</DialogTitle>
        </DialogHeader>
        {editMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdate()
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Team Name</Label>
              <Input id="name" name="name" value={editedTeam.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="leader">Team Leader</Label>
              <Select
                name="leader"
                onValueChange={(value) => handleInputChange({ target: { name: "leader", value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editedTeam.leader} />
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
            <div>
              <Label>Team Members</Label>
              <ul className="mt-2 space-y-2">
                {editedTeam.members.map((member: string) => (
                  <li key={member} className="flex items-center justify-between">
                    <span>{member}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMember(member)}>
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label>Add Member</Label>
              <Select onValueChange={handleAddMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member to add" />
                </SelectTrigger>
                <SelectContent>
                  {allMembers
                    .filter((member) => !editedTeam.members.includes(member))
                    .map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
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
                {team.members.map((member: string) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Projects:</strong>
              <ul className="mt-2 list-disc list-inside">
                {team.projects.map((project: string) => (
                  <li key={project}>{project}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setEditMode(true)}>Edit Team</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

