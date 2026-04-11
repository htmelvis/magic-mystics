import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UpgradeSheet } from '@components/ui/UpgradeSheet';

describe('UpgradeSheet', () => {
  const baseProps = {
    isVisible: true,
    onClose: jest.fn(),
    onUpgradePress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when visible', () => {
    it('renders the title and subtitle', () => {
      const { getByText } = render(<UpgradeSheet {...baseProps} />);
      expect(getByText('Keep Your Full History')).toBeTruthy();
      expect(getByText(/Free accounts store 30 days/)).toBeTruthy();
    });

    it('renders all feature list items', () => {
      const { getByText } = render(<UpgradeSheet {...baseProps} />);
      expect(getByText('Unlimited reading history')).toBeTruthy();
      expect(getByText('Past / Present / Future spreads')).toBeTruthy();
      expect(getByText('AI insights with your personal context')).toBeTruthy();
      expect(getByText('Priority support')).toBeTruthy();
    });

    it('shows the price', () => {
      const { getByText } = render(<UpgradeSheet {...baseProps} />);
      expect(getByText('$49')).toBeTruthy();
      expect(getByText(' / year')).toBeTruthy();
    });

    it('renders the upgrade button with correct label', () => {
      const { getByText } = render(<UpgradeSheet {...baseProps} />);
      expect(getByText('Upgrade Now')).toBeTruthy();
    });

    it('renders the maybe later button', () => {
      const { getByText } = render(<UpgradeSheet {...baseProps} />);
      expect(getByText('Maybe Later')).toBeTruthy();
    });

    it('calls onUpgradePress when upgrade button is tapped', () => {
      const { getByText } = render(<UpgradeSheet {...baseProps} />);
      fireEvent.press(getByText('Upgrade Now'));
      expect(baseProps.onUpgradePress).toHaveBeenCalledTimes(1);
    });

    it('calls onClose (via dismiss) when Maybe Later is tapped', () => {
      const { getByText } = render(<UpgradeSheet {...baseProps} />);
      fireEvent.press(getByText('Maybe Later'));
      expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('isPurchasing state', () => {
    it('shows an ActivityIndicator instead of "Upgrade Now" text', () => {
      const { queryByText, getByLabelText } = render(
        <UpgradeSheet {...baseProps} isPurchasing />
      );
      expect(queryByText('Upgrade Now')).toBeNull();
      // The button has accessibilityLabel with busy state
      expect(
        getByLabelText('Upgrade to Premium for $49 per year')
      ).toBeTruthy();
    });

    it('does not call onUpgradePress when tapped while purchasing', () => {
      const { getByLabelText } = render(
        <UpgradeSheet {...baseProps} isPurchasing />
      );
      fireEvent.press(getByLabelText('Upgrade to Premium for $49 per year'));
      expect(baseProps.onUpgradePress).not.toHaveBeenCalled();
    });
  });

  describe('when not visible', () => {
    it('renders without error', () => {
      expect(() =>
        render(<UpgradeSheet {...baseProps} isVisible={false} />)
      ).not.toThrow();
    });
  });
});
