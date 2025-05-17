import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { EmailTemplateForm } from './EmailTemplateForm'
import { toast } from '@/components/ui/use-toast'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
}

interface EmailTemplateListProps {
  templates: EmailTemplate[]
  onCreateTemplate: (template: Omit<EmailTemplate, 'id'>) => Promise<void>
  onUpdateTemplate: (
    id: string,
    template: Partial<Omit<EmailTemplate, 'id'>>
  ) => Promise<void>
  onDeleteTemplate: (id: string) => Promise<void>
}

export function EmailTemplateList({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}: EmailTemplateListProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(
    null
  )
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      await onDeleteTemplate(id)
      setTemplateToDelete(null)
      setIsDeleteDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting template:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
            </DialogHeader>
            <EmailTemplateForm onSubmit={onCreateTemplate} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Variables</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.subject}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="bg-secondary px-2 py-1 rounded text-sm"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Email Template</DialogTitle>
                      </DialogHeader>
                      <EmailTemplateForm
                        template={selectedTemplate!}
                        onSubmit={async (data) => {
                          await onUpdateTemplate(template.id, data)
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={isDeleteDialogOpen && templateToDelete === template.id}
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open)
                      if (!open) setTemplateToDelete(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setTemplateToDelete(template.id)}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Template</DialogTitle>
                      </DialogHeader>
                      <p>Are you sure you want to delete this template?</p>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsDeleteDialogOpen(false)
                            setTemplateToDelete(null)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(template.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 