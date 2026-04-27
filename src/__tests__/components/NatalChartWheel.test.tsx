import React from 'react';
import { render } from '@testing-library/react-native';
import { NatalChartWheel } from '@components/ui/NatalChartWheel';
import type { StoredNatalChart } from '@lib/astrology/natal-chart';

jest.mock('react-native-svg', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text: RNText } = require('react-native');
  const passThrough = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children ?? null);
  return {
    __esModule: true,
    default: passThrough,
    Svg: passThrough,
    Circle: () => null,
    Path: () => null,
    Line: () => null,
    Text: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(RNText, null, children ?? null),
    G: passThrough,
  };
});

const FULL_CHART: StoredNatalChart = {
  computedAt: '2024-06-15T12:00:00Z',
  ascendant: 15,
  midheaven: 285,
  planets: [
    { name: 'Sun', glyph: '☉', longitude: 84, sign: 'Gemini', degree: 24, minute: 10 },
    { name: 'Moon', glyph: '☽', longitude: 210, sign: 'Scorpio', degree: 0, minute: 44 },
    { name: 'Mercury', glyph: '☿', longitude: 72, sign: 'Gemini', degree: 12, minute: 5 },
    { name: 'Venus', glyph: '♀', longitude: 47, sign: 'Taurus', degree: 17, minute: 33 },
    { name: 'Mars', glyph: '♂', longitude: 310, sign: 'Aquarius', degree: 10, minute: 0 },
    { name: 'Jupiter', glyph: '♃', longitude: 155, sign: 'Virgo', degree: 5, minute: 20 },
    { name: 'Saturn', glyph: '♄', longitude: 330, sign: 'Pisces', degree: 0, minute: 15 },
    { name: 'Uranus', glyph: '♅', longitude: 19, sign: 'Aries', degree: 19, minute: 8 },
    { name: 'Neptune', glyph: '♆', longitude: 355, sign: 'Pisces', degree: 25, minute: 0 },
    { name: 'Pluto', glyph: '♇', longitude: 270, sign: 'Capricorn', degree: 0, minute: 0 },
  ],
};

describe('NatalChartWheel', () => {
  it('renders without error with a full chart', () => {
    expect(() =>
      render(<NatalChartWheel chart={FULL_CHART} size={300} showOuterPlanets />)
    ).not.toThrow();
  });

  it('renders without error when ascendant and midheaven are null', () => {
    const noAngles: StoredNatalChart = { ...FULL_CHART, ascendant: null, midheaven: null };
    expect(() =>
      render(<NatalChartWheel chart={noAngles} size={300} showOuterPlanets />)
    ).not.toThrow();
  });

  it('renders without error when showOuterPlanets is false', () => {
    expect(() =>
      render(<NatalChartWheel chart={FULL_CHART} size={300} showOuterPlanets={false} />)
    ).not.toThrow();
  });

  it('renders all planet glyphs', () => {
    const { getByText } = render(
      <NatalChartWheel chart={FULL_CHART} size={300} showOuterPlanets />
    );
    for (const planet of FULL_CHART.planets) {
      expect(getByText(planet.glyph)).toBeTruthy();
    }
  });

  it('renders the free planet glyphs when showOuterPlanets is false', () => {
    const { getByText } = render(
      <NatalChartWheel chart={FULL_CHART} size={300} showOuterPlanets={false} />
    );
    // Free planets are still rendered (just at reduced opacity in the real component)
    const freePlanets = FULL_CHART.planets.filter(p =>
      ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(p.name)
    );
    for (const planet of freePlanets) {
      expect(getByText(planet.glyph)).toBeTruthy();
    }
  });

  it('renders all 12 zodiac sign glyphs in the wheel', () => {
    const { getByText } = render(
      <NatalChartWheel chart={FULL_CHART} size={300} showOuterPlanets />
    );
    const SIGN_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    for (const glyph of SIGN_GLYPHS) {
      expect(getByText(glyph)).toBeTruthy();
    }
  });

  it('accepts different sizes without error', () => {
    expect(() =>
      render(<NatalChartWheel chart={FULL_CHART} size={200} showOuterPlanets />)
    ).not.toThrow();
    expect(() =>
      render(<NatalChartWheel chart={FULL_CHART} size={400} showOuterPlanets />)
    ).not.toThrow();
  });

  it('handles an empty planets array', () => {
    const emptyChart: StoredNatalChart = { ...FULL_CHART, planets: [] };
    expect(() =>
      render(<NatalChartWheel chart={emptyChart} size={300} showOuterPlanets />)
    ).not.toThrow();
  });
});
