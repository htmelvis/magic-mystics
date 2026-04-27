import { searchLocations } from '@lib/geocoding/geocode';

function mockNominatim(results: unknown) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(results),
    }),
  ) as unknown as typeof fetch;
}

describe('searchLocations', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns short-circuit for queries under 2 chars', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const results = await searchLocations('a');
    expect(results).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns an empty array when fetch rejects', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('network'))) as unknown as typeof fetch;
    const results = await searchLocations('California');
    expect(results).toEqual([]);
  });

  it('returns state-level matches (no featureClass filter)', async () => {
    mockNominatim([
      {
        display_name: 'California, United States',
        lat: '36.7783',
        lon: '-119.4179',
        address: { state: 'California', country: 'United States' },
      },
    ]);

    const results = await searchLocations('California');
    expect(results).toHaveLength(1);
    expect(results[0].displayName).toBe('California, United States');
    expect(results[0].lat).toBeCloseTo(36.7783, 3);
    expect(results[0].lng).toBeCloseTo(-119.4179, 3);
  });

  it('returns country-level matches when only a country name is typed', async () => {
    mockNominatim([
      {
        display_name: 'France',
        lat: '46.6034',
        lon: '1.8883',
        address: { country: 'France' },
      },
    ]);

    const results = await searchLocations('France');
    expect(results).toHaveLength(1);
    expect(results[0].displayName).toBe('France');
    expect(results[0].lat).toBeCloseTo(46.6034, 3);
    expect(results[0].lng).toBeCloseTo(1.8883, 3);
  });

  it('includes city-level results with state and country', async () => {
    mockNominatim([
      {
        display_name: 'Los Angeles, Los Angeles County, California, United States',
        lat: '34.0537',
        lon: '-118.2428',
        address: {
          city: 'Los Angeles',
          county: 'Los Angeles County',
          state: 'California',
          country: 'United States',
        },
      },
    ]);

    const results = await searchLocations('Los Angeles');
    expect(results[0].displayName).toBe('Los Angeles, California, United States');
    expect(results[0].lat).toBeCloseTo(34.0537, 3);
  });

  it('falls back to county when city/town/village are missing', async () => {
    mockNominatim([
      {
        display_name: 'Somewhere, Some County, Texas',
        lat: '31.5',
        lon: '-99.5',
        address: {
          county: 'Some County',
          state: 'Texas',
          country: 'United States',
        },
      },
    ]);

    const results = await searchLocations('Somewhere');
    expect(results[0].displayName).toBe('Some County, Texas, United States');
  });

  it('skips results with non-numeric lat/lon', async () => {
    mockNominatim([
      {
        display_name: 'Bad Row',
        lat: 'not-a-number',
        lon: 'nope',
        address: { city: 'Bad Row' },
      },
      {
        display_name: 'Good Row, Country',
        lat: '10',
        lon: '20',
        address: { city: 'Good Row', country: 'Country' },
      },
    ]);

    const results = await searchLocations('row');
    expect(results).toHaveLength(1);
    expect(results[0].displayName).toBe('Good Row, Country');
  });

  it('dedupes by displayName', async () => {
    mockNominatim([
      {
        display_name: 'Paris, France',
        lat: '48.85',
        lon: '2.35',
        address: { city: 'Paris', country: 'France' },
      },
      {
        display_name: 'Paris (duplicate)',
        lat: '48.86',
        lon: '2.36',
        address: { city: 'Paris', country: 'France' },
      },
    ]);

    const results = await searchLocations('Paris');
    expect(results).toHaveLength(1);
  });
});
