"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { 
  Search, 
  Clock, 
  Users, 
  Star,
  Heart,
  ChefHat,
  ShoppingCart,
  Bookmark
} from "lucide-react"
import { InlineAffiliateDisclosure } from "@/components/affiliate-disclosure"
import { generateValidatedAffiliateLink, trackAffiliateClick } from "@/lib/affiliate-links"
import { RecipeModal } from "@/components/recipe-modal"

export function RecipeCollection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock recipe data - in real app, this would come from user's saved recipes
  const recipes = [
    {
      id: "1",
      title: "Strawberry Spinach Salad",
      description: "Fresh and healthy salad perfect for summer",
      category: "salads",
      prepTime: 15,
      servings: 4,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop&crop=center",
      ingredients: 8,
      difficulty: "Easy",
      savedDate: "2024-07-20",
      sourceFood: "Fresh Strawberries",
      tags: ["healthy", "quick", "vegetarian"],
      estimatedCost: 12.50
    },
    {
      id: "2",
      title: "Banana Bread",
      description: "Moist and delicious homemade banana bread",
      category: "desserts",
      prepTime: 60,
      servings: 8,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=200&fit=crop&crop=center", 
      ingredients: 9,
      difficulty: "Medium",
      savedDate: "2024-07-19",
      sourceFood: "Bananas",
      tags: ["baking", "comfort food"],
      estimatedCost: 8.75
    },
    {
      id: "3",
      title: "Spinach and Feta Quiche",
      description: "Creamy quiche with fresh spinach and feta cheese",
      category: "main-dishes",
      prepTime: 45,
      servings: 6,
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center",
      ingredients: 12,
      difficulty: "Medium",
      savedDate: "2024-07-18",
      sourceFood: "Spinach Leaves",
      tags: ["brunch", "vegetarian", "protein"],
      estimatedCost: 15.20
    },
    {
      id: "4",
      title: "Stuffed Bell Peppers",
      description: "Colorful peppers stuffed with rice and vegetables",
      category: "main-dishes",
      prepTime: 50,
      servings: 4,
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=300&h=200&fit=crop&crop=center",
      ingredients: 10,
      difficulty: "Medium",
      savedDate: "2024-07-16",
      sourceFood: "Bell Peppers",
      tags: ["healthy", "colorful", "filling"],
      estimatedCost: 18.90
    }
  ]

  const categories = [
    { value: "all", label: "All Recipes" },
    { value: "salads", label: "Salads" },
    { value: "main-dishes", label: "Main Dishes" },
    { value: "desserts", label: "Desserts" },
    { value: "appetizers", label: "Appetizers" }
  ]

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.sourceFood.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || recipe.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      Easy: "default",
      Medium: "secondary",
      Hard: "destructive"
    } as const
    
    return <Badge variant={variants[difficulty as keyof typeof variants]}>{difficulty}</Badge>
  }

  const handleViewRecipe = (recipe: any) => {
    setSelectedRecipe(recipe)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRecipe(null)
  }

  const handleShopIngredients = (recipe: any) => {
    // Use the source food (main ingredient) for shopping instead of recipe title
    const affiliateLink = generateValidatedAffiliateLink(recipe.sourceFood)
    trackAffiliateClick(recipe.sourceFood, affiliateLink.linkType)
    window.open(affiliateLink.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Recipe Collection</CardTitle>
              <CardDescription>Recipes generated from your food scans</CardDescription>
            </div>
            <Button>
              <Bookmark className="h-4 w-4 mr-2" />
              Browse All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipe Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{recipes.length}</div>
              <div className="text-sm text-muted-foreground">Total Recipes</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{recipes.filter(r => r.difficulty === 'Easy').length}</div>
              <div className="text-sm text-muted-foreground">Easy Recipes</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">${(recipes.reduce((sum, r) => sum + r.estimatedCost, 0) / recipes.length).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Avg Cost</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{(recipes.reduce((sum, r) => sum + r.rating, 0) / recipes.length).toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyeyKFcFW2D6+KKhobhfAlIx40qHAAA=="
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge variant="secondary" className="bg-black/50 text-white border-0">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {recipe.rating}
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="bg-white/90">
                  {recipe.sourceFood}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">{recipe.title}</CardTitle>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recipe.prepTime}m
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {recipe.servings}
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-3 w-3" />
                    {recipe.ingredients}
                  </div>
                </div>
                {getDifficultyBadge(recipe.difficulty)}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-green-600">
                  ~${recipe.estimatedCost}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewRecipe(recipe)}
                  >
                    View Recipe
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleShopIngredients(recipe)}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Shop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterCategory !== "all" 
                ? "Try adjusting your search or filters"
                : "Start scanning food to generate personalized recipes"
              }
            </p>
            <Button>
              <ChefHat className="h-4 w-4 mr-2" />
              Scan Food for Recipes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Inline affiliate disclosure */}
      <InlineAffiliateDisclosure className="text-center mt-6" />

      {/* Recipe Modal */}
      <RecipeModal 
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}