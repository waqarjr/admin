'use client'
import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const defaultCenter = { lat: 31.488189754248967, lng: 74.37977575144312 };

const Page = () => {
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const intiMap = async () => {
    const { PlaceAutocompleteElement } = await google.maps.importLibrary('places');
    
    if (autocompleteRef.current && !autocompleteRef.current.hasChildNodes()) {
      const placeAutocomplete = new PlaceAutocompleteElement();
      autocompleteRef.current.appendChild(placeAutocomplete);

      placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
         const place = placePrediction.toPlace();
        const data = await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
        setSelectedLocation(data.place.Wh.location)
      });
    }
  };

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        if (typeof google === 'undefined') {
          console.log('Google Maps API not yet loaded');
          return;
        }
        intiMap();
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    };

    const timer = setTimeout(initAutocomplete, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <APIProvider 
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY } onLoad={() => console.log('Maps API has loaded.')}>
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for a place:
            </label>
            <div ref={autocompleteRef} className="w-full"></div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Map
              style={{ width: '100%', height: '500px' }}
              center={selectedLocation}
              defaultZoom={13}
              onClick={(e) => setSelectedLocation(e.detail.latLng)}
              mapId='a6915df86e63079af52318e6' ref={mapRef}>
              <AdvancedMarker position={selectedLocation} />
            </Map>

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
      </APIProvider>
    </div>
  );
};

export default Page;