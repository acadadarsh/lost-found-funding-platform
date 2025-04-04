import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, ThumbsUp } from "lucide-react";
import { UserType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

type LeaderboardProps = {
  users: UserType[];
};

const Leaderboard = ({ users }: LeaderboardProps) => {
  // Sort users by trust score descending
  const sortedUsers = [...users].sort((a, b) => b.trustScore - a.trustScore);
  
  const getPositionStyle = (position: number) => {
    switch (position) {
      case 0: // 1st place
        return {
          icon: <Trophy className="h-6 w-6 text-yellow-500" />,
          badge: "bg-gradient-to-r from-yellow-500 to-amber-400"
        };
      case 1: // 2nd place
        return {
          icon: <Trophy className="h-6 w-6 text-gray-400" />,
          badge: "bg-gradient-to-r from-gray-400 to-gray-300"
        };
      case 2: // 3rd place
        return {
          icon: <Trophy className="h-6 w-6 text-amber-700" />,
          badge: "bg-gradient-to-r from-amber-700 to-amber-600"
        };
      default:
        return {
          icon: <Award className="h-6 w-6 text-primary" />,
          badge: "bg-primary"
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Community Leaderboard</h1>
        <p className="text-gray-500 mt-2">Recognizing our most helpful community members</p>
      </div>
      
      {/* Top 3 users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedUsers.slice(0, 3).map((user, index) => {
          const style = getPositionStyle(index);
          
          return (
            <Card key={user.id} className="overflow-hidden">
              <div className={`h-2 ${style.badge}`}></div>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-white shadow">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
                      {style.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mt-3">{user.name}</h3>
                  <div className="flex items-center mt-1">
                    <ThumbsUp className="h-4 w-4 text-primary mr-1" />
                    <span className="font-semibold">{user.trustScore}% Trust Score</span>
                  </div>
                  <div className="border-t w-full mt-4 pt-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Items Returned</p>
                        <p className="font-bold text-lg">{user.itemsReturned}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Items Found</p>
                        <p className="font-bold text-lg">{user.itemsFound}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Other users */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Returned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Found</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedUsers.slice(3).map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 4}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 text-primary mr-1" />
                      <span className="text-sm text-gray-900">{user.trustScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.itemsReturned}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.itemsFound}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
