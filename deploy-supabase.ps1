# PowerShell script to deploy Supabase components
$env:SUPABASE_ACCESS_TOKEN = "sbp_36c17aa714d8403ec57e4d493dca5d9db2699a65"
$PROJECT_REF = "krlgqtpfrsnplwnnawlx"

Write-Host "Setting up Supabase project: $PROJECT_REF" -ForegroundColor Green

# Link the project
Write-Host "Linking to Supabase project..." -ForegroundColor Yellow
npx supabase link --project-ref $PROJECT_REF

# Deploy Edge Functions
Write-Host "Deploying Edge Functions..." -ForegroundColor Yellow
npx supabase functions deploy analyze-food --no-verify-jwt

# Push database migrations
Write-Host "Pushing database migrations..." -ForegroundColor Yellow
npx supabase db push

# Set OpenAI API key (you'll need to replace with your actual key)
Write-Host "Setting OpenAI API key..." -ForegroundColor Yellow
Write-Host "Please run: npx supabase secrets set OPENAI_API_KEY=your-openai-api-key" -ForegroundColor Red

Write-Host "Deployment complete!" -ForegroundColor Green