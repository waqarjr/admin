'use client'
import { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '500px'};

const defaultCenter = { lat: 31.488189754248967, lng: 74.37977575144312 };

export default function page() {
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const onMapClick = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setSelectedLocation(newLocation);
  }, []);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="p-4">
      <div className="border rounded-lg overflow-hidden">
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={selectedLocation} onClick={onMapClick}>
          <Marker position={selectedLocation} />
        </GoogleMap>
        <div className="p-4 bg-white border-t">
          <p className="text-sm text-gray-600">Selected Coordinates:</p>
          <p className="font-mono text-sm mt-1">
            Latitude: {selectedLocation.lat.toFixed(6)}
          </p>
          <p className="font-mono text-sm">
            Longitude: {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}