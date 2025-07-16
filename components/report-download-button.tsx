"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Download } from "lucide-react"
import SubscriptionCheckWrapper from "./subscription-check-wrapper"

interface ReportDownloadButtonProps extends ButtonProps {
  analysisId: string
  requiredTier?: "free" | "basic" | "pro" | "enterprise"
}

export default function ReportDownloadButton({
  analysisId,
  requiredTier = "basic",
  children,
  ...props
}: ReportDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // In a real implementation, this would call an API to generate and download the report
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

      // Create a fake report for demo purposes
      const reportData = `
Analysis Report ID: ${analysisId}
Generated: ${new Date().toISOString()}
---------------------------------
Objects Detected: 24
Object Classes: 5
Processing Time: 45.2s
      `

      // Create a blob and download it
      const blob = new Blob([reportData], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `analysis-report-${analysisId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading report:", error)
    } finally {
      setDownloading(false)
    }
  }

  const DownloadButton = () => (
    <Button onClick={handleDownload} disabled={downloading} {...props}>
      {downloading
        ? "Downloading..."
        : children || (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </>
          )}
    </Button>
  )

  return (
    <SubscriptionCheckWrapper
      requiredTier={requiredTier}
      featureName="Report Download"
      featureDescription={`Report downloads are available on the ${requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan or higher. Upgrade your subscription to download analysis reports.`}
    >
      <DownloadButton />
    </SubscriptionCheckWrapper>
  )
}
