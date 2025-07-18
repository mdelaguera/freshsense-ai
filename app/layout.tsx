import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { AnalyticsProvider } from '@/components/analytics-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { AppHeader } from '@/components/app-header'

export const metadata: Metadata = {
  title: 'FreshSense - AI Food Freshness Analyzer',
  description: 'Upload food photos and get instant AI-powered freshness analysis. Reduce food waste with smart freshness detection.',
  keywords: 'food freshness, AI analysis, food waste, freshness detector, food safety',
  authors: [{ name: 'NuWorld Agency' }],
  creator: 'NuWorld Agency',
  publisher: 'NuWorld Agency',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#10b981',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-fresh-green/10 via-white to-sky-50 text-neutral-900 antialiased">
        <AuthProvider>
          <AnalyticsProvider>
            <AppHeader />
            <main className="min-h-[calc(100vh-80px)] w-full max-w-7xl mx-auto px-4 py-8">
              {children}
            </main>
          </AnalyticsProvider>
        </AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
