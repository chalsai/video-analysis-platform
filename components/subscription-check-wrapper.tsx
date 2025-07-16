"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserSubscription } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowUpRight } from "lucide-react"

interface SubscriptionCheckWrapperProps {
  children: React.ReactNode
  requiredTier: "free" | "basic" | "pro" | "enterprise"
  featureName: string
  featureDescription?: string
}

export default function SubscriptionCheckWrapper({
  children,
  requiredTier,
  featureName,
  featureDescription,
}: SubscriptionCheckWrapperProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Tier levels for comparison
  const tierLevels = {
    free: 0,
    basic: 1,
    pro: 2,
    enterprise: 3,
  }

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const subscription = await getUserSubscription()
        const userTierLevel = tierLevels[subscription.tier as keyof typeof tierLevels]
        const requiredTierLevel = tierLevels[requiredTier]

        setHasAccess(userTierLevel >= requiredTierLevel)
      } catch (error) {
        console.error("Error checking subscription:", error)
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [requiredTier])

  const handleUpgrade = () => {
    router.push("/subscription")
  }

  if (loading) {
    return (
      <div className="w-full h-full min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-muted-foreground" />
            {featureName} Requires Upgrade
          </CardTitle>
          <CardDescription>
            {featureDescription ||
              `This feature is available on the ${requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan or higher.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Lock className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upgrade to Access</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Upgrade your subscription to unlock this feature and many more advanced capabilities.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleUpgrade} className="gap-1">
            View Subscription Plans
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return <>{children}</>
}
