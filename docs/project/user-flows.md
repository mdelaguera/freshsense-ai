# User Flows Documentation

## Overview

This document outlines the complete user journey through the FreshSense AI platform, from initial discovery to advanced feature usage. Each flow is designed to maximize user engagement while providing clear value at every step.

## Primary User Flows

### 1. First-Time User Journey

#### 1.1 Discovery & Landing
```
Browser → Homepage (/) → Auto-redirect to /home
↓
Homepage Features:
- Hero section with value proposition
- "Analyze Food Now - Free" CTA button
- Social proof and testimonials
- How it works explanation
- No login required initially
```

**User Actions:**
- View product benefits
- Read testimonials and stats
- Understand the process
- Click "Analyze Food Now" or scroll to analyzer

**Technical Implementation:**
- Auto-redirect from root to `/home`
- No authentication barriers
- Responsive design for mobile/desktop
- Analytics tracking for page views

#### 1.2 Food Analysis (Guest Mode)
```
Homepage → Scroll to Analyzer → Upload/Camera → Analysis → Login Prompt
```

**Step-by-step Flow:**
1. **Image Selection**
   - Drag & drop interface
   - Camera capture option (mobile-first)
   - File upload fallback
   - Real-time validation

2. **AI Analysis Process**
   - Progress indicators (5-step process)
   - Loading states with messages
   - Error handling with helpful guidance
   - 30-second timeout protection

3. **Results Display**
   - Food identification
   - Freshness assessment
   - Days remaining estimate
   - Recipe suggestions
   - Shopping recommendations

4. **Conversion Point**
   - Login prompt to save results
   - Value proposition for account creation
   - Social login options (future)

**Code Example:**
```typescript
const handleAnalyze = async () => {
  if (!selectedImage) {
    toast.error("Please select an image to analyze")
    return
  }

  // Check if user is logged in, redirect to auth if not
  if (!user) {
    toast.info("Please sign in to analyze your food")
    router.push('/auth')
    return
  }

  // Proceed with analysis...
}
```

#### 1.3 User Registration
```
Analysis Attempt → Login Prompt → Registration Form → Email Verification → Analysis Complete
```

**Registration Flow:**
1. **Sign-up Form**
   ```
   Email input → Password input → Confirm password → Submit
   ```

2. **Email Verification**
   ```
   Registration → Verification email → Click link → Account activated
   ```

3. **Analysis Completion**
   ```
   Verified account → Return to analysis → Results saved → Dashboard access
   ```

**Technical Implementation:**
```typescript
// Registration with Supabase
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/confirm`
  }
})
```

### 2. Returning User Journey

#### 2.1 Login & Dashboard Access
```
Homepage → Login → Dashboard → Past Scans/Recipes → New Analysis
```

**Dashboard Features:**
- Past scan history with results
- Saved recipe collection
- Purchase tracking
- Activity timeline
- Quick access to new analysis

#### 2.2 Recipe Discovery Flow
```
Analysis Results → Recipe Suggestions → Recipe Modal → Ingredient Shopping
```

**Recipe Interaction:**
1. **Recipe Selection**
   - Browse generated recipes
   - Filter by difficulty/time/cost
   - View recipe previews

2. **Recipe Details**
   - Full ingredient list
   - Step-by-step instructions
   - Nutritional information
   - Shopping integration

3. **Shopping Integration**
   - Individual ingredient purchase
   - Bulk shopping cart
   - Amazon affiliate tracking
   - Price comparison

**Code Example:**
```typescript
const handleIngredientShop = (ingredientName: string) => {
  const affiliateLink = generateValidatedAffiliateLink(ingredientName)
  trackAffiliateClick(ingredientName, affiliateLink.linkType)
  window.open(affiliateLink.link, '_blank', 'noopener,noreferrer')
}
```

### 3. Mobile User Experience

#### 3.1 Mobile-First Camera Flow
```
Mobile Browser → Homepage → Camera Permission → Live Capture → Analysis
```

**Mobile Optimizations:**
- Camera API with `facingMode: "environment"`
- Touch-optimized interface
- Responsive image display
- Gesture navigation support

**Camera Implementation:**
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ 
  video: { 
    facingMode: "environment", // Use back camera
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 }
  } 
})
```

#### 3.2 Progressive Web App Features
```
Mobile Browser → Install Prompt → Home Screen Icon → Offline Capability
```

**PWA Features:**
- Add to home screen
- Offline image caching
- Background sync for analysis
- Push notifications (future)

### 4. Advanced User Flows

#### 4.1 Food Labeling & Training
```
Analysis Results → "Label This Food" → Correction Interface → Training Data Submission
```

**Labeling Process:**
1. **Correction Interface**
   - Compare AI vs user assessment
   - Food category selection
   - Freshness level adjustment
   - Custom tags and notes

2. **Training Data Collection**
   - Structured data format
   - User correction tracking
   - Confidence scoring
   - Database storage

**Data Structure:**
```typescript
interface FoodLabelData {
  foodName: string
  category: string
  freshness: string
  daysRemaining: number
  notes: string
  userCorrection: boolean
  confidence: number
  tags: string[]
}
```

#### 4.2 Recipe Management Flow
```
Dashboard → Recipe Collection → Search/Filter → Recipe Modal → Save/Share
```

**Recipe Management Features:**
- Save recipes from analysis
- Custom recipe collections
- Recipe sharing (future)
- Meal planning integration (future)

#### 4.3 Admin User Flow
```
Login → Admin Panel → User Management → Analytics → System Settings
```

**Admin Access Control:**
```typescript
const ADMIN_EMAILS = ['michael.delaguera@gmail.com']

const isAdminUser = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email)
}
```

## User Experience Optimizations

### 1. Progressive Enhancement
```
Basic Upload → Camera Integration → Advanced Features → Premium Options
```

**Enhancement Layers:**
- **Level 1**: Basic image upload and analysis
- **Level 2**: Camera integration and real-time capture
- **Level 3**: Recipe generation and shopping
- **Level 4**: Advanced analytics and admin features

### 2. Error Recovery Flows

#### 2.1 Camera Permission Denied
```
Camera Request → Permission Denied → Fallback to Upload → Success Message
```

**Error Handling:**
```typescript
catch (error) {
  let errorMessage = "Could not access camera. "
  if (error.name === "NotAllowedError") {
    errorMessage += "Please allow camera access and try again."
  }
  errorMessage += " Try uploading an image instead."
  toast.error(errorMessage)
}
```

#### 2.2 Analysis Failure
```
Image Submit → API Error → Retry Option → Alternative Methods → Support Contact
```

**Fallback Strategy:**
1. Automatic retry (1x)
2. Simulated data mode
3. Error reporting
4. Support contact information

### 3. Performance Optimizations

#### 3.1 Image Compression Flow
```
Image Selection → Client Compression → Size Validation → Upload → Analysis
```

**Compression Settings:**
```typescript
const compressedImage = await compressImage(file, {
  maxWidth: 1280,
  maxHeight: 720,
  quality: 0.8,
  maxSizeKB: 500
})
```

#### 3.2 Lazy Loading Strategy
```
Initial Page Load → Visible Content → Background Loading → Progressive Enhancement
```

## Conversion Optimization

### 1. Engagement Touchpoints
```
Homepage → Analysis → Results → Registration → Dashboard → Recipe → Purchase
```

**Conversion Metrics:**
- Page views to analysis attempts
- Analysis attempts to registrations
- Registrations to dashboard usage
- Recipe views to affiliate clicks

### 2. Retention Strategies
```
First Use → Email Verification → Welcome Series → Feature Discovery → Habit Formation
```

**Retention Features:**
- Analysis history for reference
- Recipe collection building
- Shopping convenience
- Community features (future)

## Analytics & Tracking

### 1. User Journey Tracking
```typescript
// Track key user actions
trackUserJourney('homepage_visit')
trackUserJourney('image_selected')
trackUserJourney('analysis_started')
trackUserJourney('results_viewed')
trackUserJourney('user_registered')
trackUserJourney('recipe_viewed')
trackUserJourney('affiliate_clicked')
```

### 2. Conversion Funnel
```
Visitors → Image Uploads → Analyses → Registrations → Active Users → Purchases
```

**Key Metrics:**
- **Visitor to Upload**: Homepage effectiveness
- **Upload to Analysis**: Technical success rate
- **Analysis to Registration**: Value demonstration
- **Registration to Activity**: Onboarding success
- **Activity to Purchase**: Monetization rate

## Accessibility Considerations

### 1. Screen Reader Support
- ARIA labels for all interactive elements
- Semantic HTML structure
- Keyboard navigation support
- High contrast mode compatibility

### 2. Mobile Accessibility
- Touch target sizing (44px minimum)
- Voice input support
- Gesture alternatives
- Text scaling support

## Future Flow Enhancements

### 1. Social Features
```
Analysis → Share Results → Social Media → Friend Invitations → Community Building
```

### 2. Meal Planning
```
Recipe Collection → Meal Calendar → Shopping Lists → Nutrition Tracking
```

### 3. Batch Analysis
```
Multiple Images → Bulk Upload → Batch Processing → Comprehensive Report
```

This comprehensive user flow documentation ensures optimal user experience across all interaction patterns and use cases in the FreshSense AI platform.