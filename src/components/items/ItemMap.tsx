
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
        title: "LOCATION ACQUIRED",
        description: `LAT: ${position.lat.toFixed(4)}, LNG: ${position.lng.toFixed(4)}`,
      });
    }
    
    if (geoError) {
      toast({
        title: "LOCATION ERROR",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [position, geoLoading, geoError, toast]);

  const handleMarkerClick = (item: ItemType) => {
    console.log("Marker clicked in ItemMap:", item.id);
    setSelectedItem(item);
  };

  const handleCenterMap = () => {
    if (!position) {
      toast({
        title: "CANNOT CENTER",
        description: "Your location is not available",
        variant: "destructive",
      });
      return;
    }
    
    setMapCenter(position);
    
    toast({
      title: "MAP CENTERED",
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
          className="rounded-sm bg-black/70 text-white border-2 border-white/30 hover:bg-black/90 shadow-[2px_2px_0_rgba(0,0,0,0.8)]"
          onClick={handleCenterMap}
        >
          <Navigation size={18} />
        </Button>
      </div>

      {/* Geolocation status */}
      {geoLoading && (
        <div className="absolute left-4 top-4 z-30 bg-black/80 border-2 border-white/30 rounded-sm px-3 py-2 text-sm text-white font-mono shadow-md">
          <div className="flex items-center">
            <div className="pixelated-spinner w-3 h-3 mr-2"></div>
            LOCATING...
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemMap;
