export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationSuggestion {
  /** Human-readable label shown in the dropdown */
  displayName: string;
  /** Compact form stored as birth_location */
  shortName: string;
}

/**
 * Autocomplete city/town search using Nominatim (same service as geocodeLocation).
 * Filters to populated places only (featureClass=P).
 * Caller must debounce — Nominatim allows 1 req/sec.
 * Returns [] on any failure so the input degrades to free-text gracefully.
 */
export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?q=${encodeURIComponent(trimmed)}&format=json&limit=6&featureClass=P&addressdetails=1`;

    const response = await fetch(url, {
      signal,
      headers: { 'User-Agent': 'MagicMystics/1.0', Accept: 'application/json' },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    const seen = new Set<string>();
    const results: LocationSuggestion[] = [];

    for (const item of data) {
      const addr = (item.address ?? {}) as Record<string, string>;
      const city =
        addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? '';
      const state = addr.state ?? addr.province ?? addr.region ?? '';
      const country = addr.country ?? '';

      const displayName = [city, state, country].filter(Boolean).join(', ')
        || (item.display_name as string);

      if (!displayName || seen.has(displayName)) continue;
      seen.add(displayName);
      results.push({ displayName, shortName: displayName });
    }

    return results;
  } catch {
    return [];
  }
}

/**
 * Geocode a location string to lat/lng using OpenStreetMap Nominatim.
 * Returns null if geocoding fails or no results are found — callers must
 * handle null gracefully and never block the user on this.
 */
export async function geocodeLocation(location: string): Promise<Coordinates | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MagicMystics/1.0',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    if (isNaN(lat) || isNaN(lng)) return null;

    return { lat, lng };
  } catch {
    return null;
  }
}

/**
 * Look up the IANA timezone for a set of coordinates using timeapi.io.
 * Returns null on failure — callers must never block the user on this.
 * Example return value: "America/New_York"
 */
export async function getTimezone(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lng}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.timeZone === 'string' ? data.timeZone : null;
  } catch {
    return null;
  }
}
