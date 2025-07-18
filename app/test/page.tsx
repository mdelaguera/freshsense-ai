"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/image-upload"
import { analyzeFoodImage } from "@/lib/api"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface TestResult {
  testName: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  details?: string;
  duration?: number;
}

export default function TestPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([
    { testName: "File Upload Validation", status: "pending" },
    { testName: "Image Preview Generation", status: "pending" },
    { testName: "API Integration Test", status: "pending" },
    { testName: "N8N Webhook Response", status: "pending" },
    { testName: "Error Handling", status: "pending" },
  ])

  const updateTestResult = (testName: string, status: TestResult['status'], details?: string, duration?: number) => {
    setTestResults(prev => prev.map(test => 
      test.testName === testName 
        ? { ...test, status, details, duration }
        : test
    ))
  }

  const handleImageSelected = async (file: File) => {
    setSelectedImage(file)
    
    // Test 1: File Upload Validation
    updateTestResult("File Upload Validation", "running")
    const startTime = Date.now()
    
    try {
      // Check if file is valid
      const isValid = file.size <= 10 * 1024 * 1024 && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
      
      if (isValid) {
        updateTestResult("File Upload Validation", "passed", 
          `File: ${file.name}, Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB, Type: ${file.type}`,
          Date.now() - startTime)
      } else {
        updateTestResult("File Upload Validation", "failed", 
          `Invalid file: Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB, Type: ${file.type}`)
      }

      // Test 2: Image Preview Generation
      updateTestResult("Image Preview Generation", "running")
      const previewStartTime = Date.now()
      
      const objectUrl = URL.createObjectURL(file)
      if (objectUrl) {
        updateTestResult("Image Preview Generation", "passed", 
          `Preview URL generated: ${objectUrl.substring(0, 50)}...`,
          Date.now() - previewStartTime)
      } else {
        updateTestResult("Image Preview Generation", "failed", "Failed to generate preview URL")
      }
    } catch (error) {
      updateTestResult("File Upload Validation", "failed", `Error: ${error}`)
      updateTestResult("Image Preview Generation", "failed", `Error: ${error}`)
    }
  }

  const testApiIntegration = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first")
      return
    }

    // Test 3: API Integration
    updateTestResult("API Integration Test", "running")
    const apiStartTime = Date.now()
    
    try {
      const result = await analyzeFoodImage(selectedImage)
      
      if (result.error) {
        updateTestResult("API Integration Test", "failed", 
          `API Error: ${result.error}`,
          Date.now() - apiStartTime)
      } else {
        updateTestResult("API Integration Test", "passed", 
          `API Response received: ${result.identified_food}`,
          Date.now() - apiStartTime)
      }

      // Test 4: N8N Webhook Response
      updateTestResult("N8N Webhook Response", "running")
      const webhookStartTime = Date.now()
      
      if (result.raw_response?.simulatedData) {
        updateTestResult("N8N Webhook Response", "failed", 
          "Using simulated data - N8N webhook not available",
          Date.now() - webhookStartTime)
      } else if (result.identified_food && result.identified_food !== "Unknown") {
        updateTestResult("N8N Webhook Response", "passed", 
          `N8N Analysis: ${result.identified_food} - ${result.visual_assessment}`,
          Date.now() - webhookStartTime)
      } else {
        updateTestResult("N8N Webhook Response", "failed", 
          "Incomplete webhook response",
          Date.now() - webhookStartTime)
      }

      // Test 5: Error Handling
      updateTestResult("Error Handling", "running")
      const errorStartTime = Date.now()
      
      if (result.error && result.identified_food === "Unknown") {
        updateTestResult("Error Handling", "passed", 
          "Error properly handled and fallback data provided",
          Date.now() - errorStartTime)
      } else if (!result.error) {
        updateTestResult("Error Handling", "passed", 
          "No errors to handle - successful response",
          Date.now() - errorStartTime)
      } else {
        updateTestResult("Error Handling", "failed", 
          "Error handling incomplete",
          Date.now() - errorStartTime)
      }

    } catch (error) {
      updateTestResult("API Integration Test", "failed", `Exception: ${error}`)
      updateTestResult("N8N Webhook Response", "failed", `Exception: ${error}`)
      updateTestResult("Error Handling", "failed", `Exception: ${error}`)
    }
  }

  const resetTests = () => {
    setTestResults(prev => prev.map(test => ({ ...test, status: "pending" as const, details: undefined, duration: undefined })))
    setSelectedImage(null)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />
      case 'running': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default: return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <Badge variant="secondary" className="bg-green-100 text-green-800">Passed</Badge>
      case 'failed': return <Badge variant="destructive">Failed</Badge>
      case 'running': return <Badge variant="outline" className="bg-blue-100 text-blue-800">Running</Badge>
      default: return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">FreshSense Testing Suite</h1>
          <p className="text-muted-foreground mt-2">Comprehensive testing for image upload and analysis functionality</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Image Upload Test */}
          <Card>
            <CardHeader>
              <CardTitle>Image Upload Test</CardTitle>
              <CardDescription>
                Test file validation, preview generation, and upload functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload onImageSelected={handleImageSelected} />
              {selectedImage && (
                <div className="text-sm text-muted-foreground">
                  <p><strong>Selected:</strong> {selectedImage.name}</p>
                  <p><strong>Size:</strong> {(selectedImage.size / (1024 * 1024)).toFixed(2)}MB</p>
                  <p><strong>Type:</strong> {selectedImage.type}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Automated testing results for all components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <p className="font-medium text-sm">{test.testName}</p>
                      {test.details && (
                        <p className="text-xs text-muted-foreground">{test.details}</p>
                      )}
                      {test.duration && (
                        <p className="text-xs text-muted-foreground">Duration: {test.duration}ms</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Test Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>
              Run comprehensive tests on the selected image
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={testApiIntegration}
              disabled={!selectedImage}
              className="flex-1"
            >
              Run API Integration Tests
            </Button>
            <Button 
              onClick={resetTests}
              variant="outline"
            >
              Reset Tests
            </Button>
          </CardContent>
        </Card>

        {/* Test Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Testing Guidelines</CardTitle>
            <CardDescription>
              Follow these steps to ensure comprehensive testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Test Various File Sizes</p>
                  <p className="text-muted-foreground">Try files from 100KB to 10MB+ to test size validation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Test Different Formats</p>
                  <p className="text-muted-foreground">Upload JPEG, PNG, and invalid formats (e.g., GIF, PDF)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Test Drag & Drop</p>
                  <p className="text-muted-foreground">Verify drag and drop functionality works properly</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <p className="font-medium">Test API Integration</p>
                  <p className="text-muted-foreground">Run API tests to verify N8N webhook communication</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}