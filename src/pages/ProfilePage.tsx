
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserProfile from "@/components/user/UserProfile";
import { mockUsers, mockItems } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ItemType, UserType } from "@/lib/types";

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [userItems, setUserItems] = useState<ItemType[]>([]);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Format profile data to match UserType
        if (profile) {
          setUserProfile({
            id: profile.id,
            name: profile.full_name || profile.username || user.email?.split('@')[0] || "User",
            email: user.email || "",
            image: profile.avatar_url,
            trustScore: profile.trust_score || 0,
            itemsFound: profile.items_found || 0,
            itemsLost: profile.items_lost || 0,
            itemsReturned: profile.items_returned || 0,
            itemsResolved: profile.items_resolved || 0
          });
        }
        
        // Fetch user's items from Supabase
        let query = supabase
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
            user_id
          `)
          .eq('user_id', user.id);

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to match ItemType format
        const formattedItems = data?.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          status: item.status as "lost" | "found" | "resolved",
          imageUrl: item.image_url,
          location: {
            address: item.location_address || "",
            lat: parseFloat(String(item.location_lat)) || 0,
            lng: parseFloat(String(item.location_lng)) || 0,
          },
          reward: item.reward,
          totalContributions: item.total_contributions,
          date: item.date || new Date().toISOString(),
          userId: item.user_id,
          userName: profile?.full_name || profile?.username || user.email?.split('@')[0] || "User",
          userImage: profile?.avatar_url,
          userTrustScore: profile?.trust_score || 0,
        })) || [];

        setUserItems(formattedItems);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Using mock data instead.",
          variant: "destructive",
        });
        
        // Use mock data as fallback
        const mockUser = mockUsers[0];
        setUserProfile(mockUser);
        setUserItems(mockItems.filter(item => item.userId === mockUser.id));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, profile, toast]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {userProfile && (
            <UserProfile user={userProfile} userItems={userItems} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
