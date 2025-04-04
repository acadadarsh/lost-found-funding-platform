
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserProfile from "@/components/user/UserProfile";
import { mockUsers, mockItems } from "@/lib/mockData";

const ProfilePage = () => {
  // In a real app, we would get the current user ID from auth
  // For now, we'll use the first user in our mock data
  const currentUser = mockUsers[0];
  
  // Get items related to this user
  const userItems = mockItems.filter(item => item.userId === currentUser.id);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserProfile user={currentUser} userItems={userItems} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
