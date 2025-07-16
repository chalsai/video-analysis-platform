"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getUserSubscription } from "@/lib/actions"
import { motion } from "framer-motion"

type SubscriptionTier = "free" | "basic" | "pro" | "enterprise"

interface SubscriptionDetails {
  tier: SubscriptionTier
  maxSize: number // in MB
  maxDuration: number // in minutes
  features: string[]
}

const subscriptionTiers: Record<SubscriptionTier, SubscriptionDetails> = {
  free: {
    tier: "free",
    maxSize: 50,
    maxDuration: 2,
    features: ["50MB max upload", "2 minute max duration", "Basic object detection"],
  },
  basic: {
    tier: "basic",
    maxSize: 200,
    maxDuration: 10,
    features: ["200MB max upload", "10 minute max duration", "Standard object detection", "Report sharing"],
  },
  pro: {
    tier: "pro",
    maxSize: 1000,
    maxDuration: 30,
    features: ["1GB max upload", "30 minute max duration", "Advanced object detection", "Report sharing", "API access"],
  },
  enterprise: {
    tier: "enterprise",
    maxSize: 10000,
    maxDuration: 120,
    features: [
      "Unlimited uploads",
      "2 hour max duration",
      "Premium object detection",
      "Report sharing",
      "API access",
      "Custom model training",
    ],
  },
}

const tierColors = {
  free: "from-blue-50 to-blue-100 border-blue-200",
  basic: "from-purple-50 to-purple-100 border-purple-200",
  pro: "from-violet-50 to-violet-100 border-violet-200",
  enterprise: "from-indigo-50 to-indigo-100 border-indigo-200",
}

const tierTextColors = {
  free: "text-blue-700",
  basic: "text-purple-700",
  pro: "text-violet-700",
  enterprise: "text-indigo-700",
}

const tierBgColors = {
  free: "bg-blue-100",
  basic: "bg-purple-100",
  pro: "bg-violet-100",
  enterprise: "bg-indigo-100",
}

export default function SubscriptionBanner() {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // In a real app, this would fetch from your API
        const userSub = await getUserSubscription()
        setSubscription(subscriptionTiers[userSub.tier])
      } catch (error) {
        // Default to free tier if error
        setSubscription(subscriptionTiers.free)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  if (loading) {
    return <div className="h-24 bg-muted/30 rounded-lg animate-pulse"></div>
  }

  if (!subscription) return null

  const tierColor = tierColors[subscription.tier]
  const textColor = tierTextColors[subscription.tier]
  const bgColor = tierBgColors[subscription.tier]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className={`bg-gradient-to-r ${tierColor} border overflow-hidden`}>
        <CardContent className="p-0">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mt-16 -mr-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -mb-12 -ml-12"></div>

            <div className="p-6 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} mb-2`}
                    >
                      {subscription.tier.toUpperCase()} PLAN
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${textColor}`}>Your Current Subscription</h3>
                  <p className={`text-sm mt-1 ${textColor}/80`}>
                    Upload videos up to {subscription.maxSize === 10000 ? "Unlimited" : `${subscription.maxSize}MB`} and{" "}
                    {subscription.maxDuration} minutes in length
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-purple-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {subscription.tier !== "enterprise" && (
                  <Button variant="outline" className={`bg-white border ${textColor} hover:bg-white/90 group`}>
                    <span>Upgrade Plan</span>
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
