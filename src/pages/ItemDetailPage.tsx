
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ItemDetail from "@/components/items/ItemDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ItemType } from "@/lib/types";
import { mockItems } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      
      try {
        // Try to fetch from Supabase first
        if (id) {
          const { data, error } = await supabase
            .from('items')
            .select(`
              id,
              title,
              description,
              status,
              image_url,
              location_address,
              location_lat,
              location_lng,
              reward,
              total_contributions,
              date,
              user_id,
              profiles(full_name, avatar_url, trust_score)
            `)
            .eq('id', id)
            .single();

          if (data && !error) {
            // Format data to match ItemType
            const formattedItem: ItemType = {
              id: data.id,
              title: data.title,
              description: data.description || '',
              status: data.status as ItemType['status'],
              imageUrl: data.image_url || undefined,
              location: {
                address: data.location_address || '',
                lat: data.location_lat || 0,
                lng: data.location_lng || 0,
              },
              reward: data.reward || undefined,
              totalContributions: data.total_contributions || undefined,
              date: data.date || new Date().toISOString(),
              userId: data.user_id,
              userName: data.profiles?.full_name || 'Anonymous',
              userImage: data.profiles?.avatar_url,
              userTrustScore: data.profiles?.trust_score || 50,
            };
            
            setItem(formattedItem);
            setError(null);
            console.log("Item loaded from database:", formattedItem);
            return;
          }
        }
        
        // Fallback to mock data
        console.log("Falling back to mock data");
        const foundItem = mockItems.find(item => item.id === id);
        
        if (foundItem) {
          setItem(foundItem);
          setError(null);
        } else {
          setError("Item not found");
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Error loading item");
        toast({
          title: "Error",
          description: "Failed to load item details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            size="sm"
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          {loading ? (
            <div className="bg-white shadow-sm rounded-lg p-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-white shadow-sm rounded-lg p-12 text-center">
              <h2 className="text-xl font-medium text-gray-900">
                {error}
              </h2>
              <p className="mt-2 text-gray-500">
                The item you're looking for doesn't exist or has been removed.
              </p>
              <Button className="mt-6" onClick={() => navigate("/items")}>
                Browse Items
              </Button>
            </div>
          ) : item && (
            <ItemDetail item={item} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ItemDetailPage;
