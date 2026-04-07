import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { theme } from '@theme';
import { useState } from 'react';

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

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainer_focused,
          error && styles.inputContainer_error,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, leftIcon && styles.input_withLeftIcon]}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    ...theme.textStyles.label,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderWidth: 2,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.input,
  },

  inputContainer_focused: {
    borderColor: theme.colors.border.focus,
  },

  inputContainer_error: {
    borderColor: theme.colors.error.main,
  },

  input: {
    flex: 1,
    ...theme.textStyles.body,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
  },

  input_withLeftIcon: {
    paddingLeft: 0,
  },

  iconLeft: {
    paddingLeft: theme.spacing.md,
  },

  iconRight: {
    paddingRight: theme.spacing.md,
  },

  error: {
    ...theme.textStyles.caption,
    color: theme.colors.error.main,
    marginTop: theme.spacing.xxs,
  },

  hint: {
    ...theme.textStyles.caption,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xxs,
  },
});
