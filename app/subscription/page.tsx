"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const router = useRouter()

  const plans = [
    {
      id: "free",
      name: "Free Trial",
      description: "For individuals just getting started",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        "50MB max upload size",
        "2 minute max video duration",
        "Basic object detection",
        "Limited video storage (7 days)",
      ],
      limitations: ["No report sharing", "No API access"],
      cta: "Current Plan",
      disabled: true,
      popular: false,
    },
    {
      id: "basic",
      name: "Basic",
      description: "For individuals and small teams",
      price: {
        monthly: 9.99,
        yearly: 99.99,
      },
      features: [
        "200MB max upload size",
        "10 minute max video duration",
        "Standard object detection",
        "30-day video storage",
        "Report sharing",
      ],
      limitations: ["No API access", "No custom model training"],
      cta: "Upgrade to Basic",
      disabled: false,
      popular: true,
    },
    {
      id: "pro",
      name: "Professional",
      description: "For professionals and growing teams",
      price: {
        monthly: 29.99,
        yearly: 299.99,
      },
      features: [
        "1GB max upload size",
        "30 minute max video duration",
        "Advanced object detection",
        "90-day video storage",
        "Report sharing",
        "API access",
        "Priority processing",
      ],
      limitations: ["No custom model training"],
      cta: "Upgrade to Pro",
      disabled: false,
      popular: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      price: {
        monthly: 99.99,
        yearly: 999.99,
      },
      features: [
        "10GB max upload size",
        "2 hour max video duration",
        "Premium object detection",
        "Unlimited video storage",
        "Report sharing",
        "API access",
        "Priority processing",
        "Custom model training",
        "Dedicated support",
      ],
      limitations: [],
      cta: "Contact Sales",
      disabled: false,
      popular: false,
    },
  ]

  const handleUpgrade = (planId: string) => {
    if (planId === "enterprise") {
      // Redirect to contact sales page
      router.push("/contact")
      return
    }

    // In a real app, you would redirect to a checkout page
    // For demo purposes, we'll just log the selected plan
    console.log(`Upgrading to ${planId} plan with ${billingCycle} billing cycle`)

    // Simulate a successful upgrade
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground">
              Select the plan that best fits your needs. All plans include our core video analysis features.
            </p>

            <div className="mt-8">
              <Tabs
                defaultValue="monthly"
                value={billingCycle}
                onValueChange={setBillingCycle}
                className="w-[400px] mx-auto"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                  <TabsTrigger value="yearly">
                    Yearly Billing
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-600 border-green-200">
                      Save 15%
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      ${plan.price[billingCycle as keyof typeof plan.price].toFixed(2)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      {plan.price[billingCycle as keyof typeof plan.price] > 0
                        ? `/${billingCycle === "monthly" ? "mo" : "yr"}`
                        : ""}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Limitations</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start text-sm text-muted-foreground">
                              <span className="mr-2">•</span>
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={plan.disabled}
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    {plan.cta}
                    {!plan.disabled && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We offer custom plans for organizations with specific requirements. Contact our sales team to discuss your
              needs.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/contact">Contact Sales</a>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
