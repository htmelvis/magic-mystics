import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Input } from './Input';
import { searchLocations } from '@lib/geocoding/geocode';
import type { LocationSuggestion } from '@lib/geocoding/geocode';
import { theme } from '@theme';

const DEBOUNCE_MS = 500;

export interface LocationInputProps {
  label?: string;
  error?: string;
  hint?: string;
  value: string;
  onChangeValue: (value: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  onBlur?: () => void;
  /** Override the search function — useful for tests and Storybook. Defaults to Nominatim. */
  onSearch?: (query: string, signal: AbortSignal) => Promise<LocationSuggestion[]>;
}

export function LocationInput({
  label,
  error,
  hint,
  value,
  onChangeValue,
  placeholder = 'e.g. Los Angeles, USA',
  containerStyle,
  onBlur,
  onSearch,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const search = onSearch ?? searchLocations;

  useEffect(() => {
    if (confirmed) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    abortRef.current?.abort();

    if (value.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    debounceTimer.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      const results = await search(value, controller.signal);
      if (!controller.signal.aborted) {
        setSuggestions(results);
        setSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, confirmed, search]);

  const handleSelect = (suggestion: LocationSuggestion) => {
    abortRef.current?.abort();
    setConfirmed(true);
    setSuggestions([]);
    onChangeValue(suggestion.shortName);
  };

  const handleChangeText = (text: string) => {
    setConfirmed(false);
    onChangeValue(text);
  };

  const showDropdown = suggestions.length > 0 || searching;

  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        label={label}
        error={error}
        hint={hint}
        value={value}
        onChangeText={handleChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={200}
        returnKeyType="done"
        rightIcon={
          searching ? (
            <ActivityIndicator size="small" color={theme.colors.brand.primary} />
          ) : undefined
        }
      />

      {showDropdown && (
        <View style={styles.dropdown}>
          {searching && suggestions.length === 0 ? (
            <View style={styles.row}>
              <Text style={styles.muted}>Searching…</Text>
            </View>
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.displayName}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <Pressable
                  style={[styles.row, index < suggestions.length - 1 && styles.rowBorder]}
                  onPress={() => handleSelect(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.displayName}
                >
                  <Text style={styles.rowText} numberOfLines={1}>
                    {item.displayName}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.input,
    marginTop: theme.spacing.xs,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  row: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  rowText: {
    ...theme.textStyles.body,
    color: theme.colors.text.primary,
  },
  muted: {
    ...theme.textStyles.caption,
    color: theme.colors.text.muted,
  },
});
