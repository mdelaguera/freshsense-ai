// Node.js script to create the database table
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://krlgqtpfrsnplwnnawlx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtybGdxdHBmcnNucGx3bm5hd2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MDkzNjgsImV4cCI6MjA2ODE4NTM2OH0.LmXcfkgwIWVRuFeGakOynCil66NRRfDzSFhPBNcjYo4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTables() {
  console.log('Creating food_analyses table...');
  
  // This will only work if you have the service role key or if RLS allows DDL
  const { data, error } = await supabase.rpc('sql', {
    query: `
      CREATE TABLE IF NOT EXISTS food_analyses (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          identified_food text NOT NULL,
          visual_assessment text NOT NULL CHECK (visual_assessment IN ('Good', 'Poor - Use Immediately', 'Inedible - Discard Immediately')),
          key_visual_indicators text,
          estimated_remaining_freshness_days text,
          confidence text CHECK (confidence IN ('High', 'Medium', 'Low')),
          user_verification_notes text,
          safety_warning text,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_food_analyses_created_at ON food_analyses(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_food_analyses_food_type ON food_analyses(identified_food);
      
      ALTER TABLE food_analyses ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Enable read access for all users" ON food_analyses;
      CREATE POLICY "Enable read access for all users" ON food_analyses FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Enable insert access for all users" ON food_analyses;
      CREATE POLICY "Enable insert access for all users" ON food_analyses FOR INSERT WITH CHECK (true);
    `
  });
  
  if (error) {
    console.error('Error creating table:', error);
  } else {
    console.log('✅ Table created successfully:', data);
  }
}

createTables().catch(console.error);