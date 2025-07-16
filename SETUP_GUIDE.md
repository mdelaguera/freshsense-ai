# FreshSense AI Setup Guide

This guide will help you set up the FreshSense AI application with Supabase and OpenAI Vision API.

## Prerequisites

1. Node.js 18+ and npm
2. Supabase CLI: `npm install -g supabase`
3. Supabase account at https://supabase.com
4. OpenAI API key from https://platform.openai.com

## Quick Start

### 1. Environment Setup

Copy the environment variables template:
```bash
cp .env.local.example .env.local
```

Update `.env.local` with your values:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id
SENTRY_DSN=your-sentry-dsn
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

#### Create a new Supabase project:
1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose organization and fill details
4. Get your Project URL and anon key from Settings > API

#### Link your local project:
```bash
supabase login
supabase link --project-ref your-project-id
```

#### Deploy database schema:
```bash
supabase db push
```

#### Deploy Edge Functions:
```bash
# Deploy the analyze-food function
supabase functions deploy analyze-food --no-verify-jwt

# Set OpenAI API key as secret
supabase secrets set OPENAI_API_KEY=your-openai-api-key
```

### 4. Development

Start the development server:
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Testing the Integration

1. Upload a food image through the web interface
2. Check browser console for API calls
3. Verify analysis results are displayed
4. Check Supabase dashboard for stored data

## Architecture Overview

### Request Flow
1. User uploads image → Next.js frontend
2. Frontend → `/api/analyze` (Next.js API route)
3. API route → Supabase Edge Function
4. Edge Function → OpenAI Vision API
5. Results stored in Supabase → Response to frontend

### Key Files
- `app/api/analyze/route.ts` - Main API endpoint
- `lib/api.ts` - Frontend API service
- `lib/supabase.ts` - Supabase client and helpers
- `supabase/functions/analyze-food/index.ts` - Edge function
- `supabase/migrations/` - Database schema

## Troubleshooting

### Common Issues

**CORS Errors**: Ensure your domain is added to Supabase Auth settings

**Function Not Found**: Verify deployment with `supabase functions list`

**OpenAI Errors**: Check API key and billing status with `supabase functions logs analyze-food`

**Database Errors**: Ensure migrations ran with `supabase db reset`

### Useful Commands

```bash
# View function logs
supabase functions logs analyze-food

# Reset local database
supabase db reset

# Check function status
supabase functions list

# Test function locally
supabase functions serve analyze-food
```

## Production Deployment

### Vercel Setup
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SENTRY_DSN` (optional)
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

### Supabase Production
Your Edge Functions are automatically available in production. No additional setup needed.

## Support

- Check logs: `supabase functions logs analyze-food`
- Supabase docs: https://supabase.com/docs
- OpenAI docs: https://platform.openai.com/docs