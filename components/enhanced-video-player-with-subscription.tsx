"use client"

import { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SubscriptionCheckWrapper from "./subscription-check-wrapper"

interface Detection {
  id: string
  label: string
  confidence: number
  bbox: {
    x: number
    y: number
    width: number
    height: number
  }
  color: string
}

interface EnhancedVideoPlayerProps {
  videoUrl: string
  detections?: Detection[]
  showDetections?: boolean
  className?: string
  requiredTier?: "free" | "basic" | "pro" | "enterprise"
}

export default function EnhancedVideoPlayerWithSubscription({
  videoUrl,
  detections = [],
  showDetections = true,
  className,
  requiredTier = "basic", // Default to basic tier
}: EnhancedVideoPlayerProps) {
  const VideoPlayer = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(1)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [isDetectionsVisible, setIsDetectionsVisible] = useState(showDetections)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Handle play/pause
    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }

    // Handle mute toggle
    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
      }
    }

    // Handle volume change
    const handleVolumeChange = (value: number[]) => {
      const newVolume = value[0]
      if (videoRef.current) {
        videoRef.current.volume = newVolume
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
      }
    }

    // Handle time update
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime)
      }
    }

    // Handle loaded metadata
    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration)
      }
    }

    // Handle seek
    const handleSeek = (value: number[]) => {
      if (videoRef.current) {
        videoRef.current.currentTime = value[0]
        setCurrentTime(value[0])
      }
    }

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
      if (!containerRef.current) return

      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }

    // Update fullscreen state
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement)
      }

      document.addEventListener("fullscreenchange", handleFullscreenChange)
      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange)
      }
    }, [])

    // Handle controls visibility
    useEffect(() => {
      const handleMouseMove = () => {
        setShowControls(true)

        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }

        controlsTimeoutRef.current = setTimeout(() => {
          if (isPlaying) {
            setShowControls(false)
          }
        }, 3000)
      }

      const container = containerRef.current
      if (container) {
        container.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("mouseenter", handleMouseMove)
        container.addEventListener("mouseleave", () => {
          if (isPlaying) {
            setShowControls(false)
          }
        })
      }

      return () => {
        if (container) {
          container.removeEventListener("mousemove", handleMouseMove)
          container.removeEventListener("mouseenter", handleMouseMove)
          container.removeEventListener("mouseleave", () => {})
        }

        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
      }
    }, [isPlaying])

    // Draw detections on canvas
    useEffect(() => {
      if (!canvasRef.current || !videoRef.current || !isDetectionsVisible || detections.length === 0) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const drawDetections = () => {
        const video = videoRef.current
        if (!video) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw each detection
        detections.forEach((detection) => {
          const { x, y, width, height } = detection.bbox

          // Calculate actual coordinates based on video dimensions
          const actualX = x * canvas.width
          const actualY = y * canvas.height
          const actualWidth = width * canvas.width
          const actualHeight = height * canvas.height

          // Draw bounding box
          ctx.strokeStyle = detection.color
          ctx.lineWidth = 2
          ctx.strokeRect(actualX, actualY, actualWidth, actualHeight)

          // Draw label background
          ctx.fillStyle = detection.color
          const labelWidth = ctx.measureText(detection.label).width + 10
          ctx.fillRect(actualX, actualY - 20, labelWidth, 20)

          // Draw label text
          ctx.fillStyle = "#ffffff"
          ctx.font = "12px Arial"
          ctx.fillText(detection.label, actualX + 5, actualY - 5)
        })
      }

      // Draw on each animation frame
      let animationFrameId: number
      const animate = () => {
        drawDetections()
        animationFrameId = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }, [detections, isDetectionsVisible])

    // Format time (seconds to MM:SS)
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    // Skip forward/backward
    const skipForward = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration)
      }
    }

    const skipBackward = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0)
      }
    }

    return (
      <div ref={containerRef} className={cn("relative overflow-hidden rounded-lg bg-black group", className)}>
        <div className="aspect-video relative">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            crossOrigin="anonymous"
          />

          {/* Canvas overlay for detections */}
          <canvas
            ref={canvasRef}
            className={cn(
              "absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity",
              isDetectionsVisible ? "opacity-100" : "opacity-0",
            )}
          />

          {/* Play/pause overlay */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity",
              isPlaying ? "opacity-0" : "opacity-100",
            )}
          >
            <Button
              variant="secondary"
              size="icon"
              className="h-16 w-16 rounded-full opacity-90 hover:opacity-100"
              onClick={togglePlay}
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>

          {/* Controls overlay */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity",
              showControls || !isPlaying ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex items-center mb-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="mr-4"
              />
              <span className="text-xs text-white whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={skipBackward} className="text-white hover:bg-white/20">
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={skipForward} className="text-white hover:bg-white/20">
                  <SkipForward className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-1 ml-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>

                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {detections.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDetectionsVisible(!isDetectionsVisible)}
                    className={cn("text-xs text-white hover:bg-white/20", isDetectionsVisible ? "bg-white/20" : "")}
                  >
                    {isDetectionsVisible ? "Hide Objects" : "Show Objects"}
                  </Button>
                )}

                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SubscriptionCheckWrapper
      requiredTier={requiredTier}
      featureName="Video Playback"
      featureDescription={`Video playback is available on the ${requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan or higher. Upgrade your subscription to watch this video.`}
    >
      <VideoPlayer />
    </SubscriptionCheckWrapper>
  )
}
