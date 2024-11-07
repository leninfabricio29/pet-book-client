
import React, { createContext, useContext, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBJV8sX5ObZJB4V0gy6ILSqjEcVOYOMcZ4"
      onLoad={() => setIsLoaded(true)}
    >
      <GoogleMapsContext.Provider value={isLoaded}>
        {children}
      </GoogleMapsContext.Provider>
    </LoadScript>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
