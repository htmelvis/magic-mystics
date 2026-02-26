# Enhanced Tarot Card Data Structure

## Overview

Our tarot card database structure is designed to support rich, AI-powered readings and visual card generation. Each card includes detailed symbolism from the Pictorial Key to the Tarot by Arthur Edward Waite.

## Schema Enhancements

### Migration `003b_enhance_tarot_cards_schema.sql`

This migration adds the following columns to the `tarot_cards` table:

| Column | Type | Purpose |
| -------- | ------ | --------- |
| `upright_summary` | TEXT | Short 1-2 sentence meaning for quick reference |
| `reversed_summary` | TEXT | Short 1-2 sentence reversed meaning |
| `upright_meaning_long` | TEXT | Detailed 2-3 paragraph interpretation |
| `reversed_meaning_long` | TEXT | Detailed 2-3 paragraph reversed interpretation |
| `imagery_description` | TEXT | Visual description of card from Pictorial Key |
| `symbolism` | JSONB | Structured symbolic elements (see below) |

### Symbolism JSONB Structure

The `symbolism` column uses a structured JSON format:

```json
{
  "figures": ["figure 1", "figure 2"],
  "colors": ["color (meaning)", "color (meaning)"],
  "objects": ["object (significance)", "object (significance)"],
  "background": "description of setting",
  "symbols": ["symbol (meaning)", "symbol (meaning)"]
}
```

#### Example: The Fool

```json
{
  "figures": ["young traveler", "small white dog"],
  "colors": ["yellow (consciousness)", "white (purity)", "colorful motley"],
  "objects": ["bundle on stick (few possessions)", "white rose (innocence)", "precipice edge"],
  "background": "mountains in distance, bright sun overhead",
  "symbols": ["cliff edge (leap of faith)", "dog (instinct/protection)", "sun (enlightenment)"]
}
```

## Use Cases

### 1. Quick Card Display (Mobile App)

```sql
SELECT 
  name, 
  upright_summary, 
  reversed_summary, 
  keywords_upright, 
  keywords_reversed
FROM tarot_cards
WHERE id = $1;
```

### 2. Detailed Reading View

```sql
SELECT 
  name, 
  upright_meaning_long, 
  reversed_meaning_long,
  imagery_description,
  symbolism
FROM tarot_cards
WHERE id = $1;
```

### 3. AI Context for Readings

```typescript
const card = await fetchCard(cardId);
const aiPrompt = `
Interpret this tarot card for the user:
Card: ${card.name}
Orientation: ${orientation}
Meaning: ${orientation === 'upright' ? card.uprightMeaningLong : card.reversedMeaningLong}
Symbolism: ${JSON.stringify(card.symbolism)}
User's question: ${userQuestion}
`;
```

### 4. Visual Card Generation

Use `imagery_description` and `symbolism` to generate AI art:

```typescript
const generateCardImage = async (card: TarotCardRef) => {
  const prompt = `
${card.imageryDescription}

Key symbols to include:
${card.symbolism.symbols?.join(', ')}

Style: Rider-Waite tarot deck, mystical, detailed
  `.trim();
  
  return await generateImage(prompt);
};
```

### 5. Symbolism Search

Find cards with specific symbols:

```sql
-- Find cards with "sun" symbolism
SELECT name, symbolism
FROM tarot_cards
WHERE symbolism->'symbols' ? 'sun'
OR imagery_description ILIKE '%sun%';

-- Find cards with specific color meanings
SELECT name, symbolism->'colors' as colors
FROM tarot_cards
WHERE symbolism->'colors' @> '["red (passion)"]'::jsonb;
```

## Data Quality Standards

### Short Summaries

- **Length**: 1-2 sentences max
- **Purpose**: Quick reference, card list views, tooltips
- **Tone**: Direct, concise

### Long Meanings

- **Length**: 2-3 paragraphs
- **Structure**:
  1. What the card represents
  2. Life situations it applies to
  3. Advice or insight it offers
- **Tone**: Thoughtful, encouraging, nuanced

### Imagery Descriptions

- **Source**: Pictorial Key to the Tarot by A.E. Waite
- **Style**: Objective visual description
- **Include**: Figures, clothing, objects, setting, colors
- **Omit**: Interpretations (save for meanings)

### Symbolism JSON

- **Figures**: People/beings present
- **Colors**: Dominant colors with meanings in parentheses
- **Objects**: Physical items with significance
- **Background**: Setting description
- **Symbols**: Abstract symbols with meanings

## Seed Files

### Completed

- ✅ `seed_tarot_major_arcana.sql` — 6 Major Arcana cards (sample)

### To Complete

- ⏳ Remaining 16 Major Arcana (VI-XXI)
- ⏳ 56 Minor Arcana cards:
  - 14 Wands (Ace through King)
  - 14 Cups (Ace through King)
  - 14 Swords (Ace through King)
  - 14 Pentacles (Ace through King)

## Minor Arcana Structure

Minor Arcana will follow the same pattern with suit-specific symbolism:

### Wands (Fire)

- Element: Fire
- Keywords: action, passion, energy, creativity
- Numbers: Ace-10, Page, Knight, Queen, King

### Cups (Water)

- Element: Water
- Keywords: emotions, intuition, relationships, creativity
- Numbers: Ace-10, Page, Knight, Queen, King

### Swords (Air)

- Element: Air
- Keywords: intellect, conflict, communication, truth
- Numbers: Ace-10, Page, Knight, Queen, King

### Pentacles (Earth)

- Element: Earth
- Keywords: material, career, finances, body
- Numbers: Ace-10, Page, Knight, Queen, King

## Example Query: Full Reading Context

```sql
SELECT 
  tc.name,
  tc.arcana,
  tc.suit,
  tc.upright_summary,
  tc.upright_meaning_long,
  tc.keywords_upright,
  tc.imagery_description,
  tc.symbolism,
  tc.element,
  tc.astrology_association,
  -- Join with zodiac if applicable
  zs.name as zodiac_sign,
  zs.element as sign_element
FROM tarot_cards tc
LEFT JOIN zodiac_signs zs ON tc.astrology_association ILIKE '%' || zs.name || '%'
WHERE tc.id = $1;
```

## Benefits of This Structure

1. **Flexible Displays**: Short summaries for lists, long meanings for detail views
2. **AI Integration**: Rich context for generating personalized interpretations
3. **Visual Generation**: Detailed symbolism for AI art generation
4. **Search & Filter**: Query by symbols, colors, elements
5. **Educational**: Users can learn traditional symbolism
6. **Extensible**: JSONB allows adding new symbolic categories without schema changes

## Next Steps

1. Complete all 22 Major Arcana cards
2. Create Minor Arcana seed files (56 cards)
3. Add zodiac ↔ tarot associations
4. Create AI prompt templates for readings
5. Design card generation pipeline using symbolism data
