-- =====================================================
-- Migration 015: Enrich planets table
-- Adds structured fields for endeavors, archetypes, and colors
-- =====================================================

ALTER TABLE planets
  ADD COLUMN IF NOT EXISTS supported_endeavors TEXT[],
  ADD COLUMN IF NOT EXISTS transit_meaning TEXT,
  ADD COLUMN IF NOT EXISTS day_of_week VARCHAR(20),
  ADD COLUMN IF NOT EXISTS archetype TEXT,
  ADD COLUMN IF NOT EXISTS color VARCHAR(50)[];
