"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Smartphone, 
  Database, 
  BarChart3, 
  Shield, 
  Zap,
  Camera,
  Eye,
  Target,
  Clock,
  Users,
  Gauge,
  CheckCircle,
  ArrowRight,
  Lock,
  Globe,
  Server
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-fresh-green-600 mb-6">
            Powerful AI Features for Food Safety
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to make smarter food decisions, powered by cutting-edge artificial intelligence.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* AI-Powered Analysis */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-fresh-green-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-fresh-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">AI-Powered Food Analysis</CardTitle>
                    <CardDescription className="text-lg">Instant Expert Assessment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Computer Vision Technology:</strong> Powered by OpenAI's GPT-4o Vision API
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Multi-Factor Analysis:</strong> Examines color, texture, surface appearance, and spoilage signs
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Real-Time Processing:</strong> Results in under 5 seconds
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Detailed Explanations:</strong> Understand exactly why food is fresh or spoiled
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-fresh-green-50 text-fresh-green-700">
                  Perfect for: Daily meal prep, grocery shopping decisions, safety verification
                </Badge>
              </CardContent>
            </Card>

            {/* User-Friendly Interface */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-fresh-green-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-fresh-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">User-Friendly Interface</CardTitle>
                    <CardDescription className="text-lg">Designed for Everyone</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Drag & Drop Upload:</strong> Simply drag photos or click to upload
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Mobile Responsive:</strong> Works perfectly on phones, tablets, and computers
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Live Feedback:</strong> See processing status in real-time
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Clean Design:</strong> Intuitive interface requires no learning curve
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-fresh-green-50 text-fresh-green-700">
                  Perfect for: Busy families, elderly users, tech-savvy professionals
                </Badge>
              </CardContent>
            </Card>

            {/* Comprehensive Database */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-fresh-green-100 rounded-lg flex items-center justify-center">
                    <Database className="h-6 w-6 text-fresh-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Comprehensive Food Database</CardTitle>
                    <CardDescription className="text-lg">Supports All Food Types</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Wide Category Support:</strong> Fruits, vegetables, meat, dairy, baked goods, processed foods
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Specific Recommendations:</strong> Tailored advice for each food type
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Safety Guidelines:</strong> Clear consumption and disposal recommendations
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Storage Tips:</strong> Optimal storage conditions to extend freshness
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-fresh-green-50 text-fresh-green-700">
                  Perfect for: Home cooks, professional kitchens, food service industry
                </Badge>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-fresh-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-fresh-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Advanced Analytics & Insights</CardTitle>
                    <CardDescription className="text-lg">Professional-Grade Assessment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Freshness Scoring:</strong> 1-10 numerical rating system
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Risk Assessment:</strong> Clear indicators for food safety risks
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Shelf Life Estimation:</strong> Predicted remaining usable time
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Quality Indicators:</strong> Visual markers that influence assessment
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-fresh-green-50 text-fresh-green-700">
                  Perfect for: Restaurant managers, food safety professionals, quality control
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Technical Capabilities</h2>
            <p className="text-lg text-muted-foreground">Comprehensive analysis across all food categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fruits & Vegetables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-fresh-green-600" />
                  Fruits & Vegetables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Fresh produce analysis</li>
                  <li>• Ripeness assessment</li>
                  <li>• Spoilage detection</li>
                  <li>• Optimal consumption timing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Proteins & Dairy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-fresh-green-600" />
                  Proteins & Dairy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Meat freshness evaluation</li>
                  <li>• Dairy product safety</li>
                  <li>• Expiration risk assessment</li>
                  <li>• Storage condition analysis</li>
                </ul>
              </CardContent>
            </Card>

            {/* Prepared Foods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-fresh-green-600" />
                  Prepared Foods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Leftover safety assessment</li>
                  <li>• Baked goods evaluation</li>
                  <li>• Processed food analysis</li>
                  <li>• Meal prep planning</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground">Built for performance, accessibility, and integration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle className="text-lg">Accessibility</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• Screen reader compatible</p>
                <p>• Keyboard navigation</p>
                <p>• Multiple languages</p>
                <p>• Low bandwidth mode</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• Fast loading</p>
                <p>• Offline capability</p>
                <p>• Cross-platform</p>
                <p>• No installation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Server className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle className="text-lg">Integration</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• API access</p>
                <p>• Webhook support</p>
                <p>• Bulk processing</p>
                <p>• Custom branding</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• HTTPS encryption</p>
                <p>• No data storage</p>
                <p>• Privacy protection</p>
                <p>• Industry standards</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Benefits */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Benefits by User Type</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle>For Home Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• <strong>Save Money:</strong> Stop wasting good food</p>
                <p>• <strong>Family Safety:</strong> Prevent foodborne illness</p>
                <p>• <strong>Meal Planning:</strong> Better grocery and cooking decisions</p>
                <p>• <strong>Education:</strong> Learn to identify freshness indicators</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Server className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle>For Businesses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• <strong>Quality Control:</strong> Standardized freshness assessment</p>
                <p>• <strong>Staff Training:</strong> Consistent evaluation criteria</p>
                <p>• <strong>Compliance:</strong> Support regulatory requirements</p>
                <p>• <strong>Cost Reduction:</strong> Minimize food waste and liability</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Gauge className="h-8 w-8 text-fresh-green-600 mb-2" />
                <CardTitle>For Professionals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• <strong>Standardization:</strong> Consistent assessment protocols</p>
                <p>• <strong>Documentation:</strong> Trackable quality decisions</p>
                <p>• <strong>Efficiency:</strong> Faster than manual inspection</p>
                <p>• <strong>Accuracy:</strong> AI-powered precision</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-fresh-green-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start with our generous free tier that includes all core features
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-4 text-lg font-medium"
              asChild
            >
              <Link href="/home">
                Start Analyzing Food Now
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-fresh-green-600"
              asChild
            >
              <Link href="/pricing">
                View Pricing Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}