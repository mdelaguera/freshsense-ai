import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for food analyses
export interface FoodAnalysis {
  id: string
  identified_food: string
  visual_assessment: 'Good' | 'Poor - Use Immediately' | 'Inedible - Discard Immediately'
  key_visual_indicators?: string
  estimated_remaining_freshness_days?: string
  confidence: 'High' | 'Medium' | 'Low'
  user_verification_notes?: string
  safety_warning?: string
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export const foodAnalysisService = {
  // Insert a new analysis
  async create(analysis: Omit<FoodAnalysis, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('food_analyses')
      .insert([analysis])
      .select()
      .single()
    
    if (error) throw error
    return data as FoodAnalysis
  },

  // Get all analyses with pagination
  async getAll(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('food_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return data as FoodAnalysis[]
  },

  // Get analyses by food type
  async getByFoodType(foodType: string) {
    const { data, error } = await supabase
      .from('food_analyses')
      .select('*')
      .eq('identified_food', foodType)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as FoodAnalysis[]
  },

  // Get analytics data
  async getAnalytics() {
    const { data, error } = await supabase
      .from('food_analyses')
      .select('identified_food, visual_assessment, confidence, created_at')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}