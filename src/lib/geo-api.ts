const API_BASE_URL = "https://api.countrystatecity.in/v1";
const API_KEY = process.env.NEXT_PUBLIC_COUNTRY_API_KEY;

/**
 * Fetches states/provinces for a specific country.
 * @param countryCode - The ISO2 code of the country (e.g., "US", "IN", "BT")
 */
export async function getStates(countryCode: string) {
  if (!countryCode) return [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/countries/${countryCode}/states`,
      {
        headers: {
          "X-CSCAPI-KEY": API_KEY as string,
        },
        // Next.js caching: revalidate this data every 24 hours
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching states: ${response.statusText}`);
    }

    const data = await response.json();

    // Returns array of objects: { id: number, name: string, iso2: string }
    return data;
  } catch (error) {
    console.error("GeoAPI Error:", error);
    return [];
  }
}
