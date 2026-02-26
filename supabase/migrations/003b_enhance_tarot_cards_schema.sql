-- =====================================================
-- Enhancement to Tarot Cards Table
-- Adds imagery symbolism and separates short/long meanings
-- Run this AFTER 003_metaphysical_reference_tables.sql
-- =====================================================

-- Add new columns for richer tarot card data
ALTER TABLE tarot_cards
  ADD COLUMN IF NOT EXISTS upright_summary TEXT,
  ADD COLUMN IF NOT EXISTS reversed_summary TEXT,
  ADD COLUMN IF NOT EXISTS imagery_description TEXT,
  ADD COLUMN IF NOT EXISTS symbolism JSONB DEFAULT '{}'::jsonb;

-- Rename existing meaning columns to be more specific
ALTER TABLE tarot_cards
  RENAME COLUMN upright_meaning TO upright_meaning_long;
ALTER TABLE tarot_cards
  RENAME COLUMN reversed_meaning TO reversed_meaning_long;

-- Add comments for clarity
COMMENT ON COLUMN tarot_cards.upright_summary IS 'Short 1-2 sentence upright meaning for quick reference';
COMMENT ON COLUMN tarot_cards.reversed_summary IS 'Short 1-2 sentence reversed meaning for quick reference';
COMMENT ON COLUMN tarot_cards.upright_meaning_long IS 'Detailed upright interpretation (2-3 paragraphs)';
COMMENT ON COLUMN tarot_cards.reversed_meaning_long IS 'Detailed reversed interpretation (2-3 paragraphs)';
COMMENT ON COLUMN tarot_cards.imagery_description IS 'Description of the card imagery from Pictorial Key to the Tarot - what appears on the card visually';
COMMENT ON COLUMN tarot_cards.symbolism IS 'JSONB object with symbolic elements: {figures: [...], colors: [...], objects: [...], background: "...", symbols: [...]}';

-- Update existing constraints to allow NULL temporarily for migration
ALTER TABLE tarot_cards
  ALTER COLUMN upright_meaning_long DROP NOT NULL,
  ALTER COLUMN reversed_meaning_long DROP NOT NULL;

-- Add index for symbolism JSONB queries
CREATE INDEX IF NOT EXISTS idx_tarot_symbolism ON tarot_cards USING GIN(symbolism);
