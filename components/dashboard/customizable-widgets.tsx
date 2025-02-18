"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const availableWidgets = [
  { id: "stats", title: "Statistics" },
  { id: "tasks", title: "Recent Tasks" },
  { id: "calendar", title: "Calendar" },
  { id: "notifications", title: "Notifications" },
  { id: "team", title: "Team Members" },
]

export function CustomizableWidgets() {
  const [widgets, setWidgets] = useState([
    { id: "stats", title: "Statistics" },
    { id: "tasks", title: "Recent Tasks" },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const onDragEnd = (result) => {
    if (!result.destination) return

    const newWidgets = Array.from(widgets)
    const [reorderedItem] = newWidgets.splice(result.source.index, 1)
    newWidgets.splice(result.destination.index, 0, reorderedItem)

    setWidgets(newWidgets)
  }

  const handleAddWidget = (widgetId) => {
    const widgetToAdd = availableWidgets.find((w) => w.id === widgetId)
    if (widgetToAdd && !widgets.some((w) => w.id === widgetId)) {
      setWidgets([...widgets, widgetToAdd])
    }
  }

  const handleRemoveWidget = (widgetId) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cool-800 dark:text-cool-100">Dashboard Widgets</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-vibrant-500 hover:bg-vibrant-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Widget
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-cool-800 text-cool-900 dark:text-cool-100">
            <DialogHeader>
              <DialogTitle className="text-vibrant-600 dark:text-vibrant-400">Add Widgets</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {availableWidgets.map((widget) => (
                <div key={widget.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={widget.id}
                    checked={widgets.some((w) => w.id === widget.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleAddWidget(widget.id)
                      } else {
                        handleRemoveWidget(widget.id)
                      }
                    }}
                  />
                  <Label htmlFor={widget.id} className="text-cool-700 dark:text-cool-300">
                    {widget.title}
                  </Label>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Card className="bg-white dark:bg-cool-800 border-cool-200 dark:border-cool-700">
                        <CardHeader>
                          <CardTitle className="text-vibrant-600 dark:text-vibrant-400">{widget.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-cool-700 dark:text-cool-300">Widget content for {widget.title}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

