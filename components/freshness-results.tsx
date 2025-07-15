"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FreshnessResultsProps {
  results: {
    identifiedFood: string
    visualAssessment: string
    keyVisualIndicators: string
    estimatedRemainingFreshness: number
    assessmentConfidence: string
  }
  onReset: () => void
}

export function FreshnessResults({ results, onReset }: FreshnessResultsProps) {
  const getAssessmentColor = (assessment: string) => {
    switch (assessment.toLowerCase()) {
      case "good":
        return "bg-green-100 text-green-800"
      case "poor":
        return "bg-yellow-100 text-yellow-800"
      case "inedible":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Analysis Results</h3>
          <Badge variant="outline" className={getConfidenceColor(results.assessmentConfidence)}>
            {results.assessmentConfidence} Confidence
          </Badge>
        </div>

        <div className="grid gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Identified Food</p>
            <p className="text-base font-medium">{results.identifiedFood}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Visual Assessment</p>
            <Badge className={getAssessmentColor(results.visualAssessment)}>{results.visualAssessment}</Badge>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Key Visual Indicators</p>
            <p className="text-sm">{results.keyVisualIndicators}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Estimated Remaining Freshness</p>
            <p className="text-base font-medium">
              {results.estimatedRemainingFreshness} {results.estimatedRemainingFreshness === 1 ? "day" : "days"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Your Notes</Label>
        <Textarea id="notes" placeholder="Add your own observations or notes..." />
      </div>

      <Button onClick={onReset} className="w-full">
        Analyze Another Food
      </Button>
    </div>
  )
}
