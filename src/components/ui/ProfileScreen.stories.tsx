/**
 * Profile screen stories.
 *
 * The profile screen is hook-heavy (Supabase, React Query, router) so stories
 * use the same underlying UI components with static data rather than rendering
 * the live screen. This keeps stories fast, deterministic, and focused on the
 * visual states that matter.
 *
 * Key states covered:
 *   - Loading skeleton
 *   - Post-onboarding: signs present, geocoding pending (shows CTA button)
 *   - Geocoding in progress (spinner on button)
 *   - Fully geocoded (no CTA, timezone shown)
 *   - Premium user
 *   - Birth details locked (edited once already)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Badge, Button, ZodiacAvatar, SkeletonProfile } from '@components/ui';
import { theme } from '@theme';

// ── Shared fixtures ───────────────────────────────────────────────────────────

const USER = { name: 'Edward', email: 'ed@htmelvis.com' };

const BIRTH = {
  date: 'April 11, 1990',
  time: '9:30 AM',
  location: 'New York, NY',
  timezone: 'America/New_York',
};

const SIGNS = { sun: 'Aries', moon: 'Scorpio', rising: 'Capricorn' } as const;

// ── Sub-sections — mirror the card structure in profile.tsx ──────────────────

function ProfileHeader({
  name,
  email,
  sunSign,
}: {
  name: string;
  email: string;
  sunSign?: string;
}) {
  return (
    <View style={s.profileHeader}>
      {sunSign && <ZodiacAvatar sign={sunSign as never} size={56} />}
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{name}</Text>
        <Text style={s.email}>{email}</Text>
      </View>
    </View>
  );
}

function BirthDetailsCard({
  date,
  time,
  location,
  timezone,
  sunSign,
  moonSign,
  risingSign,
  canEdit,
  geocodeState,
  onGeocode,
  locked,
}: {
  date?: string;
  time?: string;
  location?: string;
  timezone?: string;
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
  canEdit?: boolean;
  geocodeState?: 'idle' | 'loading' | 'cooldown';
  onGeocode?: () => void;
  locked?: boolean;
}) {
  const showGeocodeButton = !!location && !timezone;
  const signs = [
    sunSign && { label: `☉ ${sunSign}` },
    moonSign && { label: `☽ ${moonSign}` },
    risingSign && { label: `↑ ${risingSign}` },
  ].filter(Boolean) as { label: string }[];

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Birth Details</Text>
        {canEdit && !locked && <Text style={[s.editLink]}>Edit</Text>}
      </View>
      <Card variant="outlined">
        <Text style={s.detailText}>Date: {date ?? '—'}</Text>
        <Text style={s.detailText}>
          Time: {time ?? '—'}
          {timezone ? <Text style={s.detailMuted}> ({timezone})</Text> : null}
        </Text>
        <Text style={s.detailText}>Location: {location ?? '—'}</Text>

        {signs.length > 0 && (
          <View style={s.signsRow}>
            {signs.map(({ label }) => (
              <View key={label} style={s.signChip}>
                <Text style={s.signChipText}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        {showGeocodeButton && (
          <Pressable
            style={[
              s.geocodeButton,
              {
                backgroundColor:
                  geocodeState === 'loading' || geocodeState === 'cooldown'
                    ? theme.colors.gray[300]
                    : theme.colors.brand.primary,
              },
            ]}
            onPress={onGeocode}
            disabled={geocodeState === 'loading' || geocodeState === 'cooldown'}
          >
            {geocodeState === 'loading' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={s.geocodeButtonText}>
                {geocodeState === 'cooldown' ? 'Resolving…' : 'Complete Location & Chart'}
              </Text>
            )}
          </Pressable>
        )}
      </Card>
      {locked && (
        <Text style={s.lockedNote}>
          Birth details have already been edited once and cannot be changed again.
        </Text>
      )}
    </View>
  );
}

function SubscriptionCard({
  isPremium,
  expiry,
  onUpgrade,
}: {
  isPremium: boolean;
  expiry?: string;
  onUpgrade?: () => void;
}) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Subscription</Text>
      <Card variant="filled">
        <Badge
          label={isPremium ? '✨ Premium Member' : '🌙 Free Tier'}
          variant={isPremium ? 'primary' : 'default'}
          size="lg"
          style={{ marginBottom: theme.spacing.sm }}
        />
        {isPremium && expiry && (
          <Text style={{ fontSize: 13, color: theme.colors.text.muted }}>Expires: {expiry}</Text>
        )}
        {!isPremium && (
          <Button
            title="Upgrade to Premium"
            variant="primary"
            onPress={onUpgrade ?? fn()}
            style={{ marginTop: theme.spacing.sm }}
          />
        )}
      </Card>
    </View>
  );
}

// ── Full-screen fixture ───────────────────────────────────────────────────────

type ProfileFixtureProps = {
  loading?: boolean;
  isPremium?: boolean;
  expiry?: string;
  hasSigns?: boolean;
  hasGeocode?: boolean;
  geocodeState?: 'idle' | 'loading' | 'cooldown';
  detailsLocked?: boolean;
  onGeocode?: () => void;
  onUpgrade?: () => void;
  onSignOut?: () => void;
};

function ProfileFixture({
  loading,
  isPremium,
  expiry,
  hasSigns,
  hasGeocode,
  geocodeState = 'idle',
  detailsLocked,
  onGeocode,
  onUpgrade,
  onSignOut,
}: ProfileFixtureProps) {
  if (loading) {
    return (
      <ScrollView contentContainerStyle={s.screen}>
        <SkeletonProfile />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.screen}>
      <ProfileHeader
        name={USER.name}
        email={USER.email}
        sunSign={hasSigns ? SIGNS.sun : undefined}
      />

      <BirthDetailsCard
        date={BIRTH.date}
        time={BIRTH.time}
        location={BIRTH.location}
        timezone={hasGeocode ? BIRTH.timezone : undefined}
        sunSign={hasSigns ? SIGNS.sun : undefined}
        moonSign={hasSigns ? SIGNS.moon : undefined}
        risingSign={hasSigns ? SIGNS.rising : undefined}
        canEdit={!detailsLocked}
        geocodeState={geocodeState}
        onGeocode={onGeocode}
        locked={detailsLocked}
      />

      <SubscriptionCard isPremium={!!isPremium} expiry={expiry} onUpgrade={onUpgrade} />

      <Button
        title="Sign Out"
        variant="destructive"
        onPress={onSignOut ?? fn()}
        fullWidth
        style={{ marginTop: 8 }}
      />
    </ScrollView>
  );
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Screens/Profile',
  component: ProfileFixture,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ flex: 1, backgroundColor: theme.colors.surface.background }}>
        <Story />
      </View>
    ),
  ],
  args: {
    hasSigns: true,
    geocodeState: 'idle',
    onGeocode: fn(),
    onUpgrade: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof ProfileFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  args: { loading: true },
};

/** Freshly onboarded — signs computed, coords/timezone pending. Shows the geocode CTA. */
export const PendingGeocode: Story = {
  args: { hasSigns: true, hasGeocode: false },
};

/** Geocode request in flight — button shows spinner. */
export const GeocodingInProgress: Story = {
  args: { hasSigns: true, hasGeocode: false, geocodeState: 'loading' },
};

/** 30-second cooldown after a geocode attempt. */
export const GeocodeCooldown: Story = {
  args: { hasSigns: true, hasGeocode: false, geocodeState: 'cooldown' },
};

/** Geocoding resolved — timezone shown inline, no CTA button. */
export const FullyGeocoded: Story = {
  args: { hasSigns: true, hasGeocode: true },
};

/** Free user, profile complete. */
export const FreeUser: Story = {
  args: { hasSigns: true, hasGeocode: true, isPremium: false },
};

/** Premium user — badge + expiry, no upgrade button. */
export const PremiumUser: Story = {
  args: {
    hasSigns: true,
    hasGeocode: true,
    isPremium: true,
    expiry: 'April 11, 2027',
  },
};

/** Birth details locked after one edit — hides the Edit link. */
export const DetailsLocked: Story = {
  args: { hasSigns: true, hasGeocode: true, detailsLocked: true },
};

/** No birth details yet (edge case — should not happen post-onboarding). */
export const NoDetails: Story = {
  args: { hasSigns: false, hasGeocode: false },
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  email: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  editLink: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.brand.primary,
  },
  detailText: {
    fontSize: 15,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  detailMuted: {
    fontSize: 13,
    color: theme.colors.text.muted,
  },
  signsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  signChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: theme.colors.surface.subtle,
  },
  signChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  geocodeButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  geocodeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  lockedNote: {
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
