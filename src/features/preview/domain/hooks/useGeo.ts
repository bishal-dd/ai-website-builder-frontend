import { useEffect, useState } from "react";

export function useGeo() {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => setCountry(data.country_code || "US"))
      .catch(() => setCountry("US"));
  }, []);

  return country;
}
