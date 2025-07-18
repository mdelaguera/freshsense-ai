"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedFoodResults } from "@/components/enhanced-food-results"
import { ImageUpload } from "@/components/image-upload"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import { analyzeFoodImage, type FoodAnalysisResult } from "@/lib/api"
import { trackImageUpload, trackAnalysisRequest, trackAnalysisComplete, trackAnalysisError, trackUserJourney } from "@/lib/analytics"
import { Loader2, Leaf, Scan } from "lucide-react"
import { toast } from "sonner"

export default function Home() {
  const [showResults, setShowResults] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<FoodAnalysisResult | null>(null)
  const [progressMessage, setProgressMessage] = useState<string>("")

  const handleImageSelected = (file: File) => {
    setSelectedImage(file)
    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setImagePreview(objectUrl)
    
    // Track image upload
    trackImageUpload(file.size, file.type)
    trackUserJourney('image_selected')
  }

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to analyze")
      return
    }

    setIsAnalyzing(true)
    setProgressMessage("Preparing image for analysis...")
    const startTime = Date.now()
    
    // Track analysis request
    trackAnalysisRequest(true) // Assume webhook available for now
    trackUserJourney('analysis_started')
    
    try {
      setProgressMessage("Sending to AI analysis service...")
      toast.info("Analyzing your food image...");
      
      // Add a small delay to show progress message
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgressMessage("AI is examining the image...")
      
      const results = await analyzeFoodImage(selectedImage)
      const duration = Date.now() - startTime
      
      if (results.error) {
        trackAnalysisError(results.error)
        toast.error(`Analysis failed: ${results.error}`)
        console.error("Analysis error details:", results)
      } else if (results.raw_response?.simulatedData) {
        // Show special message for simulated data
        trackAnalysisRequest(false) // Update to reflect simulated data
        trackAnalysisComplete(results.identified_food, results.assessment_confidence, duration)
        trackUserJourney('analysis_complete_simulated')
        toast.warning("Using simulated data - n8n webhook not available");
        setAnalysisResults(results)
        setShowResults(true)
      } else if (!results.identified_food || results.identified_food === "Unknown") {
        trackAnalysisError('incomplete_data')
        toast.error("Food analysis returned incomplete data. Please try again with a clearer image.")
        console.log("Incomplete response:", results)
      } else {
        trackAnalysisComplete(results.identified_food, results.assessment_confidence, duration)
        trackUserJourney('analysis_complete_success')
        
        // Enhanced success message based on food category
        let successMessage = `Analysis complete: ${results.identified_food} identified!`
        if (results.food_category === 'raw' && results.recipe_suggestions?.length > 0) {
          successMessage += ` Found ${results.recipe_suggestions.length} recipe suggestions.`
        } else if (results.food_category === 'cooking' && results.cooking_stage) {
          successMessage += ` Cooking stage: ${results.cooking_stage}.`
        }
        
        toast.success(successMessage)
        setAnalysisResults(results)
        setShowResults(true)
      }
    } catch (error) {
      trackAnalysisError(`exception: ${error}`)
      toast.error("Failed to analyze image. Please try again.")
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
      setProgressMessage("")
    }
  }

  const handleBack = () => {
    trackUserJourney('back_to_upload')
    setShowResults(false)
    setSelectedImage(null)
    setImagePreview(null)
    setAnalysisResults(null)
  }

  // Format the API results to match the component's expected format
  const formatResultsForDisplay = () => {
    if (!analysisResults) return {
      identifiedFood: "Unknown",
      visualAssessment: "Good" as const,
      keyVisualIndicators: "No data available",
      estimatedRemainingFreshness: "0",
      assessmentConfidence: "Low" as const,
      userNotes: "",
      imageUrl: imagePreview || "/placeholder.svg?height=400&width=400",
    }

    return {
      identifiedFood: analysisResults.identified_food,
      visualAssessment: analysisResults.visual_assessment as "Good" | "Poor - Use Immediately" | "Inedible - Discard Immediately",
      keyVisualIndicators: analysisResults.key_visual_indicators,
      estimatedRemainingFreshness: analysisResults.estimated_remaining_freshness_days,
      assessmentConfidence: analysisResults.assessment_confidence as "High" | "Medium" | "Low",
      userNotes: analysisResults.user_verification_notes,
      imageUrl: imagePreview || "/placeholder.svg?height=400&width=400",
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100 py-4 sm:py-8">
        <div className="container mx-auto px-4">
        {showResults && analysisResults ? (
          <EnhancedFoodResults 
            data={analysisResults} 
            imageUrl={imagePreview || "/placeholder.svg?height=400&width=400"} 
            onBack={handleBack} 
          />
        ) : (
          <div className="w-full max-w-md mx-auto">
            {/* Header with User Menu */}
            <div className="flex justify-between items-start mb-4 sm:mb-8">
              <div className="text-center flex-1">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Leaf className="h-8 w-8 text-fresh-green-600 mr-3" />
                    <Scan className="h-4 w-4 text-fresh-green-500 absolute -top-1 -right-1" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fresh-green-600">FreshSense</h1>
                <p className="text-muted-foreground mt-1 sm:mt-2">AI-Powered Food Freshness Analyzer</p>
                <p className="text-xs text-fresh-green-600 mt-1">Reduce waste • Save money • Stay healthy</p>
              </div>
              <div className="absolute top-4 right-4">
                <UserMenu />
              </div>
            </div>
            <Card className="w-full">
              <CardHeader className="px-4 py-3 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Food Freshness Analysis</CardTitle>
                <CardDescription className="text-sm">
                  Upload or take a photo of your food to analyze its freshness
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-2 sm:p-6 space-y-3 sm:space-y-4">
                <ImageUpload onImageSelected={handleImageSelected} />
                <Button 
                  className="w-full h-12 text-base bg-fresh-green-600 hover:bg-fresh-green-700 text-white font-medium" 
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {progressMessage || "Analyzing..."}
                    </>
                  ) : (
                    "Analyze Food Freshness"
                  )}
                </Button>
                {isAnalyzing && (
                  <div className="text-center text-sm text-muted-foreground mt-2">
                    <p>This may take up to 30 seconds...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
