"use client"

import { useState } from "react"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface VideoSearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: any) => void
}

export default function VideoSearchFilter({ onSearch, onFilter }: VideoSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filters, setFilters] = useState({
    status: [] as string[],
    duration: [0, 120] as number[],
    dateRange: "all",
    objectTypes: [] as string[],
  })

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update active filters for display
    const activeFiltersList: string[] = []

    if (newFilters.status.length > 0) {
      activeFiltersList.push(`Status: ${newFilters.status.join(", ")}`)
    }

    if (newFilters.duration[0] > 0 || newFilters.duration[1] < 120) {
      activeFiltersList.push(`Duration: ${newFilters.duration[0]}-${newFilters.duration[1]} min`)
    }

    if (newFilters.dateRange !== "all") {
      activeFiltersList.push(`Date: ${newFilters.dateRange}`)
    }

    if (newFilters.objectTypes.length > 0) {
      activeFiltersList.push(`Objects: ${newFilters.objectTypes.join(", ")}`)
    }

    setActiveFilters(activeFiltersList)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      duration: [0, 120],
      dateRange: "all",
      objectTypes: [],
    })
    setActiveFilters([])
    onFilter({})
  }

  const removeFilter = (filter: string) => {
    const newActiveFilters = activeFilters.filter((f) => f !== filter)
    setActiveFilters(newActiveFilters)

    // Reset the corresponding filter
    if (filter.startsWith("Status:")) {
      handleFilterChange("status", [])
    } else if (filter.startsWith("Duration:")) {
      handleFilterChange("duration", [0, 120])
    } else if (filter.startsWith("Date:")) {
      handleFilterChange("dateRange", "all")
    } else if (filter.startsWith("Objects:")) {
      handleFilterChange("objectTypes", [])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos by title, objects, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                <span>Filter</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["completed", "processing", "failed"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => {
                            const newStatus = checked
                              ? [...filters.status, status]
                              : filters.status.filter((s) => s !== status)
                            handleFilterChange("status", newStatus)
                          }}
                        />
                        <Label htmlFor={`status-${status}`} className="capitalize">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Duration (minutes)</h4>
                  <Slider
                    value={filters.duration}
                    min={0}
                    max={120}
                    step={1}
                    onValueChange={(value) => handleFilterChange("duration", value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{filters.duration[0]} min</span>
                    <span>{filters.duration[1]} min</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Date Range</h4>
                  <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="year">This year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Object Types</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["person", "car", "dog", "bicycle", "cat", "bus"].map((object) => (
                      <div key={object} className="flex items-center space-x-2">
                        <Checkbox
                          id={`object-${object}`}
                          checked={filters.objectTypes.includes(object)}
                          onCheckedChange={(checked) => {
                            const newObjects = checked
                              ? [...filters.objectTypes, object]
                              : filters.objectTypes.filter((o) => o !== object)
                            handleFilterChange("objectTypes", newObjects)
                          }}
                        />
                        <Label htmlFor={`object-${object}`} className="capitalize">
                          {object}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="outline" className="flex items-center gap-1">
              {filter}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}

          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
