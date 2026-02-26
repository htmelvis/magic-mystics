# Metaphysical Data Architecture Design

## Executive Summary

This document outlines a scalable, normalized database architecture for storing and querying metaphysical data (astrology signs, tarot cards, crystals, planetary alignments, etc.) that supports:
- Accurate astrological calculations using ephemeris data
- Flexible associations between metaphysical concepts
- Easy addition of new metaphysical fields
- Performance at scale
- Data integrity and consistency

## Current Issues with Existing Implementation

### Problems
1. **Hardcoded Astrology Logic**: Sun/Moon/Rising sign calculations are simplified approximations in application code
2. **No Ephemeris Data**: Real astrology requires planetary positions, not date ranges
3. **Limited Extensibility**: Adding new fields (crystals, lucky numbers, etc.) requires schema changes
4. **No Associations**: Can't link tarot cards to zodiac signs, elements to planets, etc.
5. **Redundant Storage**: Each user stores sign names as strings (data duplication)

### Impact
- Inaccurate birth chart calculations
- Difficult to add new metaphysical attributes
- Poor query performance as data grows
- Maintenance overhead

---

## Proposed Architecture

### Design Principles

1. **Single Source of Truth**: Metaphysical data lives in reference tables, not duplicated per user
2. **Relational Integrity**: Use foreign keys, not string literals
3. **Flexible Associations**: Many-to-many relationships for complex connections
4. **Separation of Concerns**: Reference data separate from user data
5. **Ephemeris Integration**: Use astronomical calculation library or API for accuracy

---

## Database Schema

### 1. Zodiac Signs Reference Table

```sql
CREATE TABLE zodiac_signs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  symbol VARCHAR(10) NOT NULL, -- ♈, ♉, etc.
  element VARCHAR(20) NOT NULL, -- Fire, Earth, Air, Water
  modality VARCHAR(20) NOT NULL, -- Cardinal, Fixed, Mutable
  ruling_planet VARCHAR(50),
  date_range_start DATE NOT NULL, -- Approximate (for display only)
  date_range_end DATE NOT NULL,
  description TEXT,
  keywords TEXT[], -- PostgreSQL array: ['passionate', 'leader', 'impulsive']
  strengths TEXT[],
  weaknesses TEXT[],
  metadata JSONB, -- Flexible field for future attributes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_zodiac_element ON zodiac_signs(element);
CREATE INDEX idx_zodiac_modality ON zodiac_signs(modality);
```

### 2. Tarot Cards Reference Table

```sql
CREATE TABLE tarot_cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  arcana VARCHAR(20) NOT NULL, -- Major, Minor
  suit VARCHAR(20), -- Wands, Cups, Swords, Pentacles (NULL for Major Arcana)
  number INTEGER, -- 0-21 for Major, 1-14 for Minor (NULL for Court cards)
  court_rank VARCHAR(20), -- Page, Knight, Queen, King
  upright_meaning TEXT NOT NULL,
  reversed_meaning TEXT NOT NULL,
  keywords_upright TEXT[],
  keywords_reversed TEXT[],
  element VARCHAR(20), -- Associated element
  astrology_association VARCHAR(100), -- Associated sign/planet
  numerology INTEGER, -- Numerological value
  image_url TEXT, -- Path to card image
  thumbnail_url TEXT,
  description TEXT, -- Full card description
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tarot_arcana ON tarot_cards(arcana);
CREATE INDEX idx_tarot_suit ON tarot_cards(suit);
CREATE INDEX idx_tarot_element ON tarot_cards(element);
```

### 3. Crystals Reference Table

```sql
CREATE TABLE crystals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  scientific_name VARCHAR(100),
  color VARCHAR(50)[],
  chakra VARCHAR(50)[],
  element VARCHAR(20),
  planetary_ruler VARCHAR(50),
  properties TEXT[], -- ['healing', 'protection', 'abundance']
  metaphysical_uses TEXT,
  physical_properties TEXT, -- Hardness, composition, etc.
  image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_crystal_element ON crystals(element);
CREATE INDEX idx_crystal_chakra ON crystals USING GIN(chakra);
```

### 4. Planets Reference Table

```sql
CREATE TABLE planets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  meaning TEXT NOT NULL,
  rules_sign VARCHAR(50)[], -- Signs this planet rules
  keywords TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Association Tables (Many-to-Many)

#### Zodiac ↔ Tarot Association
```sql
CREATE TABLE zodiac_tarot_associations (
  id SERIAL PRIMARY KEY,
  zodiac_sign_id INTEGER REFERENCES zodiac_signs(id) ON DELETE CASCADE,
  tarot_card_id INTEGER REFERENCES tarot_cards(id) ON DELETE CASCADE,
  association_type VARCHAR(50) NOT NULL, -- 'ruling', 'compatible', 'symbolic'
  strength INTEGER DEFAULT 1, -- 1-10 strength of association
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zodiac_sign_id, tarot_card_id, association_type)
);

CREATE INDEX idx_zodiac_tarot_zodiac ON zodiac_tarot_associations(zodiac_sign_id);
CREATE INDEX idx_zodiac_tarot_card ON zodiac_tarot_associations(tarot_card_id);
```

#### Zodiac ↔ Crystal Association
```sql
CREATE TABLE zodiac_crystal_associations (
  id SERIAL PRIMARY KEY,
  zodiac_sign_id INTEGER REFERENCES zodiac_signs(id) ON DELETE CASCADE,
  crystal_id INTEGER REFERENCES crystals(id) ON DELETE CASCADE,
  association_type VARCHAR(50) NOT NULL, -- 'birthstone', 'recommended', 'healing'
  strength INTEGER DEFAULT 1,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zodiac_sign_id, crystal_id, association_type)
);

CREATE INDEX idx_zodiac_crystal_zodiac ON zodiac_crystal_associations(zodiac_sign_id);
CREATE INDEX idx_zodiac_crystal_crystal ON zodiac_crystal_associations(crystal_id);
```

#### Date-Based Metaphysical Attributes
```sql
CREATE TABLE daily_metaphysical_data (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  lucky_numbers INTEGER[],
  lucky_colors VARCHAR(50)[],
  recommended_crystal_id INTEGER REFERENCES crystals(id),
  recommended_tarot_card_id INTEGER REFERENCES tarot_cards(id),
  moon_phase VARCHAR(50), -- New, Waxing Crescent, Full, etc.
  moon_sign_id INTEGER REFERENCES zodiac_signs(id),
  retrograde_planets VARCHAR(50)[], -- Planets in retrograde
  energy_theme TEXT,
  advice TEXT,
  metadata JSONB, -- Extensible for new fields
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_meta_date ON daily_metaphysical_data(date);
CREATE INDEX idx_daily_meta_moon_sign ON daily_metaphysical_data(moon_sign_id);
```

### 6. Updated User Tables

#### Users Table (Modified)
```sql
ALTER TABLE users 
  DROP COLUMN sun_sign,
  DROP COLUMN moon_sign,
  DROP COLUMN rising_sign,
  ADD COLUMN sun_sign_id INTEGER REFERENCES zodiac_signs(id),
  ADD COLUMN moon_sign_id INTEGER REFERENCES zodiac_signs(id),
  ADD COLUMN rising_sign_id INTEGER REFERENCES zodiac_signs(id),
  ADD COLUMN birth_latitude DECIMAL(9,6),
  ADD COLUMN birth_longitude DECIMAL(9,6),
  ADD COLUMN birth_timezone VARCHAR(50);

-- Indexes
CREATE INDEX idx_users_sun_sign ON users(sun_sign_id);
CREATE INDEX idx_users_moon_sign ON users(moon_sign_id);
CREATE INDEX idx_users_rising_sign ON users(rising_sign_id);
```

#### User Birth Chart (New Table)
```sql
-- Store complete birth chart for each user
CREATE TABLE user_birth_charts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  sun_sign_id INTEGER REFERENCES zodiac_signs(id),
  moon_sign_id INTEGER REFERENCES zodiac_signs(id),
  rising_sign_id INTEGER REFERENCES zodiac_signs(id),
  mercury_sign_id INTEGER REFERENCES zodiac_signs(id),
  venus_sign_id INTEGER REFERENCES zodiac_signs(id),
  mars_sign_id INTEGER REFERENCES zodiac_signs(id),
  jupiter_sign_id INTEGER REFERENCES zodiac_signs(id),
  saturn_sign_id INTEGER REFERENCES zodiac_signs(id),
  -- Planetary degrees for advanced calculations
  planetary_positions JSONB, -- { "sun": {"sign": "Leo", "degree": 15.23, "house": 10}, ... }
  house_cusps JSONB, -- House system calculations
  aspects JSONB, -- Planetary aspects
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  calculation_method VARCHAR(50), -- 'placidus', 'whole-sign', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_birth_charts_user ON user_birth_charts(user_id);
```

#### User Preferences (New Table)
```sql
CREATE TABLE user_metaphysical_preferences (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  favorite_crystal_ids INTEGER[], -- Array of crystal IDs
  favorite_tarot_cards INTEGER[], -- Array of tarot card IDs
  preferred_deck VARCHAR(100), -- 'Rider-Waite', 'Thoth', etc.
  house_system VARCHAR(50), -- 'Placidus', 'Whole Sign', etc.
  preferences JSONB, -- Extensible preferences
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Accurate Astrology Calculations

### Problem: Current Implementation Uses Date Ranges
**Issue**: Sun sign date ranges (e.g., "Aries: March 21 - April 19") are approximations and ignore:
- Year-to-year variation (leap years, solstices shift)
- Time of birth (sign can change during a day)
- Location (timezone, latitude/longitude)
- Other planetary positions

### Solution: Use Ephemeris Library

#### Recommended: Swiss Ephemeris (via astro library)

```typescript
// src/lib/astrology/ephemeris.ts
import Ephemeris from 'ephemeris';

interface BirthData {
  date: Date;
  time: string; // HH:mm format
  latitude: number;
  longitude: number;
  timezone: string;
}

interface BirthChart {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  mercury: string;
  venus: string;
  mars: string;
  jupiter: string;
  saturn: string;
  planetaryPositions: Record<string, any>;
  houses: number[];
}

export async function calculateAccurateBirthChart(
  birthData: BirthData
): Promise<BirthChart> {
  // Convert local time to UTC
  const birthDateTime = combineDateAndTime(
    birthData.date,
    birthData.time,
    birthData.timezone
  );

  // Calculate planetary positions
  const positions = Ephemeris.getAllPlanets(
    birthDateTime,
    birthData.latitude,
    birthData.longitude
  );

  // Calculate houses (using Placidus system)
  const houses = Ephemeris.getHouseCusps(
    birthDateTime,
    birthData.latitude,
    birthData.longitude,
    'placidus'
  );

  return {
    sunSign: getSignFromPosition(positions.sun.longitude),
    moonSign: getSignFromPosition(positions.moon.longitude),
    risingSign: getSignFromPosition(houses[0]), // Ascendant
    mercury: getSignFromPosition(positions.mercury.longitude),
    venus: getSignFromPosition(positions.venus.longitude),
    mars: getSignFromPosition(positions.mars.longitude),
    jupiter: getSignFromPosition(positions.jupiter.longitude),
    saturn: getSignFromPosition(positions.saturn.longitude),
    planetaryPositions: positions,
    houses: houses,
  };
}

function getSignFromPosition(longitude: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const signIndex = Math.floor(longitude / 30);
  return signs[signIndex];
}
```

#### Alternative: Third-Party API
If you don't want to manage ephemeris calculations:

**Option 1: Astro-Seek API** (free tier available)
**Option 2: AstrologyAPI.com** (paid, but comprehensive)

```typescript
// src/lib/astrology/api-client.ts
export async function fetchBirthChartFromAPI(
  birthData: BirthData
): Promise<BirthChart> {
  const response = await fetch('https://api.astrology-api.com/v1/natal-chart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ASTROLOGY_API_KEY}`,
    },
    body: JSON.stringify({
      date: birthData.date.toISOString().split('T')[0],
      time: birthData.time,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone,
    }),
  });

  return response.json();
}
```

---

## Query Patterns & Performance

### Common Queries

#### 1. Get User's Complete Profile with Metaphysical Data
```sql
SELECT 
  u.*,
  ss.name as sun_sign_name,
  ss.element as sun_sign_element,
  ms.name as moon_sign_name,
  rs.name as rising_sign_name,
  ubc.planetary_positions,
  ARRAY_AGG(DISTINCT c.name) as recommended_crystals,
  ARRAY_AGG(DISTINCT tc.name) as associated_tarot_cards
FROM users u
LEFT JOIN zodiac_signs ss ON u.sun_sign_id = ss.id
LEFT JOIN zodiac_signs ms ON u.moon_sign_id = ms.id
LEFT JOIN zodiac_signs rs ON u.rising_sign_id = rs.id
LEFT JOIN user_birth_charts ubc ON u.id = ubc.user_id
LEFT JOIN zodiac_crystal_associations zca ON ss.id = zca.zodiac_sign_id
LEFT JOIN crystals c ON zca.crystal_id = c.id
LEFT JOIN zodiac_tarot_associations zta ON ss.id = zta.zodiac_sign_id
LEFT JOIN tarot_cards tc ON zta.tarot_card_id = tc.id
WHERE u.id = $1
GROUP BY u.id, ss.id, ms.id, rs.id, ubc.id;
```

#### 2. Get Daily Recommendations for User
```sql
SELECT 
  dmd.*,
  zs.name as moon_sign_name,
  c.name as recommended_crystal,
  tc.name as daily_tarot_card
FROM daily_metaphysical_data dmd
LEFT JOIN zodiac_signs zs ON dmd.moon_sign_id = zs.id
LEFT JOIN crystals c ON dmd.recommended_crystal_id = c.id
LEFT JOIN tarot_cards tc ON dmd.recommended_tarot_card_id = tc.id
WHERE dmd.date = CURRENT_DATE;
```

#### 3. Find Compatible Crystals for User's Signs
```sql
SELECT DISTINCT c.*, zca.association_type, zca.strength
FROM crystals c
INNER JOIN zodiac_crystal_associations zca ON c.id = zca.crystal_id
WHERE zca.zodiac_sign_id IN (
  SELECT sun_sign_id FROM users WHERE id = $1
  UNION
  SELECT moon_sign_id FROM users WHERE id = $1
  UNION
  SELECT rising_sign_id FROM users WHERE id = $1
)
ORDER BY zca.strength DESC, c.name;
```

### Performance Optimizations

1. **Materialized Views** for complex aggregations
```sql
CREATE MATERIALIZED VIEW user_metaphysical_summary AS
SELECT 
  u.id,
  u.email,
  ss.name as sun_sign,
  ms.name as moon_sign,
  rs.name as rising_sign,
  ss.element as dominant_element,
  ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.id IS NOT NULL) as crystals,
  ARRAY_AGG(DISTINCT tc.name) FILTER (WHERE tc.id IS NOT NULL) as tarot_cards
FROM users u
LEFT JOIN zodiac_signs ss ON u.sun_sign_id = ss.id
LEFT JOIN zodiac_signs ms ON u.moon_sign_id = ms.id
LEFT JOIN zodiac_signs rs ON u.rising_sign_id = rs.id
LEFT JOIN zodiac_crystal_associations zca ON ss.id = zca.zodiac_sign_id
LEFT JOIN crystals c ON zca.crystal_id = c.id
LEFT JOIN zodiac_tarot_associations zta ON ss.id = zta.zodiac_sign_id
LEFT JOIN tarot_cards tc ON zta.tarot_card_id = tc.id
GROUP BY u.id, ss.name, ms.name, rs.name, ss.element;

-- Refresh periodically
CREATE UNIQUE INDEX idx_user_meta_summary ON user_metaphysical_summary(id);
REFRESH MATERIALIZED VIEW CONCURRENTLY user_metaphysical_summary;
```

2. **Caching Strategy**
- Cache zodiac signs, tarot cards, crystals reference data (rarely changes)
- Cache daily metaphysical data for current date
- Invalidate user birth chart cache only when birth data changes

3. **Partitioning** (for scale)
```sql
-- Partition readings table by date
CREATE TABLE readings (
  /* ... existing columns ... */
) PARTITION BY RANGE (created_at);

CREATE TABLE readings_2024 PARTITION OF readings
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE readings_2025 PARTITION OF readings
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

---

## Data Seeding Strategy

### 1. Zodiac Signs
Create a seed file with all 12 signs + detailed attributes

### 2. Tarot Cards
78 cards from Rider-Waite deck with meanings

### 3. Crystals
Start with ~50 most common crystals

### 4. Associations
Map relationships based on traditional metaphysical knowledge

```typescript
// supabase/seeds/001_metaphysical_reference_data.ts
export async function seedMetaphysicalData() {
  // Seed zodiac signs
  await seedZodiacSigns();
  
  // Seed tarot cards
  await seedTarotCards();
  
  // Seed crystals
  await seedCrystals();
  
  // Seed associations
  await seedZodiacTarotAssociations();
  await seedZodiacCrystalAssociations();
}
```

---

## Migration Path

### Phase 1: Add Reference Tables (No Breaking Changes)
1. Create new reference tables
2. Seed with data
3. Add new foreign key columns to users table (nullable)
4. Keep old string columns temporarily

### Phase 2: Backfill & Validate
1. Backfill foreign keys based on existing string values
2. Validate data integrity
3. Run both systems in parallel

### Phase 3: Cut Over
1. Update application code to use new schema
2. Drop old string columns
3. Make foreign keys NOT NULL

---

## Extensibility Examples

### Adding New Field: "Lucky Numbers by Zodiac"
```sql
-- No schema change needed! Use JSONB metadata field
UPDATE zodiac_signs 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{lucky_numbers}',
  '[3, 7, 9]'::jsonb
)
WHERE name = 'Aries';
```

### Adding New Association: "Zodiac ↔ Essential Oils"
```sql
CREATE TABLE essential_oils (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  properties TEXT[],
  metadata JSONB
);

CREATE TABLE zodiac_oil_associations (
  id SERIAL PRIMARY KEY,
  zodiac_sign_id INTEGER REFERENCES zodiac_signs(id),
  oil_id INTEGER REFERENCES essential_oils(id),
  UNIQUE(zodiac_sign_id, oil_id)
);
```

---

## Recommended Implementation Order

1. ✅ **Phase 1: Reference Tables** (1-2 days)
   - Create tables
   - Write seed scripts
   - Deploy to Supabase

2. ✅ **Phase 2: Ephemeris Integration** (2-3 days)
   - Add astrology calculation library
   - Update onboarding to collect lat/long
   - Store accurate birth chart data

3. ✅ **Phase 3: Update User Schema** (1 day)
   - Add foreign keys
   - Backfill existing users
   - Update queries

4. ✅ **Phase 4: UI Integration** (2-3 days)
   - Display crystals, tarot associations
   - Daily recommendations feature
   - Reading history with metaphysical context

---

## Benefits of This Architecture

✅ **Accurate Calculations**: Real ephemeris data, not approximations  
✅ **Scalable**: Normalized structure with proper indexes  
✅ **Flexible**: Easy to add new metaphysical concepts  
✅ **Performant**: Optimized queries, caching, materialized views  
✅ **Maintainable**: Single source of truth for reference data  
✅ **Production-Ready**: Proper foreign keys, constraints, RLS policies  

---

## Next Steps

1. Review and approve architecture
2. Create database migration scripts
3. Build seed data files
4. Integrate ephemeris library
5. Update application code to use new schema
6. Test accuracy against known birth charts
7. Deploy to production

This architecture will serve you well as you scale and add new features!
