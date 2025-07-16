"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Upload, AlertCircle, FileVideo, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { uploadVideo, getUserSubscription } from "@/lib/actions"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedVideoUploaderProps {
  onSuccess?: (analysisId: string) => void
  onError?: (error: string) => void
}

export default function EnhancedVideoUploader({ onSuccess, onError }: EnhancedVideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [subscription, setSubscription] = useState<{ tier: string; maxSize: number; maxDuration: number } | null>(null)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [analysisId, setAnalysisId] = useState<string | null>(null)

  // Fetch user's subscription on component mount
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userSubscription = await getUserSubscription()
        setSubscription(userSubscription)
      } catch (error) {
        console.error("Error fetching subscription:", error)
        // Default to free tier if error
        setSubscription({ tier: "free", maxSize: 50, maxDuration: 2 })
      }
    }

    fetchSubscription()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)

    if (selectedFile) {
      validateFile(selectedFile)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile.type.includes("video/")) {
          setFile(droppedFile)
          setError(null)
          validateFile(droppedFile)
        } else {
          setError("Please upload a video file")
          if (onError) onError("Please upload a video file")
        }
      }
    },
    [onError],
  )

  const validateFile = (file: File) => {
    if (!subscription) return

    const fileSizeMB = file.size / (1024 * 1024)

    // For free tier users, if file is over limit but under 100MB, show upgrade dialog
    if (subscription.tier === "free" && fileSizeMB > subscription.maxSize && fileSizeMB <= 100) {
      setShowUpgradeDialog(true)
      return
    }

    // For all other cases, enforce the limit strictly
    if (fileSizeMB > subscription.maxSize) {
      const errorMsg = `File size exceeds your plan limit of ${subscription.maxSize}MB. Please upgrade your plan or upload a smaller file.`
      setError(errorMsg)
      if (onError) onError(errorMsg)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a video file to upload")
      if (onError) onError("Please select a video file to upload")
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // For demo purposes, simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prevProgress + Math.random() * 5
        })
      }, 300)

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Call the server action to process the uploaded file
      const result = await uploadVideo(file)

      // Clear the interval and set progress to 100%
      clearInterval(progressInterval)
      setProgress(100)
      setAnalysisId(result.analysisId)

      // Call the success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(result.analysisId)
        }, 500) // Small delay to show 100% progress
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to upload video. Please try again."
      setError(errorMsg)
      if (onError) onError(errorMsg)
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError(null)
  }

  const handleProceedAnyway = () => {
    setShowUpgradeDialog(false)
    handleUpload()
  }

  const handleUpgradeClick = () => {
    // In a real app, redirect to subscription page
    window.location.href = "/subscription"
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 border rounded-xl bg-card shadow-sm"
      >
        <div className="mb-4">
          <label
            htmlFor="video-upload"
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:bg-accent hover:border-muted-foreground/30"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-10 h-10 mb-3 ${dragActive ? "text-primary" : "text-muted-foreground/70"}`} />
              <p className="mb-2 text-sm text-center">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-center text-muted-foreground">
                MP4, MOV, or AVI (max {subscription?.maxSize || "..."} MB)
              </p>
            </div>
            <input
              id="video-upload"
              type="file"
              className="hidden"
              accept="video/mp4,video/quicktime,video/x-msvideo"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-4 bg-accent rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                    <FileVideo className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={uploading}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {uploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 space-y-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Uploading...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">
                {progress < 100 ? "Uploading your video to our servers..." : "Processing your video for analysis..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={handleUpload}
          disabled={!file || uploading || (!!error && error !== "File size exceeds your plan limit")}
          className="w-full relative overflow-hidden group"
        >
          <span className="relative z-10">{uploading ? "Uploading..." : "Upload Video for Analysis"}</span>
          <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
        </Button>
      </motion.div>

      {/* Upgrade Dialog for Free Tier Users */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Size Exceeds Free Plan Limit</DialogTitle>
            <DialogDescription>
              Your video is larger than the 50MB limit on the Free plan. Upgrade to continue with larger videos or
              proceed with this upload as a one-time exception.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/30 p-4 rounded-lg my-4">
            <h4 className="font-medium mb-2">Benefits of upgrading:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-green-500 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                </span>
                Upload videos up to 200MB (Basic) or 1GB (Pro)
              </li>
              <li className="flex items-start">
                <span className="bg-green-500 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                </span>
                Longer video duration limits
              </li>
              <li className="flex items-start">
                <span className="bg-green-500 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                </span>
                Advanced object detection and reporting features
              </li>
            </ul>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleProceedAnyway}>
              Proceed Anyway (Trial)
            </Button>
            <Button onClick={handleUpgradeClick} className="gap-1">
              Upgrade Now
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
