import { NextRequest, NextResponse } from 'next/server';
import { supabase, foodAnalysisService } from '@/lib/supabase';

// Supabase Edge Function URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANALYZE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/analyze-food`;

export async function POST(req: NextRequest) {
  try {
    console.log(`Sending request to Supabase Edge Function: ${ANALYZE_FUNCTION_URL}`);
    
    // Validate Supabase configuration
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase configuration missing');
      return NextResponse.json({
        error: 'Supabase configuration missing',
        identified_food: 'Unknown',
        visual_assessment: 'Unable to determine',
        key_visual_indicators: 'Service configuration error',
        estimated_remaining_freshness_days: '0',
        assessment_confidence: 'Low'
      }, { status: 500 });
    }
    
    // Get the request body
    const body = await req.json();
    
    // Log what we're about to send (with truncated image data for clarity)
    const imageDataSample = body.image ? `${body.image.substring(0, 50)}...` : 'No image data';
    console.log(`Sending request with image data sample: ${imageDataSample}`);

    // Forward the request to Supabase Edge Function
    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      response = await fetch(ANALYZE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ image: body.image }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Log the status for debugging
      console.log(`Supabase Edge Function response status: ${response.status} ${response.statusText}`);
      
    } catch (fetchError) {
      // Handle fetch errors (network issues, timeouts, etc.)
      console.error('Fetch error:', fetchError);
      return NextResponse.json({
        error: `Failed to connect to Supabase: ${fetchError instanceof Error ? fetchError.message : 'Connection error'}`,
        identified_food: 'Unknown',
        visual_assessment: 'Unable to determine',
        key_visual_indicators: 'Failed to connect to analysis service',
        estimated_remaining_freshness_days: '0',
        assessment_confidence: 'Low'
      }, { status: 500 });
    }
    
    // Process the response from Supabase Edge Function
    if (response.ok) {
      try {
        const data = await response.json();
        console.log('Successfully received Supabase response:', data);
        
        // Store the analysis in the database
        try {
          await foodAnalysisService.create({
            identified_food: data.identified_food || 'Unknown',
            visual_assessment: data.visual_assessment || 'Unable to determine',
            key_visual_indicators: data.key_visual_indicators,
            estimated_remaining_freshness_days: data.estimated_remaining_freshness_days,
            confidence: data.assessment_confidence || 'Low',
            user_verification_notes: data.user_verification_notes,
            safety_warning: data.safety_warning
          });
          console.log('Analysis stored in database successfully');
        } catch (dbError) {
          console.error('Failed to store analysis in database:', dbError);
          // Don't fail the request if database storage fails
        }
        
        // Return the analysis data
        return NextResponse.json(data);
        
      } catch (parseError) {
        console.error('Error parsing Supabase response:', parseError);
        let text = '';
        try {
          text = await response.text();
          console.log('Raw response text:', text.substring(0, 1000));
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        } catch (textError) {
          console.error('Failed to read response text:', textError);
        }
        
        return NextResponse.json({
          error: `Failed to parse Supabase response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
          identified_food: 'Unknown',
          visual_assessment: 'Unable to determine',
          key_visual_indicators: 'Analysis failed due to response parsing error',
          estimated_remaining_freshness_days: '0',
          assessment_confidence: 'Low',
          debug_info: {
            response_status: response.status,
            response_text: text.substring(0, 500),
            parse_error: parseError instanceof Error ? parseError.message : 'Unknown parse error'
          }
        }, { status: 500 });
      }
    }
    
    if (!response.ok) {
      let errorMessage = 'Unknown error';
      try {
        const errorText = await response.text();
        console.error(`Error from Supabase Edge Function (${response.status}): ${errorText.substring(0, 500)}`);
        errorMessage = errorText;
      } catch (e) {
        console.error('Error reading error response:', e);
      }
      
      return NextResponse.json({
        error: `Supabase Edge Function error: ${response.status} ${response.statusText}. ${errorMessage.substring(0, 200)}...`,
        identified_food: 'Unknown',
        visual_assessment: 'Unable to determine',
        key_visual_indicators: 'Analysis service returned an error',
        estimated_remaining_freshness_days: '0',
        assessment_confidence: 'Low'
      }, { status: response.status });
    }
    
  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json({
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      identified_food: 'Unknown',
      visual_assessment: 'Unable to determine',
      key_visual_indicators: 'Analysis failed due to server error',
      estimated_remaining_freshness_days: '0',
      assessment_confidence: 'Low'
    }, { status: 500 });
  }
}
