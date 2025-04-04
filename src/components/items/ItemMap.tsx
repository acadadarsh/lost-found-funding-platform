
import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { ItemType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    // In a real implementation, we would initialize the map here
    // For now, we'll just simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (item: ItemType) => {
    setSelectedItem(item);
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
    </div>
  );
};

export default ItemMap;
