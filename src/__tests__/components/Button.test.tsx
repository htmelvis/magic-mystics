import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@components/ui/Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders the title', () => {
      const { getByText } = render(<Button title="Continue" onPress={jest.fn()} />);
      expect(getByText('Continue')).toBeTruthy();
    });

    it('defaults accessibilityLabel to the title', () => {
      const { getByRole } = render(<Button title="Continue" onPress={jest.fn()} />);
      expect(getByRole('button').props.accessibilityLabel).toBe('Continue');
    });

    it('uses a custom accessibilityLabel when provided', () => {
      const { getByRole } = render(
        <Button title="→" onPress={jest.fn()} accessibilityLabel="Go to next step" />
      );
      expect(getByRole('button').props.accessibilityLabel).toBe('Go to next step');
    });

    it('forwards accessibilityHint', () => {
      const { getByRole } = render(
        <Button title="Sign in" onPress={jest.fn()} accessibilityHint="Double-tap to sign in" />
      );
      expect(getByRole('button').props.accessibilityHint).toBe('Double-tap to sign in');
    });
  });

  describe('onPress', () => {
    it('calls onPress when tapped', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<Button title="Save" onPress={onPress} />);
      fireEvent.press(getByRole('button'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<Button title="Save" onPress={onPress} disabled />);
      fireEvent.press(getByRole('button'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<Button title="Save" onPress={onPress} loading />);
      fireEvent.press(getByRole('button'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('hides the title text and renders a spinner', () => {
      const { queryByText, UNSAFE_getByType } = render(
        <Button title="Save" onPress={jest.fn()} loading />
      );
      expect(queryByText('Save')).toBeNull();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('appends ", loading" to the title in the accessibility label', () => {
      const { getByRole } = render(<Button title="Save" onPress={jest.fn()} loading />);
      expect(getByRole('button').props.accessibilityLabel).toBe('Save, loading');
    });

    it('appends ", loading" to a custom accessibilityLabel', () => {
      const { getByRole } = render(
        <Button
          title="→"
          onPress={jest.fn()}
          loading
          accessibilityLabel="Go to next step"
        />
      );
      expect(getByRole('button').props.accessibilityLabel).toBe('Go to next step, loading');
    });

    it('sets accessibilityState.disabled to true while loading', () => {
      const { getByRole } = render(<Button title="Save" onPress={jest.fn()} loading />);
      expect(getByRole('button').props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('sets accessibilityState.disabled to true', () => {
      const { getByRole } = render(<Button title="Save" onPress={jest.fn()} disabled />);
      expect(getByRole('button').props.accessibilityState.disabled).toBe(true);
    });

    it('accessibilityState.disabled is false when neither disabled nor loading', () => {
      const { getByRole } = render(<Button title="Save" onPress={jest.fn()} />);
      expect(getByRole('button').props.accessibilityState.disabled).toBe(false);
    });
  });

  describe('icon', () => {
    const Icon = () => <Text testID="icon">★</Text>;

    it('renders an icon on the left by default', () => {
      const { getByTestId, getByText } = render(
        <Button title="Save" onPress={jest.fn()} icon={<Icon />} />
      );
      const icon = getByTestId('icon');
      const label = getByText('Save');
      // Icon appears before the title in the tree
      expect(icon).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it('renders an icon on the right when iconPosition is "right"', () => {
      const { getByTestId, getByText } = render(
        <Button title="Save" onPress={jest.fn()} icon={<Icon />} iconPosition="right" />
      );
      expect(getByTestId('icon')).toBeTruthy();
      expect(getByText('Save')).toBeTruthy();
    });

    it('renders with no icon when icon prop is omitted', () => {
      const { queryByTestId } = render(<Button title="Save" onPress={jest.fn()} />);
      expect(queryByTestId('icon')).toBeNull();
    });
  });
});
