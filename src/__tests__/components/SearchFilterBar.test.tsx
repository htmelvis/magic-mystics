import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchFilterBar } from '@components/history/SearchFilterBar';
import type { DateRangeFilter, SpreadFilter } from '@hooks/useFilteredReadings';

function defaultProps(overrides: Partial<Parameters<typeof SearchFilterBar>[0]> = {}) {
  return {
    query: '',
    onChangeSearch: jest.fn(),
    clearSearch: jest.fn(),
    spreadFilter: 'all' as SpreadFilter,
    setSpreadFilter: jest.fn(),
    dateRangeFilter: 'all' as DateRangeFilter,
    setDateRangeFilter: jest.fn(),
    clearAllFilters: jest.fn(),
    resultCount: 10,
    totalCount: 10,
    ...overrides,
  };
}

describe('SearchFilterBar', () => {
  describe('search input', () => {
    it('renders the search input', () => {
      const { getByLabelText } = render(<SearchFilterBar {...defaultProps()} />);
      expect(getByLabelText('Search readings')).toBeTruthy();
    });

    it('calls onChangeSearch when text changes', () => {
      const onChangeSearch = jest.fn();
      const { getByLabelText } = render(<SearchFilterBar {...defaultProps({ onChangeSearch })} />);
      fireEvent.changeText(getByLabelText('Search readings'), 'tower');
      expect(onChangeSearch).toHaveBeenCalledWith('tower');
    });

    it('hides the clear button when query is empty', () => {
      const { queryByLabelText } = render(<SearchFilterBar {...defaultProps()} />);
      expect(queryByLabelText('Clear search')).toBeNull();
    });

    it('shows the clear button when query is non-empty', () => {
      const { getByLabelText } = render(<SearchFilterBar {...defaultProps({ query: 'moon' })} />);
      expect(getByLabelText('Clear search')).toBeTruthy();
    });

    it('calls clearSearch when clear button is pressed', () => {
      const clearSearch = jest.fn();
      const { getByLabelText } = render(
        <SearchFilterBar {...defaultProps({ query: 'moon', clearSearch })} />
      );
      fireEvent.press(getByLabelText('Clear search'));
      expect(clearSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('filter drawer', () => {
    it('is closed by default', () => {
      const { queryByText } = render(<SearchFilterBar {...defaultProps()} />);
      expect(queryByText('Spread Type')).toBeNull();
      expect(queryByText('Time Range')).toBeNull();
    });

    it('opens when the Filters toggle is pressed', () => {
      const { getByLabelText, getByText } = render(<SearchFilterBar {...defaultProps()} />);
      fireEvent.press(getByLabelText('Show filters'));
      expect(getByText('Spread Type')).toBeTruthy();
      expect(getByText('Time Range')).toBeTruthy();
    });

    it('shows all spread filter chips when open', () => {
      const { getByLabelText, getByText } = render(<SearchFilterBar {...defaultProps()} />);
      fireEvent.press(getByLabelText('Show filters'));
      expect(getByText('All')).toBeTruthy();
      expect(getByText('Daily Draw')).toBeTruthy();
      expect(getByText('3-Card')).toBeTruthy();
    });

    it('shows all date range chips when open', () => {
      const { getByLabelText, getByText } = render(<SearchFilterBar {...defaultProps()} />);
      fireEvent.press(getByLabelText('Show filters'));
      expect(getByText('All Time')).toBeTruthy();
      expect(getByText('Today')).toBeTruthy();
      expect(getByText('This Week')).toBeTruthy();
      expect(getByText('This Month')).toBeTruthy();
    });

    it('calls setSpreadFilter with the selected value when a spread chip is pressed', () => {
      const setSpreadFilter = jest.fn();
      const { getByLabelText } = render(
        <SearchFilterBar {...defaultProps({ setSpreadFilter })} />
      );
      fireEvent.press(getByLabelText('Show filters'));
      fireEvent.press(getByLabelText('Show daily draw readings only'));
      expect(setSpreadFilter).toHaveBeenCalledWith('daily');
    });

    it('calls setDateRangeFilter with the selected value when a date chip is pressed', () => {
      const setDateRangeFilter = jest.fn();
      const { getByLabelText } = render(
        <SearchFilterBar {...defaultProps({ setDateRangeFilter })} />
      );
      fireEvent.press(getByLabelText('Show filters'));
      fireEvent.press(getByLabelText('Show this week'));
      expect(setDateRangeFilter).toHaveBeenCalledWith('this-week');
    });

    it('does not show Clear All when no filters are active', () => {
      const { getByLabelText, queryByLabelText } = render(<SearchFilterBar {...defaultProps()} />);
      fireEvent.press(getByLabelText('Show filters'));
      expect(queryByLabelText('Clear all filters')).toBeNull();
    });

    it('shows Clear All when filters are active', () => {
      const { getByLabelText } = render(
        <SearchFilterBar {...defaultProps({ spreadFilter: 'daily' })} />
      );
      fireEvent.press(getByLabelText('Show filters'));
      expect(getByLabelText('Clear all filters')).toBeTruthy();
    });

    it('calls clearAllFilters and clearSearch when Clear All is pressed', () => {
      const clearAllFilters = jest.fn();
      const clearSearch = jest.fn();
      const { getByLabelText } = render(
        <SearchFilterBar
          {...defaultProps({ spreadFilter: 'daily', clearAllFilters, clearSearch })}
        />
      );
      fireEvent.press(getByLabelText('Show filters'));
      fireEvent.press(getByLabelText('Clear all filters'));
      expect(clearAllFilters).toHaveBeenCalledTimes(1);
      expect(clearSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('active filter badge', () => {
    it('shows no badge when no filters are active', () => {
      const { queryByText } = render(<SearchFilterBar {...defaultProps()} />);
      expect(queryByText('1')).toBeNull();
      expect(queryByText('2')).toBeNull();
    });

    it('shows count 1 when one filter is active', () => {
      const { getByText } = render(
        <SearchFilterBar {...defaultProps({ spreadFilter: 'daily' })} />
      );
      expect(getByText('1')).toBeTruthy();
    });

    it('shows count 2 when both filters are active', () => {
      const { getByText } = render(
        <SearchFilterBar
          {...defaultProps({ spreadFilter: 'daily', dateRangeFilter: 'this-week' })}
        />
      );
      expect(getByText('2')).toBeTruthy();
    });
  });

  describe('result count', () => {
    it('is hidden when neither query nor filters are active', () => {
      const { queryByText } = render(
        <SearchFilterBar {...defaultProps({ resultCount: 10, totalCount: 10 })} />
      );
      expect(queryByText(/Showing/)).toBeNull();
      expect(queryByText(/No readings/)).toBeNull();
    });

    it('shows match count when a query is active', () => {
      const { getByText } = render(
        <SearchFilterBar {...defaultProps({ query: 'fool', resultCount: 3, totalCount: 10 })} />
      );
      expect(getByText('Showing 3 of 10 readings')).toBeTruthy();
    });

    it('uses singular "reading" when totalCount is 1', () => {
      const { getByText } = render(
        <SearchFilterBar {...defaultProps({ query: 'fool', resultCount: 1, totalCount: 1 })} />
      );
      expect(getByText('Showing 1 of 1 reading')).toBeTruthy();
    });

    it('shows "No readings match" when resultCount is 0 while filtering', () => {
      const { getByText } = render(
        <SearchFilterBar {...defaultProps({ query: 'xyzzy', resultCount: 0, totalCount: 10 })} />
      );
      expect(getByText('No readings match your filters')).toBeTruthy();
    });

    it('shows result count when a spread filter is active even without a query', () => {
      const { getByText } = render(
        <SearchFilterBar
          {...defaultProps({ spreadFilter: 'daily', resultCount: 5, totalCount: 10 })}
        />
      );
      expect(getByText('Showing 5 of 10 readings')).toBeTruthy();
    });
  });
});
