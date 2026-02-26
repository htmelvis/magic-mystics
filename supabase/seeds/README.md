# Metaphysical Data Seeds

This directory contains seed data for the metaphysical reference tables in Magic Mystics.

## Order of Execution

**IMPORTANT**: These SQL files must be run in order after migration `003_metaphysical_reference_tables.sql` has been applied.

### 1. Apply the Migration First

```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/003_metaphysical_reference_tables.sql
```

### 2. Seed Reference Data (In Order)

```sql
-- Step 1: Zodiac Signs
-- File: supabase/seeds/seed_zodiac_signs.sql
-- Creates 12 zodiac signs with full attributes

-- Step 2: Crystals
-- File: supabase/seeds/seed_crystals.sql
-- Creates 16 crystals (fire, earth, air, water sign stones + universals)

-- Step 3: Associations
-- File: supabase/seeds/seed_associations.sql
-- Creates zodiac ↔ crystal mappings (36 associations total)
```

### 3. Verify Seeding

```sql
-- Check row counts
SELECT 'zodiac_signs' as table_name, COUNT(*) as count FROM zodiac_signs
UNION ALL
SELECT 'crystals', COUNT(*) FROM crystals
UNION ALL
SELECT 'zodiac_crystal_associations', COUNT(*) FROM zodiac_crystal_associations;

-- Expected results:
-- zodiac_signs: 12
-- crystals: 16
-- zodiac_crystal_associations: 36
```

## What's Included

### Zodiac Signs (12)

- All 12 signs with element, modality, ruling planet
- Keywords, strengths, weaknesses
- Date ranges (approximate, for display only)
- Full descriptions

### Crystals (16)

- Fire: Carnelian, Citrine, Ruby
- Earth: Emerald, Malachite, Moss Agate
- Air: Aquamarine, Lapis Lazuli, Fluorite
- Water: Moonstone, Amethyst, Black Obsidian
- Universal: Clear Quartz, Rose Quartz, Black Tourmaline, Selenite

### Associations (36)

- Each zodiac sign → 3 crystals
- Association types: birthstone, recommended, healing, amplifier, protection, etc.
- Strength ratings (1-10) based on traditional metaphysical knowledge

## What's Missing (To Be Added Later)

### Tarot Cards

**Not yet included** - Need to create seed file with:

- 22 Major Arcana cards (The Fool through The World)
- 56 Minor Arcana cards (14 cards × 4 suits)
- Full upright/reversed meanings and keywords

**File to create:** `seed_tarot_cards.sql`

### Planets

**Not yet included** - Need to create seed file with:

- 10 celestial bodies (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
- Plus North/South Nodes if desired

**File to create:** `seed_planets.sql`

### Zodiac ↔ Tarot Associations

**Not yet included** - Will be created after tarot_cards are seeded

**File to create:** `seed_zodiac_tarot_associations.sql`

## Usage in Application

Once seeded, you can query this data:

```typescript
// Fetch all zodiac signs
const { data: signs } = await supabase
  .from('zodiac_signs')
  .select('*')
  .order('id');

// Get crystals for a specific zodiac sign
const { data: crystals } = await supabase
  .from('zodiac_crystal_associations')
  .select(`
    *,
    crystal:crystals(*)
  `)
  .eq('zodiac_sign_id', signId)
  .order('strength', { ascending: false });

// Get today's metaphysical data
const { data: daily } = await supabase
  .from('daily_metaphysical_data')
  .select(`
    *,
    recommendedCrystal:crystals(*),
    moonSign:zodiac_signs(*)
  `)
  .eq('date', new Date().toISOString().split('T')[0])
  .single();
```

## Next Steps

1. Apply migration `003_metaphysical_reference_tables.sql`
2. Run seed files in order (zodiac → crystals → associations)
3. Proceed to Phase 2: User schema migration
