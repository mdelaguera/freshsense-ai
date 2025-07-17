@echo off
set SUPABASE_ACCESS_TOKEN=sbp_36c17aa714d8403ec57e4d493dca5d9db2699a65

echo Deploying Edge Function...
npx supabase functions deploy analyze-food --no-verify-jwt

echo Pushing database migrations...
npx supabase db push

echo Setting up secrets...
echo Please run: npx supabase secrets set OPENAI_API_KEY=your-openai-api-key

pause