
import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation } from "lucide-react";
import { ItemType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";

// This is a mock implementation since we can't use actual Google Maps
// In a real implementation, you would integrate Google Maps or another map provider

type ItemMapProps = {
  items: ItemType[];
  center?: { lat: number; lng: number };
  zoom?: number;
};

const ItemMap = ({ items, center, zoom = 13 }: ItemMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { position, loading: geoLoading, error: geoError } = useGeolocation();
  const { toast } = useToast();

  useEffect(() => {
    // In a real implementation, we would initialize the map here
    // For now, we'll just simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (position && !geoLoading && !geoError) {
      // In a real implementation, we would center the map on the user's location
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
    
    // In a real implementation, we would center the map on the user's location
    toast({
      title: "Map centered",
      description: "Map centered on your current location",
    });
  };

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border">
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        {!mapLoaded && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
        
        {mapLoaded && (
          <div 
            ref={mapRef} 
            className="w-full h-full relative bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7590,-73.969&zoom=12&size=600x600&scale=2&key=DEMO_KEY')] bg-cover bg-center"
          >
            {/* Current user location marker */}
            {position && (
              <div 
                className="absolute z-40 animate-pulse"
                style={{
                  top: `50%`,
                  left: `50%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <div className="p-2 rounded-full bg-blue-500 border-2 border-white shadow-lg">
                  <Navigation size={20} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
              </div>
            )}
            
            {/* Mock map markers */}
            {items.map((item) => (
              <div
                key={item.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                  selectedItem?.id === item.id ? "scale-125 z-30" : "z-20"
                }`}
                style={{
                  top: `${Math.random() * 70 + 15}%`,
                  left: `${Math.random() * 70 + 15}%`,
                }}
                onClick={() => handleMarkerClick(item)}
              >
                <div className={`p-1 rounded-full 
                  ${item.status === 'lost' ? 'bg-lost text-white' :
                    item.status === 'found' ? 'bg-found text-white' : 
                    'bg-gray-500 text-white'}`}
                >
                  <MapPin size={20} />
                </div>
              </div>
            ))}
            
            {/* Info window */}
            {selectedItem && (
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
            )}
          </div>
        )}
      </div>

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
