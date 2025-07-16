import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import EnhancedVideoPlayerWithSubscription from "@/components/enhanced-video-player-with-subscription"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample video URL - in a real implementation, this would be the URL of the uploaded video
const SAMPLE_VIDEO_URL = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

// Sample detections - in a real implementation, these would come from the YOLOv8 analysis
const SAMPLE_DETECTIONS = [
  {
    id: "1",
    label: "Rabbit",
    confidence: 0.92,
    bbox: { x: 0.2, y: 0.3, width: 0.1, height: 0.2 },
    color: "rgba(255, 0, 0, 0.8)",
  },
  {
    id: "2",
    label: "Squirrel",
    confidence: 0.87,
    bbox: { x: 0.6, y: 0.4, width: 0.15, height: 0.25 },
    color: "rgba(0, 255, 0, 0.8)",
  },
]

export default function DemoPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Video Analysis Demo</h1>
            <p className="text-muted-foreground mb-6">
              This demo shows how the video player and analysis features would work with real videos
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Sample Video with Object Detection</CardTitle>
                <CardDescription>
                  This is a sample video with simulated object detection. In a real implementation, the detections would
                  come from YOLOv8 analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedVideoPlayerWithSubscription
                  videoUrl={SAMPLE_VIDEO_URL}
                  detections={SAMPLE_DETECTIONS}
                  requiredTier="basic"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>Sample analysis results for the video</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary">
                  <TabsList className="mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="objects">Objects</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-sm text-muted-foreground">Objects Detected</div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-sm text-muted-foreground">Object Classes</div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">9:56</div>
                        <div className="text-sm text-muted-foreground">Video Duration</div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">89%</div>
                        <div className="text-sm text-muted-foreground">Avg. Confidence</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="objects">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Badge className="bg-red-500 mr-2">Rabbit</Badge>
                            <span className="text-sm text-muted-foreground">92% confidence</span>
                          </div>
                          <div className="text-sm">Appears: 3 times</div>
                        </div>
                        <div className="text-sm">
                          First appearance: 0:15 • Last appearance: 8:42 • Total screen time: 4:12
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Badge className="bg-green-500 mr-2">Squirrel</Badge>
                            <span className="text-sm text-muted-foreground">87% confidence</span>
                          </div>
                          <div className="text-sm">Appears: 2 times</div>
                        </div>
                        <div className="text-sm">
                          First appearance: 2:30 • Last appearance: 7:15 • Total screen time: 2:45
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline">
                    <div className="relative h-[200px] border-b border-l">
                      {/* Time markers */}
                      <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                        {Array.from({ length: 11 }).map((_, i) => (
                          <div key={i} className="relative" style={{ left: `${i * 10}%` }}>
                            <div className="absolute h-2 border-l" />
                            <div className="absolute top-3 transform -translate-x-1/2">
                              {Math.floor((i * 60) / 10)}:00
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Object appearances */}
                      <div className="mt-8 relative">
                        <div className="mb-3 relative h-6">
                          <div className="absolute left-0 text-xs font-medium truncate w-20">Rabbit</div>
                          <div
                            className="absolute h-4 rounded-sm bg-red-500 opacity-70 hover:opacity-100 cursor-pointer"
                            style={{ left: "calc(15% + 80px)", width: "25%" }}
                            title="Rabbit: 0:15 - 2:45"
                          />
                          <div
                            className="absolute h-4 rounded-sm bg-red-500 opacity-70 hover:opacity-100 cursor-pointer"
                            style={{ left: "calc(70% + 80px)", width: "20%" }}
                            title="Rabbit: 7:00 - 8:42"
                          />
                        </div>

                        <div className="mb-3 relative h-6">
                          <div className="absolute left-0 text-xs font-medium truncate w-20">Squirrel</div>
                          <div
                            className="absolute h-4 rounded-sm bg-green-500 opacity-70 hover:opacity-100 cursor-pointer"
                            style={{ left: "calc(25% + 80px)", width: "15%" }}
                            title="Squirrel: 2:30 - 4:00"
                          />
                          <div
                            className="absolute h-4 rounded-sm bg-green-500 opacity-70 hover:opacity-100 cursor-pointer"
                            style={{ left: "calc(60% + 80px)", width: "15%" }}
                            title="Squirrel: 6:00 - 7:15"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
