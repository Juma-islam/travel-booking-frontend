export interface DestinationRef {
  _id: string;
  name: string;
  country: string;
  description?: string;
}

export interface TravelPackage {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: {
    days: number;
    nights: number;
  };
  images: string[];
  inclusions: string[];
  exclusions: string[];
  category: string;
  rating: number;
  numReviews: number;
  destination?: DestinationRef;
  isPopular?: boolean;
}

export interface PackageListResponse {
  packages: TravelPackage[];
  page: number;
  pages: number;
  total: number;
}
