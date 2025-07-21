"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Check, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  ArrowRight,
  CheckCircle,
  X,
  Crown,
  Building2,
  Heart
} from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fresh-green-50 via-white to-fresh-green-100">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-fresh-green-600 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free, upgrade anytime, cancel whenever you want.
          </p>
          
          <div className="bg-fresh-green-50 p-6 rounded-lg border border-fresh-green-200 max-w-2xl mx-auto">
            <p className="text-fresh-green-700 font-medium">
              We believe food safety technology should be accessible to everyone. That's why we offer a generous free tier and transparent pricing with no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Free Plan */}
            <Card className="h-full relative">
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-fresh-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-fresh-green-600" />
                </div>
                <CardTitle className="text-2xl">Early Adopter</CardTitle>
                <CardDescription className="text-lg">Perfect for households and light users</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-fresh-green-600">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>50 analyses per month</strong>
                      <p className="text-sm text-muted-foreground">Enough for daily household use</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>All core features</strong>
                      <p className="text-sm text-muted-foreground">Full AI-powered food analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Mobile & desktop access</strong>
                      <p className="text-sm text-muted-foreground">Use anywhere, anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Basic support</strong>
                      <p className="text-sm text-muted-foreground">Email support within 48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Privacy protection</strong>
                      <p className="text-sm text-muted-foreground">No data storage or sharing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>No credit card required</strong>
                      <p className="text-sm text-muted-foreground">Start immediately</p>
                    </div>
                  </div>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Best For:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Families and individuals</li>
                    <li>• Testing the platform</li>
                    <li>• Light food safety needs</li>
                    <li>• Students and budget-conscious users</li>
                  </ul>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/auth">
                    Start Free Now
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="h-full relative border-fresh-green-400 border-2">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-fresh-green-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-fresh-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-fresh-green-600" />
                </div>
                <CardTitle className="text-2xl">Power User</CardTitle>
                <CardDescription className="text-lg">Ideal for frequent users and small businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-fresh-green-600">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">or $99/year (Save 17%)</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Everything in Free, plus:
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>500 analyses per month</strong>
                      <p className="text-sm text-muted-foreground">10x more capacity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Priority processing</strong>
                      <p className="text-sm text-muted-foreground">Faster analysis results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Advanced analytics</strong>
                      <p className="text-sm text-muted-foreground">Detailed insights and trends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Batch upload</strong>
                      <p className="text-sm text-muted-foreground">Analyze multiple items at once</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Email reports</strong>
                      <p className="text-sm text-muted-foreground">Weekly summaries and insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Priority support</strong>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>API access</strong>
                      <p className="text-sm text-muted-foreground">Basic integration capabilities</p>
                    </div>
                  </div>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Best For:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Active home cooks and meal preppers</li>
                    <li>• Small restaurants and cafes</li>
                    <li>• Food bloggers and content creators</li>
                    <li>• Professional home organizers</li>
                  </ul>
                </div>

                <Button className="w-full bg-fresh-green-600 hover:bg-fresh-green-700" size="lg">
                  Start Pro Trial - 14 Days Free
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="h-full relative">
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-fresh-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-fresh-green-600" />
                </div>
                <CardTitle className="text-2xl">Business Solution</CardTitle>
                <CardDescription className="text-lg">Tailored for organizations and high-volume users</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-fresh-green-600">Custom</span>
                  <span className="text-muted-foreground"> Pricing</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Everything in Pro, plus:
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Unlimited analyses</strong>
                      <p className="text-sm text-muted-foreground">No monthly limits</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Custom integrations</strong>
                      <p className="text-sm text-muted-foreground">Full API access</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Team management</strong>
                      <p className="text-sm text-muted-foreground">Multi-user accounts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>White-label options</strong>
                      <p className="text-sm text-muted-foreground">Brand customization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>SLA guarantees</strong>
                      <p className="text-sm text-muted-foreground">99.9% uptime commitment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Dedicated support</strong>
                      <p className="text-sm text-muted-foreground">Phone and priority chat</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-fresh-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Training sessions</strong>
                      <p className="text-sm text-muted-foreground">Staff onboarding and education</p>
                    </div>
                  </div>
                </div>

                <div className="bg-fresh-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Best For:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Restaurant chains and franchises</li>
                    <li>• Food service companies</li>
                    <li>• Healthcare and senior living facilities</li>
                    <li>• Educational institutions</li>
                    <li>• Grocery stores and retailers</li>
                  </ul>
                </div>

                <Button variant="outline" className="w-full" size="lg">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Detailed Feature Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold">Pro</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Monthly Analyses</td>
                  <td className="text-center p-4">50</td>
                  <td className="text-center p-4">500</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-4">Core AI Analysis</td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Mobile & Desktop</td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-4">Privacy Protection</td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Priority Processing</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-4">Batch Upload</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Advanced Analytics</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-4">API Access</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4">Basic</td>
                  <td className="text-center p-4">Full</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Email Reports</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-4">Team Management</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">White-label Options</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-4">SLA Guarantee</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">Phone Support</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-fresh-green-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Usage Examples</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-fresh-green-600" />
                  Free Plan Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">• Daily household use: Check leftovers, produce, dairy</p>
                <p className="text-sm">• Weekly grocery trips: Verify freshness of purchases</p>
                <p className="text-sm">• Meal planning: Assess ingredients before cooking</p>
                <p className="text-sm">• Learning tool: Understand food freshness indicators</p>
                <div className="bg-fresh-green-50 p-3 rounded text-sm">
                  <strong>Example:</strong> Family of 4 using 1-2 analyses per day = ~45/month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-fresh-green-600" />
                  Pro Plan Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">• Meal prep business: Assess ingredients for weekly prep</p>
                <p className="text-sm">• Small restaurant: Quality control for daily deliveries</p>
                <p className="text-sm">• Food blogger: Ensure perfect ingredients for photography</p>
                <p className="text-sm">• Catering service: Pre-event ingredient verification</p>
                <div className="bg-fresh-green-50 p-3 rounded text-sm">
                  <strong>Example:</strong> Small cafe analyzing 15-20 items daily = ~450/month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-fresh-green-600" />
                  Enterprise Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">• Hospital cafeteria: All meal ingredients verification</p>
                <p className="text-sm">• School district: Multi-location food safety protocols</p>
                <p className="text-sm">• Grocery chain: Staff training and customer service</p>
                <p className="text-sm">• Food manufacturer: Quality control processes</p>
                <div className="bg-fresh-green-50 p-3 rounded text-sm">
                  <strong>Example:</strong> Regional chain analyzing hundreds of items daily
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Money-Back Guarantee */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">30-Day Satisfaction Guarantee</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Try FreshSense AI risk-free. If you're not completely satisfied within 30 days, we'll refund your money, no questions asked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-fresh-green-600 mb-2">95%</div>
              <p className="text-sm text-muted-foreground">Customer satisfaction rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-fresh-green-600 mb-2">$100+</div>
              <p className="text-sm text-muted-foreground">Average household saves monthly</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-fresh-green-600 mb-2">Zero</div>
              <p className="text-sm text-muted-foreground">Food safety incidents reported</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-fresh-green-600 mb-2">99.9%</div>
              <p className="text-sm text-muted-foreground">AI accuracy rates</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Pricing FAQ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How does billing work?</h3>
                <p className="text-sm text-muted-foreground">
                  Free: No billing, no credit card required<br/>
                  Pro: Billed monthly or annually (17% discount for annual)<br/>
                  Enterprise: Custom billing terms based on usage and features
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What happens if I exceed my limit?</h3>
                <p className="text-sm text-muted-foreground">
                  Free users: Analysis paused until next month, or upgrade to Pro<br/>
                  Pro users: Additional analyses at $0.05 per image<br/>
                  Enterprise: No limits, unlimited usage included
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I change plans?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Upgrade or downgrade anytime. Changes take effect immediately, with prorated billing.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Is there a contract commitment?</h3>
                <p className="text-sm text-muted-foreground">
                  Free & Pro: No contract, cancel anytime<br/>
                  Enterprise: Flexible terms from month-to-month to annual contracts
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  Credit cards (Visa, MasterCard, American Express), PayPal for individual plans, Invoice billing for Enterprise customers, Purchase orders for qualified organizations
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Do you offer discounts?</h3>
                <p className="text-sm text-muted-foreground">
                  Students: 50% off Pro plan with valid student ID<br/>
                  Non-profits: 25% off all paid plans<br/>
                  Healthcare: Special pricing for hospitals and clinics<br/>
                  Education: Volume discounts for schools and universities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-fresh-green-600 mb-4">Need Help Choosing?</h2>
            <p className="text-lg text-muted-foreground">
              Our team is here to help you find the perfect plan for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <MessageCircle className="h-8 w-8 text-fresh-green-600 mx-auto mb-2" />
                <CardTitle>Chat with Sales</CardTitle>
                <CardDescription>Available Monday-Friday, 9 AM - 6 PM EST</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Calendar className="h-8 w-8 text-fresh-green-600 mx-auto mb-2" />
                <CardTitle>Schedule a Demo</CardTitle>
                <CardDescription>See FreshSense in action with your own food items</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Book Demo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Mail className="h-8 w-8 text-fresh-green-600 mx-auto mb-2" />
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get answers to technical questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="mailto:pricing@freshsense.ai">
                    Email Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-fresh-green-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Choose your plan and start making smarter food decisions today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-4 text-lg font-medium"
              asChild
            >
              <Link href="/auth">
                Start Free Today
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-fresh-green-600"
            >
              Schedule Enterprise Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-sm opacity-80 mt-6">
            Questions about pricing? Email us at pricing@freshsense.ai or call 1-800-FRESH-AI
          </p>
        </div>
      </section>
    </div>
  )
}