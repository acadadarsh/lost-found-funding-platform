
import { useState, useEffect } from "react";

type GeolocationState = {
  position: {
    lat: number;
    lng: number;
  } | null;
  address: string;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    address: "",
    accuracy: null,
    loading: true,
    error: null,
  });

  // Watch position
  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser"
      }));
      return;
    }
    
    // Start watching position
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setState(prev => ({
          ...prev,
          position: {
            lat: latitude,
            lng: longitude,
          },
          accuracy,
          loading: false,
          error: null,
        }));
        
        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            setState(prev => ({
              ...prev,
              address: data.display_name
            }));
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for geolocation";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    
    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  
  return state;
}
