/**
 * API service for handling food freshness analysis
 */

// n8n webhook URLs - these are now used via our proxy API endpoint
const N8N_PROD_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://nuworld.app.n8n.cloud/webhook/f9afe891-e6f7-4702-9348-7485bfad5c68";
const N8N_TEST_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_TEST_WEBHOOK_URL || "https://nuworld.app.n8n.cloud/webhook-test/f9afe891-e6f7-4702-9348-7485bfad5c68";

// Store the webhook URLs for documentation purposes
const N8N_WEBHOOK_URL = process.env.NODE_ENV === 'production' ? N8N_PROD_WEBHOOK_URL : N8N_TEST_WEBHOOK_URL;

// Use our proxy API route to avoid CORS issues
const API_ANALYZE_ENDPOINT = '/api/analyze';

export interface FoodAnalysisResult {
  timestamp: string;
  image_source: string;
  identified_food: string;
  visual_assessment: 'Good' | 'Fair - Use Soon' | 'Poor - Use Immediately' | 'Inedible - Discard Immediately' | 'Very Fresh' | string;
  key_visual_indicators: string;
  estimated_remaining_freshness_days: string;
  assessment_confidence: 'Low' | 'Medium' | 'High' | string;
  disclaimer: string;
  user_verification_notes: string;
  error?: string;
  raw_response?: any; // For debugging purposes
}

/**
 * Converts an image file to base64
 */
async function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // For n8n webhook integration, we need to keep the complete data URL format
      // This includes the prefix like "data:image/jpeg;base64,..."
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Creates a mock response for testing when the n8n service is unavailable
 */
function createMockResponse(imageFile: File, error?: string): FoodAnalysisResult {
  // Determine a fake food type based on the image name for demonstration
  let foodType = "Unknown Food";
  const fileName = imageFile.name.toLowerCase();
  
  if (fileName.includes("apple") || fileName.includes("fruit")) {
    foodType = "Apple";
  } else if (fileName.includes("banana")) {
    foodType = "Banana";
  } else if (fileName.includes("chicken") || fileName.includes("meat")) {
    foodType = "Raw Chicken";
  } else if (fileName.includes("vegetable") || fileName.includes("veg")) {
    foodType = "Mixed Vegetables";
  }
  
  return {
    timestamp: new Date().toISOString(),
    image_source: imageFile.name,
    identified_food: foodType,
    visual_assessment: "Good",
    key_visual_indicators: "This is simulated data while the n8n service is being configured. The real service will provide accurate visual indicators.",
    estimated_remaining_freshness_days: "3-5",
    assessment_confidence: "Medium",
    disclaimer: "DISCLAIMER: This is simulated data for demonstration purposes only. The real service will provide accurate food freshness analysis.",
    user_verification_notes: "",
    error: error,
    raw_response: { simulatedData: true }
  };
}

/**
 * Analyzes a food image by sending it to our proxy API endpoint, which forwards it to n8n webhook
 * 
 * @param imageFile The image file to analyze
 * @returns Analysis results from the n8n webhook
 */
export async function analyzeFoodImage(imageFile: File): Promise<FoodAnalysisResult> {
  try {
    console.log(`Sending image to proxy API endpoint: ${API_ANALYZE_ENDPOINT}`);
    
    // Convert image to base64
    const base64Image = await convertToBase64(imageFile);
    
    // Verify that we have the complete data URL format
    if (!base64Image || !base64Image.startsWith('data:')) {
      console.error('Invalid base64 image format - missing data URL prefix');
      return createMockResponse(imageFile, 'Failed to properly encode image');
    }
    
    // Prepare payload for n8n webhook
    const payload = {
      // The full data URL format is necessary for n8n binary data recognition
      // Format: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
      image: base64Image,
      filename: imageFile.name,
      contentType: imageFile.type,
      // Add timestamp for unique identification
      timestamp: new Date().toISOString()
    };
    
    console.log(`Sending payload with image size: ${base64Image.length} characters`);
    
    try {
      // Send to our proxy API endpoint, which forwards to n8n webhook
      const response = await fetch(API_ANALYZE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Always attempt to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        return createMockResponse(imageFile, 'Failed to parse webhook response');
      }

      // Check if the response contains the proper analysis data
      if (!response.ok || responseData.error) {
        // Log the error for troubleshooting
        console.error(`Proxy API error: ${response.status} ${response.statusText}`);
        console.error(`Error details:`, responseData);
        
        // If the proxy already sent a formatted error response matching our FoodAnalysisResult interface, use it
        if (responseData.timestamp && responseData.identified_food) {
          console.log("Using proxy-provided error response");
          return responseData;
        }
        
        // Otherwise, create a mock response
        console.log("Using simulated data while n8n service is unavailable");
        return createMockResponse(imageFile, 
          responseData.error || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('Proxy API response:', responseData);
      
      // Check if we received n8n's expected format or our own format
      if (responseData.identifiedFood) {
        // n8n format, need to convert to our FoodAnalysisResult format
        console.log('Received n8n format response, converting to FoodAnalysisResult format');
        
        // Format the response for the frontend based on the n8n webhook output structure
        const formattedResponse: FoodAnalysisResult = {
          timestamp: new Date().toISOString(),
          image_source: imageFile.name,
          identified_food: responseData.identifiedFood || 'Unknown',
          visual_assessment: responseData.visualAssessment || 'Unable to determine',
          key_visual_indicators: responseData.keyIndicators || 'No indicators provided',
          estimated_remaining_freshness_days: responseData.estimatedFreshnessDays || 'Unknown',
          assessment_confidence: responseData.confidence || 'Low',
          disclaimer: responseData.importantDisclaimer || 'DISCLAIMER: This is an automated analysis and should not be the sole basis for food safety decisions.',
          user_verification_notes: '',
          raw_response: responseData
        };
        
        return formattedResponse;
      } else if (responseData.identified_food) {
        // Already in our format
        console.log('Received response in FoodAnalysisResult format');
        return responseData;
      } else {
        // Unknown format, create a mock response
        console.error('Received unrecognized response format:', responseData);
        return createMockResponse(imageFile, 'Received unrecognized response format');
      }
      
    } catch (error) {
      console.error('Error communicating with webhook:', error);
      return createMockResponse(imageFile, 
        `Communication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in analyzeFoodImage:', error);
    return createMockResponse(imageFile, 
      `Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
