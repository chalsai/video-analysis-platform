import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnalysisDetails from "@/components/analysis-details"
import ObjectTimeline from "@/components/object-timeline"
import VideoPlayer from "@/components/video-player"
import AnalysisStats from "@/components/analysis-stats"
import { getAnalysisById } from "@/lib/actions"

interface AnalysisPageProps {
  params: {
    id: string
  }
}

export default function AnalysisPage({ params }: AnalysisPageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center mb-6 text-sm font-medium">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Suspense fallback={<div className="h-96 bg-muted/30 rounded-lg animate-pulse"></div>}>
        <AnalysisContent id={params.id} />
      </Suspense>
    </main>
  )
}

async function AnalysisContent({ id }: { id: string }) {
  const analysis = await getAnalysisById(id)

  if (!analysis) {
    return (
      <div className="p-8 text-center border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Analysis not found or still processing.</p>
        <Button asChild className="mt-4">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{analysis.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <VideoPlayer videoUrl={analysis.videoUrl} />

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Object Timeline</h2>
            <ObjectTimeline detections={analysis.detections} duration={analysis.duration} />
          </div>
        </div>

        <div className="space-y-6">
          <AnalysisStats analysis={analysis} />
          <AnalysisDetails analysis={analysis} />
        </div>
      </div>
    </div>
  )
}
