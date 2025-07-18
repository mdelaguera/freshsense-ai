"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  ChefHat, 
  Clock, 
  Thermometer, 
  AlertTriangle, 
  BookOpen,
  Utensils,
  Timer,
  Users,
  Star
} from "lucide-react"
import { FoodAnalysisResult, RecipeSuggestion } from "@/lib/api"

interface EnhancedFoodResultsProps {
  data: FoodAnalysisResult
  imageUrl: string
  onBack: () => void
}

export function EnhancedFoodResults({ data, imageUrl, onBack }: EnhancedFoodResultsProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSuggestion | null>(null)

  const getAssessmentColor = (assessment: string) => {
    switch (assessment.toLowerCase()) {
      case 'good':
      case 'very fresh':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'fair - use soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'poor - use immediately':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'inedible - discard immediately':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCookingStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'rare':
        return 'bg-red-100 text-red-800'
      case 'medium-rare':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'medium-well':
        return 'bg-green-100 text-green-800'
      case 'well-done':
        return 'bg-blue-100 text-blue-800'
      case 'perfectly-cooked':
        return 'bg-emerald-100 text-emerald-800'
      case 'overcooked':
        return 'bg-red-100 text-red-800'
      case 'undercooked':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return <Star className="h-4 w-4 fill-current" />
      case 'medium':
        return (
          <div className="flex">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>
        )
      case 'hard':
        return (
          <div className="flex">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>
        )
      default:
        return null
    }
  }

  const showRecipes = data.recipe_suggestions && data.recipe_suggestions.length > 0
  const showCooking = data.cooking_stage || data.cooking_recommendations || data.internal_temperature_guidance
  const isRawFood = data.food_category === 'raw'
  const isCooking = data.food_category === 'cooking'

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Upload
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-fresh-green-600">Analysis Results</h1>
          <p className="text-muted-foreground">
            {isRawFood && "Raw food with recipe suggestions"}
            {isCooking && "Cooking analysis with tips"}
            {!isRawFood && !isCooking && "Food freshness analysis"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image and Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              {data.identified_food}
            </CardTitle>
            <CardDescription>
              <Badge className={`${getAssessmentColor(data.visual_assessment)} border`}>
                {data.visual_assessment}
              </Badge>
              <Badge variant="outline" className="ml-2">
                {data.food_category.charAt(0).toUpperCase() + data.food_category.slice(1)}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img 
                src={imageUrl} 
                alt={data.identified_food}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Visual Indicators</h4>
                <p className="text-sm text-muted-foreground">{data.key_visual_indicators}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Freshness</span>
                  <p className="text-muted-foreground">{data.estimated_remaining_freshness_days} days</p>
                </div>
                <div>
                  <span className="font-medium">Confidence</span>
                  <p className="text-muted-foreground">{data.assessment_confidence}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Enhanced Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={showCooking ? "cooking" : showRecipes ? "recipes" : "tips"} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {showCooking && <TabsTrigger value="cooking">Cooking</TabsTrigger>}
                {showRecipes && <TabsTrigger value="recipes">Recipes</TabsTrigger>}
                <TabsTrigger value="tips">Tips</TabsTrigger>
              </TabsList>

              {showCooking && (
                <TabsContent value="cooking" className="space-y-4">
                  {data.cooking_stage && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        Cooking Stage
                      </h4>
                      <Badge className={getCookingStageColor(data.cooking_stage)}>
                        {data.cooking_stage}
                      </Badge>
                    </div>
                  )}

                  {data.cooking_recommendations && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ChefHat className="h-4 w-4" />
                        Recommendations
                      </h4>
                      <p className="text-sm text-muted-foreground">{data.cooking_recommendations}</p>
                    </div>
                  )}

                  {data.internal_temperature_guidance && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Thermometer className="h-4 w-4" />
                        Temperature Guide
                      </h4>
                      <p className="text-sm text-muted-foreground">{data.internal_temperature_guidance}</p>
                    </div>
                  )}
                </TabsContent>
              )}

              {showRecipes && (
                <TabsContent value="recipes" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Recipe Suggestions
                    </h4>
                    <div className="space-y-3">
                      {data.recipe_suggestions?.map((recipe, index) => (
                        <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedRecipe(recipe)}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{recipe.name}</h5>
                              <div className="flex items-center gap-1 text-yellow-500">
                                {getDifficultyIcon(recipe.difficulty)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{recipe.brief_description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ChefHat className="h-3 w-3" />
                                {recipe.cooking_method}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {recipe.estimated_time}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {data.preparation_tips && (
                    <div>
                      <h4 className="font-medium mb-2">Preparation Tips</h4>
                      <p className="text-sm text-muted-foreground">{data.preparation_tips}</p>
                    </div>
                  )}
                </TabsContent>
              )}

              <TabsContent value="tips" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <p className="text-sm text-muted-foreground">{data.user_verification_notes}</p>
                </div>

                {data.safety_warning && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{data.safety_warning}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {selectedRecipe.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    {selectedRecipe.cooking_method}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedRecipe.estimated_time}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {getDifficultyIcon(selectedRecipe.difficulty)}
                    <span className="text-muted-foreground text-sm ml-1">{selectedRecipe.difficulty}</span>
                  </div>
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedRecipe(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedRecipe.brief_description}</p>
              
              {selectedRecipe.key_ingredients && selectedRecipe.key_ingredients.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Key Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.key_ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary">{ingredient}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {data.disclaimer}
        </AlertDescription>
      </Alert>
    </div>
  )
}