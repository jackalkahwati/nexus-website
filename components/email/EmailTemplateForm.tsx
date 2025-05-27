import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  variables: z.array(z.string()),
})

type TemplateFormData = z.infer<typeof templateSchema>

interface EmailTemplateFormProps {
  template?: {
    id: string
    name: string
    subject: string
    body: string
    variables: string[]
  }
  onSubmit: (data: TemplateFormData) => Promise<void>
}

export function EmailTemplateForm({ template, onSubmit }: EmailTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [variables, setVariables] = useState<string[]>(template?.variables || [])
  const [newVariable, setNewVariable] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: template || {
      name: '',
      subject: '',
      body: '',
      variables: [],
    },
  })

  const addVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      setVariables([...variables, newVariable])
      setNewVariable('')
    }
  }

  const removeVariable = (variable: string) => {
    setVariables(variables.filter((v) => v !== variable))
  }

  const handleFormSubmit = async (data: TemplateFormData) => {
    try {
      setIsSubmitting(true)
      data.variables = variables
      await onSubmit(data)
      toast({
        title: 'Success',
        description: 'Template saved successfully',
      })
    } catch (error) {
      console.error('Error saving template:', error)
      toast({
        title: 'Error',
        description: 'Failed to save template',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <Input {...register('subject')} />
          {errors.subject && (
            <p className="text-sm text-red-500">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body</label>
          <Textarea {...register('body')} rows={10} />
          {errors.body && (
            <p className="text-sm text-red-500">{errors.body.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Variables</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newVariable}
              onChange={(e) => setNewVariable(e.target.value)}
              placeholder="Add variable"
            />
            <Button type="button" onClick={addVariable}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {variables.map((variable) => (
              <div
                key={variable}
                className="flex items-center gap-1 bg-secondary p-1 rounded"
              >
                <span className="text-sm">{variable}</span>
                <button
                  type="button"
                  onClick={() => removeVariable(variable)}
                  className="text-sm text-destructive hover:text-destructive/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Template'}
        </Button>
      </form>
    </Card>
  )
} 