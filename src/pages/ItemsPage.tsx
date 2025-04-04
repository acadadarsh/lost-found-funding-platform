
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ItemSearch from "@/components/items/ItemSearch";
import ItemCard from "@/components/items/ItemCard";
import ItemMap from "@/components/items/ItemMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ItemType, FilterOptions } from "@/lib/types";
import { mockItems } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ItemsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
  });
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Use the real database if authenticated, otherwise use mock data
        if (user) {
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
              profiles:user_id (username, full_name, avatar_url, trust_score)
            `);

          if (error) {
            throw error;
          }

          // Transform data to match our ItemType format
          const formattedItems = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            status: item.status as "lost" | "found" | "resolved",
            imageUrl: item.image_url,
            location: {
              address: item.location_address,
              lat: parseFloat(item.location_lat),
              lng: parseFloat(item.location_lng),
            },
            reward: item.reward,
            totalContributions: item.total_contributions,
            date: item.date,
            userId: item.user_id,
            userName: item.profiles.full_name || item.profiles.username || "Anonymous",
            userImage: item.profiles.avatar_url,
            userTrustScore: item.profiles.trust_score || 0,
          }));

          setItems(formattedItems);
        } else {
          // Use mock data if not authenticated
          setItems(mockItems);
        }
      } catch (error: any) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load items. Using mock data instead.",
          variant: "destructive",
        });
        setItems(mockItems);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user, toast]);

  // Filter items based on search and filters
  const filteredItems = items.filter((item) => {
    // Filter by search query
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (filters.status && filters.status !== "all" && item.status !== filters.status) {
      return false;
    }

    // Filter by reward range if specified
    if (
      filters.rewardMin !== undefined &&
      filters.rewardMax !== undefined &&
      item.reward
    ) {
      if (item.reward < filters.rewardMin || item.reward > filters.rewardMax) {
        return false;
      }
    }

    return true;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Items</h1>
              <p className="text-gray-500">Find lost and found items in your area</p>
            </div>
            <Button asChild>
              <Link to="/create">Post an Item</Link>
            </Button>
          </div>

          <ItemSearch onSearch={handleSearch} onFilterChange={handleFilterChange} />

          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
            </p>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "map")}>
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => <ItemCard key={item.id} item={item} />)
              ) : (
                <div className="col-span-full text-center py-16">
                  <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <ItemMap items={filteredItems} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemsPage;
