import { NextRequest, NextResponse } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

export async function OPTIONS() {
  return new NextResponse('ok', { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if we have OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey || openaiApiKey.includes('placeholder')) {
      console.error('OpenAI API key not configured or is placeholder')
      return NextResponse.json(
        { error: 'OpenAI API key not configured properly', details: `Key status: ${openaiApiKey ? 'present but invalid' : 'missing'}` },
        { status: 500, headers: corsHeaders }
      )
    }

    // OpenAI Vision API call with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout

    let openaiResponse
    try {
      openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
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
                  text: `Analyze this food image comprehensively and return ONLY a JSON object with this exact structure:
{
  "identified_food": "specific food item name",
  "food_category": "raw" | "cooking" | "cooked" | "processed",
  "visual_assessment": "Good" | "Fair - Use Soon" | "Poor - Use Immediately" | "Inedible - Discard Immediately",
  "key_visual_indicators": "detailed description of visual signs observed",
  "estimated_remaining_freshness_days": "number as string",
  "assessment_confidence": "High" | "Medium" | "Low",
  "user_verification_notes": "specific recommendations for the user",
  "safety_warning": "any food safety concerns if applicable",
  "cooking_stage": "if cooking/grilling: rare|medium-rare|medium|medium-well|well-done|undercooked|perfectly-cooked|overcooked, else null",
  "cooking_recommendations": "if cooking: specific advice on doneness, temperature, timing, else null",
  "internal_temperature_guidance": "if meat/protein: safe internal temperatures and tips, else null",
  "recipe_suggestions": [
    {
      "name": "recipe name",
      "cooking_method": "grilling|roasting|pan-searing|etc",
      "estimated_time": "time estimate",
      "difficulty": "Easy|Medium|Hard",
      "brief_description": "short description",
      "key_ingredients": ["ingredient1", "ingredient2"]
    }
  ],
  "preparation_tips": "if raw food: preparation and handling advice, else null"
}

ANALYSIS GUIDELINES:
1. For RAW FOODS: Focus on freshness, provide 3-5 recipe suggestions, preparation tips
2. For COOKING/GRILLING: Assess doneness stage, provide cooking recommendations, temperature guidance
3. For COOKED FOODS: Assess freshness and reheating safety
4. For PROCESSED FOODS: Check expiration signs, storage recommendations

Be specific about what you observe. Return ONLY the JSON object, no other text.`
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
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out - please try again with a smaller image' },
          { status: 408, headers: corsHeaders }
        )
      }
      throw fetchError
    }

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API Error:', openaiResponse.status, errorText)
      return NextResponse.json(
        { 
          error: 'Failed to analyze image with AI', 
          status: openaiResponse.status,
          details: errorText.substring(0, 200)
        },
        { status: openaiResponse.status, headers: corsHeaders }
      )
    }

    const openaiResult = await openaiResponse.json()
    const analysisText = openaiResult.choices[0]?.message?.content

    if (!analysisText) {
      return NextResponse.json(
        { error: 'No analysis received from AI' },
        { status: 500, headers: corsHeaders }
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
        food_category: analysisResult.food_category || 'processed',
        visual_assessment: analysisResult.visual_assessment || 'Unable to determine',
        key_visual_indicators: analysisResult.key_visual_indicators || 'No specific indicators observed',
        estimated_remaining_freshness_days: analysisResult.estimated_remaining_freshness_days || '0',
        assessment_confidence: analysisResult.assessment_confidence || 'Low',
        user_verification_notes: analysisResult.user_verification_notes || '',
        safety_warning: analysisResult.safety_warning || '',
        cooking_stage: analysisResult.cooking_stage || null,
        cooking_recommendations: analysisResult.cooking_recommendations || null,
        internal_temperature_guidance: analysisResult.internal_temperature_guidance || null,
        recipe_suggestions: analysisResult.recipe_suggestions || [],
        preparation_tips: analysisResult.preparation_tips || null
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Original response text:', analysisText)
      
      // Return a structured fallback response instead of an error
      analysisResult = {
        identified_food: 'Unknown Food',
        food_category: 'processed',
        visual_assessment: 'Unable to determine',
        key_visual_indicators: 'AI analysis failed - unable to parse response',
        estimated_remaining_freshness_days: '0',
        assessment_confidence: 'Low',
        user_verification_notes: 'Please try uploading the image again',
        safety_warning: 'Manual inspection recommended',
        cooking_stage: null,
        cooking_recommendations: null,
        internal_temperature_guidance: null,
        recipe_suggestions: [],
        preparation_tips: null
      }
    }

    return NextResponse.json(analysisResult, { headers: corsHeaders })

  } catch (error) {
    console.error('Function error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}