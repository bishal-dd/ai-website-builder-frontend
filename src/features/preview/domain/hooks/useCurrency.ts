"use client";

import { useState, useEffect } from "react";

interface CurrencyInfo {
  code: string;
  symbol: string;
  exchangeRate: number;
}

const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  US: { code: "USD", symbol: "$", exchangeRate: 1 },
  GB: { code: "GBP", symbol: "£", exchangeRate: 0.79 },
  EU: { code: "EUR", symbol: "€", exchangeRate: 0.92 },
  IN: { code: "INR", symbol: "₹", exchangeRate: 83.12 },
  AU: { code: "AUD", symbol: "A$", exchangeRate: 1.52 },
  CA: { code: "CAD", symbol: "C$", exchangeRate: 1.36 },
  JP: { code: "JPY", symbol: "¥", exchangeRate: 149.5 },
  // Add more countries as needed
};

export function useCurrency() {
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(
    CURRENCY_MAP.US
  );
  const [countryCode, setCountryCode] = useState<string>("US");

  useEffect(() => {
    // Try to detect user's country from browser/IP
    // This is a simplified version - in production, use a proper geolocation API
    const detectCountry = async () => {
      try {
        // You can use services like ipapi.co or similar
        // For now, we'll use a default
        const detectedCode = "US"; // Replace with actual detection
        setCountryCode(detectedCode);
        setCurrencyInfo(CURRENCY_MAP[detectedCode] || CURRENCY_MAP.US);
      } catch (error) {
        console.error("Failed to detect country:", error);
      }
    };

    detectCountry();
  }, []);

  const convertPrice = (priceInUSD: number): number => {
    return Number.parseFloat(
      (priceInUSD * currencyInfo.exchangeRate).toFixed(2)
    );
  };

  const formatPrice = (price: number): string => {
    return `${currencyInfo.symbol}${price.toFixed(2)}`;
  };

  return {
    currencyInfo,
    countryCode,
    setCountryCode,
    convertPrice,
    formatPrice,
  };
}
