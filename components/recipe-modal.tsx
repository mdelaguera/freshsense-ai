"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { 
  Clock, 
  Users, 
  ChefHat, 
  Star, 
  ShoppingCart,
  CheckCircle2,
  DollarSign,
  Heart,
  Share2,
  BookOpen,
  Utensils
} from "lucide-react"
import { InlineAffiliateDisclosure } from "@/components/affiliate-disclosure"
import { generateValidatedAffiliateLink, trackAffiliateClick, generateShoppingCartLink } from "@/lib/affiliate-links"

interface Recipe {
  id: string
  title: string
  description: string
  category: string
  prepTime: number
  servings: number
  rating: number
  imageUrl: string
  ingredients: number
  difficulty: string
  savedDate: string
  sourceFood: string
  tags: string[]
  estimatedCost: number
}

interface RecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
}

export function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())

  if (!recipe) return null

  // Mock detailed recipe data - in real app, this would come from database
  const detailedRecipe = {
    ...recipe,
    instructions: [
      "Wash and prepare all fresh ingredients thoroughly",
      "Heat olive oil in a large skillet over medium heat",
      "Add aromatics and cook until fragrant, about 2-3 minutes",
      "Add main ingredients and cook according to recipe requirements",
      "Season to taste and adjust cooking time as needed",
      "Serve immediately while hot and enjoy!"
    ],
    ingredientsList: [
      { name: "Fresh Strawberries", amount: "2 cups", essential: true },
      { name: "Baby Spinach", amount: "4 cups", essential: true },
      { name: "Feta Cheese", amount: "1/2 cup crumbled", essential: true },
      { name: "Red Onion", amount: "1/4 cup sliced", essential: false },
      { name: "Balsamic Vinegar", amount: "2 tbsp", essential: false },
      { name: "Olive Oil", amount: "2 tbsp", essential: false },
      { name: "Honey", amount: "1 tsp", essential: false },
      { name: "Toasted Walnuts", amount: "1/4 cup", essential: false }
    ],
    nutrition: {
      calories: 245,
      protein: "8g",
      carbs: "18g",
      fat: "16g",
      fiber: "4g"
    },
    tips: [
      "Use the freshest strawberries for best flavor",
      "Dry spinach thoroughly to prevent soggy salad",
      "Toast walnuts for extra crunch and flavor"
    ]
  }

  const toggleIngredientCheck = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)
  }

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      Easy: "default",
      Medium: "secondary", 
      Hard: "destructive"
    } as const
    
    return <Badge variant={variants[difficulty as keyof typeof variants]}>{difficulty}</Badge>
  }

  const handleIngredientShop = (ingredientName: string) => {
    const affiliateLink = generateValidatedAffiliateLink(ingredientName)
    trackAffiliateClick(ingredientName, affiliateLink.linkType)
    window.open(affiliateLink.link, '_blank', 'noopener,noreferrer')
  }

  const handleShopAll = () => {
    const essentialIngredients = detailedRecipe.ingredientsList
      .filter(ing => ing.essential)
      .map(ing => ing.name)
    
    const shoppingCartLink = generateShoppingCartLink(essentialIngredients)
    trackAffiliateClick(`${recipe.title} - All Ingredients`, 'amazon-fresh')
    window.open(shoppingCartLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{recipe.title}</DialogTitle>
          <DialogDescription>{recipe.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Recipe Image and Quick Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-lg"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge variant="secondary" className="bg-black/50 text-white border-0">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {recipe.rating}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{recipe.prepTime} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{recipe.servings} servings</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{detailedRecipe.ingredientsList.length} ingredients</span>
                  </div>
                  {getDifficultyBadge(recipe.difficulty)}
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">${recipe.estimatedCost}</div>
                  <div className="text-xs text-muted-foreground">Estimated cost</div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Nutrition (per serving)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Calories: {detailedRecipe.nutrition.calories}</div>
                  <div>Protein: {detailedRecipe.nutrition.protein}</div>
                  <div>Carbs: {detailedRecipe.nutrition.carbs}</div>
                  <div>Fat: {detailedRecipe.nutrition.fat}</div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full" onClick={handleShopAll}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Shop All Ingredients
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Ingredients
                </CardTitle>
                <CardDescription>
                  Check off ingredients as you shop or prepare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detailedRecipe.ingredientsList.map((ingredient, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        checkedIngredients.has(index) ? 'bg-muted/50 opacity-75' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleIngredientCheck(index)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            checkedIngredients.has(index) 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : 'border-muted-foreground hover:border-primary'
                          }`}
                        >
                          {checkedIngredients.has(index) && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                        </button>
                        <div className={checkedIngredients.has(index) ? 'line-through' : ''}>
                          <div className="font-medium text-sm">{ingredient.name}</div>
                          <div className="text-xs text-muted-foreground">{ingredient.amount}</div>
                        </div>
                        {ingredient.essential && (
                          <Badge variant="secondary" className="text-xs">Essential</Badge>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleIngredientShop(ingredient.name)}
                        disabled={checkedIngredients.has(index)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Buy
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {detailedRecipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Chef's Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {detailedRecipe.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <InlineAffiliateDisclosure className="text-center mt-4 text-xs" />
      </DialogContent>
    </Dialog>
  )
}