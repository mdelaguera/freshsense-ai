"use client"

import { AppHeader } from "@/components/app-header"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <UserDashboard />
      </main>
    </div>
  )
}