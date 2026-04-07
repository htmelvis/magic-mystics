# Magic Mystics Theme System

Centralized design tokens for consistent UI across the app.

## Quick Start

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
  card: {
    borderRadius: theme.borderRadius.card,
    ...theme.shadows.card,
  },
});
```

## Available Theme Tokens

### Colors

**Brand Colors:**

- `theme.colors.brand.primary` - Main violet (#8b5cf6)
- `theme.colors.brand.accent` - Gold accent (#c9a84c)

**Semantic Colors:**

- `theme.colors.success.main`
- `theme.colors.warning.main`
- `theme.colors.error.main`
- `theme.colors.info.main`

**Grays:**

- `theme.colors.gray[50]` through `theme.colors.gray[950]`

**Cosmic Colors (Tarot-specific):**

- `theme.colors.cosmic.deepSpace` - Deep purple background
- `theme.colors.cosmic.moonlight` - Lighter purple
- `theme.colors.cosmic.sunGold` - Golden accent

**Special Colors:**

- `theme.colors.suits.*` - Tarot suit colors
- `theme.colors.orientation.*` - Upright/reversed colors
- `theme.colors.subscription.*` - Free/premium tier colors

### Spacing

```typescript
theme.spacing.xs; // 8px
theme.spacing.md; // 16px
theme.spacing.xl; // 24px
theme.spacing.screenPadding; // 20px
theme.spacing.cardPadding; // 16px
```

### Typography

**Text Styles:**

```typescript
<Text style={theme.textStyles.h1}>Heading 1</Text>
<Text style={theme.textStyles.body}>Body text</Text>
<Text style={theme.textStyles.caption}>Caption text</Text>
```

**Font Sizes:**

```typescript
theme.fontSizes.xs; // 11
theme.fontSizes.md; // 15
theme.fontSizes.xl; // 22
```

### Shadows

```typescript
const styles = StyleSheet.create({
  card: {
    ...theme.shadows.card,
  },
  button: {
    ...theme.shadows.button,
  },
  tarotCard: {
    ...theme.shadows.tarotCard,
  },
});
```

### Animations

```typescript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: theme.durations.normal, // 300ms
  useNativeDriver: true,
}).start();

Animated.spring(slideAnim, {
  toValue: 0,
  ...theme.springs.gentle,
  useNativeDriver: true,
}).start();
```

### Border Radius

```typescript
theme.borderRadius.sm; // 6
theme.borderRadius.card; // 16
theme.borderRadius.full; // 9999
```

## Migration Guide

### Before (hardcoded values):

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
```

### After (using theme):

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

## Custom Components Example

### Themed Button Component:

```typescript
import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '@theme';

type ButtonProps = {
  title: string;
  variant?: 'primary' | 'secondary';
  onPress: () => void;
};

export function Button({ title, variant = 'primary', onPress }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={[styles.button, isPrimary ? styles.buttonPrimary : styles.buttonSecondary]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, isPrimary ? styles.textPrimary : styles.textSecondary]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.button,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.brand.primary,
    ...theme.shadows.button,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surface.card,
    borderWidth: 2,
    borderColor: theme.colors.border.main,
  },
  buttonText: {
    ...theme.textStyles.button,
  },
  textPrimary: {
    color: theme.colors.text.inverse,
  },
  textSecondary: {
    color: theme.colors.text.primary,
  },
});
```

## Updating the Theme

To update colors or spacing across the entire app:

1. Edit the appropriate file in `src/theme/`
2. Changes will automatically apply everywhere the theme is used
3. No need to update individual component files

### Example: Changing the primary brand color

**Before:** `theme.colors.brand.primary = '#8b5cf6'`
**After:** Edit `src/theme/colors.ts`:

```typescript
brand: {
  primary: '#9333ea', // New purple shade
  // ...
}
```

All buttons, links, and UI elements using `theme.colors.brand.primary` will
update automatically.

## Best Practices

1. **Always use theme tokens** instead of hardcoded values
2. **Use semantic colors** (`text.primary`) over specific colors (`gray[900]`)
3. **Leverage text styles** for consistent typography
4. **Spread shadow objects** instead of defining shadow properties individually
5. **Use spacing scale** for all padding/margin values

## File Structure

```
src/theme/
├── index.ts        # Main export, combine all tokens
├── colors.ts       # Color palette
├── spacing.ts      # Spacing scale and layout
├── typography.ts   # Font sizes, weights, text styles
├── shadows.ts      # Shadow definitions
├── animations.ts   # Animation durations and configs
└── README.md       # This file
```
