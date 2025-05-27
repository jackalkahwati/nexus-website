"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'

interface SearchResult {
  id: string
  type: string
  name: string
  description: string
  path: string
  updatedAt: string
}

// Mock data - replace with actual API call
const mockData: SearchResult[] = [
  {
    id: '1',
    type: 'User',
    name: 'John Doe',
    description: 'Administrator account',
    path: '/dashboard/users/1',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    type: 'Permission',
    name: 'Create User',
    description: 'Permission to create new users',
    path: '/dashboard/users/permissions/2',
    updatedAt: '2024-03-19',
  },
  {
    id: '3',
    type: 'Role',
    name: 'Editor',
    description: 'Can edit and publish content',
    path: '/dashboard/users/roles/3',
    updatedAt: '2024-03-18',
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true)
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Filter mock data based on search query
        const filteredResults = mockData.filter(item => 
          item.name.toLowerCase().includes(query?.toLowerCase() || '') ||
          item.description.toLowerCase().includes(query?.toLowerCase() || '') ||
          item.type.toLowerCase().includes(query?.toLowerCase() || '')
        )
        
        setResults(filteredResults)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          {results.length === 0
            ? 'No results found'
            : `Found ${results.length} result${results.length === 1 ? '' : 's'}`}
          {query ? ` for "${query}"` : ''}
        </h1>
        {results.length > 0 && (
          <DataTable
            columns={columns}
            data={results}
          />
        )}
      </div>
    </div>
  )
}
