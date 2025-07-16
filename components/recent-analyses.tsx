import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecentAnalyses } from "@/lib/actions"

interface Analysis {
  id: string
  title: string
  status: "processing" | "completed" | "failed"
  createdAt: Date
  objectCount: number
  thumbnailUrl: string
}

export default async function RecentAnalyses() {
  // In a real app, this would fetch from your API
  const analyses = await getRecentAnalyses()

  if (analyses.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No recent analyses found. Upload a video to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {analyses.map((analysis) => (
        <Link href={`/analysis/${analysis.id}`} key={analysis.id}>
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${analysis.thumbnailUrl})` }}
              />
              <Badge
                className={`absolute top-2 right-2 ${
                  analysis.status === "completed"
                    ? "bg-green-500"
                    : analysis.status === "processing"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              >
                {analysis.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium truncate">{analysis.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {analysis.status === "completed"
                  ? `${analysis.objectCount} objects detected`
                  : "Analysis in progress..."}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
              {formatDistanceToNow(analysis.createdAt, { addSuffix: true })}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
