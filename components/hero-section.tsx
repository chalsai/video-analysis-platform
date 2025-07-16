"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false)
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/upload")
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-accent/20 pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>

      {/* Animated gradient orb */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/30 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-primary/20 to-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block">Intelligent</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                Video Analysis
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Unlock insights from your videos with our advanced AI-powered analysis platform. Detect objects, track
              movements, and generate comprehensive reports.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="rounded-full" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="rounded-full">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="about:blank"
                      title="Video Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=32&width=32&text=${i}`}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-medium">500+</span> users analyzing videos
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-[500px]">
              <div className="aspect-video rounded-xl overflow-hidden border shadow-xl">
                <img
                  src="/placeholder.svg?height=400&width=600&text=Video+Analysis+Demo"
                  alt="Video Analysis Platform"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating stats cards */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-lg p-3 shadow-lg border animate-bounce-slow">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Object Detection</div>
                    <div className="text-xs text-muted-foreground">99% accuracy</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-card rounded-lg p-3 shadow-lg border animate-bounce-slow delay-300">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Real-time Analysis</div>
                    <div className="text-xs text-muted-foreground">YOLOv8 powered</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
