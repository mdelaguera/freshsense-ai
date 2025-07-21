"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PastScans } from "./past-scans"
import { RecipeCollection } from "./recipe-collection"
import { PurchaseHistory } from "./purchase-history"
import { ActivityFeed } from "./activity-feed"
import { 
  Camera, 
  ChefHat, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  Star,
  Target,
  Clock
} from "lucide-react"

export function UserDashboard() {
  // Mock user data - in real app, this would come from authentication
  const user = {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "",
    joinDate: "2024-01-15",
    stats: {
      totalScans: 127,
      recipesGenerated: 89,
      moneySaved: 234.50,
      accuracyRate: 94.2
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.totalScans}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipes Generated</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.recipesGenerated}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${user.stats.moneySaved}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+$23.40</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.accuracyRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.5%</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="scans" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scans">Past Scans</TabsTrigger>
          <TabsTrigger value="recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="scans" className="space-y-4">
          <PastScans />
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <RecipeCollection />
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <PurchaseHistory />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityFeed />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button className="h-16 flex-col gap-2" variant="outline">
            <Camera className="h-6 w-6" />
            Scan New Food
          </Button>
          <Button className="h-16 flex-col gap-2" variant="outline">
            <ChefHat className="h-6 w-6" />
            Browse Recipes
          </Button>
          <Button className="h-16 flex-col gap-2" variant="outline">
            <ShoppingCart className="h-6 w-6" />
            Shop Ingredients
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}