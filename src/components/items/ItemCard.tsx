
import { Link } from "react-router-dom";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ItemType } from "@/lib/types";

type ItemCardProps = {
  item: ItemType;
};

const ItemCard = ({ item }: ItemCardProps) => {
  const {
    id,
    title,
    imageUrl,
    status,
    location,
    date,
    userName,
    userImage,
    reward,
  } = item;

  const statusColors = {
    lost: {
      bg: "bg-lost",
      text: "Lost Item",
    },
    found: {
      bg: "bg-found",
      text: "Found Item",
    },
    resolved: {
      bg: "bg-gray-500",
      text: "Resolved",
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          className="h-48 w-full object-cover"
          src={imageUrl || "/placeholder.svg"}
          alt={title}
        />
        <Badge className={`absolute top-2 right-2 ${statusColors[status].bg}`}>
          {statusColors[status].text}
        </Badge>
      </div>
      
      <div className="p-4">
        <Link to={`/item/${id}`}>
          <h3 className="text-lg font-semibold line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <div className="mt-2 space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{location.address}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          {reward && (
            <div className="flex items-center text-lost font-medium">
              <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>Reward: ${reward}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={userImage} />
              <AvatarFallback>
                {userName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">{userName}</span>
          </div>
          
          <Button size="sm" variant="outline" className="text-xs" asChild>
            <Link to={`/item/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
