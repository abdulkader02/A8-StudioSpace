export type TStudio = {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  price: number;
  priceUnit?: string;
  currency?: string;
  capacity: number;
  securityDeposit?: number;
  location?: {
    city?: string;
    area?: string;
  };
  imageUrl?: string;
  amenities?: string[];
  description?: string;
  rating?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
};