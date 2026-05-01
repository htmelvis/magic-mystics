import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExpiryWarningBanner } from '@components/ui/ExpiryWarningBanner';
import type { ReadingExpiryState } from '@hooks/useReadingExpiry';

const mockDismiss = jest.fn();

function makeExpiry(overrides: Partial<ReadingExpiryState> = {}): ReadingExpiryState {
  return {
    expiringCount: 0,
    daysUntilOldest: null,
    isDismissed: false,
    dismiss: mockDismiss,
    isLoading: false,
    ...overrides,
  };
}

describe('ExpiryWarningBanner', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('renders nothing', () => {
    it('when expiringCount is 0', () => {
      const { toJSON } = render(
        <ExpiryWarningBanner expiry={makeExpiry()} onUpgradePress={jest.fn()} />
      );
      expect(toJSON()).toBeNull();
    });

    it('when isDismissed is true', () => {
      const { toJSON } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 2, daysUntilOldest: 5, isDismissed: true })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(toJSON()).toBeNull();
    });
  });

  describe('copy', () => {
    it('uses singular "reading" for 1 expiring', () => {
      const { getByText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 1, daysUntilOldest: 5 })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(getByText(/1 reading will be removed in 5 days/)).toBeTruthy();
    });

    it('uses plural "readings" for multiple expiring', () => {
      const { getByText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 3, daysUntilOldest: 5 })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(getByText(/3 readings will be removed in 5 days/)).toBeTruthy();
    });

    it('shows "today" when daysUntilOldest is 0', () => {
      const { getByText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 1, daysUntilOldest: 0 })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(getByText(/today/)).toBeTruthy();
    });

    it('shows "tomorrow" when daysUntilOldest is 1', () => {
      const { getByText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 1, daysUntilOldest: 1 })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(getByText(/tomorrow/)).toBeTruthy();
    });

    it('shows "soon" when daysUntilOldest is null', () => {
      const { getByText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 1, daysUntilOldest: null })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(getByText(/soon/)).toBeTruthy();
    });
  });

  describe('urgency', () => {
    it('shows ⚠️ icon when daysUntilOldest <= 2', () => {
      const { getByText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 1, daysUntilOldest: 2 })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(getByText('⚠️')).toBeTruthy();
    });

    it('shows 🕯️ icon when daysUntilOldest > 2', () => {
      const { getByText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 1, daysUntilOldest: 5 })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(getByText('🕯️')).toBeTruthy();
    });

    it('shows 🕯️ icon when daysUntilOldest is null (not urgent)', () => {
      const { getByText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 1, daysUntilOldest: null })}
          onUpgradePress={jest.fn()}
        />
      );
      expect(getByText('🕯️')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls dismiss when the close button is pressed', () => {
      const { getByLabelText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 2, daysUntilOldest: 5 })}
          onUpgradePress={jest.fn()}
        />
      );
      fireEvent.press(getByLabelText('Dismiss expiry warning'));
      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onUpgradePress when the upgrade button is pressed', () => {
      const onUpgradePress = jest.fn();
      const { getByLabelText } = render(
        <ExpiryWarningBanner
          expiry={makeExpiry({ expiringCount: 2, daysUntilOldest: 5 })}
          onUpgradePress={onUpgradePress}
        />
      );
      fireEvent.press(getByLabelText('Upgrade to Premium to keep your full history'));
      expect(onUpgradePress).toHaveBeenCalledTimes(1);
    });
  });
});
