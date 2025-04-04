
import { ItemType, UserType } from './types';

export const mockUsers: UserType[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    image: 'https://i.pravatar.cc/150?img=1',
    trustScore: 95,
    itemsFound: 12,
    itemsReturned: 10,
    itemsLost: 3,
    itemsResolved: 3
  },
  {
    id: 'user2',
    name: 'Casey Smith',
    email: 'casey@example.com',
    image: 'https://i.pravatar.cc/150?img=2',
    trustScore: 88,
    itemsFound: 7,
    itemsReturned: 7,
    itemsLost: 2,
    itemsResolved: 2
  },
  {
    id: 'user3',
    name: 'Taylor Wright',
    email: 'taylor@example.com',
    image: 'https://i.pravatar.cc/150?img=3',
    trustScore: 92,
    itemsFound: 9,
    itemsReturned: 8,
    itemsLost: 1,
    itemsResolved: 1
  },
  {
    id: 'user4',
    name: 'Jordan Miller',
    email: 'jordan@example.com',
    image: 'https://i.pravatar.cc/150?img=4',
    trustScore: 85,
    itemsFound: 5,
    itemsReturned: 4,
    itemsLost: 3,
    itemsResolved: 2
  },
  {
    id: 'user5',
    name: 'Riley Garcia',
    email: 'riley@example.com',
    image: 'https://i.pravatar.cc/150?img=5',
    trustScore: 90,
    itemsFound: 8,
    itemsReturned: 7,
    itemsLost: 2,
    itemsResolved: 1
  }
];

export const mockItems: ItemType[] = [
  {
    id: 'item1',
    title: 'Lost Gold Watch',
    description: 'Vintage gold watch, family heirloom. Lost in Central Park near the boathouse on Saturday afternoon.',
    status: 'lost',
    imageUrl: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      address: 'Central Park, New York, NY',
      lat: 40.7812,
      lng: -73.9665
    },
    reward: 200,
    totalContributions: 50,
    date: '2023-03-15',
    userId: 'user1',
    userName: 'Alex Johnson',
    userImage: 'https://i.pravatar.cc/150?img=1',
    userTrustScore: 95
  },
  {
    id: 'item2',
    title: 'Found iPhone 13',
    description: 'Found an iPhone 13 Pro Max in a blue case at the Starbucks on Main Street.',
    status: 'found',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      address: '123 Main St, Anytown, USA',
      lat: 40.7580,
      lng: -73.9855
    },
    date: '2023-03-17',
    userId: 'user2',
    userName: 'Casey Smith',
    userImage: 'https://i.pravatar.cc/150?img=2',
    userTrustScore: 88
  },
  {
    id: 'item3',
    title: 'Lost Backpack',
    description: 'Black North Face backpack with laptop and textbooks inside. Lost on the subway.',
    status: 'lost',
    imageUrl: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      address: 'Union Square Station, New York, NY',
      lat: 40.7359,
      lng: -73.9911
    },
    reward: 100,
    totalContributions: 25,
    date: '2023-03-16',
    userId: 'user3',
    userName: 'Taylor Wright',
    userImage: 'https://i.pravatar.cc/150?img=3',
    userTrustScore: 92
  },
  {
    id: 'item4',
    title: 'Found Keys',
    description: 'Set of keys with a red keychain and about 5 keys. Found in the park near the fountain.',
    status: 'found',
    imageUrl: 'https://images.unsplash.com/photo-1582550945154-66869ebd8744?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      address: 'Washington Square Park, New York, NY',
      lat: 40.7308,
      lng: -73.9973
    },
    date: '2023-03-18',
    userId: 'user4',
    userName: 'Jordan Miller',
    userImage: 'https://i.pravatar.cc/150?img=4',
    userTrustScore: 85
  },
  {
    id: 'item5',
    title: 'Lost Wallet',
    description: 'Brown leather wallet with ID and credit cards. Lost near the library.',
    status: 'resolved',
    imageUrl: 'https://images.unsplash.com/photo-1627843240167-b1f9ede51a11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      address: 'Public Library, Anytown, USA',
      lat: 40.7528,
      lng: -73.9725
    },
    reward: 50,
    totalContributions: 0,
    date: '2023-03-10',
    userId: 'user5',
    userName: 'Riley Garcia',
    userImage: 'https://i.pravatar.cc/150?img=5',
    userTrustScore: 90
  },
  {
    id: 'item6',
    title: 'Found Sunglasses',
    description: 'Designer sunglasses found on the beach near pier 4.',
    status: 'found',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      address: 'Brighton Beach, Brooklyn, NY',
      lat: 40.5762,
      lng: -73.9646
    },
    date: '2023-03-19',
    userId: 'user1',
    userName: 'Alex Johnson',
    userImage: 'https://i.pravatar.cc/150?img=1',
    userTrustScore: 95
  },
  {
    id: 'item7',
    title: 'Lost Camera',
    description: 'DSLR Camera with case. Contains important family photos. Last had it at the museum.',
    status: 'lost',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      address: 'Metropolitan Museum of Art, New York, NY',
      lat: 40.7794,
      lng: -73.9632
    },
    reward: 150,
    totalContributions: 75,
    date: '2023-03-14',
    userId: 'user2',
    userName: 'Casey Smith',
    userImage: 'https://i.pravatar.cc/150?img=2',
    userTrustScore: 88
  },
  {
    id: 'item8',
    title: 'Found Umbrella',
    description: 'Black umbrella with wooden handle left at the coffee shop.',
    status: 'found',
    imageUrl: 'https://images.unsplash.com/photo-1517686748843-bb360cfc62b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      address: 'The Coffee Bean, Anytown, USA',
      lat: 40.7420,
      lng: -73.9890
    },
    date: '2023-03-20',
    userId: 'user3',
    userName: 'Taylor Wright',
    userImage: 'https://i.pravatar.cc/150?img=3',
    userTrustScore: 92
  }
];
