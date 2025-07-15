-- Create table for storing food analysis results
CREATE TABLE food_analyses (
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

-- Create index for faster queries
CREATE INDEX idx_food_analyses_created_at ON food_analyses(created_at DESC);
CREATE INDEX idx_food_analyses_food_type ON food_analyses(identified_food);

-- Enable RLS (Row Level Security)
ALTER TABLE food_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for analytics)
CREATE POLICY "Enable read access for all users" ON food_analyses FOR SELECT USING (true);

-- Create policy to allow public insert access (for storing analyses)
CREATE POLICY "Enable insert access for all users" ON food_analyses FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_food_analyses_updated_at BEFORE UPDATE ON food_analyses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();