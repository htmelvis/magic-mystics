# GluestackUI Integration Guide

GluestackUI has been integrated into Magic Mystics for consistent, accessible UI components.

## What Was Added

### 📦 Packages Installed

- `@gluestack-ui/themed` - Main UI component library
- `@gluestack-style/react` - Styling system
- `react-native-svg` - Required for icons
- `@expo/vector-icons` - Icon library (Material Community Icons)

### ⚙️ Configuration

- **gluestack-ui.config.ts** - Custom config integrating our theme colors
- **app/_layout.tsx** - Wrapped with `<GluestackUIProvider>`
- **app/(tabs)/_layout.tsx** - Tab bar with icons using our theme

## Tab Bar Icons ✅

Tab bar now includes beautiful icons:

- 🏠 **Home** - `home` icon
- 📖 **History** - `book-open-page-variant` icon
- 👤 **Profile** - `account` icon

All icons use theme colors:

- Active: `theme.colors.brand.primary` (violet)
- Inactive: `theme.colors.text.muted` (gray)

## Using GluestackUI Components

### Import Components

```typescript
import {
  Button,
  ButtonText,
  Input,
  InputField,
  Box,
  Text,
  VStack,
  HStack,
  Card,
  Heading,
} from '@gluestack-ui/themed';
```

### Basic Examples

#### Button

```typescript
<Button
  size="md"
  variant="solid"
  action="primary"
  onPress={() => console.warn('Button pressed')}
>
  <ButtonText>Click Me</ButtonText>
</Button>
```

#### Input

```typescript
<Input variant="outline" size="md">
  <InputField placeholder="Enter your email" />
</Input>
```

#### Card

```typescript
<Card p="$5" borderRadius="$lg" m="$3">
  <Heading mb="$1">Card Title</Heading>
  <Text>Card content goes here</Text>
</Card>
```

#### Layout

```typescript
<VStack space="md" p="$4">
  <Text>First item</Text>
  <Text>Second item</Text>
</VStack>

<HStack space="sm" alignItems="center">
  <Text>Left</Text>
  <Text>Right</Text>
</HStack>
```

### Using with Our Theme

GluestackUI components automatically use our custom theme colors:

```typescript
// These will use theme.colors.brand.primary
<Button action="primary">
  <ButtonText>Primary Button</ButtonText>
</Button>

// These will use theme.colors.error.main
<Button action="negative">
  <ButtonText>Delete</ButtonText>
</Button>

// These will use theme.colors.success.main
<Button action="positive">
  <ButtonText>Confirm</ButtonText>
</Button>
```

## Component Props System

GluestackUI uses a special prop system with `$` prefix for styled props:

```typescript
<Box
  bg="$primary500" // Background color
  p="$4" // Padding
  m="$2" // Margin
  borderRadius="$lg" // Border radius
  width="$full" // Width
>
  <Text color="$white">Content</Text>
</Box>
```

### Common Styled Props

**Spacing:**

- `p="$4"` - Padding
- `m="$2"` - Margin
- `px="$3"` - Horizontal padding
- `py="$2"` - Vertical padding

**Sizing:**

- `w="$full"` - Width 100%
- `h="$64"` - Fixed height
- `minW="$20"` - Min width

**Colors:**

- `bg="$primary500"` - Background
- `color="$textDark900"` - Text color
- `borderColor="$borderLight300"` - Border color

**Layout:**

- `flex={1}` - Flex
- `alignItems="center"` - Align items
- `justifyContent="space-between"` - Justify content

## Migration Strategy

You can mix GluestackUI components with your existing StyleSheet-based components:

```typescript
import { Button, ButtonText } from '@gluestack-ui/themed';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '@theme';

export default function MixedScreen() {
  return (
    <View style={styles.container}>
      {/* Existing StyleSheet approach */}
      <Text style={styles.title}>My Screen</Text>

      {/* New GluestackUI component */}
      <Button action="primary">
        <ButtonText>New Button</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.screenPadding,
  },
  title: {
    ...theme.textStyles.h1,
    color: theme.colors.text.primary,
  },
});
```

## Recommended Components to Use

### High Priority (Replace common patterns)

1. **Button** - Replace all `<Pressable>` buttons
2. **Input** - Replace `<TextInput>`
3. **Card** - For container cards
4. **Badge** - For pills/badges
5. **Spinner** - Replace `<ActivityIndicator>`

### Medium Priority

6. **Alert** - For error/success messages
7. **Toast** - For notifications
8. **Modal** - For dialogs
9. **Switch** - For toggles
10. **Select** - For dropdowns

### Layout Helpers

11. **VStack** - Vertical stack
12. **HStack** - Horizontal stack
13. **Box** - Generic container
14. **Center** - Center content

## Icon Options

You have access to **Material Community Icons** via `@expo/vector-icons`:

```typescript
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@theme';

// In your component
<MaterialCommunityIcons name="home" size={24} color={theme.colors.brand.primary} />
```

### Recommended Icons for Tarot App

- **Tarot/Mystical:**
  - `crystal-ball` - For readings
  - `star` - For favorites
  - `auto-fix` - For magic/mystical
  - `cards` - For deck
  - `zodiac-gemini` (and other zodiac signs)
- **Navigation:**
  - `home` - Home
  - `book-open-page-variant` - History
  - `account` - Profile
  - `cog` - Settings
- **Actions:**
  - `plus` - Add
  - `close` - Close
  - `check` - Confirm
  - `arrow-left` - Back

Browse all icons: https://icons.expo.fyi/Index

## Custom Components with GluestackUI

You can build custom components using GluestackUI primitives:

```typescript
// src/components/ui/ThemedButton.tsx
import { ComponentProps } from 'react';
import { Button, ButtonText } from '@gluestack-ui/themed';

type ThemedButtonProps = {
  title: string;
  variant?: 'primary' | 'secondary';
} & Omit<ComponentProps<typeof Button>, 'children'>;

export function ThemedButton({
  title,
  variant = 'primary',
  ...props
}: ThemedButtonProps) {
  return (
    <Button
      action={variant === 'primary' ? 'primary' : 'secondary'}
      size="lg"
      {...props}
    >
      <ButtonText>{title}</ButtonText>
    </Button>
  );
}
```

## Best Practices

1. **Use GluestackUI for new components** - Faster development, built-in accessibility
2. **Mix with StyleSheet as needed** - No need to rewrite everything at once
3. **Leverage theme integration** - Components automatically use your colors
4. **Use semantic action props** - `action="primary"` instead of
   `bg="$primary500"`
5. **Keep custom styling in theme** - Update `gluestack-ui.config.ts` for
   global changes

## Documentation

- **Components:** https://ui.gluestack.io/docs/components
- **Styling:** https://ui.gluestack.io/docs/styling
- **Icons:** https://icons.expo.fyi/Index

## Next Steps

1. ✅ Tab bar icons added
2. ✅ GluestackUI configured with theme
3. Try creating a Button component using GluestackUI
4. Gradually migrate existing buttons/inputs to GluestackUI
5. Build new screens with GluestackUI components

---

**Ready to use!** Start building with GluestackUI components. 🎨✨
