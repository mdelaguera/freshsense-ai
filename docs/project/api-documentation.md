# API Documentation

## Overview

FreshSense AI uses a hybrid API architecture combining Supabase Edge Functions, Next.js API routes, and OpenAI Vision API to provide comprehensive food analysis capabilities.

## API Architecture

### Primary APIs
1. **Supabase Edge Functions**: Main AI analysis processing
2. **Next.js API Routes**: Frontend-backend communication
3. **OpenAI Vision API**: AI-powered image analysis
4. **Amazon Associates API**: Product and affiliate link generation

### Authentication
- **Method**: Supabase JWT tokens
- **Flow**: Email/password with session management
- **Protection**: Row Level Security (RLS) policies

## Core API Endpoints

### 1. Food Analysis API

#### Supabase Edge Function: `/analyze-food`
**Method**: POST  
**Purpose**: Analyze food images using OpenAI Vision API

**Request Format:**
```typescript
interface AnalysisRequest {
  image: string // Base64 data URL
}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <supabase-jwt-token>
```

**Request Example:**
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-food`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
  })
})
```

**Response Format:**
```typescript
interface AnalysisResponse {
  identified_food: string
  visual_assessment: string
  key_visual_indicators: string
  estimated_remaining_freshness_days: string
  confidence: string
  food_category: 'raw' | 'cooking' | 'prepared'
  cooking_stage?: string
  recipe_suggestions?: RecipeSuggestion[]
  safety_recommendations: string[]
  storage_recommendations: string[]
}

interface RecipeSuggestion {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prep_time: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimated_cost: number
}
```

**Success Response (200):**
```json
{
  "identified_food": "Fresh Strawberries",
  "visual_assessment": "Fresh with minor imperfections",
  "key_visual_indicators": "Bright red color, firm texture, green tops intact",
  "estimated_remaining_freshness_days": "3-4",
  "confidence": "94%",
  "food_category": "raw",
  "recipe_suggestions": [
    {
      "title": "Strawberry Spinach Salad",
      "description": "Fresh summer salad with strawberries and spinach",
      "ingredients": ["Fresh strawberries", "Baby spinach", "Feta cheese"],
      "instructions": ["Wash ingredients", "Combine in bowl", "Dress and serve"],
      "prep_time": 15,
      "difficulty": "Easy",
      "estimated_cost": 12.99
    }
  ],
  "safety_recommendations": ["Safe to consume", "Use within 3-4 days"],
  "storage_recommendations": ["Store in refrigerator", "Keep dry"]
}
```

**Error Response (400/500):**
```json
{
  "error": "Invalid image format",
  "details": "Image must be a valid base64 data URL"
}
```

#### Next.js API Route: `/api/analyze`
**Method**: POST  
**Purpose**: Proxy for analysis requests with additional processing

**Implementation:**
```typescript
// app/api/analyze/route.ts
export async function POST(request: Request) {
  try {
    const { image } = await request.json()
    
    // Validate request
    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      )
    }

    // Forward to Supabase Edge Function
    const supabaseResponse = await fetch(`${SUPABASE_URL}/functions/v1/analyze-food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ image })
    })

    const data = await supabaseResponse.json()
    return NextResponse.json(data)
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
```

### 2. User Management API

#### Supabase Auth API
**Base URL**: `https://<project-ref>.supabase.co/auth/v1`

**Endpoints:**
- `POST /signup` - User registration
- `POST /token?grant_type=password` - Login
- `POST /logout` - Logout
- `POST /recover` - Password recovery

**Example - User Registration:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    emailRedirectTo: 'https://yourapp.com/auth/confirm'
  }
})
```

### 3. Database API

#### Food Analyses Table
**Table**: `food_analyses`
**Purpose**: Store analysis history and results

**Schema:**
```sql
CREATE TABLE food_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  image_url TEXT,
  identified_food TEXT NOT NULL,
  visual_assessment TEXT,
  confidence DECIMAL(5,2),
  estimated_days INTEGER,
  recipe_suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**RLS Policies:**
```sql
-- Users can only see their own analyses
CREATE POLICY "Users can view own analyses" ON food_analyses
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own analyses
CREATE POLICY "Users can create own analyses" ON food_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**API Operations:**
```typescript
// Create analysis record
const { data, error } = await supabase
  .from('food_analyses')
  .insert({
    user_id: user.id,
    identified_food: result.identified_food,
    visual_assessment: result.visual_assessment,
    confidence: parseFloat(result.confidence.replace('%', '')),
    estimated_days: parseInt(result.estimated_remaining_freshness_days),
    recipe_suggestions: result.recipe_suggestions
  })

// Fetch user's analyses
const { data, error } = await supabase
  .from('food_analyses')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

### 4. Affiliate Links API

#### Amazon Product API
**File**: `lib/affiliate-links.ts`
**Purpose**: Generate Amazon affiliate links with tracking

**Functions:**

```typescript
// Generate Amazon Fresh link
export function generateAmazonFreshLink(
  ingredient: string, 
  category?: string
): string {
  const searchTerm = encodeURIComponent(ingredient.toLowerCase().trim())
  const categoryParam = category ? `&rh=n%3A16318821%2Ck%3A${encodeURIComponent(category)}` : ''
  
  return `${AMAZON_AFFILIATE_CONFIG.freshBaseUrl}?k=${searchTerm}&ref=${AMAZON_AFFILIATE_CONFIG.refParam}&tag=${AMAZON_AFFILIATE_CONFIG.affiliateTag}${categoryParam}`
}

// Generate optimized affiliate link
export function generateOptimizedAffiliateLink(ingredient: string): string {
  const category = categorizeIngredient(ingredient)
  
  if (category.isFresh) {
    return generateAmazonFreshLink(
      category.searchModifier ? `${category.searchModifier} ${ingredient}` : ingredient,
      category.category
    )
  } else {
    return generateAmazonLink(ingredient, category.department)
  }
}

// Track affiliate clicks
export function trackAffiliateClick(
  ingredient: string, 
  linkType: 'amazon-fresh' | 'amazon'
) {
  console.log(`Affiliate link clicked: ${ingredient} (${linkType})`)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      ingredient_name: ingredient,
      link_type: linkType,
      event_category: 'monetization'
    })
  }
}
```

**Configuration:**
```typescript
const AMAZON_AFFILIATE_CONFIG = {
  affiliateTag: 'freshsense-20',
  baseUrl: 'https://www.amazon.com/s',
  freshBaseUrl: 'https://www.amazon.com/fresh/s',
  productBaseUrl: 'https://www.amazon.com/dp',
  refParam: 'as_li_ss_tl'
}
```

### 5. Analytics API

#### Event Tracking
**File**: `lib/analytics.ts`
**Purpose**: Track user interactions and system performance

**Events:**
```typescript
// Analysis tracking
export const trackAnalysisRequest = (isNew: boolean) => {
  track('analysis_request', {
    event_category: 'engagement',
    is_new_user: isNew
  })
}

export const trackAnalysisComplete = (
  foodType: string, 
  confidence: string, 
  duration: number
) => {
  track('analysis_complete', {
    food_type: foodType,
    confidence_level: confidence,
    processing_time: duration,
    event_category: 'conversion'
  })
}

// User journey tracking
export const trackUserJourney = (step: string) => {
  track('user_journey', {
    journey_step: step,
    event_category: 'user_flow'
  })
}

// Affiliate tracking
export const trackAffiliateClick = (ingredient: string, linkType: string) => {
  track('affiliate_click', {
    ingredient_name: ingredient,
    link_type: linkType,
    event_category: 'monetization'
  })
}
```

## Error Handling

### Standard Error Responses
```typescript
interface APIError {
  error: string
  details?: string
  code?: string
  timestamp: string
}
```

### Common Error Codes
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error (system error)

### Error Handling Example
```typescript
try {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.details || error.error || 'Analysis failed')
  }

  const data = await response.json()
  return data
} catch (error) {
  console.error('API Error:', error)
  toast.error(error.message || 'Something went wrong')
}
```

## Rate Limiting

### Supabase Edge Functions
- **Limit**: 500 requests per minute per IP
- **Headers**: `X-RateLimit-*` headers included in responses
- **Handling**: Exponential backoff on 429 responses

### OpenAI API
- **Limit**: Based on subscription tier
- **Monitoring**: Request count tracking in admin dashboard
- **Fallback**: Queue system for high-volume periods

## Security

### Input Validation
```typescript
// Image validation
const validateImageInput = (image: string): boolean => {
  if (!image || typeof image !== 'string') return false
  if (!image.startsWith('data:image/')) return false
  if (image.length > 10 * 1024 * 1024) return false // 10MB limit
  return true
}

// SQL injection prevention
const sanitizeQuery = (input: string): string => {
  return input.replace(/['"\\]/g, '\\$&')
}
```

### Authentication Headers
```typescript
const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'X-Client-Version': '1.0.0'
})
```

## Performance Optimization

### Caching Strategy
- **Client-side**: React Query for API response caching
- **Server-side**: Supabase built-in caching
- **CDN**: Vercel Edge Network for static assets

### Image Optimization
```typescript
// Compress images before sending
import { compressImage } from '@/lib/image-compression'

const optimizedImage = await compressImage(file, {
  maxWidth: 1280,
  maxHeight: 720,
  quality: 0.8,
  maxSizeKB: 500
})
```

### API Response Optimization
```typescript
// Minimize response payload
const optimizeResponse = (data: AnalysisResponse) => ({
  food: data.identified_food,
  assessment: data.visual_assessment,
  confidence: parseFloat(data.confidence.replace('%', '')),
  days: parseInt(data.estimated_remaining_freshness_days),
  recipes: data.recipe_suggestions?.slice(0, 3) // Limit recipes
})
```

This API documentation provides comprehensive information for developers integrating with or extending the FreshSense AI platform.