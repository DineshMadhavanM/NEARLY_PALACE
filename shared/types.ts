export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "hotel_owner";
  clerkId?: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
  totalBookings?: number;
  totalSpent?: number;
  lastLogin?: Date;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserPreferences = {
  preferredDestinations: string[];
  preferredHotelTypes: string[];
  budgetRange: {
    min: number;
    max: number;
  };
};

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string[];
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  location?: Location;
  contact?: Contact;
  policies?: Policies;
  amenities?: Amenities;
  totalBookings?: number;
  totalRevenue?: number;
  averageRating?: number;
  reviewCount?: number;
  occupancyRate?: number;
  isActive?: boolean;
  isApproved?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface Location {
  latitude: number;
  longitude: number;
  address: Address;
}

export interface Contact {
  phone: string;
  email: string;
  website: string;
}

export interface Policies {
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  petPolicy: string;
  smokingPolicy: string;
}

export interface Amenities {
  parking: boolean;
  wifi: boolean;
  pool: boolean;
  gym: boolean;
  spa: boolean;
  restaurant: boolean;
  bar: boolean;
  airportShuttle: boolean;
  businessCenter: boolean;
}

export type BookingType = {
  _id: string;
  userId: string;
  hotelId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  specialRequests?: string;
  cancellationReason?: string;
  refundAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type HotelWithBookingsType = HotelType & {
  bookings: BookingType[];
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface HotelSearchParams {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
}

export interface HotelFormData {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string[];
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageFiles: any; // File[] or FileList depending on environment
}

export interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface BookingTrendData {
  date: string;
  bookings: number;
}

export interface HotelAnalytics {
  name: string;
  bookings: number;
  revenue: number;
}

export interface RatingData {
  date: string;
  rating: number;
}

export interface DestinationAnalytics {
  name: string;
  bookings: number;
  revenue: number;
}

export interface ForecastData {
  date: string;
  value: number;
}

export interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    averageRating: number;
    occupancyRate: number;
  };
  trends: {
    revenue: RevenueData[];
    bookings: BookingTrendData[];
    ratings: RatingData[];
  };
  topPerformers: {
    hotels: HotelAnalytics[];
    destinations: DestinationAnalytics[];
  };
  forecasts: {
    revenue: ForecastData[];
    bookings: ForecastData[];
  };
}

export type ReviewType = {
  _id: string;
  userId: string;
  hotelId: string;
  bookingId: string;
  rating: number;
  comment: string;
  categories: {
    cleanliness: number;
    service: number;
    location: number;
    value: number;
    amenities: number;
  };
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MessageType = {
  _id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
};

