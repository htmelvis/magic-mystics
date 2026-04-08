import { memo, useCallback, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { theme } from '@theme';
import type { SpreadFilter } from '@hooks/useFilteredReadings';

// ── Filter chip definitions ───────────────────────────────────────────────────

interface ChipDef {
  key: SpreadFilter;
  label: string;
  a11yLabel: string;
}

const CHIPS: ChipDef[] = [
  { key: 'all', label: 'All', a11yLabel: 'Show all readings' },
  { key: 'daily', label: 'Daily Draw', a11yLabel: 'Show daily draw readings only' },
  { key: 'past-present-future', label: '3-Card', a11yLabel: 'Show 3-card spread readings only' },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface SearchFilterBarProps {
  query: string;
  onChangeSearch: (text: string) => void;
  clearSearch: () => void;
  spreadFilter: SpreadFilter;
  setSpreadFilter: (f: SpreadFilter) => void;
  resultCount: number;
  totalCount: number;
}

export const SearchFilterBar = memo(function SearchFilterBar({
  query,
  onChangeSearch,
  clearSearch,
  spreadFilter,
  setSpreadFilter,
  resultCount,
  totalCount,
}: SearchFilterBarProps) {
  const inputRef = useRef<TextInput>(null);

  const handleClear = useCallback(() => {
    clearSearch();
    inputRef.current?.focus();
  }, [clearSearch]);

  const isFiltering = query.length > 0 || spreadFilter !== 'all';

  return (
    <View
      style={styles.container}
      accessibilityRole="search"
      accessibilityLabel="Filter readings"
    >
      {/* Search input */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon} accessible={false}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={onChangeSearch}
            placeholder="Search cards, dates, spreads…"
            placeholderTextColor={theme.colors.text.muted}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="never"
            accessibilityLabel="Search readings"
            accessibilityHint="Type to filter by card name, date, or spread type"
          />
          {query.length > 0 && (
            <Pressable
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="tablist"
        accessibilityLabel="Filter by spread type"
      >
        {CHIPS.map((chip) => {
          const active = spreadFilter === chip.key;
          return (
            <Pressable
              key={chip.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSpreadFilter(active && chip.key !== 'all' ? 'all' : chip.key)}
              accessibilityRole="tab"
              accessibilityLabel={chip.a11yLabel}
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Result count — only shown when actively filtering */}
      {isFiltering && (
        <Text
          style={styles.resultCount}
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
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.input,
    paddingHorizontal: theme.spacing.sm,
    minHeight: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },
  clearButton: {
    padding: theme.spacing.xxs,
    marginLeft: theme.spacing.xs,
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 14,
    color: theme.colors.text.muted,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.badge,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    minHeight: 34,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  chipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  chipTextActive: {
    color: theme.colors.text.inverse,
  },
  resultCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    fontWeight: '500',
  },
});
