
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ItemCard from "@/components/items/ItemCard";
import ItemMap from "@/components/items/ItemMap";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { mockItems } from "@/lib/mockData";

const Index = () => {
  // Get the latest items (4 of them)
  const latestItems = [...mockItems].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 4);

  // Get lost items with rewards
  const lostItemsWithRewards = mockItems
    .filter(item => item.status === 'lost' && item.reward && item.reward > 0)
    .sort((a, b) => (b.reward || 0) - (a.reward || 0))
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <HowItWorks />
        
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Latest Items</h2>
                <p className="mt-1 text-gray-500">Recently posted lost and found items</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/items">View All</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Explore Items on Map</h2>
                <p className="mt-1 text-gray-500">Find items near your location</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/items">Open Map</Link>
              </Button>
            </div>
            
            <ItemMap items={mockItems} />
          </div>
        </section>
        
        <section className="py-16 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Items with Rewards</h2>
                <p className="mt-1 text-gray-500">Help return these items and earn rewards</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/items">View All</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lostItemsWithRewards.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Ready to find your lost items?</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Join our community of helpful people working together to return lost items to their owners.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link to="/items">Browse Items</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/create">Post an Item</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
