"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/charts"

export default function AnalyticsSummary() {
  const [period, setPeriod] = useState("7d")

  // Mock data for charts
  const barChartData = {
    labels: ["Person", "Car", "Dog", "Bicycle", "Cat", "Bus", "Truck"],
    datasets: [
      {
        label: "Detected Objects",
        data: [124, 80, 42, 31, 22, 19, 15],
        backgroundColor: "hsl(var(--primary) / 0.8)",
        borderRadius: 4,
      },
    ],
  }

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Videos Analyzed",
        data: [3, 5, 2, 8, 4, 6, 3],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Summary of your video analysis activity</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm border rounded-md px-2 py-1 bg-background"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="objects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="objects">Detected Objects</TabsTrigger>
            <TabsTrigger value="videos">Videos Analyzed</TabsTrigger>
          </TabsList>
          <TabsContent value="objects" className="h-[300px]">
            <BarChart data={barChartData} />
          </TabsContent>
          <TabsContent value="videos" className="h-[300px]">
            <LineChart data={lineChartData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
