"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AffiliateDisclosure } from "@/components/affiliate-disclosure"
import { runAffiliateLinkTests, quickTrackingTest, generateSampleLinks } from "@/lib/affiliate-link-tester"
import { ExternalLink, CheckCircle, XCircle, TestTube } from "lucide-react"

export default function TestAffiliatePage() {
  const [testResults, setTestResults] = useState<ReturnType<typeof runAffiliateLinkTests> | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500))
    const results = runAffiliateLinkTests()
    setTestResults(results)
    setIsRunning(false)
  }

  const sampleLinks = generateSampleLinks()
  const quickTest = quickTrackingTest()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Amazon Affiliate Link Testing</h1>
          <p className="text-muted-foreground">Test and validate affiliate link generation with tracking ID: freshsense-20</p>
        </div>

        {/* Quick Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {quickTest ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Quick Status Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Tracking ID Status: {quickTest ? (
                <Badge className="bg-green-500">✓ Working - freshsense-20 detected</Badge>
              ) : (
                <Badge variant="destructive">✗ Not detected</Badge>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Sample Links */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Affiliate Links</CardTitle>
            <CardDescription>Test links with freshsense-20 tracking ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(sampleLinks).map(([name, link]) => (
                <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{name.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-48">
                      {link}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Runner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Comprehensive Testing
            </CardTitle>
            <CardDescription>Run full test suite to validate affiliate link implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="mb-4"
            >
              {isRunning ? "Running Tests..." : "Run Affiliate Link Tests"}
            </Button>

            {testResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{testResults.totalTests}</div>
                    <div className="text-sm text-muted-foreground">Total Tests</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{testResults.passedTests}</div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{testResults.failedTests}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {result.status === 'pass' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{result.test}</div>
                          <div className="text-xs text-muted-foreground">{result.details}</div>
                        </div>
                      </div>
                      {result.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(result.link, '_blank', 'noopener,noreferrer')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Manual Link Testing</h4>
              <p className="text-sm text-muted-foreground">
                Click the sample links above to verify they open on Amazon with proper tracking. 
                Look for "freshsense-20" in the URL or check that the URL contains your affiliate tag.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. Automated Validation</h4>
              <p className="text-sm text-muted-foreground">
                Run the comprehensive test suite to validate link generation, categorization, 
                and compliance with Amazon Associates guidelines.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. Expected Behavior</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All links should contain "tag=freshsense-20"</li>
                <li>• Fresh items should link to Amazon Fresh</li>
                <li>• Pantry items should link to regular Amazon</li>
                <li>• Links should open in new window/tab</li>
                <li>• All links should be properly encoded</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Required Disclosure */}
        <AffiliateDisclosure variant="full" />
      </div>
    </div>
  )
}