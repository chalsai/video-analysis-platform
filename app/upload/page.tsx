"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import MockVideoUploader from "@/components/mock-video-uploader"
import SubscriptionBanner from "@/components/subscription-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getUserSubscription } from "@/lib/actions"
import ProfileCreationPrompt from "@/components/profile-creation-prompt"

export default function UploadPage() {
  const [error, setError] = useState<string | null>(null)
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)
  const router = useRouter()

  const handleUploadSuccess = (analysisId: string) => {
    // Check if user is on free trial and show profile prompt
    getUserSubscription().then((subscription) => {
      if (subscription.tier === "free") {
        setShowProfilePrompt(true)
      } else {
        router.push(`/analysis/${analysisId}`)
      }
    })
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleProfileComplete = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`)
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
            <p className="text-muted-foreground mb-6">Upload your video for AI-powered object detection and analysis</p>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Your Subscription</CardTitle>
                <CardDescription>Current plan limits and features</CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionBanner />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upload Video</CardTitle>
                <CardDescription>Select a video file to upload for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <MockVideoUploader />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />

      {/* Profile creation prompt for free trial users */}
      <ProfileCreationPrompt
        open={showProfilePrompt}
        onOpenChange={setShowProfilePrompt}
        onComplete={handleProfileComplete}
      />
    </>
  )
}
