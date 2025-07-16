"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export default function UsageStats() {
  // Mock data
  const usageData = {
    tier: "Pro",
    videoStorage: {
      used: 4.2,
      total: 10,
      unit: "GB",
    },
    videoCount: {
      used: 42,
      total: 100,
    },
    apiCalls: {
      used: 1250,
      total: 5000,
    },
    nextBillingDate: "Dec 15, 2023",
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Your current plan usage</CardDescription>
          </div>
          <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
            {usageData.tier} Plan
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Storage</span>
              <span className="text-sm text-muted-foreground">
                {usageData.videoStorage.used} / {usageData.videoStorage.total} {usageData.videoStorage.unit}
              </span>
            </div>
            <Progress value={(usageData.videoStorage.used / usageData.videoStorage.total) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Videos</span>
              <span className="text-sm text-muted-foreground">
                {usageData.videoCount.used} / {usageData.videoCount.total}
              </span>
            </div>
            <Progress value={(usageData.videoCount.used / usageData.videoCount.total) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">API Calls</span>
              <span className="text-sm text-muted-foreground">
                {usageData.apiCalls.used} / {usageData.apiCalls.total}
              </span>
            </div>
            <Progress value={(usageData.apiCalls.used / usageData.apiCalls.total) * 100} className="h-2" />
          </div>

          <div className="pt-2 border-t mt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Next billing date</p>
                <p className="text-xs text-muted-foreground">{usageData.nextBillingDate}</p>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <span>Upgrade</span>
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
