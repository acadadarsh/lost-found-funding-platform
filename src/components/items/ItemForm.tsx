
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Upload, DollarSign, Navigation } from "lucide-react";
import { ItemStatus } from "@/lib/types";
import { useGeolocation } from "@/hooks/useGeolocation";

const ItemForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { position, address, loading: geoLoading } = useGeolocation();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "lost" as ItemStatus,
    location: "",
    locationLat: 0,
    locationLng: 0,
    reward: 0,
    image: null as File | null,
  });

  // Update location when geolocation changes
  useEffect(() => {
    if (position && address && !formData.location) {
      setFormData(prev => ({
        ...prev,
        location: address,
        locationLat: position.lat,
        locationLng: position.lng
      }));
    }
  }, [position, address, formData.location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: ItemStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!position || !address) {
      toast({
        title: "Location not available",
        description: "Please wait for your location to be determined or enter it manually.",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      location: address,
      locationLat: position.lat,
      locationLng: position.lng
    }));
    
    toast({
      title: "Current location used",
      description: "Your current location has been added to the form.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real implementation, we would submit to an API
      // For now, we'll just simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: `Your ${formData.status} item has been posted.`,
      });
      
      // Navigate to items page
      navigate("/items");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="status">Item Status*</Label>
          <RadioGroup
            value={formData.status}
            onValueChange={handleStatusChange}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lost" id="lost" />
              <Label htmlFor="lost" className="text-lost font-medium">Lost Item</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="found" id="found" />
              <Label htmlFor="found" className="text-found font-medium">Found Item</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="title">Title*</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Lost Gold Watch, Found Black Backpack"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description*</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide details about the item, when and where it was lost/found, distinctive features, etc."
            rows={4}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="location">Location*</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading || !position}
            >
              {geoLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                  Getting location...
                </>
              ) : (
                <>
                  <Navigation size={12} className="mr-1" />
                  Use My Location
                </>
              )}
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter address or location description"
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use specific locations to help others find or identify your item
          </p>
        </div>

        {formData.status === "lost" && (
          <div>
            <Label htmlFor="reward">Reward (optional)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="reward"
                name="reward"
                type="number"
                min={0}
                value={formData.reward}
                onChange={handleChange}
                placeholder="Enter reward amount"
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Offering a reward increases the chance of getting your item back
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="image">Upload Image (optional)</Label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: null }));
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => document.getElementById("image")?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span> Submitting...
            </>
          ) : (
            "Post Item"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
