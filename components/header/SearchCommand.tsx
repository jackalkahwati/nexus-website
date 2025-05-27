"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DialogProps } from "@radix-ui/react-dialog"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface SearchResult {
  title: string
  type: string
  href: string
}

export function SearchCommand({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runSearch = React.useCallback(async (search: string) => {
    // Here you would typically make an API call to search your application
    // For now, we'll return some mock results
    const mockResults: SearchResult[] = [
      { title: "Dashboard", type: "Page", href: "/dashboard" },
      { title: "Fleet Management", type: "Page", href: "/dashboard/fleet" },
      { title: "Analytics", type: "Page", href: "/dashboard/analytics" },
      { title: "Settings", type: "Page", href: "/dashboard/settings" },
      { title: "Maintenance Schedule", type: "Page", href: "/dashboard/maintenance" },
      { title: "API Documentation", type: "Doc", href: "/docs/api" },
      { title: "Getting Started", type: "Doc", href: "/docs/getting-started" },
    ].filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
    )
    
    setResults(mockResults)
  }, [])

  React.useEffect(() => {
    if (query.length > 0) {
      runSearch(query)
    }
  }, [query, runSearch])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
        {...props}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type to search..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Pages">
                {results
                  .filter(result => result.type === "Page")
                  .map(result => (
                    <CommandItem
                      key={result.href}
                      onSelect={() => {
                        router.push(result.href)
                        setOpen(false)
                      }}
                    >
                      {result.title}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Documentation">
                {results
                  .filter(result => result.type === "Doc")
                  .map(result => (
                    <CommandItem
                      key={result.href}
                      onSelect={() => {
                        router.push(result.href)
                        setOpen(false)
                      }}
                    >
                      {result.title}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
