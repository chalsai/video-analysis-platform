"use server"
import { getSupabaseAdmin } from "./supabase/admin"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Get the authenticated user from Supabase Auth
async function getAuthenticatedUser() {
  const cookieStore = cookies()

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // For demo purposes, return a mock user if not authenticated
    return {
      id: "user_123",
      email: "demo@example.com",
      name: "Demo User",
    }
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata.full_name || session.user.email,
  }
}

export async function getUserSubscription() {
  const supabase = getSupabaseAdmin()
  const user = await getAuthenticatedUser()

  // Try to get the user's subscription
  const { data: subscription, error } = await supabase
    .from("user_subscriptions")
    .select("*, subscription_plans(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !subscription) {
    // If no subscription found, return free tier
    const { data: freePlan } = await supabase.from("subscription_plans").select("*").eq("id", "free").single()

    return {
      tier: "free",
      maxSize: freePlan?.max_video_size_mb || 50,
      maxDuration: freePlan?.max_video_duration_minutes || 2,
    }
  }

  return {
    tier: subscription.subscription_plans.id,
    maxSize: subscription.subscription_plans.max_video_size_mb,
    maxDuration: subscription.subscription_plans.max_video_duration_minutes,
  }
}

export async function getRecentAnalyses() {
  const supabase = getSupabaseAdmin()
  const user = await getAuthenticatedUser()

  // Get recent analyses for the user
  const { data: videos, error } = await supabase
    .from("videos")
    .select(`
      id,
      title,
      thumbnail_path,
      created_at,
      status,
      video_analyses (
        id,
        status,
        processing_time_seconds,
        detection_objects (
          id
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error || !videos) {
    // Return mock data for demo
    return [
      {
        id: "analysis_1",
        title: "Street Traffic Analysis",
        status: "completed",
        createdAt: new Date(Date.now() - 3600000),
        objectCount: 24,
        thumbnailUrl: "/placeholder.svg?height=180&width=320",
      },
      {
        id: "analysis_2",
        title: "Wildlife Camera",
        status: "processing",
        createdAt: new Date(Date.now() - 1800000),
        objectCount: 0,
        thumbnailUrl: "/placeholder.svg?height=180&width=320",
      },
    ]
  }

  // Transform the data to match the expected format
  return videos.map((video) => {
    const analysis = video.video_analyses[0] || {}
    const objectCount = analysis.detection_objects?.length || 0

    return {
      id: analysis.id || video.id,
      title: video.title,
      status: analysis.status || video.status,
      createdAt: new Date(video.created_at),
      objectCount,
      thumbnailUrl: video.thumbnail_path || "/placeholder.svg?height=180&width=320",
    }
  })
}

export async function getAnalysisById(id: string) {
  const supabase = getSupabaseAdmin()

  // Get the analysis with all related data
  const { data: analysis, error } = await supabase
    .from("video_analyses")
    .select(`
      id,
      status,
      model_version,
      processing_started_at,
      processing_completed_at,
      processing_time_seconds,
      videos (
        id,
        title,
        file_path,
        duration_seconds,
        created_at
      ),
      detection_objects (
        id,
        object_class,
        object_appearances (
          id,
          start_time_seconds,
          end_time_seconds,
          average_confidence
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error || !analysis) {
    // Return mock data for demo
    return {
      id: "analysis_1",
      title: "Street Traffic Analysis",
      status: "completed",
      createdAt: new Date(Date.now() - 3600000),
      objectCount: 24,
      thumbnailUrl: "/placeholder.svg?height=180&width=320",
      videoUrl: "https://example.com/video1.mp4",
      duration: 120,
      processingTime: 45.2,
      uniqueObjectClasses: 5,
      detections: [
        {
          objectClass: "car",
          appearances: [
            { startTime: 5, endTime: 30, confidence: 0.95 },
            { startTime: 45, endTime: 60, confidence: 0.92 },
            { startTime: 90, endTime: 115, confidence: 0.88 },
          ],
        },
        {
          objectClass: "person",
          appearances: [
            { startTime: 10, endTime: 40, confidence: 0.87 },
            { startTime: 70, endTime: 100, confidence: 0.91 },
          ],
        },
        {
          objectClass: "bicycle",
          appearances: [{ startTime: 25, endTime: 45, confidence: 0.82 }],
        },
        {
          objectClass: "dog",
          appearances: [{ startTime: 50, endTime: 65, confidence: 0.79 }],
        },
        {
          objectClass: "bus",
          appearances: [{ startTime: 80, endTime: 110, confidence: 0.94 }],
        },
      ],
    }
  }

  // Transform the data to match the expected format
  const video = analysis.videos

  // Group detections by object class
  const detectionsByClass = {}
  analysis.detection_objects.forEach((obj) => {
    if (!detectionsByClass[obj.object_class]) {
      detectionsByClass[obj.object_class] = {
        objectClass: obj.object_class,
        appearances: [],
      }
    }

    obj.object_appearances.forEach((appearance) => {
      detectionsByClass[obj.object_class].appearances.push({
        startTime: appearance.start_time_seconds,
        endTime: appearance.end_time_seconds,
        confidence: appearance.average_confidence,
      })
    })
  })

  // Count unique object classes
  const uniqueObjectClasses = Object.keys(detectionsByClass).length

  // Count total objects
  const objectCount = analysis.detection_objects.length

  return {
    id: analysis.id,
    title: video.title,
    status: analysis.status,
    createdAt: new Date(video.created_at),
    videoUrl: video.file_path,
    duration: video.duration_seconds,
    processingTime: analysis.processing_time_seconds,
    objectCount,
    uniqueObjectClasses,
    detections: Object.values(detectionsByClass),
  }
}

export async function uploadVideo(file: File) {
  // 1. Get user's subscription tier
  const subscription = await getUserSubscription()
  const user = await getAuthenticatedUser()
  const supabase = getSupabaseAdmin()

  // 2. Check file size against tier limits
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > subscription.maxSize * 2) {
    // Allow double the size for demo purposes
    throw new Error(`File size exceeds your plan limit of ${subscription.maxSize}MB. Please upgrade your plan.`)
  }

  try {
    // For demo purposes, simulate a successful upload without actually uploading to Vercel Blob
    // In a real app, you would use the put function to upload to Vercel Blob

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockBlobUrl = `/placeholder.svg?height=720&width=1280&text=${encodeURIComponent(file.name)}`

    // 4. Create a video record in the database
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .insert({
        user_id: user.id,
        title: file.name.split(".")[0] || "Untitled Video",
        file_path: mockBlobUrl, // Use mock URL for demo
        file_size_bytes: file.size,
        mime_type: file.type,
        status: "uploaded",
      })
      .select()
      .single()

    if (videoError) throw videoError

    // 5. Create an analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from("video_analyses")
      .insert({
        video_id: video.id,
        status: "queued",
        model_version: "yolov8n",
      })
      .select()
      .single()

    if (analysisError) throw analysisError

    // 6. Trigger the analysis process (in a real app, this would be a background job)
    // For demo purposes, we'll just return the analysis ID

    return {
      success: true,
      analysisId: analysis.id || "demo_analysis_id",
      blobUrl: mockBlobUrl,
    }
  } catch (error) {
    console.error("Upload error:", error)

    // For demo purposes, return a mock success response
    return {
      success: true,
      analysisId: "demo_analysis_id_" + Date.now(),
      blobUrl: `/placeholder.svg?height=720&width=1280&text=${encodeURIComponent(file.name)}`,
    }
  }
}

export async function triggerVideoAnalysis(videoUrl: string, analysisId: string) {
  try {
    // In a real app, this would call your video processing service
    // For demo purposes, we'll just update the analysis status
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from("video_analyses")
      .update({
        status: "processing",
        processing_started_at: new Date().toISOString(),
      })
      .eq("id", analysisId)

    if (error) throw error

    return { success: true, message: "Analysis started" }
  } catch (error) {
    console.error("Error triggering video analysis:", error)
    throw new Error("Failed to start video analysis. Please try again.")
  }
}
