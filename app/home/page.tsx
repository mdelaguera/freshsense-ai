"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedFoodResults } from "@/components/enhanced-food-results"
import { ImageUpload } from "@/components/image-upload"
import { ProtectedRoute } from "@/components/protected-route"
import { UserMenu } from "@/components/user-menu"
import { analyzeFoodImage, type FoodAnalysisResult } from "@/lib/api"
import { trackImageUpload, trackAnalysisRequest, trackAnalysisComplete, trackAnalysisError, trackUserJourney } from "@/lib/analytics"
import { 
  Loader2, 
  Leaf, 
  Scan, 
  CheckCircle, 
  Shield, 
  Clock, 
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  Camera,
  Zap,
  Heart,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"

export default function HomePage() {
  const [showResults, setShowResults] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<FoodAnalysisResult | null>(null)
  const [progressMessage, setProgressMessage] = useState<string>("")

  const handleImageSelected = (file: File) => {
    setSelectedImage(file)
    const objectUrl = URL.createObjectURL(file)
    setImagePreview(objectUrl)
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
    
    trackAnalysisRequest(true)
    trackUserJourney('analysis_started')
    
    try {
      setProgressMessage("Sending to AI analysis service...")
      toast.info("Analyzing your food image...");
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgressMessage("AI is examining the image...")
      
      const results = await analyzeFoodImage(selectedImage)
      const duration = Date.now() - startTime
      
      if (results.error) {
        trackAnalysisError(results.error)
        toast.error(`Analysis failed: ${results.error}`)
        console.error("Analysis error details:", results)
      } else if (results.raw_response?.simulatedData) {
        trackAnalysisRequest(false)
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

  if (showResults && analysisResults) {
    return (
      <ProtectedRoute>
        <EnhancedFoodResults 
          data={analysisResults} 
          imageUrl={imagePreview || "/placeholder.svg?height=400&width=400"} 
          onBack={handleBack} 
        />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Leaf className="h-12 w-12 text-fresh-green-600 mr-4" />
                <Scan className="h-6 w-6 text-fresh-green-500 absolute -top-1 -right-1" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-fresh-green-600 mb-6">
              Stop Guessing. Start Knowing.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              AI-powered food freshness analysis in seconds
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Upload a photo of your food and get instant, expert-level freshness analysis powered by advanced AI. 
              Reduce waste, save money, and keep your family safe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-fresh-green-600 hover:bg-fresh-green-700 text-white px-8 py-4 text-lg font-medium"
                onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Camera className="mr-2 h-5 w-5" />
                Analyze Food Now - Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
                asChild
              >
                <Link href="/features">
                  See How It Works
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 text-left">
                <Zap className="h-8 w-8 text-fresh-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Instant Analysis</h3>
                  <p className="text-muted-foreground text-sm">Results in under 5 seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Shield className="h-8 w-8 text-fresh-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Family Safety</h3>
                  <p className="text-muted-foreground text-sm">Prevent foodborne illness</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <DollarSign className="h-8 w-8 text-fresh-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Money Saving</h3>
                  <p className="text-muted-foreground text-sm">Stop throwing away good food</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Food Analyzer Section */}
        <section id="analyzer" className="py-16 px-4">
          <div className="container mx-auto max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Try It Now</h2>
              <p className="text-muted-foreground">Upload a photo and see the AI magic in action</p>
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
        </section>

        {/* Social Proof Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Join the Food Safety Revolution</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Turn your smartphone into a food safety expert using the same AI technology that powers ChatGPT
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-fresh-green-600 mb-2">40%</div>
                <p className="text-muted-foreground">of food produced in the US is wasted</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-fresh-green-600 mb-2">$1,500</div>
                <p className="text-muted-foreground">average household food waste cost per year</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-fresh-green-600 mb-2">1.3B</div>
                <p className="text-muted-foreground">tons of food wasted globally annually</p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-lg italic mt-4 mb-4">
                    "Saved me from throwing away $50 worth of groceries last week!"
                  </blockquote>
                  <footer className="text-muted-foreground">
                    <strong>Sarah M.</strong>, Home Cook
                  </footer>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-lg italic mt-4 mb-4">
                    "Game-changer for our restaurant's quality control."
                  </blockquote>
                  <footer className="text-muted-foreground">
                    <strong>Chef Rodriguez</strong>, Miami
                  </footer>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Three simple steps to safer, smarter food decisions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-fresh-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-fresh-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Upload</h3>
                <p className="text-muted-foreground">Take a photo or upload an image of your food</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-fresh-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scan className="h-8 w-8 text-fresh-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Analyze</h3>
                <p className="text-muted-foreground">Our AI examines color, texture, and visible spoilage indicators</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-fresh-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-fresh-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Decide</h3>
                <p className="text-muted-foreground">Get detailed freshness assessment with safety recommendations</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-fresh-green-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Kitchen?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users reducing food waste with AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-4 text-lg font-medium"
                onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Analyzing Food Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-fresh-green-600"
                asChild
              >
                <Link href="/pricing">
                  See Pricing Plans
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  )
}