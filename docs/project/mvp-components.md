# MVP Components Documentation

## Component Architecture Overview

FreshSense AI follows a modular component architecture with clear separation of concerns. Each component is designed for reusability, maintainability, and optimal user experience.

## Core Analysis Components

### 1. FoodFreshnessAnalyzer
**File**: `components/food-freshness-analyzer.tsx`
**Purpose**: Main analysis interface and orchestration

#### Key Features:
- Image upload and camera capture integration
- AI analysis progress tracking
- Result display coordination
- Error handling and user feedback
- Food labeling integration

#### Props Interface:
```typescript
// No props - self-contained component
```

#### State Management:
```typescript
const [image, setImage] = useState<string | null>(null)
const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
const [results, setResults] = useState<AnalysisResults | null>(null)
const [isLabelingModalOpen, setIsLabelingModalOpen] = useState(false)
```

#### Integration Points:
- **ImageUploader**: For image capture and upload
- **FreshnessResults**: For displaying analysis results
- **FoodLabelingModal**: For user training data collection
- **Supabase Edge Functions**: For AI analysis

### 2. ImageUpload
**File**: `components/image-upload.tsx`
**Purpose**: Unified image capture interface

#### Key Features:
- Drag-and-drop file upload
- Live camera capture with WebRTC
- Image validation and compression
- File type and size verification
- Real-time preview

#### Props Interface:
```typescript
interface ImageUploadProps {
  onImageSelected: (file: File) => void
}
```

#### Camera Implementation:
```typescript
const startCamera = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { 
      facingMode: "environment",
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 }
    } 
  })
}
```

#### File Validation:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
```

### 3. EnhancedFoodResults
**File**: `components/enhanced-food-results.tsx`
**Purpose**: Comprehensive analysis results display

#### Key Features:
- Freshness assessment visualization
- Recipe suggestions integration
- Shopping recommendations
- Confidence scoring
- Action buttons (save, share, analyze more)

#### Props Interface:
```typescript
interface EnhancedFoodResultsProps {
  data: FoodAnalysisResult
  imageUrl: string
  onBack: () => void
}
```

## Dashboard Components

### 1. UserDashboard
**File**: `components/dashboard/user-dashboard.tsx`
**Purpose**: Main dashboard orchestration

#### Sub-components:
- **PastScans**: Historical analysis results
- **RecipeCollection**: Saved recipes with affiliate links
- **PurchaseHistory**: Amazon affiliate tracking
- **ActivityFeed**: User activity timeline

### 2. PastScans
**File**: `components/dashboard/past-scans.tsx`
**Purpose**: Analysis history management

#### Data Structure:
```typescript
interface PastScan {
  id: string
  date: string
  foodItem: string
  freshness: "fresh" | "good" | "soon" | "spoiled"
  confidence: number
  remainingDays: number
  imageUrl: string
  recipesGenerated: number
  purchased: boolean
}
```

### 3. RecipeCollection
**File**: `components/dashboard/recipe-collection.tsx`
**Purpose**: Recipe management with e-commerce

#### Key Features:
- Recipe filtering and search
- Difficulty and cost sorting
- Ingredient shopping integration
- Recipe modal display
- Amazon affiliate tracking

#### Recipe Data Structure:
```typescript
interface Recipe {
  id: string
  title: string
  description: string
  category: string
  prepTime: number
  servings: number
  rating: number
  imageUrl: string
  ingredients: number
  difficulty: string
  savedDate: string
  sourceFood: string
  tags: string[]
  estimatedCost: number
}
```

## Modal Components

### 1. RecipeModal
**File**: `components/recipe-modal.tsx`
**Purpose**: Detailed recipe display with shopping integration

#### Key Features:
- Full recipe instructions
- Ingredient list with individual buy buttons
- Nutritional information
- Chef's tips and recommendations
- Shopping cart integration
- Social sharing capabilities

#### Affiliate Integration:
```typescript
const handleIngredientShop = (ingredientName: string) => {
  const affiliateLink = generateValidatedAffiliateLink(ingredientName)
  trackAffiliateClick(ingredientName, affiliateLink.linkType)
  window.open(affiliateLink.link, '_blank', 'noopener,noreferrer')
}
```

### 2. FoodLabelingModal
**File**: `components/food-labeling-modal.tsx`
**Purpose**: User-driven AI training data collection

#### Key Features:
- Food categorization interface
- Freshness level selection
- Custom tagging system
- AI prediction comparison
- Structured data collection

#### Data Collection:
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

## Navigation Components

### 1. AppHeader
**File**: `components/app-header.tsx`
**Purpose**: Main navigation and branding

#### Key Features:
- Responsive design (desktop/mobile)
- Mobile hamburger menu
- Brand identity
- Section navigation
- Admin access controls

#### Mobile Navigation:
```typescript
const [isOpen, setIsOpen] = useState(false)

// Mobile sheet component
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" className="md:hidden">
      <Menu className="h-6 w-6" />
    </Button>
  </SheetTrigger>
</Sheet>
```

## Admin Components

### 1. AdminDashboard
**File**: `components/admin/admin-dashboard.tsx`
**Purpose**: Administrative interface

#### Sub-components:
- **DashboardOverview**: System metrics
- **UserManagement**: User administration
- **AnalyticsCharts**: Performance visualization
- **SystemSettings**: Configuration management

### 2. AdminGuard
**File**: `components/admin/admin-guard.tsx`
**Purpose**: Access control for admin features

#### Access Control:
```typescript
const ADMIN_EMAILS = ['michael.delaguera@gmail.com']

const isAdminUser = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email)
}
```

## Authentication Components

### 1. ProtectedRoute
**File**: `components/protected-route.tsx`
**Purpose**: Route-level authentication

#### Implementation:
```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])
}
```

### 2. AuthContext
**File**: `contexts/auth-context.tsx`
**Purpose**: Global authentication state

#### Context API:
```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
```

## Utility Components

### 1. UI Components
**Location**: `components/ui/`
**Purpose**: Shadcn/ui component library

#### Key Components:
- Button, Card, Dialog, Sheet
- Form inputs and validation
- Navigation and layout
- Feedback and loading states

### 2. Analytics Provider
**File**: `components/analytics-provider.tsx`
**Purpose**: User activity tracking

#### Tracking Events:
```typescript
export const trackAnalysisRequest = (isNew: boolean) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'analysis_request', {
      event_category: 'engagement',
      is_new_user: isNew
    })
  }
}
```

## Component Integration Patterns

### 1. State Management
- Local state with useState for component-specific data
- Context API for global state (auth, theme)
- Props drilling for parent-child communication
- Custom hooks for reusable logic

### 2. Data Flow
```
User Input → Component State → API Call → Result Processing → UI Update
```

### 3. Error Handling
- Component-level error boundaries
- Try-catch blocks for async operations
- User-friendly error messages
- Fallback UI states

### 4. Performance Optimization
- Lazy loading for large components
- Image optimization and compression
- Memoization for expensive calculations
- Debouncing for user input

## Testing Strategy

### 1. Component Testing
- Unit tests for individual components
- Integration tests for component interactions
- Visual regression tests for UI consistency

### 2. User Flow Testing
- End-to-end testing for critical paths
- Mobile responsiveness testing
- Cross-browser compatibility
- Performance testing

## Deployment Considerations

### 1. Build Optimization
- Tree shaking for unused code
- Code splitting for performance
- Image optimization
- Bundle analysis

### 2. Environment Management
- Development vs production builds
- Environment variable handling
- API endpoint configuration
- Feature flags for rollouts

This comprehensive component documentation provides developers with the necessary information to understand, maintain, and extend the FreshSense AI platform effectively.