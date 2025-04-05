
import { useState, useEffect } from "react";
import { Navigation } from "lucide-react";
import { ItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import MapComponent from "@/components/map/MapComponent";

type ItemMapProps = {
  items: ItemType[];
  center?: { lat: number; lng: number };
  zoom?: number;
};

const ItemMap = ({ items, center, zoom = 13 }: ItemMapProps) => {
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const { position, loading: geoLoading, error: geoError } = useGeolocation();
  const [mapCenter, setMapCenter] = useState(center);
  const { toast } = useToast();

  // Update map center if geolocation becomes available
  useEffect(() => {
    if (position && !mapCenter) {
      setMapCenter(position);
    }
  }, [position, mapCenter]);

  // Show notification when position updates
  useEffect(() => {
    if (position && !geoLoading && !geoError) {
      // Position updated notification
      toast({
        title: "Location updated",
        description: `Latitude: ${position.lat.toFixed(4)}, Longitude: ${position.lng.toFixed(4)}`,
      });
    }
    
    if (geoError) {
      toast({
        title: "Location error",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [position, geoLoading, geoError, toast]);

  const handleMarkerClick = (item: ItemType) => {
    setSelectedItem(item);
  };

  const handleCenterMap = () => {
    if (!position) {
      toast({
        title: "Cannot center map",
        description: "Your location is not available",
        variant: "destructive",
      });
      return;
    }
    
    setMapCenter(position);
    
    toast({
      title: "Map centered",
      description: "Map centered on your current location",
    });
  };

  return (
    <div className="relative w-full h-[500px]">
      <MapComponent 
        items={items}
        center={mapCenter}
        zoom={zoom}
        onMarkerClick={handleMarkerClick}
        height="500px"
        showUserLocation={true}
      />

      {/* Map controls */}
      <div className="absolute right-4 top-4 z-30">
        <Button 
          variant="default" 
          size="icon"
          className="rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-md"
          onClick={handleCenterMap}
        >
          <Navigation size={18} />
        </Button>
      </div>

      {/* Geolocation status */}
      {geoLoading && (
        <div className="absolute left-4 top-4 z-30 bg-white/80 backdrop-blur-sm rounded-md px-3 py-2 text-sm text-gray-700 shadow-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700 mr-2"></div>
            Getting your location...
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemMap;
