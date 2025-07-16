# Manual Supabase Setup for FreshSense AI

Since the CLI deployment is having authentication issues, here's how to manually set up Supabase:

## Current Configuration
- **Project Reference**: `krlgqtpfrsnplwnnawlx`
- **Project URL**: `https://krlgqtpfrsnplwnnawlx.supabase.co`

## Step 1: Verify Project Access
1. Go to https://app.supabase.com
2. Find project with reference: `krlgqtpfrsnplwnnawlx`
3. Go to Settings > API to get the correct:
   - Project URL
   - `anon` `public` API key

## Step 2: Update Environment Variables
Update `.env.local` with the correct API key from the Supabase dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://krlgqtpfrsnplwnnawlx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-correct-anon-key>
```

## Step 3: Set Up Database Tables
Run this SQL in the Supabase SQL editor:

```sql
-- Create table for storing food analysis results
CREATE TABLE IF NOT EXISTS food_analyses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    identified_food text NOT NULL,
    visual_assessment text NOT NULL CHECK (visual_assessment IN ('Good', 'Poor - Use Immediately', 'Inedible - Discard Immediately')),
    key_visual_indicators text,
    estimated_remaining_freshness_days text,
    confidence text CHECK (confidence IN ('High', 'Medium', 'Low')),
    user_verification_notes text,
    safety_warning text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_food_analyses_created_at ON food_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_food_analyses_food_type ON food_analyses(identified_food);

-- Enable RLS (Row Level Security)
ALTER TABLE food_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for analytics)
CREATE POLICY "Enable read access for all users" ON food_analyses FOR SELECT USING (true);

-- Create policy to allow public insert access (for storing analyses)
CREATE POLICY "Enable insert access for all users" ON food_analyses FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS update_food_analyses_updated_at ON food_analyses;
CREATE TRIGGER update_food_analyses_updated_at 
    BEFORE UPDATE ON food_analyses 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

## Step 4: Deploy Edge Function Manually

### Option A: Using Supabase Dashboard
1. Go to Edge Functions in your Supabase dashboard
2. Create a new function called `analyze-food`
3. Copy the content from `supabase/functions/analyze-food/index.ts`

### Option B: Using CLI (if you can get it working)
```bash
# Set your access token
export SUPABASE_ACCESS_TOKEN=your-access-token

# Link the project
supabase link --project-ref krlgqtpfrsnplwnnawlx

# Deploy the function
supabase functions deploy analyze-food --no-verify-jwt
```

## Step 5: Set Environment Variables in Supabase
In your Supabase dashboard, go to Edge Functions > Settings and add:

```
OPENAI_API_KEY=your-openai-api-key
SUPABASE_URL=https://krlgqtpfrsnplwnnawlx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Step 6: Test the Integration

### Test Database Connection
```bash
curl -X GET "https://krlgqtpfrsnplwnnawlx.supabase.co/rest/v1/food_analyses?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Test Edge Function
```bash
curl -X POST "https://krlgqtpfrsnplwnnawlx.supabase.co/functions/v1/analyze-food" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."}'
```

## Step 7: Start Development Server
```bash
npm run dev
```

## Troubleshooting

### If you get "Invalid API key" errors:
1. Double-check the API key in Supabase dashboard
2. Make sure you're using the `anon` `public` key, not the service role key
3. Ensure the project reference is correct

### If Edge Function doesn't work:
1. Check function logs in Supabase dashboard
2. Verify OpenAI API key is set correctly
3. Check function deployment status

### If database operations fail:
1. Verify RLS policies are correct
2. Check table structure matches expectations
3. Test direct SQL queries in Supabase SQL editor

## Current Project Status
✅ Environment variables configured with project details
✅ Supabase client library installed
✅ Database migration SQL ready
✅ Edge Function code ready
⏳ Waiting for correct API keys and manual deployment
⏳ OpenAI API key configuration needed