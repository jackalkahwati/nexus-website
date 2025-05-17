"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Play, Download } from "lucide-react"
import { DatabaseConfig, DatabaseQueryResult, QueryField } from "@/types/integration"
import { useDatabase } from "@/hooks/use-database"

const queryFormSchema = z.object({
  query: z.string().min(1, "Query is required"),
})

type QueryFormValues = z.infer<typeof queryFormSchema>

interface DatabaseQueryProps {
  config: DatabaseConfig
}

interface QueryResultData {
  [key: string]: any
}

export function DatabaseQuery({ config }: DatabaseQueryProps) {
  const { toast } = useToast()
  const { executeQuery, isLoading } = useDatabase()
  const [queryResult, setQueryResult] = useState<DatabaseQueryResult | null>(null)

  const form = useForm<QueryFormValues>({
    resolver: zodResolver(queryFormSchema),
    defaultValues: {
      query: "",
    },
  })

  const onSubmit = async (values: QueryFormValues) => {
    const startTime = Date.now()
    
    try {
      const result = await executeQuery(config, values.query)
      
      setQueryResult({
        success: true,
        data: result as QueryResultData[],
        duration: Date.now() - startTime,
        rowCount: Array.isArray(result) ? result.length : 0,
        fields: Array.isArray(result) && result.length > 0 
          ? Object.keys(result[0]).map(key => ({
              name: key,
              type: typeof result[0][key],
            })) as QueryField[]
          : [],
      })
    } catch (error) {
      setQueryResult({
        success: false,
        error: error instanceof Error ? error.message : "Query execution failed",
        duration: Date.now() - startTime,
        data: [],
        rowCount: 0,
        fields: [],
      })
      
      toast({
        title: "Query Error",
        description: error instanceof Error ? error.message : "Query execution failed",
        variant: "destructive",
      })
    }
  }

  const downloadResults = () => {
    if (!queryResult?.data) return

    const csv = [
      // Headers
      queryResult.fields?.map(field => field.name).join(','),
      // Data rows
      ...queryResult.data.map(row =>
        Object.values(row)
          .map(value => JSON.stringify(value))
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `query_results_${new Date().toISOString()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SQL Query</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="SELECT * FROM users LIMIT 10;"
                    className="font-mono"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter your SQL query. Be careful with destructive operations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-24"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </>
              )}
            </Button>

            {queryResult?.success && queryResult.data && (
              <Button
                type="button"
                variant="outline"
                onClick={downloadResults}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </form>
      </Form>

      {queryResult && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              {queryResult.success
                ? `${queryResult.rowCount} rows in ${queryResult.duration}ms`
                : "Query failed"}
            </span>
          </div>

          <ScrollArea className="h-[400px] rounded-md border">
            {queryResult.success ? (
              queryResult.data && queryResult.data.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {queryResult.fields?.map((field) => (
                        <th
                          key={field.name}
                          className="p-2 text-left text-sm font-medium"
                        >
                          {field.name}
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({field.type})
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.data.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        {Object.values(row).map((value, j) => (
                          <td
                            key={j}
                            className="p-2 text-sm"
                          >
                            {JSON.stringify(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No results
                </div>
              )
            ) : (
              <div className="p-4 text-sm text-red-500">
                {queryResult.error}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
} 