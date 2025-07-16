"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, AlertCircle, FileVideo, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { uploadVideo } from "@/lib/actions"
import { motion, AnimatePresence } from "framer-motion"

export default function VideoUploader() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.includes("video/")) {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Please upload a video file")
      }
    }
  }, [])

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a video file to upload")
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Create a FormData object to track upload progress
      const formData = new FormData()
      formData.append("file", file)

      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progressPercent = Math.round((event.loaded / event.total) * 100)
          setProgress(progressPercent > 95 ? 95 : progressPercent) // Cap at 95% until processing completes
        }
      })

      // Create a promise to handle the upload
      const uploadPromise = new Promise<{ analysisId: string }>((resolve, reject) => {
        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              // Call the server action to process the uploaded file
              const result = await uploadVideo(file)
              resolve(result)
            } catch (err) {
              reject(err)
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }

        xhr.onerror = () => reject(new Error("Upload failed"))
      })

      // Execute the upload
      const result = await uploadPromise

      setProgress(100)

      // Redirect to analysis page
      setTimeout(() => {
        router.push(`/analysis/${result.analysisId}`)
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Failed to upload video. Please try again.")
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError(null)
  }

  return (
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
              MP4, MOV, or AVI (size limits apply based on your subscription)
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
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {progress < 100 ? "Uploading your video to our servers..." : "Processing your video for analysis..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full relative overflow-hidden group">
        <span className="relative z-10">{uploading ? "Uploading..." : "Upload Video for Analysis"}</span>
        <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
      </Button>
    </motion.div>
  )
}
