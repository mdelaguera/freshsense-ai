"use client"

import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <main className="container mx-auto px-4 py-8">
          <UserDashboard />
        </main>
      </div>
    </ProtectedRoute>
  )
}