export async function getUserCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error(`Geo API error: ${res.status}`);
    const data = await res.json();
    console.log("Geo API response:", data); // debug
    return data.country_code?.toUpperCase() || "BT"; // fallback to Bhutan
  } catch (e) {
    console.error("Location detection failed:", e);
    return "BT"; // fallback
  }
}
