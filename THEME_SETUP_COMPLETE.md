# Theme System Setup Complete ✅

A centralized theme system has been created for Magic Mystics. This replaces hardcoded
design values with a consistent, maintainable design token system.

## What Was Created

### 📁 New Files

```
src/theme/
├── index.ts              # Main theme export (use this!)
├── colors.ts             # Color palette
├── spacing.ts            # Spacing, border radius, layout
├── typography.ts         # Font sizes, weights, text styles
├── shadows.ts            # Shadow definitions
├── animations.ts         # Animation durations and configs
├── README.md             # Complete documentation
└── MIGRATION_EXAMPLE.tsx # Side-by-side comparison example
```

### ⚙️ Configuration Updates

- **tsconfig.json**: Added `@theme` path alias for easy imports

## Quick Usage

```typescript
import { theme } from '@theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface.background,
    padding: theme.spacing.screenPadding,
  },
  title: {
    ...theme.textStyles.h1,
    color: theme.colors.text.primary,
  },
  button: {
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.borderRadius.button,
    ...theme.shadows.button,
  },
});
```

## Key Features

### 🎨 Colors

- **Brand colors**: `theme.colors.brand.primary`, `theme.colors.brand.accent`
- **Semantic colors**: `theme.colors.success`, `theme.colors.error`, etc.
- **Gray scale**: `theme.colors.gray[50]` through `theme.colors.gray[950]`
- **Cosmic colors**: `theme.colors.cosmic.deepSpace`, `theme.colors.cosmic.moonlight`
- **Tarot-specific**: `theme.colors.suits.*`, `theme.colors.orientation.*`

### 📏 Spacing

- **Scale**: `xs` (8px), `md` (16px), `xl` (24px), etc.
- **Named tokens**: `screenPadding`, `cardPadding`, `sectionGap`

### ✍️ Typography

- **Text styles**: `h1`, `h2`, `body`, `caption`, `button`, etc.
- **Font sizes**: `xs` (11), `md` (15), `xl` (22), etc.
- **Weights**: `regular`, `medium`, `semibold`, `bold`

### 🌑 Shadows

- **Sizes**: `sm`, `md`, `lg`, `xl`, `xxl`
- **Component-specific**: `card`, `button`, `modal`, `tarotCard`

### ⏱️ Animations

- **Durations**: `fast` (200ms), `normal` (300ms), `slow` (500ms)
- **Spring configs**: `gentle`, `snappy`, `bouncy`
- **Tarot-specific**: `cardFlip`, `cardShuffle`, `cardDraw`

## Benefits

✅ **Centralized design** - Update colors/spacing in one place  
✅ **Semantic naming** - `brand.primary` instead of `#8b5cf6`  
✅ **Type safety** - Full autocomplete for all theme tokens  
✅ **Consistency** - Reuse text styles, shadows, spacing  
✅ **Easy updates** - Change the theme, not individual files  
✅ **Better maintenance** - Clear intent with descriptive names

## Next Steps

### 1. Review the Documentation

Read `src/theme/README.md` for complete usage guide and examples.

### 2. Study the Migration Example

Check `src/theme/MIGRATION_EXAMPLE.tsx` to see before/after comparison of the
sign-in screen using the theme system.

### 3. Start Migrating Screens

**Suggested order:**

1. Start with simple screens (auth screens, onboarding)
2. Move to tab screens (home, history, profile)
3. Migrate components (TarotCard, etc.)
4. Update complex screens with multiple styles

**Migration pattern:**

```typescript
// 1. Import theme
import { theme } from '@theme';

// 2. Replace hardcoded values
// Before: backgroundColor: '#fafafa'
// After:  backgroundColor: theme.colors.surface.background

// Before: padding: 20
// After:  padding: theme.spacing.screenPadding

// Before: fontSize: 28, fontWeight: 'bold', color: '#1f2937'
// After:  ...theme.textStyles.h1, color: theme.colors.text.primary
```

### 4. Create Reusable Components

Once screens are migrated, extract common patterns into reusable components:

- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Input.tsx`

### 5. Customize the Theme

The current theme uses your existing placeholder colors. To update:

1. Edit `src/theme/colors.ts` to adjust the color palette
2. Modify `src/theme/spacing.ts` for spacing/layout changes
3. Update `src/theme/typography.ts` to tweak text styles
4. All components using the theme will update automatically!

## Example: Changing Brand Colors

Want to update the primary purple? Just edit one line:

```typescript
// src/theme/colors.ts
brand: {
  primary: '#9333ea', // ← Change this
  // Everything using theme.colors.brand.primary updates automatically!
}
```

## TypeScript Support

All theme tokens are fully typed for excellent autocomplete:

```typescript
// ✅ TypeScript knows all available colors
theme.colors.brand.primary;
theme.colors.cosmic.deepSpace;

// ✅ Autocomplete for spacing values
theme.spacing.md;
theme.spacing.screenPadding;

// ✅ Full IntelliSense for text styles
theme.textStyles.h1;
theme.textStyles.body;
```

## Questions?

Refer to:

- **Usage guide**: `src/theme/README.md`
- **Migration example**: `src/theme/MIGRATION_EXAMPLE.tsx`
- **Individual files**: Well-commented with JSDoc

---

**Theme system ready to use!** Start migrating screens whenever you're ready. 🎨✨
