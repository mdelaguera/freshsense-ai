import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { image } = await req.json()
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // OpenAI Vision API call
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a food safety expert. Respond ONLY with valid JSON. Do not include any explanatory text, markdown, or code blocks. Return only the raw JSON object.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this food image for freshness and return ONLY a JSON object with this exact structure:
{
  "identified_food": "specific food item name",
  "visual_assessment": "Good" | "Fair - Use Soon" | "Poor - Use Immediately" | "Inedible - Discard Immediately",
  "key_visual_indicators": "detailed description of visual signs observed",
  "estimated_remaining_freshness_days": "number as string",
  "assessment_confidence": "High" | "Medium" | "Low",
  "user_verification_notes": "specific recommendations for the user",
  "safety_warning": "any food safety concerns if applicable"
}

Focus on visual indicators like color changes, texture, mold, bruising, wilting, or other signs of spoilage. Be specific about what you observe. Return ONLY the JSON object, no other text.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API Error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to analyze image with AI' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const openaiResult = await openaiResponse.json()
    const analysisText = openaiResult.choices[0]?.message?.content

    if (!analysisText) {
      return new Response(
        JSON.stringify({ error: 'No analysis received from AI' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse the JSON response from OpenAI
    let analysisResult
    try {
      console.log('Raw OpenAI response:', analysisText)
      
      // Try multiple parsing strategies
      let jsonString = analysisText.trim()
      
      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json\s*|\s*```/g, '')
      
      // Extract JSON from the response (look for first { to last })
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }
      
      analysisResult = JSON.parse(jsonString)
      
      // Validate required fields and provide defaults
      analysisResult = {
        identified_food: analysisResult.identified_food || 'Unknown Food',
        visual_assessment: analysisResult.visual_assessment || 'Unable to determine',
        key_visual_indicators: analysisResult.key_visual_indicators || 'No specific indicators observed',
        estimated_remaining_freshness_days: analysisResult.estimated_remaining_freshness_days || '0',
        assessment_confidence: analysisResult.assessment_confidence || 'Low',
        user_verification_notes: analysisResult.user_verification_notes || '',
        safety_warning: analysisResult.safety_warning || ''
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Original response text:', analysisText)
      
      // Return a structured fallback response instead of an error
      analysisResult = {
        identified_food: 'Unknown Food',
        visual_assessment: 'Unable to determine',
        key_visual_indicators: 'AI analysis failed - unable to parse response',
        estimated_remaining_freshness_days: '0',
        assessment_confidence: 'Low',
        user_verification_notes: 'Please try uploading the image again',
        safety_warning: 'Manual inspection recommended'
      }
    }

    // Store the analysis in Supabase (optional)
    const { error: dbError } = await supabaseClient
      .from('food_analyses')
      .insert([
        {
          identified_food: analysisResult.identified_food,
          visual_assessment: analysisResult.visual_assessment,
          confidence: analysisResult.assessment_confidence,
          created_at: new Date().toISOString()
        }
      ])

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Don't fail the request if database insert fails
    }

    return new Response(
      JSON.stringify(analysisResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})