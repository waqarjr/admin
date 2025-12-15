'use client'
import { useState, useCallback,useRef } from 'react';
import { GoogleMap, useLoadScript,Autocomplete , Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '500px'};

const defaultCenter = { lat: 31.488189754248967, lng: 74.37977575144312 };

export const  page = () => {
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const onMapClick = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setSelectedLocation(newLocation);
  }, []);

    const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const newLocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setSelectedLocation(newLocation);
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="p-4">
      <div className="border rounded-lg overflow-hidden">
      <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged} >
        <input type="text" placeholder="Search location..." className="border p-2 rounded-md w-80 mt-4" />
      </Autocomplete>
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
export default page