import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Clock, Tag, Share2 } from "lucide-react"

interface AnalysisStatsProps {
  analysis: {
    objectCount: number
    uniqueObjectClasses: number
    duration: number
    processingTime: number
  }
}

export default function AnalysisStats({ analysis }: AnalysisStatsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Analysis Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            icon={<Eye className="h-4 w-4 text-purple-500" />}
            label="Objects Detected"
            value={analysis.objectCount.toString()}
          />
          <StatItem
            icon={<Tag className="h-4 w-4 text-purple-500" />}
            label="Unique Classes"
            value={analysis.uniqueObjectClasses.toString()}
          />
          <StatItem
            icon={<Clock className="h-4 w-4 text-purple-500" />}
            label="Video Duration"
            value={formatTime(analysis.duration)}
          />
          <StatItem
            icon={<Share2 className="h-4 w-4 text-purple-500" />}
            label="Processing Time"
            value={`${analysis.processingTime.toFixed(1)}s`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center p-3 bg-muted/20 rounded-md">
      <div className="flex items-center justify-center mb-1">{icon}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}
