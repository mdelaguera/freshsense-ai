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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { 
  Tag, 
  Camera, 
  Save, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Apple,
  Beef,
  Wheat,
  Milk,
  Fish,
  Carrot
} from "lucide-react"

interface FoodLabelingModalProps {
  imageUrl?: string
  aiPrediction?: {
    foodName: string
    freshness: string
    confidence: number
  }
  isOpen: boolean
  onClose: () => void
  onSave: (labelData: FoodLabelData) => void
}

export interface FoodLabelData {
  foodName: string
  category: string
  freshness: string
  daysRemaining: number
  notes: string
  userCorrection: boolean
  confidence: number
  tags: string[]
}

export function FoodLabelingModal({ 
  imageUrl, 
  aiPrediction, 
  isOpen, 
  onClose, 
  onSave 
}: FoodLabelingModalProps) {
  const [foodName, setFoodName] = useState(aiPrediction?.foodName || "")
  const [category, setCategory] = useState("")
  const [freshness, setFreshness] = useState(aiPrediction?.freshness || "")
  const [daysRemaining, setDaysRemaining] = useState<number>(0)
  const [notes, setNotes] = useState("")
  const [customTags, setCustomTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const foodCategories = [
    { value: "fruits", label: "Fruits", icon: Apple },
    { value: "vegetables", label: "Vegetables", icon: Carrot },
    { value: "meat", label: "Meat & Poultry", icon: Beef },
    { value: "dairy", label: "Dairy", icon: Milk },
    { value: "seafood", label: "Seafood", icon: Fish },
    { value: "grains", label: "Grains & Bread", icon: Wheat },
    { value: "herbs", label: "Herbs & Spices", icon: Tag },
    { value: "other", label: "Other", icon: Tag }
  ]

  const freshnessLevels = [
    { value: "fresh", label: "Fresh", color: "text-green-600", days: 5 },
    { value: "good", label: "Good", color: "text-blue-600", days: 3 },
    { value: "soon", label: "Use Soon", color: "text-yellow-600", days: 1 },
    { value: "spoiled", label: "Spoiled", color: "text-red-600", days: 0 }
  ]

  const commonTags = [
    "organic", "locally-grown", "imported", "seasonal", "ripe", "underripe", 
    "overripe", "premium", "discount", "bulk", "single-serving", "family-size"
  ]

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleFreshnessChange = (value: string) => {
    setFreshness(value)
    const freshnessLevel = freshnessLevels.find(f => f.value === value)
    if (freshnessLevel) {
      setDaysRemaining(freshnessLevel.days)
    }
  }

  const handleSubmit = async () => {
    if (!foodName.trim() || !category || !freshness) {
      return
    }

    setIsSubmitting(true)

    try {
      // Parse custom tags
      const customTagsArray = customTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const labelData: FoodLabelData = {
        foodName: foodName.trim(),
        category,
        freshness,
        daysRemaining,
        notes: notes.trim(),
        userCorrection: aiPrediction ? 
          (foodName.trim().toLowerCase() !== aiPrediction.foodName.toLowerCase() ||
           freshness !== aiPrediction.freshness) : false,
        confidence: aiPrediction?.confidence || 100,
        tags: [...selectedTags, ...customTagsArray]
      }

      // Simulate API call - in real app, this would save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))

      onSave(labelData)
      setSubmitSuccess(true)
      
      // Close modal after short success message
      setTimeout(() => {
        setSubmitSuccess(false)
        onClose()
        resetForm()
      }, 1500)

    } catch (error) {
      console.error('Error saving food label:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFoodName("")
    setCategory("")
    setFreshness("")
    setDaysRemaining(0)
    setNotes("")
    setCustomTags("")
    setSelectedTags([])
  }

  const isFormValid = foodName.trim() && category && freshness

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Label Food Item
          </DialogTitle>
          <DialogDescription>
            Help improve our AI by providing accurate food labels and freshness assessments
          </DialogDescription>
        </DialogHeader>

        {submitSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Food label saved successfully! Thank you for helping improve our AI.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Image Preview */}
          {imageUrl && (
            <div className="md:col-span-1">
              <Label className="text-sm font-medium">Food Image</Label>
              <div className="mt-2 relative">
                <Image
                  src={imageUrl}
                  alt="Food item to label"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border"
                  loading="lazy"
                />
                {aiPrediction && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      AI: {aiPrediction.confidence}% confidence
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className={`space-y-4 ${imageUrl ? 'md:col-span-1' : 'md:col-span-2'}`}>
            {/* Food Name */}
            <div>
              <Label htmlFor="foodName">Food Name *</Label>
              <Input
                id="foodName"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g., Fresh Strawberries"
                className="mt-1"
              />
              {aiPrediction && foodName !== aiPrediction.foodName && (
                <p className="text-xs text-muted-foreground mt-1">
                  AI suggested: {aiPrediction.foodName}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select food category" />
                </SelectTrigger>
                <SelectContent>
                  {foodCategories.map((cat) => {
                    const IconComponent = cat.icon
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Freshness */}
            <div>
              <Label htmlFor="freshness">Freshness Level *</Label>
              <Select value={freshness} onValueChange={handleFreshnessChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select freshness level" />
                </SelectTrigger>
                <SelectContent>
                  {freshnessLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          level.value === 'fresh' ? 'bg-green-500' :
                          level.value === 'good' ? 'bg-blue-500' :
                          level.value === 'soon' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className={level.color}>{level.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {aiPrediction && freshness !== aiPrediction.freshness && (
                <p className="text-xs text-muted-foreground mt-1">
                  AI suggested: {aiPrediction.freshness}
                </p>
              )}
            </div>

            {/* Days Remaining */}
            <div>
              <Label htmlFor="daysRemaining">Estimated Days Remaining</Label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="daysRemaining"
                  type="number"
                  min="0"
                  max="30"
                  value={daysRemaining}
                  onChange={(e) => setDaysRemaining(parseInt(e.target.value) || 0)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-3">
          <Label>Tags (Optional)</Label>
          <div className="flex flex-wrap gap-2">
            {commonTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-muted-foreground'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <Input
            placeholder="Add custom tags (comma-separated)"
            value={customTags}
            onChange={(e) => setCustomTags(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional observations about the food item..."
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            * Required fields
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isFormValid || isSubmitting}
              className="min-w-24"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Label
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your food labels help train our AI to provide more accurate freshness assessments. 
            All data is anonymized and used solely for improving our service.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  )
}