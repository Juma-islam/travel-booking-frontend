export interface DestinationRef {
  _id: string;
  name: string;
  country: string;
  description?: string;
}

export interface PackageReview {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

export interface TravelPackage {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: { days: number; nights: number };
  images: string[];
  inclusions: string[];
  exclusions: string[];
  category: string;
  rating: number;
  numReviews: number;
  destination?: DestinationRef;
  isPopular?: boolean;
  reviews?: PackageReview[];
  // New fields
  maxGuests?: number;
  bookedSlots?: number;
  isAvailable?: boolean;
  host?: {
    name: string;
    avatar?: string;
    bio?: string;
    responseRate?: number;
    totalTours?: number;
    joinedYear?: number;
  };
  cancellationPolicy?: 'flexible' | 'moderate' | 'strict';
  coordinates?: { lat: number; lng: number };
  faqs?: { question: string; answer: string }[];
  createdAt?: string;
}

export interface PackageListResponse {
  packages: TravelPackage[];
  page: number;
  pages: number;
  total: number;
}
