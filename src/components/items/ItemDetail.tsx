
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, DollarSign, MessageSquare, Share2, Flag, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ItemType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type ItemDetailProps = {
  item: ItemType;
};

const ItemDetail = ({ item }: ItemDetailProps) => {
  const { toast } = useToast();
  const [contributionAmount, setContributionAmount] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFoundClick = () => {
    toast({
      title: "Success!",
      description: "Your claim has been sent to the item owner.",
    });
  };

  const handleContribute = () => {
    toast({
      title: "Thank you!",
      description: `You've contributed $${contributionAmount} to the reward.`,
    });
    setIsDialogOpen(false);
  };

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

  const progressPercentage = item.totalContributions && item.reward 
    ? Math.min(100, (item.totalContributions / item.reward) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="p-6 md:w-1/2">
          <div className="flex items-center justify-between mb-4">
            <Badge className={`${statusColors[item.status].bg}`}>
              {statusColors[item.status].text}
            </Badge>
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">{item.title}</h1>

          <div className="space-y-3 text-gray-600 mb-6">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{item.location.address}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="border-t border-b py-4 mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>

          <div className="flex items-center mb-6">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={item.userImage} />
              <AvatarFallback>
                {item.userName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{item.userName}</p>
              <div className="flex items-center text-sm text-gray-500">
                <ThumbsUp className="h-3 w-3 mr-1" />
                <span>Trust Score: {item.userTrustScore}%</span>
              </div>
            </div>
          </div>

          {item.status === "lost" && (
            <div className="space-y-4">
              {item.reward && (
                <div className="bg-amber-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-lost mr-1" />
                      <span className="font-semibold text-lost">Reward: ${item.reward}</span>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">Contribute</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contribute to Reward</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p>Increase the reward to help {item.userName} get their item back.</p>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Amount</label>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                              <Input
                                type="number"
                                min={1}
                                value={contributionAmount}
                                onChange={(e) => setContributionAmount(Number(e.target.value))}
                              />
                            </div>
                          </div>
                          <Button onClick={handleContribute} className="w-full">
                            Contribute ${contributionAmount}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {item.totalContributions && item.reward && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          ${item.totalContributions} contributed of ${item.reward}
                        </span>
                        <span>{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <Button onClick={handleFoundClick} className="flex-1 bg-found hover:bg-found/90">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  I Found This Item!
                </Button>
                <Button variant="outline" className="flex-1">
                  Share This Post
                </Button>
              </div>
            </div>
          )}

          {item.status === "found" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-md">
                <p className="text-found font-medium">
                  Is this your lost item? Contact the finder to claim it!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <Button className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  This Is My Item!
                </Button>
                <Button variant="outline" className="flex-1">
                  Share This Post
                </Button>
              </div>
            </div>
          )}

          {item.status === "resolved" && (
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-gray-600 font-medium">
                This item has been returned to its owner!
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 bg-gray-50 border-t">
        <h3 className="font-semibold mb-4">Item Location</h3>
        <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
          {/* Placeholder for the map */}
          <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7590,-73.969&zoom=15&size=600x300&scale=2&markers=color:red%7C40.7590,-73.969&key=DEMO_KEY')] bg-cover bg-center"></div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
