import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap, UserMinus } from "lucide-react"

interface TrainingDetailProps {
  training: {
    id: number
    name: string
    instructor: string
    duration: string
    completions: Array<{ employee: string; date: string; certified: boolean }>
  }
  onClose: () => void
  onUpdate: (updatedTraining: any) => void
  employees: string[]
}

export function TrainingDetail({ training, onClose, onUpdate, employees }: TrainingDetailProps) {
  const [editMode, setEditMode] = useState(false)
  const [editedTraining, setEditedTraining] = useState(training)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedTraining((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = () => {
    onUpdate(editedTraining)
    setEditMode(false)
  }

  const handleAddCompletion = (employee: string) => {
    if (!editedTraining.completions.some((c) => c.employee === employee)) {
      setEditedTraining((prev) => ({
        ...prev,
        completions: [
          ...prev.completions,
          { employee, date: new Date().toISOString().split("T")[0], certified: false },
        ],
      }))
    }
  }

  const handleRemoveCompletion = (employee: string) => {
    setEditedTraining((prev) => ({
      ...prev,
      completions: prev.completions.filter((c) => c.employee !== employee),
    }))
  }

  const handleToggleCertification = (employee: string) => {
    setEditedTraining((prev) => ({
      ...prev,
      completions: prev.completions.map((c) => (c.employee === employee ? { ...c, certified: !c.certified } : c)),
    }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Training" : "Training Details"}</DialogTitle>
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
              <Label htmlFor="name">Course Name</Label>
              <Input id="name" name="name" value={editedTraining.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input id="instructor" name="instructor" value={editedTraining.instructor} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" name="duration" value={editedTraining.duration} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Completions</Label>
              <ul className="mt-2 space-y-2">
                {editedTraining.completions.map((completion) => (
                  <li key={completion.employee} className="flex items-center justify-between">
                    <span>{completion.employee}</span>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={completion.certified}
                        onCheckedChange={() => handleToggleCertification(completion.employee)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCompletion(completion.employee)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label>Add Completion</Label>
              <Select onValueChange={handleAddCompletion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter((employee) => !editedTraining.completions.some((c) => c.employee === employee))
                    .map((employee) => (
                      <SelectItem key={employee} value={employee}>
                        {employee}
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
              <strong>Course Name:</strong> {training.name}
            </div>
            <div>
              <strong>Instructor:</strong> {training.instructor}
            </div>
            <div>
              <strong>Duration:</strong> {training.duration}
            </div>
            <div>
              <strong>Completions:</strong>
              <ul className="mt-2 space-y-2">
                {training.completions.map((completion) => (
                  <li key={completion.employee} className="flex items-center justify-between">
                    <span>{completion.employee}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{completion.date}</span>
                      {completion.certified && <GraduationCap className="h-4 w-4 text-green-500" />}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setEditMode(true)}>Edit Training</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

