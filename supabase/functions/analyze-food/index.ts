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
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this food image for freshness. Provide a detailed assessment in JSON format with the following structure:
                {
                  "identified_food": "specific food item name",
                  "visual_assessment": "Good" | "Poor - Use Immediately" | "Inedible - Discard Immediately",
                  "key_visual_indicators": "detailed description of visual signs observed",
                  "estimated_remaining_freshness_days": "number as string",
                  "assessment_confidence": "High" | "Medium" | "Low",
                  "user_verification_notes": "specific recommendations for the user",
                  "safety_warning": "any food safety concerns if applicable"
                }
                
                Focus on visual indicators like color changes, texture, mold, bruising, wilting, or other signs of spoilage. Be specific about what you observe and provide actionable advice.`
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
        max_tokens: 500,
        temperature: 0.1
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
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        analysisResult = JSON.parse(analysisText)
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText)
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI analysis' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
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