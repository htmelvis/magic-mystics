import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useState } from 'react';
import { useAppTheme } from '@hooks/useAppTheme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useAppTheme();
  const { accessibilityLabel, accessibilityHint, ...restInputProps } = textInputProps;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.colors.text.primary }]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface.elevated,
            borderColor: isFocused
              ? theme.colors.border.focus
              : error
                ? theme.colors.error.main
                : theme.colors.border.main,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text.primary },
            leftIcon ? styles.input_withLeftIcon : undefined,
          ]}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error ? `Error: ${error}` : (accessibilityHint ?? hint)}
          {...restInputProps}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error && <Text style={[styles.error, { color: theme.colors.error.main }]}>{error}</Text>}
      {hint && !error && (
        <Text style={[styles.hint, { color: theme.colors.text.muted }]}>{hint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    padding: 16,
  },

  input_withLeftIcon: {
    paddingLeft: 0,
  },

  iconLeft: {
    paddingLeft: 16,
  },

  iconRight: {
    paddingRight: 16,
  },

  error: {
    fontSize: 12,
    marginTop: 2,
  },

  hint: {
    fontSize: 12,
    marginTop: 2,
  },
});
