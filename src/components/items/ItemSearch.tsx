
import { useState } from "react";
import { SearchIcon, MapPinIcon, CalendarIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

type ItemSearchProps = {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
};

const ItemSearch = ({ onSearch, onFilterChange }: ItemSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    rewardRange: [0, 500],
    dateRange: "any",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSearch} className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <FilterIcon className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Item Status</h4>
                  <RadioGroup
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange("status", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">All Items</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lost" id="lost" />
                      <Label htmlFor="lost">Lost Items</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="found" id="found" />
                      <Label htmlFor="found">Found Items</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="resolved" id="resolved" />
                      <Label htmlFor="resolved">Resolved Items</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Reward Range</h4>
                    <span className="text-sm text-gray-500">
                      ${filters.rewardRange[0]} - ${filters.rewardRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={filters.rewardRange}
                    min={0}
                    max={500}
                    step={10}
                    onValueChange={(value) => handleFilterChange("rewardRange", value)}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Date Range</h4>
                  <RadioGroup
                    value={filters.dateRange}
                    onValueChange={(value) => handleFilterChange("dateRange", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="any-time" />
                      <Label htmlFor="any-time">Any Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="today" id="today" />
                      <Label htmlFor="today">Today</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="week" id="week" />
                      <Label htmlFor="week">This Week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="month" id="month" />
                      <Label htmlFor="month">This Month</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={() => onFilterChange(filters)}>Apply Filters</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>Location</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Search Near Location</h4>
                <Input type="text" placeholder="Enter address, city, or postal code" />
                <div className="space-y-2">
                  <h4 className="font-medium">Distance</h4>
                  <RadioGroup defaultValue="5km" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1km" id="1km" />
                      <Label htmlFor="1km">1 km</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5km" id="5km" />
                      <Label htmlFor="5km">5 km</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10km" id="10km" />
                      <Label htmlFor="10km">10 km</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="25km" id="25km" />
                      <Label htmlFor="25km">25 km</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button>Apply Location</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Select Date Range</h4>
                <div className="grid gap-2">
                  <Label htmlFor="from">From</Label>
                  <Input type="date" id="from" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to">To</Label>
                  <Input type="date" id="to" />
                </div>
                <Button>Apply Dates</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit">Search</Button>
      </form>
    </div>
  );
};

export default ItemSearch;
