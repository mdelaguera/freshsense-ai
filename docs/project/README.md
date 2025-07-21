# FreshSense AI - Project Documentation

## Overview

FreshSense AI is a comprehensive food freshness analysis platform that uses advanced AI vision technology to assess food quality and provide recipe suggestions. The platform combines computer vision, machine learning, and e-commerce integration to help users reduce food waste, save money, and make better food decisions.

## Table of Contents

1. [Architecture](#architecture)
2. [MVP Components](#mvp-components)
3. [Technology Stack](#technology-stack)
4. [Key Features](#key-features)
5. [User Flow](#user-flow)
6. [Development Status](#development-status)
7. [Deployment](#deployment)

## Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **UI Library**: Shadcn/ui components with Tailwind CSS
- **State Management**: React hooks and Context API
- **Authentication**: Supabase Auth with email/password
- **Analytics**: Vercel Analytics and custom tracking

### Backend Architecture
- **Primary API**: Supabase Edge Functions with OpenAI GPT-4o Vision
- **Legacy Support**: Flask backend for image processing
- **Database**: Supabase (PostgreSQL) for user data and analysis history
- **File Storage**: Supabase Storage for user images

### AI Processing
- **Vision Model**: OpenAI GPT-4o Vision API
- **Analysis Type**: Multi-modal food freshness assessment
- **Response Format**: Structured JSON with confidence scores
- **Features**: Food identification, freshness assessment, recipe generation

## MVP Components

### Core Components

#### 1. Food Analysis Engine
- **Location**: `components/food-freshness-analyzer.tsx`
- **Purpose**: Main analysis interface with image upload and camera capture
- **Features**:
  - Image upload with compression
  - Live camera capture using WebRTC
  - Real-time analysis progress
  - Error handling and fallbacks

#### 2. User Authentication System
- **Location**: `contexts/auth-context.tsx`, `components/protected-route.tsx`
- **Purpose**: User management and access control
- **Features**:
  - Email/password authentication
  - Admin role management
  - Deferred login (analyze first, login on submission)

#### 3. Dashboard System
- **Location**: `app/dashboard/page.tsx`, `components/dashboard/`
- **Purpose**: User activity tracking and history
- **Features**:
  - Past food scans with results
  - Recipe collection with affiliate links
  - Purchase history integration
  - Activity feed

#### 4. Recipe Generation & E-commerce
- **Location**: `components/recipe-modal.tsx`, `lib/affiliate-links.ts`
- **Purpose**: Recipe suggestions with monetization
- **Features**:
  - AI-generated recipes from analyzed food
  - Amazon affiliate integration (freshsense-20)
  - Ingredient shopping links
  - Recipe saving and management

#### 5. Admin Panel
- **Location**: `app/admin/page.tsx`, `components/admin/`
- **Purpose**: System administration and analytics
- **Features**:
  - User management
  - System analytics
  - Analysis monitoring
  - Restricted access (michael.delaguera@gmail.com only)

#### 6. Food Labeling System
- **Location**: `components/food-labeling-modal.tsx`
- **Purpose**: User-driven AI training data collection
- **Features**:
  - Manual food categorization
  - Freshness correction
  - Custom tags and notes
  - AI prediction comparison

### UI/UX Components

#### 1. Navigation System
- **Desktop**: `components/app-header.tsx` with horizontal menu
- **Mobile**: Responsive hamburger menu with slide-out panel
- **Features**: Logo branding, section navigation, admin access

#### 2. Image Handling
- **Upload**: `components/image-upload.tsx` with drag-and-drop
- **Camera**: WebRTC integration with getUserMedia API
- **Compression**: Client-side image optimization
- **Preview**: Real-time image preview with editing options

#### 3. Results Display
- **Analysis**: `components/enhanced-food-results.tsx`
- **Recipes**: `components/recipe-modal.tsx`
- **History**: `components/dashboard/past-scans.tsx`

## Technology Stack

### Frontend Technologies
```
React 18.3.0
Next.js 15.2.4
TypeScript 5.7.2
Tailwind CSS 3.4.17
Shadcn/ui Components
Lucide React Icons
```

### Backend Technologies
```
Supabase (PostgreSQL + Edge Functions)
OpenAI GPT-4o Vision API
Flask (Legacy support)
Vercel Serverless Functions
```

### Development Tools
```
ESLint + Prettier
PostCSS
Node.js 18+
npm/yarn package manager
Git version control
```

### Third-party Integrations
```
Amazon Associates Affiliate Program
Vercel Analytics
Sentry Error Tracking (planned)
Google Analytics (optional)
```

## Key Features

### 1. AI Food Analysis
- **Input**: Photo upload or camera capture
- **Processing**: OpenAI GPT-4o Vision analysis
- **Output**: Structured assessment with confidence scores
- **Features**:
  - Food identification
  - Freshness assessment (fresh/good/soon/spoiled)
  - Days remaining estimation
  - Visual quality indicators
  - Safety recommendations

### 2. Recipe Generation
- **Source**: AI analysis of food items
- **Features**:
  - Recipe suggestions based on available ingredients
  - Cooking instructions and tips
  - Nutritional information
  - Difficulty ratings and prep times
  - Cost estimation

### 3. E-commerce Integration
- **Platform**: Amazon Fresh & Amazon Associates
- **Tracking ID**: freshsense-20
- **Features**:
  - Ingredient shopping links
  - Bulk purchase options
  - Price tracking and comparison
  - Affiliate commission tracking

### 4. User Management
- **Authentication**: Supabase Auth
- **Features**:
  - Email/password login
  - Account verification
  - Password recovery
  - Profile management
  - Analysis history

### 5. Admin Dashboard
- **Access**: Restricted to admin users
- **Features**:
  - User analytics
  - System health monitoring
  - Analysis result tracking
  - Performance metrics

## User Flow

### 1. Initial Visit
```
Homepage → View features → Try analyzer (no login required)
```

### 2. Food Analysis
```
Upload/Camera → AI Analysis → Results Display → Login Prompt (for saving)
```

### 3. Recipe Discovery
```
Analysis Results → Recipe Suggestions → View Recipe Modal → Shop Ingredients
```

### 4. User Registration
```
Analysis Attempt → Login Prompt → Registration → Email Verification → Analysis Complete
```

### 5. Returning User
```
Login → Dashboard → Past Scans/Recipes → New Analysis → Recipe Management
```

## Development Status

### ✅ Completed Features
- [x] Core food analysis with OpenAI Vision
- [x] User authentication system
- [x] Responsive navigation with mobile menu
- [x] Camera functionality with WebRTC
- [x] Recipe generation and modal display
- [x] Amazon affiliate link integration
- [x] Admin panel with access controls
- [x] Food labeling system for AI training
- [x] User dashboard with history
- [x] Image compression and optimization
- [x] Error handling and loading states

### 🚧 In Progress
- [ ] Recipe storage system optimization
- [ ] Advanced analytics integration
- [ ] User activity tracking enhancements

### 📋 Planned Features
- [ ] Multi-language support
- [ ] Bulk food analysis
- [ ] Nutrition tracking
- [ ] Meal planning integration
- [ ] Social features (sharing recipes)
- [ ] API rate limiting and optimization
- [ ] Advanced search and filtering
- [ ] Export functionality

## Deployment

### Current Deployment
- **Frontend**: Vercel (automatic deployment from GitHub)
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **Domain**: Custom domain through Vercel

### Environment Variables
```
OPENAI_API_KEY=<OpenAI API key>
SUPABASE_URL=<Supabase project URL>
SUPABASE_ANON_KEY=<Supabase anonymous key>
NEXT_PUBLIC_SUPABASE_URL=<Public Supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Public Supabase key>
```

### Deployment Commands
```bash
# Build and test locally
npm run build
npm run start

# Deploy to Vercel (automatic via GitHub)
git push origin master

# Deploy Supabase functions
supabase functions deploy analyze-food
```

### Performance Considerations
- Image compression before analysis
- Lazy loading for dashboard components
- Efficient API calls with caching
- Error boundaries and fallbacks
- Mobile-first responsive design

## File Structure

```
├── app/                    # Next.js 15 App Router
├── components/             # React components
│   ├── admin/             # Admin panel components
│   ├── dashboard/         # User dashboard components
│   └── ui/                # Shadcn/ui components
├── contexts/              # React contexts
├── lib/                   # Utility libraries
├── supabase/              # Supabase configuration
├── docs/                  # Documentation
└── public/                # Static assets
```

This documentation provides a comprehensive overview of the FreshSense AI platform architecture, features, and development status as of the current release.