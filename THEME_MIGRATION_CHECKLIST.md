# Theme Migration Checklist

Track your progress migrating screens and components to use the centralized theme system.

## 📋 Screens

### Authentication (`app/(auth)/`)

- [ ] `sign-in.tsx` - Sign in screen
- [ ] `sign-up.tsx` - Sign up screen

### Onboarding (`app/(onboarding)/`)

- [ ] `welcome.tsx` - Welcome screen
- [ ] `name.tsx` - Name input
- [ ] `birth-date.tsx` - Birth date picker
- [ ] `birth-time.tsx` - Birth time picker
- [ ] `birth-location.tsx` - Location input
- [ ] `calculating.tsx` - Loading/calculation screen

### Main Tabs (`app/(tabs)/`)

- [ ] `home.tsx` - Home screen (includes CosmicWeatherCard)
- [ ] `history.tsx` - Reading history (includes ReadingDrawer, ReadingListItem)
- [ ] `profile.tsx` - User profile

### Other Screens

- [ ] `draw.tsx` - Card drawing screen
- [ ] `app/_layout.tsx` - Root layout
- [ ] `app/(tabs)/_layout.tsx` - Tab layout

## 🧩 Components

### Tarot Components (`src/components/tarot/`)

- [ ] `TarotCard.tsx` - Individual card component
- [ ] `TarotDeck.tsx` - Deck component
- [ ] Update `card-constants.ts` to use theme colors

### UI Components (to be created)

- [ ] `src/components/ui/Button.tsx` - Reusable button component
- [ ] `src/components/ui/Card.tsx` - Card container component
- [ ] `src/components/ui/Badge.tsx` - Badge component
- [ ] `src/components/ui/Input.tsx` - Text input component
- [ ] `src/components/ui/LoadingState.tsx` - Skeleton loaders

## 📝 Migration Pattern

For each file, follow this pattern:

1. **Import theme**

   ```typescript
   import { theme } from '@theme';
   ```

2. **Replace colors**

   - `'#8b5cf6'` → `theme.colors.brand.primary`
   - `'#fafafa'` → `theme.colors.surface.background`
   - `'#666'` → `theme.colors.text.secondary`

3. **Replace spacing**

   - `padding: 20` → `padding: theme.spacing.screenPadding`
   - `marginBottom: 16` → `marginBottom: theme.spacing.md`
   - `gap: 12` → `gap: theme.spacing.itemGap`

4. **Use text styles**

   - `fontSize: 28, fontWeight: 'bold'` → `...theme.textStyles.h1`
   - `fontSize: 16, color: '#666'` → `...theme.textStyles.body, color:
theme.colors.text.secondary`

5. **Apply shadows**

   - Individual shadow props → `...theme.shadows.card`
   - Button shadows → `...theme.shadows.button`

6. **Test the screen**
   - Verify appearance matches the original
   - Check that all colors/spacing are from theme
   - Ensure no hardcoded values remain

## ✅ Completion Criteria

A screen/component is fully migrated when:

- [ ] All color values use `theme.colors.*`
- [ ] All spacing values use `theme.spacing.*` or `theme.borderRadius.*`
- [ ] Text styles leverage `theme.textStyles.*` where applicable
- [ ] Shadows use `theme.shadows.*`
- [ ] Animation durations use `theme.durations.*` (if applicable)
- [ ] No magic numbers or hardcoded hex colors remain
- [ ] Visual appearance matches the original design

## 🎯 Priority Order

### High Priority (Core User Flows)

1. Authentication screens (sign-in, sign-up)
2. Home screen
3. Draw screen (main feature)
4. Tab layout (for consistent navigation)

### Medium Priority

5. Onboarding flow
6. History screen
7. Profile screen

### Low Priority (Polish)

8. Tarot card components (already have custom styling)
9. Layout components
10. Create new UI components

## 📊 Progress Tracking

**Screens:** 0 / 14 migrated (0%)  
**Components:** 0 / 7 migrated (0%)

**Overall:** 0 / 21 migrated (0%)

---

Update this checklist as you migrate each file. Check off items when complete!
