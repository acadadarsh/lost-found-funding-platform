
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ItemDetail from "@/components/items/ItemDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ItemType } from "@/lib/types";
import { mockItems } from "@/lib/mockData";

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, we would fetch from an API
    // For now, simulate loading and use mock data
    setLoading(true);
    setTimeout(() => {
      const foundItem = mockItems.find(item => item.id === id);
      
      if (foundItem) {
        setItem(foundItem);
        setError(null);
      } else {
        setError("Item not found");
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

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
