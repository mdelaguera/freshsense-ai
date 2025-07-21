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
  Package, 
  DollarSign,
  ExternalLink,
  Star,
  TrendingUp,
  ShoppingCart
} from "lucide-react"
import { AffiliateDisclosure } from "@/components/affiliate-disclosure"
import { generateValidatedAffiliateLink, trackAffiliateClick } from "@/lib/affiliate-links"

export function PurchaseHistory() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock purchase data - in real app, this would come from Amazon Fresh API
  const purchases = [
    {
      id: "1",
      orderNumber: "AF-2024-001",
      date: "2024-07-20",
      items: [
        { name: "Fresh Strawberries", quantity: 2, price: 5.99, imageUrl: "/api/placeholder/50/50" },
        { name: "Organic Spinach", quantity: 1, price: 3.49, imageUrl: "/api/placeholder/50/50" },
        { name: "Feta Cheese", quantity: 1, price: 4.99, imageUrl: "/api/placeholder/50/50" }
      ],
      total: 14.47,
      status: "delivered",
      recipe: "Strawberry Spinach Salad",
      savings: 2.30
    },
    {
      id: "2",
      orderNumber: "AF-2024-002",
      date: "2024-07-18",
      items: [
        { name: "Bell Peppers (3-pack)", quantity: 1, price: 4.99, imageUrl: "/api/placeholder/50/50" },
        { name: "Ground Turkey", quantity: 1, price: 6.99, imageUrl: "/api/placeholder/50/50" },
        { name: "Brown Rice", quantity: 1, price: 2.99, imageUrl: "/api/placeholder/50/50" }
      ],
      total: 14.97,
      status: "delivered",
      recipe: "Stuffed Bell Peppers",
      savings: 1.85
    },
    {
      id: "3",
      orderNumber: "AF-2024-003",
      date: "2024-07-16",
      items: [
        { name: "Bananas", quantity: 1, price: 1.99, imageUrl: "/api/placeholder/50/50" },
        { name: "Whole Wheat Flour", quantity: 1, price: 3.79, imageUrl: "/api/placeholder/50/50" },
        { name: "Eggs (12-pack)", quantity: 1, price: 3.99, imageUrl: "/api/placeholder/50/50" }
      ],
      total: 9.77,
      status: "delivered",
      recipe: "Banana Bread",
      savings: 1.20
    },
    {
      id: "4",
      orderNumber: "AF-2024-004",
      date: "2024-07-14",
      items: [
        { name: "Avocados (2-pack)", quantity: 1, price: 3.99, imageUrl: "/api/placeholder/50/50" },
        { name: "Cherry Tomatoes", quantity: 1, price: 4.49, imageUrl: "/api/placeholder/50/50" }
      ],
      total: 8.48,
      status: "processing",
      recipe: "Avocado Toast",
      savings: 0.85
    }
  ]

  const filteredPurchases = purchases.filter(purchase =>
    purchase.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.recipe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: "default",
      processing: "secondary",
      cancelled: "destructive"
    } as const
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.total, 0)
  const totalSavings = purchases.reduce((sum, purchase) => sum + purchase.savings, 0)

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Your Amazon Fresh ingredient orders from recipe suggestions</CardDescription>
            </div>
            <Button>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shop Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, recipes, or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Purchase Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{purchases.length}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${totalSavings.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Saved</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">${(totalSpent / purchases.length).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Avg Order</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase List */}
      <div className="space-y-4">
        {filteredPurchases.map((purchase) => (
          <Card key={purchase.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order {purchase.orderNumber}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(purchase.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    Recipe: {purchase.recipe}
                  </CardDescription>
                </div>
                <div className="text-right">
                  {getStatusBadge(purchase.status)}
                  <div className="text-lg font-bold mt-1">${purchase.total}</div>
                  <div className="text-sm text-green-600">Saved ${purchase.savings}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium">Items Ordered ({purchase.items.length})</h4>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {purchase.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyeyKFcFW2D6+KKhobhfAlIx40qHAAA=="
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-medium">${item.price}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Package className="h-3 w-3 mr-1" />
                      Track Order
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on Amazon
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      Earned {Math.round(purchase.total * 0.02 * 100)} points
                    </div>
                    <Button size="sm">
                      <Star className="h-3 w-3 mr-1" />
                      Rate Items
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPurchases.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No purchases found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "Try adjusting your search terms"
                : "Start shopping for recipe ingredients to see your order history here"
              }
            </p>
            <Button>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Ingredients
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Affiliate Disclosure - Required for Amazon Associates compliance */}
      <AffiliateDisclosure variant="full" className="mt-6" />
    </div>
  )
}