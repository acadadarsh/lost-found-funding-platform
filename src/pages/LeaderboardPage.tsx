
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Leaderboard from "@/components/user/Leaderboard";
import { mockUsers } from "@/lib/mockData";

const LeaderboardPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Leaderboard users={mockUsers} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
