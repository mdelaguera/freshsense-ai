"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Loader2, Leaf, Scan } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Leaf className="h-8 w-8 text-fresh-green-600 mr-3" />
              <Scan className="h-4 w-4 text-fresh-green-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-fresh-green-600 mb-4">FreshSense</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth page
  }

  return <>{children}</>
}