'use client'

import * as React from 'react'
import { useSearch } from 'contexts/SearchContext'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Pagination } from 'components/ui/pagination'

export function SearchResults() {
  const { isLoading, results, total, search } = useSearch()
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(total / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    search({
      query: '', // This will be filled by SearchInput
      page,
      limit: itemsPerPage,
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No results found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {total} results found
      </div>
      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{result.content}</p>
          </CardContent>
        </Card>
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
