import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useReadings } from '@hooks/useReadings';
import type { ReadingRow } from '@hooks/useReadings';
import { useFilteredReadings } from '@hooks/useFilteredReadings';
import { useReadingExpiry } from '@hooks/useReadingExpiry';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { ReadingListItem, ReadingDrawer, SearchFilterBar, SkeletonRow } from '@/components/history';
import { ExpiryWarningBanner } from '@components/ui/ExpiryWarningBanner';
import { spacing, borderRadius } from '@theme';

export default function HistoryScreen() {
  const { user, error: authError } = useAuth();
  const { limits, isPremium } = useSubscription(user?.id);
  const expiry = useReadingExpiry(user?.id, isPremium);
  const theme = useAppTheme();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
    error: readingsError,
  } = useReadings(user?.id, limits.maxReadingHistory);

  const error = authError || readingsError;

  const [selectedReading, setSelectedReading] = useState<ReadingRow | null>(null);

  const readings = useMemo(() => data?.pages.flat() ?? [], [data]);

  const {
    query,
    onChangeSearch,
    clearSearch,
    spreadFilter,
    setSpreadFilter,
    dateRangeFilter,
    setDateRangeFilter,
    clearAllFilters,
    filtered,
    isDebouncing,
  } = useFilteredReadings(readings);

  const openDrawer = useCallback((r: ReadingRow) => setSelectedReading(r), []);
  const closeDrawer = useCallback(() => setSelectedReading(null), []);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: ReadingRow }) => <ReadingListItem reading={item} onPress={openDrawer} />,
    [openDrawer]
  );

  const keyExtractor = useCallback((item: ReadingRow) => item.id, []);

  const { open: openUpgradeSheet } = useUpgradeSheet();

  const isFilterActive = query.length > 0 || spreadFilter !== 'all' || dateRangeFilter !== 'all';

  const ListHeader = (
    <View>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Reading History</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.muted }]}>
        {isPremium
          ? `${readings.length} reading${readings.length !== 1 ? 's' : ''}`
          : `${readings.length} of ${limits.maxReadingHistory}`}
      </Text>
      <ExpiryWarningBanner expiry={expiry} onUpgradePress={openUpgradeSheet} />
      {readings.length > 0 && (
        <View style={{ marginTop: spacing.lg, marginBottom: 0 }}>
          <SearchFilterBar
            query={query}
            onChangeSearch={onChangeSearch}
            clearSearch={clearSearch}
            spreadFilter={spreadFilter}
            setSpreadFilter={setSpreadFilter}
            dateRangeFilter={dateRangeFilter}
            setDateRangeFilter={setDateRangeFilter}
            clearAllFilters={clearAllFilters}
            resultCount={filtered.length}
            totalCount={readings.length}
          />
        </View>
      )}
    </View>
  );

  const ListEmpty = isLoading ? (
    <View style={styles.skeletons}>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  ) : error ? (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>⚠️</Text>
      <Text style={[styles.errorTitle, { color: theme.colors.error.dark }]}>
        Failed to load readings
      </Text>
      <Text style={[styles.emptyBody, { color: theme.colors.text.muted }]}>
        {error.message || 'Something went wrong. Please try again.'}
      </Text>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.colors.error.main }]}
        onPress={() => refetch()}
        accessibilityRole="button"
        accessibilityLabel="Retry loading readings"
      >
        <Text style={styles.actionButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  ) : isDebouncing ? (
    <ActivityIndicator color={theme.colors.brand.primary} style={{ marginTop: 48 }} />
  ) : isFilterActive ? (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text.secondary }]}>
        No matching readings
      </Text>
      <Text style={[styles.emptyBody, { color: theme.colors.text.muted }]}>
        Try adjusting your search or filters to find what you're looking for.
      </Text>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.colors.brand.primary }]}
        onPress={() => {
          clearSearch();
          clearAllFilters();
        }}
        accessibilityRole="button"
        accessibilityLabel="Clear all filters"
      >
        <Text style={styles.actionButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🔮</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text.secondary }]}>
        No readings yet
      </Text>
      <Text style={[styles.emptyBody, { color: theme.colors.text.muted }]}>
        Draw your first card from the Home screen to begin your journey.
      </Text>
    </View>
  );

  const ListFooter = (
    <View style={styles.footer}>
      {isFetchingNextPage && (
        <ActivityIndicator
          color={theme.colors.brand.primary}
          size="small"
          style={{ marginVertical: 16 }}
        />
      )}
      {!isPremium && !isLoading && readings.length >= limits.maxReadingHistory && (
        <View style={[styles.upgradePrompt, { backgroundColor: theme.colors.brand.purple[50] }]}>
          <Text style={[styles.upgradeText, { color: theme.colors.brand.purple[600] }]}>
            Upgrade to Premium to unlock your full reading history.
          </Text>
        </View>
      )}
      {isPremium && !hasNextPage && readings.length > 0 && (
        <Text style={[styles.caughtUp, { color: theme.colors.text.muted }]}>
          You're all caught up ✦
        </Text>
      )}
    </View>
  );

  return (
    <>
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={[styles.list, { backgroundColor: theme.colors.surface.background }]}
        contentContainerStyle={styles.content}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={refetch}
        refreshing={isRefetching}
        removeClippedSubviews
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      <ReadingDrawer reading={selectedReading} onClose={closeDrawer} />
    </>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40 },
  // listHeader: { paddingTop: spacing.lg, marginBottom: spacing.lg },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  skeletons: { gap: 0 },
  emptyState: { paddingTop: 80, alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.lg },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm },
  errorTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm },
  emptyBody: { fontSize: 16, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  footer: { paddingTop: spacing.sm },
  upgradePrompt: {
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  upgradeText: { fontSize: 14, textAlign: 'center', fontWeight: '600' },
  caughtUp: { textAlign: 'center', fontSize: 14, paddingVertical: spacing.lg },
  actionButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  actionButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
