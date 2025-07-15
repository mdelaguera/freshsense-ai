# Supabase Setup Guide for FreshSense

This guide will help you set up Supabase for the FreshSense food analysis application.

## Prerequisites

1. Install Supabase CLI: `npm install -g supabase`
2. Create a Supabase account at https://supabase.com
3. Get an OpenAI API key from https://platform.openai.com

## Setup Steps

### 1. Create a New Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - Name: `freshsense-ai-mvp`
   - Database Password: (generate a secure password)
   - Region: Choose closest to your users

### 2. Get Your Project Credentials

After project creation, go to Settings > API:
- Copy your Project URL
- Copy your `anon` `public` API key

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### 4. Link Your Local Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id
```

### 5. Deploy Database Migrations

```bash
# Run migrations to create the food_analyses table
supabase db push
```

### 6. Deploy Edge Functions

```bash
# Deploy the analyze-food function
supabase functions deploy analyze-food --no-verify-jwt

# Set environment variables for the function
supabase secrets set OPENAI_API_KEY=your-openai-api-key
```

### 7. Configure Function Environment

```bash
# Set additional secrets if needed
supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
```

## Testing the Setup

1. Start your Next.js development server: `npm run dev`
2. Upload a food image through the interface
3. Check the browser console for API calls
4. Verify data is stored in your Supabase database

## Vercel Deployment

Add these environment variables to your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SENTRY_DSN` (optional)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

The Supabase Edge Function will handle the OpenAI API key securely.

## Troubleshooting

### Common Issues

1. **CORS errors**: Make sure your domain is added to Supabase Auth settings
2. **Function not found**: Verify the function was deployed successfully
3. **OpenAI errors**: Check your API key and billing status
4. **Database errors**: Ensure migrations ran successfully

### Useful Commands

```bash
# View function logs
supabase functions logs analyze-food

# Reset local database
supabase db reset

# Check function status
supabase functions list
```