'use client'

import * as React from 'react'
import { SearchOptions, SearchResult, SearchResponse } from 'lib/services/search'
import { useToast } from 'components/ui/use-toast'

interface SearchContextType {
  isLoading: boolean
  results: SearchResult[]
  total: number
  aggregations: Record<string, any>
  filters: Record<string, string[]>
  setFilters: (filters: Record<string, string[]>) => void
  search: (options: SearchOptions) => Promise<void>
  clearResults: () => void
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [total, setTotal] = React.useState(0)
  const [aggregations, setAggregations] = React.useState<Record<string, any>>({})
  const [filters, setFilters] = React.useState<Record<string, string[]>>({})
  const { toast } = useToast()

  const search = React.useCallback(async (options: SearchOptions) => {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams({
        q: options.query,
        page: options.page?.toString() || '1',
        limit: options.limit?.toString() || '10',
        ...(options.sort && { sort: options.sort }),
        ...(options.order && { order: options.order }),
      })

      // Add filters to search params
      Object.entries(filters).forEach(([key, values]) => {
        values.forEach(value => {
          searchParams.append(key, value)
        })
      })

      const response = await fetch('/api/search?' + searchParams.toString())

      if (!response.ok) {
        throw new Error('Search request failed')
      }

      const data: SearchResponse<SearchResult> = await response.json()
      setResults(data.hits)
      setTotal(data.total)
      setAggregations(data.aggregations || {})
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: 'Error',
        description: 'Failed to perform search',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, toast])

  const clearResults = React.useCallback(() => {
    setResults([])
    setTotal(0)
    setAggregations({})
    setFilters({})
  }, [])

  const value = React.useMemo(
    () => ({
      isLoading,
      results,
      total,
      aggregations,
      filters,
      setFilters,
      search,
      clearResults,
    }),
    [isLoading, results, total, aggregations, filters, setFilters, search, clearResults]
  )

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const context = React.useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
