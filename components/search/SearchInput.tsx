'use client'

import * as React from 'react'
import { Input } from 'components/ui/input'
import { useSearch } from 'contexts/SearchContext'
import { useDebounce } from 'hooks/use-debounce'

export function SearchInput() {
  const { search, isLoading } = useSearch()
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    if (debouncedQuery) {
      search({
        query: debouncedQuery,
        page: 1,
        limit: 10,
      })
    }
  }, [debouncedQuery, search])

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
}
