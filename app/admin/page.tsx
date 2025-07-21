"use client"

import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <main className="container mx-auto px-4 py-8">
          <AdminDashboard />
        </main>
      </div>
    </AdminGuard>
  )
}