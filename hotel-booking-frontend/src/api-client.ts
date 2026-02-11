import axiosInstance from "./lib/api-client";
import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  HotelSearchResponse,
  HotelType,
  PaymentIntentResponse,
  UserType,
  HotelWithBookingsType,
  BookingType,
  ReviewType,
  MessageType,
} from "../../shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
import { queryClient } from "./main";

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await axiosInstance.get("/api/users/me");
  return response.data;
};

export const updateCurrentUser = async (userData: Partial<UserType>): Promise<UserType> => {
  const response = await axiosInstance.put("/api/users/me", userData);
  return response.data;
};

export const register = async (formData: RegisterFormData) => {
  const response = await axiosInstance.post("/api/auth/register", formData);

  // Store JWT token from response body in sessionStorage
  const token = response.data?.token;
  if (token) {
    sessionStorage.setItem("session_id", token);
    console.log("JWT token stored in sessionStorage after registration");
  }

  // Store user info for incognito mode fallback
  if (response.data?.userId) {
    sessionStorage.setItem("user_id", response.data.userId);
  }

  return response.data;
};

export const signIn = async (formData: SignInFormData) => {
  const response = await axiosInstance.post("/api/auth/login", formData);

  // Store JWT token from response body in sessionStorage
  const token = response.data?.token;
  if (token) {
    sessionStorage.setItem("session_id", token);
    console.log("JWT token stored in sessionStorage for session-only persistence");
  }

  // Store user info for incognito mode fallback
  if (response.data?.userId) {
    sessionStorage.setItem("user_id", response.data.userId);
    console.log("User ID stored in sessionStorage for fallback");
  }

  // Force validate token after successful login to update React Query cache
  try {
    const validationResult = await validateToken();
    console.log("Token validation after login:", validationResult);

    // Invalidate and refetch the validateToken query to update the UI
    queryClient.invalidateQueries("validateToken");

    // Force a refetch to ensure the UI updates
    await queryClient.refetchQueries("validateToken");
  } catch (error) {
    console.log("Token validation failed after login, but continuing...");

    // Even if validation fails, if we have a token stored, consider it a success for incognito mode
    if (sessionStorage.getItem("session_id")) {
      console.log("Incognito mode detected - using stored token as fallback");
    }
  }

  return response.data;
};

export const validateToken = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/validate-token");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Not logged in, throw error so React Query knows it failed
      throw new Error("Token invalid");
    }
    // For any other error (network, etc.), also throw
    throw new Error("Token validation failed");
  }
};

export const signOut = async () => {
  const response = await axiosInstance.post("/api/auth/logout");

  // Clear storage (JWT tokens)
  localStorage.removeItem("session_id");
  localStorage.removeItem("user_id");
  sessionStorage.removeItem("session_id");
  sessionStorage.removeItem("user_id");

  return response.data;
};

// Development utility to clear all browser storage
export const clearAllStorage = () => {
  // Clear localStorage
  localStorage.clear();
  // Clear sessionStorage
  sessionStorage.clear();
  // Clear cookies (by setting them to expire in the past)
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await axiosInstance.post("/api/my-hotels", hotelFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await axiosInstance.get("/api/my-hotels");
  return response.data;
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await axiosInstance.get(`/api/my-hotels/${hotelId}`);
  return response.data;
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const hotelId = hotelFormData.get("hotelId");
  const response = await axiosInstance.put(
    `/api/my-hotels/${hotelId}`,
    hotelFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export type SearchParams = {
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
};

export const searchHotels = async (
  searchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();

  // Only add destination if it's not empty
  if (searchParams.destination && searchParams.destination.trim() !== "") {
    queryParams.append("destination", searchParams.destination.trim());
  }

  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");
  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await axiosInstance.get(`/api/hotels?${queryParams}`);
  return response.data;
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await axiosInstance.get("/api/hotels");
  return response.data.data;
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await axiosInstance.get(`/api/hotels/${hotelId}`);
  return response.data;
};

export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const response = await axiosInstance.post(
    `/api/hotels/${hotelId}/bookings/payment-intent`,
    { numberOfNights }
  );
  return response.data;
};

export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await axiosInstance.post(
    `/api/hotels/${formData.hotelId}/bookings`,
    formData
  );
  return response.data;
};

export const fetchMyBookings = async (): Promise<HotelWithBookingsType[]> => {
  const response = await axiosInstance.get("/api/my-bookings");
  return response.data;
};

export const fetchHotelBookings = async (
  hotelId: string
): Promise<BookingType[]> => {
  const response = await axiosInstance.get(`/api/bookings/hotel/${hotelId}`);
  return response.data;
};

// Business Insights API functions
export const fetchBusinessInsightsDashboard = async () => {
  const response = await axiosInstance.get("/api/business-insights/dashboard");
  return response.data;
};

export const fetchBusinessInsightsForecast = async () => {
  const response = await axiosInstance.get("/api/business-insights/forecast");
  return response.data;
};

export const fetchBusinessInsightsPerformance = async () => {
  const response = await axiosInstance.get(
    "/api/business-insights/performance"
  );
  return response.data;
};

// Review API functions
export const fetchHotelReviews = async (hotelId: string): Promise<ReviewType[]> => {
  const response = await axiosInstance.get(`/api/reviews/hotel/${hotelId}`);
  return response.data;
};

export const createReview = async (reviewFormData: any) => {
  const response = await axiosInstance.post("/api/reviews", reviewFormData);
  return response.data;
};

export const fetchAdminUsers = async (): Promise<UserType[]> => {
  const response = await axiosInstance.get("/api/admin/users");
  return response.data;
};

export const fetchAdminStats = async () => {
  const response = await axiosInstance.get("/api/admin/stats");
  return response.data;
};

export const fetchAdminHotels = async (): Promise<HotelType[]> => {
  const response = await axiosInstance.get("/api/admin/hotels");
  return response.data;
};

export const deleteAdminUser = async (userId: string) => {
  const response = await axiosInstance.delete(`/api/admin/users/${userId}`);
  return response.data;
};

export const updateAdminUserRole = async (userId: string, role: string) => {
  const response = await axiosInstance.patch(`/api/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteAdminHotel = async (hotelId: string) => {
  const response = await axiosInstance.delete(`/api/admin/hotels/${hotelId}`);
  return response.data;
};

export const fetchInbox = async (): Promise<MessageType[]> => {
  const response = await axiosInstance.get("/api/messages/inbox");
  return response.data;
};

export const fetchUnreadCount = async (): Promise<{ count: number }> => {
  const response = await axiosInstance.get("/api/messages/unread-count");
  return response.data;
};

export const sendMessage = async (messageData: { receiverEmail: string; subject: string; content: string }) => {
  const response = await axiosInstance.post("/api/messages/send", messageData);
  return response.data;
};

export const markAsRead = async (messageId: string) => {
  const response = await axiosInstance.patch(`/api/messages/${messageId}/read`);
  return response.data;
};

export const deleteMessage = async (messageId: string) => {
  const response = await axiosInstance.delete(`/api/messages/${messageId}`);
  return response.data;
};

export const sendBookingNotification = async (notificationData: {
  hotelOwnerId: string;
  hotelName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  phone?: string;
  specialRequests?: string;
}) => {
  const response = await axiosInstance.post("/api/messages/send-booking-notification", notificationData);
  return response.data;
};
