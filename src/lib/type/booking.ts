export type TBookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export type TBookingUser = {
  name: string;
  email: string;
};

export type TBooking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  imageUrl?: string;
  location?: string;

  date: string;
  startTime: string;
  duration: number;
  crewCount: number;
  notes?: string;

  price: number;
  deposit: number;
  subtotal: number;
  total: number;
  currency: string;
  priceUnit: string;

  status: TBookingStatus;

  user: TBookingUser;
};

// Shape sent to the API when a new booking is created.
export type TBookingPayload = Omit<
  TBooking,
  "_id" | "imageUrl" | "location" | "status"
>;
