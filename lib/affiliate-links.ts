/**
 * Affiliate link utilities for monetizing recipe ingredients
 * Currently configured for Amazon Fresh affiliate links
 */

// Amazon affiliate configuration following official guidelines
const AMAZON_AFFILIATE_CONFIG = {
  // Amazon Associates tracking ID - must be registered with Amazon Associates
  affiliateTag: 'freshsense-20', // Your approved Amazon Associates tracking ID
  baseUrl: 'https://www.amazon.com/s',
  freshBaseUrl: 'https://www.amazon.com/fresh/s',
  productBaseUrl: 'https://www.amazon.com/dp', // For specific product links
  // Required ref parameter for proper tracking
  refParam: 'as_li_ss_tl'
}

/**
 * Generates an Amazon Fresh affiliate link for a given ingredient
 * Following Amazon Associates guidelines for proper link formatting
 * @param ingredient The ingredient name to search for
 * @param category Optional category to narrow search (e.g., 'fresh', 'meat', 'produce')
 * @returns Formatted affiliate URL compliant with Amazon guidelines
 */
export function generateAmazonFreshLink(ingredient: string, category?: string): string {
  const searchTerm = encodeURIComponent(ingredient.toLowerCase().trim())
  const categoryParam = category ? `&rh=n%3A16318821%2Ck%3A${encodeURIComponent(category)}` : ''
  
  // Using Amazon's recommended link format with proper ref parameter
  return `${AMAZON_AFFILIATE_CONFIG.freshBaseUrl}?k=${searchTerm}&ref=${AMAZON_AFFILIATE_CONFIG.refParam}&tag=${AMAZON_AFFILIATE_CONFIG.affiliateTag}${categoryParam}`
}

/**
 * Generates a regular Amazon affiliate link (fallback for non-fresh items)
 * Following Amazon Associates guidelines for proper link formatting
 * @param ingredient The ingredient name to search for
 * @param department Optional department (e.g., 'pantry', 'grocery')
 * @returns Formatted affiliate URL compliant with Amazon guidelines
 */
export function generateAmazonLink(ingredient: string, department?: string): string {
  const searchTerm = encodeURIComponent(ingredient.toLowerCase().trim())
  const deptParam = department ? `&i=${department}` : '&i=grocery'
  
  // Using Amazon's recommended link format with proper ref parameter
  return `${AMAZON_AFFILIATE_CONFIG.baseUrl}?k=${searchTerm}&ref=${AMAZON_AFFILIATE_CONFIG.refParam}&tag=${AMAZON_AFFILIATE_CONFIG.affiliateTag}${deptParam}`
}

/**
 * Generates an Amazon product link using ASIN (recommended by Amazon for specific products)
 * Format: https://www.amazon.com/dp/ASIN/ref=nosim?tag=ASSOCIATEID
 * @param asin The 10-digit Amazon Standard Identification Number
 * @returns Formatted product affiliate URL following Amazon guidelines
 */
export function generateAmazonProductLink(asin: string): string {
  // Validate ASIN format (should be 10 characters)
  if (!asin || asin.length !== 10) {
    throw new Error('Invalid ASIN: Must be exactly 10 characters')
  }
  
  // Using Amazon's recommended product link format
  return `${AMAZON_AFFILIATE_CONFIG.productBaseUrl}/${asin}/ref=nosim?tag=${AMAZON_AFFILIATE_CONFIG.affiliateTag}`
}

/**
 * Categorizes ingredients to determine the best Amazon department/category
 * @param ingredient The ingredient name
 * @returns Object with category info for better affiliate linking
 */
export function categorizeIngredient(ingredient: string): {
  isFresh: boolean
  category: string
  department: string
  searchModifier?: string
} {
  const lowerIngredient = ingredient.toLowerCase().trim()
  
  // Fresh produce items
  const freshItems = [
    'lettuce', 'spinach', 'arugula', 'kale', 'cabbage', 'broccoli', 'cauliflower',
    'carrot', 'celery', 'onion', 'garlic', 'tomato', 'cucumber', 'bell pepper',
    'jalapeño', 'mushroom', 'avocado', 'lime', 'lemon', 'orange', 'apple',
    'banana', 'strawberry', 'blueberry', 'raspberry', 'herbs', 'cilantro',
    'parsley', 'basil', 'mint', 'rosemary', 'thyme'
  ]
  
  // Meat and seafood
  const meatItems = [
    'chicken', 'beef', 'pork', 'turkey', 'lamb', 'salmon', 'tuna', 'shrimp',
    'crab', 'lobster', 'fish', 'steak', 'ground beef', 'ground turkey',
    'bacon', 'sausage', 'ham'
  ]
  
  // Dairy items
  const dairyItems = [
    'milk', 'cheese', 'butter', 'cream', 'yogurt', 'sour cream', 'cream cheese',
    'mozzarella', 'cheddar', 'parmesan', 'eggs'
  ]
  
  // Pantry/shelf-stable items
  const pantryItems = [
    'flour', 'sugar', 'salt', 'pepper', 'olive oil', 'vegetable oil', 'vinegar',
    'soy sauce', 'pasta', 'rice', 'quinoa', 'beans', 'lentils', 'oats',
    'baking powder', 'baking soda', 'vanilla', 'cinnamon', 'paprika'
  ]
  
  // Check categories
  const isFreshProduce = freshItems.some(item => lowerIngredient.includes(item))
  const isMeat = meatItems.some(item => lowerIngredient.includes(item))
  const isDairy = dairyItems.some(item => lowerIngredient.includes(item))
  const isPantry = pantryItems.some(item => lowerIngredient.includes(item))
  
  if (isFreshProduce) {
    return {
      isFresh: true,
      category: 'fresh-produce',
      department: 'fresh',
      searchModifier: 'fresh'
    }
  } else if (isMeat) {
    return {
      isFresh: true,
      category: 'fresh-meat',
      department: 'fresh',
      searchModifier: 'fresh'
    }
  } else if (isDairy) {
    return {
      isFresh: true,
      category: 'dairy',
      department: 'fresh'
    }
  } else if (isPantry) {
    return {
      isFresh: false,
      category: 'pantry',
      department: 'grocery'
    }
  } else {
    // Default to grocery for unknown items
    return {
      isFresh: false,
      category: 'grocery',
      department: 'grocery'
    }
  }
}

/**
 * Generates the best affiliate link for an ingredient based on its category
 * @param ingredient The ingredient name
 * @returns Optimized affiliate URL
 */
export function generateOptimizedAffiliateLink(ingredient: string): string {
  const category = categorizeIngredient(ingredient)
  
  if (category.isFresh) {
    return generateAmazonFreshLink(
      category.searchModifier ? `${category.searchModifier} ${ingredient}` : ingredient,
      category.category
    )
  } else {
    return generateAmazonLink(ingredient, category.department)
  }
}

/**
 * Generates affiliate links for a list of ingredients
 * @param ingredients Array of ingredient names
 * @returns Array of objects with ingredient name and affiliate link
 */
export function generateIngredientLinks(ingredients: string[]): Array<{
  name: string
  affiliateLink: string
  category: string
  isFresh: boolean
}> {
  return ingredients.map(ingredient => {
    const category = categorizeIngredient(ingredient)
    return {
      name: ingredient,
      affiliateLink: generateOptimizedAffiliateLink(ingredient),
      category: category.category,
      isFresh: category.isFresh
    }
  })
}

/**
 * Tracks affiliate link clicks for analytics
 * @param ingredient The ingredient that was clicked
 * @param linkType Type of link ('amazon-fresh' or 'amazon')
 */
export function trackAffiliateClick(ingredient: string, linkType: 'amazon-fresh' | 'amazon') {
  // You can integrate with your analytics service here
  console.log(`Affiliate link clicked: ${ingredient} (${linkType})`)
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      ingredient_name: ingredient,
      link_type: linkType,
      event_category: 'monetization'
    })
  }
}

/**
 * Generates a shopping cart URL with multiple ingredients
 * Following Amazon Associates guidelines for proper link formatting
 * @param ingredients Array of ingredient names
 * @returns Amazon Fresh search URL with multiple items and proper affiliate tracking
 */
export function generateShoppingCartLink(ingredients: string[]): string {
  const searchTerms = ingredients.map(ing => encodeURIComponent(ing.toLowerCase().trim())).join('%20')
  return `${AMAZON_AFFILIATE_CONFIG.freshBaseUrl}?k=${searchTerms}&ref=${AMAZON_AFFILIATE_CONFIG.refParam}&tag=${AMAZON_AFFILIATE_CONFIG.affiliateTag}`
}

/**
 * Amazon Associates compliance helpers
 */

/**
 * Required affiliate disclosure text for Amazon Associates compliance
 * Must be displayed prominently when affiliate links are present
 */
export const AMAZON_AFFILIATE_DISCLOSURE = {
  short: "As an Amazon Associate, FreshSense earns from qualifying purchases.",
  full: "FreshSense is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com."
}

/**
 * Validates that affiliate links are properly formatted
 * @param url The affiliate URL to validate
 * @returns Object with validation result and details
 */
export function validateAffiliateLink(url: string): {
  isValid: boolean
  hasCorrectTag: boolean
  hasRefParameter: boolean
  issues: string[]
} {
  const issues: string[] = []
  let hasCorrectTag = false
  let hasRefParameter = false

  try {
    const urlObj = new URL(url)
    
    // Check for correct affiliate tag
    const tagParam = urlObj.searchParams.get('tag')
    if (tagParam === AMAZON_AFFILIATE_CONFIG.affiliateTag) {
      hasCorrectTag = true
    } else if (!tagParam) {
      issues.push('Missing required "tag" parameter')
    } else {
      issues.push(`Incorrect tag parameter: ${tagParam}`)
    }

    // Check for ref parameter
    const refParam = urlObj.searchParams.get('ref')
    if (refParam) {
      hasRefParameter = true
    } else {
      issues.push('Missing "ref" parameter for tracking')
    }

    // Check domain
    if (!urlObj.hostname.includes('amazon.com')) {
      issues.push('URL must be an Amazon domain')
    }

  } catch (error) {
    issues.push('Invalid URL format')
  }

  return {
    isValid: issues.length === 0,
    hasCorrectTag,
    hasRefParameter,
    issues
  }
}

/**
 * Sanitizes and validates ingredient name for affiliate link generation
 * @param ingredient Raw ingredient name
 * @returns Cleaned ingredient name safe for URL generation
 */
export function sanitizeIngredientName(ingredient: string): string {
  return ingredient
    .trim()
    .toLowerCase()
    // Remove special characters but keep spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Limit length to prevent overly long URLs
    .substring(0, 100)
}

/**
 * Generates affiliate link with built-in validation and error handling
 * @param ingredient The ingredient name
 * @param options Optional configuration for link generation
 * @returns Object with the generated link and validation status
 */
export function generateValidatedAffiliateLink(
  ingredient: string, 
  options: { 
    preferFresh?: boolean
    department?: string
    category?: string 
  } = {}
): {
  link: string
  isValid: boolean
  ingredient: string
  linkType: 'amazon-fresh' | 'amazon'
  validation: ReturnType<typeof validateAffiliateLink>
} {
  const cleanIngredient = sanitizeIngredientName(ingredient)
  
  let link: string
  let linkType: 'amazon-fresh' | 'amazon'
  
  if (options.preferFresh) {
    link = generateAmazonFreshLink(cleanIngredient, options.category)
    linkType = 'amazon-fresh'
  } else {
    const category = categorizeIngredient(cleanIngredient)
    if (category.isFresh) {
      link = generateAmazonFreshLink(cleanIngredient, category.category)
      linkType = 'amazon-fresh'
    } else {
      link = generateAmazonLink(cleanIngredient, options.department || category.department)
      linkType = 'amazon'
    }
  }

  const validation = validateAffiliateLink(link)

  return {
    link,
    isValid: validation.isValid,
    ingredient: cleanIngredient,
    linkType,
    validation
  }
}