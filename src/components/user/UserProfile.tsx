
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ItemCard from "@/components/items/ItemCard";
import { ItemType, UserType } from "@/lib/types";
import { Award, MapPin, Package } from "lucide-react";

type UserProfileProps = {
  user: UserType;
  userItems: ItemType[];
};

const UserProfile = ({ user, userItems }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredItems = userItems.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center">
          <Avatar className="h-20 w-20 border-4 border-white shadow">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">Member since April 2023</p>
          </div>
        </div>
        <Button>Edit Profile</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Items Posted</p>
              <p className="text-2xl font-bold">{user.itemsLost + user.itemsFound}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-found-light p-3 rounded-full mr-4">
              <MapPin className="h-6 w-6 text-found" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Items Returned</p>
              <p className="text-2xl font-bold">{user.itemsReturned}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Trust Score</p>
              <p className="text-2xl font-bold">{user.trustScore}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Your Items</h2>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
            <TabsTrigger value="found">Found</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No {activeTab !== "all" ? activeTab : ""} items found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
