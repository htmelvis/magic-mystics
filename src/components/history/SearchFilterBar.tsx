import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { spacing, borderRadius } from '@theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { DateRangeFilter, SpreadFilter } from '@hooks/useFilteredReadings';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ── Chip definitions ──────────────────────────────────────────────────────────

interface ChipDef<T extends string> {
  key: T;
  label: string;
  a11yLabel: string;
}

const SPREAD_CHIPS: ChipDef<SpreadFilter>[] = [
  { key: 'all', label: 'All', a11yLabel: 'Show all spread types' },
  { key: 'daily', label: 'Daily Draw', a11yLabel: 'Show daily draw readings only' },
  { key: 'past-present-future', label: '3-Card', a11yLabel: 'Show 3-card spread readings only' },
];

const DATE_CHIPS: ChipDef<DateRangeFilter>[] = [
  { key: 'all', label: 'All Time', a11yLabel: 'Show all dates' },
  { key: 'today', label: 'Today', a11yLabel: 'Show today only' },
  { key: 'this-week', label: 'This Week', a11yLabel: 'Show this week' },
  { key: 'last-week', label: 'Last Week', a11yLabel: 'Show last week' },
  { key: 'this-month', label: 'This Month', a11yLabel: 'Show this month' },
  { key: 'last-month', label: 'Last Month', a11yLabel: 'Show last month' },
];

// ── Generic chip row ──────────────────────────────────────────────────────────

function ChipRow<T extends string>({
  chips,
  value,
  onChange,
  label,
}: {
  chips: ChipDef<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const theme = useAppTheme();
  return (
    <View style={styles.filterSection}>
      <Text style={[styles.filterSectionLabel, { color: theme.colors.text.muted }]}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="tablist"
        accessibilityLabel={label}
      >
        {chips.map(chip => {
          const active = value === chip.key;
          return (
            <Pressable
              key={chip.key}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? theme.colors.brand.primary
                    : theme.colors.surface.subtle,
                  borderColor: active ? theme.colors.brand.primary : theme.colors.border.main,
                },
              ]}
              onPress={() => onChange(chip.key)}
              accessibilityRole="tab"
              accessibilityLabel={chip.a11yLabel}
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? theme.colors.text.inverse : theme.colors.text.secondary },
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SearchFilterBarProps {
  query: string;
  onChangeSearch: (text: string) => void;
  clearSearch: () => void;
  spreadFilter: SpreadFilter;
  setSpreadFilter: (f: SpreadFilter) => void;
  dateRangeFilter: DateRangeFilter;
  setDateRangeFilter: (f: DateRangeFilter) => void;
  clearAllFilters: () => void;
  resultCount: number;
  totalCount: number;
}

export const SearchFilterBar = memo(function SearchFilterBar({
  query,
  onChangeSearch,
  clearSearch,
  spreadFilter,
  setSpreadFilter,
  dateRangeFilter,
  setDateRangeFilter,
  clearAllFilters,
  resultCount,
  totalCount,
}: SearchFilterBarProps) {
  const theme = useAppTheme();
  const inputRef = useRef<TextInput>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleClear = useCallback(() => {
    clearSearch();
    inputRef.current?.focus();
  }, [clearSearch]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (spreadFilter !== 'all') count += 1;
    if (dateRangeFilter !== 'all') count += 1;
    return count;
  }, [spreadFilter, dateRangeFilter]);

  const toggleDrawer = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDrawerOpen(prev => !prev);
  }, []);

  const handleClearAll = useCallback(() => {
    clearAllFilters();
    clearSearch();
  }, [clearAllFilters, clearSearch]);

  const isFiltering = query.length > 0 || activeFilterCount > 0;

  return (
    <View style={styles.container} accessibilityRole="search" accessibilityLabel="Filter readings">
      {/* Search input */}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.surface.card,
            borderColor: theme.colors.border.main,
          },
        ]}
      >
        <Text style={styles.searchIcon} accessible={false}>
          🔍
        </Text>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: theme.colors.text.primary }]}
          value={query}
          onChangeText={onChangeSearch}
          placeholder="Search cards, spreads…"
          placeholderTextColor={theme.colors.text.muted}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
          accessibilityLabel="Search readings"
          accessibilityHint="Type to filter by card name or spread type"
        />
        {query.length > 0 && (
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Text style={[styles.clearIcon, { color: theme.colors.text.muted }]}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filters toggle */}
      <Pressable
        style={styles.filterToggle}
        onPress={toggleDrawer}
        accessibilityRole="button"
        accessibilityLabel={`${drawerOpen ? 'Hide' : 'Show'} filters`}
        accessibilityState={{ expanded: drawerOpen }}
      >
        <View style={styles.filterToggleLeft}>
          <Text style={[styles.filterToggleLabel, { color: theme.colors.text.secondary }]}>
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.brand.primary }]}>
              <Text style={[styles.badgeText, { color: theme.colors.text.inverse }]}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.chevron, { color: theme.colors.text.muted }]}>
          {drawerOpen ? '▲' : '▼'}
        </Text>
      </Pressable>

      {drawerOpen && (
        <View
          style={[
            styles.drawer,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: theme.colors.border.main,
            },
          ]}
        >
          <ChipRow
            chips={SPREAD_CHIPS}
            value={spreadFilter}
            onChange={setSpreadFilter}
            label="Spread Type"
          />
          <ChipRow
            chips={DATE_CHIPS}
            value={dateRangeFilter}
            onChange={setDateRangeFilter}
            label="Time Range"
          />
          {activeFilterCount > 0 && (
            <Pressable
              onPress={handleClearAll}
              style={styles.clearAllButton}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
            >
              <Text style={[styles.clearAllText, { color: theme.colors.brand.primary }]}>
                Clear All
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Result count — only shown when actively filtering */}
      {isFiltering && (
        <Text
          style={[styles.resultCount, { color: theme.colors.text.muted }]}
          accessibilityRole="text"
          accessibilityLiveRegion="polite"
        >
          {resultCount === 0
            ? 'No readings match your filters'
            : `Showing ${resultCount} of ${totalCount} reading${totalCount !== 1 ? 's' : ''}`}
        </Text>
      )}
    </View>
  );
});

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.input,
    paddingHorizontal: spacing.sm,
    minHeight: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    padding: spacing.xxs,
    marginLeft: spacing.xs,
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  filterToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterToggleLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 10,
  },
  drawer: {
    borderRadius: borderRadius.input,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  filterSection: {
    gap: spacing.xs,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: borderRadius.badge,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearAllButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 12,
    fontWeight: '500',
  },
});
