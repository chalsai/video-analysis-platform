"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Detection {
  objectClass: string
  appearances: {
    startTime: number
    endTime: number
    confidence: number
  }[]
}

interface ObjectTimelineProps {
  detections: Detection[]
  duration: number
}

export default function ObjectTimeline({ detections, duration }: ObjectTimelineProps) {
  const [selectedObject, setSelectedObject] = useState<string | null>(null)

  // Get unique object classes
  const objectClasses = [...new Set(detections.map((d) => d.objectClass))]

  // Filter detections based on selected object
  const filteredDetections = selectedObject ? detections.filter((d) => d.objectClass === selectedObject) : detections

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge
            variant={selectedObject === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedObject(null)}
          >
            All Objects
          </Badge>
          {objectClasses.map((objectClass) => (
            <Badge
              key={objectClass}
              variant={selectedObject === objectClass ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedObject(objectClass)}
            >
              {objectClass}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Visual Timeline</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="pt-4">
            <div className="relative h-[200px] border-b border-l">
              {/* Time markers */}
              <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="relative" style={{ left: `${i * 10}%` }}>
                    <div className="absolute h-2 border-l" />
                    <div className="absolute top-3 transform -translate-x-1/2">{formatTime(duration * (i / 10))}</div>
                  </div>
                ))}
              </div>

              {/* Object appearances */}
              <div className="mt-8 relative">
                {filteredDetections.map((detection, i) => (
                  <div key={i} className="mb-3 relative h-6">
                    <div className="absolute left-0 text-xs font-medium truncate w-20">{detection.objectClass}</div>

                    {detection.appearances.map((appearance, j) => {
                      const startPercent = (appearance.startTime / duration) * 100
                      const widthPercent = ((appearance.endTime - appearance.startTime) / duration) * 100

                      return (
                        <div
                          key={j}
                          className="absolute h-4 rounded-sm bg-purple-500 opacity-70 hover:opacity-100 cursor-pointer"
                          style={{
                            left: `calc(${startPercent}% + 80px)`,
                            width: `${widthPercent}%`,
                          }}
                          title={`${detection.objectClass}: ${formatTime(appearance.startTime)} - ${formatTime(appearance.endTime)}`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="pt-4">
            <div className="space-y-4">
              {filteredDetections.map((detection, i) => (
                <div key={i} className="border-b pb-3">
                  <h4 className="font-medium mb-2">{detection.objectClass}</h4>
                  <div className="space-y-1">
                    {detection.appearances.map((appearance, j) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span>
                          {formatTime(appearance.startTime)} - {formatTime(appearance.endTime)}
                        </span>
                        <span className="text-muted-foreground">
                          Confidence: {Math.round(appearance.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}
