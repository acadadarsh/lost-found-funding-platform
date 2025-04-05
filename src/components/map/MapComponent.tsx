
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ItemType } from "@/lib/types";
import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

type MapProps = {
  items?: ItemType[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showItemInfo?: boolean;
  singleItem?: ItemType;
  onMarkerClick?: (item: ItemType) => void;
  showUserLocation?: boolean;
};

// Updated with the actual Mapbox access token
const MAPBOX_TOKEN = "pk.eyJ1IjoiMjRzY3NlMTA0MDY0MSIsImEiOiJjbTkzNGp4d3EwZzVoMmtzOGhyODd2cWI2In0.Y6umu0jYXbXjdmVOjdAbHQ";

const MapComponent = ({ 
  items = [], 
  center, 
  zoom = 13, 
  height = "500px",
  showItemInfo = true,
  singleItem,
  onMarkerClick,
  showUserLocation = true
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initialCenter = center || { lng: -73.969, lat: 40.7590 };
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Changed to dark style for pixelated theme
      center: [initialCenter.lng, initialCenter.lat],
      zoom: zoom
    });

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    mapInstance.on('load', () => {
      console.log("Map loaded successfully");
      setMapLoaded(true);
      map.current = mapInstance;
    });

    return () => {
      mapInstance?.remove();
      map.current = null;
    };
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (map.current && center) {
      console.log("Flying to center:", center);
      map.current.flyTo({
        center: [center.lng, center.lat],
        zoom: zoom,
        essential: true
      });
    }
  }, [center, zoom]);

  // Get and show user location
  useEffect(() => {
    if (!map.current || !mapLoaded || !showUserLocation) return;

    // Get user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location found:", latitude, longitude);
        setUserLocation({ lat: latitude, lng: longitude });
        
        // If center is not provided externally, center on user location
        if (!center && map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: zoom,
            essential: true
          });
        }

        // Add user location marker
        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.remove();
        }

        // Create user location marker element
        const userMarkerEl = document.createElement('div');
        userMarkerEl.className = 'user-location-marker';
        userMarkerEl.innerHTML = `
          <div class="pixelated-user-marker">
            <div class="inner-pulse"></div>
          </div>
        `;
        
        // Add user location marker
        if (map.current) {
          userLocationMarkerRef.current = new mapboxgl.Marker(userMarkerEl)
            .setLngLat([longitude, latitude])
            .addTo(map.current);
          console.log("User location marker added");
        }
      },
      (error) => {
        console.error('Error getting user location:', error.message);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 
      }
    );
  }, [mapLoaded, showUserLocation, center, zoom]);

  // Handle markers for items
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Add markers for all items or single item
    const displayItems = singleItem ? [singleItem] : items;
    
    console.log("Adding markers for items:", displayItems.length);
    
    displayItems.forEach(item => {
      if (!item.location?.lat || !item.location?.lng) {
        console.warn("Item missing location data:", item.id, item.location);
        return;
      }
      
      const lat = parseFloat(String(item.location.lat));
      const lng = parseFloat(String(item.location.lng));
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn("Invalid location coordinates:", item.id, item.location);
        return;
      }
      
      console.log(`Adding marker for item ${item.id} at position:`, lat, lng);
      
      // Create marker element with pixelated style
      const markerEl = document.createElement('div');
      markerEl.className = 'marker-element';
      
      const markerColor = 
        item.status === 'lost' ? '#ef4444' : 
        item.status === 'found' ? '#10b981' : 
        '#6b7280';
      
      markerEl.innerHTML = `
        <div class="pixelated-marker" style="background-color: ${markerColor};">
        </div>
      `;
      
      // Add marker to map
      if (map.current) {
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([lng, lat])
          .addTo(map.current);
        
        // Add click handler
        markerEl.addEventListener('click', () => {
          console.log("Marker clicked for item:", item.id);
          if (onMarkerClick) {
            onMarkerClick(item);
          } else {
            setSelectedItem(item);
          }
        });
        
        markersRef.current[item.id] = marker;
      }
    });
  }, [items, singleItem, mapLoaded]);

  // Render info panel for selected item
  const renderItemInfo = () => {
    if (!selectedItem || !showItemInfo) return null;
    
    return (
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-40 w-[300px] max-w-[90%]">
        <Card className="overflow-hidden border-2 border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] bg-black/70 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-start">
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded border-2 border-white/30">
                <img 
                  src={selectedItem.imageUrl || "/placeholder.svg"} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover pixelated"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <Link to={`/item/${selectedItem.id}`} className="font-mono text-sm text-white hover:text-primary">
                    {selectedItem.title}
                  </Link>
                  <Badge className={`
                    font-mono uppercase text-[10px] font-bold
                    ${selectedItem.status === 'lost' ? 'bg-lost text-black' :
                      selectedItem.status === 'found' ? 'bg-found text-black' : 
                      'bg-gray-500'}`}
                  >
                    {selectedItem.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-300 mt-1 font-mono">{selectedItem.location.address}</p>
                {selectedItem.reward && (
                  <p className="text-xs font-bold text-lost mt-1 font-mono">Reward: ${selectedItem.reward}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="relative w-full rounded-none sm:rounded-lg overflow-hidden border-2 border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.3)]" style={{ height }}>
      <div 
        ref={mapContainer} 
        className="absolute inset-0 bg-gray-900"
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <div className="pixelated-spinner"></div>
            <p className="text-white font-mono mt-4">Loading map...</p>
          </div>
        </div>
      )}
      
      {renderItemInfo()}
    </div>
  );
};

export default MapComponent;
