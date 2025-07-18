"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Leaf, Scan } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { toast } from "sonner"

type ConfirmationState = 'loading' | 'success' | 'error' | 'expired'

function ConfirmPageContent() {
  const [state, setState] = useState<ConfirmationState>('loading')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmUser = async () => {
      try {
        // Get the token from URL parameters
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (!token_hash || !type) {
          setState('error')
          setError('Invalid confirmation link. Please request a new confirmation email.')
          return
        }

        // Verify the email confirmation
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any
        })

        if (error) {
          console.error('Confirmation error:', error)
          
          if (error.message?.includes('expired')) {
            setState('expired')
            setError('Confirmation link has expired. Please request a new one.')
          } else {
            setState('error')
            setError(error.message || 'Failed to confirm email. Please try again.')
          }
        } else {
          setState('success')
          toast.success('Email confirmed successfully!')
          
          // Redirect to main app after a short delay
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setState('error')
        setError('An unexpected error occurred. Please try again.')
      }
    }

    confirmUser()
  }, [searchParams, router])

  const handleResendConfirmation = async () => {
    const email = searchParams.get('email')
    if (!email) {
      toast.error('Email address not found. Please sign up again.')
      router.push('/auth')
      return
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        toast.error('Failed to resend confirmation: ' + error.message)
      } else {
        toast.success('Confirmation email sent! Please check your inbox.')
      }
    } catch (err) {
      toast.error('Failed to resend confirmation email')
    }
  }

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-fresh-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Confirming your email...</h2>
            <p className="text-muted-foreground">Please wait while we verify your account.</p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-green-600">Email Confirmed!</h2>
            <p className="text-muted-foreground mb-4">
              Your FreshSense account has been successfully verified.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to the app...
            </p>
          </div>
        )

      case 'expired':
        return (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-orange-600">Link Expired</h2>
            <p className="text-muted-foreground mb-6">
              Your confirmation link has expired. Please request a new one.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleResendConfirmation}
                className="w-full bg-fresh-green-600 hover:bg-fresh-green-700"
              >
                Resend Confirmation Email
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth')}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Confirmation Failed</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'Unable to confirm your email. Please try again.'}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleResendConfirmation}
                className="w-full bg-fresh-green-600 hover:bg-fresh-green-700"
              >
                Resend Confirmation Email
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth')}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )
    }
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
          <p className="text-muted-foreground mt-2">Email Confirmation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Verification</CardTitle>
            <CardDescription>
              Confirming your FreshSense account email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-fresh-green-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    }>
      <ConfirmPageContent />
    </Suspense>
  )
}