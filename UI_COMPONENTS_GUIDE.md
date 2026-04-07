# UI Components Guide

Reusable, themeable UI components extracted from common patterns in your app.

## Components Created

### ✅ Core Components

1. **Button** - Themeable buttons with variants and states
2. **Card** - Container cards with elevation/outline variants
3. **Badge** - Pills and badges for labels
4. **Input** - Text inputs with labels, errors, and icons
5. **Screen** - Screen wrapper with safe area and scroll support
6. **LoadingState** - Skeleton loaders with animation

## Import

```typescript
// Import all components
import { Button, Card, Badge, Input, Screen } from '@components/ui';

// Or import individually
import { Button } from '@components/ui/Button';
```

---

## 1. Button Component

Versatile button with multiple variants, sizes, and states.

### Basic Usage

```typescript
import { Button } from '@components/ui';

<Button 
  title="Sign In" 
  onPress={handleSignIn}
/>
```

### Variants

```typescript
// Primary (default) - Solid violet background
<Button title="Primary" onPress={handlePress} variant="primary" />

// Secondary - White background with border
<Button title="Secondary" onPress={handlePress} variant="secondary" />

// Outline - Transparent with violet border
<Button title="Outline" onPress={handlePress} variant="outline" />

// Ghost - Transparent, no border
<Button title="Ghost" onPress={handlePress} variant="ghost" />

// Destructive - Red for dangerous actions
<Button title="Delete" onPress={handleDelete} variant="destructive" />
```

### Sizes

```typescript
<Button title="Small" size="sm" onPress={handlePress} />
<Button title="Medium" size="md" onPress={handlePress} />
<Button title="Large" size="lg" onPress={handlePress} />
```

### States & Features

```typescript
// Disabled
<Button title="Disabled" disabled onPress={handlePress} />

// Loading
<Button title="Saving..." loading onPress={handleSave} />

// Full width
<Button title="Continue" fullWidth onPress={handleContinue} />

// With icon
<Button 
  title="Share" 
  icon={<MaterialCommunityIcons name="share" size={20} color="white" />}
  iconPosition="left"
  onPress={handleShare}
/>
```

### Props

| Prop           | Type                                                    | Default     |
| -------------- | ------------------------------------------------------- | ----------- |
| `title`        | `string`                                                | required    |
| `onPress`      | `() => void`                                            | required    |
| `variant`      | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \|
'destructive'` | `'primary'` |
| `size`         | `'sm' \| 'md' \| 'lg'`                                  | `'md'`      |
| `disabled`     | `boolean`                                               | `false`     |
| `loading`      | `boolean`                                               | `false`     |
| `fullWidth`    | `boolean`                                               | `false`     |
| `icon`         | `React.ReactNode`                                       | `undefined` |
| `iconPosition` | `'left' \| 'right'`                                     | `'left'`    |

---

## 2. Card Component

Container component for content grouping with variants.

### Basic Usage

```typescript
import { Card } from '@components/ui';

<Card>
  <Text>Card content</Text>
</Card>
```

### Variants

```typescript
// Elevated (default) - Shadow for depth
<Card variant="elevated">
  <Text>Elevated card</Text>
</Card>

// Outlined - Border, no shadow
<Card variant="outlined">
  <Text>Outlined card</Text>
</Card>

// Filled - Light gray background
<Card variant="filled">
  <Text>Filled card</Text>
</Card>
```

### Interactive Card

```typescript
// Pressable card
<Card onPress={() => console.warn('Card pressed')}>
  <Text>Tap me!</Text>
</Card>
```

### Custom Padding

```typescript
// Use theme spacing keys
<Card padding="xl">
  <Text>More padding</Text>
</Card>

<Card padding="md">
  <Text>Less padding</Text>
</Card>
```

### Props

| Prop      | Type                                       | Default          |
| --------- | ------------------------------------------ | ---------------- |
| `variant` | `'elevated' \| 'outlined' \| 'filled'`     | `'elevated'`     |
| `onPress` | `() => void`                               | `undefined`      |
| `padding` | `keyof typeof theme.spacing`               | `'cardPadding'`  |
| `style`   | `ViewStyle`                                | `undefined`      |

---

## 3. Badge Component

Small labeled components for status, categories, etc.

### Basic Usage

```typescript
import { Badge } from '@components/ui';

<Badge label="New" />
```

### Variants

```typescript
// Default - Gray
<Badge label="Default" variant="default" />

// Primary - Violet
<Badge label="Premium" variant="primary" />

// Success - Green
<Badge label="Active" variant="success" />

// Warning - Yellow
<Badge label="Pending" variant="warning" />

// Error - Red
<Badge label="Failed" variant="error" />

// Outline - Border only
<Badge label="Outlined" variant="outline" />
```

### Sizes

```typescript
<Badge label="Small" size="sm" />
<Badge label="Medium" size="md" />
<Badge label="Large" size="lg" />
```

### Props

| Prop      | Type                                                                   |
Default      |
| --------- |
------------------------------------------------------------------------| ------------ |
| `label`   | `string`                                                               |
required     |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \|
'outline'` | `'default'`  |
| `size`    | `'sm' \| 'md' \| 'lg'`                                                 |
`'md'`       |

---

## 4. Input Component

Text input with label, error, hint, and icon support.

### Basic Usage

```typescript
import { Input } from '@components/ui';

<Input 
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>
```

### With Label

```typescript
<Input 
  label="Email Address"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
/>
```

### With Error

```typescript
<Input 
  label="Password"
  placeholder="Enter password"
  value={password}
  onChangeText={setPassword}
  error={passwordError}
  secureTextEntry
/>
```

### With Hint

```typescript
<Input 
  label="Username"
  placeholder="Choose a username"
  hint="At least 3 characters"
  value={username}
  onChangeText={setUsername}
/>
```

### With Icons

```typescript
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@theme';

<Input 
  placeholder="Search..."
  value={search}
  onChangeText={setSearch}
  leftIcon={
    <MaterialCommunityIcons 
      name="magnify" 
      size={20} 
      color={theme.colors.text.muted} 
    />
  }
/>
```

### Props

Extends all `TextInputProps` from React Native, plus:

| Prop        | Type              | Default     |
| ----------- | ----------------- | ----------- |
| `label`     | `string`          | `undefined` |
| `error`     | `string`          | `undefined` |
| `hint`      | `string`          | `undefined` |
| `leftIcon`  | `React.ReactNode` | `undefined` |
| `rightIcon` | `React.ReactNode` | `undefined` |

---

## 5. Screen Component

Screen wrapper with safe area, scroll, and padding.

### Basic Usage

```typescript
import { Screen } from '@components/ui';

<Screen>
  <Text>Screen content</Text>
</Screen>
```

### Non-scrolling Screen

```typescript
<Screen scroll={false}>
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Text>Fixed layout</Text>
  </View>
</Screen>
```

### Without Padding

```typescript
<Screen padding={false}>
  <Image source={hero} style={{ width: '100%' }} />
  <View style={{ padding: 20 }}>
    <Text>Content with custom padding</Text>
  </View>
</Screen>
```

### Custom Safe Area Edges

```typescript
// Default: bottom only
<Screen edges={['top', 'bottom']}>
  <Text>Safe on top and bottom</Text>
</Screen>
```

### Props

Extends all `ScrollViewProps`, plus:

| Prop      | Type                                        | Default      |
| --------- | ------------------------------------------- | ------------ |
| `scroll`  | `boolean`                                   | `true`       |
| `padding` | `boolean`                                   | `true`       |
| `edges`   | `('top' \| 'bottom' \| 'left' \| 'right')[]` | `['bottom']` |

---

## 6. LoadingState Components

Animated skeleton loaders for loading states.

### Basic Skeleton

```typescript
import { LoadingState } from '@components/ui';

<LoadingState variant="text" width="80%" />
<LoadingState variant="card" />
<LoadingState variant="avatar" width={48} height={48} />
```

### Skeleton Text (Multiple Lines)

```typescript
import { SkeletonText } from '@components/ui';

<SkeletonText lines={3} />
```

### Skeleton Card

```typescript
import { SkeletonCard } from '@components/ui';

<SkeletonCard />
```

### Skeleton Profile

```typescript
import { SkeletonProfile } from '@components/ui';

<SkeletonProfile />
```

### Custom Loading State

```typescript
<LoadingState 
  variant="custom"
  width={200}
  height={100}
  style={{ borderRadius: 8 }}
/>
```

---

## Usage Examples

### Sign In Form

```typescript
import { Screen, Input, Button } from '@components/ui';

export function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Screen>
      <Input 
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input 
        label="Password"
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button 
        title="Sign In"
        onPress={handleSignIn}
        loading={loading}
        fullWidth
      />
    </Screen>
  );
}
```

### Card List with Loading

```typescript
import { Screen, Card, Badge, SkeletonCard } from '@components/ui';

export function ListScreen() {
  const { data, isLoading } = useData();

  return (
    <Screen>
      {isLoading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        data.map(item => (
          <Card key={item.id} onPress={() => handlePress(item)}>
            <Text>{item.title}</Text>
            <Badge label={item.status} variant="primary" />
          </Card>
        ))
      )}
    </Screen>
  );
}
```

---

## Benefits

✅ **Consistent UI** - Same look and feel across the app  
✅ **Theme integration** - Automatically uses your theme  
✅ **Type safe** - Full TypeScript support  
✅ **Reusable** - Write once, use everywhere  
✅ **Maintainable** - Update in one place  
✅ **Accessible** - Built with best practices

## Next Steps

1. Start using these components in new screens
2. Gradually replace existing UI patterns
3. Create additional components as needed
4. Update theme to customize all components at once

---

**All components ready to use!** Import from `@components/ui` and start building. 🎨
