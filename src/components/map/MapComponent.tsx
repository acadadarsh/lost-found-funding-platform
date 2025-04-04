
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
};

// You'll need to replace this with your actual Mapbox access token
const MAPBOX_TOKEN = "pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xhbXBsZXRva2VuIn0.1234567890abcdef";

const MapComponent = ({ 
  items = [], 
  center, 
  zoom = 13, 
  height = "500px",
  showItemInfo = true,
  singleItem,
  onMarkerClick
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initialCenter = center || { lng: -73.969, lat: 40.7590 };
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialCenter.lng, initialCenter.lat],
      zoom: zoom
    });

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    mapInstance.on('load', () => {
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
      map.current.flyTo({
        center: [center.lng, center.lat],
        zoom: zoom,
        essential: true
      });
    }
  }, [center, zoom]);

  // Handle markers for items
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Add markers for all items or single item
    const displayItems = singleItem ? [singleItem] : items;
    
    displayItems.forEach(item => {
      if (!item.location?.lat || !item.location?.lng) return;
      
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'marker-element';
      
      const markerColor = 
        item.status === 'lost' ? '#ef4444' : 
        item.status === 'found' ? '#10b981' : 
        '#6b7280';
      
      markerEl.innerHTML = `
        <div style="
          background-color: ${markerColor};
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;
      
      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([item.location.lng, item.location.lat])
        .addTo(map.current);
      
      // Add click handler
      marker.getElement().addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(item);
        } else {
          setSelectedItem(item);
        }
      });
      
      markersRef.current[item.id] = marker;
    });
  }, [items, singleItem, mapLoaded]);

  // Render info panel for selected item
  const renderItemInfo = () => {
    if (!selectedItem || !showItemInfo) return null;
    
    return (
      <div 
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-40"
        style={{
          maxWidth: "90%",
          width: "300px"
        }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start p-2">
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                <img 
                  src={selectedItem.imageUrl || "/placeholder.svg"} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <Link to={`/item/${selectedItem.id}`} className="font-medium text-sm hover:text-primary">
                    {selectedItem.title}
                  </Link>
                  <Badge className={`
                    ${selectedItem.status === 'lost' ? 'bg-lost' :
                      selectedItem.status === 'found' ? 'bg-found' : 
                      'bg-gray-500'}`}
                  >
                    {selectedItem.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{selectedItem.location.address}</p>
                {selectedItem.reward && (
                  <p className="text-xs font-medium text-lost mt-1">Reward: ${selectedItem.reward}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border" style={{ height }}>
      <div 
        ref={mapContainer} 
        className="absolute inset-0 bg-gray-100"
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
      
      {renderItemInfo()}
    </div>
  );
};

export default MapComponent;
