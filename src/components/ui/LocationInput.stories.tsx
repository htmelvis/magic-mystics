import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { LocationInput } from './LocationInput';
import type { LocationSuggestion } from '@lib/geocoding/geocode';
import { theme } from '@theme';

// ── Static suggestion fixtures ────────────────────────────────────────────────

const SUGGESTIONS: LocationSuggestion[] = [
  {
    displayName: 'Los Angeles, California, United States',
    shortName: 'Los Angeles, California, United States',
    lat: 34.0537,
    lng: -118.2428,
  },
  {
    displayName: 'Los Angeles, Texas, United States',
    shortName: 'Los Angeles, Texas, United States',
    lat: 27.48,
    lng: -98.08,
  },
  {
    displayName: 'Los Angeles, Chile',
    shortName: 'Los Angeles, Chile',
    lat: -37.4689,
    lng: -72.3538,
  },
];

/** Search override that returns static results immediately — no network call. */
const mockSearch = async (_query: string, _signal: AbortSignal): Promise<LocationSuggestion[]> =>
  SUGGESTIONS;

/** Search override that never resolves, keeping the spinner visible. */
const slowSearch = (_query: string, _signal: AbortSignal): Promise<LocationSuggestion[]> =>
  new Promise(() => {});

// ── Stateful wrapper (args-driven) ────────────────────────────────────────────

type FixtureProps = {
  initialValue?: string;
  label?: string;
  error?: string;
  hint?: string;
  onSearch?: typeof mockSearch;
  onChangeValue?: (v: string) => void;
};

function LocationInputFixture({ initialValue = '', onChangeValue, ...rest }: FixtureProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (v: string) => {
    setValue(v);
    onChangeValue?.(v);
  };

  return <LocationInput value={value} onChangeValue={handleChange} {...rest} />;
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'UI/LocationInput',
  component: LocationInputFixture,
  decorators: [
    (Story: React.ComponentType) => (
      <View
        style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.surface.background,
          flex: 1,
        }}
      >
        <Story />
      </View>
    ),
  ],
  args: {
    label: 'Birth Location',
    onChangeValue: fn(),
  },
} satisfies Meta<typeof LocationInputFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Empty — default state before the user starts typing. */
export const Default: Story = {};

/** Pre-filled with a confirmed selection — no dropdown, no spinner. */
export const WithValue: Story = {
  args: { initialValue: 'New York, New York, United States' },
};

/** Validation error shown below the input. */
export const WithError: Story = {
  args: { error: 'Please enter your birth location' },
};

/** Hint text shown below the input. */
export const WithHint: Story = {
  args: {
    hint: 'This helps us calculate your rising sign more accurately',
  },
};

/**
 * Spinner visible inside the input — type any 2+ characters to trigger.
 * Uses a never-resolving search to keep the loading state frozen.
 */
export const Searching: Story = {
  args: {
    initialValue: 'Los',
    onSearch: slowSearch,
  },
};

/**
 * Dropdown populated with suggestions — uses a static mock that bypasses the
 * live Nominatim API so the story is deterministic.
 */
export const WithSuggestions: Story = {
  args: {
    initialValue: 'Los Angeles',
    onSearch: mockSearch,
  },
};

/** Error state alongside a pre-filled value. */
export const WithValueAndError: Story = {
  args: {
    initialValue: 'L',
    error: 'Location must be at least 2 characters',
  },
};
