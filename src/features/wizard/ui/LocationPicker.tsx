"use client";

import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import _ from "lodash";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 27.4728,
  lng: 89.6393,
};

export function LocationPicker({
  lat,
  lng,
  onLocationSelect,
}: {
  lat: number | null;
  lng: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null,
  );

  const mapRef = useRef<google.maps.Map | null>(null);

  // Debounced update so store isn't spammed while dragging
  const debouncedSelect = useCallback(
    _.debounce((lat: number, lng: number) => {
      onLocationSelect(lat, lng);
    }, 200),
    [onLocationSelect],
  );

  // Map click handler
  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setMarker({ lat: newLat, lng: newLng });

        // Center map on new marker
        mapRef.current?.panTo({ lat: newLat, lng: newLng });

        debouncedSelect(newLat, newLng);
      }
    },
    [debouncedSelect],
  );

  // Auto-detect user location on load
  useEffect(() => {
    if (!marker && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarker({ lat: latitude, lng: longitude });
          mapRef.current?.panTo({ lat: latitude, lng: longitude });
          mapRef.current?.setZoom(15);
          onLocationSelect(latitude, longitude);
        },
        () => {
          // fallback to defaultCenter if geolocation fails
        },
      );
    }
  }, [marker, onLocationSelect]);

  if (!isLoaded) return <Skeleton className="h-[300px] w-full" />;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={marker || defaultCenter}
      zoom={marker ? 15 : 7}
      onClick={onMapClick}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {marker && (
        <MarkerF
          position={marker}
          draggable
          onDragEnd={(e) => {
            if (e.latLng) {
              const newLat = e.latLng.lat();
              const newLng = e.latLng.lng();
              setMarker({ lat: newLat, lng: newLng });
              debouncedSelect(newLat, newLng);
            }
          }}
        />
      )}
    </GoogleMap>
  );
}
