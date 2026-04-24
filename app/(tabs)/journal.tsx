import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useJournals, type JournalRow } from '@hooks/useJournals';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function JournalGateCard() {
  const theme = useAppTheme();
  const { open: openUpgradeSheet } = useUpgradeSheet();

  return (
    <View
      style={[
        gateStyles.card,
        {
          backgroundColor: theme.colors.surface.card,
          borderColor: theme.colors.brand.primary,
        },
      ]}
    >
      <Text style={gateStyles.icon}>📓</Text>
      <Text style={[gateStyles.title, { color: theme.colors.brand.primary }]}>Private Journal</Text>
      <Text style={[gateStyles.subtitle, { color: theme.colors.text.secondary }]}>
        Premium Feature
      </Text>
      <View style={gateStyles.features}>
        <Text style={[gateStyles.feature, { color: theme.colors.text.secondary }]}>
          • Write freely after each reading
        </Text>
        <Text style={[gateStyles.feature, { color: theme.colors.text.secondary }]}>
          • Seed entries from your reflections
        </Text>
        <Text style={[gateStyles.feature, { color: theme.colors.text.secondary }]}>
          • Private, searchable, always yours
        </Text>
      </View>
      <View style={[gateStyles.footer, { borderTopColor: theme.colors.border.main }]}>
        <Text style={[gateStyles.price, { color: theme.colors.brand.primary }]}>$49/year</Text>
        <Pressable
          style={[gateStyles.upgradeBtn, { backgroundColor: theme.colors.brand.primary }]}
          onPress={openUpgradeSheet}
          accessibilityRole="button"
          accessibilityLabel="Upgrade to Premium for $49 per year"
        >
          <Text style={[gateStyles.upgradeBtnText, { color: '#fff' }]}>Upgrade Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const gateStyles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    borderRadius: borderRadius.card,
    borderWidth: 2,
    margin: spacing.xl,
  },
  icon: { fontSize: 32, textAlign: 'center', marginBottom: spacing.sm },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: spacing.md },
  features: { gap: spacing.xs, marginBottom: spacing.lg },
  feature: { fontSize: 15 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  price: { fontSize: 20, fontWeight: 'bold' },
  upgradeBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  upgradeBtnText: { fontSize: 15, fontWeight: '600' },
});

function JournalListItem({ entry, onPress }: { entry: JournalRow; onPress: () => void }) {
  const theme = useAppTheme();
  const preview = entry.body.length > 100 ? entry.body.slice(0, 100) + '…' : entry.body;

  return (
    <TouchableOpacity
      style={[
        itemStyles.row,
        {
          backgroundColor: theme.colors.surface.card,
          borderColor: theme.colors.border.main,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={entry.title ?? 'Journal entry'}
    >
      <View style={itemStyles.topRow}>
        <Text style={[itemStyles.date, { color: theme.colors.text.muted }]}>
          {formatDate(entry.created_at)}
        </Text>
        {entry.reading_id && (
          <View
            style={[
              itemStyles.badge,
              {
                backgroundColor: theme.colors.brand.purple[100],
                borderColor: theme.colors.brand.purple[200],
              },
            ]}
          >
            <Text style={[itemStyles.badgeText, { color: theme.colors.brand.primaryDark }]}>
              From Reading
            </Text>
          </View>
        )}
      </View>
      {entry.title && (
        <Text style={[itemStyles.title, { color: theme.colors.text.primary }]} numberOfLines={1}>
          {entry.title}
        </Text>
      )}
      {preview.length > 0 && (
        <Text style={[itemStyles.preview, { color: theme.colors.text.secondary }]} numberOfLines={3}>
          {preview}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const itemStyles = StyleSheet.create({
  row: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: { fontSize: 12, fontWeight: '500' },
  badge: {
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700' },
  preview: { fontSize: 14, lineHeight: 20 },
});

export default function JournalScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
  const { isPremium } = useSubscription(user?.id);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useJournals(
    isPremium ? user?.id : undefined
  );

  const entries = useMemo(() => data?.pages.flat() ?? [], [data]);

  if (!isPremium) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface.background }]}
      >
        <View style={[styles.header, { borderBottomColor: theme.colors.border.light }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Journal</Text>
        </View>
        <JournalGateCard />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border.light }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Journal</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.brand.primary} size="large" />
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📓</Text>
          <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
            Your journal is empty
          </Text>
          <Text style={[styles.emptyBody, { color: theme.colors.text.secondary }]}>
            Tap + to write your first entry, or add one after a reflection.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalListItem
              entry={item}
              onPress={() =>
                router.push({ pathname: '/journal-entry', params: { id: item.id } })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color={theme.colors.brand.primary}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.brand.primary }]}
        onPress={() => router.push({ pathname: '/journal-entry', params: {} })}
        accessibilityRole="button"
        accessibilityLabel="New journal entry"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyBody: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  listContent: {
    padding: 16,
    paddingBottom: 160,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: { fontSize: 28, color: '#fff', lineHeight: 32 },
});
