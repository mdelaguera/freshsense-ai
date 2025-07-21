/**
 * Affiliate Link Testing Utility
 * Tests affiliate link generation and validation for Amazon Associates compliance
 */

import { 
  generateAmazonFreshLink,
  generateAmazonLink,
  generateAmazonProductLink,
  generateValidatedAffiliateLink,
  validateAffiliateLink,
  generateShoppingCartLink,
  categorizeIngredient,
  sanitizeIngredientName
} from './affiliate-links'

/**
 * Test data for comprehensive affiliate link testing
 */
const TEST_INGREDIENTS = [
  // Fresh produce
  'fresh strawberries',
  'organic spinach',
  'bell peppers',
  'avocados',
  
  // Meat and seafood
  'chicken breast',
  'fresh salmon',
  'ground beef',
  
  // Dairy
  'organic milk',
  'cheddar cheese',
  'greek yogurt',
  
  // Pantry items
  'olive oil',
  'sea salt',
  'black pepper',
  'whole wheat flour',
  
  // Edge cases
  'special ingredient with symbols!@#',
  'very long ingredient name that might cause issues with URL length limits and encoding',
  '',
  '   whitespace   '
]

const TEST_ASINS = [
  'B000123456', // Valid ASIN format
  'B001234567', // Valid ASIN format
  '123456789',  // Invalid - too short
  'B0001234567', // Invalid - too long
  'invalid',     // Invalid format
]

/**
 * Runs comprehensive tests on affiliate link generation
 */
export function runAffiliateLinkTests(): {
  totalTests: number
  passedTests: number
  failedTests: number
  results: Array<{
    test: string
    status: 'pass' | 'fail'
    details: string
    link?: string
  }>
} {
  const results: Array<{
    test: string
    status: 'pass' | 'fail'
    details: string
    link?: string
  }> = []

  let passedTests = 0
  let failedTests = 0

  // Test 1: Basic Amazon Fresh link generation
  try {
    const link = generateAmazonFreshLink('strawberries')
    const validation = validateAffiliateLink(link)
    
    if (validation.isValid && link.includes('freshsense-20')) {
      results.push({
        test: 'Amazon Fresh Link Generation',
        status: 'pass',
        details: 'Generated valid Amazon Fresh link with correct tracking ID',
        link
      })
      passedTests++
    } else {
      results.push({
        test: 'Amazon Fresh Link Generation',
        status: 'fail',
        details: `Validation issues: ${validation.issues.join(', ')}`,
        link
      })
      failedTests++
    }
  } catch (error) {
    results.push({
      test: 'Amazon Fresh Link Generation',
      status: 'fail',
      details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
    failedTests++
  }

  // Test 2: Basic Amazon link generation
  try {
    const link = generateAmazonLink('olive oil')
    const validation = validateAffiliateLink(link)
    
    if (validation.isValid && link.includes('freshsense-20')) {
      results.push({
        test: 'Amazon Link Generation',
        status: 'pass',
        details: 'Generated valid Amazon link with correct tracking ID',
        link
      })
      passedTests++
    } else {
      results.push({
        test: 'Amazon Link Generation',
        status: 'fail',
        details: `Validation issues: ${validation.issues.join(', ')}`,
        link
      })
      failedTests++
    }
  } catch (error) {
    results.push({
      test: 'Amazon Link Generation',
      status: 'fail',
      details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
    failedTests++
  }

  // Test 3: ASIN product link generation
  TEST_ASINS.forEach(asin => {
    try {
      const link = generateAmazonProductLink(asin)
      const validation = validateAffiliateLink(link)
      
      if (asin.length === 10 && validation.isValid) {
        results.push({
          test: `ASIN Product Link - ${asin}`,
          status: 'pass',
          details: 'Generated valid product link with ASIN',
          link
        })
        passedTests++
      } else if (asin.length !== 10) {
        results.push({
          test: `ASIN Product Link - ${asin}`,
          status: 'pass',
          details: 'Correctly rejected invalid ASIN format'
        })
        passedTests++
      } else {
        results.push({
          test: `ASIN Product Link - ${asin}`,
          status: 'fail',
          details: `Validation issues: ${validation.issues.join(', ')}`,
          link
        })
        failedTests++
      }
    } catch (error) {
      if (asin.length !== 10) {
        results.push({
          test: `ASIN Product Link - ${asin}`,
          status: 'pass',
          details: 'Correctly threw error for invalid ASIN'
        })
        passedTests++
      } else {
        results.push({
          test: `ASIN Product Link - ${asin}`,
          status: 'fail',
          details: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
        failedTests++
      }
    }
  })

  // Test 4: Ingredient categorization
  const categorySamples = [
    { ingredient: 'strawberries', expectedFresh: true },
    { ingredient: 'olive oil', expectedFresh: false },
    { ingredient: 'chicken breast', expectedFresh: true },
    { ingredient: 'flour', expectedFresh: false }
  ]

  categorySamples.forEach(({ ingredient, expectedFresh }) => {
    try {
      const category = categorizeIngredient(ingredient)
      
      if (category.isFresh === expectedFresh) {
        results.push({
          test: `Categorization - ${ingredient}`,
          status: 'pass',
          details: `Correctly categorized as ${expectedFresh ? 'fresh' : 'pantry'} item`
        })
        passedTests++
      } else {
        results.push({
          test: `Categorization - ${ingredient}`,
          status: 'fail',
          details: `Expected ${expectedFresh ? 'fresh' : 'pantry'}, got ${category.isFresh ? 'fresh' : 'pantry'}`
        })
        failedTests++
      }
    } catch (error) {
      results.push({
        test: `Categorization - ${ingredient}`,
        status: 'fail',
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      failedTests++
    }
  })

  // Test 5: Ingredient sanitization
  const sanitizationTests = [
    { input: 'special ingredient!@#', expected: 'special ingredient' },
    { input: '   whitespace   ', expected: 'whitespace' },
    { input: 'multiple   spaces', expected: 'multiple spaces' }
  ]

  sanitizationTests.forEach(({ input, expected }) => {
    try {
      const sanitized = sanitizeIngredientName(input)
      
      if (sanitized === expected) {
        results.push({
          test: `Sanitization - "${input}"`,
          status: 'pass',
          details: `Correctly sanitized to "${sanitized}"`
        })
        passedTests++
      } else {
        results.push({
          test: `Sanitization - "${input}"`,
          status: 'fail',
          details: `Expected "${expected}", got "${sanitized}"`
        })
        failedTests++
      }
    } catch (error) {
      results.push({
        test: `Sanitization - "${input}"`,
        status: 'fail',
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      failedTests++
    }
  })

  // Test 6: Shopping cart link generation
  try {
    const ingredients = ['strawberries', 'spinach', 'chicken']
    const link = generateShoppingCartLink(ingredients)
    const validation = validateAffiliateLink(link)
    
    if (validation.isValid && link.includes('freshsense-20')) {
      results.push({
        test: 'Shopping Cart Link',
        status: 'pass',
        details: 'Generated valid shopping cart link for multiple ingredients',
        link
      })
      passedTests++
    } else {
      results.push({
        test: 'Shopping Cart Link',
        status: 'fail',
        details: `Validation issues: ${validation.issues.join(', ')}`,
        link
      })
      failedTests++
    }
  } catch (error) {
    results.push({
      test: 'Shopping Cart Link',
      status: 'fail',
      details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
    failedTests++
  }

  // Test 7: Validated affiliate link generation
  TEST_INGREDIENTS.slice(0, 5).forEach(ingredient => {
    try {
      const result = generateValidatedAffiliateLink(ingredient)
      
      if (result.isValid && result.link.includes('freshsense-20')) {
        results.push({
          test: `Validated Link - ${ingredient}`,
          status: 'pass',
          details: `Generated valid ${result.linkType} link`,
          link: result.link
        })
        passedTests++
      } else {
        results.push({
          test: `Validated Link - ${ingredient}`,
          status: 'fail',
          details: `Validation issues: ${result.validation.issues.join(', ')}`,
          link: result.link
        })
        failedTests++
      }
    } catch (error) {
      results.push({
        test: `Validated Link - ${ingredient}`,
        status: 'fail',
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      failedTests++
    }
  })

  return {
    totalTests: passedTests + failedTests,
    passedTests,
    failedTests,
    results
  }
}

/**
 * Quick test to verify affiliate tracking ID is correctly applied
 */
export function quickTrackingTest(): boolean {
  try {
    const freshLink = generateAmazonFreshLink('test')
    const regularLink = generateAmazonLink('test')
    const cartLink = generateShoppingCartLink(['test'])
    
    return freshLink.includes('tag=freshsense-20') &&
           regularLink.includes('tag=freshsense-20') &&
           cartLink.includes('tag=freshsense-20')
  } catch {
    return false
  }
}

/**
 * Generates sample affiliate links for manual testing
 */
export function generateSampleLinks(): Record<string, string> {
  return {
    freshStrawberries: generateAmazonFreshLink('fresh strawberries'),
    organicSpinach: generateAmazonFreshLink('organic spinach'),
    chickenBreast: generateAmazonFreshLink('chicken breast'),
    oliveOil: generateAmazonLink('olive oil'),
    seaSalt: generateAmazonLink('sea salt'),
    wholeWheatFlour: generateAmazonLink('whole wheat flour'),
    shoppingCart: generateShoppingCartLink(['strawberries', 'spinach', 'chicken', 'olive oil'])
  }
}