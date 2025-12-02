"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface GeoContextType {
  country: string;
  loading: boolean;
}

const GeoContext = createContext<GeoContextType | undefined>(undefined);

export const GeoProvider = ({ children }: { children: ReactNode }) => {
  const [country, setCountry] = useState("US");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => setCountry(data.country_code || "US"))
      .catch(() => setCountry("US"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <GeoContext.Provider value={{ country, loading }}>
      {children}
    </GeoContext.Provider>
  );
};

export const useGeo = () => {
  const context = useContext(GeoContext);
  if (!context) throw new Error("useGeo must be used within GeoProvider");
  return context;
};
