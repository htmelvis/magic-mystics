export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Geocode a location string to lat/lng using OpenStreetMap Nominatim.
 * Returns null if geocoding fails or no results are found — callers must
 * handle null gracefully and never block the user on this.
 */
export async function geocodeLocation(location: string): Promise<Coordinates | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MagicMystics/1.0',
        Accept: 'application/json',
      },
    });

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
