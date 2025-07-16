"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Play, Clock, CheckCircle, AlertTriangle } from "lucide-react"
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
  },
  {
    id: "v2",
    title: "Retail Store Monitoring",
    status: "processing",
    createdAt: new Date(Date.now() - 3600000 * 5),
    duration: 180,
    objectCount: 0,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Retail",
  },
  {
    id: "v3",
    title: "Wildlife Camera Footage",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 24),
    duration: 300,
    objectCount: 18,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Wildlife",
  },
  {
    id: "v4",
    title: "Warehouse Security Feed",
    status: "failed",
    createdAt: new Date(Date.now() - 3600000 * 48),
    duration: 240,
    objectCount: 0,
    thumbnailUrl: "/placeholder.svg?height=180&width=320&text=Warehouse",
  },
]

export default function RecentVideos() {
  const [filter, setFilter] = useState("all")

  const filteredVideos = filter === "all" ? mockVideos : mockVideos.filter((video) => video.status === filter)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Videos</CardTitle>
            <CardDescription>Your recently uploaded and analyzed videos</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/videos">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="p-3">
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
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
