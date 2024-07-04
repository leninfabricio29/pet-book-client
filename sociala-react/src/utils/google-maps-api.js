import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const GoogleMapsAPI = ({ googleMapsApiKey, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      {isLoaded && children}
    </LoadScript>
  );
};

export default GoogleMapsAPI;
