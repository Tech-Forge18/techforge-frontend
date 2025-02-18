import type { ReactNode } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PageLayoutProps {
  title: string
  addButtonLabel: string
  children: ReactNode
  addForm: ReactNode
  onOpenChange: (open: boolean) => void
  isOpen: boolean
}

export function PageLayout({ title, addButtonLabel, children, addForm, onOpenChange, isOpen }: PageLayoutProps) {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{title}</h1>
          <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {addButtonLabel}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
                <DialogDescription>
                  Add a new {title.toLowerCase().slice(0, -1)} to your organization.
                </DialogDescription>
              </DialogHeader>
              {addForm}
            </DialogContent>
          </Dialog>
        </div>
        {children}
      </div>
    </MainLayout>
  )
}

