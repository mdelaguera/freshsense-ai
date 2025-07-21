"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { 
  Search, 
  Calendar, 
  Eye, 
  ChefHat,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"

export function PastScans() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - in real app, this would come from user's scan history
  const scans = [
    {
      id: "1",
      foodItem: "Fresh Strawberries",
      scanDate: "2024-07-20",
      freshness: "fresh",
      confidence: 94.2,
      remainingDays: 3,
      imageUrl: "/api/placeholder/100/100",
      recipesGenerated: 3,
      purchased: true
    },
    {
      id: "2", 
      foodItem: "Bananas",
      scanDate: "2024-07-19",
      freshness: "soon",
      confidence: 89.1,
      remainingDays: 1,
      imageUrl: "/api/placeholder/100/100",
      recipesGenerated: 2,
      purchased: false
    },
    {
      id: "3",
      foodItem: "Spinach Leaves",
      scanDate: "2024-07-18",
      freshness: "fresh",
      confidence: 96.8,
      remainingDays: 5,
      imageUrl: "/api/placeholder/100/100",
      recipesGenerated: 4,
      purchased: true
    },
    {
      id: "4",
      foodItem: "Tomatoes",
      scanDate: "2024-07-17",
      freshness: "spoiled",
      confidence: 91.5,
      remainingDays: 0,
      imageUrl: "/api/placeholder/100/100",
      recipesGenerated: 1,
      purchased: false
    },
    {
      id: "5",
      foodItem: "Bell Peppers",
      scanDate: "2024-07-16",
      freshness: "fresh",
      confidence: 88.3,
      remainingDays: 4,
      imageUrl: "/api/placeholder/100/100",
      recipesGenerated: 3,
      purchased: true
    }
  ]

  const filteredScans = scans.filter(scan =>
    scan.foodItem.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFreshnessIcon = (freshness: string) => {
    switch (freshness) {
      case "fresh":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "soon":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "spoiled":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getFreshnessBadge = (freshness: string) => {
    const variants = {
      fresh: "default",
      soon: "secondary", 
      spoiled: "destructive"
    } as const
    
    return <Badge variant={variants[freshness as keyof typeof variants]}>{freshness}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Past Food Scans</CardTitle>
              <CardDescription>View your food analysis history and generated recipes</CardDescription>
            </div>
            <Button>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{scans.filter(s => s.freshness === 'fresh').length}</div>
              <div className="text-sm text-muted-foreground">Fresh Items</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{scans.filter(s => s.freshness === 'soon').length}</div>
              <div className="text-sm text-muted-foreground">Use Soon</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{scans.filter(s => s.freshness === 'spoiled').length}</div>
              <div className="text-sm text-muted-foreground">Spoiled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scans Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Item</TableHead>
                <TableHead>Scan Date</TableHead>
                <TableHead>Freshness</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Recipes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={scan.imageUrl}
                        alt={scan.foodItem}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyeyKFcFW2D6+KKhobhfAlIx40qHAAA=="
                      />
                      <div>
                        <div className="font-medium">{scan.foodItem}</div>
                        <div className="text-sm text-muted-foreground">
                          {scan.purchased && <Badge variant="outline" className="text-xs">Purchased</Badge>}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(scan.scanDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFreshnessIcon(scan.freshness)}
                      {getFreshnessBadge(scan.freshness)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{scan.confidence}%</TableCell>
                  <TableCell>
                    <Badge variant={scan.remainingDays > 2 ? "default" : scan.remainingDays > 0 ? "secondary" : "destructive"}>
                      {scan.remainingDays > 0 ? `${scan.remainingDays} days` : "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ChefHat className="h-3 w-3" />
                      <span className="text-sm">{scan.recipesGenerated}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <ChefHat className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}