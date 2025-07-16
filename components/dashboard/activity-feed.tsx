"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CheckCircle, AlertTriangle, Share2, Download, Settings } from "lucide-react"

// Mock data for activity feed
const mockActivities = [
  {
    id: "a1",
    type: "upload",
    title: "Video uploaded",
    description: "You uploaded 'Downtown Traffic Analysis'",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: Upload,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
  },
  {
    id: "a2",
    type: "complete",
    title: "Analysis completed",
    description: "Analysis of 'Retail Store Footage' completed with 32 objects detected",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    icon: CheckCircle,
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
  },
  {
    id: "a3",
    type: "share",
    title: "Report shared",
    description: "You shared 'Wildlife Camera' report with team@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    icon: Share2,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100",
  },
  {
    id: "a4",
    type: "download",
    title: "Report downloaded",
    description: "You downloaded 'Parking Lot Security' report",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    icon: Download,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-100",
  },
  {
    id: "a5",
    type: "error",
    title: "Processing failed",
    description: "Analysis of 'Corrupted Video File' failed due to format issues",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    icon: AlertTriangle,
    iconColor: "text-red-500",
    iconBg: "bg-red-100",
  },
  {
    id: "a6",
    type: "settings",
    title: "Settings updated",
    description: "You updated your notification preferences",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    icon: Settings,
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
  },
]

export default function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className={`w-9 h-9 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
              </div>

              <div className="flex-grow">
                <h4 className="text-sm font-medium">{activity.title}</h4>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
