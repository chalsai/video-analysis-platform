"use client"

import { useState } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import VideoSearchFilter from "@/components/video-search-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Play, MoreHorizontal, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mockVideos = [
  {
    id: "v1",
    title: "Traffic Intersection Analysis",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 2),
    duration: 120,
    objectCount: 42,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Traffic",
    objects: ["car", "person", "bicycle", "bus"],
  },
  {
    id: "v2",
    title: "Retail Store Monitoring",
    status: "processing",
    createdAt: new Date(Date.now() - 3600000 * 5),
    duration: 180,
    objectCount: 0,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Retail",
    objects: ["person"],
  },
  {
    id: "v3",
    title: "Wildlife Camera Footage",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 24),
    duration: 300,
    objectCount: 18,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Wildlife",
    objects: ["dog", "cat", "person"],
  },
  {
    id: "v4",
    title: "Warehouse Security Feed",
    status: "failed",
    createdAt: new Date(Date.now() - 3600000 * 48),
    duration: 240,
    objectCount: 0,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Warehouse",
    objects: [],
  },
  {
    id: "v5",
    title: "Office Entrance Camera",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 72),
    duration: 150,
    objectCount: 27,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Office",
    objects: ["person"],
  },
  {
    id: "v6",
    title: "Parking Lot Surveillance",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 96),
    duration: 180,
    objectCount: 35,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Parking",
    objects: ["car", "person"],
  },
]

export default function VideosPage() {
  const [videos, setVideos] = useState(mockVideos)
  const [filteredVideos, setFilteredVideos] = useState(mockVideos)

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredVideos(videos)
      return
    }

    const lowerQuery = query.toLowerCase()
    const results = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(lowerQuery) ||
        video.objects.some((obj) => obj.toLowerCase().includes(lowerQuery)),
    )

    setFilteredVideos(results)
  }

  const handleFilter = (filters: any) => {
    let results = [...videos]

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      results = results.filter((video) => filters.status.includes(video.status))
    }

    // Filter by duration
    if (filters.duration) {
      const [min, max] = filters.duration
      results = results.filter((video) => video.duration >= min * 60 && video.duration <= max * 60)
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = new Date()
      const startDate = new Date()

      switch (filters.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0)
          break
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      results = results.filter((video) => video.createdAt >= startDate)
    }

    // Filter by object types
    if (filters.objectTypes && filters.objectTypes.length > 0) {
      results = results.filter((video) => filters.objectTypes.some((obj: string) => video.objects.includes(obj)))
    }

    setFilteredVideos(results)
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Videos</h1>
              <p className="text-muted-foreground mt-1">Browse and manage your uploaded videos</p>
            </div>

            <Button asChild>
              <a href="/">Upload New Video</a>
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <VideoSearchFilter onSearch={handleSearch} onFilter={handleFilter} />
            </CardContent>
          </Card>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No videos found</h3>
              <p className="text-muted-foreground">
                No videos match your search criteria. Try adjusting your filters or upload a new video.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      src={video.thumbnailUrl || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="secondary" className="rounded-full">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    </div>
                    <Badge
                      className={`absolute top-2 right-2 ${
                        video.status === "completed"
                          ? "bg-green-500"
                          : video.status === "processing"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    >
                      {video.status}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{video.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Analysis</DropdownMenuItem>
                          <DropdownMenuItem>Download Report</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <div className="flex items-center mr-3">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                        </span>
                      </div>

                      {video.status === "completed" && (
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span>{video.objectCount} objects</span>
                        </div>
                      )}

                      {video.status === "failed" && (
                        <div className="flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                          <span>Processing failed</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(video.createdAt, { addSuffix: true })}
                    </div>

                    {video.objects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {video.objects.slice(0, 3).map((obj) => (
                          <Badge key={obj} variant="outline" className="text-xs">
                            {obj}
                          </Badge>
                        ))}
                        {video.objects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{video.objects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
