"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  Building2, 
  GraduationCap, 
  Heart,
  Users,
  ChefHat,
  ShoppingCart,
  Stethoscope,
  Camera,
  Mountain,
  Quote,
  ArrowRight,
  CheckCircle
} from "lucide-react"

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-fresh-green-600 mb-6">
            Real Solutions for Real People
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how FreshSense AI transforms food decisions across different lifestyles, professions, and industries.
          </p>
        </div>
      </section>

      {/* Home & Family Use Cases */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4 flex items-center justify-center gap-3">
              <Home className="h-8 w-8" />
              Home & Family Use Cases
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Busy Parent */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">The Busy Parent</CardTitle>
                <CardDescription>Sarah, Mother of 3 - Denver, CO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                  <Quote className="h-4 w-4 text-red-600 mb-2" />
                  <p className="text-red-700 italic">
                    "Between work and kids, I often forget when I bought groceries. I hate throwing away food, but I'm terrified of making my family sick."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Solution:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Quick photo analysis before cooking dinner
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Peace of mind for children's lunch prep
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Saves $100+ monthly on food waste
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Teaching kids about food safety
                    </li>
                  </ul>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg border border-fresh-green-200">
                  <Quote className="h-4 w-4 text-fresh-green-600 mb-2" />
                  <p className="text-fresh-green-700 italic font-medium">
                    "FreshSense has become my kitchen safety net. My kids even use it now!"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Budget-Conscious Student */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">The Budget-Conscious Student</CardTitle>
                <CardDescription>Mike, College Senior - Austin, TX</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                  <Quote className="h-4 w-4 text-red-600 mb-2" />
                  <p className="text-red-700 italic">
                    "Living on ramen budget but wanting to eat healthy. Can't afford to waste a single apple or piece of bread."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Solution:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Maximizes every grocery dollar
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Analyzes discount produce purchases
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Plans meals around food freshness
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Learns food storage best practices
                    </li>
                  </ul>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg border border-fresh-green-200">
                  <Quote className="h-4 w-4 text-fresh-green-600 mb-2" />
                  <p className="text-fresh-green-700 italic font-medium">
                    "I've cut my food waste to almost zero. Every dollar counts in college."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Elderly Couple */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">The Elderly Couple</CardTitle>
                <CardDescription>Robert & Helen, Retirees - Phoenix, AZ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                  <Quote className="h-4 w-4 text-red-600 mb-2" />
                  <p className="text-red-700 italic">
                    "Our senses aren't what they used to be. We want to stay independent but worry about food safety."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Solution:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Simple interface with large buttons
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Clear safety recommendations
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Reduces food poisoning risk
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Maintains kitchen independence
                    </li>
                  </ul>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg border border-fresh-green-200">
                  <Quote className="h-4 w-4 text-fresh-green-600 mb-2" />
                  <p className="text-fresh-green-700 italic font-medium">
                    "It's like having a food safety expert in our pocket."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Meal Prep Enthusiast */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">The Meal Prep Enthusiast</CardTitle>
                <CardDescription>Lisa, Fitness Coach - Miami, FL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                  <Quote className="h-4 w-4 text-red-600 mb-2" />
                  <p className="text-red-700 italic">
                    "I prep meals for the whole week, but some ingredients spoil faster than others. Timing is everything."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Solution:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Plans prep based on ingredient freshness
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Maximizes meal storage life
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Prevents workout nutrition disruption
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Optimizes grocery shopping timing
                    </li>
                  </ul>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg border border-fresh-green-200">
                  <Quote className="h-4 w-4 text-fresh-green-600 mb-2" />
                  <p className="text-fresh-green-700 italic font-medium">
                    "My meal prep game is now scientifically optimized."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional & Business Use Cases */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4 flex items-center justify-center gap-3">
              <Building2 className="h-8 w-8" />
              Professional & Business Use Cases
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Restaurant Quality Control */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Restaurant Quality Control
                </CardTitle>
                <CardDescription>Chef Rodriguez, Fine Dining Restaurant - Chicago, IL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                  <Quote className="h-4 w-4 text-red-600 mb-2" />
                  <p className="text-red-700 italic">
                    "Food safety regulations are strict, and one bad ingredient can shut us down or make customers sick."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Solution:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Staff training on consistent quality standards
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Quick verification of delivery freshness
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Documentation for health inspections
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Reduces liability and waste costs
                    </li>
                  </ul>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg border border-fresh-green-200">
                  <Quote className="h-4 w-4 text-fresh-green-600 mb-2" />
                  <p className="text-fresh-green-700 italic font-medium">
                    "Our food safety scores improved 40% since implementing FreshSense."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grocery Store Training */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Grocery Store Training
                </CardTitle>
                <CardDescription>Manager Kim, Regional Grocery Chain - Seattle, WA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                  <Quote className="h-4 w-4 text-red-600 mb-2" />
                  <p className="text-red-700 italic">
                    "Training new employees to identify fresh produce is time-consuming and inconsistent across stores."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Solution:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Standardized training tool for all staff
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Consistent quality assessments
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Customer service enhancement
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Reduced customer complaints
                    </li>
                  </ul>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg border border-fresh-green-200">
                  <Quote className="h-4 w-4 text-fresh-green-600 mb-2" />
                  <p className="text-fresh-green-700 italic font-medium">
                    "New hires are produce experts within days, not weeks."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Nutrition */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Hospital Nutrition Services
                </CardTitle>
                <CardDescription>Dietitian Mark, Regional Medical Center - Houston, TX</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                  <Quote className="h-4 w-4 text-red-600 mb-2" />
                  <p className="text-red-700 italic">
                    "Immunocompromised patients require absolute food safety. No room for error."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Solution:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Medical-grade food safety verification
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Documentation for patient records
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Staff training on critical food handling
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Prevents healthcare-associated infections
                    </li>
                  </ul>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg border border-fresh-green-200">
                  <Quote className="h-4 w-4 text-fresh-green-600 mb-2" />
                  <p className="text-fresh-green-700 italic font-medium">
                    "Added layer of safety for our most vulnerable patients."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Culinary School */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Culinary School Training
                </CardTitle>
                <CardDescription>Chef Instructor Maria, Culinary Institute - New York, NY</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                  <Quote className="h-4 w-4 text-red-600 mb-2" />
                  <p className="text-red-700 italic">
                    "Students need to learn food safety intuitively, not just from textbooks."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Solution:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Hands-on learning with real food
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Instant feedback on assessments
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Consistent evaluation standards
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                      Modern technology integration
                    </li>
                  </ul>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg border border-fresh-green-200">
                  <Quote className="h-4 w-4 text-fresh-green-600 mb-2" />
                  <p className="text-fresh-green-700 italic font-medium">
                    "Students graduate with practical food safety skills."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Industry-Specific Benefits</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <ChefHat className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle className="text-lg">Food Service</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• Quality control consistency</p>
                <p>• Rapid staff training</p>
                <p>• Health inspection docs</p>
                <p>• Reduced waste costs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle className="text-lg">Healthcare</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• Patient safety protection</p>
                <p>• Medical record keeping</p>
                <p>• Clear decision protocols</p>
                <p>• Risk reduction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle className="text-lg">Education</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• Practical safety education</p>
                <p>• Research methodology</p>
                <p>• Student safety</p>
                <p>• Cost management</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle className="text-lg">Retail</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• Customer service</p>
                <p>• Staff training</p>
                <p>• Waste reduction</p>
                <p>• Reputation protection</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-fresh-green-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Food Decisions?</h2>
          <p className="text-xl mb-8 opacity-90">
            See how FreshSense AI can solve your specific food safety and waste challenges
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-4 text-lg font-medium"
              asChild
            >
              <Link href="/home">
                Start Your Free Trial
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-fresh-green-600"
              asChild
            >
              <Link href="/pricing">
                Contact Sales for Business
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}