import { NextRequest, NextResponse } from 'next/server';

// n8n webhook URLs
const N8N_PROD_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://nuworld.app.n8n.cloud/webhook/f9afe891-e6f7-4702-9348-7485bfad5c68";
const N8N_TEST_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_TEST_WEBHOOK_URL || "https://nuworld.app.n8n.cloud/webhook-test/f9afe891-e6f7-4702-9348-7485bfad5c68";

// Use production URL in production, test URL in development
const N8N_WEBHOOK_URL = process.env.NODE_ENV === 'production' ? N8N_PROD_WEBHOOK_URL : N8N_TEST_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  try {
    console.log(`Proxy forwarding request to n8n webhook: ${N8N_WEBHOOK_URL}`);
    
    // Get the request body
    const body = await req.json();
    
    // Log what we're about to send (with truncated image data for clarity)
    const imageDataSample = body.image ? `${body.image.substring(0, 50)}...` : 'No image data';
    console.log(`Sending request with filename: ${body.filename}, contentType: ${body.contentType}, imageDataSample: ${imageDataSample}`);

    // Forward the request to n8n webhook with timeout and additional logging
    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Log the status for debugging
      console.log(`N8N webhook response status: ${response.status} ${response.statusText}`);
      
    } catch (fetchError) {
      // Handle fetch errors (network issues, timeouts, etc.)
      console.error('Fetch error:', fetchError);
      return NextResponse.json({
        identifiedFood: 'Unknown',
        visualAssessment: 'Unable to determine',
        keyIndicators: 'Failed to connect to analysis service',
        estimatedFreshnessDays: '0',
        confidence: 'None',
        importantDisclaimer: 'DISCLAIMER: Analysis failed due to connectivity issues.',
        error: `Failed to connect to n8n: ${fetchError instanceof Error ? fetchError.message : 'Connection error'}`
      }, { status: 200 }); // Using 200 with structured error data
    }
    
    // Ensure we get a proper response from n8n
    if (response.ok) {
      try {
        const data = await response.json();
        console.log('Successfully received n8n response:', data);
        
        // Check if the response has the expected structure
        if (data && typeof data === 'object') {
          // Transform if needed or return as is
          return NextResponse.json(data);
        } else {
          console.error('Unexpected response format from n8n:', data);
          return NextResponse.json({
            identifiedFood: 'Unknown',
            visualAssessment: 'Unable to determine',
            keyIndicators: 'Analysis service returned unexpected data format',
            estimatedFreshnessDays: '0',
            confidence: 'None',
            importantDisclaimer: 'DISCLAIMER: Analysis failed due to service issues.',
            error: 'Unexpected data format from n8n'
          });
        }
      } catch (parseError) {
        console.error('Error parsing n8n response:', parseError);
        const text = await response.text();
        console.log('Raw response text:', text.substring(0, 500)); // Log first 500 chars
        
        // Return a formatted error that matches our expected structure
        return NextResponse.json({
          identifiedFood: 'Unknown',
          visualAssessment: 'Unable to determine',
          keyIndicators: 'Analysis failed due to response parsing error',
          estimatedFreshnessDays: '0',
          confidence: 'None',
          importantDisclaimer: 'DISCLAIMER: Analysis failed. Please try again later.',
          error: `Failed to parse n8n response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
        });
      }
    }
    
    if (!response.ok) {
      // Pass through the error response
      let errorMessage = 'Unknown error';
      try {
        const errorText = await response.text();
        console.error(`Error from n8n webhook (${response.status}): ${errorText.substring(0, 500)}`); // Truncate long error messages
        errorMessage = errorText;
        
        // Save error to file system for debugging
        if (typeof window === 'undefined') {
          const fs = require('fs');
          const path = require('path');
          const errorPath = path.join(process.cwd(), 'logs', 'n8n-error.log');
          
          try {
            if (!fs.existsSync(path.join(process.cwd(), 'logs'))) {
              fs.mkdirSync(path.join(process.cwd(), 'logs'), { recursive: true });
            }
            fs.writeFileSync(errorPath, `${new Date().toISOString()}\n${response.status} ${response.statusText}\n${errorText}`);
          } catch (fsErr) {
            console.error('Could not write error log:', fsErr);
          }
        }
      } catch (e) {
        console.error('Error reading error response:', e);
      }
      
      // Return a structured response
      return NextResponse.json({
        identifiedFood: 'Unknown',
        visualAssessment: 'Unable to determine',
        keyIndicators: 'Analysis service returned an error',
        estimatedFreshnessDays: '0',
        confidence: 'None',
        importantDisclaimer: 'DISCLAIMER: Analysis failed. Please try again later.',
        error: `N8N webhook error: ${response.status} ${response.statusText}. ${errorMessage.substring(0, 200)}...`
      });
    }
    
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Return a properly formatted error response
    return NextResponse.json({
      identifiedFood: 'Unknown',
      visualAssessment: 'Unable to determine',
      keyIndicators: 'Analysis failed due to server error',
      estimatedFreshnessDays: '0',
      confidence: 'None',
      importantDisclaimer: 'DISCLAIMER: Analysis failed due to a server error. Please try again later.',
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 200 }); // Using 200 with structured error
  }
}
