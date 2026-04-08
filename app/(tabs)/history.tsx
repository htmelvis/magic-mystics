import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useReadings } from '@hooks/useReadings';
import type { ReadingRow } from '@hooks/useReadings';
import { useFilteredReadings } from '@hooks/useFilteredReadings';
import { useReadingExpiry } from '@hooks/useReadingExpiry';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { ReadingListItem, ReadingDrawer, SearchFilterBar, SkeletonRow } from '@/components/history';
import { ExpiryWarningBanner } from '@components/ui/ExpiryWarningBanner';
import { theme } from '@theme';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const { user, error: authError } = useAuth();
  const { limits, isPremium } = useSubscription(user?.id);
  const expiry = useReadingExpiry(user?.id, isPremium);
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
    filtered,
  } = useFilteredReadings(readings);

  const openDrawer = useCallback((r: ReadingRow) => setSelectedReading(r), []);
  const closeDrawer = useCallback(() => setSelectedReading(null), []);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: ReadingRow }) => (
      <ReadingListItem reading={item} onPress={openDrawer} />
    ),
    [openDrawer]
  );

  const keyExtractor = useCallback((item: ReadingRow) => item.id, []);

  const { open: openUpgradeSheet } = useUpgradeSheet();

  const ListHeader = (
    <View style={screenStyles.listHeader}>
      <Text style={screenStyles.title}>Reading History</Text>
      <Text style={screenStyles.subtitle}>
        {isPremium
          ? `${readings.length} reading${readings.length !== 1 ? 's' : ''}`
          : `${readings.length} of ${limits.maxReadingHistory}`}
      </Text>
      <ExpiryWarningBanner expiry={expiry} onUpgradePress={openUpgradeSheet} />
      {readings.length > 0 && (
        <SearchFilterBar
          query={query}
          onChangeSearch={onChangeSearch}
          clearSearch={clearSearch}
          spreadFilter={spreadFilter}
          setSpreadFilter={setSpreadFilter}
          resultCount={filtered.length}
          totalCount={readings.length}
        />
      )}
    </View>
  );

  const isFilterActive = query.length > 0 || spreadFilter !== 'all';

  const ListEmpty = isLoading ? (
    <View style={screenStyles.skeletons}>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  ) : error ? (
    <View style={screenStyles.errorState}>
      <Text style={screenStyles.errorIcon}>⚠️</Text>
      <Text style={screenStyles.errorTitle}>Failed to load readings</Text>
      <Text style={screenStyles.errorBody}>
        {error.message || 'Something went wrong. Please try again.'}
      </Text>
      <TouchableOpacity
        style={screenStyles.errorRetry}
        onPress={() => refetch()}
        accessibilityRole="button"
        accessibilityLabel="Retry loading readings"
      >
        <Text style={screenStyles.errorRetryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  ) : isFilterActive ? (
    <View style={screenStyles.emptyState}>
      <Text style={screenStyles.emptyIcon}>🔍</Text>
      <Text style={screenStyles.emptyTitle}>No matching readings</Text>
      <Text style={screenStyles.emptyBody}>
        Try adjusting your search or filters to find what you're looking for.
      </Text>
      <TouchableOpacity
        style={screenStyles.clearFiltersButton}
        onPress={() => { clearSearch(); setSpreadFilter('all'); }}
        accessibilityRole="button"
        accessibilityLabel="Clear all filters"
      >
        <Text style={screenStyles.clearFiltersText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={screenStyles.emptyState}>
      <Text style={screenStyles.emptyIcon}>🔮</Text>
      <Text style={screenStyles.emptyTitle}>No readings yet</Text>
      <Text style={screenStyles.emptyBody}>
        Draw your first card from the Home screen to begin your journey.
      </Text>
    </View>
  );

  const ListFooter = (
    <View style={screenStyles.footer}>
      {isFetchingNextPage && (
        <ActivityIndicator color={theme.colors.brand.primary} size="small" style={{ marginVertical: 16 }} />
      )}
      {!isPremium && !isLoading && readings.length >= limits.maxReadingHistory && (
        <View style={screenStyles.upgradePrompt}>
          <Text style={screenStyles.upgradeText}>
            Upgrade to Premium to unlock your full reading history.
          </Text>
        </View>
      )}
      {isPremium && !hasNextPage && readings.length > 0 && (
        <Text style={screenStyles.caughtUp}>You're all caught up ✦</Text>
      )}
    </View>
  );

  return (
    <>
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={screenStyles.list}
        contentContainerStyle={screenStyles.content}
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

// ── Styles ────────────────────────────────────────────────────────────────────

const screenStyles = StyleSheet.create({
  list: { flex: 1, backgroundColor: theme.colors.surface.subtle },
  content: { padding: theme.spacing.lg, paddingBottom: 40 },
  listHeader: { paddingTop: theme.spacing.lg, marginBottom: theme.spacing.lg },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: theme.colors.text.primary, 
    marginBottom: 4 
  },
  subtitle: { fontSize: theme.typography.fontSize.sm, color: theme.colors.text.muted },
  skeletons: { gap: 0 },
  emptyState: { 
    paddingTop: 80, 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  emptyIcon: { fontSize: 48, marginBottom: theme.spacing.lg },
  emptyTitle: { 
    fontSize: theme.typography.fontSize.xl, 
    fontWeight: '700', 
    color: theme.colors.text.secondary, 
    marginBottom: theme.spacing.sm 
  },
  emptyBody: { 
    fontSize: theme.typography.fontSize.base, 
    color: theme.colors.text.muted, 
    textAlign: 'center', 
    lineHeight: 22 
  },
  footer: { paddingTop: theme.spacing.sm },
  upgradePrompt: {
    backgroundColor: theme.colors.brand.purple[50],
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  upgradeText: { 
    fontSize: theme.typography.fontSize.sm, 
    color: theme.colors.brand.purple[600], 
    textAlign: 'center', 
    fontWeight: '600' 
  },
  caughtUp: { 
    textAlign: 'center', 
    fontSize: theme.typography.fontSize.sm, 
    color: theme.colors.text.muted, 
    paddingVertical: theme.spacing.lg 
  },
  clearFiltersButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.brand.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  clearFiltersText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  errorState: {
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: { fontSize: 48, marginBottom: theme.spacing.lg },
  errorTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.error.dark,
    marginBottom: theme.spacing.sm,
  },
  errorBody: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  errorRetry: {
    backgroundColor: theme.colors.error.main,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  errorRetryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
