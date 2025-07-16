"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Pause, Play, X, AlertCircle, CheckCircle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for processing videos
const mockProcessingVideos = [
  {
    id: "p1",
    title: "Downtown Traffic Cam",
    progress: 75,
    thumbnailUrl: "/placeholder.svg?height=60&width=100&text=Traffic",
    estimatedTimeRemaining: "2 minutes",
    isPaused: false,
  },
  {
    id: "p2",
    title: "Office Entrance Monitoring",
    progress: 32,
    thumbnailUrl: "/placeholder.svg?height=60&width=100&text=Office",
    estimatedTimeRemaining: "5 minutes",
    isPaused: false,
  },
  {
    id: "p3",
    title: "Parking Lot Security",
    progress: 8,
    thumbnailUrl: "/placeholder.svg?height=60&width=100&text=Parking",
    estimatedTimeRemaining: "8 minutes",
    isPaused: true,
  },
]

export default function ProcessingQueue() {
  const [processingVideos, setProcessingVideos] = useState(mockProcessingVideos)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingVideos((prev) =>
        prev.map((video) => {
          if (video.isPaused) return video

          const newProgress = Math.min(video.progress + Math.random() * 5, 100)
          const isComplete = newProgress === 100

          if (isComplete) {
            // In a real app, you would handle completion differently
            return {
              ...video,
              progress: 100,
              estimatedTimeRemaining: "Complete",
            }
          }

          return {
            ...video,
            progress: newProgress,
            estimatedTimeRemaining:
              newProgress > 90
                ? "Less than a minute"
                : newProgress > 70
                  ? "1 minute"
                  : newProgress > 40
                    ? "3 minutes"
                    : "5+ minutes",
          }
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // In a real app, you would use Supabase Realtime to listen for updates
  useEffect(() => {
    // This is a placeholder for real Supabase Realtime implementation
    const setupRealtimeSubscription = async () => {
      try {
        // Example of how you would set up a real subscription
        // const channel = supabase
        //   .channel('video-processing')
        //   .on('postgres_changes', {
        //     event: 'UPDATE',
        //     schema: 'public',
        //     table: 'video_analyses',
        //     filter: 'status=eq.processing'
        //   }, (payload) => {
        //     // Update the processing videos state
        //   })
        //   .subscribe()
        // return () => {
        //   supabase.removeChannel(channel)
        // }
      } catch (error: any) {
        setError(error.message || "Failed to connect to real-time updates")
      }
    }

    setupRealtimeSubscription()
  }, [supabase])

  const togglePause = (id: string) => {
    setProcessingVideos((prev) =>
      prev.map((video) => (video.id === id ? { ...video, isPaused: !video.isPaused } : video)),
    )
  }

  const cancelProcessing = (id: string) => {
    setProcessingVideos((prev) => prev.filter((video) => video.id !== id))
  }

  if (processingVideos.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Processing Queue</CardTitle>
          <CardDescription>Videos currently being analyzed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Videos Processing</h3>
            <p className="text-sm text-muted-foreground">
              All your videos have been analyzed. Upload more videos to analyze.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Processing Queue</CardTitle>
        <CardDescription>Videos currently being analyzed</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {processingVideos.map((video) => (
            <div key={video.id} className="flex items-center gap-4">
              <div className="w-[100px] h-[60px] rounded overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnailUrl || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium">{video.title}</h4>
                  <span className="text-xs text-muted-foreground">{video.estimatedTimeRemaining}</span>
                </div>

                <Progress value={video.progress} className="h-2 mb-1" />

                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{Math.round(video.progress)}% complete</span>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePause(video.id)}>
                      {video.isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => cancelProcessing(video.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
