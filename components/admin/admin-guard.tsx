"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Lock } from "lucide-react"
import { isAdminUser, getCurrentUserEmail, setCurrentUserEmail, getAdminUserInfo } from "@/lib/admin-auth"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check current user on mount
    const email = getCurrentUserEmail()
    setCurrentEmail(email)
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!loginEmail.trim()) {
      setError("Please enter your email address")
      return
    }

    if (isAdminUser(loginEmail)) {
      setCurrentUserEmail(loginEmail)
      setCurrentEmail(loginEmail)
      setLoginEmail("")
    } else {
      setError("Unauthorized: This email does not have admin access")
    }
  }

  const handleLogout = () => {
    setCurrentEmail(null)
    setCurrentUserEmail("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Checking admin access...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user is authorized
  if (!isAdminUser(currentEmail)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <Lock className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-xl">Admin Access Required</CardTitle>
            <CardDescription>
              This area is restricted to authorized administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Admin Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Access Admin Panel
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Only authorized FreshSense administrators can access this panel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authorized - show admin panel with user info
  const adminUser = getAdminUserInfo(currentEmail)

  return (
    <div>
      {/* Admin Header Bar */}
      <div className="bg-primary text-primary-foreground px-4 py-2 text-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Admin Panel - Welcome, {adminUser?.name}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Logout
          </Button>
        </div>
      </div>
      
      {children}
    </div>
  )
}