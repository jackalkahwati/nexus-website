"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MaintenanceForm } from "./maintenance-form"
import { MaintenanceTask } from "@/types/maintenance"
import { useMaintenance } from "@/contexts/MaintenanceContext"

interface MaintenanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: MaintenanceTask
}

export function MaintenanceDialog({
  open,
  onOpenChange,
  task
}: MaintenanceDialogProps) {
  const { createTask, updateTask } = useMaintenance()

  const handleSubmit = async (data: any) => {
    try {
      if (task) {
        await updateTask(task.id, {
          ...data,
          cost: data.estimatedCost,
          notes: data.notes ? data.notes.split('\n') : undefined
        })
      } else {
        await createTask({
          ...data,
          cost: data.estimatedCost,
          status: 'scheduled',
          notes: data.notes ? data.notes.split('\n') : undefined
        })
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save maintenance task:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Maintenance Task' : 'Create Maintenance Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update the maintenance task details below.'
              : 'Fill in the details below to create a new maintenance task.'}
          </DialogDescription>
        </DialogHeader>
        <MaintenanceForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 