-- Add primary_layer column to saved_queries table
ALTER TABLE main.saved_queries ADD COLUMN IF NOT EXISTS primary_layer TEXT NOT NULL DEFAULT 'parks'; 