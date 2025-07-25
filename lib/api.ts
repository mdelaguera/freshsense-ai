/**
 * API service for handling food freshness analysis using Supabase Edge Functions
 */

// Get Supabase configuration - check at runtime instead of module load
function getSupabaseConfig() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Supabase config check:', {
    hasUrl: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    urlPrefix: SUPABASE_URL?.substring(0, 30) + '...',
    keyPrefix: SUPABASE_ANON_KEY?.substring(0, 20) + '...'
  });

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(`Supabase configuration missing: URL=${!!SUPABASE_URL}, KEY=${!!SUPABASE_ANON_KEY}`);
  }
  
  return { SUPABASE_URL, SUPABASE_ANON_KEY };
}

// Direct Supabase Edge Function endpoint will be constructed at runtime

export interface FoodAnalysisResult {
  timestamp: string;
  image_source: string;
  identified_food: string;
  food_category: 'raw' | 'cooking' | 'cooked' | 'processed' | string;
  visual_assessment: 'Good' | 'Fair - Use Soon' | 'Poor - Use Immediately' | 'Inedible - Discard Immediately' | 'Very Fresh' | string;
  key_visual_indicators: string;
  estimated_remaining_freshness_days: string;
  assessment_confidence: 'Low' | 'Medium' | 'High' | string;
  disclaimer: string;
  user_verification_notes: string;
  // New fields for cooking analysis
  cooking_stage?: 'rare' | 'medium-rare' | 'medium' | 'medium-well' | 'well-done' | 'raw' | 'undercooked' | 'perfectly-cooked' | 'overcooked' | string;
  cooking_recommendations?: string;
  internal_temperature_guidance?: string;
  // New fields for recipe suggestions
  recipe_suggestions?: RecipeSuggestion[];
  preparation_tips?: string;
  error?: string;
  raw_response?: Record<string, unknown>; // For debugging purposes
}

export interface RecipeSuggestion {
  name: string;
  cooking_method: string;
  estimated_time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  brief_description: string;
  key_ingredients?: string[];
}

/**
 * Converts an image file to base64
 */
async function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Keep the complete data URL format for Supabase Edge Function
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
    food_category: 'processed',
    visual_assessment: 'Unable to determine',
    key_visual_indicators: 'Analysis service unavailable',
    estimated_remaining_freshness_days: '0',
    assessment_confidence: 'Low',
    disclaimer: 'DISCLAIMER: Analysis service is currently unavailable. Please try again later.',
    user_verification_notes: '',
    cooking_stage: undefined,
    cooking_recommendations: undefined,
    internal_temperature_guidance: undefined,
    recipe_suggestions: [],
    preparation_tips: undefined,
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
    // Get Supabase configuration
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = getSupabaseConfig();
    const API_ANALYZE_ENDPOINT = `${SUPABASE_URL}/functions/v1/analyze-food`;
    
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
      console.log('About to fetch:', API_ANALYZE_ENDPOINT);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let response; // Declare response variable in outer scope
      try {
        // Try Supabase Edge Function first
        response = await fetch(API_ANALYZE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        // If Supabase Edge Function fails, try Next.js API route as fallback
        if (!response.ok && (response.status === 404 || response.status === 401 || response.status === 403 || response.status === 500)) {
          console.log(`Supabase Edge Function failed with ${response.status}: ${response.statusText}, trying Next.js API route fallback`);
          const fallbackEndpoint = '/api/analyze';
          response = await fetch(fallbackEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
        }

        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('Request timed out after 30 seconds');
          return createFallbackResponse(imageFile, 'Request timed out - please try again with a smaller image');
        }
        throw fetchError;
      }

      // Check if response was successful
      if (!response) {
        return createFallbackResponse(imageFile, 'Failed to get response from any API endpoint');
      }

      // Always attempt to parse the response as JSON
      let responseData;
      try {
        const responseText = await response.text();
        console.log('Raw response text:', responseText.substring(0, 500));
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        console.error('Response status:', response.status);
        return createFallbackResponse(imageFile, `Failed to parse API response: ${e instanceof Error ? e.message : 'Unknown error'}`);
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
        food_category: responseData.food_category || 'processed',
        visual_assessment: responseData.visual_assessment || 'Unable to determine',
        key_visual_indicators: responseData.key_visual_indicators || 'No indicators provided',
        estimated_remaining_freshness_days: responseData.estimated_remaining_freshness_days || 'Unknown',
        assessment_confidence: responseData.assessment_confidence || 'Low',
        disclaimer: 'DISCLAIMER: This is an automated analysis and should not be the sole basis for food safety decisions.',
        user_verification_notes: responseData.user_verification_notes || '',
        cooking_stage: responseData.cooking_stage || undefined,
        cooking_recommendations: responseData.cooking_recommendations || undefined,
        internal_temperature_guidance: responseData.internal_temperature_guidance || undefined,
        recipe_suggestions: responseData.recipe_suggestions || [],
        preparation_tips: responseData.preparation_tips || undefined,
        raw_response: responseData
      };
      
      return formattedResponse;
      
    } catch (error) {
      console.error('Error communicating with Edge Function:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return createFallbackResponse(imageFile, 
        `Communication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in analyzeFoodImage:', error);
    return createFallbackResponse(imageFile, 
      `Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
