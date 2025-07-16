import { Suspense } from "react"
import SubscriptionBanner from "@/components/subscription-banner"
import RecentAnalyses from "@/components/recent-analyses"
import HeroSection from "@/components/hero-section"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Shield, BarChart } from "lucide-react"
import MockVideoUploader from "@/components/mock-video-uploader"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <HeroSection />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full">
                Powerful Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Upload and Analyze Your Videos</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Our platform uses advanced AI to detect objects, track movements, and generate comprehensive reports
                from your videos.
              </p>
            </div>

            <Tabs defaultValue="upload" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upload">Upload Video</TabsTrigger>
                <TabsTrigger value="recent">Recent Analyses</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Video for Analysis</CardTitle>
                    <CardDescription>Upload your video file to start the analysis process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SubscriptionBanner />
                    <div className="mt-6">
                      <MockVideoUploader />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recent" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Recent Analyses</CardTitle>
                    <CardDescription>View and manage your recently analyzed videos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="p-4 border rounded-md">Loading recent analyses...</div>}>
                      <RecentAnalyses />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Advanced Video Analysis</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Our platform offers state-of-the-art video analysis capabilities powered by YOLOv8
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                {
                  icon: Zap,
                  title: "Fast Processing",
                  description: "Analyze videos quickly with our optimized processing pipeline",
                },
                {
                  icon: CheckCircle,
                  title: "Accurate Detection",
                  description: "Identify objects with high precision using YOLOv8 technology",
                },
                {
                  icon: Shield,
                  title: "Secure Storage",
                  description: "Your videos and analysis results are stored securely",
                },
                {
                  icon: BarChart,
                  title: "Detailed Reports",
                  description: "Get comprehensive reports with visualizations and insights",
                },
              ].map((feature, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
