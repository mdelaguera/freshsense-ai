"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"

interface FoodFreshnessResultsProps {
  data: {
    identifiedFood: string
    visualAssessment: "Good" | "Poor - Use Immediately" | "Inedible - Discard Immediately"
    keyVisualIndicators: string
    estimatedRemainingFreshness: string
    assessmentConfidence: "High" | "Medium" | "Low"
    userNotes?: string
    imageUrl: string
  }
  onBack: () => void
}

export function FoodFreshnessResults({ data, onBack }: FoodFreshnessResultsProps) {
  // Helper function to determine badge color based on assessment
  const getAssessmentBadgeVariant = (assessment: string) => {
    if (assessment.includes("Good") || assessment.includes("Fresh")) return "success"
    if (assessment.includes("Fair") || assessment.includes("Soon")) return "secondary" 
    if (assessment.includes("Poor") || assessment.includes("Immediately")) return "warning"
    if (assessment.includes("Inedible") || assessment.includes("Discard")) return "destructive"
    return "secondary"
  }

  // Helper function to determine confidence badge color
  const getConfidenceBadgeVariant = (confidence: string) => {
    if (confidence === "High") return "success"
    if (confidence === "Medium") return "warning"
    if (confidence === "Low") return "destructive"
    return "secondary"
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12"
      aria-labelledby="analysis-results-heading"
    >
      <h2
        id="analysis-results-heading"
        className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-gradient bg-gradient-to-br from-primary-blue via-fresh-green to-sky-400 bg-clip-text text-transparent"
      >
        Analysis Results
      </h2>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 }
          }
        }}
      >
        {/* Image Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Card className="overflow-hidden h-auto bg-gradient-to-br from-surface via-sky-50 to-surface-dark border-0 shadow-xl">
            <CardHeader className="pb-2 px-4 py-3">
              <CardTitle className="text-lg font-semibold">Analyzed Image</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full rounded-lg overflow-hidden border border-slate-200" style={{ height: '250px' }}>
                <Image
                  src={data.imageUrl || '/placeholder.svg'}
                  alt={`Image of ${data.identifiedFood}`}
                  fill
                  className="object-cover transition-all duration-300 hover:scale-105"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyeyKFcFW2D6+KKhobhfAlIx40qHAAA=="
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Results Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-white via-sky-50 to-surface border-0 shadow-xl">
            <CardHeader className="px-6 py-4 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                  <span>{data.identifiedFood}</span>
                  <Badge
                    variant={getConfidenceBadgeVariant(data.assessmentConfidence)}
                    className="text-base px-3 py-1 rounded-full shadow-sm animate-pulse"
                  >
                    {data.assessmentConfidence} Confidence
                  </Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-2"
              >
                <h3 className="font-semibold text-lg">Visual Assessment</h3>
                <Badge
                  variant={getAssessmentBadgeVariant(data.visualAssessment)}
                  className="text-base px-3 py-1 rounded-full shadow"
                >
                  {data.visualAssessment}
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h3 className="font-semibold mb-1">Key Visual Indicators</h3>
                <p className="text-base text-muted-foreground bg-slate-50 rounded px-3 py-2 border border-slate-100">
                  {data.keyVisualIndicators}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold mb-1">Estimated Remaining Freshness</h3>
                <p className="text-lg font-medium text-fresh-green">
                  {data.estimatedRemainingFreshness} <span className="text-base font-normal text-muted-foreground">days</span>
                </p>
              </motion.div>
              {data.userNotes && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <h3 className="font-semibold mb-1">User Notes</h3>
                  <div className="bg-muted p-3 rounded-md text-base border border-slate-100">
                    {data.userNotes}
                  </div>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-6 py-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-muted-foreground bg-yellow-50 border-l-4 border-warning-amber pl-3 py-2 rounded"
              >
                DISCLAIMER: This assessment is based SOLELY on visual appearance. Always use proper food safety guidelines
                and your own judgment before consumption. Discard any food that shows signs of spoilage regardless of the
                assessment provided.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <Button
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary-blue to-fresh-green text-white shadow-lg hover:scale-[1.03] transition-transform duration-200"
                  onClick={onBack}
                  aria-label="Analyze another food"
                >
                  Analyze Another Food
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

