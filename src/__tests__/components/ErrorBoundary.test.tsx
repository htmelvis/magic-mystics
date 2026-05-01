import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';

// Suppress React's own error boundary console.error noise in test output
beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

const GoodChild = () => <Text>All good</Text>;

const ThrowingChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Explosion!');
  return <Text>Recovered</Text>;
};

describe('ErrorBoundary', () => {
  describe('happy path', () => {
    it('renders children when no error is thrown', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <GoodChild />
        </ErrorBoundary>
      );
      expect(getByText('All good')).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('shows default fallback title and error message', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow />
        </ErrorBoundary>
      );
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(getByText('Explosion!')).toBeTruthy();
      expect(getByText('Try again')).toBeTruthy();
    });

    it('shows custom fallbackTitle when provided', () => {
      const { getByText } = render(
        <ErrorBoundary fallbackTitle="Card draw failed">
          <ThrowingChild shouldThrow />
        </ErrorBoundary>
      );
      expect(getByText('Card draw failed')).toBeTruthy();
    });

    it('does not render children while in error state', () => {
      const { queryByText } = render(
        <ErrorBoundary>
          <ThrowingChild shouldThrow />
        </ErrorBoundary>
      );
      expect(queryByText('Recovered')).toBeNull();
    });
  });

  describe('reset', () => {
    it('renders children again after Try again is pressed and child stops throwing', () => {
      let shouldThrow = true;
      const ToggleChild = () => {
        if (shouldThrow) throw new Error('Boom!');
        return <Text>Recovered</Text>;
      };

      const { getByText } = render(
        <ErrorBoundary>
          <ToggleChild />
        </ErrorBoundary>
      );

      expect(getByText('Something went wrong')).toBeTruthy();

      shouldThrow = false;
      fireEvent.press(getByText('Try again'));

      expect(getByText('Recovered')).toBeTruthy();
    });
  });
});
