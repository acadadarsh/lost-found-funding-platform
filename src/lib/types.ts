
export type ItemStatus = 'lost' | 'found' | 'resolved';

export type ItemType = {
  id: string;
  title: string;
  description: string;
  status: ItemStatus;
  imageUrl?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  reward?: number;
  totalContributions?: number;
  date: string;
  userId: string;
  userName: string;
  userImage?: string;
  userTrustScore: number;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string;
  trustScore: number;
  itemsFound: number;
  itemsReturned: number;
  itemsLost: number;
  itemsResolved: number;
};

export type FilterOptions = {
  status?: ItemStatus | 'all';
  searchQuery?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  rewardMin?: number;
  rewardMax?: number;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in kilometers
  };
};
