"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Leaf } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the enhanced homepage
    router.push('/home')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Leaf className="h-12 w-12 text-fresh-green-600 mr-4" />
          <Loader2 className="h-6 w-6 text-fresh-green-500 animate-spin" />
        </div>
        <h1 className="text-3xl font-bold text-fresh-green-600 mb-2">FreshSense</h1>
        <p className="text-muted-foreground">Loading your food analysis experience...</p>
      </div>
    </div>
  )
}
