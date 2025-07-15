/**
 * API service for handling food freshness analysis using Supabase Edge Functions
 */

// Supabase Edge Function URL for food analysis
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const API_ANALYZE_ENDPOINT = `${SUPABASE_URL}/functions/v1/analyze-food`;

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
 * Analyzes a food image using Supabase Edge Function with OpenAI Vision
 * 
 * @param imageFile The image file to analyze
 * @returns Analysis results from OpenAI Vision API
 */
export async function analyzeFoodImage(imageFile: File): Promise<FoodAnalysisResult> {
  try {
    console.log(`Sending image to Supabase Edge Function: ${API_ANALYZE_ENDPOINT}`);
    
    // Convert image to base64
    const base64Image = await convertToBase64(imageFile);
    
    // Verify that we have the complete data URL format
    if (!base64Image || !base64Image.startsWith('data:')) {
      console.error('Invalid base64 image format - missing data URL prefix');
      return createMockResponse(imageFile, 'Failed to properly encode image');
    }
    
    // Prepare payload for Supabase Edge Function
    const payload = {
      image: base64Image
    };
    
    console.log(`Sending payload with image size: ${base64Image.length} characters`);
    
    try {
      // Send to Supabase Edge Function
      const response = await fetch(API_ANALYZE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify(payload)
      });

      // Always attempt to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        return createMockResponse(imageFile, 'Failed to parse API response');
      }

      // Check if the response contains the proper analysis data
      if (!response.ok || responseData.error) {
        // Log the error for troubleshooting
        console.error(`Supabase API error: ${response.status} ${response.statusText}`);
        console.error(`Error details:`, responseData);
        
        // Create a mock response for fallback
        console.log("Using simulated data while API service is unavailable");
        return createMockResponse(imageFile, 
          responseData.error || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('Supabase API response:', responseData);
      
      // Format the response for the frontend
      const formattedResponse: FoodAnalysisResult = {
        timestamp: new Date().toISOString(),
        image_source: imageFile.name,
        identified_food: responseData.identified_food || 'Unknown',
        visual_assessment: responseData.visual_assessment || 'Unable to determine',
        key_visual_indicators: responseData.key_visual_indicators || 'No indicators provided',
        estimated_remaining_freshness_days: responseData.estimated_remaining_freshness_days || 'Unknown',
        assessment_confidence: responseData.assessment_confidence || 'Low',
        disclaimer: 'DISCLAIMER: This is an automated analysis and should not be the sole basis for food safety decisions.',
        user_verification_notes: responseData.user_verification_notes || '',
        raw_response: responseData
      };
      
      return formattedResponse;
      
    } catch (error) {
      console.error('Error communicating with Supabase API:', error);
      return createMockResponse(imageFile, 
        `Communication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in analyzeFoodImage:', error);
    return createMockResponse(imageFile, 
      `Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
