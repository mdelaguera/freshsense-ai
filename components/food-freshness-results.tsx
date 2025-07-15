"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface FoodFreshnessResultsProps {
  data: {
    identifiedFood: string
    visualAssessment: "Good" | "Poor - Use Immediately" | "Inedible - Discard Immediately"
    keyVisualIndicators: string
    estimatedRemainingFreshness: string
    assessmentConfidence: "High" | "Medium" | "Low"
    userNotes?: string
    imageUrl: string
  }
  onBack: () => void
}

export function FoodFreshnessResults({ data, onBack }: FoodFreshnessResultsProps) {
  // Helper function to determine badge color based on assessment
  const getAssessmentBadgeVariant = (assessment: string) => {
    if (assessment.includes("Good") || assessment.includes("Fresh")) return "success"
    if (assessment.includes("Fair") || assessment.includes("Soon")) return "secondary" 
    if (assessment.includes("Poor") || assessment.includes("Immediately")) return "warning"
    if (assessment.includes("Inedible") || assessment.includes("Discard")) return "destructive"
    return "secondary"
  }

  // Helper function to determine confidence badge color
  const getConfidenceBadgeVariant = (confidence: string) => {
    if (confidence === "High") return "success"
    if (confidence === "Medium") return "warning"
    if (confidence === "Low") return "destructive"
    return "secondary"
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Analysis Results</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Image Card */}
        <Card className="overflow-hidden h-auto">
          <CardHeader className="pb-2 px-4 py-3">
            <CardTitle className="text-base sm:text-lg">Analyzed Image</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full" style={{ height: "250px" }}>
              <Image
                src={data.imageUrl || "/placeholder.svg"}
                alt={`Image of ${data.identifiedFood}`}
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card>
          <CardHeader className="px-4 py-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl">{data.identifiedFood}</CardTitle>
              <Badge variant={getConfidenceBadgeVariant(data.assessmentConfidence)}>
                {data.assessmentConfidence} Confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 py-2 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">Visual Assessment</h3>
                <Badge variant={getAssessmentBadgeVariant(data.visualAssessment)}>{data.visualAssessment}</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Key Visual Indicators</h3>
              <p className="text-sm text-muted-foreground">{data.keyVisualIndicators}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Estimated Remaining Freshness</h3>
              <p className="text-sm">
                <span className="text-lg font-medium">{data.estimatedRemainingFreshness}</span> days
              </p>
            </div>

            {data.userNotes && (
              <div>
                <h3 className="font-semibold mb-1">User Notes</h3>
                <div className="bg-muted p-3 rounded-md text-sm">{data.userNotes}</div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:gap-4 px-4 py-3 sm:p-6">
            <p className="text-xs text-muted-foreground">
              DISCLAIMER: This assessment is based SOLELY on visual appearance. Always use proper food safety guidelines
              and your own judgment before consumption. Discard any food that shows signs of spoilage regardless of the
              assessment provided.
            </p>
            <Button className="w-full h-12 text-base" onClick={onBack}>
              Analyze Another Food
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
