"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IntegrationForm } from "./integration-form"
import { Integration } from "@/types/integration"
import { useIntegration } from "@/contexts/IntegrationContext"

interface IntegrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  integration?: Integration
}

export function IntegrationDialog({
  open,
  onOpenChange,
  integration
}: IntegrationDialogProps) {
  const { createIntegration, updateIntegration } = useIntegration()

  const handleSubmit = async (data: any) => {
    try {
      if (integration) {
        await updateIntegration(integration.id, data)
      } else {
        await createIntegration(data)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save integration:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{integration ? 'Edit Integration' : 'Create Integration'}</DialogTitle>
          <DialogDescription>
            {integration
              ? 'Update the integration details below.'
              : 'Fill in the details below to create a new integration.'}
          </DialogDescription>
        </DialogHeader>
        <IntegrationForm
          integration={integration}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 