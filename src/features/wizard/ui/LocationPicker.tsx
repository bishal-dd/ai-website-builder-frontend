"use client";

import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import _ from "lodash";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
};

const defaultCenter = { lat: 27.4728, lng: 89.6393 };

const MAP_OPTIONS: google.maps.MapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: "greedy",
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
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null,
  );

  const mapRef = useRef<google.maps.Map | null>(null);

  const debouncedSelect = useMemo(
    () =>
      _.debounce((lat: number, lng: number) => {
        onLocationSelect(lat, lng);
      }, 200),
    [onLocationSelect],
  );

  useEffect(() => {
    return () => debouncedSelect.cancel();
  }, [debouncedSelect]);

  const handleLocationUpdate = useCallback(
    (newLat: number, newLng: number) => {
      setMarker({ lat: newLat, lng: newLng });
      debouncedSelect(newLat, newLng);
    },
    [debouncedSelect],
  );

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        handleLocationUpdate(lat, lng);
        mapRef.current?.panTo({ lat, lng });
      }
    },
    [handleLocationUpdate],
  );

  useEffect(() => {
    if (!marker && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          handleLocationUpdate(latitude, longitude);
          mapRef.current?.setZoom(15);
        },
        undefined,
        { enableHighAccuracy: true },
      );
    }
  }, [marker, handleLocationUpdate]);

  if (loadError)
    return (
      <div className="h-[300px] flex items-center justify-center border rounded-md">
        Error loading maps
      </div>
    );
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
      options={MAP_OPTIONS}
    >
      {marker && (
        <MarkerF
          position={marker}
          draggable
          onDragEnd={(e) => {
            if (e.latLng) handleLocationUpdate(e.latLng.lat(), e.latLng.lng());
          }}
        />
      )}
    </GoogleMap>
  );
}
