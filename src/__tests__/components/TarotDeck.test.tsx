import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TarotDeck } from '@components/tarot/TarotDeck';
import { VISIBLE_DECK_SIZE } from '@components/tarot/card-constants';

describe('TarotDeck', () => {
  it('renders without error with no props', () => {
    expect(() => render(<TarotDeck />)).not.toThrow();
  });

  it('shows the card count label when cardCount is provided', () => {
    const { getByText } = render(<TarotDeck cardCount={42} />);
    expect(getByText('42 cards remaining')).toBeTruthy();
  });

  it('does not render a count label when cardCount is omitted', () => {
    const { queryByText } = render(<TarotDeck />);
    expect(queryByText(/cards remaining/)).toBeNull();
  });

  it(`renders ${VISIBLE_DECK_SIZE} pressable deck cards`, () => {
    const { getAllByRole } = render(<TarotDeck />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(VISIBLE_DECK_SIZE);
  });

  it('calls onDraw when the top deck card is pressed', () => {
    const onDraw = jest.fn();
    const { getAllByRole } = render(<TarotDeck onDraw={onDraw} />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[buttons.length - 1]);
    expect(onDraw).toHaveBeenCalledTimes(1);
  });

  it('does not call onDraw when a non-top card is pressed', () => {
    const onDraw = jest.fn();
    const { getAllByRole } = render(<TarotDeck onDraw={onDraw} />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(onDraw).not.toHaveBeenCalled();
  });

  it('calls onShuffle when shuffleOnMount fires', () => {
    jest.useFakeTimers();
    const onShuffle = jest.fn();
    render(<TarotDeck shuffleOnMount onShuffle={onShuffle} />);
    jest.advanceTimersByTime(400);
    expect(onShuffle).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
