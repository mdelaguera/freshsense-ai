# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Frontend (Next.js)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend (Python/Flask)
- `cd backend && python -m venv venv` - Create virtual environment
- Windows: `backend\venv\Scripts\activate` | Unix/MacOS: `source backend/venv/bin/activate`
- `pip install -r backend/requirements.txt` - Install Python dependencies
- `python backend/wsgi.py` - Run Flask backend

### Testing
- Backend: `pytest` (run from backend directory)

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with TypeScript, Shadcn/ui components, Tailwind CSS
- **Backend**: Flask with Python 3.8+, image processing with Pillow
- **AI Processing**: Supabase Edge Functions with OpenAI GPT-4o Vision API
- **Database**: Supabase (PostgreSQL)
- **Analytics**: Vercel Analytics, Sentry error tracking
- **Deployment**: Vercel (frontend), Supabase (edge functions)

### Key Components Architecture

**Frontend Structure** (`app/` directory):
- `page.tsx` - Main landing page
- `api/analyze/route.ts` - Next.js API route for food analysis
- `components/food-freshness-analyzer.tsx` - Main analyzer component
- `components/ui/` - Shadcn/ui component library

**Backend Structure** (`backend/` directory):
- `app/routes.py` - Flask API endpoints (`/analyze`, `/healthcheck`)
- `app/utils/image_processor.py` - Image validation and processing
- `app/utils/response_formatter.py` - API response formatting

**Supabase Integration**:
- `supabase/functions/analyze-food/index.ts` - Edge function for AI analysis
- `supabase/migrations/` - Database schema migrations
- Table: `food_analyses` - Stores analysis results

### Data Flow
1. User uploads food image via Next.js frontend
2. Image processed through Flask backend or Next.js API route
3. Supabase Edge Function calls OpenAI Vision API for analysis
4. Results stored in Supabase database and returned to frontend
5. Structured JSON response displays freshness assessment

### Key Configuration Files
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - Shadcn/ui component configuration
- `tsconfig.json` - TypeScript configuration
- `backend/requirements.txt` - Python dependencies
- `supabase/config.toml` - Supabase local development config

### Environment Variables Required
- `OPENAI_API_KEY` - For AI image analysis
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` - Database connection
- `OPENAI_API_KEY` - Set as Supabase Edge Function secret

### Architecture Notes
The project uses Supabase Edge Functions with OpenAI Vision API for food freshness analysis. The Flask backend is legacy and should be considered deprecated in favor of the Next.js + Supabase architecture.

### Recent Updates (January 2025)
- **Authentication Flow**: Login now required only at analysis submission, not page load
- **Camera Functionality**: Proper WebRTC implementation using navigator.mediaDevices.getUserMedia API
- **Responsive Navigation**: Mobile hamburger menu with slide-out panel
- **Recipe System**: Complete recipe modal with Amazon affiliate integration (freshsense-20)
- **Food Labeling**: User-driven AI training data collection system
- **Admin Controls**: Restricted admin panel access to michael.delaguera@gmail.com
- **Dashboard**: Comprehensive user dashboard with past scans, recipes, and purchase history
- **Affiliate Integration**: Amazon Fresh and Amazon Associates with proper compliance

### MVP Status
✅ **Core Features Complete**:
- Food freshness analysis with OpenAI Vision
- Recipe generation from analyzed food
- Amazon affiliate monetization
- User authentication and dashboard
- Admin panel with analytics
- Food labeling for AI improvement
- Responsive design with camera integration

🚧 **In Progress**:
- Recipe storage optimization
- Advanced analytics integration
- User activity tracking enhancements

📋 **Planned**:
- Multi-language support
- Bulk food analysis
- Meal planning integration
- Social features and sharing