"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash, Plus, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Mock subscription plans data
const initialPlans = [
  {
    id: "free",
    name: "Free Trial",
    description: "For individuals just getting started",
    maxVideoSize: 50,
    maxVideoDuration: 2,
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "50MB max upload size",
      "2 minute max video duration",
      "Basic object detection",
      "Limited video storage (7 days)",
    ],
    active: true,
  },
  {
    id: "basic",
    name: "Basic",
    description: "For individuals and small teams",
    maxVideoSize: 200,
    maxVideoDuration: 10,
    priceMonthly: 9.99,
    priceYearly: 99.99,
    features: [
      "200MB max upload size",
      "10 minute max video duration",
      "Standard object detection",
      "30-day video storage",
      "Report sharing",
    ],
    active: true,
  },
  {
    id: "pro",
    name: "Professional",
    description: "For professionals and growing teams",
    maxVideoSize: 1000,
    maxVideoDuration: 30,
    priceMonthly: 29.99,
    priceYearly: 299.99,
    features: [
      "1GB max upload size",
      "30 minute max video duration",
      "Advanced object detection",
      "90-day video storage",
      "Report sharing",
      "API access",
      "Priority processing",
    ],
    active: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    maxVideoSize: 10000,
    maxVideoDuration: 120,
    priceMonthly: 99.99,
    priceYearly: 999.99,
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
    active: true,
  },
]

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState(initialPlans)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newFeature, setNewFeature] = useState("")

  const handleEditPlan = (plan: any) => {
    setEditingPlan({ ...plan })
    setIsEditDialogOpen(true)
  }

  const handleSavePlan = () => {
    if (!editingPlan) return

    setPlans(plans.map((plan) => (plan.id === editingPlan.id ? editingPlan : plan)))
    setIsEditDialogOpen(false)
    setEditingPlan(null)
  }

  const handleAddFeature = () => {
    if (!newFeature.trim() || !editingPlan) return

    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, newFeature.trim()],
    })
    setNewFeature("")
  }

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan) return

    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.filter((_: string, i: number) => i !== index),
    })
  }

  const handleTogglePlanStatus = (id: string) => {
    setPlans(plans.map((plan) => (plan.id === id ? { ...plan, active: !plan.active } : plan)))
  }

  const handleCreateNewPlan = () => {
    const newPlan = {
      id: `plan_${Date.now()}`,
      name: "New Plan",
      description: "Plan description",
      maxVideoSize: 100,
      maxVideoDuration: 5,
      priceMonthly: 19.99,
      priceYearly: 199.99,
      features: ["Feature 1", "Feature 2"],
      active: true,
    }

    setEditingPlan(newPlan)
    setIsEditDialogOpen(true)
  }

  const handleSaveNewPlan = () => {
    if (!editingPlan) return

    if (editingPlan.id.startsWith("plan_")) {
      // This is a new plan
      setPlans([...plans, editingPlan])
    } else {
      // This is an existing plan being edited
      setPlans(plans.map((plan) => (plan.id === editingPlan.id ? editingPlan : plan)))
    }

    setIsEditDialogOpen(false)
    setEditingPlan(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <Button onClick={handleCreateNewPlan}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      <Tabs defaultValue="plans">
        <TabsList className="mb-4">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={!plan.active ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={plan.active}
                          onCheckedChange={() => handleTogglePlanStatus(plan.id)}
                          id={`active-${plan.id}`}
                        />
                        <Label htmlFor={`active-${plan.id}`}>{plan.active ? "Active" : "Inactive"}</Label>
                      </div>
                      <Button variant="outline" size="icon" onClick={() => handleEditPlan(plan)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium mb-1">Monthly Price</div>
                      <div className="text-2xl font-bold">${plan.priceMonthly.toFixed(2)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium mb-1">Yearly Price</div>
                      <div className="text-2xl font-bold">${plan.priceYearly.toFixed(2)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium mb-1">Video Limits</div>
                      <div className="text-lg font-bold">
                        {plan.maxVideoSize}MB / {plan.maxVideoDuration}min
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment providers and options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stripe-key">Stripe API Key</Label>
                    <Input id="stripe-key" type="password" value="sk_test_•••••••••••••••••••••••••" />
                  </div>
                  <div>
                    <Label htmlFor="stripe-webhook">Stripe Webhook Secret</Label>
                    <Input id="stripe-webhook" type="password" value="whsec_••••••••••••••••••••••" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="test-mode" defaultChecked />
                  <Label htmlFor="test-mode">Test Mode</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-invoice" defaultChecked />
                  <Label htmlFor="auto-invoice">Automatically generate invoices</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="prorate" defaultChecked />
                  <Label htmlFor="prorate">Prorate subscription changes</Label>
                </div>

                <Button>Save Payment Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Analytics</CardTitle>
              <CardDescription>Overview of subscription metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium mb-1">Total Subscribers</div>
                  <div className="text-2xl font-bold">247</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium mb-1">Monthly Revenue</div>
                  <div className="text-2xl font-bold">$4,328.95</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium mb-1">Avg. Subscription Value</div>
                  <div className="text-2xl font-bold">$17.53</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium mb-1">Churn Rate</div>
                  <div className="text-2xl font-bold">3.2%</div>
                </div>
              </div>

              <div className="h-[300px] bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Subscription growth chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPlan?.id.startsWith("plan_") ? "Create New Plan" : "Edit Plan"}</DialogTitle>
            <DialogDescription>
              {editingPlan?.id.startsWith("plan_")
                ? "Create a new subscription plan with custom features and pricing."
                : "Modify the details of this subscription plan."}
            </DialogDescription>
          </DialogHeader>

          {editingPlan && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="plan-id">Plan ID</Label>
                  <Input
                    id="plan-id"
                    value={editingPlan.id}
                    onChange={(e) => setEditingPlan({ ...editingPlan, id: e.target.value })}
                    disabled={!editingPlan.id.startsWith("plan_")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="plan-description">Description</Label>
                <Textarea
                  id="plan-description"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthly-price">Monthly Price ($)</Label>
                  <Input
                    id="monthly-price"
                    type="number"
                    value={editingPlan.priceMonthly}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, priceMonthly: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="yearly-price">Yearly Price ($)</Label>
                  <Input
                    id="yearly-price"
                    type="number"
                    value={editingPlan.priceYearly}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceYearly: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-size">Max Video Size (MB)</Label>
                  <Input
                    id="max-size"
                    type="number"
                    value={editingPlan.maxVideoSize}
                    onChange={(e) => setEditingPlan({ ...editingPlan, maxVideoSize: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-duration">Max Video Duration (minutes)</Label>
                  <Input
                    id="max-duration"
                    type="number"
                    value={editingPlan.maxVideoDuration}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, maxVideoDuration: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <div className="mt-2 space-y-2">
                  {editingPlan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...editingPlan.features]
                          newFeatures[index] = e.target.value
                          setEditingPlan({ ...editingPlan, features: newFeatures })
                        }}
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(index)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add new feature..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddFeature()
                        }
                      }}
                    />
                    <Button variant="outline" onClick={handleAddFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="plan-active"
                  checked={editingPlan.active}
                  onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, active: checked })}
                />
                <Label htmlFor="plan-active">Plan Active</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewPlan}>
              <Save className="h-4 w-4 mr-2" />
              {editingPlan?.id.startsWith("plan_") ? "Create Plan" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
