"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getUserCountry } from "../api/geo";
import * as RPNInput from "react-phone-number-input";

interface GeoContextType {
  country: RPNInput.Country;
  loading: boolean;
}

const GeoContext = createContext<GeoContextType | undefined>(undefined);

export const GeoProvider = ({ children }: { children: ReactNode }) => {
  const [country, setCountry] = useState<RPNInput.Country>("US");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const countryCode = await getUserCountry();
        setCountry(countryCode);
      } catch {
        setCountry("US");
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
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
