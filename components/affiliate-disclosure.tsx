"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Info } from "lucide-react"
import { AMAZON_AFFILIATE_DISCLOSURE } from "@/lib/affiliate-links"

interface AffiliateDisclosureProps {
  variant?: "short" | "full"
  className?: string
  showIcon?: boolean
}

export function AffiliateDisclosure({ 
  variant = "short", 
  className = "",
  showIcon = true 
}: AffiliateDisclosureProps) {
  const disclosureText = variant === "short" 
    ? AMAZON_AFFILIATE_DISCLOSURE.short 
    : AMAZON_AFFILIATE_DISCLOSURE.full

  return (
    <Card className={`bg-muted/50 border-muted ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          {showIcon && (
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Affiliate Links
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {disclosureText}
            </p>
            {variant === "short" && (
              <p className="text-xs text-muted-foreground">
                Prices and availability are subject to change. All affiliate links open in a new window.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function InlineAffiliateDisclosure({ className = "" }: { className?: string }) {
  return (
    <div className={`text-xs text-muted-foreground ${className}`}>
      <ExternalLink className="h-3 w-3 inline mr-1" />
      {AMAZON_AFFILIATE_DISCLOSURE.short}
    </div>
  )
}