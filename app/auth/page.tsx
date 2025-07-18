"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Leaf, Scan, Mail, Lock, User } from "lucide-react"
import { useAuth } from '@/contexts/auth-context'
import { toast } from "sonner"

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const { signIn, signUp, resetPassword } = useAuth()
  const router = useRouter()

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      toast.error("Sign in failed: " + error.message)
    } else {
      toast.success("Welcome back!")
      router.push('/')
    }
    
    setLoading(false)
  }

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
      toast.error("Sign up failed: " + error.message)
    } else {
      toast.success("Account created! Please check your email to verify your account.")
    }
    
    setLoading(false)
  }

  const handleResetPassword = async (email: string) => {
    setLoading(true)
    setError(null)

    const { error } = await resetPassword(email)
    
    if (error) {
      setError(error.message)
      toast.error("Reset failed: " + error.message)
    } else {
      setResetEmailSent(true)
      toast.success("Password reset email sent!")
    }
    
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100 py-8">
      <div className="container mx-auto px-4 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Leaf className="h-8 w-8 text-fresh-green-600 mr-3" />
              <Scan className="h-4 w-4 text-fresh-green-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-fresh-green-600">FreshSense</h1>
          <p className="text-muted-foreground mt-2">AI-Powered Food Freshness Analyzer</p>
          <p className="text-xs text-fresh-green-600 mt-1">Reduce waste • Save money • Stay healthy</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Welcome Back
                </CardTitle>
                <CardDescription>
                  Sign in to your FreshSense account to continue analyzing food freshness
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SignInForm 
                  onSubmit={handleSignIn}
                  loading={loading}
                  error={error}
                />
                <div className="text-center">
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => {
                      const email = (document.getElementById('signin-email') as HTMLInputElement)?.value
                      if (email) {
                        handleResetPassword(email)
                      } else {
                        toast.error("Please enter your email address first")
                      }
                    }}
                    disabled={loading}
                  >
                    Forgot your password?
                  </Button>
                </div>
                {resetEmailSent && (
                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription>
                      Check your email for password reset instructions.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Create Account
                </CardTitle>
                <CardDescription>
                  Join FreshSense to start analyzing your food's freshness with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SignUpForm 
                  onSubmit={handleSignUp}
                  loading={loading}
                  error={error}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function SignInForm({ 
  onSubmit, 
  loading, 
  error 
}: { 
  onSubmit: (email: string, password: string) => void
  loading: boolean
  error: string | null
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signin-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signin-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-fresh-green-600 hover:bg-fresh-green-700" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}

function SignUpForm({ 
  onSubmit, 
  loading, 
  error 
}: { 
  onSubmit: (email: string, password: string) => void
  loading: boolean
  error: string | null
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }
    
    setPasswordError(null)
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || passwordError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || passwordError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
            minLength={6}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-fresh-green-600 hover:bg-fresh-green-700" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}