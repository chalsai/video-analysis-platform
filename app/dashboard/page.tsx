import { Suspense } from "react"
import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import AnalyticsSummary from "@/components/dashboard/analytics-summary"
import RecentVideos from "@/components/dashboard/recent-videos"
import ProcessingQueue from "@/components/dashboard/processing-queue"
import UsageStats from "@/components/dashboard/usage-stats"
import ActivityFeed from "@/components/dashboard/activity-feed"

export const metadata: Metadata = {
  title: "Dashboard | Video Analysis Platform",
  description: "Monitor your video analysis metrics and recent activity",
}

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <Suspense fallback={<div className="h-48 bg-muted/30 rounded-lg animate-pulse"></div>}>
                <AnalyticsSummary />
              </Suspense>

              <Suspense fallback={<div className="h-96 bg-muted/30 rounded-lg animate-pulse"></div>}>
                <RecentVideos />
              </Suspense>

              <Suspense fallback={<div className="h-64 bg-muted/30 rounded-lg animate-pulse"></div>}>
                <ProcessingQueue />
              </Suspense>
            </div>

            <div className="space-y-6">
              <Suspense fallback={<div className="h-64 bg-muted/30 rounded-lg animate-pulse"></div>}>
                <UsageStats />
              </Suspense>

              <Suspense fallback={<div className="h-96 bg-muted/30 rounded-lg animate-pulse"></div>}>
                <ActivityFeed />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
