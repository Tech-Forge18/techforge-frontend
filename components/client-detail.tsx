import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Link } from "lucide-react"

interface ClientDetailProps {
  client: {
    id: number
    name: string
    project: string
    contactInfo: string
    status: string
  }
  onClose: () => void
  onUpdate: (updatedClient: any) => void
  projects: string[]
}

export function ClientDetail({ client, onClose, onUpdate, projects }: ClientDetailProps) {
  const [editMode, setEditMode] = useState(false)
  const [editedClient, setEditedClient] = useState(client)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedClient((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = () => {
    onUpdate(editedClient)
    setEditMode(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Client" : "Client Details"}</DialogTitle>
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
              <Label htmlFor="name">Client Name</Label>
              <Input id="name" name="name" value={editedClient.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="project">Project</Label>
              <Select
                name="project"
                onValueChange={(value) => handleInputChange({ target: { name: "project", value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editedClient.project} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contactInfo">Contact Info</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={editedClient.contactInfo}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                onValueChange={(value) => handleInputChange({ target: { name: "status", value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editedClient.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
              <strong>Client Name:</strong> {client.name}
            </div>
            <div>
              <strong>Project:</strong> {client.project}
            </div>
            <div>
              <strong>Contact Info:</strong> {client.contactInfo}
            </div>
            <div>
              <strong>Status:</strong> {client.status}
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditMode(true)}>Edit Client</Button>
              <Button variant="outline">
                <Link className="h-4 w-4 mr-2" />
                Link Project
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

