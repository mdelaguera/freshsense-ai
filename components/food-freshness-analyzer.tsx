"use client"

import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { FreshnessResults } from "@/components/freshness-results"
import { Alert, AlertDescription } from "@/components/ui/alert"

type AnalysisState = "idle" | "loading" | "results" | "error"


export function FoodFreshnessAnalyzer() {
  const [image, setImage] = useState<string | null>(null)
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [results, setResults] = useState<{
    identifiedFood: string;
    visualAssessment: string;
    keyVisualIndicators: string;
    estimatedRemainingFreshness: number;
    assessmentConfidence: string;
  } | null>(null)

  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl)
    setAnalysisState("idle")
    setErrorMessage("")
  }

  const handleAnalyze = async () => {
    if (!image) return

    setAnalysisState("loading")
    setErrorMessage("")

    try {
      // Format the payload for the Supabase Edge Function
      const payload = {
        image: image // The full data URL for analysis
      }
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration missing')
      }
      
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/analyze-food`
      
      console.log('Sending image to Supabase Edge Function:', edgeFunctionUrl)
      console.log(`Sending payload with image size: ${image.length} characters`)
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      // Check if there was an error in the response
      if (!response.ok || data.error) {
        console.error("Supabase Edge Function error:", response.status, response.statusText)
        console.error("Error details:", data)
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      console.log('Received response from Supabase Edge Function:', data)
      
      // Transform the response to match what FreshnessResults component expects
      const transformedResults = {
        identifiedFood: data.identified_food,
        visualAssessment: data.visual_assessment,
        keyVisualIndicators: data.key_visual_indicators,
        estimatedRemainingFreshness: parseEstimatedDays(data.estimated_remaining_freshness_days),
        assessmentConfidence: data.confidence
      }
      
      setResults(transformedResults)
      setAnalysisState("results")
    } catch (error) {
      console.error("Analysis error details:", error)
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
      console.log("Using proxy-provided error response")
      setAnalysisState("error")
    }
  }

  // Helper function to parse the estimated days string into a number
  // Converts "3-5" to 3 (takes the lower bound for display)
  const parseEstimatedDays = (daysString: string): number => {
    if (daysString.includes('-')) {
      const [minDays] = daysString.split('-')
      return parseInt(minDays, 10) || 0
    }
    return parseInt(daysString, 10) || 0
  }


  const handleReset = () => {
    setImage(null)
    setAnalysisState("idle")
    setErrorMessage("")
    setResults(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Food Freshness Analysis</CardTitle>
        <CardDescription>Upload or take a photo of your food to analyze its freshness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageUploader image={image} onImageUpload={handleImageUpload} disabled={analysisState === "loading"} />

        {image && analysisState === "idle" && (
          <Button className="w-full" onClick={handleAnalyze}>
            Analyze Food Freshness
          </Button>
        )}

        {analysisState === "loading" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Analyzing your food...</p>
          </div>
        )}

        {analysisState === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || "Failed to analyze image. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {analysisState === "results" && results && <FreshnessResults results={results} onReset={handleReset} />}
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-muted-foreground text-center">
          DISCLAIMER: This assessment is based SOLELY on visual appearance. Always use proper food safety guidelines and
          your own judgment before consumption.
        </p>
      </CardFooter>
    </Card>
  )
}
