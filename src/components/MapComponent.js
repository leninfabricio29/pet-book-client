import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../utils/GoogleMapsContext';

const MapComponent = ({ location, onMapClick }) => {
  const isLoaded = useGoogleMaps();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '300px' }}
      zoom={14}
      center={location || { lat: -3.995243427510733, lng: -79.20306663461281 }}
      onClick={onMapClick}
    >
      {location && <Marker position={location} />}
    </GoogleMap>
  );
};

export default MapComponent;
