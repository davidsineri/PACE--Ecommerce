export interface Accommodation {
  id: string;
  name: string;
  location: string;
  description: string;
  image_url: string;
  category: 'Hotel' | 'Resort' | 'Villa' | 'Homestay';
  price: number;
  rating: number;
  reviews: number;
  facilities: string[];
  isInstantConfirmation?: boolean;
  isFreeCancellation?: boolean;
}

export const accommodations: Accommodation[] = [
  {
    id: 'meridien-adventure-marina',
    name: 'Meridien Adventure Marina Club',
    location: 'Waisai, Raja Ampat',
    description: 'Resort ramah lingkungan dengan fasilitas diving kelas dunia.',
    image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1920&auto=format&fit=crop',
    category: 'Resort',
    price: 3500000,
    rating: 4.8,
    reviews: 450,
    facilities: ['WiFi', 'AC', 'Pool', 'Restaurant', 'Diving Center'],
    isInstantConfirmation: true,
    isFreeCancellation: true
  },
  {
    id: 'swiss-belhotel-papua',
    name: 'Swiss-Belhotel Papua',
    location: 'Jayapura, Papua',
    description: 'Hotel bintang 4 dengan pemandangan Teluk Jayapura yang menawan.',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop',
    category: 'Hotel',
    price: 1200000,
    rating: 4.5,
    reviews: 1200,
    facilities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant'],
    isInstantConfirmation: true
  },
  {
    id: 'baliem-valley-resort',
    name: 'The Baliem Valley Resort',
    location: 'Wamena, Papua Pegunungan',
    description: 'Resort unik dengan arsitektur tradisional di tengah Lembah Baliem.',
    image_url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1920&auto=format&fit=crop',
    category: 'Resort',
    price: 2800000,
    rating: 4.7,
    reviews: 280,
    facilities: ['Restaurant', 'Garden', 'Trekking Guide', 'Airport Shuttle'],
    isInstantConfirmation: false
  },
  {
    id: 'homestay-arborek',
    name: 'Arborek Homestay',
    location: 'Pulau Arborek, Raja Ampat',
    description: 'Pengalaman menginap otentik bersama masyarakat lokal di desa wisata.',
    image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1920&auto=format&fit=crop',
    category: 'Homestay',
    price: 500000,
    rating: 4.9,
    reviews: 150,
    facilities: ['Breakfast', 'Snorkeling Gear', 'Beach Access'],
    isInstantConfirmation: true,
    isFreeCancellation: true
  }
];
