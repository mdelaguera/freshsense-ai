/**
 * Affiliate link utilities for monetizing recipe ingredients
 * Currently configured for Amazon Fresh affiliate links
 */

// Amazon Fresh affiliate configuration
const AMAZON_AFFILIATE_CONFIG = {
  // Use environment variable or fallback to example tag
  affiliateTag: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'freshsense-20',
  baseUrl: 'https://www.amazon.com/s',
  freshBaseUrl: 'https://www.amazon.com/fresh/s',
}

/**
 * Generates an Amazon Fresh affiliate link for a given ingredient
 * @param ingredient The ingredient name to search for
 * @param category Optional category to narrow search (e.g., 'fresh', 'meat', 'produce')
 * @returns Formatted affiliate URL
 */
export function generateAmazonFreshLink(ingredient: string, category?: string): string {
  const searchTerm = encodeURIComponent(ingredient.toLowerCase().trim())
  const categoryParam = category ? `&rh=n%3A16318821%2Ck%3A${encodeURIComponent(category)}` : ''
  
  return `${AMAZON_AFFILIATE_CONFIG.freshBaseUrl}?k=${searchTerm}&ref=nb_sb_noss&tag=${AMAZON_AFFILIATE_CONFIG.affiliateTag}${categoryParam}`
}

/**
 * Generates a regular Amazon affiliate link (fallback for non-fresh items)
 * @param ingredient The ingredient name to search for
 * @param department Optional department (e.g., 'pantry', 'grocery')
 * @returns Formatted affiliate URL
 */
export function generateAmazonLink(ingredient: string, department?: string): string {
  const searchTerm = encodeURIComponent(ingredient.toLowerCase().trim())
  const deptParam = department ? `&i=${department}` : '&i=grocery'
  
  return `${AMAZON_AFFILIATE_CONFIG.baseUrl}?k=${searchTerm}&ref=nb_sb_noss&tag=${AMAZON_AFFILIATE_CONFIG.affiliateTag}${deptParam}`
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
 * @param ingredients Array of ingredient names
 * @returns Amazon Fresh search URL with multiple items
 */
export function generateShoppingCartLink(ingredients: string[]): string {
  const searchTerms = ingredients.map(ing => encodeURIComponent(ing.toLowerCase().trim())).join('%20')
  return `${AMAZON_AFFILIATE_CONFIG.freshBaseUrl}?k=${searchTerms}&ref=nb_sb_noss&tag=${AMAZON_AFFILIATE_CONFIG.affiliateTag}`
}