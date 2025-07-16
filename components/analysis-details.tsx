import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"
import ReportDownloadButton from "./report-download-button"

interface AnalysisDetailsProps {
  analysis: {
    id: string
    title: string
    createdAt: Date
    status: string
    detections: {
      objectClass: string
      appearances: {
        startTime: number
        endTime: number
        confidence: number
      }[]
    }[]
  }
}

export default function AnalysisDetails({ analysis }: AnalysisDetailsProps) {
  // Group detections by object class and count occurrences
  const objectSummary = analysis.detections.reduce<Record<string, number>>((acc, detection) => {
    acc[detection.objectClass] = detection.appearances.length
    return acc
  }, {})

  // Sort by count (descending)
  const sortedObjects = Object.entries(objectSummary).sort(([, countA], [, countB]) => countB - countA)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Analysis Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Object Summary</h4>
            <div className="space-y-2">
              {sortedObjects.map(([objectClass, count]) => (
                <div key={objectClass} className="flex justify-between items-center">
                  <span className="text-sm">{objectClass}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Export & Share</h4>
            <div className="flex gap-2">
              <ReportDownloadButton
                analysisId={analysis.id}
                variant="outline"
                size="sm"
                className="w-full"
                requiredTier="basic"
              />
              <Button variant="outline" size="sm" className="w-full">
                <Share className="h-4 w-4 mr-2" />
                Share Analysis
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
