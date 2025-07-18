# FreshSense AI - Frontend Design & Development Prompt

## Project Overview

Build a modern, responsive web application for FreshSense AI using the MagicUI framework and Sky Agent theme as design foundation. Create a sophisticated food freshness analysis platform that combines cutting-edge AI technology with an intuitive, user-friendly interface.

## Design Foundation

### Base Template
- **Framework**: MagicUI AI Agent Template
- **Theme Reference**: Sky Agent (https://agent-magicui.vercel.app/)
- **Design Philosophy**: Minimalist, professional, AI-focused

### Technology Stack
- **Frontend**: Next.js v15.2.2 + React v19
- **Styling**: TailwindCSS v4 + Framer Motion v12.5
- **Components**: shadcn/ui + Radix UI
- **TypeScript**: v5 for type safety
- **Deployment**: Vercel optimized

## Visual Design System

### Color Palette
```css
/* Primary Brand Colors */
--fresh-green: #22c55e      /* Success/Fresh indicator */
--warning-amber: #f59e0b    /* Caution indicator */
--danger-red: #ef4444       /* Spoiled/Danger indicator */
--primary-blue: #3b82f6     /* Primary brand accent */

/* Neutral Colors (Sky Agent inspired) */
--background: #ffffff       /* Light mode background */
--background-dark: #0a0a0a  /* Dark mode background */
--surface: #f8fafc          /* Card/panel background */
--surface-dark: #1e1e1e     /* Dark mode surface */
--border: #e2e8f0           /* Subtle borders */
--text-primary: #1e293b     /* Primary text */
--text-secondary: #64748b   /* Secondary text */
--text-muted: #94a3b8       /* Muted text */
```

### Typography
```css
/* Font System */
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Text Scales */
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */
--text-5xl: 3rem        /* 48px */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing & Layout
```css
/* Spacing Scale */
--space-1: 0.25rem      /* 4px */
--space-2: 0.5rem       /* 8px */
--space-3: 0.75rem      /* 12px */
--space-4: 1rem         /* 16px */
--space-6: 1.5rem       /* 24px */
--space-8: 2rem         /* 32px */
--space-12: 3rem        /* 48px */
--space-16: 4rem        /* 64px */
--space-24: 6rem        /* 96px */

/* Border Radius */
--radius-sm: 0.25rem    /* 4px */
--radius: 0.5rem        /* 8px */
--radius-lg: 0.75rem    /* 12px */
--radius-xl: 1rem       /* 16px */
```

## Application Architecture

### Page Structure

#### 1. Landing Page (`/`)
**Layout**: Single-page application with navigation sections
- Header with navigation and CTA
- Hero section with live demo
- Features showcase (Bento Grid layout)
- Use cases carousel
- Pricing tiers
- Testimonials
- FAQ section
- Footer with links

#### 2. Food Analyzer App (`/analyze`)
**Layout**: Full-screen application interface
- Clean header with branding
- Central upload area with drag-and-drop
- Analysis results panel
- History sidebar (collapsible)
- Settings panel

#### 3. Dashboard (`/dashboard`)
**Layout**: Admin panel with sidebar navigation
- Sidebar navigation
- Analytics overview cards
- Usage charts and metrics
- User management (Enterprise)
- Settings and configuration

### Component Hierarchy

```
├── Layout Components
│   ├── Header/Navigation
│   ├── Sidebar (Dashboard)
│   ├── Footer
│   └── MobileMenu
│
├── Landing Page Sections
│   ├── HeroSection
│   ├── FeaturesGrid (Bento layout)
│   ├── UseCasesCarousel
│   ├── PricingCards
│   ├── TestimonialsMarquee
│   ├── FAQAccordion
│   └── CTASection
│
├── Analyzer Components
│   ├── UploadZone (drag-and-drop)
│   ├── ImagePreview
│   ├── AnalysisLoader
│   ├── ResultsPanel
│   ├── FreshnessIndicator
│   ├── RecommendationsCard
│   └── HistoryList
│
├── Dashboard Components
│   ├── MetricsCards
│   ├── UsageCharts
│   ├── UserTable
│   ├── SettingsForm
│   └── ActivityFeed
│
└── Shared UI Components
    ├── Button variants
    ├── Card layouts
    ├── Modal/Dialog
    ├── Toast notifications
    ├── Loading states
    └── Form elements
```

## Key Interface Sections

### 1. Hero Section
**Design**: Sky Agent inspired gradient background with centered content

```jsx
Features:
- Large headline: "Stop Guessing. Start Knowing."
- Animated food freshness demo
- Primary CTA: "Analyze Food Now"
- Trust indicators (user count, analyses)
- Background: Subtle radial gradient
- Mobile-first responsive layout
```

### 2. Food Upload Interface
**Design**: Clean, spacious upload area with visual feedback

```jsx
Features:
- Large drag-and-drop zone
- File type indicators (JPG, PNG, WEBP)
- Preview thumbnail with edit options
- Progress indicator during upload
- Animated states (idle, hover, uploading)
- Error handling with clear messages
- Mobile camera integration
```

### 3. Analysis Results Panel
**Design**: Card-based layout with color-coded indicators

```jsx
Features:
- Freshness score (1-10) with color gradient
- Visual indicators (Fresh/Caution/Spoiled)
- Detailed analysis breakdown
- Consumption recommendations
- Storage tips
- Confidence percentage
- Share/save functionality
```

### 4. Features Bento Grid
**Design**: Asymmetrical grid showcasing key features

```jsx
Layout:
┌─────────────┬─────────┐
│   AI Vision │ Speed   │
│   (Large)   │ (Small) │
├─────────────┼─────────┤
│ Security    │ Mobile  │
│ (Medium)    │ (Med)   │
├─────────────┴─────────┤
│ Food Database (Full)  │
└─────────────────────────┘
```

### 5. Dashboard Analytics
**Design**: Modern admin panel with data visualization

```jsx
Features:
- Usage metrics cards
- Analysis frequency charts
- User growth indicators
- Food waste savings calculator
- Export capabilities
- Real-time updates
```

## Interactive Elements

### Animations & Transitions
```css
/* Framer Motion Configurations */

/* Page Transitions */
pageVariants: {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

/* Card Hover Effects */
cardHover: {
  scale: 1.02,
  transition: { duration: 0.2 }
}

/* Upload Zone States */
uploadStates: {
  idle: { borderColor: "#e2e8f0" },
  hover: { borderColor: "#3b82f6", scale: 1.01 },
  active: { borderColor: "#22c55e", scale: 1.02 }
}

/* Result Animations */
resultReveal: {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
}
```

### Micro-interactions
- **Button Press**: Subtle scale + shadow animation
- **Card Hover**: Gentle lift with shadow increase
- **Form Focus**: Border color change + input scale
- **Loading States**: Pulse animations + progress indicators
- **Success States**: Checkmark animation + color transition
- **Error States**: Shake animation + red border flash

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: '640px',    /* Small devices */
md: '768px',    /* Medium devices */
lg: '1024px',   /* Large devices */
xl: '1280px',   /* Extra large */
2xl: '1536px'   /* 2X Extra large */
```

### Layout Adaptations

#### Mobile (< 768px)
- Single column layout
- Collapsible navigation
- Touch-optimized buttons (min 44px)
- Full-width upload zone
- Stacked feature cards
- Bottom sheet modals

#### Tablet (768px - 1024px)
- Two-column layout for features
- Sidebar navigation (collapsible)
- Grid layouts with 2-3 columns
- Hover states enabled
- Modal dialogs

#### Desktop (> 1024px)
- Multi-column layouts
- Persistent sidebar navigation
- Complex grid layouts
- Hover animations
- Keyboard shortcuts
- Multi-panel interfaces

## User Experience Flow

### 1. First-Time User Journey
```
Landing Page → Features Demo → Upload Food Image → 
View Results → Sign Up Prompt → Dashboard Tour
```

### 2. Returning User Flow
```
Login → Dashboard → Quick Analyze → View History → 
Account Settings → Premium Upgrade
```

### 3. Analysis Workflow
```
Upload Image → Processing Animation → Results Display → 
Recommendations → Save to History → Share Options
```

## Component Specifications

### UploadZone Component
```jsx
Features:
- Drag and drop functionality
- Click to upload fallback
- Multiple file support
- File validation (type, size)
- Preview thumbnails
- Progress indicators
- Error handling
- Mobile camera access
- Accessibility compliance

States:
- idle (default)
- dragOver (highlighted border)
- uploading (progress bar)
- success (checkmark animation)
- error (error message + retry)
```

### ResultsPanel Component
```jsx
Features:
- Freshness score visualization
- Color-coded indicators
- Detailed analysis text
- Confidence percentage
- Recommendations list
- Storage tips
- Action buttons (save, share, retry)
- Loading skeleton states

Visual Elements:
- Circular progress indicator
- Color gradient for freshness scale
- Icon system for food types
- Expandable detail sections
```

### Dashboard Metrics
```jsx
Features:
- Real-time data updates
- Interactive charts (Chart.js/Recharts)
- Metric cards with trends
- Date range selectors
- Export functionality
- Responsive table layouts
- Pagination for large datasets

Chart Types:
- Line charts (usage over time)
- Pie charts (food categories)
- Bar charts (freshness distribution)
- Progress rings (quota usage)
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text
- **Keyboard Navigation**: Full app navigation via keyboard
- **Screen Readers**: Proper ARIA labels and landmarks
- **Focus Management**: Visible focus indicators
- **Alt Text**: Descriptive image alternative text
- **Form Labels**: Clear, associated form labels

### Implementation
```jsx
// Example accessible button
<button
  aria-label="Analyze food freshness"
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
  onKeyDown={handleKeyPress}
>
  Start Analysis
</button>

// Skip navigation link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

## Performance Optimizations

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Implementation Strategies
- Image optimization with Next.js Image component
- Code splitting by route and component
- Lazy loading for non-critical components
- Service worker for offline functionality
- CDN optimization for global performance
- Bundle size monitoring and optimization

## Development Guidelines

### File Structure
```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Layout components
│   ├── analyzer/     # Food analysis components
│   ├── dashboard/    # Dashboard components
│   └── landing/      # Landing page sections
├── pages/
├── hooks/
├── utils/
├── types/
├── styles/
└── lib/
```

### Naming Conventions
- **Components**: PascalCase (e.g., `UploadZone`)
- **Files**: kebab-case (e.g., `upload-zone.tsx`)
- **Props**: camelCase (e.g., `isLoading`)
- **CSS Classes**: Tailwind utility classes

### Code Quality
- TypeScript strict mode enabled
- ESLint + Prettier configuration
- Husky pre-commit hooks
- Component documentation with Storybook
- Unit tests with Jest + Testing Library
- E2E tests with Playwright

## Implementation Priorities

### Phase 1: Core Functionality (Week 1-2)
1. Basic layout and navigation
2. Upload interface with drag-and-drop
3. Results display panel
4. Mobile responsive design
5. Dark/light mode toggle

### Phase 2: Enhanced UX (Week 3-4)
1. Advanced animations and transitions
2. Dashboard with analytics
3. User account management
4. History and saved analyses
5. Accessibility improvements

### Phase 3: Advanced Features (Week 5-6)
1. Batch analysis capabilities
2. Export and sharing functionality
3. Advanced settings and customization
4. Performance optimizations
5. Enterprise features

## Success Metrics

### User Experience
- **Task Completion Rate**: > 95% for food analysis
- **User Satisfaction**: > 4.5/5 rating
- **Mobile Usage**: > 60% of total traffic
- **Accessibility Score**: 100% Lighthouse accessibility

### Technical Performance
- **Page Load Speed**: < 2 seconds
- **API Response Time**: < 3 seconds for analysis
- **Uptime**: > 99.9%
- **Error Rate**: < 1%

## Design Resources & Assets

### Required Assets
- Logo variations (light/dark mode)
- Food category icons (SVG)
- Freshness indicator graphics
- Loading animations
- Empty state illustrations
- Error state graphics

### Design Tools Integration
- Figma design system export
- Icon library (Lucide React)
- Illustration assets (Undraw/similar)
- Stock photography for food examples

This comprehensive design prompt provides the foundation for building a modern, accessible, and user-friendly FreshSense AI web application using the MagicUI framework and Sky Agent theme aesthetics.