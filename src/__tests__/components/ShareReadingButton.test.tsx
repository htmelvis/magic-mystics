import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ShareReadingButton } from '@components/tarot/ShareReadingButton';
import type { TarotCardRow } from '@/types/tarot';

const mockShare = jest.fn();
let mockIsSharing = false;

jest.mock('@hooks/useShareReading', () => ({
  useShareReading: () => ({ share: mockShare, isSharing: mockIsSharing }),
}));

const MOCK_CARD: TarotCardRow = {
  id: 1,
  name: 'The Tower',
  arcana: 'Major',
  suit: null,
  number: 16,
  image_url: null,
  element: null,
  astrology_association: null,
  upright_summary: null,
  reversed_summary: null,
  upright_meaning_long: null,
  reversed_meaning_long: null,
  keywords_upright: null,
  keywords_reversed: null,
};

describe('ShareReadingButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsSharing = false;
  });

  it('renders the share label and glyph', () => {
    const { getByText } = render(
      <ShareReadingButton
        readingId="abc-123"
        card={MOCK_CARD}
        orientation="upright"
        insight={null}
      />
    );
    expect(getByText('Share Reading')).toBeTruthy();
    expect(getByText('↗')).toBeTruthy();
  });

  it('calls share with the correct arguments when pressed', () => {
    const { getByLabelText } = render(
      <ShareReadingButton
        readingId="abc-123"
        card={MOCK_CARD}
        orientation="upright"
        insight={null}
      />
    );
    fireEvent.press(getByLabelText('Share this reading'));
    expect(mockShare).toHaveBeenCalledTimes(1);
    expect(mockShare).toHaveBeenCalledWith({
      readingId: 'abc-123',
      card: MOCK_CARD,
      orientation: 'upright',
      insight: null,
    });
  });

  it('shows an ActivityIndicator and hides label while sharing', () => {
    mockIsSharing = true;
    const { queryByText, getByLabelText } = render(
      <ShareReadingButton
        readingId="abc-123"
        card={MOCK_CARD}
        orientation="upright"
        insight={null}
      />
    );
    expect(queryByText('Share Reading')).toBeNull();
    // Button is still accessible but disabled
    expect(getByLabelText('Share this reading')).toBeTruthy();
  });

  it('does not call share while isSharing is true (button is disabled)', () => {
    mockIsSharing = true;
    const { getByLabelText } = render(
      <ShareReadingButton
        readingId="abc-123"
        card={MOCK_CARD}
        orientation="upright"
        insight={null}
      />
    );
    fireEvent.press(getByLabelText('Share this reading'));
    expect(mockShare).not.toHaveBeenCalled();
  });
});
