# Magic Mystics: Figma to Claude Code Integration Plan

This document outlines the end-to-end implementation plan for integrating the Magic Mystics Expo Go project with Figma via the Model Context Protocol (MCP) using Claude Code. The goal is to establish a two-way parity workflow where design tokens, component styles, and Storybook stories are seamlessly synchronized between Figma and the React Native codebase.

## 1. Authentication & Tooling Setup

To establish the connection between Claude Code and Figma, we will utilize the official Figma MCP server. Since the user has requested an update to their auth connection in Claude Code, the remote MCP server method is recommended as it provides the broadest set of features and is the standard for Claude Code integration [1].

### Step 1: Generate a Figma Personal Access Token (PAT)
1. Open Figma and navigate to **Settings > Security**.
2. Under the **Personal access tokens** section, click **Generate new token**.
3. Name the token (e.g., "Claude Code MCP") and copy the generated token string. Keep this secure, as it will be required for authentication.

### Step 2: Install and Authenticate the Figma MCP in Claude Code
1. Open your terminal and install the official Figma plugin for Claude Code:
   ```bash
   claude plugin install figma@claude-plugins-official
   ```
2. Restart Claude Code.
3. Open the plugin marketplace by typing `/plugin` and pressing **Enter**.
4. Navigate to the **Installed** tab, select the `figma` server, and initiate the authorization process.
5. This will open an external page where you will paste your Figma PAT (if prompted) or click **Allow access** to authenticate Claude Code with your Figma account [1].
6. Verify the connection by running `/plugin` again; the `figma` server should display as connected.

## 2. Design Token Architecture & Semantic Naming

Magic Mystics currently uses a structured token system (`colors.ts`, `spacing.ts`, `typography.ts`) but lacks strict semantic naming for component states. To ensure agents (like Claude) and developers easily understand the purpose of a token, we will adopt a Context-First or Object-Property-Modifier (OPM) naming convention with strict state suffixes [2].

### Semantic Naming Convention
Tokens will follow this structure:
`[component]-[property]-[variant]-[state]`

**Examples:**
- `button-background-primary-default`
- `button-background-primary-hover`
- `button-background-primary-active`
- `button-background-primary-disabled`
- `button-text-primary-disabled`

### Implementation in Code
We will update `src/theme/colors.ts` to export a semantic token dictionary alongside the base primitives.

```typescript
// Base Primitives (Tier 1)
export const primitives = {
  purple: { 500: '#8b5cf6', 300: '#c4b5fd' },
  gray: { 200: '#f3f4f6', 400: '#d1d5db' }
};

// Semantic/Component Tokens (Tier 2 & 3)
export const semanticColors = {
  button: {
    background: {
      primary: {
        default: primitives.purple[500],
        disabled: primitives.gray[200],
      }
    },
    text: {
      primary: {
        default: '#ffffff',
        disabled: primitives.gray[400],
      }
    }
  }
};
```

## 3. Scoped Component Styling

Magic Mystics is an Expo Go project utilizing `StyleSheet.create`. To align with the new semantic tokens and maintain two-way parity with Figma, styles will be scoped directly to the component level, leveraging the `useAppTheme` hook.

### Refactoring Strategy
1. **Extract Styles:** Move inline styles and generic `StyleSheet` definitions into a structured format that directly references the semantic tokens.
2. **Apply State Logic:** Use React Native's `Pressable` state (e.g., `pressed`, `disabled`) to dynamically apply the semantic `-active` and `-disabled` tokens.

**Example: Refactoring `Button.tsx`**
```tsx
import { Pressable, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';

export function Button({ title, disabled, variant = 'primary' }) {
  const theme = useAppTheme();
  
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled 
            ? theme.semanticColors.button.background[variant].disabled
            : pressed
              ? theme.semanticColors.button.background[variant].active
              : theme.semanticColors.button.background[variant].default
        }
      ]}
    >
      <Text style={{
        color: disabled 
          ? theme.semanticColors.button.text[variant].disabled 
          : theme.semanticColors.button.text[variant].default
      }}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  }
});
```

## 4. Figma Code Connect & Storybook Integration

To achieve true two-way parity, we will utilize **Figma Code Connect**. This tool bridges the codebase and Figma's Dev Mode, allowing the actual React Native component code (and Storybook stories) to surface directly within Figma when inspecting a design [3].

### Step 1: Install Code Connect
Run the following command in the root of the `magic-mystics` repository:
```bash
npm install --save-dev @figma/code-connect
```

### Step 2: Configure Code Connect for Components
For each component (e.g., `Button`), create a `Button.figma.tsx` file alongside the component. This file maps the Figma component properties to the React Native component props.

**Example: `src/components/ui/Button.figma.tsx`**
```tsx
import figma from '@figma/code-connect/react';
import { Button } from './Button';

figma.connect(Button, 'https://figma.com/design/.../node-id', {
  props: {
    title: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
    }),
  },
  example: ({ title, disabled, variant }) => (
    <Button title={title} disabled={disabled} variant={variant} />
  ),
});
```

### Step 3: Storybook Integration
Magic Mystics already has a React Native Storybook setup (`.rnstorybook`). We will ensure that every component has a comprehensive story that covers all semantic states (`default`, `active`, `disabled`).

1. Update `Button.stories.tsx` to explicitly showcase the `-disabled` and `-active` states using the new semantic tokens.
2. When designers update a token in Figma, Claude Code can be prompted to update the semantic token dictionary, which will automatically propagate to the Storybook stories.

## 5. The Claude Code Workflow (CLAUDE.md Updates)

To ensure Claude Code consistently follows these best practices, we will update the existing `CLAUDE.md` file in the repository.

### Additions to CLAUDE.md:
```markdown
### Figma & Design Tokens
- **Figma MCP:** Use the Figma MCP server to read design tokens and component layouts directly from Figma URLs.
- **Naming Convention:** Always use the Object-Property-Modifier format with strict state suffixes (e.g., `[component]-[property]-[variant]-[state]`). Valid states are `-default`, `-hover`, `-active`, `-disabled`.
- **Component Styling:** Scope styles to the component level using `StyleSheet.create` and the `useAppTheme` hook. Map `Pressable` states directly to semantic token states.
- **Code Connect:** When creating or updating a UI component, always create/update the corresponding `*.figma.tsx` file to maintain two-way parity with Figma Dev Mode.
- **Storybook:** Ensure all component variants and states are documented in `*.stories.tsx`.
```

## Summary of Execution Steps for the Session
1. User provides the Figma file URL.
2. Claude Code (via MCP) reads the Figma file to extract the partial design and token definitions.
3. Claude Code generates the updated `colors.ts` with the new semantic naming convention.
4. Claude Code refactors the target screen and its underlying UI components (e.g., Button, Card, Input) to use the scoped semantic styles.
5. Claude Code generates the `*.figma.tsx` files for Code Connect mapping.
6. Claude Code updates the Storybook stories to reflect the new component architecture.

---

### References
[1] Figma Help Center: Claude Code and Figma: Set up the MCP server. Available at: https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server
[2] Always Twisted: Design Token Naming Conventions: A Practical Guide. Available at: https://www.alwaystwisted.com/articles/design-token-naming-conventions.html
[3] Figma Developer Docs: Connecting React components. Available at: https://developers.figma.com/docs/code-connect/react/
