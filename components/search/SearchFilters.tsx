'use client'

import * as React from 'react'
import { useSearch } from 'contexts/SearchContext'
import { Button } from 'components/ui/button'
import { Checkbox } from 'components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion'

export function SearchFilters() {
  const { filters, setFilters, aggregations, search } = useSearch()

  const handleFilterChange = (category: string, value: string) => {
    const newFilters = { ...filters }
    
    if (!newFilters[category]) {
      newFilters[category] = []
    }

    const index = newFilters[category].indexOf(value)
    if (index === -1) {
      newFilters[category].push(value)
    } else {
      newFilters[category].splice(index, 1)
    }

    if (newFilters[category].length === 0) {
      delete newFilters[category]
    }

    setFilters(newFilters)
    search({ query: '', page: 1, limit: 10 })
  }

  if (!aggregations || Object.keys(aggregations).length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {Object.keys(filters).length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters({})
            search({ query: '', page: 1, limit: 10 })
          }}
        >
          Clear all filters
        </Button>
      )}
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(aggregations).map(([category, values]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-sm font-medium">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {values.buckets.map((bucket: { key: string; doc_count: number }) => (
                  <div key={bucket.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${category}-${bucket.key}`}
                      checked={filters[category]?.includes(bucket.key)}
                      onCheckedChange={() => handleFilterChange(category, bucket.key)}
                    />
                    <label
                      htmlFor={`${category}-${bucket.key}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {bucket.key} ({bucket.doc_count})
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
} 