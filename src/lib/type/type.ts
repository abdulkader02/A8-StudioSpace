export type TStudio = {
  _id: string;
  title: string;
  category: string;
  price: number;
  priceUnit: string;
  currency: string;
  capacity: number;
  securityDeposit: number;

  location: {
    city: string;
    area: string;
  };

  imageUrls: string[];
  /** Legacy single-image field still present on some older documents. */
  imageUrl?: string;
  amenities: string[];
  description: string;
  rating: number;

  // Host information
  host?: {
    name?: string;
    email?: string;
    image?: string;
    bio?: string;
  };

  // Reviews
  reviews?: {
    _id?: string;
    name: string;
    image?: string;
    rating: number;
    comment: string;
    createdAt?: string;
  }[];

  isPublished: boolean;
  isFeatured: boolean;
};