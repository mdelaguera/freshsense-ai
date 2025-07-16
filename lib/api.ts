/**
 * API service for handling food freshness analysis using Supabase Edge Functions
 */

// Use Next.js API route which handles Supabase Edge Function integration
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
 * Creates a fallback response when the analysis service is unavailable
 */
function createFallbackResponse(imageFile: File, error?: string): FoodAnalysisResult {
  return {
    timestamp: new Date().toISOString(),
    image_source: imageFile.name,
    identified_food: 'Unknown Food',
    visual_assessment: 'Unable to determine',
    key_visual_indicators: 'Analysis service unavailable',
    estimated_remaining_freshness_days: '0',
    assessment_confidence: 'Low',
    disclaimer: 'DISCLAIMER: Analysis service is currently unavailable. Please try again later.',
    user_verification_notes: '',
    error: error,
    raw_response: { serviceUnavailable: true }
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
    console.log(`Sending image to API endpoint: ${API_ANALYZE_ENDPOINT}`);
    
    // Convert image to base64
    const base64Image = await convertToBase64(imageFile);
    
    // Verify that we have the complete data URL format
    if (!base64Image || !base64Image.startsWith('data:')) {
      console.error('Invalid base64 image format - missing data URL prefix');
      return createFallbackResponse(imageFile, 'Failed to properly encode image');
    }
    
    // Prepare payload for the API
    const payload = {
      image: base64Image
    };
    
    console.log(`Sending payload with image size: ${base64Image.length} characters`);
    
    try {
      // Send to Next.js API route (which forwards to Supabase Edge Function)
      const response = await fetch(API_ANALYZE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Always attempt to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        return createFallbackResponse(imageFile, 'Failed to parse API response');
      }

      // Check if the response contains the proper analysis data
      if (!response.ok || responseData.error) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        console.error(`Error details:`, responseData);
        
        return createFallbackResponse(imageFile, 
          responseData.error || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('API response:', responseData);
      
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
      console.error('Error communicating with API:', error);
      return createFallbackResponse(imageFile, 
        `Communication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in analyzeFoodImage:', error);
    return createFallbackResponse(imageFile, 
      `Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
