# Amazon Affiliate Links Integration

FreshSense includes built-in affiliate link functionality to monetize recipe ingredients through Amazon Fresh and Amazon.com.

## Features

### 🛒 Smart Shopping Integration
- **Individual Ingredient Links**: Click any ingredient to shop directly on Amazon
- **Bulk Shopping**: "Shop All" button for complete recipe ingredient lists
- **Category-Aware Linking**: Automatically determines if items should link to Amazon Fresh or regular Amazon

### 📊 Analytics & Tracking
- **Click Tracking**: All affiliate clicks are tracked for analytics
- **Google Analytics Integration**: Sends affiliate click events to GA4
- **Revenue Attribution**: Track which recipes and ingredients drive the most clicks

### 🎯 Intelligent Categorization
- **Fresh Produce**: Links to Amazon Fresh for fruits, vegetables, herbs
- **Meat & Seafood**: Fresh meat products linked to Amazon Fresh
- **Dairy Products**: Milk, cheese, eggs linked to Amazon Fresh
- **Pantry Items**: Dry goods, spices, oils linked to regular Amazon

## Configuration

### Environment Variables

Add your Amazon Associates tag to your environment:

```bash
# .env.local
NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=your-associates-tag-20
```

### Link Generation

The system automatically generates optimized affiliate links:

```typescript
import { generateOptimizedAffiliateLink } from '@/lib/affiliate-links'

// Automatically determines best link type
const link = generateOptimizedAffiliateLink('fresh salmon')
// Returns: Amazon Fresh link for fresh salmon

const link2 = generateOptimizedAffiliateLink('olive oil')
// Returns: Regular Amazon link for pantry item
```

## User Experience

### Recipe Integration
- **Recipe Cards**: Each recipe shows key ingredients with shopping links
- **Quick Shopping**: One-click shopping for entire recipe ingredient lists
- **Fresh Indicators**: Visual badges show which items are available fresh

### Link Behavior
- **New Window**: All affiliate links open in new tabs
- **Analytics**: Click tracking for performance monitoring
- **User-Friendly**: Clear indicators that links are for shopping

## Revenue Potential

### High-Converting Scenarios
- **Raw Food Analysis**: Users get recipes and can immediately shop ingredients
- **Cooking Analysis**: Users may need additional ingredients or seasonings
- **Meal Planning**: Complete shopping lists for recipe execution

### Optimization Tips
1. **Target Fresh Foods**: Raw ingredient analysis has highest conversion potential
2. **Complete Ingredient Lists**: Comprehensive recipes with 5-8 ingredients perform best
3. **Seasonal Items**: Fresh produce during peak seasons
4. **Premium Ingredients**: Organic, specialty items often have higher margins

## Implementation Details

### Link Structure
```
Amazon Fresh: https://www.amazon.com/fresh/s?k={ingredient}&tag={affiliate-tag}
Regular Amazon: https://www.amazon.com/s?k={ingredient}&i=grocery&tag={affiliate-tag}
```

### Category Mapping
- **Fresh Items**: Produce, meat, dairy → Amazon Fresh
- **Pantry Items**: Spices, oils, dry goods → Amazon Grocery
- **Unknown Items**: Default to Amazon Grocery

### Analytics Events
```javascript
gtag('event', 'affiliate_click', {
  ingredient_name: 'salmon',
  link_type: 'amazon-fresh',
  event_category: 'monetization'
})
```

## Future Enhancements

### Planned Features
- **Price Comparison**: Show prices across different retailers
- **Nutrition Integration**: Link to organic/health-focused options
- **Local Store Integration**: Integrate with local grocery delivery services
- **Recipe Collections**: Curated shopping lists for themed meal plans

### A/B Testing Opportunities
- **Link Placement**: Test different positions for affiliate links
- **Call-to-Action Text**: "Shop Now" vs "Buy Ingredients" vs "Add to Cart"
- **Visual Design**: Button styles, colors, prominence
- **Bulk vs Individual**: Test preference for shopping all vs individual items

## Best Practices

### User Trust
- **Transparency**: Clear indication that links are affiliate/shopping links
- **Value First**: Provide genuine recipe value before monetization
- **No Spam**: Only show relevant, useful ingredient links

### Performance
- **Link Generation**: Generate links client-side to avoid server load
- **Caching**: Cache category determinations for common ingredients
- **Analytics**: Track but don't slow down user experience

### Compliance
- **Disclosure**: Include affiliate disclosure in appropriate locations
- **Privacy**: Handle click tracking with user privacy in mind
- **Terms**: Follow Amazon Associates program requirements