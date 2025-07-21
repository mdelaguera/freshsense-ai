"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Camera, 
  ChefHat, 
  ShoppingCart, 
  Star,
  Heart,
  Share2,
  Award,
  TrendingUp,
  Calendar,
  Clock
} from "lucide-react"

export function ActivityFeed() {
  // Mock activity data - in real app, this would come from user's activity log
  const activities = [
    {
      id: "1",
      type: "scan",
      title: "Scanned Fresh Strawberries",
      description: "Generated 3 new recipes including Strawberry Spinach Salad",
      timestamp: "2024-07-20T14:30:00Z",
      icon: Camera,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      metadata: {
        confidence: 94.2,
        freshness: "fresh"
      }
    },
    {
      id: "2",
      type: "recipe",
      title: "Saved Banana Bread Recipe",
      description: "Added to favorites after successful baking",
      timestamp: "2024-07-19T20:15:00Z",
      icon: ChefHat,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      metadata: {
        rating: 4.9,
        difficulty: "Medium"
      }
    },
    {
      id: "3",
      type: "purchase",
      title: "Ordered Ingredients",
      description: "Purchased items for Stuffed Bell Peppers recipe via Amazon Fresh",
      timestamp: "2024-07-18T16:45:00Z",
      icon: ShoppingCart,
      color: "text-green-500",
      bgColor: "bg-green-100",
      metadata: {
        amount: 14.97,
        items: 3
      }
    },
    {
      id: "4",
      type: "achievement",
      title: "Recipe Master Badge Earned!",
      description: "Generated 50+ recipes from food scans",
      timestamp: "2024-07-17T12:00:00Z",
      icon: Award,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      metadata: {
        badge: "Recipe Master",
        progress: "50/50"
      }
    },
    {
      id: "5",
      type: "rating",
      title: "Rated Spinach Quiche Recipe",
      description: "Gave 5 stars and shared cooking tips",
      timestamp: "2024-07-16T19:30:00Z",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      metadata: {
        rating: 5,
        shared: true
      }
    },
    {
      id: "6",
      type: "scan",
      title: "Scanned Bell Peppers",
      description: "Identified optimal freshness and generated recipe suggestions",
      timestamp: "2024-07-16T11:20:00Z",
      icon: Camera,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      metadata: {
        confidence: 88.3,
        freshness: "fresh"
      }
    },
    {
      id: "7",
      type: "milestone",
      title: "100th Food Scan!",
      description: "Reached a major milestone in your food freshness journey",
      timestamp: "2024-07-15T14:00:00Z",
      icon: TrendingUp,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      metadata: {
        milestone: 100,
        total_saved: 150.25
      }
    }
  ]

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const getActivityIcon = (activity: typeof activities[0]) => {
    const IconComponent = activity.icon
    return (
      <div className={`p-2 rounded-full ${activity.bgColor}`}>
        <IconComponent className={`h-4 w-4 ${activity.color}`} />
      </div>
    )
  }

  const renderMetadata = (activity: typeof activities[0]) => {
    switch (activity.type) {
      case "scan":
        return (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {activity.metadata.confidence}% confidence
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activity.metadata.freshness}
            </Badge>
          </div>
        )
      case "recipe":
        return (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              ⭐ {activity.metadata.rating}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activity.metadata.difficulty}
            </Badge>
          </div>
        )
      case "purchase":
        return (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              ${activity.metadata.amount}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activity.metadata.items} items
            </Badge>
          </div>
        )
      case "achievement":
        return (
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs bg-purple-500">
              {activity.metadata.badge}
            </Badge>
          </div>
        )
      case "rating":
        return (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              ⭐ {activity.metadata.rating} stars
            </Badge>
            {activity.metadata.shared && (
              <Badge variant="outline" className="text-xs">
                <Share2 className="h-2 w-2 mr-1" />
                Shared
              </Badge>
            )}
          </div>
        )
      case "milestone":
        return (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              #{activity.metadata.milestone} scans
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              ${activity.metadata.total_saved} saved
            </Badge>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>Your recent activity and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Activity Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {activities.filter(a => a.type === 'scan').length}
              </div>
              <div className="text-sm text-muted-foreground">Scans This Week</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {activities.filter(a => a.type === 'recipe').length}
              </div>
              <div className="text-sm text-muted-foreground">Recipes Saved</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.type === 'purchase').length}
              </div>
              <div className="text-sm text-muted-foreground">Orders Placed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4 pb-4 border-b border-border/50 last:border-0">
                {getActivityIcon(activity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  {renderMetadata(activity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Full History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Your progress and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="p-2 rounded-full bg-purple-100">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="font-medium">Recipe Master</div>
                <div className="text-sm text-muted-foreground">Generated 50+ recipes</div>
              </div>
              <Badge className="ml-auto bg-purple-500">Earned</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="p-2 rounded-full bg-blue-100">
                <Camera className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="font-medium">Scan Expert</div>
                <div className="text-sm text-muted-foreground">100+ food scans</div>
              </div>
              <Badge className="ml-auto bg-blue-500">Earned</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg opacity-60">
              <div className="p-2 rounded-full bg-green-100">
                <ShoppingCart className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="font-medium">Smart Shopper</div>
                <div className="text-sm text-muted-foreground">Save $500 with recommendations</div>
              </div>
              <Badge variant="outline" className="ml-auto">47%</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg opacity-60">
              <div className="p-2 rounded-full bg-yellow-100">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <div className="font-medium">Review Champion</div>
                <div className="text-sm text-muted-foreground">Rate 25 recipes</div>
              </div>
              <Badge variant="outline" className="ml-auto">12/25</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}